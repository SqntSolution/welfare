package com.tf.cms.common.jpa.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbCodeGroup}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbRefGroupDto(
    var id: Int? = null,
    var groupCode: String? = null,
    var groupName: String? = null,
    var groupType: String? = null,
    var description: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable