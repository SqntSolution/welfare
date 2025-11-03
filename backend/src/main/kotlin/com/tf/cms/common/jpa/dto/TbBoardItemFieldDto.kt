package com.tf.cms.common.jpa.dto

import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbBoardItemField
 * author         : 정상철
 * date           : 2025-06-23
 * description    : item 필드 Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-23        정상철       최초 생성
 */

data class TbBoardItemFieldDto(
    var id: Int? = null,
    var boardId: Int? = null,
    var staticYn: Boolean? = false,
    var itemKey: String? = null,
    var itemNm: String? = null,
    var itemOpened: Boolean? = true,
    var searchUseYn: Boolean? = false,
    var groupCode: String? = null,
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