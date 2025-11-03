package com.tf.cms.biz.user.board

import com.tf.cms.biz.user.cs.BbsQnaDto
import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.model.ResultValue
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.tf.cms.biz.user.board
 * fileName       : BoardController
 * author         : 정상철
 * date           : 2025-06-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

@Tag(name = "[사용자] Board API")
@RestController
@RequestMapping("/api/v1/user/board")
class BoardController (
    private val boardService: BoardService
){
    @Operation(
        summary = "submain 화면에서 Board 리스트 조회",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BoardDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "menu1", `in` = ParameterIn.PATH, required = true, description = "1차 메뉴 ID"),
            Parameter(name = "menu2", `in` = ParameterIn.PATH, required = false, description = "2차 메뉴 ID (선택)"),
            Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
            Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
            Parameter(name = "keywords", `in` = ParameterIn.QUERY),
            Parameter(name = "title", `in` = ParameterIn.QUERY),
        ]
    )
    @GetMapping(path=["/main/{menu1}/{menu2}", "/main/{menu1}", "/main/{menu1}/"])
    fun findBoardListByMenu1IdAndMenu2Id(
        @PathVariable(name="menu1",  required = true) menu1:String,
        @PathVariable(name="menu2", required = false) menu2:String?,
        @Parameter(hidden = true) cond: BoardSearchParams,
        @Parameter(hidden = true) @PageableDefault(page = 0, size = 10) pageable: Pageable,
        request: HttpServletRequest
    ): ResponseEntity<Page<BoardDto>> {
        val result = boardService.findBoardListByMenu1IdAndMenu2Id(menu1, menu2, cond, pageable, request)
        return ResponseEntity.ok(result)
    }


    @Operation(summary = "submain 화면에서 Board 단건 조회")
    @GetMapping(path=["/detail/{boardItemId}"])
    fun findBoardByBoardItemId(@PathVariable("boardItemId") boardItemId: Int): ResponseEntity<BoardDetailDto> {
        val result = boardService.findBoardByBoardItemId(boardItemId)
        return ResponseEntity.ok(result)
    }


    @Operation(
        summary = "submain 화면에서 Board Columns title 조회",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = BoardColumnsTitleDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "menu1", `in` = ParameterIn.PATH, required = true, description = "1차 메뉴 ID"),
            Parameter(name = "menu2", `in` = ParameterIn.PATH, required = false, description = "2차 메뉴 ID (선택)"),
        ]
    )
    @GetMapping(path=["/columns/{menu1}/{menu2}", "/columns/{menu1}", "/columns/{menu1}/"])
    fun getBoardColumnsByMenu1IdAndMenu2Id(
        @PathVariable(name="menu1", required = true) menu1:String,
        @PathVariable(name="menu2", required = false) menu2:String?,
    ): ResponseEntity<List<BoardColumnsTitleDto>> {
        val result = boardService.getBoardColumnsByMenu1IdAndMenu2Id(menu1, menu2);
        return ResponseEntity.ok(result)
    }
}