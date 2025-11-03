package com.tf.cms.biz.admin.content

import com.tf.cms.common.jpa.entity.TbMenu
import com.tf.cms.common.utils.MenuIdAndPath
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class ContentCategoryDto(
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
)

/**
 * 메뉴목록을 selectbox로 만들어주기 위한 자료구조
    const selectOptions = [
        { label: '전체', value: '' },
        {
            label: 'Market Analysis',
            options: [
                { label: '국내', value: '2' },
                { label: '국외', value: '3' },
            ]
        },
 */
data class CategoryMenuSelectbox(
    var value:String?,
    var label:String?,
    var options: List<CategoryMenuSelectbox>? = null,
)

/**
 * 카테고리 한건 저장 파라미터
 */
data class ContentCategorySaveParam(
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
    var nations:List<String>? = null,
    var topics:List<String>? = null,
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
            this.parentMenuId = param.parentId
        }
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

@JsonIgnoreProperties(ignoreUnknown = true)
data class ContentSearchParams(
    var menuId: Int? = null,
    var openType: String? = null,
    var keywords: List<String>? = null,         // 검색어
    var authLevel: Int? = null, //  권한레벨
    var order: String? = null,                  // 정렬 (등록일순, 조회수, 스크랩, 공유, 좋아요)
) {
    companion object {
        private val openTypeCodes: List<String> = listOf("private", "public", "temp")
        private val orderCodes: List<String> = listOf("view", "like", "scrap", "share")
    }

    // 공개여부
    fun getOpenTypeCodes(): String? {
        return if (openTypeCodes.contains(openType)) openType!! else null
    }

    // 정렬 (기본: 등록일순)
    fun getOrderCode(): String {
        return if (orderCodes.contains(order)) order!! else "new"
    }

}

data class ContentPostDto(
    var id: Int? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var enabled: Boolean? = false,
    var representativeImagePath: String? = null,
    var authLevel: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var menuNm1: String? = null,
    var menuNm2: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var viewCnt: Int? = null,
    var likesCnt: Int? = null,
    var scrapCnt: Int? = null,
    var shareCnt: Int? = null,
    var recommendYn: Boolean? = false,
    var recommendSeq: Int? = null,
    var recommendAt: LocalDateTime? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecommendPostRequestDto(
    var saveList: List<RecommendPostSaveDto>? = null,
    var deleteList: List<Int>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecommendPostSaveDto(
    @field:NotNull(message = "menuId cannot be null")
    var menuId: Int? = null,
    @field:NotNull(message = "postIdList cannot be null")
    var postIdList: List<Int>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PostMoveMenuDto(
    @field:NotNull(message = "menuId cannot be null")
    var menuId: Int? = null,
    @field:NotNull(message = "postIdList cannot be null")
    var postIdList: List<Int>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PostContentsInput(
        @field:NotBlank(message = "openType is not blank")
        var openType: String? = null,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecommendKeywordInput(
        @field:NotEmpty(message = "keywords is not empty")
        var keywords: List<KeywordInput>? = null,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeywordInput(
        @field:NotBlank(message = "keyword is not blank")
        var keyword: String? = null,
)