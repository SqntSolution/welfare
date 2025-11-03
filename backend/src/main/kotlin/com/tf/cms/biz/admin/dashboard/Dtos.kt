package com.tf.cms.biz.admin.dashboard

import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.Helpers
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

@DefaultConstructor
data class VisitorStatisticDto(
    var date: LocalDate,
    var visitor:Int?,
    var totalVisitor:Int?,
    var periodStartDate: LocalDate,
    var periodEndDate: LocalDate,
)

/**
 * notice dto
 */
data class BbsNoticeDto(
    var id: Int? = null,
    var menuId: Int? = null,
    var title: String? = null,
    var opened: Boolean? = null,
    var viewCnt: Int? = null,
    val createdAt: LocalDateTime? = null,
    var fileList: List<FileDownloadInfoDto>? = null,
) {
    val date: String?
        get() = Helpers.formatDate(createdAt) ?: ""
}

data class BbsQnaDto(
    var id: Int? = null,
    var menuId: Int? = null,
    var title: String? = null,
    var opened: Boolean? = null,
    var viewCnt: Int? = null,
    var createdAt: LocalDateTime? = null,
    var metaDivision: String? = null,
    var metaDivisionDesc: String? = null,
    var responseUserId:String? = null, // 답변자 id
    ) {
    val date: String?
        get() = Helpers.formatDate(createdAt) ?: ""
    val responseStatus:String? // 답변상태는 답변자id가 있는지로 판단.
        get() = if(responseUserId.isNullOrEmpty()) "문의 접수" else "답변 완료"
    val responseYn:Boolean // 답변상태는 답변자id가 있는지로 판단.
        get() = responseUserId.isNullOrEmpty()!=true
}

data class FileDownloadInfoDto(
    var fileId: Int? = null,
    var postId: Int? = null,
//    var fileClass: String? = null,
    var fileNm: String? = null,
    var fileExtension: String? = null,
    var fileSize: Long? = null,
){
    val downloadUrl : String?
        get() = "/api/v1/download/${fileId}"
}


/**
 * post 목록을 보여줄때, 한개의 post 정보
 */
data class PostDto(
    var userId: String? = null,
    var id: Int? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var openTypeDesc: String? = null,
    var enabled: Boolean? = false,
    var representativeImagePath: String? = null,
    /** 1차 메뉴 id */
    var menu1Id: Int? = null,
    /** 1차 메뉴명 */
    var menuName1: String? = null,
    /** 1차 메뉴영문명 */
    var menuEngName1: String? = null,
    /** 2차 메뉴 id */
    var menu2Id: Int? = null,
    /** 2차 메뉴명 */
    var menuName2: String? = null,
    /** 2차 메뉴영문명 */
    var menuEngName2: String? = null,
    /** view cnt */
    var viewCnt: Int? = null,
    /** 공유건수 */
    var shareCnt: Int? = null,
    var likesCnt: Int? = null,
    var scrapCnt: Int? = null,
    var downloadCnt:Int? = null, // 첨부파일 다운로드 건수

    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
)


/* 대시보드용 회원정보 input */
@JsonIgnoreProperties(ignoreUnknown = true)
data class MemberSearchParam(
    var notMatchingYn: String? = null,  // 매칭된 그룹 여부
    var teamCode: String? = null,       // 소속 팀
    var adminRoleCode: String? = null,  // ROLE
    var authGroupCode: String? = null,  // 권한 그룹 (소속 팀)
    var persAuthGroupCode: String? = null,  // 권한 그룹 (개인)
    var keyword: String? = null, // 검색어
) {
    // 매칭된 그룹 여부
    fun hasNotMatchingGroup(): Boolean {
        return notMatchingYn?.lowercase(Locale.getDefault()) == "y"
    }
}


/* 대시보드용 회원정보 리턴 */
data class MemberInfoResponse(
    var empId: String? = null,
    var empNm: String? = null,
    var mailAddr: String? = null,
    var orgId: String? = null,
    var orgNm: String? = null,
    var parentOrgId: String? = null,
    var parentOrgNm: String? = null,
    var dutyNm: String? = null,
    var empGradeNm: String? = null,
    var adminRole: String? = null,
    var adminRoleNm: String? = null,
    var authGroupCd: String? = null,
    var authGroupNm: String? = null,
    var persAuthGroupCd: String? = null,
    var persAuthGroupNm: String? = null,
    var startAuthAt: LocalDateTime? = null,
    var endAuthAt: LocalDateTime? = null
)

data class TbUserHistoryDto(
    var id: Long? = null,
    var postId: Int? = null,
    var userId: String? = null,
    var postTitle: String? = null,
    var description: String? = null,
    var attachedFileId: Int? = null,
    var attachedFileNm: String? = null,
    var userName: String? = null,
    var actionType: String? = null,
    var actionName: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null,
    var menu1Nm: String? = null,
    var menu2Nm: String? = null
) : Serializable