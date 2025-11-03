package com.tf.cms.biz.admin.role

import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 관리자 API")
@RestController
@RequestMapping("/api/v1/admin/role")
//@Secured("ROLE_MASTER")
class RoleAdminController(
        private val roleAdminService: RoleAdminService
) {
    private val logger = logger()

    @Operation(summary = "운영자 목록 조회")
    @PreAuthorize("hasRole('MASTER')")
    @GetMapping("/operator")
    fun findOperatorInfoList(): ResponseEntity<List<RoleAdminInfoDto>> {
        val result = roleAdminService.findRoleAdminInfoList(TheRole.ROLE_OPERATOR)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "운영자 등록")
    @PreAuthorize("hasRole('MASTER')")
    @PostMapping("/operator")
    fun createRoleOperator(@Valid @RequestBody params: OperatorInputDto): ResponseEntity<Any> {
        logger.debug { "=== params : $params" }
        roleAdminService.createRoleOperator(params)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "운영자 삭제")
    @PreAuthorize("hasRole('MASTER')")
    @DeleteMapping("/operator/{userId}")
    fun deleteRoleOperator(@PathVariable("userId") userId: String): ResponseEntity<Any> {
        logger.debug { "=== params : $userId" }
        roleAdminService.deleteRoleOperator(userId)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "콘텐츠관리자 목록 조회")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @GetMapping("/manager")
    fun findManagerInfoList(): ResponseEntity<List<RoleAdminInfoDto>> {
        val result = roleAdminService.findRoleAdminInfoList(TheRole.ROLE_CONTENTS_MANAGER)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "콘텐츠관리자 상세 조회")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @GetMapping("/manager/{userId}")
    fun findRoleContentsManagerDetail(@PathVariable("userId") userId: String): ResponseEntity<RoleContentsManagerInfoDto> {
        logger.debug { "=== params : $userId" }
        val result = roleAdminService.findRoleContentsManagerDetail(userId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "콘텐츠관리자 등록")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @PostMapping("/manager")
    fun createRoleContentsManager(@Valid @RequestBody params: ContentsManagerInputDto): ResponseEntity<Any> {
        logger.debug { "=== params : $params" }
        roleAdminService.createRoleContentsManager(params)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "콘텐츠관리자 수정")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @PostMapping("/manager/{userId}")
    fun updateRoleContentsManager(
            @PathVariable("userId") userId: String,
            @Valid @RequestBody params: ContentsManagerUpdateDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $params" }
        roleAdminService.updateRoleContentsManager(userId, params)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "콘텐츠관리자 삭제")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @DeleteMapping("/manager/{userId}")
    fun deleteRoleContentsManager(@PathVariable("userId") userId: String): ResponseEntity<Any> {
        logger.debug { "=== params : $userId" }
        roleAdminService.deleteRoleContentsManager(userId)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}