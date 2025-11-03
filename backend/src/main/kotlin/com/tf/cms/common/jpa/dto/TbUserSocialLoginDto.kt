package com.tf.cms.common.jpa.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.tf.cms.common.jpa.entity.TbUserSocialLogin
import java.io.Serializable
import java.time.LocalDateTime
/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbUserSocialLoginDto
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbUserSocialLogin}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbUserSocialLoginDto(
    var id: Int? = null,
    var userId: String? = null,
    var socialType: String? = null,
    var socialUserId: String? = null,
    var profileImageUrl: String? = null,
    var linkedAt: LocalDateTime? = null,
) : Serializable {
    constructor(e: TbUserSocialLogin) : this(
        id = e.id,
        userId = e.userId,
        socialType = e.socialType,
        socialUserId = e.socialUserId,
        profileImageUrl = e.profileImageUrl,
        linkedAt = e.linkedAt
    )
}
