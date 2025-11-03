package com.tf.cms.biz.common.mail

/**
 * packageName    : com.tf.cms.biz.common.mail
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-06-25
 * description    : 메일 발송 관련 Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-25        정상철       최초 생성
 */
data class InquiryMailDto(
    var name: String? = null,
    var email: String? = null,
    var mobileNo : String? = null,
    var message: String? =null,
    var check: Boolean? = true,
)

data class EmailFormData(
    var to: String? = null,
    var from: String? =null,
    var subject: String? = null,
    var text: String? = null,
)
