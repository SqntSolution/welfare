package com.tf.cms.biz.admin.code

import java.time.LocalDateTime

data class CodeGroupDto(
        var id: Int? = null,
        var groupCode: String? = null,
        var groupName: String? = null,
        var description: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var codeCount: Int? = null,
)

data class CodeDto(
        var id: Int? = null,
        var codeGroupId: Int? = null,
        var groupCode: String? = null,
        var code: String? = null,
        var label: String? = null,
        var additionalInfo1: String? = null,
        var additionalInfo2: String? = null,
        var seq: Int? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
)

data class CodeGroupDetailDto(
        var id: Int? = null,
        var groupCode: String? = null,
        var groupName: String? = null,
        var description: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var codeList: List<CodeDto>? = null,
)

data class CodeGroupInputDto(
        var id: Int? = null,
        var groupCode: String? = null,
        var groupName: String? = null,
        var description: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var codeList: List<CodeDto>? = null,
)