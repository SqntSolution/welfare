package com.tf.cms.biz.common.social

import com.tf.cms.biz.common.login.CookieHelper
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URLEncoder
import java.util.*

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : naverAuthController
 * author         : 정상철
 * date           : 2025-05-23
 * description    : naver 소셜 로그인 관련
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-23        정상철       최초 생성
 */
@RestController
@RequestMapping("/api/v1/common/naver")
class NaverAuthController(
    @Value("\${naver.auth.client-id}") private val clientId: String,
    @Value("\${naver.auth.redirect-uri}") private val redirectUri: String,
    @Value("\${jwt.auth.expiration}") private val expiration: Long,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    private val naverAuthService: NaverAuthService,
) {
    @Operation(summary = "naver 로그인 URL 리턴")
    @GetMapping("/url")
    fun getNaverLoginUrl(): Map<String, String> {
        val state = UUID.randomUUID().toString()
        val url = "https://nid.naver.com/oauth2.0/authorize" +
                "?client_id=$clientId" +
                "&response_type=code" +
                "&redirect_uri=${URLEncoder.encode(redirectUri, "UTF-8")}" +
                "&state=$state"
        return mapOf("url" to url)
    }

    @Operation(summary = "naver 로그인 기능")
    @GetMapping("/login")
    fun loginWithNaver(
        @RequestParam("code") code: String,
        response: HttpServletResponse,
        request: HttpServletRequest
    ) {
        val tbJwtTokenDto = naverAuthService.loginWithNaver(request, code)
        val refreshToken = tbJwtTokenDto.refreshToken
        val accessToken = tbJwtTokenDto.accessToken
        val rememberMe = true
        val refreshExpiration = if (rememberMe) {
            expiration / 1000
        } else {
            refreshTokenExpiration / 1000
        }

        // 쿠키헬퍼
        CookieHelper.loginCookies(
            response, accessToken, accessTokenExpiration / 1000,
            refreshToken, refreshExpiration, rememberMe
        )

        logger().info("login>2>{}", UserInfoHelper.getLoginUserInfo())

        response.sendRedirect("/")
    }
}