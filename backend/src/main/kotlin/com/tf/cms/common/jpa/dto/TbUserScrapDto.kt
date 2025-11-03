package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbUserScrap
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbUserScrap}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbUserScrapDto(
    var id: TbUserScrapIdDto? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null
) : Serializable {
    constructor(e: TbUserScrap): this(
            id = TbUserScrapIdDto(e.id!!),
            menu1Id = e.menu1Id,
            menu2Id = e.menu2Id,
            createdAt = e.createdAt
    )
}