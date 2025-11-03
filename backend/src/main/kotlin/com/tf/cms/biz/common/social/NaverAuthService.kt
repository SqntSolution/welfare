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
 * fileName       : naverAuthService
 * author         : 정상철
 * date           : 2025-05-23
 * description    : naver 소셜 로그인 관련
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-23        정상철       최초 생성
 */
@Service
class NaverAuthService(
    @Value("\${naver.auth.client-id}") private val clientId: String,
    @Value("\${naver.auth.client-secret}") private val secret: String,
    @Value("\${naver.auth.redirect-uri}") private val redirectUri: String,
    @Value("\${naver.auth.token-url}") private val tokenUrl: String,
    @Value("\${naver.auth.user-info-url}") private val userInfoUrl: String,
    private val httpHelper: HttpHelper,
    private val socialLoginService: SocialLoginService,
) {
    private val objectMapper = jacksonObjectMapper()

    /**
     * name:
     * description: Naver 로그인
     * author:
     * created:
     *
     * @return
     */
    fun loginWithNaver(request: HttpServletRequest, code: String): TbJwtTokenDto {
        val accessToken = requestAccessToken(code)
        val naverUserInfo = getUserInfoFromNaver(accessToken)
        logger().debug { "naverUserInfonaverUserInfo>>${naverUserInfo}" }

        val socialLoginDto = SocialLoginDto(
            socialType = "naver",
            socialUserId = naverUserInfo.id,
//            profileImageUrl = naverUserInfo.,
        )
        val name = naverUserInfo.name
        val email = naverUserInfo.email

        return socialLoginService.ckSocialLogin(request, name, email, socialLoginDto)
    }

    /**
     * name: requestAccessToken
     * description: Naver AccessToKen 요청
     * author: 정상철
     * created:
     *
     * @return
     */
    fun requestAccessToken(code: String): String {
        val params = mutableMapOf(
            "grant_type" to "authorization_code",
            "client_id" to clientId,
            "client_secret" to secret,
            "redirect_uri" to redirectUri,
            "code" to code,
        )

        val responseBody = httpHelper.postParamsHttpRequest2(tokenUrl, params)
        val jsonNode = objectMapper.readTree(responseBody)
        return jsonNode.get("access_token").asText()
    }


    /**
     * name: getUserInfoFromNaver
     * description: Naver AccessToken 으로 사용자 정보 조회
     * author: 정상철
     * created:
     *
     * @return
     */
    fun getUserInfoFromNaver(accessToken: String): NaverUserInfo {
        val headers = mapOf(
            "Authorization" to "Bearer $accessToken"
        )

        val responseBody = httpHelper.getHttpRequest(userInfoUrl, headers)
        val jsonNode = objectMapper.readTree(responseBody)

        val response = jsonNode.get("response")
        return NaverUserInfo(
            id = response.get("id").asText(),
            email = response.get("email")?.asText() ?: "",
            name = response.get("name")?.asText() ?: "",
            nickname = response.get("nickname")?.asText() ?: ""
        )
    }
}