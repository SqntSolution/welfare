package com.tf.cms.biz.user.search

import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.model.FileClassType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.dto.TbKeywordRecommendDto
import com.tf.cms.common.jpa.repository.TbKeywordRecommendRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class SearchService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val searchMapperDao: SearchMapperDao,
        private val menuIdHolder: MenuIdHolder,
        private val tbKeywordRecommendRepository: TbKeywordRecommendRepository

) {
    private val logger = logger()

    /**
     * 게시글 통합검색
     *
     * @param pageable
     * @param keywords
     * @return
     */
//    fun searchPostList(pageable: Pageable, keywords: List<String>?): Page<SearchPostResponseDto> {
//        val loginUser = UserInfoHelper.getLoginUserInfo()
//
//        val searchParams = SearchParam().apply {
//            this.userId = loginUser?.id
//            this.authGroupCodes = loginUser?.authGroup
//            this.authLevel = loginUser?.authLevel
//            this.keywords = keywords
//            this.pageNumber = pageable.offset.toInt()
//            this.pageSize = pageable.pageSize
//        }
//
//        val resultData = searchMapperDao.getSearchPost(searchParams)
//                .map {
//                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
//                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
//                    it
//                }
//        logger.debug { "=== resultData : ${resultData.size}" }
//
//        val resultDataCount = searchMapperDao.getSearchPostCount(searchParams)
//        logger.debug { "=== resultDataCount : $resultDataCount" }
//
//        return PageImpl(resultData, pageable, resultDataCount.toLong())
//    }
    fun searchPostList(
//        pageable: Pageable, keywords: List<String>?
        keywords: String?
    ): List<Menu1GroupDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()!!

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbUserScrap = QTbUserScrap.tbUserScrap
        val qTbMenu = QTbMenu.tbMenu

        val subQuery1 = JPAExpressions.select(qTbAuthGroupMenuMapp.menuId).from(qTbAuthGroupMenuMapp)
                .where(qTbAuthGroupMenuMapp.authGroupCd.`in`(loginUser?.authGroup))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContents.enabled.eq(true))
        whereCondition.and(qTbPostContents.openType.eq("public"))
        whereCondition.and(qTbPostContents.postType.eq("post"))
        whereCondition.and(qTbPostContents.menu2Id.`in`(subQuery1))
        whereCondition.and(qTbMenu.staticYn.eq(false))

//        logger.debug { "=== loginUser?.authGroup : $loginUser?.authGroup" }

        //권한레벨
        if (loginUser.authLevel!! >= 0) {
            whereCondition.and(qTbPostContents.authLevel.loe(loginUser.authLevel))
        }

//        if(!keywords.isNullOrEmpty()) {
//            keywords.filter { it.isNotBlank() }
//                    .map { qTbPostContents.title.contains(it)
////                        .or(qTbPostContents.description.contains(it))
//                    }
//                    .forEach { whereCondition.and(it) }
//        }

        if (!keywords.isNullOrBlank()) {
            whereCondition.and(qTbPostContents.title.containsIgnoreCase(keywords))
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SearchPostResponseDto::class.java,
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
                                qTbUserScrap.isNotNull.`as`("userScrapYn")
                        )
                )
                .from(qTbPostContents)
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbPostContents.menu2Id))
                .where(whereCondition)
                .orderBy(qTbPostContents.createdAt.desc())
//                .offset(pageable.offset)
//                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menu1Nm = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menu2Nm = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .select(qTbPostContents.count())
                .from(qTbPostContents)
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbPostContents.menu2Id))
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== resultDataCount : $resultDataCount" }

        val groupedResult: List<Menu1GroupDto> = resultData
            .groupBy { it.menu1Id }
            .map { (menu1Id, postsInMenu1) ->
                val menu1Nm = postsInMenu1.firstOrNull()?.menu1Nm

                val children = postsInMenu1
                    .groupBy { it.menu2Id }
                    .map { (menu2Id, postsInMenu2) ->
                        val menu2Nm = postsInMenu2.firstOrNull()?.menu2Nm
                        Menu2GroupDto(menu2Id = menu2Id ?: 0, menu2Nm = menu2Nm,  totalCnt = postsInMenu2.size, posts = postsInMenu2.take(6))
                    }

                Menu1GroupDto(menu1Id = menu1Id ?: 0, menu1Nm = menu1Nm, children = children)
            }

//        return PageImpl(groupedResult, pageable, resultDataCount)
        return groupedResult
    }

    /**
     * 파일 통합검색
     *
     * @param pageable
     * @param keywords
     * @return
     */
    fun searchFileList(pageable: Pageable, keywords: List<String>?): Page<SearchFileResponseDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbAttachedFile = QTbAttachedFile.tbAttachedFile

        val subQuery1 = JPAExpressions.select(qTbAuthGroupMenuMapp.menuId).from(qTbAuthGroupMenuMapp)
                .where(qTbAuthGroupMenuMapp.authGroupCd.`in`(loginUser?.authGroup))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContents.enabled.eq(true))
        whereCondition.and(qTbPostContents.openType.eq("public"))
        whereCondition.and(qTbPostContents.postType.eq("post"))
        whereCondition.and(qTbPostContents.menu2Id.`in`(subQuery1))
        if(loginUser?.authLevel!! >= 0) {
            whereCondition.and(qTbPostContents.authLevel.loe(loginUser.authLevel))
        }
        if(!keywords.isNullOrEmpty()) {
            keywords.filter { it.isNotBlank() }
                    .map { qTbAttachedFile.fileNm.contains(it) }
                    .forEach { whereCondition.and(it) }
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SearchFileResponseDto::class.java,
                                qTbPostContents.id.`as`("postId"),
                                qTbPostContents.title,
                                qTbPostContents.postType,
                                qTbPostContents.openType,
                                qTbPostContents.enabled,
                                qTbPostContents.authLevel,
                                qTbPostContents.menu1Id,
                                qTbPostContents.menu2Id,
                                qTbAttachedFile.id.`as`("fileId"),
                                qTbAttachedFile.fileClass,
                                qTbAttachedFile.fileNm,
                                qTbAttachedFile.fileExtension,
                                qTbAttachedFile.filePath,
                                qTbAttachedFile.fileSize,
                                qTbAttachedFile.downloadCnt,
                                qTbAttachedFile.createdAt,
                                qTbAttachedFile.createdUserId,
                                qTbAttachedFile.createdUserNm,
                                qTbAttachedFile.modifiedAt,
                                qTbAttachedFile.modifiedUserId,
                                qTbAttachedFile.modifiedUserNm
                        )
                )
                .from(qTbPostContents)
                .innerJoin(qTbAttachedFile).on(
                        qTbAttachedFile.fileClass.eq(FileClassType.POST.code)
                                .and(qTbPostContents.id.eq(qTbAttachedFile.postId))
                )
                .where(whereCondition)
                .orderBy(qTbPostContents.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menu1Nm = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menu2Nm = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .select(qTbPostContents.count())
                .from(qTbPostContents)
                .innerJoin(qTbAttachedFile).on(
                        qTbAttachedFile.fileClass.eq(FileClassType.POST.code)
                                .and(qTbPostContents.id.eq(qTbAttachedFile.postId))
                )
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== resultDataCount : $resultDataCount" }

        return PageImpl(resultData, pageable, resultDataCount)
    }

    /**
     * 추천 검색어 조회
     *
     * @return
     */
    fun findRecommendKeywords(): List<TbKeywordRecommendDto> {
        return tbKeywordRecommendRepository.findAll()
                .map { TbKeywordRecommendDto(it) }
                .sortedBy { it.seq }
    }
}