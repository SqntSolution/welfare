package com.tf.cms.biz.user.main

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.fileupload.FileStorageService
import com.tf.cms.biz.common.pageview.UserHistoryQueueProcessor
import com.tf.cms.common.jpa.dto.TbPostContentsDetailDto
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.DetailsType
import com.tf.cms.common.model.MenuContentType
import com.tf.cms.common.model.PostAccessDeniedException
import com.tf.cms.common.utils.CodeHolder
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.google.common.base.Strings
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrElse
import org.springframework.stereotype.Component

/**
 * 2차메뉴에 연결된 Page에 대한 조회 및 저장
 */
@Component
class PagePageService(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbPostMeTagRepository: TbPostMetaTagRepository,
    private val tbPostContentsDetailRepository: TbPostContentsDetailRepository,
    private val fileStorageService: FileStorageService,
    private val tbAttachedFileRepository: TbAttachedFileRepository,
    private val userHistoryQueueProcessor: UserHistoryQueueProcessor,
    private val menuIdHolder: MenuIdHolder,
    private val tbMenuRepository: TbMenuRepository,
    private val tbPostMetaInfoRepository: TbPostMetaInfoRepository,
    private val tbPostMetaFieldRepository: TbPostMetaFieldRepository,
    private val codeHolder: CodeHolder,
) {
    private val logger = logger()


    /**
     * page 한개의 기본정보 조회
     */
    fun getPageInfo(userId: String, authGroupCds: List<String>?, menu1: String, menu2: String): PostDto {

        val menu = menuIdHolder.getMenuFromPath(menu1, menu2) ?: throw PostAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        // 해당 메뉴가 page 타입인지 체크
        if (menu.contentType != "page") {
//            throw BizException("해당 메뉴가 page 타입이 아닙니다. (${menu.contentType})")
            return PostDto()
        }

        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        // 접근가능 체크
        if (!accessibleMenuIds.contains(menu.id)) {
            throw PostAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        }

        val menuEntity = tbMenuRepository.findById(menu.id)?.orElse(null) ?: throw BizException("메뉴가 존재하지 않음.(${menu?.id})")

        // menu에 달린 postId
        if (menuEntity.id == null) {
            return PostDto()
        }

        // 연결된 Post가 없을땐
        val postId = menuEntity.postId ?: return PostDto()

        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap

        val post = jpaQueryFactory.select(
            Projections.fields(
                PostDto::class.java,
                tbPostContent.id,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.authLevel,
                tbPostContent.menu1Id,
                tbPostContent.menu2Id,
                tbPostContent.createdAt,
                tbPostContent.createdUserNm,
                tbPostContent.modifiedAt,
                tbPostContent.modifiedUserNm,
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,

                tbUserScrap.isNotNull.`as`("scrapes"),
            )
        ).from(tbPostContent)
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            // scrap
            .leftJoin(tbUserScrap).on(tbUserScrap.id.postId.eq(tbPostContent.id).and(tbUserScrap.id.userId.eq(userId)))
            .where(tbPostContent.id.eq(postId))
            .where(tbPostContent.postType.eq("page"))
//            .where(tbPostContent.enabled.eq(true))
//            .where(tbPostContent.openType.`in`("public"))
            .where(MainPostHelper.defaultPostOneCondition())
            .fetchFirst()
            ?.let {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName

                val menu2Id = it.menu2Id
                // filedownload 권한 셋팅
//                it.canFileDownload = roleAndMenuComponent.getMenuAuthMapByAuthgroups(authGroupCds!!).get(menu2Id)
//                it.postMetaInfo = getPostMataInfo(postId)
                it
            }
            ?: throw BizException("게시물이 존재하지 않음.")


//        // 접근가능여부 체크
//        if (post.menu1Id != null && !accessibleMenuIds.contains(post.menu1Id)) {
//            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[post.menu1Id]})")
//        }
//        if (post.menu2Id != null && !accessibleMenuIds.contains(post.menu2Id)) {
//            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[post.menu2Id]})")
//        }

        return post
    }

    /**
     * pdf, editor 등의 컨텐츠 내용들을 리턴
     */
    fun getPageContentsDetails(authGroupCds: List<String>?, postId: Int): List<TbPostContentsDetailDto> {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val tbPostContentsDetail = QTbPostContentsDetail.tbPostContentsDetail
        val result: List<TbPostContentsDetailDto> = jpaQueryFactory.select(
            Projections.fields(
                TbPostContentsDetailDto::class.java,
                tbPostContentsDetail.id,
                tbPostContentsDetail.postId,
                tbPostContentsDetail.detailsType,
                tbPostContentsDetail.filePath,
                tbPostContentsDetail.contents,
                tbPostContentsDetail.seq
            )
        )
            .from(tbPostContentsDetail)
            .where(tbPostContentsDetail.postId.eq(postId)).orderBy(tbPostContentsDetail.seq.asc())
            .fetch()

        return result
    }


    /**
     * post의 국가, 주제, tag 목록 조회.
     */
    fun getPageMetas(authGroupCds: List<String>?, postId: Int): MutableMap<String, List<ValueAndLabel>> {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val resultMap = mutableMapOf<String, List<ValueAndLabel>>()

        // tag
        val tbPostMetaTag = QTbPostMetaTag.tbPostMetaTag
        val tags = jpaQueryFactory.select(
            Projections.constructor(
                ValueAndLabel::class.java,
                tbPostMetaTag.tag,
                tbPostMetaTag.tag,
            )
        ).from(tbPostMetaTag)
            .where(tbPostMetaTag.postId.eq(postId))
            .fetch()

        resultMap["tags"] = tags

        return resultMap
    }

    /**
     *  Post한개에 속한 detail 한개 조회
     */
    fun getPageDetailOne(authGroupCds: List<String>?, detailId: Int): TbPostContentsDetailDto {
        val tbPostContentsDetail = QTbPostContentsDetail.tbPostContentsDetail
        val result = jpaQueryFactory.select(
            Projections.fields(
                TbPostContentsDetailDto::class.java,
                tbPostContentsDetail.id,
                tbPostContentsDetail.postId,
                tbPostContentsDetail.detailsType,
                tbPostContentsDetail.filePath,
                tbPostContentsDetail.contents,
                tbPostContentsDetail.seq
            )
        )
            .from(tbPostContentsDetail)
            .where(tbPostContentsDetail.id.eq(detailId))
            .fetchFirst()
            ?: throw BizException("해당 상세 내용이 존재하지 않습니다. (fileId:$detailId)")

        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, result.postId!!)

        return result
    }

    @Transactional(rollbackOn = [Throwable::class])
    fun savePage(saveParam: PageSaveParam): Int {
        logger.info { "=== param : $saveParam" }
        val post = saveParam.info
        val postId = post.id
        // postId가 파라미터로 넘어오면 update, 안넘어오면 insert
        if (postId != null) {
            return updatePage(saveParam)
        } else {
            return insertPage(saveParam)
        }
    }

    /**
     * 신규 저장
     */
    private fun insertPage(saveParam: PageSaveParam): Int {
        val post = saveParam.info
        val userInfo = UserInfoHelper.getLoginUserInfo()!!

        // page저장할때는 menu1Id과 menu2Id를 구해서 넣어야 한다.
        val menuEngName1 = post.menuEngName1
        val menuEngName2 = post.menuEngName2
        val menu1 = menuIdHolder.getMenuFromPath(menuEngName1) ?: throw BizException("메뉴가 잘못됨 (${menuEngName1})")
        val menu2 = menuIdHolder.getMenuFromPath(menuEngName1, menuEngName2) ?: throw BizException("메뉴가 잘못됨 (${menuEngName1})(${menuEngName2})")

        // tb_post_contents
        val postId = TbPostContent().let {
            it.title = post.title
            it.description = post.description
            it.openType = post.openType
            it.postType = MenuContentType.PAGE.code
            it.enabled = true
            it.representativeImagePath = post.representativeImagePath
            it.authLevel = post.authLevel
            it.menu1Id = menu1.id
            it.menu2Id = menu2.id
            it.createdAt = LocalDateTime.now()
            it.createdUserId = userInfo.id
            it.createdUserNm = userInfo.name
            val savedEntity = tbPostContentRepository.save(it)
            savedEntity?.id
        }!!

        // tb_menu
        val menu = tbMenuRepository.findById(menu2.id).orElse(null) ?: throw BizException("메뉴가 존재하지 않음 (${menuEngName1})(${menuEngName2}) ")
        menu.postId = postId

        // tb_post_meta_nation
        // 비었다면 etc
        if (saveParam.nations?.size ?: 0 == 0) {
            saveParam.nations = mutableListOf("etc")
        }

        // tb_post_meta_tag
        saveParam.tags?.forEach {
            val tag = it
            TbPostMetaTag().apply {
                this.postId = postId
                this.tag = tag
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostMeTagRepository.save(this)
            }
        }

//        // tb_post_meta_info
//        saveParam.info.postMetaInfo?.forEach { metaInfo ->
//            val entity = TbPostMetaInfo().apply {
//                this.postId = postId
//                this.metaKey = metaInfo.metaKey
//                this.metaValue = metaInfo.metaValue
//                this.metaDisplayOrder = metaInfo.metaDisplayOrder
//                this.createdAt = LocalDateTime.now()
//                this.createdUserId = userInfo.id
//                this.createdUserNm = userInfo.name
//            }
//            tbPostMetaInfoRepository.save(entity)
//        }
//
//        //tb_post_meta_field
//        saveParam.info.postMetaInfo?.forEach { metaInfo ->
//            val entity = TbPostMetaField().apply {
////                this.id.postId = postId
////                this.id.metaKey = metaInfo.metaKey
//                this.metaNm = metaInfo.metaValue
//                this.groupCode = metaInfo.groupCode
//                this.metaType = metaInfo.metaType
//            }
//            tbPostMetaFieldRepository.save(entity)
//        }

        // tb_post_contents_details
        var seq = 0
        saveParam.detail?.forEach {
            val dto = it
            val detailsType = DetailsType.findCode(dto.detailsType)
                ?: throw BizException("detailsType이 유효하지 않음 (${dto.detailsType})")

            seq++
            var path = dto.filePath
            if (detailsType == DetailsType.pdf) {
                if (Strings.isNullOrEmpty(path)) {
                    throw BizException("pdf인데 경로가 비었습니다.")
                }
                if (path!!.startsWith("temp")) {
                    // temp 디렉토리라면 원 디렉토리로 이동
                    path = fileStorageService.moveToActualDir(path)
                }
            }

            TbPostContentsDetail().apply {
                this.postId = postId
                this.detailsType = dto.detailsType
                this.filePath = path
                this.contents = dto.contents
                this.seq = seq.toShort()
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostContentsDetailRepository.save(this)
            }
        }

        return postId
    }


    private fun updatePage(saveParam: PageSaveParam): Int {
        val post = saveParam.info
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val postId = post.id!!
        val postEntity = tbPostContentRepository.findById(postId).getOrElse { throw BizException("데이타가 존재하지 않음.") }
        // tb_post_contents
        postEntity.let {
            it.title = post.title
            it.description = post.description
            it.openType = post.openType
            it.postType = MenuContentType.PAGE.code
            it.enabled = true
            it.representativeImagePath = post.representativeImagePath
            it.authLevel = post.authLevel
            it.menu1Id = post.menu1Id
            it.menu2Id = post.menu2Id
            it.modifiedAt = LocalDateTime.now()
            it.modifiedUserId = userInfo.id
            it.modifiedUserNm = userInfo.name
            tbPostContentRepository.save(it)
        }

        // tb_post_meta_nation => 전체 삭제후에 새로 insert
        // 비었다면 etc
        if (saveParam.nations?.size ?: 0 == 0) {
            saveParam.nations = mutableListOf("etc")
        }
        // tb_post_meta_tag => 전체 삭제후에 새로 insert
        tbPostMeTagRepository.deleteByPostId(postId)
        saveParam.tags?.forEach {
            val tag = it
            TbPostMetaTag().apply {
                this.postId = postId
                this.tag = tag
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostMeTagRepository.save(this)
            }
        }

//        // tb_post_meta_info => 전체 삭제후에 새로 insert
//        tbPostMetaInfoRepository.deleteByPostId(postId)
//
//        saveParam.info.postMetaInfo?.forEach { metaInfo ->
//            val entity = TbPostMetaInfo().apply {
//                this.postId = postId
//                this.metaKey = metaInfo.metaKey
//                this.metaValue = metaInfo.metaValue
//                this.metaDisplayOrder = metaInfo.metaDisplayOrder
//                this.createdAt = LocalDateTime.now()
//                this.createdUserId = userInfo.id
//                this.createdUserNm = userInfo.name
//            }
//            tbPostMetaInfoRepository.save(entity)
//        }
//
//        //tb_post_meta_field => 전체 삭제후에 새로 insert
//        tbPostMetaFieldRepository.deleteByIdPostId(postId)
//
//        saveParam.info.postMetaInfo?.forEach { metaInfo ->
//            val entity = TbPostMetaField().apply {
////                this.id.postId = postId
////                this.id.metaKey = metaInfo.metaKey
//                this.metaNm = metaInfo.metaValue
//                this.groupCode = metaInfo.groupCode
//                this.metaType = metaInfo.metaType
//            }
//            tbPostMetaFieldRepository.save(entity)
//        }


        // tb_post_contents_details => 전체 삭제후에 새로 insert
        tbPostContentsDetailRepository.deleteByPostId(postId)
        var seq = 0
        saveParam.detail?.forEach {
            val dto = it
            val detailsType = DetailsType.findCode(dto.detailsType)
            if (detailsType == null) {
                throw BizException("detailsType이 유효하지 않음 (${dto.detailsType})")
            }
            seq++
            var path = dto.filePath
            if (detailsType == DetailsType.pdf) {
                if (Strings.isNullOrEmpty(path)) {
                    throw BizException("pdf인데 경로가 비었습니다.")
                }
                if (path!!.startsWith("temp")) {
                    // temp 디렉토리라면 원 디렉토리로 이동
                    path = fileStorageService.moveToActualDir(path)
                }
            }

            TbPostContentsDetail().apply {
                this.postId = postId
                this.detailsType = dto.detailsType
                this.filePath = path
                this.contents = dto.contents
                this.seq = seq.toShort()
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostContentsDetailRepository.save(this)
            }
        }

        return postId
    }

    /**
     * name: 
     * description: 포스트 mata item 정보
     * author: 정상철
     * created: 2025-06-24
    
     *
     * @return 
     */

    fun getPostMataInfo (
        postId: Int
    ): List<MetaInfoDto> {
//        val tbPostContent = QTbPostContent.tbPostContent
//        val tbPostMetaInfo = QTbPostMetaInfo.tbPostMetaInfo
//        val tbPostMetaField = QTbPostMetaField.tbPostMetaField
//
//        val whereCondition = BooleanBuilder();
//        whereCondition.and(tbPostMetaInfo.postId.eq(postId))
//
//        val result = jpaQueryFactory.select(
//            Projections.fields(
//                PostMetaDto::class.java,
//                tbPostMetaInfo.id.`as`("metaInfoId"),
//                tbPostMetaInfo.metaKey,
//                tbPostMetaInfo.metaValue,
//                tbPostMetaInfo.metaDisplayOrder,
//                tbPostMetaField.metaNm,
//                tbPostMetaField.groupCode,
//            )
//        )
//            .from(tbPostMetaInfo)
//            .leftJoin(tbPostContent).on(tbPostMetaInfo.postId.eq(tbPostContent.id))
//            .leftJoin(tbPostMetaField).on(
//                tbPostMetaField.id.postId.eq(tbPostMetaInfo.postId)
//                    .and(tbPostMetaField.id.metaKey.eq(tbPostMetaInfo.metaKey))
//            )
//            .where(whereCondition)
//            .fetch()
//
//        return result

        return emptyList<MetaInfoDto>()
    }
    
    
    
    /**
     * page 조회를 저장하기 위해서
     */
//    fun pushToHistoryQueueForPageView(postId: Int) {
//        throw BizException("Page 조회는 history에 남기지 않음.")
//        val entity = tbPostContentRepository.findById(postId).getOrNull()
//        val userInfo = UserInfoHelper.getLoginUserInfo()!!
//        UserHistoryDto().apply {
//            this.postId = postId
//            this.postTitle = entity?.title
//            this.menu1Id = entity?.menu1Id
//            this.menu2Id = entity?.menu2Id
//            this.userId = userInfo.id
//            this.userName = userInfo.name
//            this.actionType = "view"
//            this.description = "조회 하였습니다."
//            this.createdAt = LocalDateTime.now()
//
//            userHistoryQueueProcessor.push(this)
//        }
//    }
}

