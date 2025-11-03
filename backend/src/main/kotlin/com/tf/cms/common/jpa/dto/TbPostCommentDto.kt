package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbPostComment}
 */
data class TbPostCommentDto(
    var id: Int? = null,
    var contents: String? = null,
    var commentsSeq: Int? = null,
    var commentsLevel: Short? = null,
    var deleted: Boolean? = false,
    var userNm: String? = null,
    var userId: String? = null,
    var postId: Int? = null,
    var nickname: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable