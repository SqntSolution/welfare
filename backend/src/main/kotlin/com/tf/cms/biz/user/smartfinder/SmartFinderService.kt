package com.tf.cms.biz.user.smartfinder

import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.model.FileClassType
import com.tf.cms.common.model.SearchType
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.*
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime

@Service
class SmartFinderService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    /**
     * Smart Finder Post 조회
     *
     * @param pageable
     * @param cond
     * @return
     */
    fun findPostList(pageable: Pageable, cond: SmartFinderParams): Page<SmartFinderPostDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbUserScrap = QTbUserScrap.tbUserScrap

        val subQuery1 = JPAExpressions.select(qTbAuthGroupMenuMapp.menuId).from(qTbAuthGroupMenuMapp)
                .where(qTbAuthGroupMenuMapp.authGroupCd.`in`(loginUser?.authGroup))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContents.menu2Id.`in`(subQuery1))
        setWhereCondition(SearchType.POST, whereCondition, cond, loginUser!!)

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SmartFinderPostDto::class.java,
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
                .where(whereCondition)
                .orderBy(
                        if(cond.isNewOrder()) {
                            qTbPostContents.createdAt.desc()
                        } else {
                            qTbPostMetaStatistics.viewCnt.desc()
                        }
                )
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .select(qTbPostContents.count())
                .from(qTbPostContents)
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== resultDataCount : $resultDataCount" }

        return PageImpl(resultData, pageable, resultDataCount)
    }

    /**
     * Smart Finder File 조회
     *
     * @param pageable
     * @param cond
     * @return
     */
    fun findFileList(pageable: Pageable, cond: SmartFinderParams): Page<SmartFinderFileDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbAttachedFile = QTbAttachedFile.tbAttachedFile

        val subQuery1 = JPAExpressions.select(qTbAuthGroupMenuMapp.menuId).from(qTbAuthGroupMenuMapp)
                .where(qTbAuthGroupMenuMapp.authGroupCd.`in`(loginUser?.authGroup).and(qTbAuthGroupMenuMapp.canFiledownload.eq(true)))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContents.menu2Id.`in`(subQuery1))
        setWhereCondition(SearchType.FILE, whereCondition, cond, loginUser!!)

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SmartFinderFileDto::class.java,
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
                .orderBy(
                        if(cond.isNewOrder()) qTbPostContents.createdAt.desc() else qTbAttachedFile.downloadCnt.desc()
                )
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
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
     * Smart Finder Post 조회 (Recommend)
     *
     * @param pageable
     * @param params
     * @return
     */
    fun findRecommendPostList(pageable: Pageable, params: SmartFinderKeywords): Page<SmartFinderPostDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostRecommend = QTbPostRecommend.tbPostRecommend
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbUserScrap = QTbUserScrap.tbUserScrap

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

        // 검색어
        if(!params.keywords.isNullOrEmpty()) {
            params.keywords!!
                    .filter { it.isNotBlank() }
                    .map { qTbPostContents.title.contains(it).or(qTbPostContents.description.contains(it)) }
                    .forEach { whereCondition.and(it) }
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SmartFinderPostDto::class.java,
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
                                qTbPostRecommend.createdAt.`as`("recommendAt"),
                                qTbPostMetaStatistics.viewCnt,
                                qTbPostMetaStatistics.likesCnt,
                                qTbUserScrap.isNotNull.`as`("userScrapYn")
                        )
                )
                .from(qTbPostContents)
                .innerJoin(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .where(whereCondition)
                .orderBy(qTbPostRecommend.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .select(qTbPostContents.count())
                .from(qTbPostContents)
                .innerJoin(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== resultDataCount : $resultDataCount" }

        return PageImpl(resultData, pageable, resultDataCount)
    }

    /**
     * Smart Finder Post 조회 (Tag로 조회)
     *
     * @param pageable
     * @param paramTag
     * @return
     */
    fun findPostListByTag(pageable: Pageable, paramTag: String): Page<SmartFinderPostDto> {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbPostMetaTag = QTbPostMetaTag.tbPostMetaTag
        val qTbPostMetaStatistics = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
        val qTbUserScrap = QTbUserScrap.tbUserScrap

        val subQuery1 = JPAExpressions.select(qTbAuthGroupMenuMapp.menuId).from(qTbAuthGroupMenuMapp)
                .where(qTbAuthGroupMenuMapp.authGroupCd.`in`(loginUser?.authGroup))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContents.enabled.eq(true))
        whereCondition.and(qTbPostContents.openType.eq("public"))
        whereCondition.and(qTbPostContents.postType.eq("post"))
        whereCondition.and(qTbPostMetaTag.tag.eq(paramTag))
        whereCondition.and(qTbPostContents.menu2Id.`in`(subQuery1))
        if(loginUser?.authLevel!! >= 0) {
            whereCondition.and(qTbPostContents.authLevel.loe(loginUser.authLevel))
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                SmartFinderPostDto::class.java,
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
                .innerJoin(qTbPostMetaTag).on(qTbPostContents.id.eq(qTbPostMetaTag.postId))
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .where(whereCondition)
                .orderBy(qTbPostContents.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .select(qTbPostContents.count())
                .from(qTbPostContents)
                .innerJoin(qTbPostMetaTag).on(qTbPostContents.id.eq(qTbPostMetaTag.postId))
                .leftJoin(qTbPostMetaStatistics).on(qTbPostContents.id.eq(qTbPostMetaStatistics.id))
                .leftJoin(qTbUserScrap).on(qTbUserScrap.id.postId.eq(qTbPostContents.id).and(qTbUserScrap.id.userId.eq(loginUser.id)))
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== resultDataCount : $resultDataCount" }

        return PageImpl(resultData, pageable, resultDataCount)
    }

    /**
     * 검색조건 설정
     */
    private fun setWhereCondition(type: SearchType, whereCondition: BooleanBuilder, cond: SmartFinderParams, loginUser: UserInfo) {
        val qTbPostContents = QTbPostContent.tbPostContent
        val qTbAttachedFile = QTbAttachedFile.tbAttachedFile

        whereCondition.and(qTbPostContents.enabled.eq(true))
        whereCondition.and(qTbPostContents.openType.eq("public"))
        whereCondition.and(qTbPostContents.postType.eq("post"))

        // Tag
        if(!cond.tag.isNullOrBlank()) {
            val qTbPostMetaTag = QTbPostMetaTag.tbPostMetaTag
            whereCondition.and(
                    JPAExpressions
                            .selectFrom(qTbPostMetaTag)
                            .where(qTbPostMetaTag.postId.eq(qTbPostContents.id).and(qTbPostMetaTag.tag.eq(cond.tag)))
                            .exists()
            )
        }
        // 등록시작일
        if(!cond.startDate.isNullOrBlank()) {
            Helpers.formatStringToLocalDate(cond.startDate!!)?.let {
                whereCondition.and(qTbPostContents.createdAt.goe(it.atStartOfDay()))
            }
        }
        // 등록종료일
        if(!cond.endDate.isNullOrBlank()) {
            Helpers.formatStringToLocalDate(cond.endDate!!)?.let {
                whereCondition.and(qTbPostContents.createdAt.loe(it.atTime(LocalTime.MAX)))
            }
        }
        // 파일 타입
        if(type == SearchType.FILE && !cond.fileTypes.isNullOrEmpty()) {
            val extList: MutableList<String> = mutableListOf()
            var isEtc = false
            cond.fileTypes!!.filter { it.isNotBlank() }.forEach {
                when(it) {
                    "ppt" -> extList.addAll(FileExtension.pptExt)
                    "pdf" -> extList.addAll(FileExtension.pdfExt)
                    "excel" -> extList.addAll(FileExtension.excelExt)
                    "image" -> extList.addAll(FileExtension.imageExt)
                    "movie" -> extList.addAll(FileExtension.movieExt)
                    "etc" -> isEtc = true
                }
            }
            if(isEtc) {
                whereCondition.and(
                        qTbAttachedFile.fileExtension.`in`(extList).or(
                                qTbAttachedFile.fileExtension.notIn(
                                        FileExtension.pptExt + FileExtension.pdfExt + FileExtension.excelExt + FileExtension.imageExt + FileExtension.movieExt
                                )
                        )
                )
            } else {
                whereCondition.and(qTbAttachedFile.fileExtension.`in`(extList))
            }
        }
        // 검색어
        if(!cond.keywords.isNullOrEmpty()) {
            when(type) {
                SearchType.POST ->
                    cond.keywords!!
                        .filter { it.isNotBlank() }
                        .map { qTbPostContents.title.contains(it).or(qTbPostContents.description.contains(it)) }
                        .forEach { whereCondition.and(it) }
                SearchType.FILE ->
                    cond.keywords!!
                        .filter { it.isNotBlank() }
                        .map { qTbAttachedFile.fileNm.contains(it) }
                        .forEach { whereCondition.and(it) }
            }
        }
        // 권한처리
        if(loginUser.authLevel!! >= 0) {
            whereCondition.and(qTbPostContents.authLevel.loe(loginUser.authLevel))
        }
    }
}