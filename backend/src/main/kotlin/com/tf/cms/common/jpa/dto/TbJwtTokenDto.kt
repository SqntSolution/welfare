package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbJwtToken}
 */

/**
 * JWT 토큰 관리 DTO
 */

data class TbJwtTokenDto(
    var jwtId: Int? = null,                       // 토큰 고유 ID
    var userId: String? = null,                   // 사용자 ID 또는 사용자 참조값
    var accessToken: String? = null,              // JWT Access Token
    var refreshToken: String? = null,             // Refresh Token
    var issuedAt: LocalDateTime? = null,          // 토큰 발급 시간
    var expiresAt: LocalDateTime? = null,         // 토큰 만료 시간
    var revoked: Boolean? = false,                // 강제 만료 여부
    var ipAddress: String? = null,                // 토큰 발급 시 사용자의 IP 주소
    var userAgent: String? = null,                // 사용자의 브라우저/기기 정보
    var loginId: String? = null,                    // 사용자 조회용
) : Serializable