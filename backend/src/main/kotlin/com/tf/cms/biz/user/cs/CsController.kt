package com.tf.cms.biz.user.cs

import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.MenuIdHolder
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

@Tag(name = "[사용자] 고객센터 API")
@RestController
@RequestMapping("/api/v1/user/cs")
class CsController(
        private val csService: CsService,
        private val menuIdHolder: MenuIdHolder
) {
    private val logger = logger()

    @Operation(summary = "고객센터 Main 목록 조회")
    @GetMapping("")
    fun getCsCenterMain(): ResponseEntity<CsCenterMainDto> {
        val result = csService.findCsCenterMain()
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "게시판 목록 조회 (공지사항)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BbsNormalDto::class)),
                Content(schema = Schema(implementation = TbAttachedFileDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
            Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
        ]
    )
    @GetMapping("/bbs/notice")
    fun getBbsNormalNoticeList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "notice")
        logger.debug { "=== menuInfo : $menuInfo" }
        val result = csService.findBbsNormalList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "게시판 목록 조회 (FAQ)",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = BbsNormalDto::class)),
                    Content(schema = Schema(implementation = TbAttachedFileDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/bbs/faq")
    fun getBbsNormalFaqList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "faq")
        logger.debug { "=== menuInfo : $menuInfo" }
        val result = csService.findBbsNormalList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "게시판 단건 조회")
    @GetMapping("/bbs/{normalBbsId}")
    fun getBbsNormal(@PathVariable("normalBbsId") normalBbsId: Int): ResponseEntity<BbsNormalDto> {
        logger.debug { "=== params : $normalBbsId" }
        val result = csService.findBbsNormal(normalBbsId)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "Q&A 목록 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = BbsQnaDto::class)),
                    Content(schema = Schema(implementation = TbAttachedFileDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/qna")
    fun getBbsQnaList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
            @RequestParam(name="onlyMyOwn", required = false) onlyMyOwn: Boolean?,
    ): ResponseEntity<Page<BbsQnaDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val result = csService.findBbsQnaList(pageable.toPageable(), keyword, metaDivision, onlyMyOwn)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Q&A 단건 조회")
    @GetMapping("/qna/{qnaBbsId}")
    fun getBbsQna(@PathVariable("qnaBbsId") qnaBbsId: Int): ResponseEntity<BbsQnaDto> {
        logger.debug { "=== params : $qnaBbsId" }
        val result = csService.findBbsQna(qnaBbsId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Q&A 질문 등록")
    @PostMapping("/qna")
    fun insertBbsQnaQuestion(@Valid @RequestBody bbsQnaQuestionDto: BbsQnaQuestionDto): ResponseEntity<Any> {
        logger.debug { "=== params : $bbsQnaQuestionDto" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "qna")
        csService.insertBbsQnaQuestion(menuInfo?.id!!, bbsQnaQuestionDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Q&A 질문 수정")
    @PostMapping("/qna/{qnaBbsId}")
    fun updateBbsQnaQuestion(
            @PathVariable("qnaBbsId") qnaBbsId: Int,
            @Valid @RequestBody bbsQnaQuestionDto: BbsQnaQuestionDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $qnaBbsId, $bbsQnaQuestionDto" }
        csService.updateBbsQnaQuestion(qnaBbsId, bbsQnaQuestionDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Q&A 질문 삭제")
    @DeleteMapping("/qna/{qnaBbsId}")
    fun deleteBbsQnaQuestion(@PathVariable("qnaBbsId") qnaBbsId: Int): ResponseEntity<Any> {
        logger.debug { "=== params : $qnaBbsId" }
        csService.deleteBbsQnaQuestion(qnaBbsId)
        return ResponseEntity.ok(HttpStatus.OK)
    }

//    @Operation(summary = "About Con-Act 조회")
//    @GetMapping("/about")
//    fun findAboutConAct(): ResponseEntity<CsContentsDto> {
//        val result = csService.findCsContents(MenuContentType.ABOUT)
//        return ResponseEntity.ok(result)
//    }
//
//    @Operation(summary = "User Manual 조회")
//    @GetMapping("/manual")
//    fun findUserManual(): ResponseEntity<CsContentsDto> {
//        val result = csService.findCsContents(MenuContentType.MANUAL)
//        return ResponseEntity.ok(result)
//    }


    @Operation(
        summary = "게시판 목록 조회 (보도자료)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BbsNormalDto::class)),
                Content(schema = Schema(implementation = TbAttachedFileDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
            Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
        ]
    )
    @GetMapping("/bbs/release")
    fun getBbsNormalReleaseList(
        @Parameter(hidden = true) pageable: PagingRequest,
        @RequestParam(name="keyword", required = false) keyword: String?,
        @RequestParam(name="metaDivision", required = false) metaDivision: String?,
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "press-release")
        logger.debug { "=== menuInfo : $menuInfo" }
        val result = csService.getBbsNormalReleaseList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision)
        return ResponseEntity.ok(result)
    }
}