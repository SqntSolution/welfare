package com.tf.cms.biz.admin.role

import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.Helpers
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

data class RoleAdminInfoDto(
        var parentOrgId: String? = null,
        var parentOrgNm: String? = null,
        var orgId: String? = null,
        var orgNm: String? = null,
        var userId: String? = null,
        var userNm: String? = null,
        var loginId: String? = null,
        var isActive: Boolean? = true,
        var mobileNo: String? = null,
        var dutyNm: String? = null,
        var empGradeNm: String? = null,
        var mailAddr: String? = null,
        var adminRoleId: Int? = null,
        var adminRoleCd: String? = null,
        var adminRoleNm: String? = null,
        var startAuthAt: LocalDateTime? = null,
        var endAuthAt: LocalDateTime? = null,
        var authGroupCd: String? = null,
        var authGroupNm: String? = null
)

data class RoleContentsManagerInfoDto(
        var adminRoleId: Int? = null,
        var adminRoleCd: String? = null,
        var adminRoleNm: String? = null,
        var userId: String? = null,
        var userNm: String? = null,
        var orgId: String? = null,
        var orgNm: String? = null,
        var dutyNm: String? = null,
        var empGradeNm: String? = null,
        var startAuthAt: LocalDateTime? = null,
        var endAuthAt: LocalDateTime? = null,
        var authMenuIdList: List<Int?> = emptyList()
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class OperatorInputDto(
        @field:NotBlank(message = "userId is not blank")
        var userId: String? = null,
        @field:NotBlank(message = "userNm is not blank")
        var userNm: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class ContentsManagerInputDto(
        @field:NotBlank(message = "userId is not blank")
        var userId: String? = null,
        @field:NotBlank(message = "userNm is not blank")
        var userNm: String? = null,
        @field:NotBlank(message = "startAuthAtStr is not blank")
        var startAuthAtStr: String? = null,
        @field:NotBlank(message = "endAuthAtStr is not blank")
        var endAuthAtStr: String? = null,
        var authMenuIdList: List<Int>? = null,
) {
        fun getStartAuthAt(): LocalDateTime {
                val startDate = Helpers.formatStringToLocalDate(startAuthAtStr!!)
                if(startDate != null) {
                        return startDate.atStartOfDay()
                } else {
                        throw BizException("startAuthAt 형식이 올바르지 않습니다.")
                }
        }

        fun getEndAuthAt(): LocalDateTime {
                val endDate = Helpers.formatStringToLocalDate(endAuthAtStr!!)
                if(endDate != null) {
                        return endDate.plusDays(1).atStartOfDay()
                } else {
                        throw BizException("endAuthAt 형식이 올바르지 않습니다.")
                }
        }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class ContentsManagerUpdateDto(
        @field:NotBlank(message = "startAuthAtStr is not blank")
        var startAuthAtStr: String? = null,
        @field:NotBlank(message = "endAuthAtStr is not blank")
        var endAuthAtStr: String? = null,
        var authMenuIdList: List<Int>? = null,
) {
        fun getStartAuthAt(): LocalDateTime {
                val startDate = Helpers.formatStringToLocalDate(startAuthAtStr!!)
                if(startDate != null) {
                        return startDate.atStartOfDay()
                } else {
                        throw BizException("startAuthAt 형식이 올바르지 않습니다.")
                }
        }

        fun getEndAuthAt(): LocalDateTime {
                val endDate = Helpers.formatStringToLocalDate(endAuthAtStr!!)
                if(endDate != null) {
                        return endDate.plusDays(1).atStartOfDay()
                } else {
                        throw BizException("endAuthAt 형식이 올바르지 않습니다.")
                }
        }
}