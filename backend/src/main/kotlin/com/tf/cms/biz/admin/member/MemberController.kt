package com.tf.cms.biz.admin.member

import com.tf.cms.biz.common.fileupload.FileUploadInfo
import com.tf.cms.biz.user.my.UserAlarmDto
import com.tf.cms.biz.user.my.UserAlarmRequestDto
import com.tf.cms.biz.user.my.UserPostDto
import com.tf.cms.biz.user.my.UserScrapDto
import com.tf.cms.common.jpa.dto.TbUserHistoryDto
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
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@Tag(name = "[관리자] 회원 정보 API")
@RestController
@RequestMapping("/api/v1/admin/member")
class MemberController(
        private val memberService: MemberService
) {
    private val logger = logger()

    @Operation(
            summary = "회원 목록 조회",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = MemberInfoDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY),
                Parameter(name = "notMatchingYn", `in` = ParameterIn.QUERY),
                Parameter(name = "teamCode", `in` = ParameterIn.QUERY),
                Parameter(name = "adminRoleCode", `in` = ParameterIn.QUERY),
                Parameter(name = "authGroupCode", `in` = ParameterIn.QUERY),
                Parameter(name = "keyword", `in` = ParameterIn.QUERY)
            ]
    )
    @GetMapping("")
    fun findMemberList(
            @Parameter(hidden = true) pageable: PagingRequest,
            @Parameter(hidden = true) memberSearchParams: MemberSearchParams
    ): ResponseEntity<Page<MemberInfoDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $memberSearchParams" }
        val result = memberService.findMemberList(pageable.toPageable(), memberSearchParams)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "유저 완전 삭제")
    @PreAuthorize("hasAnyRole('MASTER', 'OPERATOR')")
    @DeleteMapping("/{empId}")
    fun deleteMember(@PathVariable("empId") empId: String): ResponseEntity<Any> {
        memberService.deleteMember(empId)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "회원 이름 및 권한 조회")
    @GetMapping("/{userId}/info")
    fun findMemberById(@PathVariable("userId") userId: String): ResponseEntity<MemberNameAndRole> {
        logger.debug { "=== params : $userId" }
        val result = memberService.findMemberById(userId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "회원 프로필 조회")
    @GetMapping("/{userId}")
    fun findMemberProfile(@PathVariable("userId") userId: String): ResponseEntity<MemberProfileDto> {
        logger.debug { "=== params : $userId" }
        val result = memberService.findMemberProfile(userId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "프로필 이미지 변경")
    @PostMapping("/{userId}/avatar")
    fun updateAvatarImgPath(
            @PathVariable("userId") userId: String,
            @RequestBody fileUploadInfo: FileUploadInfo
    ): ResponseEntity<Any> {
        memberService.updateAvatarImgPath(userId, fileUploadInfo.path)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "프로필 이미지 삭제")
    @DeleteMapping("/{userId}/avatar")
    fun deleteAvatarImgPath(@PathVariable("userId") userId: String): ResponseEntity<Any> {
        memberService.updateAvatarImgPath(userId, "")
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
    @GetMapping("/{userId}/scrap")
    fun findUserScrapList(
            @PathVariable("userId") userId: String,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<UserScrapDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $keyword" }
        val result = memberService.findUserScrapList(userId, keyword, pageable.toPageable())
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "알람설정 조회")
    @GetMapping("/{userId}/alarm")
    fun findUserAlarm(@PathVariable("userId") userId: String): ResponseEntity<UserAlarmDto> {
        val userAlarm = memberService.findUserAlarm(userId)
        return ResponseEntity.ok(userAlarm)
    }

    @Operation(summary = "알람설정 수정")
    @PostMapping("/{userId}/alarm")
    fun updateUserAlarm(
            @PathVariable("userId") userId: String,
            @RequestBody dto: UserAlarmRequestDto
    ): ResponseEntity<Any> {
        memberService.updateUserAlarm(userId, dto)
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
    @GetMapping("/{userId}/history")
    fun findUserHistory(
            @PathVariable("userId") userId: String,
            @RequestParam(name="typeCode", required = false) typeCode: String?,
            @RequestParam(name="startDate", required = false) startDate: String?,
            @RequestParam(name="endDate", required = false) endDate: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<TbUserHistoryDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $typeCode, $startDate, $endDate" }
        val result = memberService.findUserHistory(userId, typeCode, startDate, endDate, pageable.toPageable())
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
    @GetMapping("/{userId}/post")
    fun findUserPost(
            @PathVariable("userId") userId: String,
            @RequestParam(name="openType", required = false) openType: String?,
            @RequestParam(name="keyword", required = false) keyword: String?,
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<UserPostDto>> {
        logger.debug { "=== params : ${pageable.getPageNumber()}, ${pageable.getPageSize()}, $openType, $keyword" }
        val result = memberService.findUserPost(userId, openType, keyword, pageable.toPageable())
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "Post 삭제")
    @DeleteMapping("/post/{postId}")
    fun deletePostList(@PathVariable("postId") postId: Int): ResponseEntity<Any> {
        memberService.deletePostById(postId)
        return ResponseEntity.ok(HttpStatus.OK)
    }

}