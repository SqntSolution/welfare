package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * user 개인 권한
 **/
@Entity
@Table(name = "tb_auth_user")
class TbAuthUser {
    /**
     * 유저 id
     */
    @Id
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * user 이름
     */
    @Column(name = "user_nm", nullable = false, length = 100)
    var userNm: String? = null

    /**
     * 권한 레벨 (0~9)
     */
    @Column(name = "auth_level", nullable = false)
    var authLevel: Int? = null

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