package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbMsTeamsSendContent}
 */
data class TbMsTeamsSendContentDto(
    var id: Int? = null,
    var sendTitle: String? = null,
    var useScheduleSend: Boolean? = false,
    var scheduleSendAt: LocalDateTime? = null,
    var sentAt: LocalDateTime? = null,
    var notyStr: String? = null,
    var webLinkUrl: String? = null,
    var mobileLinkUrl: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable