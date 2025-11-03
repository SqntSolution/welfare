package com.tf.cms.common.sso.cm

enum class ApiResultError(val code: String, val message: String) {
    NO_ERROR("0000", "OK"),

    NO_AUTH_ERROR("401", "권한이 없습니다."),

    LOGIN_ERR_NOT_FOUND_USER("1404", "사용자 아이디 혹은 비밀번호가 틀렸습니다."),
    LOGIN_ERR_NOT_MATCH_PASSWD("1401", "사용자 아이디 혹은 비밀번호가 틀렸습니다."),

    ERROR_PARAMETERS("9901", "파라미터 오류."),
    ERROR_NOT_SUPPORTED_METHOD("9902", "지원하지 않는 Method 입니다."),
    ERROR_INTERNAL_API_PARAMETERS("9903", "내부 API 파라미터 오류."),

    ERROR_DEFAULT("9999", "오류가 발생하였습니다.");

    companion object {
        fun findMessage(message: String?): ApiResultError? = entries.find { it.message == message }
        fun findCode(code: String?): ApiResultError? = entries.find { it.code == code }
        fun isOk(code: String): Boolean = NO_ERROR.code == code
    }
}