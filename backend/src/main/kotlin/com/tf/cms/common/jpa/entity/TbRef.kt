package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 코드
 */
@Entity
@Table(name = "tb_ref")
class TbRef {
    /**
     * ref_id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ref_id", nullable = false)
    var id: Int? = null

    /**
     * ref_그룹 ID
     */
    @Column(name = "ref_group_id", nullable = false)
    var refGroupId: Int? = null

    /**
     * 그룹코드
     */
    @Column(name = "group_code", nullable = false, length = 50)
    var groupCode: String? = null

    /**
     * 코드
     */
    @Column(name = "code", nullable = false, length = 50)
    var code: String? = null

    /**
     * 보여지는 순서
     */
    @Column(name = "seq")
    var seq: Int? = null

    /**
     * 보여주는 코드명
     */
    @Column(name = "label", nullable = false, length = 100)
    var label: String? = null

    /**
     * 추가 정보
     */
    @Column(name = "additional_info", length = 100)
    var additionalInfo: String? = null

    /**
     * 추가 정보2
     */
    @Column(name = "additional_info2", length = 100)
    var additionalInfo2: String? = null

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