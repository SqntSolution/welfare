package com.tf.cms.biz.admin.common

import com.tf.cms.common.jpa.entity.TbAuthGroup
import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.MenuIdAndPath

data class TeamInfo(
        var code: String? = null,
        var codeNm: String? = null,
        var displayOrder: String? = null,
        var orgKey: String? = null
)

@DefaultConstructor
data class AuthGroupInfo(
        var authGroupCd: String? = null,
        var groupNm: String? = null
) {
    constructor(e: TbAuthGroup): this(
            authGroupCd = e.authGroupCd,
            groupNm = e.groupNm
    )
}

data class MemberInfo(
        var userId: String? = null,
        var userNm: String? = null,
        var loginId: String? = null,
        var parentOrgNm: String? = null,
        var orgId: String? = null,
        var orgNm: String? = null,
        var isActive: Boolean? = true,
        var mobileNo: String? = null,
        var mailAddr: String? = null,
        var dutyNm: String? = null,
        var empGradeNm: String? = null,
        var authGroupNm: String? = null,
        var fullcode: String? = null
)

@DefaultConstructor
data class MenuInfo(
        val id: Int? = null,
        val path: String? = null,
        val menuNm: String? = null,
        val parentId: Int? = null,
        var parentPath: String? = null,
        var parentNm: String? = null,
        var contentType: String? = null,
        var menuSeq: Int? = null,
        var childrenMenu: List<MenuInfo>? = null
) {
    constructor(e: MenuIdAndPath): this(
            id = e.id,
            path = e.path,
            menuNm = e.menuNm,
            parentId = e.parentId,
            parentPath = e.parentPath,
            parentNm = e.parentNm,
            contentType = e.contentType,
            menuSeq = e.menuSeq
    )
}

data class GroupAndTeamInfo(
        var orgId: String? = null,
        var orgNm: String? = null,
        var orgFullCode: String? = null,
        var parentOrgNm: String? = null,
        var orgKey: String? = null,
)