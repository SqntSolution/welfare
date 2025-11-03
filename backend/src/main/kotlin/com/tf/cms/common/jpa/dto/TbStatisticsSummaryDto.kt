package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbStatisticsSummary}
 */
data class TbStatisticsSummaryDto(
    var id: Int? = null,
    var targetDate: LocalDate? = null,
    var cnt: Int? = null,
    var tag1: String? = null,
    var tag2: String? = null,
    var tag3: String? = null,
    var tag4: String? = null,
    var createdAt: LocalDateTime? = null
) : Serializable