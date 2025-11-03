package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbUserMaster}
 */
data class TbUserMasterDto(
//    var empId: String? = null,
    var userId: String? = null,
    var userNm: String? = null,
//    var empNm: String? = null,
    var orgId: String? = null,
    var orgNm: String? = null,
    var mailAddr: String? = null,
    var mobileNo: String? = null,
//    var userId: String? = null,
    var loginId: String? = null,
    var passwdHash: String? = null,
    var isActive: Boolean? = true,
    var createdAt: LocalDateTime? = null,
    var modifiedAt: LocalDateTime? = null,
) : Serializable