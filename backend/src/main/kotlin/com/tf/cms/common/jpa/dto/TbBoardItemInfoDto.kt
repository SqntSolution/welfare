package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbBoardItemInfoDto
 * author         : 정상철
 * date           : 2025-06-27
 * description    : TbBoardItemInfo Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-27        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbBoardItemInfo}
 */
data class TbBoardItemInfoDto(
    var id: Int? = null,
    var itemFieldId: Int? = null,
    var boardItemId: Int? = null,
    var itemKey: String? = null,
    var itemValue: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable
