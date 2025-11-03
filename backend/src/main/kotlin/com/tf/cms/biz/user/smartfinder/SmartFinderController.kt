package com.tf.cms.biz.user.smartfinder

import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] SmartFinder API")
@RestController
@RequestMapping("/api/v1/user/smart-finder")
class SmartFinderController(
        private val smartFinderService: SmartFinderService
) {
    private val logger = logger()

    @Operation(
            summary = "SmartFinder Post 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = SmartFinderPostDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
                Parameter(name = "nations", `in` = ParameterIn.QUERY),
                Parameter(name = "topics", `in` = ParameterIn.QUERY),
                Parameter(name = "startDate", `in` = ParameterIn.QUERY),
                Parameter(name = "endDate", `in` = ParameterIn.QUERY),
                Parameter(name = "keywords", `in` = ParameterIn.QUERY),
                Parameter(name = "order", `in` = ParameterIn.QUERY),
                Parameter(name = "tag", `in` = ParameterIn.QUERY),
            ]
    )
    @GetMapping("/post")
    fun findPostList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @Parameter(hidden = true) smartFinderParams: SmartFinderParams
    ): ResponseEntity<Page<SmartFinderPostDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $smartFinderParams" }
        val result = smartFinderService.findPostList(pageable.toPageable(), smartFinderParams)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "SmartFinder File 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = SmartFinderFileDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
                Parameter(name = "nations", `in` = ParameterIn.QUERY),
                Parameter(name = "topics", `in` = ParameterIn.QUERY),
                Parameter(name = "startDate", `in` = ParameterIn.QUERY),
                Parameter(name = "endDate", `in` = ParameterIn.QUERY),
                Parameter(name = "fileTypes", `in` = ParameterIn.QUERY),
                Parameter(name = "keywords", `in` = ParameterIn.QUERY),
                Parameter(name = "order", `in` = ParameterIn.QUERY),
                Parameter(name = "tag", `in` = ParameterIn.QUERY),
            ]
    )
    @GetMapping("/file")
    fun findFileList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @Parameter(hidden = true) smartFinderParams: SmartFinderParams
    ): ResponseEntity<Page<SmartFinderFileDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $smartFinderParams" }
        val result = smartFinderService.findFileList(pageable.toPageable(), smartFinderParams)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "Smart Finder Post 조회 (Recommend)",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = SmartFinderPostDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
                Parameter(name = "keywords", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/recommend")
    fun findRecommendPostList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @Parameter(hidden = true) params: SmartFinderKeywords
    ): ResponseEntity<Page<SmartFinderPostDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $params" }
        val result = smartFinderService.findRecommendPostList(pageable.toPageable(), params)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "Smart Finder Post 조회 (Tag로 조회)",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = SmartFinderPostDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
            ]
    )
    @GetMapping("/tag")
    fun findPostListByTag(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam("tag") tag: String
    ): ResponseEntity<Page<SmartFinderPostDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $tag" }
        val result = smartFinderService.findPostListByTag(pageable.toPageable(), tag)
        return ResponseEntity.ok(result)
    }
}