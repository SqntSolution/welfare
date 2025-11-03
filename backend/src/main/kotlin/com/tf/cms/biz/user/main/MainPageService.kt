package com.tf.cms.biz.user.main

import com.querydsl.core.BooleanBuilder
import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.common.jpa.dto.TbBannerDto
import com.tf.cms.common.jpa.entity.QTbBanner
import com.tf.cms.common.jpa.entity.QTbBbsNormal
import com.tf.cms.common.jpa.entity.QTbMenu
import com.tf.cms.common.jpa.entity.QTbPostContent
import com.tf.cms.common.jpa.entity.QTbPostMetaStatistic
import com.tf.cms.common.jpa.entity.QTbPostRecommend
import com.tf.cms.common.jpa.entity.QTbUserScrap
import com.tf.cms.common.utils.CodeHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.model.CategoryAccessDeniedException
import com.tf.cms.common.utils.MenuIdHolder
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import org.springframework.stereotype.Component

/**
 * main 페이지에서 각종 게시물 조회 등등
 */
@Component
class MainPageService(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val jpaQueryFactory: JPAQueryFactory,
    private val codeHolder: CodeHolder,
    private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    /**
     * 메인페이지에서, 최신 등록 POST X개 가져오기
     * @return PostDto 의 List
     */
    fun getMainpageNewPosts(userId: String?, authGroupCds: List<String>?, fetchSize: Int): List<PostDto> {
        // 접근가능한 menuId들 조회
        val menuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds?:listOf())

        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 최신 post 8개 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap

        val contents = jpaQueryFactory.select(
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
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,
                tbUserScrap.isNotNull.`as`("scrapes"),
                tbPostContent.createdAt,
            )
        ).from(tbPostContent)
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            // scrap
            .leftJoin(tbUserScrap).on(tbUserScrap.id.postId.eq(tbPostContent.id).and(tbUserScrap.id.userId.eq(userId)))
            .where(tbPostContent.menu2Id.`in`(menuIds))
            .where(tbPostContent.postType.eq("post"))
//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            .where(MainPostHelper.defaultPostListCondition())
            .orderBy(tbPostContent.createdAt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName
                it
            }

        return contents
    }


    /**
     * 메인페이지에서 최신 recommend X개 가져오기
     * @return PostDto 의 List
     */
    fun getMainpageRecentRecommendations(userId: String?, authGroupCds: List<String>?, fetchSize: Int): List<PostDto> {
        // 접근가능한 menuId들 조회
        val menuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap
        val tbPostRecommend = QTbPostRecommend.tbPostRecommend

        val contents = jpaQueryFactory.select(
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
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,
                tbUserScrap.isNotNull.`as`("scrapes"),
                tbPostContent.createdAt,
            )
        ).from(tbPostContent)
            // recommend
            .innerJoin(tbPostRecommend).on(tbPostRecommend.id.eq(tbPostContent.id))
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            // scrap
            .leftJoin(tbUserScrap).on(tbUserScrap.id.postId.eq(tbPostContent.id).and(tbUserScrap.id.userId.eq(userId)))
            .where(tbPostContent.menu2Id.`in`(menuIds))
            .where(tbPostContent.postType.eq("post"))
            .where(MainPostHelper.defaultPostListCondition())
            .orderBy(tbPostRecommend.displaySeq.asc(), tbPostRecommend.createdAt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName
                it
            }

        return contents
    }

    val yyyyMM = DateTimeFormatter.ofPattern("yyyyMM")!!

    /**
     * notice 목록
     */
    fun getNoticeListByMostViews(fetchSize: Int = 5): MutableList<BbsNoticeDto> {
        val tbBbsNormal = QTbBbsNormal.tbBbsNormal
        val tbMenu = QTbMenu.tbMenu
        val userInfo = UserInfoHelper.getLoginUserInfo()!!

        val resultList = jpaQueryFactory.select(
            Projections.fields(
                BbsNoticeDto::class.java,
                tbBbsNormal.id,
                tbBbsNormal.menuId,
                tbBbsNormal.title,
                tbBbsNormal.createdAt,
                tbBbsNormal.noticeType,
            )
        )
            .from(tbBbsNormal)
            .innerJoin(tbMenu).on(tbMenu.enabled.eq(true)
                .and(tbMenu.contentType.eq("notice")).and(tbMenu.id.eq(tbBbsNormal.menuId)))
            .where(tbBbsNormal.opened.eq(true))
            .where((tbBbsNormal.authLevel).isNull.or(tbBbsNormal.authLevel.goe(0))
                .or(Expressions.asBoolean(userInfo.authLevel!! >= 0).isTrue))
            .orderBy(tbBbsNormal.noticeType.desc(), tbBbsNormal.createdAt.desc(), tbBbsNormal.id.desc())
            .limit(fetchSize.toLong())
            .fetch()

        return resultList
    }

    /**
     * FAQ 목록
     */
    fun getFaqList(fetchSize: Int = 5): List<BbsFaqDto>? {
        val tbBbsNormal = QTbBbsNormal.tbBbsNormal
        val tbMenu = QTbMenu.tbMenu

        val resultList = jpaQueryFactory.select(
            Projections.fields(
                BbsFaqDto::class.java,
                tbBbsNormal.id,
                tbBbsNormal.menuId,
                tbBbsNormal.title,
                tbBbsNormal.metaDivision,
            )
        )
            .from(tbBbsNormal)
            .innerJoin(tbMenu).on(tbMenu.enabled.eq(true)
                .and(tbMenu.contentType.eq("faq")).and(tbMenu.id.eq(tbBbsNormal.menuId)))
            .where(tbBbsNormal.opened.eq(true))
            .orderBy(tbBbsNormal.createdAt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                it.metaDivision = codeHolder.getCodeLabel("FAQ_TYPE", it.metaDivision)?.label
                it
            }

        return resultList
    }

    /**
     * banner 목록
     */
    fun getBanners(
        menu1: String?,
        menu2: String?,
    ): MutableList<TbBannerDto>? {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val tbBanner = QTbBanner.tbBanner
        val whereCondition = BooleanBuilder()

        logger.info { "=== menu1 : ${menu1}" }
        logger.info { "=== menu2 : ${menu2}" }

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        logger.info { "=== menu1Id : ${menu1Id}" }
        logger.info { "=== menu2Id : ${menu2Id}" }

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbBanner.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbBanner.menu2Id.eq(menu2Id))
        }

        val result = jpaQueryFactory.select(
            Projections.fields(
                TbBannerDto::class.java,
                tbBanner.id,
                tbBanner.title,
                tbBanner.subTitle,
                tbBanner.imagePath,
                tbBanner.menu1Id,
                tbBanner.menu2Id,
                tbBanner.link,
                tbBanner.linkType,
                tbBanner.enabled,
                tbBanner.backgroundColor,
                tbBanner.authLevel,
                tbBanner.displayStartDate,
                tbBanner.displayEndDate,
            )
        ).from(tbBanner)
            .where(whereCondition)
            .where(tbBanner.enabled.eq(true))
            .where((tbBanner.authLevel.goe(0).or(Expressions.asBoolean(userInfo.authLevel!! >= 0).isTrue)))
            .where((tbBanner.displayStartDate.isNull.or(tbBanner.displayStartDate.loe(LocalDate.now()))))
            .where((tbBanner.displayEndDate.isNull.or(tbBanner.displayEndDate.goe(LocalDate.now()))))
            .orderBy(tbBanner.displayOrder.asc())
            .fetch()

        return result
    }

    /**
     * 메인페이지에서, 최신 등록 POST X개 가져오기
     * @return PostDto 의 List
     */
    fun getNewPostsByMenu1(
        menu1: String
    ): List<PostDto> {
        val fetchSize = 8
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        // 접근가능한 menuId들 조회
        val menuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(userInfo.authGroup?:listOf())

        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 최신 post 8개 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap

        val whereCondition = BooleanBuilder();
        whereCondition.and(tbPostContent.menu2Id.`in`(menuIds))
        whereCondition.and(tbPostContent.postType.eq("post"))

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbPostContent.menu1Id.eq(menu1Id))
        }

        val contents = jpaQueryFactory.select(
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
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,
                tbUserScrap.isNotNull.`as`("scrapes"),
                tbPostContent.createdAt,
            )
        ).from(tbPostContent)
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            // scrap
            .leftJoin(tbUserScrap).on(tbUserScrap.id.postId.eq(tbPostContent.id).and(tbUserScrap.id.userId.eq(userInfo.id)))
            .where(whereCondition)
//            .where(tbPostContent.menu2Id.`in`(menuIds))
//            .where(tbPostContent.postType.eq("post"))

//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            .where(MainPostHelper.defaultPostListCondition())
            .orderBy(tbPostContent.createdAt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName
                it
            }

        return contents
    }
}