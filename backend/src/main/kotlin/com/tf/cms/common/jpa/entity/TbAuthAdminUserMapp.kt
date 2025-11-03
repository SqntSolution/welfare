package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * admin_role - user 매핑
 */
@Entity
@Table(name = "tb_auth_admin_user_mapp")
class TbAuthAdminUserMapp {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mapp_id", nullable = false)
    var id: Int? = null

    /**
     * role명(master, operator, contents_manager)
     */
    @Column(name = "admin_role", nullable = false, length = 50)
    var adminRole: String? = null

    /**
     * 유저 id
     */
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * user 이름
     */
    @Column(name = "user_nm", nullable = false, length = 100)
    var userNm: String? = null

    /**
     * 권한 시작일시 (contents_manager)
     */
    @Column(name = "start_auth_at")
    var startAuthAt: LocalDateTime? = null

    /**
     * 권한 종료일시 (contents_manager)
     */
    @Column(name = "end_auth_at")
    var endAuthAt: LocalDateTime? = null

    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

    /**
     * 작성자 id
     */
    @Column(name = "created_user_id", length = 100)
    var createdUserId: String? = null

    /**
     * 작성자명
     */
    @Column(name = "created_user_nm", length = 100)
    var createdUserNm: String? = null

    /**
     * 수정일시
     */
    @Column(name = "modified_at")
    var modifiedAt: LocalDateTime? = null

    /**
     * 수정자 id
     */
    @Column(name = "modified_user_id", length = 100)
    var modifiedUserId: String? = null

    /**
     * 수정자명
     */
    @Column(name = "modified_user_nm", length = 100)
    var modifiedUserNm: String? = null
}