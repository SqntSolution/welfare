package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbUserDeletionDto
 * author         : 정상철
 * date           : 2025-05-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-20        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbUserDeletion}
 */
data class TbUserDeletionDto(
    var id: Int? = null,
    var userId: String? = null,
    var deletedAt: LocalDateTime? = null,
    var deletedBy: String? = null,
    var reason: String? = null,
    var userRole: String? = null,
    var authLevel: Int? = null,
    var isDeleted: Boolean = false,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable