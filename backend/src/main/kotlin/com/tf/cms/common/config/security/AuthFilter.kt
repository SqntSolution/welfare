package com.tf.cms.common.config.security

import com.tf.cms.biz.common.login.CookieHelper
import com.tf.cms.biz.common.sso.AdSSOLoginService
import com.tf.cms.biz.common.token.JwtTokenService
import com.tf.cms.common.model.SimpleAuthToken
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.utils.EncDecryptor
import com.tf.cms.common.utils.JwtTokenUtil
import com.tf.cms.common.utils.logger
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import mu.KLogger
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean

@Component
class AuthFilter(
    @Value("\${jwt.auth.secret}")
    private var authKey: String? = null,
    @Value("\${env}")
    private val env: String? = null,
    @Value("\${jwt.auth.access-token-expiration}")
    private val accessTokenExpiration: Long,
    private val adSSOLoginService: AdSSOLoginService,
    private val jwtTokenService: JwtTokenService,
) : GenericFilterBean() {

    private val theLogger: KLogger = logger()

    override fun doFilter(servletRequest: ServletRequest, servletResponse: ServletResponse, filterChain: FilterChain) {
        val request = servletRequest as HttpServletRequest
        val response = servletResponse as HttpServletResponse
        val requestURI = request.requestURI
        val session = request.session
        val jwt = this.resolveToken(request)
        val loginUserNumber = session.getAttribute(SSOConst.USER_NUMBER)?.toString()
        val referer = request.getHeader("Referer") ?: ""
        val atToken = jwt[0]  // at 쿠키 값

        // 쿠키가 전부 비어 있으면 (null이면) 비회원 처리
        if (atToken.isNullOrBlank() && SecurityContextHolder.getContext().authentication == null) {
//        if (jwt.all { it.isNullOrBlank() } && SecurityContextHolder.getContext().authentication == null) {
            val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth("visitor")
            logger().debug { "비회원간다>>${userInfo}" }
            val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
            SecurityContextHolder.getContext().authentication = authentication
        }

        //스웨거관련
        if (referer.contains("/swagger-ui.html") || referer.contains("/swagger/")) {
            val cookiePrint = getCookies(request)
            theLogger.info { "=== cookiePrint : (${cookiePrint})" }
            if (jwt[0].isNullOrBlank()) swaggerToken(response)
        }

        if (!loginUserNumber.isNullOrBlank()) {
            theLogger.info { "=== AuthFilter3 : (${requestURI}) (${loginUserNumber})" }
            /** 로그인 세션이 있는 경우 */
            // DB 조회 (캐싱)
            // cms 주석
//            val loginUserInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth(loginUserNumber)
//            SecurityContextHolder.getContext().authentication = SimpleAuthToken.fromUserInfo(loginUserInfo)
        } else {
            /** 로그인 세션이 없는 경우 */
            if ("local" == env || "dev" == env || "test" == env || "demo" == env) {
                if (jwt[0].isNullOrBlank()) {
                    theLogger.info { "=== AuthFilter4 : (${requestURI}) (${loginUserNumber})" }
                    if (!jwt[2].isNullOrBlank()) {
                        theLogger.info { "Auth : (${requestURI}) (${loginUserNumber})" }
                        val rm = jwt[2].toBoolean()
                        if (rm) {
                            theLogger.info { "rm>$rm" }
                            val rf = jwt[1]
                            val accessToken = jwtTokenService.refreshAccessToken(rf!!)
                            CookieHelper.refreshCookie(response, accessToken, accessTokenExpiration / 1000)

                            val authentication = JwtTokenUtil().getAuthentication(accessToken, authKey)
                            SecurityContextHolder.getContext().authentication = authentication
                        }
                    } else {
                        logger().debug { "Auth_None" }
                    }
                } else {
                    theLogger.info { "=== else" }
                    if (this.validateToken(jwt[0])) {
                        theLogger.info { "=== AuthFilter5 : (${requestURI}) (${loginUserNumber})" }
                        val authentication = JwtTokenUtil().getAuthentication(jwt[0], authKey)
                        if (authentication != null) {
                            SecurityContextHolder.getContext().authentication = authentication
                        } else {
                            theLogger.warn { "=== token descript fail" }
                        }
                    }
                }
            } else {
                val originPath = request.cookies?.find { it.name == "originPath" }?.value
                theLogger.info { "=== not authenticated (${requestURI}) (originPath:${originPath})" }
            }
        }

        filterChain.doFilter(servletRequest, servletResponse)
    }

    // 토큰 꺼내기
    fun resolveToken(request: HttpServletRequest): Array<String?> {
        val atFromCookie = request.cookies?.find { it.name == "at" }?.value
        val rfFromCookie = request.cookies?.find { it.name == "rf" }?.value
        val rmFromCookie = request.cookies?.find { it.name == "rm" }?.value
        val rm = if (rmFromCookie.isNullOrBlank()) { null } else { EncDecryptor.decrypt(rmFromCookie).toString() }
//        val rm = EncDecryptor.decrypt(rmFromCookie).toString()
        val emptyArray: Array<String?> = arrayOf(atFromCookie, rfFromCookie, rm)
        logger().debug { "emptyArray>>${emptyArray.contentToString()}" }
        return emptyArray
    }

    // 토큰 체크
    fun validateToken(token: String?): Boolean {
        try {
            val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
            return true
        } catch (e: Exception) {
            logger().warn { "=== access token exit. ($e)" }
        }
        return false
    }

    /**
     * name: swaggerToken
     * description: 스웨거 전용 토큰 생성
     * author: 정상철
     * created: 2025-04-29 13:51
     *
     * @return
     */
    fun swaggerToken(response: HttpServletResponse) {
        val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth("112190028")
        val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
        SecurityContextHolder.getContext().authentication = authentication
        val token = JwtTokenUtil().createToken(authentication, authKey, accessTokenExpiration)

        // token이 null인지 확인
        if (token != null) {
            // 쿠키를 설정
            theLogger.info { "토큰 생성 성공: $token" }
            val cookie = ResponseCookie.from("at", token)
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
//                .maxAge(3600)  // 쿠키 만료 시간
                .secure(false)   // HTTPS 환경에서는 true로 설정
                .build()

            // 설정된 쿠키를 응답 헤더에 추가
            response.addHeader("Set-Cookie", cookie.toString())
            theLogger.info { "쿠키 설정 완료: ${cookie.toString()}" }  //
        } else {
            theLogger.warn { "토큰 생성 실패" }
        }
    }


    /**
     * name: getCookies
     * description: 쿠키정보를 가지고 온다.
     * author: 정상철
     * created: 2025-04-29 13:51
     *
     * @return
     */
    fun getCookies(request: HttpServletRequest): String {
        val cookies = request.cookies
        val result = StringBuilder("Cookies:\n")

        if (cookies != null) {
            for (cookie in cookies) {
                result.append("Cookie Name: ${cookie.name}, Cookie Value: ${cookie.value}\n")
            }
        } else {
            result.append("No cookies found.\n")
        }

        return result.toString()
    }
}