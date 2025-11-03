package com.tf.cms.common.config.security

import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.UserInfoHelper
import org.springframework.stereotype.Component


@Component
class PreAuthCheck {

    /**
     * 마스터 여부 체크
     * ex. @PreAuthorize("@preAuthCheck.isMaster()")
     * @return
     */
    fun isMaster(): Boolean {
        val role = UserInfoHelper.getLoginUserInfo()?.role
        return role != null && role == TheRole.ROLE_MASTER
    }

    /**
     * Has role
     * ex. @PreAuthorize("@preAuthCheck.hasRole(#pplsReqSno, 4000, 'PM')")
     * @param role
     * @return
     */
    fun hasRole(role: String): Boolean {
        val userRole = UserInfoHelper.getLoginUserInfo()?.role
        return userRole != null && userRole.code == role
    }

}
