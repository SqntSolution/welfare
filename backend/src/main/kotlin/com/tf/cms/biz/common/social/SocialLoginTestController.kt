package com.tf.cms.biz.common.social

import io.swagger.v3.oas.annotations.Operation
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : SocialLoginTestController
 * author         : 정상철
 * date           : 2025-05-23
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-23        정상철       최초 생성
 */
@RestController
@RequestMapping("/api/v1/common/socialtest")
class SocialLoginTestController (
    @Value("\${kakao.auth.client-id}") private val kakaoClientId: String,
    @Value("\${kakao.auth.redirect-uri}") private val kakaoRedirectUri: String,
    @Value("\${google.auth.client-id}") private val googleClientId: String,
    @Value("\${google.auth.redirect-uri}") private val googleRedirectUri: String,
    @Value("\${naver.auth.client-id}") private val naverClientId: String,
    @Value("\${naver.auth.redirect-uri}") private val naverRedirectUri: String,

) {
    @Operation(summary = "kakao 로그인 URL 리턴 테스트 전용 API")
    @GetMapping("/kakao")
    fun kakaoInterfaceTest () {

    }
}