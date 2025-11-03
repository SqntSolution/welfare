package com.tf.cms.biz.common.scheduler

import com.tf.cms.common.jpa.entity.QTbStatisticsSummary
import com.tf.cms.common.jpa.entity.QTbUserHistory
import com.tf.cms.common.jpa.entity.TbStatisticsSummary
import com.tf.cms.common.jpa.repository.TbStatisticsSummaryRepository
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.logger
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

/**
 * 통계 테이블용 데이타를 생성하기 위한 scheduler
 */
@Component
class StatisticScheduler(
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbStatisticsSummaryRepository: TbStatisticsSummaryRepository,
) {
    private val logger = logger()

    /**
     * 방문자수 통계 생성
     */
    @Scheduled(fixedDelay = 60 * 60 * 1000, initialDelay = 60 * 1000)
    @Transactional(rollbackOn = [Throwable::class])
    fun makeStatisticsForVisitorsCount() {
        logger.info { "=== 통계 생성 스케쥴러 시작" }

        val now = LocalDateTime.now()
        val today = LocalDate.now()
        val yesterday = LocalDate.now().minusDays(1)

        // 오늘에 대해서 생성
        createVisitorsCount(today)
        createViewCount(today)
        createFileDownloadCount(today)
        createSubscribeCount(today)

        // 오늘이 2시 이전이면 어제도 생성
        if(now.hour<2){
            createVisitorsCount(yesterday)
            createViewCount(yesterday)
            createFileDownloadCount(yesterday)
            createSubscribeCount(yesterday)
        }

    }

    /**
     * 일간 방문자수 통계.
     * (tag1 : con)
     */
    private fun createVisitorsCount(date:LocalDate){
        logger.info { "=== 방문자수 통계 생성 시작" }
        val actionType = UserHistoryActionType.login.code

        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbUserHistory2 = QTbUserHistory.tbUserHistory // 총방문자수 저장 (측정가능)
        val tbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary

        val count = jpaQueryFactory.select(tbUserHistory.userId.countDistinct())
            .from(tbUserHistory)
            .where(tbUserHistory.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory.actionType.eq(actionType))
            .fetchFirst()

        val totalCount = jpaQueryFactory.select(tbUserHistory2.userId.count())
            .from(tbUserHistory2)
            .where(tbUserHistory2.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory2.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory2.actionType.eq(actionType))
            .fetchFirst()

        val existingEntity = jpaQueryFactory.selectFrom(tbStatisticsSummary)
            .where(tbStatisticsSummary.tag1.eq(actionType))
            .where(tbStatisticsSummary.targetDate.eq(date))
            .fetchFirst()

        if(existingEntity==null){
            TbStatisticsSummary().let {
                it.targetDate = date
                it.cnt = count.toInt()
                it.tag1= actionType
                it.totalVisitsCnt = totalCount.toInt()

                tbStatisticsSummaryRepository.save(it)
            }

        }else{
            existingEntity.let {
                it.cnt = count.toInt()
                it.totalVisitsCnt = totalCount.toInt()
                tbStatisticsSummaryRepository.save(it)
            }
        }
    }

    /**
     * 일간 조회 건수 통계.
     * (tag1 : con)
     */
    private fun createViewCount(date:LocalDate){
        logger.info { "=== 일간 조회건수 통계 생성 시작" }

        val actionType = UserHistoryActionType.post_view.code

        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary

        val count = jpaQueryFactory.select(tbUserHistory.userId.count())
            .from(tbUserHistory)
            .where(tbUserHistory.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory.actionType.eq(actionType))
            .fetchFirst()

        val existingEntity = jpaQueryFactory.selectFrom(tbStatisticsSummary)
            .where(tbStatisticsSummary.tag1.eq(actionType))
            .where(tbStatisticsSummary.targetDate.eq(date))
            .fetchFirst()

        if(existingEntity==null){
            TbStatisticsSummary().let {
                it.targetDate = date
                it.cnt = count.toInt()
                it.tag1= actionType

                tbStatisticsSummaryRepository.save(it)
            }

        }else{
            existingEntity.let {
                it.cnt = count.toInt()
                tbStatisticsSummaryRepository.save(it)
            }
        }
    }

    /**
     * 파일 다운로드 건수 통계.
     * (tag1 : con)
     */
    private fun createFileDownloadCount(date:LocalDate){
        logger.info { "=== 파일 다운로드 통계 생성 시작" }

        val actionType = UserHistoryActionType.file_download.code

        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary

        val count = jpaQueryFactory.select(tbUserHistory.userId.count())
            .from(tbUserHistory)
            .where(tbUserHistory.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory.actionType.eq(actionType))
            .fetchFirst()

        val existingEntity = jpaQueryFactory.selectFrom(tbStatisticsSummary)
            .where(tbStatisticsSummary.tag1.eq(actionType))
            .where(tbStatisticsSummary.targetDate.eq(date))
            .fetchFirst()

        if(existingEntity==null){
            TbStatisticsSummary().let {
                it.targetDate = date
                it.cnt = count.toInt()
                it.tag1= actionType

                tbStatisticsSummaryRepository.save(it)
            }

        }else{
            existingEntity.let {
                it.cnt = count.toInt()
                tbStatisticsSummaryRepository.save(it)
            }
        }
    }

    /**
     * 구독 건수 통계.
     * (tag1 : con)
     */
    private fun createSubscribeCount(date:LocalDate){
        logger.info { "=== 구독건수 통계 생성 시작" }

        val actionType = UserHistoryActionType.subscribe.code
        val actionType2 = UserHistoryActionType.subscribe_remove.code

        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary

        val plusCount = jpaQueryFactory.select(tbUserHistory.userId.count())
            .from(tbUserHistory)
            .where(tbUserHistory.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory.actionType.eq(actionType))
            .fetchFirst()

        val minusCount = jpaQueryFactory.select(tbUserHistory.userId.count())
            .from(tbUserHistory)
            .where(tbUserHistory.createdAt.goe(date.atStartOfDay()))
            .where(tbUserHistory.createdAt.lt(date.plusDays(1).atStartOfDay()))
            .where(tbUserHistory.actionType.eq(actionType2))
            .fetchFirst()

        val existingEntity = jpaQueryFactory.selectFrom(tbStatisticsSummary)
            .where(tbStatisticsSummary.tag1.eq(actionType))
            .where(tbStatisticsSummary.targetDate.eq(date))
            .fetchFirst()

        if(existingEntity==null){
            TbStatisticsSummary().let {
                it.targetDate = date
                it.cnt = plusCount.toInt() - minusCount.toInt()
                it.tag1= actionType

                tbStatisticsSummaryRepository.save(it)
            }

        }else{
            existingEntity.let {
                it.cnt = plusCount.toInt() - minusCount.toInt()
                tbStatisticsSummaryRepository.save(it)
            }
        }
    }

}