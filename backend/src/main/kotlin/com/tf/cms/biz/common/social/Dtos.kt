package com.tf.cms.biz.common.social

import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */

// social 공통

data class SocialLoginDto (
    var id: Int? = null,
    var userId: String? = null,
    var socialType: String? = null,
    var socialUserId: String? = null,
    var profileImageUrl: String? = null,
    var linkedAt: LocalDateTime? = null,
    var loginId: String? = null,
    var userNm: String? = null,
    val isActive: Boolean? = true,
)

data class SocialLoginResponseDto (
    val isRegistered: Boolean? = false,
    var userId: String? = null,
    var socialType: String? = null,
    var socialUserId: String? = null,
    var profileImageUrl: String? = null,
    var linkedAt: LocalDateTime? = null,
)

data class RegisterSocialDto (
    var userId: String? = null,
    var socialType: String? = null,
    var socialUserId: String? = null,
    var profileImageUrl: String? = null,
    var linkedAt: LocalDateTime? = null,
)

data class SocialAuthLoginDto (
    var userId: String? = null,
    var socialType: String? = null,
    var socialUserId: String? = null,
)


//kakao
data class KakaoLoginResult(
    val success: Boolean? = false,
    val jwtToken: String? = null,
    val socialUserId: String? = null,
    val kakaoUserInfo: KakaoUserInfo? = null,
    val isActive: Boolean? = true,
    val socialLoginDto: SocialLoginDto? = null,
)

data class KakaoUserInfo(
    val id: String? = null,                          // 카카오 사용자 고유 ID
    val nickname: String? = null,                 // 사용자 닉네임
    val email: String? = null,                   // 이메일 (동의한 경우에만 제공)
    val profileImage: String? = null,              // 프로필 이미지 URL
)

//naver
data class NaverUserInfo(
    val id: String,
    val email: String,
    val name: String,
    val nickname: String
)

//google
data class GoogleUserInfo(
    val id: String? = null,
    val email: String? = null,
    val name: String? = null,
    val picture: String? = null,
)