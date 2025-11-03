package com.tf.cms.biz.common.menu

import com.tf.cms.common.utils.MenuIdAndPath

data class MenuInfo(
        var menuId: Int? = null,
        var parentMenuId: Int? = null,
        var menuNm: String? = null,
        var parentMenuNm: String? = null
)

data class MenuInfoDto(
        val id: Int? = null,
        val path: String? = null,
        val menuNm: String? = null,
        val parentId: Int? = null,
        var parentPath: String? = null,
        var parentNm: String? = null,
        var contentType: String? = null,
        var menuSeq: Int? = null,
        var childrenMenu: List<MenuInfoDto>? = null
) {
    constructor(e: MenuIdAndPath): this(
            id = e.id,
            path = e.path,
            menuNm = e.menuNm,
            parentId = e.parentId,
            parentPath = e.parentPath,
            parentNm = e.parentNm,
            contentType = e.contentType,
            menuSeq = e.menuSeq
    )
}

data class PopupDto (
        var id:Int? = null,
        var title:String? = null,
        var contents:String? = null,
)