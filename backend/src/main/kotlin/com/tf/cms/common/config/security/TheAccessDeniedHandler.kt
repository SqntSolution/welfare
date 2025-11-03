package com.tf.cms.common.config.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component

@Component
class TheAccessDeniedHandler : AccessDeniedHandler {
    //    @Throws(IOException::class)
    override fun handle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        accessDeniedException: AccessDeniedException
    ) {
        // 403 forbidden (권한이 부족)
//        response.sendError(HttpServletResponse.SC_FORBIDDEN, "권한이 없습니다.")
        response.status = HttpServletResponse.SC_FORBIDDEN
        response.writer.write("You do not have permission.")
    }
}