package com.tf.cms.biz.user.my

import com.tf.cms.biz.common.MenuAuthByUser
import com.tf.cms.biz.common.ThumbnailRetriever
import com.tf.cms.biz.common.fileupload.FileUploadInfo
import com.tf.cms.common.jpa.dto.TbUserHistoryDto
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] MyPage API")
@RestController
@RequestMapping("/api/v1/user/my")
class MyPageController(
        private val myPageService: MyPageService,
    private val thumbnailRetriever: ThumbnailRetriever,
) {
    private val logger = logger()

    @Operation(
            summary = "프로필 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [Content(schema = Schema(implementation = MenuAuthByUser::class))])
            ]
    )
    @GetMapping("")
    fun getMyProfile(): ResponseEntity<UserProfile> {
        val result = myPageService.findMyProfile()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "프로필 이미지 변경")
    @PostMapping("/avatar")
    fun updateAvatarImgPath(@RequestBody fileUploadInfo: FileUploadInfo): ResponseEntity<Any> {
        myPageService.updateAvatarImgPath(fileUploadInfo.path)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "프로필 이미지 삭제")
    @DeleteMapping("/avatar")
    fun deleteAvatarImgPath(): ResponseEntity<Any> {
        myPageService.updateAvatarImgPath("")
        val loginUserInfo = UserInfoHelper.getLoginUserInfo()
        thumbnailRetriever.processThumbnail(loginUserInfo?.id!!)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(
            summary = "스크랩 목록 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [Content(schema = Schema(implementation = UserScrapDto::class))])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/scrap")
    fun getMyScrap(
            @RequestParam(name="keyword", required = false) keyword: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<UserScrapDto>> {
        logger.debug { "=== pageable.number, pageable.size, keyword : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword" }
        val result = myPageService.findUserScrapList(keyword, pageable.toPageable())
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "알람설정 조회")
    @GetMapping("/alarm")
    fun getMyAlarm(): ResponseEntity<UserAlarmDto> {
        val userAlarm = myPageService.findUserAlarm()
        return ResponseEntity.ok(userAlarm)
    }

    @Operation(summary = "알람설정 수정")
    @PostMapping("/alarm")
    fun updateMyAlarm(@RequestBody dto: UserAlarmRequestDto): ResponseEntity<Any> {
        myPageService.updateUserAlarm(dto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(
            summary = "이력 목록 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [Content(schema = Schema(implementation = TbUserHistoryDto::class))])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/history")
    fun getMyHistory(
            @RequestParam(name="typeCode", required = false) typeCode: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<TbUserHistoryDto>> {
        logger.debug { "=== pageable.number, pageable.size, typeCode : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $typeCode" }
        val result = myPageService.findUserHistory(typeCode, pageable.toPageable())
        return ResponseEntity.ok(result)
    }

    @Operation(
            summary = "나의 게시글 목록 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [Content(schema = Schema(implementation = UserPostDto::class))])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("/post")
    fun getMyPost(
            @RequestParam(name="openType", required = false) openType: String?,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<UserPostDto>> {
        logger.debug { "=== pageable.number, pageable.size, openType, keyword : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $openType, $keyword" }
        val result = myPageService.findUserPost(openType, keyword, pageable.toPageable())
        return ResponseEntity.ok(result)
    }
}