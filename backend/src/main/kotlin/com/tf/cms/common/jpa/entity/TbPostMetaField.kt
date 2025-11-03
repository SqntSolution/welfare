package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbPostMetaField
 * author         : 정상철
 * date           : 2025-06-24
 * description    : post_meta_field 기본 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */

@Entity
@Table(name = "tb_post_meta_field")
class TbPostMetaField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meta_field_id")
    var id: Int? = null

    @Column(name = "menu1_id", nullable = false)
    var menu1Id: Int? = null

    @Column(name = "menu2_id", nullable = false)
    var menu2Id: Int? = null

    @Column(name = "meta_key", length = 50, nullable = false)
    var metaKey: String? = null

    @Column(name = "meta_nm", length = 100, nullable = false)
    var metaNm: String? = null

    @Column(name = "group_code", length = 50)
    var groupCode: String? = null

    @Column(name = "meta_type", length = 50)
    var metaType: String? = null

    /**
     * 보여지는 순서
     */
    @Column(name = "meta_display_order")
    var metaDisplayOrder: Int? = null

    /**
     * 검색 폼 사용 여부
     */
    @Column(name = "search_use_yn")
    var searchUseYn: Boolean? = false

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