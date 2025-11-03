package com.tf.cms.common.utils

import com.tf.cms.common.model.SimpleAuthToken
import com.tf.cms.common.model.UserInfo
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder


object UserInfoHelper {
    fun getLoginUserInfo(): UserInfo? {
        val auth: Authentication = SecurityContextHolder.getContext().authentication

        return if (auth is SimpleAuthToken) {
            auth.toUserInfo()
        } else {
            return null
        }
    }

//    fun chkTempBypassAuth(request: HttpServletRequest): Boolean {
//        val header = request.getHeader("chk-pass-tmp")
//        return "rkdanfdmsqkekfmfvhrlgkwldksgsmsek" == header
//    }
}