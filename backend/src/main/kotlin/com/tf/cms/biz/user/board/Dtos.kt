package com.tf.cms.biz.user.board

import com.tf.cms.common.jpa.entity.TbBoardItemField
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.user.board
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-06-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

data class BoardDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var title: String? = null,
    var contents: String? = null,
    var viewCnt: Int? = null,
    var authLevel: Int? = null,
    var opened: Boolean = true,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    //메타 정보
    var boardItemInfo: List<BoardItemInfo>? = null,
)

data class BoardDetailDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var title: String? = null,
    var contents: String? = null,
    var viewCnt: Int? = null,
    var authLevel: Int? = null,
    var opened: Boolean = true,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    //메타 정보
    var boardItemInfo: List<BoardItemInfo>? = null,
)

data class BoardItemInfo(
    var id: Int? = null,
    var itemFieldId: Int? = null,
    var boardItemId: Int? = null,
    var itemKey: String? = null,
    var itemValue: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    var label: String? = null,
)

data class BoardSearchParams(
    var keywords: String? = null,
    var createdUserNm: String? = null,
    var authLevel: Int? = null,
    var title: String? = null,
    var contents: String? = null,
    var item1: String? = null,
    var item2: String? = null,
    var item3: String? = null,
    var item4: String? = null,
    var item5: String? = null,
    var item6: String? = null,
    var item7: String? = null,
    var item8: String? = null,
    var item9: String? = null,
    var item10: String? = null,
)

data class BoardColumnsTitleDto(
    var id: Int? = null,
    var boardId: Int? = null,
    var staticYn: Boolean? = false,
    var itemKey: String? = null,
    var itemNm: String? = null,
    var itemOpened: Boolean? = true,
    var searchUseYn: Boolean? = false,
    var itemType: String? = null,
    var itemWidth: String? = null,
    var itemEllipsis: Boolean? = true,
    var itemDisplayOrder: Int? = null,
    var mobileVisibleYn: Boolean? = true,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null

)

data class ItemFieldDto(
    var itemNm: String? = null,
    var itemType: String? = null,
    var itemWidth: String? = null,
    var itemEllipsis: Boolean? = true,
    var itemOpened: Boolean? = true,
    var itemDisplayOrder: Int? = null,
)