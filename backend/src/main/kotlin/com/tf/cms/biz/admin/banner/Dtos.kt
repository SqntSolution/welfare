package com.tf.cms.biz.admin.banner

import com.tf.cms.common.jpa.entity.TbBanner
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

data class BannerDto(
    var id: Int? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var imagePath: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var enabled: Boolean? = null,
    var backGroundColor: String? = null,
    var displayOrder: Int? = null,
    var authLevel: Int? = null,
    var displayStartDate: LocalDate? = null,
    var displayEndDate: LocalDate? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
): Serializable {
    constructor(e: TbBanner): this(
        id = e.id,
        title = e.title,
        subTitle = e.subTitle,
        imagePath = e.imagePath,
        menu1Id= e.menu1Id,
        menu2Id= e.menu2Id,
        link = e.link,
        linkType = e.linkType,
        enabled = e.enabled,
        backGroundColor = e.backgroundColor,
        displayOrder = e.displayOrder,
        authLevel = e.authLevel,
        displayStartDate = e.displayStartDate,
        displayEndDate = e.displayEndDate,
        createdAt = e.createdAt,
        createdUserId = e.createdUserId,
        createdUserNm = e.createdUserNm,
        modifiedAt = e.modifiedAt,
        modifiedUserId = e.modifiedUserId,
        modifiedUserNm = e.modifiedUserNm,
    )
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class BannerRequestDTO(
    var id: Int? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var imagePath: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var enabled: Boolean? = null,
    var backGroundColor: String? = null,
    var displayOrder: Int? = null,
    var authLevel: Int? = null,
    var displayStartDate: LocalDate? = null,
    var displayEndDate: LocalDate? = null,
)