package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbAddJobMaster}
 */
data class TbAddJobMasterDto(
    var id: TbAddJobMasterIdDto? = null,
    var empGradeCd: String? = null,
    var empGradeNm: String? = null,
    var dutyCd: String? = null,
    var dutyNm: String? = null,
    var mgrClass: String? = null,
    var staYmd: String? = null,
    var endYmd: String? = null,
    var displayOrder: String? = null,
) : Serializable