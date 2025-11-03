package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbBanner}
 */
data class TbBannerDto(
    var id: Int? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var imagePath: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var enabled: Boolean? = false,
    var backgroundColor: String? = null,
    var displayOrder: Int? = null,
    var authLevel: Int? = null,
    var displayStartDate: LocalDate? = null,
    var displayEndDate: LocalDate? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable