package com.tf.cms.biz.admin.statistics

import com.tf.cms.biz.admin.common.MemberInfo
import com.tf.cms.biz.common.history.DownHistoryDto
import com.tf.cms.biz.common.history.SubScribeHistoryDto
import com.tf.cms.biz.common.history.ViewHistoryDto
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[관리자] 통계 API")
@RestController
@RequestMapping("/api/v1/admin/statistic")
class StatisticController(
    private val statisticService: StatisticService,
) {
    private val logger = logger()

    @Operation(
        summary = "통계 메인 조회(방문자, 조회, 다운로드, 구독)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = StatisticMain::class)),
            ])
        ],
        parameters = [
        ]
    )
    @GetMapping("")
    fun findStatisticList(
        @RequestParam(name="actionType", required = false) actionType: String?,
        @RequestParam(name="startDate", required = false) startDate: String?,
        @RequestParam(name="endDate", required = false) endDate: String?,
    ): ResponseEntity<List<StatisticMain>> {
        logger.debug { "param : $actionType $startDate $endDate"}
        val result = statisticService.findStatisticList(actionType, startDate, endDate)
        return ResponseEntity.ok(result)
    }


    @Operation(
        summary = "통계 리스트 조회 (방문자)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = MemberInfo::class)),
            ])
        ],
        parameters = [
        ]
    )
    @GetMapping("/Login")
    fun findLoginList(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<List<MemberInfo>> {
        val result = statisticService.findLoginList(targetDate)
        return ResponseEntity.ok(result)
    }



    @Operation(
        summary = "통계 리스트 조회 (조회)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = ViewHistoryDto::class)),
            ])
        ],
        parameters = [
        ]
    )
    @GetMapping("/view")
    fun findViewList(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<List<ViewHistoryDto>> {
        val result = statisticService.findViewList(targetDate)
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "통계 리스트 조회 (구독)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = SubScribeHistoryDto::class)),
            ])
        ],
        parameters = [
        ]
    )
    @GetMapping("/subscribe")
    fun findSubscribeList(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<List<SubScribeHistoryDto>> {
        val result = statisticService.findSubscribeList(targetDate)
        return ResponseEntity.ok(result)
    }


    @Operation(
        summary = "통계 리스트 조회 (다운로드)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = DownHistoryDto::class)),
            ])
        ],
        parameters = [
        ]
    )
    @GetMapping("/download")
    fun findFileDownloadList(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<List<DownHistoryDto>> {
        val result = statisticService.findFileDownloadList(targetDate)
        return ResponseEntity.ok(result)
    }


    @Operation(summary = "통계 메인 엑셀 다운로드")
    @GetMapping("/main/excel")
    fun downloadExcelStatisticsMainList(
            @RequestParam(name="actionType", required = false) actionType: String?,
            @RequestParam(name="startDate", required = false) startDate: String?,
            @RequestParam(name="endDate", required = false) endDate: String?,
    ): ResponseEntity<ByteArray> {
        val result = statisticService.downloadExcelStatisticsMainList(actionType,startDate, endDate)
        return result
    }


    @Operation(summary = "통계 상세 엑셀 다운로드 (방문자)")
    @GetMapping("/login/excel")
    fun downloadExcelStatisticLogin(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<ByteArray> {
        val result = statisticService.downloadExcelStatisticLogin(targetDate)
        return result
    }

    @Operation(summary = "통계 상세 엑셀 다운로드 (조회)")
    @GetMapping("/view/excel")
    fun downloadExcelStatisticPostView(
//        @RequestParam(name="actionType", required = false) actionType: String?,
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<ByteArray> {
        val result = statisticService.downloadExcelStatisticPostView(targetDate)
        return result
    }

    @Operation(summary = "통계 상세 엑셀 다운로드 (다운로드)")
    @GetMapping("/download/excel")
    fun downloadExcelStatisticDownload(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<ByteArray> {
        val result = statisticService.downloadExcelStatisticDownload(targetDate)
        return result
    }

    @Operation(summary = "통계 상세 엑셀 다운로드 (구독)")
    @GetMapping("/subscribe/excel")
    fun downloadExcelStatisticSubscribe(
        @RequestParam(name="targetDate", required = false) targetDate: String?,
    ): ResponseEntity<ByteArray> {
        val result = statisticService.downloadExcelStatisticSubscribe(targetDate)
        return result
    }
}