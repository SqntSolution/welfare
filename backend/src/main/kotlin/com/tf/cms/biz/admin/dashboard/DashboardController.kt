package com.tf.cms.biz.admin.dashboard

import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[관리자] Dashboard API")
@RestController
@RequestMapping("/api/v1/admin/dashboard")
class DashboardController(
    private val dashboardService: DashboardService,
) {
    private val logger = logger()

    @Operation(
        summary = "차트를 그리기 위해서 최근 일주일간의 접속자수 조회",
//        responses = [
//            ApiResponse(responseCode = "200", description = "ok", content = [
//                Content(schema = Schema(implementation = ContentMenuDto::class))
//            ])
//        ]
    )
    @GetMapping("/chart/visitor")
    fun getCategoryList(
        @RequestParam(value = "periodType", required = false, defaultValue = "DAILY") periodType: String
    ): ResponseEntity<List<VisitorStatisticDto>> {
        val result = dashboardService.getVisitorCountDataForChart(periodType)
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "Notice 목록 조회",
    )
    @GetMapping("/list/notice")
    fun getNoticeList(): ResponseEntity<MutableList<BbsNoticeDto>> {
        val result = dashboardService.getNoticeListByRecentOrder(5)
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "Q&A 목록 조회",
    )
    @GetMapping("/list/qna")
    fun getQnaList(): ResponseEntity<List<BbsQnaDto>> {
        val result = dashboardService.getQnaListByRecentOrder(5)
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "최신 Post 목록 조회",
    )
    @GetMapping("/list/post")
    fun findNewPostList(
        @Parameter(hidden = true) memberSearchParam: MemberSearchParam,
    ): ResponseEntity<List<PostDto>> {
        logger.debug { "=== memberSearchParam :  $memberSearchParam" }
        val result = dashboardService.getNewPosts(10, memberSearchParam)
        return ResponseEntity.ok(result)
    }

}