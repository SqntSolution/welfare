package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbCode
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbCode}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbCodeDto(
    var id: Int? = null,
    var codeGroupId: Int? = null,
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
    constructor(e: TbCode): this(
            id = e.id,
            codeGroupId = e.codeGroupId,
            groupCode = e.groupCode,
            code = e.code,
            label = e.label,
            additionalInfo = e.additionalInfo,
            additionalInfo2 = e.additionalInfo2,
            seq = e.seq,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm
    )
}