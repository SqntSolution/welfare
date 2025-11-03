package com.tf.cms.biz.common.login

import com.tf.cms.biz.common.auth.AuthService
import com.tf.cms.biz.user.my.UserProfile
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.cosmax.conact.biz.common.login
 * fileName       : LoginController
 * author         : 김정규
 * date           : 25. 4. 9. 오후 1:47
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 9. 오후 1:47        김정규       최초 생성
 */

@Tag(name = "[공통] 로그인 API")
@RestController
@RequestMapping("/api/v1/common/login")
class LoginController(
    @Value("\${jwt.auth.expiration}") private val expiration: Long,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    private val loginService: LoginService,
    private val authService: AuthService,
    private val userService: UserService,
) {
    @Operation(summary = "로그인")
    @PostMapping("/login")
    fun login(
        @RequestBody loginData: LoginData,
        response: HttpServletResponse,
        request: HttpServletRequest
    ): ResponseEntity<Long> {
        logger().info("login>1>{}", UserInfoHelper.getLoginUserInfo())

        val tbJwtTokenDto = loginService.login(loginData, request)
        val refreshToken = tbJwtTokenDto.refreshToken
        val accessToken = tbJwtTokenDto.accessToken
        val rememberMe = loginData.rememberMe ?: false
        val refreshExpiration = if (rememberMe) {
            expiration / 1000
        } else {
            refreshTokenExpiration / 1000
        }

        // 쿠키헬퍼
        CookieHelper.loginCookies(
            response, accessToken, accessTokenExpiration / 1000,
            refreshToken, refreshExpiration, rememberMe
        )

        logger().info("login>2>{}", UserInfoHelper.getLoginUserInfo())
        return ResponseEntity(userService.issuedAtTime(refreshToken), HttpStatus.OK)
    }

    @Operation(summary = "로그인w")
    @PostMapping("/loginw")
    fun loginw(
        response: HttpServletResponse,
        request: HttpServletRequest
    ): ResponseEntity<UserInfo> {
        logger().info("wlogin>>{}", UserInfoHelper.getLoginUserInfo())
        val result = loginService.loginw(request)
//        return ResponseEntity(UserInfoHelper.getLoginUserInfo(), HttpStatus.OK)
        return ResponseEntity(result, HttpStatus.OK)
    }

    @Operation(summary = "가입")
    @PostMapping("/register")
    fun registerUserSendEmail(
        @RequestBody registerData: RegisterData,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<Any> {
        userService.sendEmail(registerData, "re", request)
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "ID 중복 체크")
    @GetMapping("/check/{id}")
    fun checkId(@PathVariable id: String): ResponseEntity<Any> {
        userService.checkId(id)
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "메일 인증 확인")
    @PostMapping("/verify/{token}")
    fun verifyEmail(@PathVariable token: String, @RequestBody registerData: RegisterData): ResponseEntity<String> {
        val resp = userService.verifyEmail(token, registerData)
        return ResponseEntity(resp, HttpStatus.OK)
    }

    @Operation(summary = "ID 찾기")
    @PostMapping("/find-id")
    fun findIdSendEmail(@RequestBody registerData: RegisterData, request: HttpServletRequest): ResponseEntity<Any> {
        userService.sendEmail(registerData, "id", request)
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "PW 찾기")
    @PostMapping("/find-pw")
    fun findPwSendEmail(@RequestBody registerData: RegisterData, request: HttpServletRequest): ResponseEntity<Any> {
        userService.sendEmail(registerData, "pw", request)
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    fun logout(
        @CookieValue("at") accessToken: String?,
        response: HttpServletResponse
    ): ResponseEntity<String> {
        logger().info("logout>1>{}", UserInfoHelper.getLoginUserInfo())
        loginService.logout(accessToken)
        CookieHelper.logoutCookies(response) // 쿠키헬퍼
        logger().info("logout>2>{}", UserInfoHelper.getLoginUserInfo())
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "토큰 조회")
    @GetMapping("/find/{token}")
    fun findId(@PathVariable token: String): ResponseEntity<Any> {
        val res = userService.findToken(token)
        return ResponseEntity(res, HttpStatus.OK)
    }

    @Operation(summary = "PW 변경")
    @PostMapping("/set-pw/{token}")
    fun setPw(
        @PathVariable token: String, @RequestBody registerData: RegisterData,
        @CookieValue("at") accessToken: String?,
        response: HttpServletResponse
    ): ResponseEntity<Any> {
        val res = userService.setPw(token, registerData)
        logger().debug { "res>$res" }

        if (res.equals("pw")) {
            loginService.logout(accessToken)
            CookieHelper.logoutCookies(response) // 쿠키헬퍼
        }

        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "로그인 연장")
    @PostMapping("/refresh")
    fun generateAccessTokenFromRefreshToken(
        @CookieValue("at") accessToken: String,
        response: HttpServletResponse
    ): ResponseEntity<Any> {
        val res = userService.generateAccessTokenFromRefreshToken(accessToken)

        // 쿠키헬퍼
        CookieHelper.refreshCookie(response, res, accessTokenExpiration / 1000)

        return ResponseEntity(userService.issuedAtTime(res), HttpStatus.OK)
    }

    @Operation(summary = "만료 시간")
    @GetMapping("/issued-at-time")
    fun issuedAtTime(@CookieValue("at") accessToken: String?): ResponseEntity<Any> {
        val res = userService.issuedAtTime(accessToken)
        return ResponseEntity(res, HttpStatus.OK)
    }

    @Operation(summary = "내 정보 조회 시 비밀번호로 인증")
    @PostMapping("/authenticatePassword")
    fun authenticatePassword(
        @CookieValue("at") accessToken: String?,
        @RequestBody loginData: LoginData
    ): ResponseEntity<Any> {
        val res = userService.authenticatePassword(accessToken, loginData)
        return ResponseEntity(res, HttpStatus.OK)
    }

    @Operation(summary = "로그인 암호화 공개키 생성 요청")
    @GetMapping("/pk")
    fun getPublicKey(@RequestParam si: String): String {
        return authService.generatePublicKey(si)
    }

    @Operation(summary = "새 PW 변경")
    @PostMapping("/new-pw")
    fun newPw(@RequestBody registerData: RegisterData, request: HttpServletRequest): ResponseEntity<Any> {
        val res = userService.changeInfo(registerData, "pw", request)
        return ResponseEntity(res, HttpStatus.OK)
    }

    @Operation(summary = "회원 탈퇴 시작")
    @PostMapping("/with-draw")
    fun withdraw(@RequestBody registerData: RegisterData, request: HttpServletRequest): ResponseEntity<Any> {
        val res = userService.changeInfo(registerData, "de", request)
        return ResponseEntity(res, HttpStatus.OK)
    }

    @Operation(summary = "회원 탈퇴")
    @PostMapping("/draw/{token}")
    fun withdrawMember(
        @PathVariable token: String,
        @RequestBody withdrawMemberData: WithdrawMemberData,
        response: HttpServletResponse
    ): ResponseEntity<Any> {
        userService.withdrawMember(token, withdrawMemberData)
        CookieHelper.logoutCookies(response) // 쿠키헬퍼
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "회원 복구")
    @PostMapping("/recover")
    fun recoverUserId(@RequestBody registerData: RegisterData): ResponseEntity<Any> {
        userService.recoverUserId(registerData)
        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "휴면 계정 해제")
    @PostMapping("/reactivate")
    fun reactivateUser(request: HttpServletRequest, response: HttpServletResponse) {
        val tbJwtTokenDto = loginService.reactivateUser(request)

        val refreshToken = tbJwtTokenDto.refreshToken
        val accessToken = tbJwtTokenDto.accessToken
        val rememberMe = true
        val refreshExpiration = if (rememberMe) {
            expiration / 1000
        } else {
            refreshTokenExpiration / 1000
        }

        // 쿠키헬퍼
        CookieHelper.loginCookies(
            response, accessToken, accessTokenExpiration / 1000,
            refreshToken, refreshExpiration, rememberMe
        )

        response.sendRedirect("/")
//        return ResponseEntity(HttpStatus.OK)
    }

    @Operation(summary = "계정 수정")
    @PostMapping("/user")
    fun updateUser(@RequestBody userProfile: UserProfile): ResponseEntity<Any> {
        userService.updateUser(userProfile)
        return ResponseEntity(HttpStatus.OK)
    }
}