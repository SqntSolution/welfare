package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbAuthUser}
 */
data class TbAuthUserDto(
    var userId: String? = null,
    var userNm: String? = null,
    var authLevel: Int? = null,
    var startAuthAt: LocalDateTime? = null,
    var endAuthAt: LocalDateTime? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable