package com.tf.cms.biz.admin.auth

import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.admin.auth
 * fileName       : Dtos
 * author         : 정상철
 * date           : 2025-05-08
 * description    : (관리자) 개인권한 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-08        정상철       최초 생성
 */
data class UserAuthDto(
    var userId: String? = null,
    var userNm: String? = null,
    var authLevel: Int? = null,
    var startAuthAt: LocalDateTime? = null,
    var endAuthAt: LocalDateTime? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable