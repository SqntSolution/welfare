package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbBoardItemField
 * author         : 정상철
 * date           : 2025-06-20
 * description    : 게시판 아이템 필드 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

@Entity
//@IdClass(TbBoardItemFieldId::class)
@Table(name = "tb_board_item_field")
class TbBoardItemField {

//    /**
//     * ID
//     */
//    @EmbeddedId
//    var id: TbBoardItemFieldId? = null

    /**
     * ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_field_id")
    var id: Int? = null

    /**
     * 게시판 ID
     */
    @Column(name = "board_id", nullable = false)
    var boardId: Int? = null

    /**
     * 정적 데이터 여부(게시판 필수 컬럼 여부)
     */
    @Column(name = "static_yn")
    var staticYn: Boolean? = false

    /**
     * item 키 (예: item1, item2 ...)
     */
    @Column(name = "item_key", nullable = false, length = 50)
    var itemKey: String? = null

    /**
     * 사용자에게 보여줄 이름
     */
    @Column(name = "item_nm", nullable = false, length = 100)
    var itemNm: String? = null

    /**
     * 그룹 코드
     */
    @Column(name = "group_code", length = 50)
    var groupCode: String? = null

    /**
     * 해당 item 사용여부 컬럼 보이고 안보이고 설정
     */
    @Column(name = "item_opened")
    var itemOpened: Boolean? = true

    /**
     * 검색 폼 사용 여부
     */
    @Column(name = "search_use_yn")
    var searchUseYn: Boolean? = false

    /**
     * item 타입 text link ....
     */
    @Column(name = "item_type", length = 50)
    var itemType: String? = null

    /**
     * 넓이
     */
    @Column(name = "item_width", length = 20)
    var itemWidth: String? = null

    /**
     * 길면 ...으로 생략 여부
     */
    @Column(name = "item_ellipsis")
    var itemEllipsis: Boolean? = true

    /**
     * 보여지는 순서
     */
    @Column(name = "item_display_order")
    var itemDisplayOrder: Int? = null

    /**
     * 모바일 표시 여부 (1: 표시, 0: 숨김)
     */
    @Column(name = "mobile_visible_yn")
    var mobileVisibleYn: Boolean? = true

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
