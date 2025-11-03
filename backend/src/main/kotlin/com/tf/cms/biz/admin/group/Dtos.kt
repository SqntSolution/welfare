package com.tf.cms.biz.admin.group

import com.tf.cms.common.utils.MenuIdAndPath
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime
import java.util.*

data class AuthGroupDto(
        var authGroupCd: String? = null,
        var groupNm: String? = null,
        var description: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var teamMatchingCount: Int? = null,
        var userMatchingCount: Int? = null,
)

data class AuthGroupDetailDto(
        var immutable: Boolean? = false,
        var authGroupCd: String? = null,
        var groupNm: String? = null,
        var description: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var menuInfoList: List<MenuInfoDto>? = null
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
        var accessAuthYn: Boolean? = false,
        var fileDownloadYn: Boolean? = false,
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

@JsonIgnoreProperties(ignoreUnknown = true)
data class AuthGroupInputDto(
        @field:NotBlank(message = "groupNm is not blank")
        var groupNm: String? = null,
        @field:NotBlank(message = "description is not blank")
        var description: String? = null,
        var authMenuList: List<AuthGroupMenuDto>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class AuthGroupMenuDto(
        var menuId: Int? = null,
        var fileDownloadYn: String? = null
) {
    // 파일다운로드 여부
    fun hasFileDownloadAuth(): Boolean {
        return fileDownloadYn?.lowercase(Locale.getDefault()) == "y"
    }
}

data class MatchingInfoDto(
        var matchingTeamInfoList: List<MatchingTeamAuthGroupDto>? = null,
        var matchingUserInfoList: List<MatchingUserAuthGroupDto>? = null,
)

data class MatchingTeamAuthGroupDto(
        var orgId: String? = null,
        var orgNm: String? = null,
        var orgFullCode: String? = null,
        var displayOrder: String? = null,
        var parentOrgId: String? = null,
        var parentOrgNm: String? = null,
        var authMatchingId: Int? = null,
        var authGroupCd: String? = null,
        var authGroupNm: String? = null,
        var orgKey: String? = null,
)

data class MatchingUserAuthGroupDto(
        var userId: String? = null,
        var userNm: String? = null,
        var loginId: String? =null,
        var orgId: String? = null,
        var orgNm: String? = null,
        var isActive: Boolean? = true,
        var mobileNo: String? = null,
        var mailAddr: String? = null,
        var dutyNm: String? = null,
        var empGradeNm: String? = null,
        var authMatchingId: Int? = null,
        var authGroupCd: String? = null,
        var authGroupNm: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class MatchingTeamInputListDto(
        @field:Valid
        var matchingTeamInputList: List<MatchingTeamAuthGroupInput>? = null,
        var deleteMatchingTeamIdList: List<Int>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class MatchingUserInputListDto(
        @field:Valid
        var matchingUserInputList: List<MatchingUserAuthGroupInput>? = null,
        var deleteMatchingUserIdList: List<Int>? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class MatchingTeamAuthGroupInput(
        var authMatchingId: Int? = null,
        @field:NotBlank(message = "orgFullCode is not blank")
        var orgFullCode: String? = null,
        @field:NotBlank(message = "authGroupCd is not blank")
        var authGroupCd: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class MatchingUserAuthGroupInput(
        var authMatchingId: Int? = null,
        @field:NotBlank(message = "userId is not blank")
        var userId: String? = null,
        @field:NotBlank(message = "authGroupCd is not blank")
        var authGroupCd: String? = null
)
