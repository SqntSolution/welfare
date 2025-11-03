package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbBbsQna}
 */
data class TbBbsQnaDto(
    var id: Int? = null,
    var menuId: Int? = null,
    var title: String? = null,
    var viewCnt: Int? = null,
    var createUserId: String? = null,
    var createUserNm: String? = null,
    var opened: Boolean? = false,
    var metaDivision: String? = null,
    var metaEtc: String? = null,
    var contents: String? = null,
    var responseAt: LocalDateTime? = null,
    var responseUserId: String? = null,
    var responseUserNm: String? = null,
    var responseContents: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable