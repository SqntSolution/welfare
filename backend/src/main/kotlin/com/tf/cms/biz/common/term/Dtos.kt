package com.tf.cms.biz.common.term

import java.time.LocalDate
import java.time.LocalDateTime

// term 공통
data class TermDto (
    var id: Int? = null,
    var termsTypeCode: String? = null,
    var version: String? = null,
    var lang: String? = null,
    var title: String? = null,
    var description: String? = null,
    var content: String? = null,
    var active: Boolean? = null,
    var effectiveStartDate: LocalDate? = null,
    var effectiveEndDate: LocalDate? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var label: String? = null,
)
