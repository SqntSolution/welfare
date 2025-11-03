package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbUserSocialLogin
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */

/**
 * 소셜 로그인 관리 엔티티
 */
@Entity
@Table(
    name = "tb_user_social_login",
    uniqueConstraints = [
        UniqueConstraint(name = "unique_social", columnNames = ["social_type", "social_user_id"])
    ]
)
class TbUserSocialLogin {

    /**
     * 소셜 로그인 고유 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_login_id", nullable = false)
    var id: Int? = null

    /**
     * 유저 ID (기존 유저 테이블 참조)
     */
    @Column(name = "user_id", nullable = false, length = 50)
    var userId: String? = null

    /**
     * 소셜 로그인 타입 (예: kakao, google, naver)
     */
    @Column(name = "social_type", nullable = false, length = 50)
    var socialType: String? = null

    /**
     * 소셜 로그인 고유 ID
     */
    @Column(name = "social_user_id", nullable = false, length = 64)
    var socialUserId: String? = null

    /**
     * 프로필 이미지 URL
     */
    @Column(name = "profile_image_url", length = 255)
    var profileImageUrl: String? = null

    /**
     * 계정 연동 일시
     */
    @Column(name = "linked_at")
    var linkedAt: LocalDateTime? = null
}
