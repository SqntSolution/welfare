package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbAddJobMasterId}
 */
data class TbAddJobMasterIdDto(var empId: String? = null, var orgId: String? = null) :
    Serializable