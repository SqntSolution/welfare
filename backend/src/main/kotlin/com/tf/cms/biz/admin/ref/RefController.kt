package com.tf.cms.biz.admin.ref

import com.tf.cms.biz.admin.code.CodeGroupDetailDto
import com.tf.cms.biz.admin.code.CodeGroupInputDto
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 참조 관리 API")
@RestController
@RequestMapping("/api/v1/admin/ref")
class RefController (
    private val refService: RefService
){
    private val logger = logger()

    @Operation(summary = "참조그룹 목록 조회")
    @GetMapping("")
    fun findRefGroupList(): ResponseEntity<List<RefGroupDto>> {
        val result = refService.findRefGroupList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "참조그룹 단건 조회")
    @GetMapping("/{refGroupId}")
    fun findRefGroup(@PathVariable("refGroupId") refGroupId: Int): ResponseEntity<RefGroupDetailDto> {
        val result = refService.findRefGroup(refGroupId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "참조그룹 생성")
    @PostMapping("")
    fun createRefGroup(@Valid @RequestBody dto: RefGroupInputDto): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        refService.createRefGroup(dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "참조그룹 수정")
    @PostMapping("/{refGroupId}")
    fun updateRefGroup(
        @PathVariable("refGroupId") refGroupId: Int,
        @Valid @RequestBody dto: RefGroupInputDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        refService.updateRefGroup(refGroupId, dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "참조그룹 삭제")
    @DeleteMapping("/{refGroupId}")
    fun deleteRefGroup(@PathVariable("refGroupId") refGroupId: Int): ResponseEntity<Any> {
        refService.deleteRefGroup(refGroupId)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}