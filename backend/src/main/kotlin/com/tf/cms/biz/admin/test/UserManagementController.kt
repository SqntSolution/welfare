package com.tf.cms.biz.admin.test

import com.tf.cms.biz.admin.member.MemberSearchParams
import com.tf.cms.biz.admin.role.RoleAdminInfoDto
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.model.TheRole
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.tf.cms.biz.admin.test
 * fileName       : UserManagementController
 * author         : 정상철
 * date           : 2025-05-28
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28        정상철       최초 생성
 */
@Tag(name = "[공통] 테스트 API")
@RestController
@RequestMapping("/api/v1/admin/test")
class UserManagementController (
    private val userManagementService: UserManagementService
){
    @Operation(summary = "유저관리 목록 조회")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @GetMapping("/users")
    fun findUserManagementList(
        @Parameter(hidden = true) pageable: PagingRequest,
        @Parameter(hidden = true) memberSearchParams: MemberSearchParams
    ): ResponseEntity<Page<UserManagementDto>> {
        val result = userManagementService.findUserManagementList(pageable.toPageable())
        return ResponseEntity.ok(result)
    }



    @Operation(summary = "유저 완전 삭제")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @DeleteMapping("/users/{empId}")
    fun deleteUserManagement(@PathVariable("empId") empId: String): ResponseEntity<Any> {
        userManagementService.deleteUserManagement(empId)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}