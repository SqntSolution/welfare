package com.tf.cms.biz.common.login

import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine

/**
 * packageName    : com.tf.cms.biz.common.login
 * fileName       : TemplateService
 * author         : 김정규
 * date           : 25. 4. 16. 오후 5:48
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 16. 오후 5:48        김정규       최초 생성
 */
@Service
class TemplateService(
    private var templateEngine : SpringTemplateEngine,
) {

    /**
     * 회원가입 인증 폼
     */
    fun getTemplateAuth(args: Array<String>): String {
        val context = Context()
        context.setVariable("header", args[0])
        context.setVariable("id", args[1])
        context.setVariable("url", args[2])
        context.setVariable("titNm", args[3])
        context.setVariable("expiration", args[4])
        return templateEngine.process("auth-mail", context).replace("&lt;", "<").replace("&gt;", ">")
    }
}