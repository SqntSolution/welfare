package com.tf.cms.common.jpa.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.tf.cms.common.jpa.entity.TbBoard
import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbBoardDto
 * author         : 정상철
 * date           : 2025-06-20
 * description    : 게시판 기본정보
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbBoard}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbBoardDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable {
    constructor(entity: TbBoard) : this(
        id = entity.id,
        menu1Id = entity.menu1Id,
        menu2Id = entity.menu2Id,
        createdAt = entity.createdAt,
        createdUserId = entity.createdUserId,
        createdUserNm = entity.createdUserNm,
        modifiedAt = entity.modifiedAt,
        modifiedUserId = entity.modifiedUserId,
        modifiedUserNm = entity.modifiedUserNm
    )
}
