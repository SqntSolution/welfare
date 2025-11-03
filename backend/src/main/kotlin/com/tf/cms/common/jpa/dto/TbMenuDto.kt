package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbMenu}
 */
data class TbMenuDto(
    var id: Int? = null,
    var menuNm: String? = null,
    var parentMenuId: Int? = null,
    var menuEngNm: String? = null,
    var menuSeq: Int? = null,
    var enabled: Boolean? = false,
    var contentType: String? = null,
    var postCategory: String? =null,
    var postId: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var imagePath: String? = null,
    var description: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var staticYn: Boolean? = false,
) : Serializable