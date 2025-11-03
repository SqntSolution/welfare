package com.tf.cms.biz.admin.content

import com.tf.cms.biz.common.ms.MsTeamsEventBroker
import com.tf.cms.biz.common.ms.MsTeamsEventType
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.DefaultAllowedMenuContentType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.dto.TbKeywordRecommendDto
import com.tf.cms.common.jpa.repository.*
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

@Service
class ContentService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbPostRecommendRepository: TbPostRecommendRepository,
    private val tbPostMetaInfoRepository: TbPostMetaInfoRepository,
    private val tbKeywordRecommendRepository: TbKeywordRecommendRepository,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val msTeamsEventBroker: MsTeamsEventBroker,
) {
    private val logger = logger()

    companion object {
        private val openTypeCodes = listOf("private", "public", "temp")
    }

    /**
     * 카테고리 및 메뉴 조회
     * (Post를 담고 있는 메뉴들만)
     *
     * @return
     */
    fun findCategoryList(): List<ContentCategoryDto> {
        val menuList = menuIdHolder.getAllMenus().filter {
            // Post성 메뉴들만
            !listOf("smartfinder", "cscenter", "my", "page").contains(it.contentType)
                    && it.staticYn == false
        }

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostRecommend = QTbPostRecommend.tbPostRecommend
        val qTbMenu = QTbMenu.tbMenu

        val postCountMap = jPAQueryFactory
            .select(
                qTbPostContents.menu2Id,
                qTbPostContents.menu2Id.count()
            )
            .from(qTbPostContents)
            .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbPostContents.menu2Id))
            .where(qTbPostContents.postType.eq("post"))
            .where(qTbMenu.staticYn.eq(false))
            .groupBy(qTbPostContents.menu2Id)
            .fetch()
            .associate {
                it.get(qTbPostContents.menu2Id) to it.get(qTbPostContents.menu2Id.count())
            }
        val recommendPostCountMap = jPAQueryFactory
            .select(
                qTbPostContents.menu2Id,
                qTbPostContents.menu2Id.count()
            )
            .from(qTbPostContents)
            .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbPostContents.menu2Id))
            .join(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
            .where(qTbPostContents.postType.eq("post"))
            .where(qTbMenu.staticYn.eq(false))
            .groupBy(qTbPostContents.menu2Id)
            .fetch()
            .associate {
                it.get(qTbPostContents.menu2Id) to it.get(qTbPostContents.menu2Id.count())
            }

        val childMenuList = menuList.filter { it.parentId != 0 }.map {
            ContentMenuDto(it).apply {
                this.postCount = postCountMap[it.id]?.toInt() ?: 0
                this.recommendCount = recommendPostCountMap[it.id]?.toInt() ?: 0
            }
        }

        val result = menuList.filter { it.parentId == 0 }.map { parentMenu ->
            ContentCategoryDto(parentMenu).apply {
                this.menuChildren = childMenuList.filter { it.parentId == this.id }
            }
        }

        return result
    }

    /**
     * 카테고리(메뉴)의 selectbox를 만들기 위해서.
     */
    fun getCategorySelectbox(): List<CategoryMenuSelectbox> {
        val allMenus = menuIdHolder.getAllMenus()
        // 1차 메뉴중에서 cs-center, my, smartfinder 등의 메뉴는 뺀거
        val result =
//            listOf( CategoryMenuSelectbox(value ="", label="전체", options=null) ) +
            allMenus.filter { it.parentId == 0 && it.contentType != "page" && !DefaultAllowedMenuContentType.contains(it.contentType) && it.staticYn == false }
                .map { CategoryMenuSelectbox(value = it.id?.toString(), label = it.menuNm) }
        result.forEach {
            // options 추가
            val value = it.value
            it.options = allMenus.filter { it.parentId?.toString() == value && it.contentType != "page" }
                .map { CategoryMenuSelectbox(value = it.id?.toString(), label = it.menuNm) }
        }

        return result
    }


    /**
     * Post 목록 조회
     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun findPostList(): List<ContentPostDto> {
        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbPostRecommend = QTbPostRecommend.tbPostRecommend

        val whereCondition = BooleanBuilder()
            .and(qTbPostContents.enabled.eq(true))
            .and(qTbPostContents.postType.eq("post"))


        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    ContentPostDto::class.java,
                    qTbPostContents.id,
                    qTbPostContents.postType,
                    qTbPostContents.title,
                    qTbPostContents.description,
                    qTbPostContents.openType,
                    qTbPostContents.enabled,
                    qTbPostContents.representativeImagePath,
                    qTbPostContents.authLevel,
                    qTbPostContents.menu1Id,
                    qTbPostContents.menu2Id,
                    qTbPostContents.createdAt,
                    qTbPostContents.createdUserId,
                    qTbPostContents.createdUserNm,
                    qTbPostMetaStatistics.viewCnt,
                    qTbPostMetaStatistics.likesCnt,
                    qTbPostMetaStatistics.scrapCnt,
                    qTbPostMetaStatistics.shareCnt,
                    qTbPostRecommend.isNotNull.`as`("recommendYn")
                )
            )
            .from(qTbPostContents)
            .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
            .leftJoin(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
            .where(whereCondition)
            .orderBy(qTbPostContents.createdAt.desc())
            .fetch()
            .map {
                it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                it
            }
        logger.debug { "=== resultData : ${resultData?.size}" }

        return resultData
    }

    /**
     * Post 일괄 메뉴 이동
     *
     * @param pMenuId
     * @param postIdList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateMenuOfPost(pMenuId: Int?, postIdList: List<Int>?) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val menuInfo = menuIdHolder.getMenuFromId(pMenuId) ?: throw BizException("카테고리(메뉴)가 존재하지 않음($pMenuId)")
        if (!postIdList.isNullOrEmpty()) {

            postIdList.forEach { postId ->
                tbPostContentRepository.findById(postId).ifPresent {
                    // TbMenu 테이블에서 post_category 추출하여 업데이트 필요
                    it.apply {
                        this.postCategory = menuInfo?.postCategory
                        this.menu1Id = menuInfo?.parentId
                        this.menu2Id = menuInfo?.id
                        this.modifiedAt = LocalDateTime.now()
                        this.modifiedUserId = userInfo?.id
                        this.modifiedUserNm = userInfo?.name
                    }
                    tbPostContentRepository.save(it)

                    // 이동시 post meta 데이터 삭제 필요
                    tbPostMetaInfoRepository.findByPostId(postId)
                        .takeIf { it.isNotEmpty() }
                        ?.let {
                            tbPostMetaInfoRepository.deleteByPostId(postId)
                        }

                }
            }
        }
    }

    /**
     * Post 일괄 삭제
     *
     * @param postIdList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deletePostList(postIdList: List<Int>) {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        postIdList.forEach {
            val postId = it
            tbPostContentRepository.findById(postId).getOrNull()?.apply {
                val post = this
                // history에 insert
                TbUserHistory().let {
                    it.postId = postId
                    it.userId = userInfo.id
                    it.postTitle = post.title
                    it.description = "Post를 삭제하였습니다."
                    it.userName = userInfo.name
                    it.actionType = UserHistoryActionType.post_delete.name
                    it.menu1Id = post.menu1Id
                    it.menu1Nm = menuIdHolder.getMenuNmFromId(post.menu1Id)
                    it.menu2Id = post.menu2Id
                    it.menu2Nm = menuIdHolder.getMenuNmFromId(post.menu2Id)
                    it.createdAt = LocalDateTime.now()
                    tbUserHistoryRepository.save(it)
                }

            }
        }
        tbPostContentRepository.deleteAllById(postIdList)
    }

    /**
     * 추천 Post 목록 조회
     *
     * @param pMenuId
     * @return
     */
    fun findRecommendPostList(pMenuId: Int): List<ContentPostDto> {
        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbPostRecommend = QTbPostRecommend.tbPostRecommend

        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    ContentPostDto::class.java,
                    qTbPostContents.id,
                    qTbPostContents.postType,
                    qTbPostContents.title,
                    qTbPostContents.description,
                    qTbPostContents.openType,
                    qTbPostContents.enabled,
                    qTbPostContents.representativeImagePath,
                    qTbPostContents.authLevel,
                    qTbPostContents.menu1Id,
                    qTbPostContents.menu2Id,
                    qTbPostContents.createdAt,
                    qTbPostContents.createdUserId,
                    qTbPostContents.createdUserNm,
                    qTbPostMetaStatistics.viewCnt,
                    qTbPostMetaStatistics.likesCnt,
                    qTbPostMetaStatistics.scrapCnt,
                    qTbPostMetaStatistics.shareCnt,
                    qTbPostRecommend.isNotNull.`as`("recommendYn"),
                    qTbPostRecommend.displaySeq.`as`("recommendSeq"),
                    qTbPostRecommend.createdAt.`as`("recommendAt")
                )
            )
            .from(qTbPostContents)
            .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
            .join(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
            .where(
                qTbPostContents.enabled.eq(true)
                    .and(qTbPostContents.menu2Id.eq(pMenuId))
            )
            .orderBy(qTbPostRecommend.displaySeq.asc())
            .fetch()
            .map {
                it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                it
            }
        logger.debug { "=== resultData : $resultData" }

        return resultData
    }

    /**
     * Post openType 수정
     *
     * @param postId
     * @param openType
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updatePostOpenType(postId: Int, openType: String) {
        if (openTypeCodes.contains(openType)) {
            val tbPostContent = tbPostContentRepository.findById(postId)
            if(tbPostContent.isPresent) {
                val postContents = tbPostContent.get()
                postContents.apply {
                    this.openType = openType
                    this.modifiedAt = LocalDateTime.now()
                    this.modifiedUserId = UserInfoHelper.getLoginUserInfo()?.id
                    this.modifiedUserNm = UserInfoHelper.getLoginUserInfo()?.name
                }
                tbPostContentRepository.save(postContents)
                // Teams 알림 발송
                msTeamsEventBroker.publishEvent(MsTeamsEventType.NewPostRegistered, postId)
            }
        } else {
            throw BizException("openType is undefined")
        }
    }

//    /**
//     * 추천 Post 저장
//     *
//     * @param saveList
//     * @param deleteList
//     */
//    @Transactional(rollbackOn = [Throwable::class])
//    fun saveRecommendPost(saveList: List<RecommendPostSaveDto>?, deleteList: List<Int>?) {
//        // 저장
//        if(!saveList.isNullOrEmpty()) {
//            val userInfo = UserInfoHelper.getLoginUserInfo()
//            saveList.forEach {
//                var saveEntity: TbPostRecommend? = null
//                val tbPostRecommend = tbPostRecommendRepository.findById(it.postId!!)
//                if(tbPostRecommend.isPresent) {
//                    // 수정
//                    saveEntity = tbPostRecommend.get().apply {
//                        this.displaySeq = it.recommendSeq
//                        this.modifiedAt = LocalDateTime.now()
//                        this.modifiedUserId = userInfo?.id
//                        this.modifiedUserNm = userInfo?.name
//                    }
//                } else {
//                    // 등록
//                    saveEntity = TbPostRecommend().apply {
//                        this.id = it.postId
//                        this.displaySeq = it.recommendSeq
//                        this.createdAt = LocalDateTime.now()
//                        this.createdUserId = userInfo?.id
//                        this.createdUserNm = userInfo?.name
//                    }
//                }
//                tbPostRecommendRepository.save(saveEntity)
//            }
//        }
//        // 삭제
//        if(!deleteList.isNullOrEmpty()) {
//            logger.debug { "===== deleteList: $deleteList" }
//            tbPostRecommendRepository.deleteAllById(deleteList)
//        }
//    }

    /**
     * 추천 Post 저장
     *
     * @param saveList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveRecommendPost(dto: RecommendPostSaveDto) {
        if (dto.menuId != null) {
            // 기존 건 삭제
            val tbPostContentIdList = tbPostContentRepository.findByMenu2Id(dto.menuId!!).map { it.id }
            if (tbPostContentIdList.isNotEmpty()) {
                tbPostRecommendRepository.deleteAllById(tbPostContentIdList)
            }
            // 등록
            if (!dto.postIdList.isNullOrEmpty()) {
                val userInfo = UserInfoHelper.getLoginUserInfo()
                val entities = dto.postIdList!!.mapIndexed { index, value ->
                    TbPostRecommend().apply {
                        this.id = value
                        this.displaySeq = index + 1
                        this.createdAt = LocalDateTime.now()
                        this.createdUserId = userInfo?.id
                        this.createdUserNm = userInfo?.name
                    }
                }
                tbPostRecommendRepository.saveAll(entities)
            }
        }
    }

    /**
     * 추천 검색어 조회
     *
     * @return
     */
    fun findRecommendKeywordList(): List<TbKeywordRecommendDto> {
        return tbKeywordRecommendRepository.findAll()
            .map { TbKeywordRecommendDto(it) }
            .sortedBy { it.seq }
    }

    /**
     * 추천 검색어 저장
     *
     * @param keywordList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveRecommendKeyword(keywordList: List<String>) {
        // 삭제
        tbKeywordRecommendRepository.deleteAll()
        // 등록
        if (keywordList.isNotEmpty()) {
            val userInfo = UserInfoHelper.getLoginUserInfo()
            val entities = keywordList.mapIndexed { index, value ->
                TbKeywordRecommend().apply {
                    keyword = value
                    seq = (index + 1).toShort()
                    createdAt = LocalDateTime.now()
                    createdUserId = userInfo?.id
                    createdUserNm = userInfo?.name
                }
            }
            tbKeywordRecommendRepository.saveAll(entities)
        }
    }

}