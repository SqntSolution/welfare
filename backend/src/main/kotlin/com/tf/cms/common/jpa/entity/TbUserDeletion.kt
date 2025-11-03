package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime
/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbUserDeletion
 * author         : 정상철
 * date           : 2025-05-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-20        정상철       최초 생성
 */
@Entity
@Table(name = "tb_user_deletion")
class TbUserDeletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deletion_id", nullable = false)
    var id: Int? = null

    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    @Column(name = "deleted_at", nullable = false)
    var deletedAt: LocalDateTime? = null

    @Column(name = "deleted_by", nullable = false, length = 50)
    var deletedBy: String? = null

    @Column(name = "reason", length = 2000)
    var reason: String? = null

    @Column(name = "user_role", length = 100)
    var userRole: String? = null

    @Column(name = "auth_level", nullable = false)
    var authLevel: Int? = null

    @Column(name = "is_deleted", nullable = false)
    var isDeleted: Boolean = false

    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

    @Column(name = "created_user_id", length = 100)
    var createdUserId: String? = null

    @Column(name = "created_user_nm", length = 100)
    var createdUserNm: String? = null

    @Column(name = "modified_at")
    var modifiedAt: LocalDateTime? = null

    @Column(name = "modified_user_id", length = 100)
    var modifiedUserId: String? = null

    @Column(name = "modified_user_nm", length = 100)
    var modifiedUserNm: String? = null
}
