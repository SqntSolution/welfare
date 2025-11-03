package com.tf.cms.biz.common.social

import com.mysema.commons.lang.URLEncoder.encodeParam
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : KakaoAuthController
 * author         : 정상철
 * date           : 2025-05-21
 * description    : kakao 소셜 로그인 관련
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */
@RestController
@RequestMapping("/api/v1/common/kakao")
class KakaoAuthController (
    @Value("\${kakao.auth.client-id}") private val clientId: String,
    @Value("\${kakao.auth.redirect-uri}") private val redirectUri: String,
    private val kakaoAuthService: KakaoAuthService
) {

    @Operation(summary = "kakao 로그인 URL 리턴")
    @GetMapping("/url")
    fun getKakaoLoginUrl(): Map<String, String> {
        val url = "https://kauth.kakao.com/oauth/authorize" +
                "?client_id=$clientId" +
                "&redirect_uri=${URLEncoder.encode(redirectUri, "UTF-8")}" +
                "&response_type=code"
        return mapOf("url" to url)
    }


    @Operation(summary = "kakao 로그인 기능")
    @GetMapping("/login")
    fun loginWithKakao(
        @RequestParam("code") code: String,
        response: HttpServletResponse,
        request: HttpServletRequest
    ) {
        val kakaoLoginResult = kakaoAuthService.loginWithKakao(request, code)
        if (!kakaoLoginResult.success!!) {
            logger().info("계정 없음>>{}", kakaoLoginResult)
            kakaoLoginResult.kakaoUserInfo?.let { kakaoAuthService.linkKakaoAccount(it) } // 가동 가입
            kakaoAuthService.createJwtCookies(kakaoLoginResult, request, response) // 쿠키
            response.sendRedirect("/")  // 가입 페이지로 리다이렉트
        } else {
            if (kakaoLoginResult.isActive == false) {
                logger().info("휴면 계정.. 혹은 삭제 대기 계정>>{}", kakaoLoginResult)
                kakaoAuthService.createDormantCookies(kakaoLoginResult, request, response) // 쿠키
                response.sendRedirect("/login/dormant") // 쿠키발급 없이 휴면 해제 페이지로 이동
            } else {
                logger().info("계정 있음>>{}", kakaoLoginResult)
                kakaoAuthService.createJwtCookies(kakaoLoginResult, request, response) // 쿠키
                kakaoLoginResult.socialLoginDto?.let {
                    kakaoAuthService.saveUserHistory(it) // 로그인 이력
                }
                response.sendRedirect("/")
            }
        }
    }
}