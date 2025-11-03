package com.tf.cms.biz.admin.group

import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.ByteArrayOutputStream
import java.net.URLEncoder
import java.time.LocalDateTime

@Tag(name = "[관리자] 그룹 관리 API")
@RestController
@RequestMapping("/api/v1/admin/group")
class GroupController(
        private val groupService: GroupService
) {
    private val logger = logger()

    @Operation(summary = "권한그룹 목록 조회")
    @GetMapping("")
    fun findAuthGroupList(): ResponseEntity<List<AuthGroupDto>> {
        val result = groupService.findAuthGroupList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "권한그룹 단건 조회")
    @GetMapping("/{authGroupCode}")
    fun findAuthGroup(@PathVariable("authGroupCode") authGroupCode: String): ResponseEntity<AuthGroupDetailDto> {
        val result = groupService.findAuthGroup(authGroupCode)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Menu 목록 조회")
    @GetMapping("/menu")
    fun findMenuInfoList(): ResponseEntity<List<MenuInfoDto>> {
        val result = groupService.findMenuInfoList(null, null)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "권한그룹 생성")
    @PostMapping("")
    fun createAuthGroup(@Valid @RequestBody dto: AuthGroupInputDto): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        groupService.createAuthGroup(dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "권한그룹 수정")
    @PostMapping("/{authGroupCode}")
    fun updateAuthGroup(
            @PathVariable("authGroupCode") authGroupCode: String,
            @Valid @RequestBody dto: AuthGroupInputDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        groupService.updateAuthGroup(authGroupCode, dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "권한그룹 삭제")
    @DeleteMapping("/{authGroupCode}")
    fun deleteAuthGroup(@PathVariable("authGroupCode") authGroupCode: String): ResponseEntity<Any> {
        groupService.deleteAuthGroup(authGroupCode)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(
            summary = "매칭 권한그룹 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MatchingTeamAuthGroupDto::class)),
                    Content(schema = Schema(implementation = MatchingUserAuthGroupDto::class))
                ])
            ]
    )
    @GetMapping("/match")
    fun findMatchingAuthGroup(): ResponseEntity<MatchingInfoDto> {
        val result = MatchingInfoDto().apply {
            this.matchingTeamInfoList = groupService.findMatchingTeamAuthGroup()
            this.matchingUserInfoList = groupService.findMatchingUserAuthGroup()
        }
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "매칭 팀 권한그룹 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MatchingTeamAuthGroupDto::class))
                ])
            ]
    )
    @GetMapping("/match/team")
    fun findMatchingTeamAuthGroup(): ResponseEntity<List<MatchingTeamAuthGroupDto>> {
        val result = groupService.findMatchingTeamAuthGroup()
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "매칭 사용자 권한그룹 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MatchingUserAuthGroupDto::class))
                ])
            ]
    )
    @GetMapping("/match/user")
    fun findMatchingUserAuthGroup(): ResponseEntity<List<MatchingUserAuthGroupDto>> {
        val result = groupService.findMatchingUserAuthGroup()
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "매칭 팀 권한그룹 저장",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MatchingTeamInputListDto::class)),
                    Content(schema = Schema(implementation = MatchingTeamAuthGroupInput::class)),
                ])
            ]
    )
    @PostMapping("/match/team")
    fun saveMatchingTeamAuthGroup(@Valid @RequestBody input: MatchingTeamInputListDto): ResponseEntity<Any> {
        groupService.saveMatchingTeamAuthGroup(input.matchingTeamInputList, input.deleteMatchingTeamIdList)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(
            summary = "매칭 사용자 권한그룹 저장",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MatchingUserInputListDto::class)),
                    Content(schema = Schema(implementation = MatchingUserAuthGroupInput::class)),
                ])
            ]
    )
    @PostMapping("/match/user")
    fun saveMatchingUserAuthGroup(@Valid @RequestBody input: MatchingUserInputListDto): ResponseEntity<Any> {
        groupService.saveMatchingUserAuthGroup(input.matchingUserInputList, input.deleteMatchingUserIdList)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "매칭 팀 권한그룹 엑셀 다운로드")
    @GetMapping("/match/excel")
    fun downloadExcelMatchingTeamAuthGroupList(): ResponseEntity<ByteArray> {
        val matchingTeamAuthGroupList = groupService.findMatchingTeamAuthGroup()

        return try {
            val byteArrayOutputStream = createExcelOutputStream(matchingTeamAuthGroupList)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-matching-team_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }
    }

    /**
     * 엑셀 데이터 채우기
     */
    private fun createExcelOutputStream(params: List<MatchingTeamAuthGroupDto>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("상위팀 명")
            header.createCell(1).setCellValue("상위팀 코드")
            header.createCell(2).setCellValue("팀 명")
            header.createCell(3).setCellValue("팀 코드")
            header.createCell(4).setCellValue("매칭 그룹")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                row.createCell(0).setCellValue(param.parentOrgNm)
                row.createCell(1).setCellValue(param.parentOrgId)
                row.createCell(2).setCellValue(param.orgNm)
                row.createCell(3).setCellValue(param.orgId)
                row.createCell(4).setCellValue(param.authGroupNm)
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }

}