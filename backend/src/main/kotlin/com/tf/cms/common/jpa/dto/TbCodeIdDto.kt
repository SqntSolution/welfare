package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbCodeId
import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbCodeId}
 */
data class TbCodeIdDto(
        var groupCode: String? = null,
        var code: String? = null
) : Serializable {
    constructor(e: TbCodeId): this(
            groupCode = e.groupCode,
            code = e.code
    )
}