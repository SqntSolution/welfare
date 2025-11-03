package com.tf.cms.biz.admin.alarm

import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.Helpers
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

data class AlarmSendContentDto(
        var id: Int? = null,
        var sendTitle: String? = null,
        var useScheduleSend: Boolean? = false,
        var scheduleSendAt: LocalDateTime? = null,
        var sentAt: LocalDateTime? = null,
        var notyStr: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var sendStatus: String? = null,
        var targetTeamCount: Int? = null,
        var targetUserCount: Int? = null,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class AlarmSendContentInput(
        @field:NotBlank(message = "sendTitle is not blank")
        var sendTitle: String? = null,
        var useScheduleSend: Boolean? = false,
        var scheduleSendAt: String? = null,
        @field:NotBlank(message = "notyStr is not blank")
        var notyStr: String? = null,
        var webLinkUrl: String? = null,
        var mobileLinkUrl: String? = null,
        @field:Valid
        var teamIdList: List<AlarmTargetTeamInfoInput>? = null,
        var userIdList: List<String>? = null
) {
    fun validScheduleSendAt(): LocalDateTime? {
        return if (useScheduleSend == true) {
            if(scheduleSendAt != null) {
                Helpers.formatStringToLocalDateTime(scheduleSendAt)
            } else {
                throw BizException("scheduleSendAt is not null")
            }
        } else {
            Helpers.formatStringToLocalDateTime(scheduleSendAt)
        }
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class AlarmTargetTeamInfoInput(
        @field:NotBlank(message = "orgId is not blank")
        var orgId: String? = null
)

data class AlarmSendContentDetailDto(
        var id: Int? = null,
        var sendTitle: String? = null,
        var useScheduleSend: Boolean? = false,
        var scheduleSendAt: LocalDateTime? = null,
        var sentAt: LocalDateTime? = null,
        var notyStr: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var sendStatus: String? = null,
        var targetTeamList: List<AlarmTargetTeamInfo>? = null,
        var targetUserList: List<AlarmTargetUserInfo>? = null,
)

data class AlarmTargetTeamInfo(
        var orgId: String? = null,
        var orgNm: String? = null,
        var orgKey: String? = null,
)

data class AlarmTargetUserInfo(
        var userId: String? = null,
        var userNm: String? = null,
        var orgId: String? = null,
        var orgNm: String? = null,
)