package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbBoardItemFieldIdDto
 * author         : 정상철
 * date           : 2025-06-24
 * description    : TbBoardItemFieldId Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbBoardItemFieldId}
 */
data class TbBoardItemFieldIdDto(var boardId: Int? = null, var itemKey: String? = null) :
    Serializable