package com.tf.cms.common.sso.vo

import com.tf.cms.common.sso.cm.SSOLoginError

data class SSOResponseDTO(
        //SSO 요청 ID
        var reqId: String? = null,
        //인증된 userId
        var userId: String? = null,
        //인증된 userName
        var userName: String? = null,
        //인증된 사번
        var userNumber: String? = null,
        //인증된 ssoToekn
        var ssoToken: String? = null,
        //req 사용자 데이타
        var userData: String? = null,
        //로그인 오류 코드
        var errorCode: String? = SSOLoginError.ERROR_DEFAULT.code,
        //로그인 오류 메시지
        var errorMessage: String? = SSOLoginError.ERROR_DEFAULT.message
)
