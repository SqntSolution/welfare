package com.tf.cms.biz.admin.board

import com.tf.cms.biz.admin.content.CategoryMenuSelectbox
import com.tf.cms.biz.admin.content.ContentMenuDto
import com.tf.cms.biz.admin.content.ContentPostDto
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.tf.cms.biz.admin.board
 * fileName       : AdminBoardController
 * author         : 정상철
 * date           : 2025-06-26
 * description    : Admin Board 관리 Controller
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-26        정상철       최초 생성
 */

@Tag(name = "[관리자] Board 관리 API")
@RestController
@RequestMapping("/api/v1/admin/board")
class AdminBoardController (
    private val adminBoardService: AdminBoardService
){
    private val logger = logger()

    @Operation(
        summary = "카테고리 및 메뉴 조회 (Post 를 담고 있는 메뉴들만)",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BoardContentDto::class))
            ])
        ]
    )
    @GetMapping("/category")
    fun findBoardList(
        @Parameter(hidden = true)
        @PageableDefault(page = 0, size = 10)pageable: Pageable,
    ): ResponseEntity<List<BoardContentDto>>{
        val result = adminBoardService.findBoardContentList();
        return ResponseEntity.ok(result)
    }

    @Operation(
        summary = "카테고리 및 메뉴를 selectbox로 만들어 주기 위해서 리스트를 보내줌.",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BoardCategoryMenuSelectbox::class))
            ])
        ]
    )
    @GetMapping("/category-selectbox")
    fun getCategorySelectbox(): ResponseEntity<List<BoardCategoryMenuSelectbox>> {
        val result = adminBoardService.getCategorySelectbox()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "board 목록 조회")
    @GetMapping("/list")
    fun findBoardList(): ResponseEntity<List<ContentBoardDto>> {
        val result = adminBoardService.findBoardList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "메뉴에 따른 board item 목록 조회")
    @GetMapping("/item-list/{menuId}")
    fun findBoardItemList(@PathVariable("menuId") menuId: Int): ResponseEntity<List<AdminBoardDto>> {
        logger.debug { "=== params : $menuId" }
        val result = adminBoardService.findBoardItemList( menuId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Board item 일괄 삭제")
    @DeleteMapping("/item-list")
    fun deletePostList(@RequestBody boardItemIdList: List<Int>): ResponseEntity<Any> {
        adminBoardService.deleteBoardList(boardItemIdList)
        return ResponseEntity.ok(HttpStatus.OK)
    }

}