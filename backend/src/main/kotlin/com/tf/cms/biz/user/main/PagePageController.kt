package com.tf.cms.biz.user.main

import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.jpa.dto.TbPostContentsDetailDto
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] 메뉴의 Page에 대한 조회/저장")
@RestController
@RequestMapping("/api/v1/user/page")
class PageForMenuController(
    private val pageForMenuService: PagePageService,
    private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    @Operation(summary = "Page 한건에 대한 기본 정보 조회")
//    @GetMapping(path=["/info/{postId}"])
    @GetMapping(path=["/info/{menu1}/{menu2}"])
    fun getPostInfo(@PathVariable("menu1")menu1:String, @PathVariable("menu2")menu2:String ): ResponseEntity<PostDto> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val post = pageForMenuService.getPageInfo(userInfo.id!!, userInfo.authGroup, menu1, menu2)
        return ResponseEntity.ok(post)
    }

    @Operation(summary = "Page 한건에 대한 컨텐츠 내용 조회")
    @GetMapping(path=["/detail/{postId}"])
    fun getPostDetails(@PathVariable("postId")postId:Int ): ResponseEntity<List<TbPostContentsDetailDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val details = pageForMenuService.getPageContentsDetails(userInfo.authGroup, postId)
//        pageForMenuService.pushToHistoryQueueForPageView(postId)
        return ResponseEntity.ok(details)
    }


    @Operation(summary = "Page 한건에 대한 메타(국가,주제,tag) 정보 조회")
    @GetMapping(path=["/meta/{postId}"])
    fun getPostMetas(@PathVariable("postId")postId:Int ): ResponseEntity<MutableMap<String, List<ValueAndLabel>>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val metas = pageForMenuService.getPageMetas(userInfo.authGroup, postId)
        return ResponseEntity.ok(metas)
    }

    @Operation(summary = "Page 저장")
    @PostMapping(path=[""])
    fun savePost( @RequestBody param:PageSaveParam): ResponseEntity<List<Int>> {
        // 권한 체크
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        if(userInfo.role!= TheRole.ROLE_MASTER && userInfo.role!=TheRole.ROLE_OPERATOR){
            throw BizException("권한이 없습니다.(마스터나 운영관리자만 가능함)")
        }
        val postId = pageForMenuService.savePage(param)

        return ResponseEntity.ok(listOf(postId))
    }


    
}

@DefaultConstructor
data class PageSaveParam (
    val info:PostDto,
    val detail: List<TbPostContentsDetailDto>? = null,
    val insertedFiles:List<TbAttachedFileDto>? = null,
    val deletedFileIds:List<Int>? = null,
    var nations:List<String>? = null,
    var topics:List<String>? = null,
    val tags:List<String>? = null,
)