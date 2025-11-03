package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbHrCodeMasterId}
 */
data class TbHrCodeMasterIdDto(
    var fullCode: String? = null,
    var groupCode: String? = null,
    var code: String? = null
) : Serializable