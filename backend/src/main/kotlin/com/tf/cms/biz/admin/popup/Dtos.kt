package com.tf.cms.biz.admin.popup

import com.tf.cms.common.jpa.entity.TbPopup
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

data class PopupDto(
        var id: Int? = null,
        var title: String? = null,
        var enabled: Boolean? = false,
        var displayMenuIds: String? = null,
        var link: String? = null,
        var displayType: String? = null,
        var displayStartDate: LocalDate? = null,
        var displayEndDate: LocalDate? = null,
        var contents: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var menuNm:String? = null,
    ): Serializable {
    constructor(e: TbPopup): this(
            id = e.id,
            title = e.title,
            enabled = e.enabled,
            displayMenuIds = e.displayMenuIds,
            link = e.link,
            displayType = e.displayType,
            displayStartDate = e.displayStartDate,
            displayEndDate = e.displayEndDate,
            contents = e.contents,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm,
    )
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class PopupRequestDto(
        var id: Int? = null,
        @field:NotBlank(message = "title is not blank")
        var title: String? = null,
        @field:NotNull(message = "enabled")
        var enabled: Boolean? = false,
        var displayMenuIds: String? = null,
        var link: String? = null,
        var displayType: String? = null,
        var displayStartDate: LocalDate? = null,
        var displayEndDate: LocalDate? = null,
        var contents: String? = null
)