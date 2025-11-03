package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbKeywordRecommend
import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbKeywordRecommendDto
 * author         : 정상철
 * date           : 2025-05-15
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-15        정상철       최초 생성
 */
/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbKeywordRecommend}
 */
data class TbKeywordRecommendDto(
    var id: Int? = null,
    var keyword: String? = null,
    var seq: Short? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable {
    constructor(e: TbKeywordRecommend): this(
        id = e.id,
        keyword = e.keyword,
        seq = e.seq,
        createdAt = e.createdAt,
        createdUserId = e.createdUserId,
        createdUserNm = e.createdUserNm,
        modifiedAt = e.modifiedAt,
        modifiedUserId = e.modifiedUserId,
        modifiedUserNm = e.modifiedUserNm
    )
}