package com.tf.cms.biz.admin.alarm

import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 알림 API")
@RestController
@RequestMapping("/api/v1/admin/alarm")
class AlarmAdminController(
        private val alarmAdminService: AlarmAdminService
) {
    private val logger = logger()

    @Operation(
            summary = "알림 목록조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = AlarmSendContentDto::class)),
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("")
    fun findBbsNormalList(@Parameter(hidden = true) pageable: PagingRequest): ResponseEntity<Page<AlarmSendContentDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}" }
        val result = alarmAdminService.findAlarmSendContentList(pageable.toPageable())
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "알림 상세조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = AlarmTargetTeamInfo::class)),
                    Content(schema = Schema(implementation = AlarmTargetUserInfo::class)),
                ])
            ]
    )
    @GetMapping("/{sendId}")
    fun findAlarmSendContent(@PathVariable("sendId") sendId: String): ResponseEntity<AlarmSendContentDetailDto> {
        logger.debug { "=== params : $sendId" }
        val result = alarmAdminService.findAlarmSendContent(sendId.toInt())
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "알림 등록",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = AlarmTargetTeamInfoInput::class)),
                ])
            ]
    )
    @PostMapping("")
    fun insertAlarmSendContent(@Valid @RequestBody params: AlarmSendContentInput): ResponseEntity<Any> {
        logger.debug { "=== params : $params" }
        alarmAdminService.insertAlarmSendContent(params)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(
            summary = "알림 수정",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = AlarmTargetTeamInfoInput::class)),
                ])
            ]
    )
    @PostMapping("/{sendId}")
    fun updateAlarmSendContent(
            @PathVariable("sendId") sendId: String,
            @Valid @RequestBody params: AlarmSendContentInput
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $sendId, $params" }
        alarmAdminService.updateAlarmSendContent(sendId.toInt(), params)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "알림 삭제")
    @DeleteMapping("/{sendId}")
    fun deleteAlarmSendContent(@PathVariable("sendId") sendId: Int): ResponseEntity<Any> {
        logger.debug { "=== params : $sendId" }
        alarmAdminService.deleteAlarmSendContent(sendId)
        return ResponseEntity.ok(HttpStatus.OK)
    }

}