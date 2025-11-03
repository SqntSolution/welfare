package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbUser}
 */
data class TbUserDto(
    var userId: String? = null,
    var nickname: String? = null,
    var avatarImgPath: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var noticeAlarmEnabled: Boolean? = null,
    var qnaAnswerAlarmEnabled: Boolean? = null,
    var commentAlarmEnabled: Boolean? = null,
    var newPostAlarmEnabled: Boolean? = null
) : Serializable