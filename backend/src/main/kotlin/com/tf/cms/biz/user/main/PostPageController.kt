package com.tf.cms.biz.user.main

import com.tf.cms.biz.user.board.BoardDto
import com.tf.cms.biz.user.board.BoardSearchParams
import com.tf.cms.common.jpa.dto.*
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.DefaultConstructor
import com.tf.cms.common.utils.MenuIdAndPath
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[사용자] Post API")
@RestController
@RequestMapping("/api/v1/user/post")
class PostPageController(
    private val postPageService: PostPageService,
    private val menuIdHolder: MenuIdHolder,
    private val postCommentService: PostCommentService,
) {
    private val logger = logger()
    @Operation(summary = "Post 한건에 대한 기본 정보 조회")
    @GetMapping(path=["/info/{postId}"])
    fun getPostInfo(@PathVariable("postId")postIdStr:String ): ResponseEntity<PostDto> {
        val postId = try {
            postIdStr.toInt()
        }catch (e:Exception){
            throw BizException("파라미터 오류")
        }
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val post = postPageService.getPostInfo(userInfo.id!!, userInfo.authGroup, postId)
        return ResponseEntity.ok(post)
    }

    @Operation(summary = "Post 한건에 대한 컨텐츠 내용 조회")
    @GetMapping(path=["/detail/{postId}"])
    fun getPostDetails(@PathVariable("postId")postId:Int ): ResponseEntity<List<TbPostContentsDetailDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val details = postPageService.getPostContentsDetails(userInfo.authGroup, postId)
        postPageService.pushToHistoryQueueForPageView(postId)
        return ResponseEntity.ok(details)
    }

    @Operation(summary = "Post 한건에 대한 댓글(comment) 조회")
    @GetMapping(path=["/comment/{postId}"])
    fun getPostComments(@PathVariable("postId")postIdStr:String ): ResponseEntity<MutableList<PostCommentDto>> {
        val postId = try {
            postIdStr.toInt()
        }catch (e:Exception){
            throw BizException("파라미터 오류")
        }
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val comments = postCommentService.getPostComments(userInfo.authGroup, postId)
        return ResponseEntity.ok(comments)
    }

    @Operation(summary = "댓글 등록")
    @PostMapping(path=["/comment"])
    fun saveComment( @RequestBody param:CommentSaveParam): ResponseEntity<String> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        postCommentService.insertPostComment(userInfo.authGroup, param.postId!!, param.origSeq!!, param.comment!!  )

        return ResponseEntity.ok("ok")
    }

    @Operation(summary = "댓글 삭제")
    @DeleteMapping(path=["/comment/{commentId}"])
    fun saveComment( @PathVariable("commentId")commentId:Int ): ResponseEntity<String> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        postCommentService.deletePostComment(userInfo.authGroup, commentId )

        return ResponseEntity.ok("ok")
    }

    @Operation(summary = "Post 한건에 대한 첨부파일 목록 조회")
    @GetMapping(path=["/file/{postId}"])
    fun getPostFiles(@PathVariable("postId")postId:Int ): ResponseEntity<MutableList<TbAttachedFileDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val files = postPageService.getAttachedFiles(userInfo.authGroup, postId)
        return ResponseEntity.ok(files)
    }

    @Operation(summary = "Post 한건에 대한 메타(국가,주제,tag) 정보 조회")
    @GetMapping(path=["/meta/{postId}"])
    fun getPostMetas(@PathVariable("postId")postId:Int ): ResponseEntity<MutableMap<String, List<ValueAndLabel>>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val metas = postPageService.getPostMetas(userInfo.authGroup, postId)
        return ResponseEntity.ok(metas)
    }

    @Operation(summary = "Post의 주제가 같은 Post들 조회")
    @GetMapping(path=["/related-topic/{postId}"])
    fun getPostRelatedTopicPosts(@PathVariable("postId")postId:Int ): ResponseEntity<List<PostSimpleDto>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val relatedPosts = postPageService.getPostRelatedTopicPosts(userInfo.authGroup, postId, 5)
        return ResponseEntity.ok(relatedPosts)
    }

    @Operation(summary = "모든 메뉴 리턴. (1차, 2차메뉴의 selectbox를 만들기 위해서)")
    @GetMapping(path=["/all-menus"])
    fun getAllMenus( ): ResponseEntity<List<MenuIdAndPath>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val role = userInfo.role
        // master나 operator는 모든 메뉴에 대해서 가능, contents master는 자기한테 주어진 메뉴만 가능
        val menus = when (role){
            TheRole.ROLE_MASTER  -> menuIdHolder.getAllMenus().filter { it.contentType!="page" }
            TheRole.ROLE_OPERATOR  -> menuIdHolder.getAllMenus().filter { it.contentType!="page" }
            TheRole.ROLE_CONTENTS_MANAGER -> menuIdHolder.getAllMenus()
                .filter { userInfo.contentsManagerAuthMenuIds?.contains(it?.id) ?: false }.filter { it.contentType!="page" }
            else -> listOf()
        }
        return ResponseEntity.ok(menus)
    }

    @Operation(summary = "Post 저장")
    @PostMapping(path=[""])
    fun savePost( @RequestBody param:PostSaveParam): ResponseEntity<List<Int>> {
        val postId = postPageService.savePost(param)
        return ResponseEntity.ok(listOf(postId))
    }


    @Operation(summary = "postMetaFields 정보")
    @GetMapping(path=["/field/{menu1}/{menu2}", "/field/{menu1}", "/field/{menu1}/"])
    fun getPostFieldsByMenu1IdAndMenu2Id(
        @PathVariable(name="menu1",  required = true) menu1:String,
        @PathVariable(name="menu2", required = false) menu2:String?,
    ): ResponseEntity<List<MetaFieldDto>> {
        val result = postPageService.getPostFieldsByMenu1IdAndMenu2Id(menu1, menu2)
        return ResponseEntity.ok(result)
    }

    
}

@DefaultConstructor
data class PostSaveParam (
    val info:PostDto,
    val detail: List<TbPostContentsDetailDto>? = null,
    val insertedFiles:List<TbAttachedFileDto>? = null,
    val deletedFileIds:List<Int>? = null,
    var nations:List<String>? = null,
    var topics:List<String>? = null,
    val tags:List<String>? = null,
)