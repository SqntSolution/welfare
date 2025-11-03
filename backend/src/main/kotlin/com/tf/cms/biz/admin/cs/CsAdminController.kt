package com.tf.cms.biz.admin.cs

import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.model.MenuContentType
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
import java.util.*

@Tag(name = "[관리자] 고객센터 API")
@RestController
@RequestMapping("/api/v1/admin/cs")
class CsAdminController(
        private val csAdminService: CsAdminService,
        private val menuIdHolder: MenuIdHolder
) {
    private val logger = logger()

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
    fun findBbsNormalList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
            @RequestParam(name="authLevel", required = false) authLevel: String?,
            @RequestParam(name="openType", required = false) openType: String?
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "notice")
        logger.debug { "=== menuInfo : $menuInfo" }
        val booleanOpenType = when (openType?.lowercase(Locale.getDefault())) {
            "y" -> true
            "n" -> false
            else -> null
        }
        val result = csAdminService.findBbsNormalList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision, booleanOpenType)
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
    fun findBbsNormalList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
            @RequestParam(name="openType", required = false) openType: String?
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "faq")
        logger.debug { "=== menuInfo : $menuInfo" }
        val booleanOpenType = when (openType?.lowercase(Locale.getDefault())) {
            "y" -> true
            "n" -> false
            else -> null
        }
        val result = csAdminService.findBbsNormalList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision, booleanOpenType)
        return ResponseEntity.ok(result)
    }

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
    fun findBbsNormalReleaseList(
        @Parameter(hidden = true) pageable: PagingRequest,
        @RequestParam(name="keyword", required = false) keyword: String?,
        @RequestParam(name="metaDivision", required = false) metaDivision: String?,
        @RequestParam(name="authLevel", required = false) authLevel: String?,
        @RequestParam(name="openType", required = false) openType: String?
    ): ResponseEntity<Page<BbsNormalDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision" }
        val menuInfo = menuIdHolder.getMenuFromPath("cs-center", "press-release")
        logger.debug { "=== menuInfo : $menuInfo" }
        val booleanOpenType = when (openType?.lowercase(Locale.getDefault())) {
            "y" -> true
            "n" -> false
            else -> null
        }
        val result = csAdminService.findBbsNormalList(pageable.toPageable(), menuInfo?.id!!, keyword, metaDivision, booleanOpenType)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "게시판 단건 조회")
    @GetMapping("/bbs/{normalBbsId}")
    fun findBbsNormal(@PathVariable("normalBbsId") normalBbsId: Int): ResponseEntity<BbsNormalDto> {
        logger.debug { "=== params : $normalBbsId" }
        val result = csAdminService.findBbsNormal(normalBbsId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "게시판 단건 저장 (공지사항)")
    @PostMapping("/bbs/notice")
    fun saveBbsNormalNotice(@Valid @RequestBody bbsNormalRequestDto: BbsNormalRequestDto): ResponseEntity<Any> {
        logger.debug { "=== params : $bbsNormalRequestDto" }
        csAdminService.saveBbsNormal(MenuContentType.NOTICE, bbsNormalRequestDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "게시판 단건 저장 (FAQ)")
    @PostMapping("/bbs/faq")
    fun saveBbsNormalFaq(@Valid @RequestBody bbsNormalRequestDto: BbsNormalRequestDto): ResponseEntity<Any> {
        logger.debug { "=== params : $bbsNormalRequestDto" }
        csAdminService.saveBbsNormal(MenuContentType.FAQ, bbsNormalRequestDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "게시판 단건 저장 (보도자료)")
    @PostMapping("/bbs/release")
    fun saveBbsNormalRelease(@Valid @RequestBody bbsNormalRequestDto: BbsNormalRequestDto): ResponseEntity<Any> {
        logger.debug { "=== params : $bbsNormalRequestDto" }
        csAdminService.saveBbsNormal(MenuContentType.RELEASE, bbsNormalRequestDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "게시판 단건 삭제")
    @DeleteMapping("/bbs/{normalBbsId}")
    fun deleteBbsNormal(@PathVariable("normalBbsId") normalBbsId: Int): ResponseEntity<Any> {
        logger.debug { "=== params : $normalBbsId" }
        csAdminService.deleteBbsNormal(normalBbsId)
        return ResponseEntity.ok(HttpStatus.OK)
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
    fun findBbsQnaList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @RequestParam(name="metaDivision", required = false) metaDivision: String?,
            @RequestParam(name="responseStatus", required = false) responseStatus: String?,
    ): ResponseEntity<Page<BbsQnaDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword, $metaDivision, $responseStatus" }
        val responseYn = when (responseStatus?.lowercase(Locale.getDefault())) {
            "y" -> true
            "n" -> false
            else -> null
        }
        val result = csAdminService.findBbsQnaList(pageable.toPageable(), keyword, metaDivision, responseYn)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Q&A 단건 조회")
    @GetMapping("/qna/{qnaBbsId}")
    fun findBbsQna(@PathVariable("qnaBbsId") qnaBbsId: Int): ResponseEntity<BbsQnaDto> {
        logger.debug { "=== params : $qnaBbsId" }
        val result = csAdminService.findBbsQna(qnaBbsId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Q&A 답변 등록")
    @PostMapping("/qna/{qnaBbsId}")
    fun insertBbsQnaQuestion(
            @PathVariable("qnaBbsId") qnaBbsId: Int,
            @Valid @RequestBody dto: BbsQnaResponseDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $qnaBbsId, $dto" }
        csAdminService.insertBbsQnaAnswer(qnaBbsId, dto.responseContents)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Q&A 답변 수정")
    @PostMapping("/qna/{qnaBbsId}/update")
    fun updateBbsQnaAnswer(
            @PathVariable("qnaBbsId") qnaBbsId: Int,
            @Valid @RequestBody dto: BbsQnaResponseDto
    ): ResponseEntity<Any> {
        logger.debug { "=== params : $qnaBbsId, $dto" }
        csAdminService.updateBbsQnaAnswer(qnaBbsId, dto.responseContents)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Q&A 질문 삭제")
    @DeleteMapping("/qna/{qnaBbsId}")
    fun deleteBbsQnaQuestion(@PathVariable("qnaBbsId") qnaBbsId: Int): ResponseEntity<Any> {
        logger.debug { "=== params : $qnaBbsId" }
        csAdminService.deleteBbsQnaQuestion(qnaBbsId)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}