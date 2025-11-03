package com.tf.cms.biz.admin.category

import com.tf.cms.common.jpa.entity.TbMenu
import com.tf.cms.common.utils.FixedMenuTypes
import com.tf.cms.common.utils.MenuIdAndPath

data class CategoryDto(
    var id: Int? = null,
    var path: String? = null,
    var menuNm: String? = null,
    var parentId: Int? = null,
    var parentPath: String? = null,
    var parentNm: String? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var enabled: Boolean? = null,
    var menuChildren: List<ContentMenuDto>? = null
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

data class CategorySeqSaveParam(
    var id: Int? = null,
    var menuSeq: Int? = null,
    var parentId: Int? = null,
)

/**
 * 카테고리 한건 조회/저장 파라미터
 */
data class CategoryViewSaveParam(
    var id: Int? = null,
    var path: String? = null,
    var menuNm: String? = null,
    var parentId: Int? = null,
    var postId: Int? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var enabled: Boolean? = null,
    var link: String? = null,
    var linkType: String? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var description: String? = null,
    var imagePath: String? = null,
    var nations:List<String>? = null,
    var topics:List<String>? = null,
    var staticYn: Boolean? = false,
    var postCategory: String? = null,
    // TbPostMetaField 테이블
    var metaFieldInfo: List<PostMetaFieldParam>? = null,
) {
    fun toEntity() : TbMenu {
        val param = this
        return TbMenu().apply {
            this.menuSeq = param.menuSeq
            this.contentType = param.contentType
            this.enabled = param.enabled
            this.link = param.link
            this.linkType = param.linkType
            this.menuNm = param.menuNm
            this.menuEngNm = param.path
            this.title = param.title
            this.postId = param.postId
            this.subTitle = param.subTitle
            this.description = param.description
            this.parentMenuId = param.parentId
            this.imagePath = param.imagePath
            this.staticYn = param.staticYn
            this.postCategory = param.postCategory
        }
    }
    fun getIsFixed(): Boolean {
        return FixedMenuTypes.contains(this.contentType)
    }
}

data class ContentMenuDto(
    var id: Int? = null,
    var path: String? = null,
    var menuNm: String? = null,
    var parentId: Int? = null,
    var parentPath: String? = null,
    var parentNm: String? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var postCount: Int? = null,
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

data class PostMetaFieldParam(
    var metaType: String? = null,
    var groupCode: String? = null,
    var searchUseYn: Boolean? = null,
    var metaNm: String? = null,
    var metaKey: String? = null,
    var metaDisplayOrder: Int? = null,
)