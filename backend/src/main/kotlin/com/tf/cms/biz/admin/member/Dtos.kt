package com.tf.cms.biz.admin.member

import com.tf.cms.biz.common.MenuAuthByUser
import com.tf.cms.common.model.TheRole
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDateTime
import java.util.*

@JsonIgnoreProperties(ignoreUnknown = true)
data class MemberSearchParams(
        var notMatchingYn: String? = null,  // 매칭된 그룹 여부
        var teamCode: String? = null,       // 소속 팀
        var adminRoleCode: String? = null,  // ROLE
        var authGroupCode: String? = null,  // 권한 그룹 (소속 팀)
        var keyword: String? = null, // 검색어
) {
    // 매칭된 그룹 여부
    fun hasNotMatchingGroup(): Boolean {
        return notMatchingYn?.lowercase(Locale.getDefault()) == "y"
    }
}

data class MemberInfoDto(
        var userId: String? = null,
        var userNm: String? = null,
        var loginId: String?  =null,
        var mailAddr: String? = null,
        var isActive: Boolean? = true,
        var mobileNo: String? = null,
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
        var startAuthAt: LocalDateTime? = null,
        var endAuthAt: LocalDateTime? = null
)

data class MemberNameAndRole(
        var userId: String? = null,
        var userNm: String? = null,
        var adminRole: String? = null,
        var adminRoleNm: String? = null,
        var startAuthAt: LocalDateTime? = null,
        var endAuthAt: LocalDateTime? = null
)

data class MemberProfileDto(
        var id: String? = null,
        var loginId: String? = null,
        var name: String? = null,
        var email: String? = null,
        var phone: String? = null,
        var isActive: Boolean? = true,
        var teamCode: String? = null,
        var teamName: String? = null,
        var role: TheRole? = null,
        var roleCd: String? = null,
        var roleNm: String? = null,
        var startAuthAt: LocalDateTime? = null,
        var endAuthAt: LocalDateTime? = null,
        var authGroupCd: String? = null,
        var authGroupNm: String? = null,
        var userAuthInfoList: List<MenuAuthByUser>? = null,
        var avatarImgPath: String? = null,
)

//data class MemberAuthInfo(
//        var parentMenuId: Int? = null,
//        var parentMenuNm: String? = null,
//        var menuId: Int? = null,
//        var menuNm: String? = null,
//        var downloadAuth: Boolean? = false,
//        var writeAuth: Boolean? = false
//)