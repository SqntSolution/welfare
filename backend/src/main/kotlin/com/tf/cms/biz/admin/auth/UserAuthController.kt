package com.tf.cms.biz.admin.auth

import io.swagger.v3.oas.annotations.tags.Tag
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * packageName    : com.tf.cms.biz.admin.auth
 * fileName       : UserAuthController
 * author         : 정상철
 * date           : 2025-05-08
 * description    : (관리자) 개인권한관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-08        정상철       최초 생성
 */
@Tag(name = "[관리자] 개인권한 관리 API")
@RestController
@RequestMapping("/api/v1/admin/auth")
class UserAuthController (
    private val userAuthService: UserAuthService
){
    private  val logger = logger()

    @Operation(summary = "개인권한 목록 조회")
    @GetMapping("")
    fun findUserAuthList(): ResponseEntity<List<UserAuthDto>> {
        val result = userAuthService.findUserAuthList()
        return ResponseEntity.ok(result)
    }
}