package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 권한 그룹
 */
@Entity
@Table(name = "tb_auth_group")
class TbAuthGroup {
    /**
     * 권한 그룹 코드 (공통코드로 관리되는)
     */
    @Id
    @Column(name = "auth_group_cd", nullable = false, length = 40)
    var authGroupCd: String? = null

    /**
     * 권한그룹명
     */
    @Column(name = "group_nm", nullable = false, length = 30)
    var groupNm: String? = null

    /**
     * 권한그룹설명
     */
    @Column(name = "description", nullable = false, length = 100)
    var description: String? = null

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

    /**
     * 삭제 불가 여부
     */
    @Column(name = "immutable", nullable = false)
    var immutable: Boolean = false
}