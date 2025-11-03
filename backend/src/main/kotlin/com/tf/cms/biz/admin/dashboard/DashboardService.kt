package com.tf.cms.biz.admin.dashboard

import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.model.FileClass
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.*
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class DashboardService(
    private val jpaQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val codeHolder: CodeHolder,
) {
    private val logger = logger()

    /**
     * dashboard에 보여질, 방문자 건수
     */
    fun getVisitorCountDataForChart(periodType : String): List<VisitorStatisticDto>? {
        val today = LocalDate.now()
        val startDate = today.minusDays(14)

        val tbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbStatisticsSummary.tag1.eq(UserHistoryActionType.login.code))
        if(periodType == "DAILY"){
            whereCondition.and(tbStatisticsSummary.targetDate.goe(startDate))
            whereCondition.and(tbStatisticsSummary.targetDate.loe(today))
        }

        val result = jpaQueryFactory.select(
            Projections.fields(
                VisitorStatisticDto::class.java,
                tbStatisticsSummary.targetDate.`as`("date"),
                tbStatisticsSummary.cnt.`as`("visitor"),
                tbStatisticsSummary.totalVisitsCnt.`as`("totalVisitor")
            )
        ).from(tbStatisticsSummary)
            .where(whereCondition)
//            .where(tbStatisticsSummary.targetDate.goe(startDate))
//            .where(tbStatisticsSummary.targetDate.loe(today))
            .orderBy(tbStatisticsSummary.targetDate.asc())
            .fetch()


        // 그룹화
        val groupedData = when (periodType) {
            "DAILY" -> result.groupBy { it.date.year * 10000 + it.date.monthValue * 100 + it.date.dayOfMonth }
//            "DAILY" -> result.groupBy {it.date}
            "YEARLY" -> result.groupBy { it.date.year }
            "HALF" -> result.groupBy { (it.date.monthValue - 1) / 6 + 1 }
            "QUARTERLY" -> result.groupBy { (it.date.monthValue - 1) / 3 + 1 }
            "MONTHLY" -> result.groupBy { it.date.monthValue }
            else -> result.groupBy { it.date.year * 10000 + it.date.monthValue * 100 + it.date.dayOfMonth }
        }


        return groupedData.map { (period, records) ->
            val totalVisitorForPeriod = records.sumOf { it.visitor ?: 0 }
            val totalTotalVisitorForPeriod = records.sumOf { it.totalVisitor ?: 0 }

            // 기준 날짜를 각 그룹의 시작일로 설정
            val periodStartDate = when (periodType) {
                "DAILY" -> {
                    // "DAILY"의 경우 period는 Int 타입이므로 이를 LocalDate로 변환
                    val year = period / 10000
                    val month = (period % 10000) / 100
                    val day = period % 100
                    LocalDate.of(year, month, day)
                }
                "YEARLY" -> LocalDate.of(period, 1, 1)
                "HALF" -> LocalDate.of(records.first().date.year, (period - 1) * 6 + 1, 1)
                "QUARTERLY" -> LocalDate.of(records.first().date.year, (period - 1) * 3 + 1, 1)
                "MONTHLY" -> LocalDate.of(records.first().date.year, period, 1)
                else -> {
                    val year = period / 10000
                    val month = (period % 10000) / 100
                    val day = period % 100
                    LocalDate.of(year, month, day)
                }
            }

            // 기간 종료 날짜 계산 (월별, 분기별, 반기별 끝날 계산)
            val periodEndDate = when (periodType) {
                "DAILY" -> {
                    periodStartDate // 일별은 종료 날짜를 period로 설정
                }
                "YEARLY" -> LocalDate.of(period, 12, 31)
                "HALF" -> {
                    // 반기별 끝날 날짜: 6월 30일, 12월 31일
                    val month = if (period == 1) 6 else 12
                    LocalDate.of(records.first().date.year, month, 1).withDayOfMonth(LocalDate.of(records.first().date.year, month, 1).lengthOfMonth())
                }
                "QUARTERLY" -> {
                    // 분기별 끝날 날짜: 3월 31일, 6월 30일, 9월 30일, 12월 31일
                    val month = period * 3
                    LocalDate.of(records.first().date.year, month, 1).withDayOfMonth(LocalDate.of(records.first().date.year, month, 1).lengthOfMonth())
                }
                "MONTHLY" -> {
                    // 월별 끝날 날짜: 해당 월의 마지막 날
                    LocalDate.of(records.first().date.year, period, 1).withDayOfMonth(LocalDate.of(records.first().date.year, period, 1).lengthOfMonth())
                }
                else -> periodStartDate
//                else -> LocalDate.of(period, 12, 31)  // 기본값은 연도별 종료일
            }

            VisitorStatisticDto(
                date = periodStartDate,
                visitor = totalVisitorForPeriod,
                totalVisitor = totalTotalVisitorForPeriod,
                periodStartDate = periodStartDate,
                periodEndDate   = periodEndDate
            )
        }
    }

    /**
     * notice 목록 조회
     */
    fun getNoticeListByRecentOrder(fetchSize: Int = 5): MutableList<BbsNoticeDto> {
        val tbBbsNormal = QTbBbsNormal.tbBbsNormal
        val tbMenu = QTbMenu.tbMenu

        val resultList = jpaQueryFactory.select(
            Projections.fields(
                BbsNoticeDto::class.java,
                tbBbsNormal.id,
                tbBbsNormal.menuId,
                tbBbsNormal.title,
                tbBbsNormal.opened,
                tbBbsNormal.viewCnt,
                tbBbsNormal.createdAt,
            )
        )
            .from(tbBbsNormal)
            .innerJoin(tbMenu).on(
                tbMenu.enabled.eq(true)
                    .and(tbMenu.contentType.eq("notice")).and(tbMenu.id.eq(tbBbsNormal.menuId))
            )
            .where(tbBbsNormal.opened.eq(true))
            .orderBy(tbBbsNormal.createdAt.desc(), tbBbsNormal.id.desc())
            .limit(fetchSize.toLong())
            .fetch()

        // 첨부파일을 불러오기
        val idList = resultList.map { it.id!! }.toList()
        val fileList = getFileList(FileClass.bbs, idList)

        // 첨부파일들을 resultList에 끼어 넣기
        resultList.forEach {
            val postId = it.id
            it.fileList = fileList.filter { it.postId == postId }.toList()
        }

        return resultList
    }


    /**
     * Q&A 목록 조회
     */
    fun getQnaListByRecentOrder(fetchSize: Int = 5): List<BbsQnaDto>? {
        val tbBbsQna = QTbBbsQna.tbBbsQna
        val tbMenu = QTbMenu.tbMenu

        val resultList = jpaQueryFactory.select(
            Projections.fields(
                BbsQnaDto::class.java,
                tbBbsQna.id,
                tbBbsQna.menuId,
                tbBbsQna.title,
                tbBbsQna.opened,
                tbBbsQna.viewCnt,
                tbBbsQna.createdAt,
                tbBbsQna.metaDivision,
                tbBbsQna.responseUserId,
            )
        )
            .from(tbBbsQna)
            .innerJoin(tbMenu).on(
                tbMenu.enabled.eq(true)
                    .and(tbMenu.contentType.eq("qna")).and(tbMenu.id.eq(tbBbsQna.menuId))
            )
            .orderBy(tbBbsQna.createdAt.desc(), tbBbsQna.id.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                it.metaDivisionDesc = codeHolder.getCodeLabel("QNA_TYPE", it.metaDivision)?.label
                it
            }

        return resultList
    }

    /**
     * post에 매달린 첨부파일들
     */
    private fun getFileList(type: FileClass, idList: List<Int>): MutableList<FileDownloadInfoDto> {
        val tbAttachedFile = QTbAttachedFile.tbAttachedFile
        val list = jpaQueryFactory.select(
            Projections.fields(
                FileDownloadInfoDto::class.java,
                tbAttachedFile.id.`as`("fileId"),
                tbAttachedFile.postId,
                tbAttachedFile.fileNm,
                tbAttachedFile.fileExtension,
                tbAttachedFile.fileSize,
            ),
        ).from(tbAttachedFile)
            .where(tbAttachedFile.postId.`in`(idList))
            .where(tbAttachedFile.fileClass.eq("bbs"))
            .orderBy(tbAttachedFile.postId.asc())
            .fetch()

        return list
    }


    /* 신규 포스트 */
    fun getNewPosts(fetchSize: Int, cond : MemberSearchParam): List<PostDto> {
        /* 개편사항 */
//        1단계  법인별 팀별 user_Id 목록을 추출한다 distinct
//        2단계  추출한 user_Id 목록을 가지고 history 에서 포스트 create 가 가장 최신 순인 거 10개를 추출한다
//        3단계  추출한 post_id로 포스트 테이블에서 조회한다 끝
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbCode = QTbCode.tbCode

        val whereCondition = BooleanBuilder()
        // 소속 팀

        val result = jpaQueryFactory.select(
            Projections.fields(
                PostDto::class.java,
                tbPostContent.id,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.menu1Id,
                tbPostContent.menu2Id,
                tbPostContent.createdAt,
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,
            )
        ).from(tbPostContent)
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            .leftJoin(tbUserMaster).on(tbUserMaster.userId.eq(tbPostContent.createdUserId))
            .where(whereCondition)
            .orderBy(tbPostContent.createdAt.desc(), tbPostContent.id.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menuName1 = menuIdHolder.getMenuNmFromId(it.menu1Id)
                it.menuName2 = menuIdHolder.getMenuNmFromId(it.menu2Id)
                it.menuEngName1 = menuIdHolder.getMenuFromId(it.menu1Id)?.path
                it.menuEngName2 = menuIdHolder.getMenuFromId(it.menu2Id)?.path
                // openType셋팅
                it.openTypeDesc = codeHolder.getCodeLabel("POST_OPEN_TYPE", it.openType)?.label ?: it.openType
                it
            }

        val postIds = result.map { it.id }.toList()

        // 첨부파일 다운로드 건수
        val tbAttachedFile = QTbAttachedFile.tbAttachedFile
        val downloadCntList = jpaQueryFactory.select(
            Projections.fields(
                DownloadCnt::class.java,
                tbAttachedFile.postId,
                tbAttachedFile.downloadCnt.sum().`as`("cnt")
            ),
        ).from(tbAttachedFile)
            .where(tbAttachedFile.postId.`in`(postIds))
            .where(tbAttachedFile.fileClass.eq("post"))
            .groupBy(tbAttachedFile.postId)
            .fetch()

        result.forEach {
            val postId = it.id
            it.downloadCnt = downloadCntList.find { it.postId==postId }?.cnt ?: 0
        }

        return result
    }


    /*기간별 조건 설정 (인기별 포스트)*/
    fun calculatePeriodRange(periodType: String): Pair<LocalDate, LocalDate> {
//        - **월간 : 지난 1개월**
//        **기준** : 전월 기준으로 수집
//        **기간** : 2025.03.01 - 2025.03.31
//        - **분기 : 지난 분기 3개월**
//        **기준** : 1분기 (1월-3월), 2분기 (4월-6월), 3분기 (7월-9월), 4분기 (10월-12월)
//        **기간** : 2025.01.01 - 2025.03.31
//        > 만약, 4-6월 중 어느날이라도 분기를 선택하면 이전 분기인 2025년 1월 - 3월 데이터를 기준으로 표시되야 함
//        - **반기 : 지난 반기 6개월**
//        **기준** : 상반기 (1월-6월), 하반기 (7월-12월)
//        **기간** : 2024.07.01 - 2024.12.31
//        > 2025년 1월 ~ 6월 중 어느날이라도 반기를 선택하면 이전 반기인 2024년 7월 - 12월 데이터를 기준으로 표시되야 함
//        - **연간 : 지난해 12개월**
//        **기준** : 2024년 1월 - 12월
//        **기간** : 2024.01.01 - 2024.12.31
//        > 2025년 1월 ~ 12월 중 어느날이라도 연간을 선택하면 이전 년도인 2024년 1월 - 12월 데이터를 기준으로 표시되야 함
        val now = LocalDate.now()

        return when (periodType) {
            "MONTHLY" -> {
                val start = now.minusMonths(1).withDayOfMonth(1)
                val end = start.withDayOfMonth(start.lengthOfMonth())
                start to end
            }
            "QUARTERLY" -> {
                val currentMonth = now.monthValue
                val currentQuarter = (currentMonth - 1) / 3 + 1
                val prevQuarter = currentQuarter - 1
                val year = if (prevQuarter < 1) now.year - 1 else now.year
                val startMonth = if (prevQuarter < 1) 10 else (prevQuarter - 1) * 3 + 1
                val start = LocalDate.of(year, startMonth, 1)
                val end = start.plusMonths(2).withDayOfMonth(start.plusMonths(2).lengthOfMonth())
                start to end
            }
            "HALF" -> {
                val currentHalf = if (now.monthValue <= 6) 1 else 2
                val year = if (currentHalf == 1) now.year - 1 else now.year
                val startMonth = if (currentHalf == 1) 7 else 1
                val start = LocalDate.of(year, startMonth, 1)
                val end = start.plusMonths(5).withDayOfMonth(start.plusMonths(5).lengthOfMonth())
                start to end
            }
            "YEARLY" -> {
                val year = now.year - 1
                val start = LocalDate.of(year, 1, 1)
                val end = LocalDate.of(year, 12, 31)
                start to end
            }
            else -> {
                val start = now.minusMonths(1).withDayOfMonth(1)
                val end = start.withDayOfMonth(start.lengthOfMonth())
                start to end
            }
        }
    }

    @DefaultConstructor
    data class DownloadCnt(var postId: Int?, var cnt: Int?)

}