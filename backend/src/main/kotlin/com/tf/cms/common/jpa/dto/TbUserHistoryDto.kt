package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbUserHistory}
 */
data class TbUserHistoryDto(
    var id: Long? = null,
    var postId: Int? = null,
    var boardItemId: Int? = null,
    var userId: String? = null,
    var postTitle: String? = null,
    var description: String? = null,
    var attachedFileId: Int? = null,
    var attachedFileNm: String? = null,
    var userName: String? = null,
    var actionType: String? = null,
    var actionName: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null,
    var menu1Nm: String? = null,
    var menu2Nm: String? = null
) : Serializable