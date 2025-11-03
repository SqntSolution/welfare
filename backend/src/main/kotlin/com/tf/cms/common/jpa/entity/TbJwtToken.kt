package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * JWT 토큰 관리 엔티티
 */
@Entity
@Table(name = "tb_jwt_token")
class TbJwtToken {

    /**
     * 토큰 고유 ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jwt_id", nullable = false)
    var jwtId: Int? = null

    /**
     * 사용자 ID 또는 사용자 참조값
     */
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * JWT Access Token (짧은 유효기간)
     */
    @Column(name = "access_token", length = 2000)
    var accessToken: String? = null

    /**
     * Refresh Token (재발급 시 필요)
     */
    @Column(name = "refresh_token", length = 255)
    var refreshToken: String? = null

    /**
     * 토큰 발급 시간
     */
    @Column(name = "issued_at", nullable = false)
    var issuedAt: LocalDateTime? = null

    /**
     * 토큰 만료 시간
     */
    @Column(name = "expires_at", nullable = false)
    var expiresAt: LocalDateTime? = null

    /**
     * 강제 만료 여부 (로그아웃 등)
     */
    @Column(name = "revoked", nullable = false)
    var revoked: Boolean? = false

    /**
     * 토큰 발급 시 사용자의 IP 주소
     */
    @Column(name = "ip_address", length = 45)
    var ipAddress: String? = null

    /**
     * 사용자의 브라우저/기기 정보
     */
    @Column(name = "user_agent", length = 255)
    var userAgent: String? = null
}
