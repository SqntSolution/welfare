package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 권한그룹-유저 매핑
 */
@Entity
@Table(name = "tb_auth_group_user_mapp")
class TbAuthGroupUserMapp {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_user_mapp_id", nullable = false)
    var id: Int? = null

    /**
     * 권한 그룹 코드
     */
    @Column(name = "auth_group_cd", length = 40)
    var authGroupCd: String? = null

    /**
     * 매핑되는 유저 id
     */
    @Column(name = "user_id", length = 100)
    var userId: String? = null

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