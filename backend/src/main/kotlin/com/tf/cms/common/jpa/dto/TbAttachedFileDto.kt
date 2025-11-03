package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbAttachedFile
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDateTime

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbAttachedFile}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class TbAttachedFileDto(
    var id: Int? = null,
    var fileClass: String? = null,
    var fileNm: String? = null,
    var fileExtension: String? = null,
    var filePath: String? = null,
    var fileSize: Long? = null,
    var postId: Int? = null,
    var downloadCnt: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable {
    constructor(e: TbAttachedFile): this(
            id = e.id,
            fileClass = e.fileClass,
            fileNm = e.fileNm,
            fileExtension = e.fileExtension,
            filePath = e.filePath,
            fileSize = e.fileSize,
            postId = e.postId,
            downloadCnt = e.downloadCnt,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm
    )
}