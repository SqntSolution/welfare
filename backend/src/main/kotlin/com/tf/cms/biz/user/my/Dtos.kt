package com.tf.cms.biz.user.my

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.tf.cms.biz.common.MenuAuthByUser
import com.tf.cms.common.model.TheRole
import java.io.Serializable
import java.time.LocalDateTime

data class UserProfile(
    var id: String? = null,
    var loginId: String? = null,
    var name: String? = null,
    var email: String? = null,
    var teamName: String? = null,
    var role: TheRole? = null,
    var roleNm: String? = null,
    var authGroupCd: String? = null,
    var authGroupNm: String? = null,
    var userAuthInfoList: List<MenuAuthByUser>? = null,
    var avatarImgPath: String? = null,
    var socialType: String? = null,
    var phone: String? = null,
    var url: String? = null,
)

//data class UserAuthInfo(
//    var parentMenuId: Int? = null,
//    var parentMenuNm: String? = null,
//    var menuId: Int? = null,
//    var menuNm: String? = null,
//    var downloadAuthFlag: Int? = null,
//    var downloadAuth: Boolean? = false,
//    var writeAuth: Boolean? = false
//)

data class UserScrapDto(
    var postId: Int? = null,
    var userId: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null,
    var title: String? = null,
    var menu1Nm: String? = null,
    var menu2Nm: String? = null
) : Serializable

//data class UserSubscribeDto(
//        var menuId: Int? = null,
//        var userId: String? = null,
//        var menu1Id: Int? = null,
//        var menu2Id: Int? = null,
//        var createdAt: LocalDateTime? = null,
//        var menu1Nm: String? = null,
//        var menu2Nm: String? = null
//) : Serializable

data class UserAlarmDto(
    var noticeAlarmEnabled: Boolean = false,
    var qnaAnswerAlarmEnabled: Boolean = false,
    var commentAlarmEnabled: Boolean = false,
    var newPostAlarmEnabled: Boolean = false,
    var subscribeIdList: List<Int>? = null
//        var subscribeList: List<UserSubscribeDto>? = null
) : Serializable

@JsonIgnoreProperties(ignoreUnknown = true)
data class UserAlarmRequestDto(
    var noticeAlarmEnabled: Boolean = false,
    var qnaAnswerAlarmEnabled: Boolean = false,
    var commentAlarmEnabled: Boolean = false,
    var newPostAlarmEnabled: Boolean = false,
    var subscribeIdList: List<Int>? = null
) : Serializable

data class UserPostDto(
    var id: Int? = null,
    var postType: String? = null,
    var title: String? = null,
    var description: String? = null,
    var openType: String? = null,
    var enabled: Boolean? = false,
    var representativeImagePath: String? = null,
    var authLevel: Int? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var viewCnt: Int? = null,
    var menuNm1: String? = null,
    var menuNm2: String? = null,
) : Serializable