package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbPostMetaInfoDto
 * author         : 정상철
 * date           : 2025-06-24
 * description    : post 또는 page의 meta 정보 Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */


/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbPostMetaInfo}
 */
data class TbPostMetaInfoDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var postId: Int? = null,
    var metaKey: String? = null,
    var metaValue: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable