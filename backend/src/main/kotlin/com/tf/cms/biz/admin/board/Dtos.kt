package com.tf.cms.biz.admin.board

import com.tf.cms.biz.admin.content.CategoryMenuSelectbox
import com.tf.cms.biz.admin.content.ContentMenuDto
import com.tf.cms.common.utils.MenuIdAndPath
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.admin.board
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-06-26
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-26        정상철       최초 생성
 */

data class BoardContentDto(
    var id: Int? = null,
    var path: String? = null,
    var menuNm: String? = null,
    var parentId: Int? = null,
    var parentPath: String? = null,
    var parentNm: String? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var enabled: Boolean? = null,
    var menuChildren: List<BoardContentMenuDto>? = null
) {
    constructor(u: MenuIdAndPath) : this(
        id = u.id,
        path = u.path,
        menuNm = u.menuNm,
        parentId = u.parentId,
        parentPath = u.parentPath,
        parentNm = u.parentNm,
        contentType = u.contentType,
        menuSeq = u.menuSeq,
        enabled = u.enabled,
    )
}

data class BoardContentMenuDto(
    var id: Int? = null,
    var path: String? = null,
    var menuNm: String? = null,
    var parentId: Int? = null,
    var parentPath: String? = null,
    var parentNm: String? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var boardCount: Int? = null,
    var recommendCount: Int? = null
) {
    constructor(u: MenuIdAndPath) : this(
        id = u.id,
        path = u.path,
        menuNm = u.menuNm,
        parentId = u.parentId,
        parentPath = u.parentPath,
        parentNm = u.parentNm,
        contentType = u.contentType,
        menuSeq = u.menuSeq
    )
}



data class ContentBoardDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu1Nm: String? = null,
    var menu2Id: Int? = null,
    var menu2Nm: String? =null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
)

data class BoardCategoryMenuSelectbox(
    var value:String?,
    var label:String?,
    var options: List<BoardCategoryMenuSelectbox>? = null,
)


data class AdminBoardDto(
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
    var boardItemInfo: List<AdminBoardItemInfo>? = null,
)

data class AdminBoardDetailDto(
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
    var boardItemInfo: List<AdminBoardItemInfo>? = null,
)

data class AdminBoardItemInfo(
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
    var modifiedUserNm: String? = null
)


