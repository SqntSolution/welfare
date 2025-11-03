package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbPostContent}
 */
data class TbPostContentDto(
    var id: Int? = null,
    var postCategory: String? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var enabled: Boolean? = false,
    var representativeImagePath: String? = null,
    var authLevel: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var menuNm1: String? = null,
    var menuNm2: String? = null,
    var subscribeAlarmSent: Boolean? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    var viewCnt: Int? = null,
) : Serializable



