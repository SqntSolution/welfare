package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 코드 그룹
 */
@Entity
@Table(name = "tb_code_group")
class TbCodeGroup {
    /**
     * code_group_id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_group_id", nullable = false)
    var id: Int? = null

    /**
     * 그룹코드
     */
    @Column(name = "group_code", nullable = false, length = 50)
    var groupCode: String? = null

    /**
     * 그룹코드명
     */
    @Column(name = "group_name", nullable = false, length = 100)
    var groupName: String? = null

    /**
     * 설명
     */
    @Column(name = "description", length = 500)
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
}