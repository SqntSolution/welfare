package com.tf.cms.biz.user.main

import com.tf.cms.common.jpa.dto.TbRefDto
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.Helpers
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime


/**
 * post 목록을 보여줄때, 한개의 post 정보
 */
data class PostDto(
    var userId: String? = null,
    var id: Int? = null,
    var postCategory: String? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var enabled: Boolean? = null,
    var representativeImagePath: String? = null,
    var authLevel: Int? = null,
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
    /** 좋아요 체크 여부 */
    var likes: Boolean = false,
    /** scrapted 체크 여부 */
    var scrapes: Boolean = false,
    /** 파일다운로드 권한이 있는지 여부 */
    var canFileDownload: Boolean? = null,

    var avatarImgPath:String? = null,

    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    var metaInfoItems: MetaInfoItems? = null,

//    var item1: String? = null,
//    var item2: String? = null,
//    var item3: String? = null,
//    var item4: String? = null,
//    var item5: String? = null,
//    var item6: String? = null,
//    var item7: String? = null,
//    var item8: String? = null,
//    var item9: String? = null,
//    var item10: String? = null,
)


/**
 * post 목록을 보여줄때, 간단한 한개의 post 정보
 */
data class PostSimpleDto(
    var id: Int? = null,
    var postCategory: String? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var enabled: Boolean? = false,
    var representativeImagePath: String? = null,
    var authLevel: Int? = null,
    /** 2차 메뉴 id */
    var menu2Id: Int? = null,
    /** 2차 메뉴명 */
    var menuName2: String? = null,
    var createdAt: LocalDateTime? = null,
)

/**
 * notice dto
 */
data class BbsNoticeDto(
    var id: Int? = null,
    var menuId: Int? = null,
    var title: String? = null,
    val createdAt: LocalDateTime? = null,
    val noticeType: Int? = null,
) {
    val date: String?
        get() = Helpers.formatDate(createdAt) ?: ""
}

/**
 * FAQ dto
 */
data class BbsFaqDto(
    var id: Int? = null,
    var menuId: Int? = null,
    var title: String? = null,
    var metaDivision: String? = null,
)

/**
 * 파일 다운로드 dto
 */
data class FileDto(
    var id: Int? = null,
    var fileClass: String? = null,
    var fileNm: String? = null,
    var fileExtension: String? = null,
    var fileSize: Long? = null,
    var postId: Int? = null,
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
    var authLevel: Int? = null,
    var title : String? = null,
){
    var menuNm1:String? = null
        private set
        get() = this.menuName1

    var menuNm2:String? = null
        private set
        get() = this.menuName2

    var fileId:Int? = null
        private set
        get() = this.id

}

/**
 * POST의 메타 정보 (국가, 주제 등)
 */
data class ValueAndLabel(
    var value:String,
    var label:String?=null,
){
    constructor(value:String):this(value, null)
//    var label:String?=null
//        get() {
//            // 일단은 value와 동일하게, 나중에 code table에서 읽어오도록 수정.
//            return this.value
//        }
}


/**
 * default pagesize가 8인거
 */
class PagingRequest_8 : PagingRequest(8) {
}
/**
 * default pagesize가 20인거
 */
class PagingRequest_20 : PagingRequest(20) {
}

data class SubmainSearchParam(
//    var menu1Id: Int,
//    var menu2Id: Int?,
    var menu1:String?=null,
    var menu2:String?=null,
    var nationConditions: List<String>? = null, // 국가
    var topicConditions: List<String>? = null,  // 주제
    var startDateCondition: String? = null, // 등록시작일
    var endDateCondition: String? = null, // 등록종료일
    var dataTypeCondition: String? = null,  // post인지 file인지
    var fileTypeCondition: List<String>? = null,  // file의 종류 ppt, pdf, excel 등
    var textCondition: List<String>? = null,  // 검색어들
    var order: String? = null,  // 보여주는 순서(최신순, 조회수높은순). count가 아니면 최신순임.
    var keyword: String? = null,
){
    /**
     * 최신순 조회이면 true
     */
    fun isNewOrder(): Boolean {
        return order!="count"
    }

}

/**
 * 댓글 저장용 parameter
 */
@DefaultConstructor
data class CommentSaveParam(
    @field:NotNull(message = "postId는 필수입력")
    var postId:Int?,
    @field:NotNull(message = "orig seq는 필수입력")
    var origSeq:Int?,
    @field:NotBlank(message = "댓글은 필수입력")
    var comment:String?,
)

/**
 * postMetaInfo, postMetaField
 */
data class MetaInfoItems(
    var item1: String? = null,
    var item2: String? = null,
    var item3: String? = null,
    var item4: String? = null,
    var item5: String? = null,
    var item6: String? = null,
    var item7: String? = null,
    var item8: String? = null,
    var item9: String? = null,
    var item10: String? = null,
)

/**
 * postMetaInfo, postMetaField
 */
data class MetaInfoDto(
    var metaInfoId: Int? = null,
    var postId: Int? = null,
    var metaKey: String? = null,
    val metaNm: String? = null,
    val groupCode: String? = null,
    val metaType: String? = null,
    var metaValue: String? = null,
    var metaDisplayOrder: Int? = null,
    var searchUseYn: Boolean? = false,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,

    var label: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,

)

/**
 * postMetaField
 */
data class MetaFieldDto(
    var id: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var metaKey: String? = null,
    val metaNm: String? = null,
    val groupCode: String? = null,
    val searchUseYn: Boolean? = false,
    val metaType: String? = null,
    val refInfo: List<RefSelectDto>? = null,
)


data class RefSelectDto(
    var value: String? = null,
    var label: String? = null,
)

/**
 * postMetaInfo group
 */
data class ValueLabelDto(
    val value: String,
    val label: String
)

data class MetaInfoGroupDto(
    val metaKey: String? = null,
    val metaNm: String? = null,
    val metaType: String? = null,
    val searchUseYn: Boolean? = false,
    val values: List<ValueLabelDto>? = null,
)


