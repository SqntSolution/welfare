package com.tf.cms.biz.admin.ref

import java.time.LocalDateTime

data class RefGroupDto(
    var id: Int? = null,
    var groupCode: String? = null,
    var groupName: String? = null,
    var groupType: String? = null,
    var description: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var refCount: Int? = null,
)

data class RefDto(
    var id: Int? = null,
    var refGroupId: Int? = null,
    var groupCode: String? = null,
    var code: String? = null,
    var label: String? = null,
    var additionalInfo: String? = null,
    var additionalInfo2: String? = null,
    var seq: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
)

data class RefGroupDetailDto(
    var id: Int? = null,
    var groupCode: String? = null,
    var groupName: String? = null,
    var groupType: String? = null,
    var description: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var refList: List<RefDto>? = null,
)

data class RefGroupInputDto(
    var id: Int? = null,
    var groupCode: String? = null,
    var groupName: String? = null,
    var groupType: String? = null,
    var description: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var refList: List<RefDto>? = null,
)