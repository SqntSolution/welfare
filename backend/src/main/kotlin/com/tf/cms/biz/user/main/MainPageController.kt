package com.tf.cms.biz.user.main

import com.tf.cms.common.jpa.dto.TbBannerDto
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] Main API")
@RestController
@RequestMapping("/api/v1/user/main")
class MainPageController(
    private val mainPageService: MainPageService,
) {
    private val logger = logger()

    @Operation(summary = "배너 목록 조회")
//    @GetMapping("/banners/{menu1}/{menu2}")
    @GetMapping(path=["/banners", "/banners/{menu1}/{menu2}", "/banners/{menu1}"])
    fun getBanners(@PathVariable("menu1", required = false) menu1:String?, @PathVariable(name="menu2", required = false) menu2:String?): ResponseEntity<MutableList<TbBannerDto>> {
        val banners = mainPageService.getBanners(menu1, menu2)
        return ResponseEntity.ok(banners)
    }

    @Operation(summary = "New Posts 목록 조회")
    @GetMapping("/posts/new")
    fun getNewPosts(): ResponseEntity<List<PostDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val posts = mainPageService.getMainpageNewPosts(userInfo.id, userInfo.authGroup, 8)
        return ResponseEntity.ok(posts)
    }

    @Operation(summary = "Recommend Posts 목록 조회")
    @GetMapping("/posts/recommend")
    fun getRecommendPosts(): ResponseEntity<List<PostDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val posts = mainPageService.getMainpageRecentRecommendations(userInfo.id, userInfo.authGroup, 8)
        return ResponseEntity.ok(posts)
    }

    @Operation(summary = "Notice 목록 조회")
    @GetMapping("/notice")
    fun getNoticeList(): ResponseEntity<MutableList<BbsNoticeDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val records = mainPageService.getNoticeListByMostViews(5)
        return ResponseEntity.ok(records)
    }

    @Operation(summary = "FAQ 목록 조회")
    @GetMapping("/faq")
    fun getFaqList(): ResponseEntity<List<BbsFaqDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val records = mainPageService.getFaqList(5)
        return ResponseEntity.ok(records)
    }

    @Operation(summary = "카테고리 별 New Posts 목록 조회")
    @GetMapping("/posts/new/{menu1}")
    fun getNewPostsByMenu1(
        @PathVariable(name="menu1", required = false) menu1:String,
    ): ResponseEntity<List<PostDto>> {
        val posts = mainPageService.getNewPostsByMenu1(menu1)
        return ResponseEntity.ok(posts)
    }

}