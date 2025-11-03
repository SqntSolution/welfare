package com.tf.cms.biz.user.main

import com.tf.cms.biz.common.MenuIdAndName
import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.common.jpa.entity.QTbAttachedFile
import com.tf.cms.common.jpa.entity.QTbMenuCustomContent
import com.tf.cms.common.jpa.entity.QTbPostContent
import com.tf.cms.common.jpa.entity.QTbPostMetaStatistic
import com.tf.cms.common.jpa.entity.QTbPostRecommend
import com.tf.cms.common.jpa.entity.QTbUserScrap
import com.tf.cms.common.jpa.entity.TbMenuCustomContent
import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.repository.TbMenuCustomContentRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.CategoryAccessDeniedException
import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.model.SearchType
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.FileExtension
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.google.common.base.Strings
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQuery
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.QTbPostMetaField
import com.tf.cms.common.jpa.entity.QTbPostMetaInfo
import com.tf.cms.common.jpa.entity.QTbRef
import jakarta.transaction.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import org.springframework.data.domain.PageImpl
import org.springframework.stereotype.Component

/**
 * 서브페이지에서 위쪽에 검색조건(국가별,주제별,등록일)에 따라서 post목록 조회
 */
@Component
class SubmainPageService(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val jpaQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val tbMenuCustomContentRepository: TbMenuCustomContentRepository,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val postPageService: PostPageService
) {
    private val logger = logger()

    /**
     * 서브페이지에서 위쪽에 검색조건(국가별,주제별,등록일)에 따라서 post목록 조회
     * menu2Id가 null 또는 0일때는 메뉴2가 '전체'
     * @return PostDto 의 List
     */
    fun getSubpageTopSearchablePosts(
        userId: String?, authGroupCds: List<String>?,
        searchParam: SubmainSearchParam,
        pagingRequest: PagingRequest,
    ): PageImpl<PostDto> {
        // 메뉴id, 메뉴명
        val menuNamesMap: Map<Int?, MenuIdAndName> = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val menu1Id = menuIdHolder.getMenuFromPath(searchParam.menu1)?.id
        val menu2Id = if (searchParam.menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(searchParam.menu1, searchParam.menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menu1Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu1Id]?.name})")
        }
        if (menu2Id != null && !accessibleMenuIds.contains(menu2Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu2Id]?.name})")
        }

        // 2차 메뉴들
        var theMenu2ids =
            roleAndMenuComponent.getMenu2idsBelongingToMenu1idExcludingNoAuth(menu1Id!!, menu2Id, authGroupCds!!)

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap

        val query: JPAQuery<PostDto> = jpaQueryFactory.select(
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

        // 국가별,주제별,등록일 검색 조건
        composeQueryConditionOfNationTopicCreatedate(
            query = query,
            searchType = SearchType.POST,
            nationConditions = searchParam.nationConditions,
            topicConditions = searchParam.topicConditions,
            startDateCondition = searchParam.startDateCondition,
            endDateCondition = searchParam.endDateCondition,
            fileTypeCondition = null,
            textConditions = searchParam.textCondition,
            keyword = searchParam.keyword,
        )

        val contents = query
            .where(MainPostHelper.defaultPostListCondition())
//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .orderBy(
                if (searchParam.isNewOrder()) {
                    tbPostContent.createdAt.desc()
                } else {
                    tbPostMetaStatistic.viewCnt.desc()
                }
            )
            .offset(pagingRequest.getOffset().toLong())
            .limit(pagingRequest.getLimit().toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName

                val metaList = postPageService.getPostMataInfo(it.id!!)
                if (it.metaInfoItems == null) {
                    it.metaInfoItems = MetaInfoItems()
                }
//                it.postMetaInfo = metaList
                it.metaInfoItems?.item1 = metaList.find { meta -> meta.metaKey == "item1" }?.metaValue
                it.metaInfoItems?.item2 = metaList.find { meta -> meta.metaKey == "item2" }?.metaValue
                it.metaInfoItems?.item3 = metaList.find { meta -> meta.metaKey == "item3" }?.metaValue
                it.metaInfoItems?.item4 = metaList.find { meta -> meta.metaKey == "item4" }?.metaValue
                it.metaInfoItems?.item5 = metaList.find { meta -> meta.metaKey == "item5" }?.metaValue
                it.metaInfoItems?.item6 = metaList.find { meta -> meta.metaKey == "item6" }?.metaValue
                it.metaInfoItems?.item7 = metaList.find { meta -> meta.metaKey == "item7" }?.metaValue
                it.metaInfoItems?.item8 = metaList.find { meta -> meta.metaKey == "item8" }?.metaValue
                it.metaInfoItems?.item9 = metaList.find { meta -> meta.metaKey == "item9" }?.metaValue
                it.metaInfoItems?.item10 = metaList.find { meta -> meta.metaKey == "item10" }?.metaValue
                it
            }

        val count = getSubpageTopSearchablePostsCount(
            userId = userId, authGroupCds = authGroupCds,
            searchParam = searchParam, theMenu2ids = theMenu2ids,
            menuNamesMap = menuNamesMap,
        )

        return PageImpl(contents, pagingRequest.toPageable(), count)
    }

    fun getSubpageTopSearchablePostsCount(
        userId: String?, authGroupCds: List<String>?,
        searchParam: SubmainSearchParam,
        theMenu2ids: List<Int>?,
        menuNamesMap: Map<Int?, MenuIdAndName>,
    ): Long {

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap

        val query = jpaQueryFactory.select(tbPostContent.count())
            .from(tbPostContent)

        // 국가별,주제별,등록일 검색 조건
        composeQueryConditionOfNationTopicCreatedate(
            query = query,
            searchType = SearchType.POST,
            nationConditions = searchParam.nationConditions,
            topicConditions = searchParam.topicConditions,
            startDateCondition = searchParam.startDateCondition,
            endDateCondition = searchParam.endDateCondition,
            fileTypeCondition = null,
            textConditions = searchParam.textCondition,
            keyword = searchParam.keyword
        )

        val count = query
            .where(MainPostHelper.defaultPostListCondition())
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .fetchFirst()!!

        return count
    }


    private fun composeQueryConditionOfNationTopicCreatedate(
        query: JPAQuery<*>,
        searchType: SearchType, // POST 또는 FILE
        nationConditions: List<String>? = null, // 국가
        topicConditions: List<String>? = null,  // 주제
        startDateCondition: String? = null, // 등록시작일
        endDateCondition: String? = null, // 등록종료일
        fileTypeCondition: List<String>? = null, // file의 종류 ppt, pdf, excel 등
        textConditions: List<String>? = null,  // 검색어,
        keyword : String? = null
    ) {
        val tbPostContent = QTbPostContent.tbPostContent
        val tbAttachedFile = QTbAttachedFile.tbAttachedFile
        // 등록일-시작
        if (!Strings.isNullOrEmpty(startDateCondition)) {
            yyyyMMddToDate(startDateCondition!!)?.let {
                query.where(tbPostContent.createdAt.goe(it.atStartOfDay()))
            }
        }
        // 등록일-종료
        if (!Strings.isNullOrEmpty(endDateCondition)) {
            yyyyMMddToDate(endDateCondition!!)?.let {
                query.where(tbPostContent.createdAt.loe(it.atTime(LocalTime.MAX)))
            }
        }
        // 파일 타입
        if (searchType == SearchType.FILE && !fileTypeCondition.isNullOrEmpty()) {
            val extList: MutableList<String> = mutableListOf()
            var isEtc = false
            fileTypeCondition!!.filter { it.isNotBlank() }.forEach {
                when (it) {
                    "ppt" -> extList.addAll(FileExtension.pptExt)
                    "pdf" -> extList.addAll(FileExtension.pdfExt)
                    "excel" -> extList.addAll(FileExtension.excelExt)
                    "image" -> extList.addAll(FileExtension.imageExt)
                    "movie" -> extList.addAll(FileExtension.movieExt)
                    "etc" -> isEtc = true
                }
            }
            if (isEtc) {
                query.where(
                    (
                            tbAttachedFile.fileExtension.notIn(
                                FileExtension.pptExt + FileExtension.pdfExt + FileExtension.excelExt + FileExtension.imageExt + FileExtension.movieExt
                            ).or(
                                tbAttachedFile.fileExtension.`in`(extList)
                            )
                            )
                )
            } else {
                query.where(tbAttachedFile.fileExtension.`in`(extList))
            }
        }
        // 멀티 검색어
        if (!textConditions.isNullOrEmpty()) {
            when (searchType) {
                SearchType.POST ->
                    textConditions!!
                        .filter { it.isNotBlank() }
                        .map { tbPostContent.title.contains(it).or(tbPostContent.description.contains(it)) }
                        .forEach { query.where(it) }

                SearchType.FILE ->
                    textConditions!!
                        .filter { it.isNotBlank() }
                        .map { tbAttachedFile.fileNm.contains(it) }
                        .forEach { query.where(it) }
            }
        }
        // 검색어 keyword = searchParam.keyword
        if (!keyword.isNullOrBlank()) {
            keyword.trim()
                .split("\\s+".toRegex())
                .filter { it.isNotBlank() }
                .map { word ->
                    tbPostContent.title.contains(word)
//                        .or(tbPostContent.description.contains(word))
                }
                .forEach { query.where(it) }
        }

        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        // 권한 레벨
        if (userInfo.authLevel!! >= 0) {
            query.where(tbPostContent.authLevel.loe(userInfo.authLevel))
        }
    }


    /**
     * submain페이지 위쪽에 있는 2차메뉴별 파일 검색
     */
    fun getSubpageFiles(
        userId: String?, authGroupCds: List<String>?,
        searchParam: SubmainSearchParam,
        pagingRequest: PagingRequest,
    ): PageImpl<FileDto> {
        // 메뉴id, 메뉴명
//        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val menu1Id = menuIdHolder.getMenuFromPath(searchParam.menu1)?.id
        val menu2Id = if (searchParam.menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(searchParam.menu1, searchParam.menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menu1Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menu1Id)})")
        }
        if (menu2Id != null && !accessibleMenuIds.contains(menu2Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menu2Id)})")
        }

        // 2차 메뉴들
        var theMenu2ids =
            roleAndMenuComponent.getMenu2idsBelongingToMenu1idExcludingNoAuth(menu1Id!!, menu2Id, authGroupCds!!)

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbAttachedFile = QTbAttachedFile.tbAttachedFile

        val query = jpaQueryFactory.select(
            Projections.fields(
                FileDto::class.java,
                tbAttachedFile.id,
                tbAttachedFile.fileClass,
                tbAttachedFile.fileNm,
                tbAttachedFile.fileExtension,
                tbAttachedFile.fileSize,
                tbAttachedFile.postId,
                tbPostContent.menu1Id,
                tbPostContent.menu2Id,
                tbPostContent.authLevel,
                tbPostContent.title,
            )
        ).from(tbPostContent)
            .innerJoin(tbAttachedFile).on(tbAttachedFile.postId.eq(tbPostContent.id))
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))

        // 국가별,주제별,등록일 검색 조건
        composeQueryConditionOfNationTopicCreatedate(
            query = query,
            searchType = SearchType.FILE,
            nationConditions = searchParam.nationConditions,
            topicConditions = searchParam.topicConditions,
            startDateCondition = searchParam.startDateCondition,
            endDateCondition = searchParam.endDateCondition,
            fileTypeCondition = searchParam.fileTypeCondition,
            textConditions = searchParam.textCondition,
            keyword = searchParam.keyword,
        )

        val contents = query
            .where(MainPostHelper.defaultPostListCondition())
//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .orderBy(
                if (searchParam.isNewOrder()) {
                    tbPostContent.createdAt.desc()
                } else {
                    tbPostMetaStatistic.viewCnt.desc()
                }
            )
            .offset(pagingRequest.getOffset().toLong())
            .limit(pagingRequest.getLimit().toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuIdHolder.getMenuNmFromId(it.menu1Id)
                it.menuName2 = menuIdHolder.getMenuNmFromId(it.menu2Id)
                it.menuEngName1 = menuIdHolder.getMenuFromId(it.menu1Id)?.path
                it.menuEngName2 = menuIdHolder.getMenuFromId(it.menu2Id)?.path
                it
            }

        val count = getSubpageFilesCount(
            userId = userId, authGroupCds = authGroupCds,
            searchParam = searchParam, pagingRequest = pagingRequest
        )

        return PageImpl(contents, pagingRequest.toPageable(), count)
    }


    /**
     * submain페이지 위쪽에 있는 2차메뉴별 파일 검색
     */
    fun getSubpageFilesCount(
        userId: String?, authGroupCds: List<String>?,
        searchParam: SubmainSearchParam,
        pagingRequest: PagingRequest,
    ): Long {
        // 메뉴id, 메뉴명
//        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val menu1Id = menuIdHolder.getMenuFromPath(searchParam.menu1)?.id
        val menu2Id = if (searchParam.menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(searchParam.menu1, searchParam.menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menu1Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menu1Id)})")
        }
        if (menu2Id != null && !accessibleMenuIds.contains(menu2Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menu2Id)})")
        }

        // 2차 메뉴들
        var theMenu2ids =
            roleAndMenuComponent.getMenu2idsBelongingToMenu1idExcludingNoAuth(menu1Id!!, menu2Id, authGroupCds!!)

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbAttachedFile = QTbAttachedFile.tbAttachedFile

        val query = jpaQueryFactory.select(tbAttachedFile.count())
            .from(tbPostContent)
            .innerJoin(tbAttachedFile).on(tbAttachedFile.postId.eq(tbPostContent.id))

        // 국가별,주제별,등록일 검색 조건
        composeQueryConditionOfNationTopicCreatedate(
            query = query,
            searchType = SearchType.FILE,
            nationConditions = searchParam.nationConditions,
            topicConditions = searchParam.topicConditions,
            startDateCondition = searchParam.startDateCondition,
            endDateCondition = searchParam.endDateCondition,
            fileTypeCondition = searchParam.fileTypeCondition,
            textConditions = searchParam.textCondition,
            keyword = searchParam.keyword,
        )

        val count = query
            .where(MainPostHelper.defaultPostListCondition())
//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .fetchFirst()

        return count

    }


    val yyyyMMddFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")

    fun yyyyMMddToDate(yyyyMMddParam: String): LocalDate? {
        val date = yyyyMMddParam.replace(Regex("[-/.]"), "")
        return if (date.length == 8) {
            return LocalDate.parse(date, yyyyMMddFormatter)
        } else {
            return null
        }
    }


    /**
     * 서브페이지에서 scrap top X개 가져오기
     * @return PostDto 의 List
     */
    fun getSubpageTopScraps(
        authGroupCds: List<String>,
        menu1: String,
        menu2: String?,
        fetchSize: Int
    ): List<PostSimpleDto>? {
        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val theMenu1 = menuIdHolder.getMenuFromPath(menu1)
        // my, cscenter 인 경우에는 없다.
        if(theMenu1?.contentType=="my" || theMenu1?.contentType=="cscenter"){
            return listOf()
        }

        val menu1Id = theMenu1?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }


        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menu1Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu1Id]?.name})")
        }
        if (menu2Id ?: 0 > 0 && !accessibleMenuIds.contains(menu2Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu2Id]?.name})")
        }

        // 2차 메뉴들
        var theMenu2ids =
            roleAndMenuComponent.getMenu2idsBelongingToMenu1idExcludingNoAuth(menu1Id!!, menu2Id, authGroupCds)

        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        // 조회
        val tbPostContent = QTbPostContent.tbPostContent

        val contents = jpaQueryFactory.select(
            Projections.fields(
                PostSimpleDto::class.java,
                tbPostContent.id,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.authLevel,
                tbPostContent.menu2Id,
                tbPostContent.createdAt,
            )
        ).from(tbPostContent)
            // scrap
            .innerJoin(tbPostMetaStatistic).on(
                tbPostMetaStatistic.id.eq(tbPostContent.id)
                    .and(tbPostMetaStatistic.scrapCnt.goe(1))
            )
            .where(MainPostHelper.defaultPostListCondition())
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .orderBy(tbPostMetaStatistic.scrapCnt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                it.menuName2 = menuIdHolder.getMenuNmFromId(it.menu2Id)
                it
            }

        return contents
    }

    /**
     * 서브페이지에서 Recommend top X개 가져오기
     * @return PostDto 의 List
     */
    fun getSubpageTopRecommends(
        authGroupCds: List<String>?,
        menu1: String,
        menu2: String?,
        fetchSize: Int
    ): List<PostSimpleDto>? {
        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menu1Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu1Id]?.name})")
        }
        if (menu2Id ?: 0 > 0 && !accessibleMenuIds.contains(menu2Id)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuNamesMap[menu2Id]?.name})")
        }

        // 2차 메뉴들
        var theMenu2ids = roleAndMenuComponent.getMenu2idsBelongingToMenu1idExcludingNoAuth(
            menu1Id!!,
            menu2Id,
            authGroupCds ?: listOf()
        )

//        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbPostRecommend = QTbPostRecommend.tbPostRecommend

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent

        val contents = jpaQueryFactory.select(
            Projections.fields(
                PostSimpleDto::class.java,
                tbPostContent.id,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.authLevel,
                tbPostContent.menu2Id,
                tbPostContent.createdAt,
            )
        ).from(tbPostContent)
            .where(MainPostHelper.defaultPostListCondition())
//            .where(tbPostContent.enabled.eq(true)) // 사용
//            .where(tbPostContent.openType.eq("public"))  // 공개
            // scrap
            .innerJoin(tbPostRecommend).on(tbPostRecommend.id.eq(tbPostContent.id))
            .where(tbPostContent.menu2Id.`in`(theMenu2ids ?: listOf(-99999)))
            .where(tbPostContent.postType.eq("post"))
            .orderBy(tbPostRecommend.displaySeq.asc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                it.menuName2 = menuIdHolder.getMenuNmFromId(it.menu2Id)
                it
            }

        return contents
    }


    /**
     * 서브페이지에서 custom zone의 데이타 조회
     */
    fun getSubpageCustomAreaData(authGroupCds: List<String>, menu1: String?, menu2: String?): String {
        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val theMenu1 = menuIdHolder.getMenuFromPath(menu1)
        // my, cscenter 인 경우에는 필요 없다.
        if(theMenu1?.contentType=="my" || theMenu1?.contentType=="cscenter"){
            return ""
        }

        val menuId = if (menu2.isNullOrEmpty()) {
            menuIdHolder.getMenuFromPath(menu1)?.id
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menuId)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menuId)})")
        }

        val tbMenuCustomContent = QTbMenuCustomContent.tbMenuCustomContent
        val contents = jpaQueryFactory.select(tbMenuCustomContent.contents).from(tbMenuCustomContent)
            .where(tbMenuCustomContent.id.eq(menuId)).fetchFirst() ?: ""


        return contents
    }

    /**
     * 서브페이지에서 custom zone의 데이타 저장
     */
    fun saveSubpageCustomAreaData(authGroupCds: List<String>, menu1: String?, menu2: String?, contents: String?) {
        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        val menuId = if (menu2.isNullOrEmpty()) {
            menuIdHolder.getMenuFromPath(menu1)?.id
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        // 접근가능여부 체크
        if (!accessibleMenuIds.contains(menuId)) {
            throw CategoryAccessDeniedException("해당 메뉴에 대해서 권한이 없습니다. (${menuIdHolder.getMenuNmFromId(menuId)})")
        }

        val userInfo = UserInfoHelper.getLoginUserInfo()!!

        val entityOptional = tbMenuCustomContentRepository.findById(menuId!!)
        if (entityOptional.isPresent) {
            // update
            entityOptional.get().let {
                it.contents = contents
                it.modifiedAt = LocalDateTime.now()
                it.modifiedUserId = userInfo.id
                it.modifiedUserNm = userInfo.name
                tbMenuCustomContentRepository.save(it)
            }

        } else {
            // insert
            TbMenuCustomContent().let {
                it.id = menuId
                it.contents = contents
                it.createdAt = LocalDateTime.now()
                it.createdUserId = userInfo.id
                it.createdUserNm = userInfo.name
                tbMenuCustomContentRepository.save(it)
            }

        }

    }

    /**
     * name: findMetaValuesByMetaKey
     * description: metaKey 별 필터 목록을 만들기 위한 meta-info 그룹핑
     * author: 정상철
     * created:

     *
     * @return
     */
    fun findMetaValuesByMetaKey(
        menu1: String,
        menu2: String?,
//        metaKey: String
    ): List<MetaInfoGroupDto>{
        val tbPostMetaField = QTbPostMetaField.tbPostMetaField
        val tbPostMetaInfo = QTbPostMetaInfo.tbPostMetaInfo
        val tbRefGroup = QTbRef("tbRefGroup")
        val tbRefValue = QTbRef("tbRefValue")

        val whereCondition = BooleanBuilder()
//            whereCondition.and(tbPostMetaField.groupCode.isNotNull)
//        whereCondition.and(tbPostMetaField.metaKey.eq(metaKey))
        whereCondition.and(tbPostMetaField.searchUseYn.eq(true))

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbPostMetaField.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbPostMetaField.menu2Id.eq(menu2Id))
        }

        val result = jpaQueryFactory
            .select(
                Projections.fields(
                    MetaInfoDto::class.java,
                    tbPostMetaInfo.metaKey,
                    tbPostMetaInfo.metaValue,
                    tbPostMetaField.menu1Id,
                    tbPostMetaField.menu2Id,
                    tbPostMetaField.metaType,
                    tbPostMetaField.metaNm,
                    tbPostMetaField.groupCode,
                    tbPostMetaField.searchUseYn,
                    tbRefValue.label.`as`("label")
                )
            )
            .distinct()
            .from(tbPostMetaInfo)
            .leftJoin(tbPostMetaField).on(tbPostMetaField.menu1Id.eq(tbPostMetaInfo.menu1Id).and(tbPostMetaField.menu2Id.eq(tbPostMetaInfo.menu2Id).and(tbPostMetaField.metaKey.eq(tbPostMetaInfo.metaKey))))
            .leftJoin(tbRefGroup).on(tbRefGroup.groupCode.eq(tbPostMetaField.groupCode))
            .leftJoin(tbRefValue).on(tbRefValue.code.eq(tbPostMetaInfo.metaValue).and(tbRefValue.groupCode.eq(tbPostMetaField.groupCode)))
            .where(whereCondition)
            .orderBy(tbPostMetaField.metaDisplayOrder.asc())
            .fetch()

        logger().debug { "resultresultresultresult >>${result}" }

        return result
            .filter { it.metaKey != null && it.groupCode != null}
            .groupBy { it.metaKey!!}
            .map { (metaKey, groupItems) ->
                val metaNm = groupItems.firstOrNull()?.metaNm ?: ""
                val metaType = groupItems.firstOrNull()?.metaType ?: ""
                val searchUseYn = groupItems.firstOrNull()?.searchUseYn ?: false
                val values = groupItems.mapNotNull { dto ->
                    val value = dto.metaValue
                    val label = dto.label
                    if (value != null && label != null) ValueLabelDto(value, label) else null
                }
                MetaInfoGroupDto(
                    metaKey = metaKey,
                    metaNm = metaNm,
                    metaType= metaType,
                    searchUseYn  = searchUseYn,
                    values = values
                )
            }
    }

}
