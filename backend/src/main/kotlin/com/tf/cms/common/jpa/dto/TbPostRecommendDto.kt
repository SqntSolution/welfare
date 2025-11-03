package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbPostRecommend}
 */
data class TbPostRecommendDto(
    var id: Int? = null,
//    var menu1Id: Int? = null,
//    var menu2Id: Int? = null,
//    var appliedAt: LocalDateTime? = null,
    var displaySeq: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable