package com.tf.cms.biz.admin.cs

import com.tf.cms.biz.common.fileupload.FileUploadInfo
import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.jpa.entity.TbBbsNormal
import com.tf.cms.common.jpa.entity.TbBbsQna
import com.tf.cms.common.model.NoticeType
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.io.Serializable
import java.time.LocalDateTime

data class BbsNormalDto(
        var id: Int? = null,
        var menuId: Int? = null,
        var title: String? = null,
        var viewCnt: Int? = null,
        var createUserId: String? = null,
        var createUserNm: String? = null,
        var opened: Boolean? = false,
        var metaDivision: String? = null,
        var metaDivisionNm: String? = null,
        var metaEtc: String? = null,
        var contents: String? = null,
        var authLevel: Int? = null,
        var noticeType: Int? = null,
        var noticeTypeNm: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var attachedFileList: List<TbAttachedFileDto>? = null
): Serializable {
    constructor(e: TbBbsNormal): this(
            id = e.id,
            menuId = e.menuId,
            title = e.title,
            viewCnt = e.viewCnt,
            createUserId = e.createUserId,
            createUserNm = e.createUserNm,
            opened = e.opened,
            metaDivision = e.metaDivision,
            metaEtc = e.metaEtc,
            contents = e.contents,
            authLevel = e.authLevel,
            noticeType = e.noticeType,
            noticeTypeNm = NoticeType.findCode(e.noticeType.toString())?.label,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm,
    )
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class BbsNormalRequestDto(
        var id: Int? = null,
        @field:NotBlank(message = "title is not blank")
        var title: String? = null,
        @field:NotNull(message = "opened is not null")
        var opened: Boolean? = false,
        var metaDivision: String? = null,
        var metaEtc: String? = null,
        var authLevel: Int? = null,
        var contents: String? = null,
        var noticeType: Int? = null,
        var attachedFileList: List<FileUploadInfo>? = null,
        var deleteFileList: List<Int>? = null
)

data class BbsQnaDto(
        var id: Int? = null,
        var menuId: Int? = null,
        var title: String? = null,
        var viewCnt: Int? = null,
        var createUserId: String? = null,
        var createUserNm: String? = null,
        var opened: Boolean? = false,
        var metaDivision: String? = null,
        var metaDivisionNm: String? = null,
        var metaEtc: String? = null,
        var contents: String? = null,
        var responseYn: Boolean? = false,
        var responseAt: LocalDateTime? = null,
        var responseUserId: String? = null,
        var responseUserNm: String? = null,
        var responseContents: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null,
        var attachedFileList: List<TbAttachedFileDto>? = null
): Serializable {
    constructor(e: TbBbsQna): this(
            id = e.id,
            menuId = e.menuId,
            title = e.title,
            viewCnt = e.viewCnt,
            createUserId = e.createUserId,
            createUserNm = e.createUserNm,
            opened = e.opened,
            metaDivision = e.metaDivision,
            metaEtc = e.metaEtc,
            contents = e.contents,
            responseAt = e.responseAt,
            responseUserId = e.responseUserId,
            responseUserNm = e.responseUserNm,
            responseContents = e.responseContents,
            createdAt = e.createdAt,
            createdUserId = e.createdUserId,
            createdUserNm = e.createdUserNm,
            modifiedAt = e.modifiedAt,
            modifiedUserId = e.modifiedUserId,
            modifiedUserNm = e.modifiedUserNm
    )
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class BbsQnaResponseDto(
        @field:NotBlank(message = "responseContents is not blank")
        var responseContents: String? = null
)