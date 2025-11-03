package com.tf.cms.biz.admin.test

import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.admin.test
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-05-28
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28        정상철       최초 생성
 */
data class UserManagementDto(
    var userId: String? = null,
    var userNm: String? = null,
    var loginId: String? = null,
    var isActive: Boolean? = true,
    var mailAddr: String? = null,
    var authLevel: Int? = null,
    var startAuthAt: LocalDateTime? = null,
    var endAuthAt: LocalDateTime? = null,

)