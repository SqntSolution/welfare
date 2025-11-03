package com.tf.cms.common.config.security

import com.tf.cms.biz.common.token.JwtTokenService
import com.tf.cms.common.utils.logger
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.IOException
import mu.KLogger
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

@Component
class TheAuthenticationEntryPoint(
//    private val jwtTokenService: JwtTokenService,
) : AuthenticationEntryPoint {

    private val theLogger: KLogger = logger()


    @Throws(IOException::class)
    override fun commence(request: HttpServletRequest, response: HttpServletResponse, authException: AuthenticationException) {
        logger().debug { "commence>>>>>>>>>>>>>>>>" }
        val requestURI = request.requestURI
        val referer = request.getHeader("Referer")
        theLogger.info { "=== TheAuthenticationEntryPoint (requestURI : $requestURI) (Referer:$referer)" }

        // axios에서 cors 요청을 보냈을 때 error.response가 undefined로 되는 것에 대한 workaround
        // https://stackoverflow.com/a/53646088/2680712
        response.setHeader("Access-Control-Allow-Origin", "*")

        if (referer == null && requestURI?.startsWith("/api/v1/download/")==true) {
            theLogger.info { "=== no logged in -  파일 다운로드 요청 ($requestURI)" }
            // 다운로드이면서, 브라우저 주소창에 치고 들어왔을때,
            val cookie: Cookie = Cookie("originPath", requestURI)
            cookie.path = "/"
            response.addCookie(cookie)
            response.sendRedirect("/")

//        }else if(!jwtTokenService.isTokenExpired()){

        } else {
            logger().debug { "로그인을 하지 않았을때" }
            // 단순히 로그인을 하지 않았을때.
//        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인을 하세요.")
            // cms 주석
//            response.status = HttpServletResponse.SC_UNAUTHORIZED
//            response.writer.write("Please login.")
        }

    }
}