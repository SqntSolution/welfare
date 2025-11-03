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

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : GoogleAuthController
 * author         : 정상철
 * date           : 2025-05-23
 * description    : google 소셜 로그인 관련
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-23        정상철       최초 생성
 */
@RestController
@RequestMapping("/api/v1/common/google")
class GoogleAuthController (
    @Value("\${google.auth.client-id}") private val clientId: String,
    @Value("\${google.auth.redirect-uri}") private val redirectUri: String,
    @Value("\${jwt.auth.expiration}") private val expiration: Long,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    private val googleAuthService: GoogleAuthService

) {

    @Operation(summary = "google 로그인 URL 리턴")
    @GetMapping("/url")
    fun getGoogleLoginUrl(): Map<String, String> {
        val url = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=$clientId" +
                "&redirect_uri=${URLEncoder.encode(redirectUri, "UTF-8")}" +
                "&response_type=code" +
                "&scope=${URLEncoder.encode("openid email profile", "UTF-8")}" +
                "&access_type=offline" +
                "&prompt=consent"
        return mapOf("url" to url)
    }


    @Operation(summary = "google 로그인 기능")
    @GetMapping("/login")
    fun loginWithGoogle (
        @RequestParam("code") code: String,
        response: HttpServletResponse,
        request: HttpServletRequest
    ) {
        val tbJwtTokenDto = googleAuthService.loginWithGoogle(request, code)
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