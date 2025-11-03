package com.tf.cms.common.sso.cm

enum class SSOLoginError(val code: String, val message: String) {
    NO_ERROR("0000", "OK"),

    NO_AUTH_ERROR("401", "권한이 없습니다."),

    INTERACTION_REQUIRED("8401", "자동SSO 실패"),

    BAD_REQUEST("9800", "잘못된 접근입니다."),
    BAD_REQUEST_STATE("9801", "잘못된 접근입니다.(state)"),

    ERROR_DEFAULT("9999", "오류가 발생하였습니다.");

    companion object {
        fun findMessage(message: String?): SSOLoginError? = SSOLoginError.entries.find { it.message == message }
        fun findCode(code: String?): SSOLoginError? = SSOLoginError.entries.find { it.code == code }
        fun isOk(code: String): Boolean = NO_ERROR.code == code
    }
}