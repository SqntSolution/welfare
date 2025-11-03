package com.tf.cms.biz.user.main

import com.tf.cms.biz.common.Menu
import com.tf.cms.biz.user.board.BoardDto
import com.tf.cms.common.model.ResultValue
import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.PageImpl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] SubMain 페이지의 API")
@RestController
@RequestMapping("/api/v1/user/sub")
class SubmainPageController(
    private val submainPageService: SubmainPageService,
) {
    private val logger = logger()

    /*
        userId: String?, authGroupCds: List<String>?,
        menu1: String,
        menu2: String?,
        nationConditions: List<String>? = null, // 국가
        topicConditions: List<String>? = null,  // 주제
        startDateCondition: String? = null, // 등록시작일
        endDateCondition: String? = null, // 등록종료일
        fetchSize: Int,
     */
    @Operation(
        summary = "검색조건이 있는 Posts 목록 조회",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = PostDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "keyword", `in` = ParameterIn.PATH, required = true, description = "keyword"),
//            Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
//            Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
        ]
    )
//    @Operation(summary = "검색조건이 있는 Posts 목록 조회")
    @GetMapping( path = ["/post/search"])
    fun getSearchPosts(paging: PagingRequest_8, @ModelAttribute param: SubmainSearchParam): ResponseEntity<PageImpl<PostDto>> {
        logger.info { "=== paging : ${paging}" }
        logger.info { "=== param : ${param}" }

        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val posts = submainPageService.getSubpageTopSearchablePosts(
            userId = userInfo.id,
            authGroupCds = userInfo.authGroup,
            searchParam = param,
            pagingRequest = paging
        )
        return ResponseEntity.ok(posts)
    }

    @Operation(summary = "검색조건이 있는 File 목록 조회")
    @GetMapping( path = ["/file/search"])
    fun getSearchFiles(paging: PagingRequest_8, @ModelAttribute param: SubmainSearchParam): ResponseEntity<PageImpl<FileDto>> {
        logger.info { "=== paging : ${paging}" }
        logger.info { "=== param : ${param}" }

        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val files = submainPageService.getSubpageFiles(
            userId = userInfo.id,
            authGroupCds = userInfo.authGroup,
            searchParam = param,
            pagingRequest = paging
        )
        return ResponseEntity.ok(files)
    }

    @Operation(summary = "Recommend Posts 목록 조회")
    @GetMapping(path=["/posts/recommend/{menu1}", "/posts/recommend/{menu1}/{menu2}"])
    fun getRecommendPosts(@PathVariable("menu1")menu1:String, @PathVariable(name="menu2", required = false)menu2:String?, ): ResponseEntity<List<PostSimpleDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val posts = submainPageService.getSubpageTopRecommends(userInfo.authGroup, menu1, menu2,  5)
        return ResponseEntity.ok(posts)
    }

    @Operation(summary = "Scrap Posts 목록 조회")
    @GetMapping(path=["/posts/scrap/{menu1}/{menu2}", "/posts/scrap/{menu1}"])
    fun getScrapTop5Posts(@PathVariable("menu1")menu1:String, @PathVariable(name="menu2", required = false)menu2:String?, ): ResponseEntity<List<PostSimpleDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val posts = submainPageService.getSubpageTopScraps(userInfo.authGroup!!, menu1, menu2,  5)
        return ResponseEntity.ok(posts)
    }

    @Operation(summary = "submain 화면에서 administrator custom zone 영역 조회")
    @GetMapping(path=["/custom-area/{menu1}/{menu2}", "/custom-area/{menu1}", "/custom-area/{menu1}/"])
    fun getSubmainCustomAreaData(@PathVariable("menu1")menu1:String, @PathVariable(name="menu2", required = false)menu2:String?, ): ResponseEntity<ResultValue<String>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val contents = submainPageService.getSubpageCustomAreaData(userInfo.authGroup!!, menu1, menu2)
        return ResponseEntity.ok(ResultValue(contents))
    }

    @Operation(summary = "submain 화면에서 administrator custom zone 영역 저장")
    @PostMapping(path=["/custom-area/{menu1}/{menu2}", "/custom-area/{menu1}", "/custom-area/{menu1}/"])
    fun saveSubmainCustomAreaData(@PathVariable("menu1")menu1:String, @PathVariable(name="menu2", required = false)menu2:String?,
                                  @RequestBody param:CustomAreaSaveParam, ): ResponseEntity<String> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        submainPageService.saveSubpageCustomAreaData(userInfo.authGroup!!, menu1, menu2, param.contents  )
        return ResponseEntity.ok("ok")
    }

    @DefaultConstructor
    data class CustomAreaSaveParam(var contents:String?)

    @Operation(
        summary = "metaKey 별 필터 목록을 만들기 위한 meta-info 그룹핑",
        responses = [
            ApiResponse(responseCode = "200", description = "ok", content = [
                Content(schema = Schema(implementation = MetaInfoDto::class))
            ])
        ],
        parameters = [
            Parameter(name = "metaKey", `in` = ParameterIn.PATH, required = true, description = "metaKey"),
//            Parameter(name = "menu2", `in` = ParameterIn.PATH, required = false, description = "2차 메뉴 ID (선택)"),
//            Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
//            Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
//            Parameter(name = "keywords", `in` = ParameterIn.QUERY),
        ]
    )
    @GetMapping(path=["/meta-info-group/{menu1}/{menu2}", "/meta-info-group/{menu1}", "/meta-info-group/{menu1}/"])
    fun findMetaValuesByMetaKey(
        @PathVariable(name="menu1")menu1:String,
        @PathVariable(name="menu2", required = false)menu2:String?,
//        @RequestParam("metaKey") metaKey: String
    ): ResponseEntity<List<MetaInfoGroupDto>> {
        val metaInfoGroup = submainPageService.findMetaValuesByMetaKey(menu1, menu2)
        return ResponseEntity.ok(metaInfoGroup)
    }

}
