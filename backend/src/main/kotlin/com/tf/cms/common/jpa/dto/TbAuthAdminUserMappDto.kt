package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbAuthAdminUserMapp}
 */
data class TbAuthAdminUserMappDto(
    var id: Int? = null,
    var adminRole: String? = null,
    var userId: String? = null,
    var userNm: String? = null,
    var startAuthAt: LocalDateTime? = null,
    var endAuthAt: LocalDateTime? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable