package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbBoardItemInfo
 * author         : 정상철
 * date           : 2025-06-27
 * description    : 게시판 필드별 개별 정보 (게시글의 메타 항목)
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-27        정상철       최초 생성
 */

@Entity
@Table(name = "tb_board_item_info")
class TbBoardItemInfo {

    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_info_id", nullable = false)
    var id: Int? = null

    /**
     * 필드 속성 id (tb_board_item_field 참조)
     */
    @Column(name = "item_field_id", nullable = false)
    var itemFieldId: Int? = null

    /**
     * 이 메타가 속한 게시판 상세 id
     */
    @Column(name = "board_item_id", nullable = false)
    var boardItemId: Int? = null

    /**
     * item key
     */
    @Column(name = "item_key", nullable = false, length = 50)
    var itemKey: String? = null

    /**
     * item 값
     */
    @Column(name = "item_value", nullable = false, length = 100)
    var itemValue: String? = null

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
