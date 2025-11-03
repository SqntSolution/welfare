package com.tf.cms.biz.admin.member

import com.tf.cms.biz.common.ThumbnailRetriever
import com.tf.cms.biz.common.login.CookieHelper
import com.tf.cms.biz.common.login.LoginData
import com.tf.cms.biz.common.login.LoginService
import com.tf.cms.biz.common.login.UserService
import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.annotation.Secured
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 사용자 전환 - 사용자를 바꿔서 테스트 하기 위해서")
@RestController
@RequestMapping("/api/v1/admin/dummy/user-switch")
@Secured("ROLE_MASTER")  // master만 가능함.
class UserSwitchingController(
    @Value("\${jwt.auth.expiration}") private val expiration: Long,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    private val memberService: MemberService,
    private val thumbnailRetriever: ThumbnailRetriever,
    private val loginService: LoginService,
    private val userService: UserService,
) {
    private val logger = logger()

    @PostMapping("/list")
    fun getAllUsers(): ResponseEntity<Page<MemberInfoDto>> {
        val pageRequest = PageRequest.of(0, 100_000)
        val result = memberService.findMemberList(pageRequest, MemberSearchParams())
        return ResponseEntity.ok(result)
    }

//    @PostMapping("/login/{userId}")
//    fun switchUser(@PathVariable("userId") userId: String, request:HttpServletRequest): ResponseEntity<String> {
//        val session = request.session
//        session.setAttribute(SSOConst.USER_NUMBER, userId)  // 인증된 userId
//        thumbnailRetriever.processThumbnail(userId)
//        return ResponseEntity.ok(userId)
//    }

    @PostMapping("/login/{userId}")
    @PreAuthorize("hasRole('MASTER')")
    fun switchUser(
        @PathVariable("userId") userId: String,
        response: HttpServletResponse,
        request: HttpServletRequest
    ): ResponseEntity<Long> {
        val tbJwtTokenDto = loginService.switchUser(userId, request)
        val refreshToken = tbJwtTokenDto.refreshToken
        val accessToken = tbJwtTokenDto.accessToken
        val rememberMe = false
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
        return ResponseEntity(userService.issuedAtTime(refreshToken), HttpStatus.OK)
    }


    @RequestMapping(path = ["/clear-session"], method = [RequestMethod.POST, RequestMethod.GET])
    fun clearSession( request:HttpServletRequest): ResponseEntity<String> {
        val session = request.session
        session.removeAttribute(SSOConst.USER_NUMBER)
        return ResponseEntity.ok("ok")
    }


}