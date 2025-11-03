package com.tf.cms.biz.user.search

import com.tf.cms.common.jpa.dto.TbKeywordRecommendDto
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

@Tag(name = "[사용자] 통합검색 API")
@RestController
@RequestMapping("/api/v1/user/search")
class SearchController(
        private val searchService: SearchService
) {
    private val logger = logger()
    @Operation(
            summary = "통합검색 Post",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = Menu1GroupDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/post")
    fun searchPostList(
//            @Parameter(hidden = true) pageable: PagingRequest,
//            @RequestParam(name="keyword", required = false) keyword: List<String>?
            @RequestParam(name="keyword", required = false) keyword: String?
    ): ResponseEntity<List<Menu1GroupDto>> {
//        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword" }
//        val result = searchService.searchPostList(pageable.toPageable(), keyword)
        val result = searchService.searchPostList(keyword)
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "통합검색 File",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = SearchFileResponseDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/file")
    fun searchFileList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @RequestParam(name="keyword", required = false) keyword: List<String>?
    ): ResponseEntity<Page<SearchFileResponseDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword" }
        val result = searchService.searchFileList(pageable.toPageable(), keyword)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "추천 검색어 목록 조회")
    @GetMapping("/recommend/keyword")
    fun findRecommendKeywords(): ResponseEntity<List<TbKeywordRecommendDto>> {
        val result = searchService.findRecommendKeywords()
        return ResponseEntity.ok(result)
    }
}