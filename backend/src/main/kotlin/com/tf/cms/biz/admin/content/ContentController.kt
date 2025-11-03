package com.tf.cms.biz.admin.content

import com.tf.cms.common.jpa.dto.TbKeywordRecommendDto
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[관리자] 콘텐츠 API")
@RestController
@RequestMapping("/api/v1/admin/contents")
class ContentController(
        private val contentService: ContentService
) {
    private val logger = logger()

    @Operation(
        summary = "카테고리 및 메뉴 조회",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = ContentMenuDto::class))
            ])
        ]
    )
    @GetMapping("/category")
    fun findCategoryList(): ResponseEntity<List<ContentCategoryDto>> {
        val result = contentService.findCategoryList()
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "카테고리 및 메뉴를 selectbox로 만들어 주기 위해서 리스트를 보내줌.",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = ContentMenuDto::class))
            ])
        ]
    )
    @GetMapping("/category-selectbox")
    fun getCategorySelectbox(): ResponseEntity<List<CategoryMenuSelectbox>> {
        val result = contentService.getCategorySelectbox()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Post 목록 조회")
    @GetMapping("/post")
    fun findPostList(): ResponseEntity<List<ContentPostDto>> {
        val result = contentService.findPostList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Post 일괄 메뉴 이동")
    @PostMapping("/post/move")
    fun updateMenuOfPost(@Valid @RequestBody dto: PostMoveMenuDto): ResponseEntity<Any> {
        logger.debug { "=== params : $dto" }
        contentService.updateMenuOfPost(dto.menuId, dto.postIdList)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Post 일괄 삭제")
    @DeleteMapping("/post")
    fun deletePostList(@RequestBody postIdList: List<Int>): ResponseEntity<Any> {
        contentService.deletePostList(postIdList)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "Post openType 저장")
    @PostMapping("/post/open-type/{postId}")
    fun updatePostOpenType(@PathVariable("postId") postId: Int, @Valid @RequestBody input: PostContentsInput): ResponseEntity<Any> {
        logger.debug { "=== params : $postId, $input" }
        contentService.updatePostOpenType(postId, input.openType!!)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "추천 Post 목록 조회")
    @GetMapping("/recommend/post/{menuId}")
    fun findRecommendPostList(@PathVariable("menuId") menuId: Int): ResponseEntity<List<ContentPostDto>> {
        logger.debug { "=== params : $menuId" }
        val result = contentService.findRecommendPostList(menuId)
        return ResponseEntity.ok(result)
    }

//    @Operation(summary = "추천 Post 저장")
//    @PostMapping("/recommend/post")
//    fun saveRecommendPost(@Valid @RequestBody dto: RecommendPostRequestDto): ResponseEntity<Any> {
//        logger.debug { "=== params : $dto" }
//        contentService.saveRecommendPost(dto.saveList, dto.deleteList)
//        return ResponseEntity.ok(HttpStatus.OK)
//    }
    @Operation(summary = "추천 Post 저장")
    @PostMapping("/recommend/post")
    fun saveRecommendPost(@Valid @RequestBody recommendPostSaveDto: RecommendPostSaveDto): ResponseEntity<Any> {
        logger.debug { "=== params : $recommendPostSaveDto" }
        contentService.saveRecommendPost(recommendPostSaveDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "추천 검색어 목록 조회")
    @GetMapping("/recommend/keyword")
    fun findRecommendKeywordList(): ResponseEntity<List<TbKeywordRecommendDto>> {
        val result = contentService.findRecommendKeywordList()
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "추천 검색어 저장",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = KeywordInput::class))
                ])
            ]
    )
    @PostMapping("/recommend/keyword")
    fun saveRecommendKeyword(@Valid @RequestBody keywordList: RecommendKeywordInput): ResponseEntity<Any> {
        logger.debug { "=== params : $keywordList" }
        contentService.saveRecommendKeyword(keywordList.keywords?.map { it.keyword!! }!!)
        return ResponseEntity.ok(HttpStatus.OK)
    }
}