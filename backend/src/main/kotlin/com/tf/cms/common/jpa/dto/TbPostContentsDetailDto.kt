package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbPostContentsDetail}
 */
data class TbPostContentsDetailDto(
    var id: Int? = null,
    var postId: Int? = null,
    var detailsType: String? = null,
    var filePath: String? = null,
    var contents: String? = null,
    var seq: Short? = null,
    var fileNm: String? = null,
    var fileExtension: String? = null,
    var fileSize: Long? = null,
    var downloadCnt: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable