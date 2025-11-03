package com.tf.cms.common.sso.vo

data class SSORequestDTO(
        //SSO 요청 ID
        var reqId: String? = null,
        //SSO agent site 코드
        var siteCode: String? = null,
        //SSO agent site password (추후 필요시 사용)
        var sitePassword: String? = null,
        //인증성공시 callback
        var callbackSuccessURI: String? = null,
        //인증실패시 callback
        var callbackFailURI: String? = null,
        var userData: String? = null,
        // 필요한 사용자 상호 작용 유형을 나타냅니다. 유효한 값은 login, none, consent 및 select_account입니다.
        //- prompt=login은 Single-Sign On을 무효화면서, 사용자가 요청에 자신의 자격 증명을 입력하도록 합니다.
        //- prompt=none은 그 반대입니다. 이는 사용자에게 어떤 대화형 메시지도 표시되지 않도록 합니다. Single Sign-On을 사용하여 요청이 자동으로 완료될 수 없는 경우에 Microsoft ID 플랫폼은 interaction_required 오류를 반환합니다.
        //- prompt=consent는 사용자가 로그인한 후에 OAuth 동의 대화 상자를 트리거하여 앱에 권한을 부여할 것을 사용자에게 요청합니다.
        //- prompt=select_account는 세션의 모든 계정 또는 저장된 계정을 나열하는 계정 선택 환경이나 다른 계정을 모두 사용하도록 선택하는 옵션을 제공하면서 Single Sign-On을 중단시킵니다.
        var prompt: String? = null
)
