package com.tf.cms.biz.common.history

import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.utils.Helpers
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

//@DefaultConstructor
data class StatisticDto(
        var userId: String? = null,
        var createdAt: LocalDateTime? = null,
        var value: Long? = null,
        val actionType: String? = null,
) {
        val date: String?
                get() = Helpers.formatDate(createdAt)?.replace(".", "-") ?: ""
}

data class StatisticMainDto(
        var id: Int? = null,
        var targetDate: LocalDate? = null,
        var cnt: Int? = null,
        var value: Int? = null,
        val tag1: String? = null,
)

data class UserNameListDto(
        var userId: String? = null,
        var userName: String? = null,
        var actionType: String? = null,
        var menu2Id: Int? = null,
)

data class SubScribeHistoryDto(
        var id: Long? = null,
        var postId: Int? = null,
        var postTitle: String? = null,
        var userId: String? = null,
        var userName: String? = null,
        var description: String? = null,
        var attachedFileId: Int? = null,
        var attachedFileNm: String? = null,
        var actionType: String? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var createdAt: LocalDateTime? = null,

        var subscribeCnt: Int? = null,
        var subscriber: List<UserNameListDto>? = null,
        var subscriberRemove : List<UserNameListDto>? = null,
        var subscribeYn: Boolean? = null,
) : Serializable


data class DownHistoryDto(
        var id: Long? = null,
        var postId: Int? = null,
        var postTitle: String? = null,
        var description: String? = null,
        var attachedFileId: Int? = null,
        var attachedFileNm: String? = null,
        var actionType: String? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var createdAt: LocalDateTime? = null,

        var downCnt: Long? = null,
) : Serializable



data class ViewHistoryDto(
        var id: Long? = null,
        var postId: Int? = null,
        var postType: String? = null,
        var postTitle: String? = null,
        var description: String? = null,
        var openType: String? = null,
        var enabled: Boolean? = false,
        var representativeImagePath: String? = null,
        var authLevel: Int? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var subscribeAlarmSent: Boolean? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,

        var viewCnt: Long? = null,
) {
        val date: String?
                get() = Helpers.formatDate(createdAt)?.replace(".", "-") ?: ""
}

data class LoginHistoryDto(
        var id: Long? = null,
        var postType: String? = null,

        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,

        var viewCnt: Int? = null,
) : Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class UserHistoryInput(
        @field:NotNull(message = "postId is not null")
        var postId: Int? = null,
        @field:NotBlank(message = "userId is not blank")
        var userId: String? = null,
        var postTitle: String? = null,
        var description: String? = null,
        var attachedFileId: Int? = null,
        var attachedFileNm: String? = null,
        var userName: String? = null,
        var actionType: String? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
)

data class UserHistoryDto(
        var id: Long? = null,
        var postId: Int? = null,
        var userId: String? = null,
        var postTitle: String? = null,
        var description: String? = null,
        var attachedFileId: Int? = null,
        var attachedFileNm: String? = null,
        var userName: String? = null,
        @field:NotBlank(message = "actionType is not blank")
        var actionType: String? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menu1Nm: String? = null,
        var menu2Nm: String? = null,
        var createdAt: LocalDateTime? = null,
        ): Serializable {
        constructor(e: TbUserHistory): this(
                id = e.id,
                postId = e.postId,
                userId = e.userId,
                postTitle = e.postTitle,
                description = e.description,
                attachedFileId = e.attachedFileId,
                attachedFileNm = e.attachedFileNm,
                userName = e.userName,
                actionType = e.actionType,
                menu1Id = e.menu1Id,
                menu2Id = e.menu2Id,
                menu1Nm = e.menu1Nm,
                menu2Nm = e.menu2Nm,
                createdAt = e.createdAt
        )
}