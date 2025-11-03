package com.tf.cms.biz.admin.common

import com.tf.cms.biz.common.CacheEvictor
import com.tf.cms.common.utils.CodeHolder
import com.tf.cms.common.utils.HrUserCondition
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[관리자] 공통 API")
@RestController
@RequestMapping("/api/v1/admin/common")
class CommonAdminController(
    private val commonAdminService: CommonAdminService,
    private val menuIdHolder: MenuIdHolder,
    private val codeHolder: CodeHolder,
    private val cacheEvictor: CacheEvictor,
) {
    private val logger = logger()

    @Operation(summary = "메뉴 refresh")
    @GetMapping("/refresh-menu")
    fun refreshMenu(): ResponseEntity<String> {
        menuIdHolder.reload()
        return ResponseEntity.ok("refreshed")
    }

    @Operation(summary = "code refresh")
    @GetMapping("/refresh-code")
    fun refreshCode(): ResponseEntity<String> {
        codeHolder.reload()
        return ResponseEntity.ok("refreshed")
    }

    @Operation(summary = "모든 UserInfo cahe를 삭제")
    @GetMapping("/clear-all-user-caches")
    fun clearAllUserInfoCaches(): ResponseEntity<String> {
        cacheEvictor.clearAllUserInfoCache()
        return ResponseEntity.ok("All Userinfo Cache cleared.")
    }

    @Operation(summary = "팀 목록 조회")
    @GetMapping("/teams")
    fun findTeamList(): ResponseEntity<List<TeamInfo>> {
        val result = commonAdminService.findTeamList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "권한그룹 목록 조회")
    @GetMapping("/groups")
    fun findAuthGroupList(): ResponseEntity<List<AuthGroupInfo>> {
        val result = commonAdminService.findAuthGroupList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "사용자 목록 조회")
    @GetMapping("/members")
    fun findMemberList(): ResponseEntity<List<MemberInfo>> {
        val result = commonAdminService.findMemberList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "메뉴 목록 조회")
    @GetMapping("/menus")
    fun findMenuInfoList(): ResponseEntity<List<MenuInfo>> {
        val result = commonAdminService.findMenuInfoList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "그룹 및 조직 정보 조회")
    @GetMapping("/orgs")
    fun findGroupAndTeamList(): ResponseEntity<List<GroupAndTeamInfo>> {
        val result = commonAdminService.findGroupAndTeamList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "동적인 메뉴 목록 조회")
    @GetMapping("/dynamic-menus")
    fun findDynamicMenuInfoList(): ResponseEntity<List<MenuInfo>> {
        val result = commonAdminService.findDynamicMenuInfoList()
        return ResponseEntity.ok(result)
    }
}