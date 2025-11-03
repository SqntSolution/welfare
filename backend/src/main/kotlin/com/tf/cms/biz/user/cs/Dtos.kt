package com.tf.cms.biz.user.cs

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
data class BbsQnaQuestionDto (
        @field:NotNull(message = "menuId is not null")
        var menuId: Int? = null,
        @field:NotBlank(message = "title is not blank")
        var title: String? = null,
        var opened: Boolean? = false,
        var metaDivision: String? = null,
        var metaEtc: String? = null,
        var contents: String? = null,
        var attachedFileList: List<FileUploadInfo>? = null,
        var deleteFileList: List<Int>? = null
)

data class CsCenterMainDto (
        var bbsNoticeList: List<BbsNormalDto>? = null,
        var bbsFaqList: List<BbsNormalDto>? = null,
        var bbsQnaList: List<BbsQnaDto>? = null,
        var aboutConActImg: String? = null,
        var userManualImg: String? = null
): Serializable

//@JsonIgnoreProperties(ignoreUnknown = true)
//data class CsContentsDto (
//        var menuId: Int? = null,
//        var menuNm: String? = null,
//        var parentMenuId: Int? = null,
//        var menuEngNm: String? = null,
//        var menuSeq: Int? = null,
//        var menuEnabled: Boolean? = false,
//        var contentType: String? = null,
//        var menuTitle: String? = null,
//        var subTitle: String? = null,
//
//        var postId: Int? = null,
//        var postType: String? = null,
//        var postTitle: String? = null,
//        var description: String? = null,
//        var openType: String? = null,
//        var postEnabled: Boolean? = false,
//        var representativeImagePath: String? = null,
//        var authLevel: Int? = null,
//        var createdAt: LocalDateTime? = null,
//        var createdUserId: String? = null,
//        var createdUserNm: String? = null,
//        var modifiedAt: LocalDateTime? = null,
//        var modifiedUserId: String? = null,
//        var modifiedUserNm: String? = null,
//
//        var viewCnt: Int? = null,
//        var likesCnt: Int? = null,
//        var scrapCnt: Int? = null,
//        var shareCnt: Int? = null,
//
//        var fileId: Int? = null,
//        var fileClass: String? = null,
//        var fileNm: String? = null,
//        var fileExtension: String? = null,
//        var filePath: String? = null,
//        var fileSize: Long? = null,
//) {
//    constructor(tbMenu: TbMenu?, tbPostContent: TbPostContent?, tbPostMetaStatistic: TbPostMetaStatistic?, tbAttachedFile: TbAttachedFile?): this(
//            menuId = tbMenu?.id,
//            menuNm = tbMenu?.menuNm,
//            parentMenuId = tbMenu?.parentMenuId,
//            menuEngNm = tbMenu?.menuEngNm,
//            menuSeq = tbMenu?.menuSeq,
//            menuEnabled = tbMenu?.enabled,
//            contentType = tbMenu?.contentType,
//            menuTitle = tbMenu?.title,
//            subTitle = tbMenu?.subTitle,
//            postId = tbPostContent?.id,
//            postType = tbPostContent?.postType,
//            postTitle = tbPostContent?.title,
//            description = tbPostContent?.description,
//            openType = tbPostContent?.openType,
//            postEnabled = tbPostContent?.enabled,
//            representativeImagePath = tbPostContent?.representativeImagePath,
//            authLevel = tbPostContent?.authLevel,
//            createdAt = tbPostContent?.createdAt,
//            createdUserId = tbPostContent?.createdUserId,
//            createdUserNm = tbPostContent?.createdUserNm,
//            modifiedAt = tbPostContent?.modifiedAt,
//            modifiedUserId = tbPostContent?.modifiedUserId,
//            modifiedUserNm = tbPostContent?.modifiedUserNm,
//            viewCnt = tbPostMetaStatistic?.viewCnt,
//            likesCnt = tbPostMetaStatistic?.likesCnt,
//            scrapCnt = tbPostMetaStatistic?.scrapCnt,
//            shareCnt = tbPostMetaStatistic?.shareCnt,
//            fileId = tbAttachedFile?.id,
//            fileClass = tbAttachedFile?.fileClass,
//            fileNm = tbAttachedFile?.fileNm,
//            fileExtension = tbAttachedFile?.fileExtension,
//            filePath = tbAttachedFile?.filePath,
//            fileSize = tbAttachedFile?.fileSize
//    )
//}