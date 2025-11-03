package com.tf.cms.biz.admin.statistics

import java.time.LocalDate
import java.time.LocalDateTime

data class StatisticDto(
    var actionType: String? =null,
    var compid: String? = null,
    var compidNm: String? = null,
    var count: Int? = null,
    var createdAt: LocalDateTime? = null,
    var targetDate: LocalDate? = null,
)

data class StatisticMain(
    var id: Int? = null,
    var targetDate: LocalDate? = null,
    var cnt: Int? = null,
    var value: Int? = null,
    val tag1: String? = null,
    var totalVisitsCnt: Int? = null,
    var subItems: List<StatisticDto>? = null
)
