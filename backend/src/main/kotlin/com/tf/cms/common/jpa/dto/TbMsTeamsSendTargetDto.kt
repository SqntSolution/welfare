package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbMsTeamsSendTarget}
 */
data class TbMsTeamsSendTargetDto(
    var id: Int? = null,
    var sendId: Int? = null,
    var targetType: String? = null,
    var targetKey: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null
) : Serializable