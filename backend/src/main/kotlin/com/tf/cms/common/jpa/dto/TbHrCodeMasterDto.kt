package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbHrCodeMaster}
 */
data class TbHrCodeMasterDto(
    var id: TbHrCodeMasterIdDto? = null,
    var fullCode2: String? = null,
    var codeNm: String? = null,
    var uid: String? = null,
    var email: String? = null,
    var codeRegd: String? = null,
    var displayOrder: String? = null,
) : Serializable