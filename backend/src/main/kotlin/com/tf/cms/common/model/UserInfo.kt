package com.tf.cms.common.model

import com.tf.cms.common.utils.DefaultConstructor

@DefaultConstructor
data class UserInfo(
    var id: String? = null,
    var email: String? = null,
    var name: String? = null,
    var phone: String? = null,
    var teamCode: String? = null,
    var teamName: String? = null,
    var avatarImgPath: String? = null,
    var role: TheRole? = null,
    var authGroup: List<String>? = null,
    var contentsManagerAuthMenuIds: List<Int>? = null,
    var authLevel: Int? = null,
) {
    /**
     * post를 등록할 수 있는 권한이 있는지
     */
    fun hasPostRegisteringAuth(menuId: Int): Boolean {
        return when (this.role) {
            TheRole.ROLE_OPERATOR -> true
            TheRole.ROLE_MASTER -> true
            TheRole.ROLE_CONTENTS_MANAGER -> contentsManagerAuthMenuIds?.contains(menuId) == true
            else -> false
        }
    }

    fun hasPostRegisteringAuthThrowException(menuId: Int) {
        if (!hasPostRegisteringAuth(menuId)) {
            throw BizException("권한이 없습니다.")
        }
    }

//        fun fillContentsManagerAuthMenuPaths(menuIdHolder: MenuIdHolder){
//                val list = contentsManagerAuthMenuIds?.map { menuIdHolder.getMenuFromId(it)?.path }?.toList()
//                this.contentsManagerAuthMenuPaths = list
//        }
}


