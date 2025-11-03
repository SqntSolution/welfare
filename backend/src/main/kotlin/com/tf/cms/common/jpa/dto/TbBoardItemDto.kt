package com.tf.cms.common.jpa.dto


import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.tf.cms.common.jpa.entity.TbBoardItem
import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbBoardItemDto
 * author         : 정상철
 * date           : 2025-06-20
 * description    : TbBoardItem Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbBoardItem}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbBoardItemDto(
    var id: Int? = null,
    var boardId: Int? = null,
    var title: String? = null,
    var contents: String? = null,
    var viewCnt: Int? = null,
    var opened: Boolean = true,
    var authLevel: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable {
    constructor(entity: TbBoardItem) : this(
        id = entity.id,
        boardId = entity.boardId,
        title = entity.title,
        contents = entity.contents,
        viewCnt = entity.viewCnt,
        opened = entity.opened,
        authLevel = entity.authLevel,
        createdAt = entity.createdAt,
        createdUserId = entity.createdUserId,
        createdUserNm = entity.createdUserNm,
        modifiedAt = entity.modifiedAt,
        modifiedUserId = entity.modifiedUserId,
        modifiedUserNm = entity.modifiedUserNm
    )
}
