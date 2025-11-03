package com.tf.cms.biz.common.login

import com.tf.cms.common.utils.EncDecryptor
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseCookie

object CookieHelper {

    /**
     * 로그인 쿠키 관리
     */
    fun loginCookies(
        response: HttpServletResponse,
        accessToken: String?, accessTokenExpiration: Long,
        refreshToken: String?, refreshTokenExpiration: Long,
        rememberMe: Boolean?,
    ) {
        val cookieAt = accessToken?.let {
            ResponseCookie.from("at", it)
                .httpOnly(true)
//                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(accessTokenExpiration - 1)
                .build()
        } ?: ""

        val cookieRf = refreshToken?.let {
            ResponseCookie.from("rf", it)
                .httpOnly(true)
//                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(refreshTokenExpiration - 1)
                .build()
        } ?: ""

        val cookieRm = rememberMe?.let {
            ResponseCookie.from("rm", EncDecryptor.encrypt(it.toString()).toString())
                .httpOnly(true)
//                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(refreshTokenExpiration - 1)
                .build()
        } ?: ""
        response.addHeader("Set-Cookie", cookieAt.toString())
        response.addHeader("Set-Cookie", cookieRf.toString())
        response.addHeader("Set-Cookie", cookieRm.toString())
    }

    /**
     * 로그아웃 쿠키 관리
     */
    fun logoutCookies(response: HttpServletResponse) {
        val cookieAt = ResponseCookie.from("at", "")
            .httpOnly(true)
//            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build()

        val cookieRf = ResponseCookie.from("rf", "")
            .httpOnly(true)
//                .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build()

        val cookieRm = ResponseCookie.from("rm", "")
            .httpOnly(true)
//                .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build()


        response.addHeader("Set-Cookie", cookieAt.toString())
        response.addHeader("Set-Cookie", cookieRf.toString())
        response.addHeader("Set-Cookie", cookieRm.toString())
    }

    /**
     * at 쿠키 관리
     */
    fun refreshCookie(
        response: HttpServletResponse,
        accessToken: String, accessTokenExpiration: Long
    ) {
        val cookie = accessToken.let {
            ResponseCookie.from("at", it)
                .httpOnly(true)
//                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(accessTokenExpiration - 1)
                .build()
        }
        response.addHeader("Set-Cookie", cookie.toString())

    }

    /**
     * name:
     * description: 휴면계정 해제용 쿠키 생성
     * author:
     * created:

     *
     * @return
     */
    fun createDormantCookies(accessToken: String, accessTokenExpiration: Long, response: HttpServletResponse) {
        val cookieDormant = accessToken.let {
            ResponseCookie.from("dormant", it)
                .httpOnly(true)
                //                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(accessTokenExpiration / 1000 - 1)
                .build()
        } ?: ""

        response.addHeader("Set-Cookie", cookieDormant.toString())
    }
}
