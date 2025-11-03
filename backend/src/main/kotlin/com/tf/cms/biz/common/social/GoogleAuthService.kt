package com.tf.cms.biz.common.social

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.utils.HttpHelper
import com.tf.cms.common.utils.logger
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : googleAuthService
 * author         : 정상철
 * date           : 2025-05-23
 * description    : google 소셜 로그인 관련
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-23        정상철       최초 생성
 */
@Service
class GoogleAuthService(
    @Value("\${google.auth.client-id}") private val clientId: String,
    @Value("\${google.auth.redirect-uri}") private val redirectUri: String,
    @Value("\${google.auth.client-secret}") private val secret: String,
    @Value("\${google.auth.user-info-url}") private val userInfoUrl: String,
    @Value("\${google.auth.token-url}") private val tokenUrl: String,
    private val httpHelper: HttpHelper,
    private val socialLoginService: SocialLoginService,

    ) {
    private val objectMapper = jacksonObjectMapper()

    /**
     * name: loginWithGoogle
     * description: google 로그인
     * author:
     * created:
     *
     * @return
     */
    fun loginWithGoogle(request: HttpServletRequest, code: String): TbJwtTokenDto {
        val accessToken = requestAccessToken(code)
        val googleUserInfo = getUserInfoFromGoogle(accessToken)
        logger().debug { "googleUserInfogoogleUserInfo>>${googleUserInfo}" }

        val socialLoginDto = SocialLoginDto(
            socialType = "google",
            socialUserId = googleUserInfo.id,
            profileImageUrl = googleUserInfo.picture,
        )
        val name = googleUserInfo.name!!
        val email = googleUserInfo.email!!

        return socialLoginService.ckSocialLogin(request, name, email, socialLoginDto)
    }

    /**
     * name: requestAccessToken
     * description: google AccessToKen 요청
     * author: 정상철
     * created:
     *
     * @return
     */
    fun requestAccessToken(code: String): String {
        val params = mutableMapOf(
            "code" to code,
            "client_id" to clientId,
            "client_secret" to secret,
            "redirect_uri" to redirectUri,
            "grant_type" to "authorization_code"
        )

        val responseBody = httpHelper.postParamsHttpRequest2(tokenUrl, params)
        val jsonNode = objectMapper.readTree(responseBody)
        return jsonNode.get("access_token").asText()
    }

    /**
     * name: getUserInfoFromGoogle
     * description: google AccessToken 으로 사용자 정보 조회
     * author: 정상철
     * created:
     *
     * @return
     */
    fun getUserInfoFromGoogle(accessToken: String): GoogleUserInfo {
        val headers = mapOf(
            "Authorization" to "Bearer $accessToken"
        )

        val responseBody = httpHelper.getHttpRequest(userInfoUrl, headers)
        val jsonNode = objectMapper.readTree(responseBody)

        return GoogleUserInfo(
            id = jsonNode.get("sub").asText(),
            email = jsonNode.get("email").asText(),
            name = jsonNode.get("name").asText(),
            picture = jsonNode.get("picture")?.asText() ?: ""
        )
    }
}