package com.tf.cms.biz.common.login

import com.tf.cms.biz.common.term.TermDto

/**
 * packageName    : com.cosmax.conact.biz.common.login
 * fileName       : Dtos
 * author         : 김정규
 * date           : 25. 4. 9. 오후 1:47
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 9. 오후 1:47        김정규       최초 생성
 */

data class RegisterData(
    var loginId: String? = null,
    var userId: String? = null,
    var passwd: String? = null,
    var name: String? = null,
    var email: String? = null,
    var url: String? = null,
    var phone: String? = null,
    var ck: String? = null,
    var option: String? = null,
    var jwtId: Int? = null,
    var term: List<TermDto>? = null,
    var key: String? = null,
    var socialType: String? = null,
)

data class LoginData(
    var rememberMe: Boolean? = false,
    var si: String? = null,
    var rd: String? = null,
)

data class EmailData(
    var to: String? = null,
    var subject: String? = null,
    var text: String? = null,
)

data class WithdrawMemberData(
    var reason: String? = null,
    var url: String? = null,
)
