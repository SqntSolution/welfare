package com.tf.cms.biz.admin.code

import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 코드 관리 API")
@RestController
@RequestMapping("/api/v1/admin/code")
class AdminCodeController(
        private val adminCodeService: AdminCodeService
) {
    private val logger = logger()

    @Operation(summary = "코드그룹 목록 조회")
    @GetMapping("")
    fun findCodeGroupList(): ResponseEntity<List<CodeGroupDto>> {
        val result = adminCodeService.findCodeGroupList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "코드그룹 단건 조회")
    @GetMapping("/{codeGroupId}")
    fun findCodeGroup(@PathVariable("codeGroupId") codeGroupId: Int): ResponseEntity<CodeGroupDetailDto> {
        val result = adminCodeService.findCodeGroup(codeGroupId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "코드그룹 생성")
    @PostMapping("")
    fun createAuthGroup(@Valid @RequestBody dto: CodeGroupInputDto): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        adminCodeService.createCodeGroup(dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "코드그룹 수정")
    @PostMapping("/{codeGroupId}")
    fun updateAuthGroup(
            @PathVariable("codeGroupId") codeGroupId: Int,
            @Valid @RequestBody dto: CodeGroupInputDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        adminCodeService.updateCodeGroup(codeGroupId, dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "코드그룹 삭제")
    @DeleteMapping("/{codeGroupId}")
    fun deleteAuthGroup(@PathVariable("codeGroupId") codeGroupId: Int): ResponseEntity<Any> {
        adminCodeService.deleteCodeGroup(codeGroupId)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}
