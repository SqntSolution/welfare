package com.tf.cms.common.jpa.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.tf.cms.common.jpa.entity.TbRef
import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbRef}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbRefDto(
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
    var modifiedUserNm: String? = null
) : Serializable {
    constructor(e: TbRef): this(
            id = e.id,
            refGroupId = e.refGroupId,
            groupCode = e.groupCode,
            code = e.code,
            label = e.label,
            additionalInfo = e.additionalInfo,
            additionalInfo2 = e.additionalInfo2,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm
    )
}