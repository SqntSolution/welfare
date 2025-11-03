package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbTermsDto
 * author         : 정상철
 * date           : 2025-05-30
 * description    : 약관 내용 관리 Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-30        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbTerms}
 */
data class TbTermsDto(
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
    var modifiedUserNm: String? = null
) : Serializable