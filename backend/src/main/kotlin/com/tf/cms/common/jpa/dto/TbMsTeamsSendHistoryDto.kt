package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbMsTeamsSendHistory}
 */
data class TbMsTeamsSendHistoryDto(
    var id: Int? = null,
    var notiType: String? = null,
    var userId: String? = null,
    var sender: String? = null,
    var notyStr: String? = null,
    var postDate: String? = null,
    var webLinkUrl: String? = null,
    var mobileLinkUrl: String? = null,
    var sendStatus: String? = null,
    var errorMsg: String? = null,
    var createdAt: LocalDateTime? = null
) : Serializable