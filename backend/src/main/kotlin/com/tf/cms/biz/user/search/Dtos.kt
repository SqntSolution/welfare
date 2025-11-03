package com.tf.cms.biz.user.search

import java.time.LocalDateTime

data class SearchPostResponseDto(
        var id: Int? = null,
        var postType: String? = null,
        var title: String? = null,
        var description: String? = null,
        var tag: String? = null,
        var openType: String? = null,
        var enabled: Boolean? = false,
        var representativeImagePath: String? = null,
        var authLevel: Int? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var viewCnt: Int? = null,
        var likesCnt: Int? = null,
        var userLikeYn: Boolean? = false,
        var userScrapYn: Boolean? = false,
)

data class Menu2GroupDto(
        val menu2Id: Int? = null,
        val menu2Nm: String? = null,
        val totalCnt: Int? = null,
        val posts: List<SearchPostResponseDto>? = null,
)

data class Menu1GroupDto(
        val menu1Id: Int? = null,
        val menu1Nm: String? = null,
        val children: List<Menu2GroupDto>? = null,
)


data class SearchFileResponseDto(
        var postId: Int? = null,
        var title: String? = null,
        var postType: String? = null,
        var openType: String? = null,
        var enabled: Boolean? = false,
        var authLevel: Int? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var fileId: Int? = null,
        var fileClass: String? = null,
        var fileNm: String? = null,
        var fileExtension: String? = null,
        var filePath: String? = null,
        var fileSize: Long? = null,
        var downloadCnt: Int? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null
)

data class SearchParam(
        var userId: String? = null,
        var authGroupCodes: List<String>? = null,
        var authLevel: Int? = null,
        var keywords: List<String>? = null,
        var pageNumber: Int? = null,
        var pageSize: Int? = null,
)