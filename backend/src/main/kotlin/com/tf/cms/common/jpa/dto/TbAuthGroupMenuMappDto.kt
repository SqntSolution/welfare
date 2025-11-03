package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbAuthGroupMenuMapp}
 */
data class TbAuthGroupMenuMappDto(
    var id: Int? = null,
    var authGroupCd: String? = null,
    var menuId: Int? = null,
    var canFiledownload: Boolean? = false,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
) : Serializable