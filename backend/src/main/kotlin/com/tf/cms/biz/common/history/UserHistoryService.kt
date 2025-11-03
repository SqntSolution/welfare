package com.tf.cms.biz.common.history

import com.tf.cms.common.jpa.entity.QTbUserHistory
import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class UserHistoryService(
        private val jpaQueryFactory: JPAQueryFactory,
        private val tbUserHistoryRepository: TbUserHistoryRepository
) {
    private val logger = logger()

    /**
     * Save user history
     *
     * @param input
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveUserHistory(input: UserHistoryInput) {
        val entity = TbUserHistory().apply {
            this.postId = input.postId
            this.userId = input.userId
            this.postTitle = input.postTitle
            this.description = input.description
            this.attachedFileId = input.attachedFileId
            this.attachedFileNm = input.attachedFileNm
            this.userName = input.userName
            this.actionType = input.actionType
            this.menu1Id = input.menu1Id
            this.menu2Id = input.menu2Id
            this.menu1Nm = input.menu1Nm
            this.menu2Nm = input.menu2Nm
            this.createdAt = LocalDateTime.now()
        }
        tbUserHistoryRepository.save(entity)
    }


    /**
     * userHistory 목록 조회 (관리자)
     *
     * @param actionType
     * @param startDate
     * @param endDate
     * @return
     */

    fun findUserHistory(
        actionType : String?,
        startDate : String?,
        endDate : String?,
//        fetchSize: Int = 10000
    ) : List<StatisticDto> {

        require(!actionType.isNullOrBlank()) { "actionType은 필수 값입니다." }
        require(!startDate.isNullOrBlank()) { "startDate는 필수 값입니다." }
        require(!endDate.isNullOrBlank()) { "endDate는 필수 값입니다." }

        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val whereCondition = BooleanBuilder()

        // 등록시작일
        Helpers.formatStringToLocalDate(startDate)?.let {
            whereCondition.and(qTbUserHistory.createdAt.goe(it.atStartOfDay()))
            LocalDateTime.of(it, LocalTime.MIDNIGHT)
        }

        // 등록종료일
        Helpers.formatStringToLocalDate(endDate)?.let {
            whereCondition.and(qTbUserHistory.createdAt.loe(it.atTime(LocalTime.MAX)))
            LocalDateTime.of(it, LocalTime.MIDNIGHT)
        }

        whereCondition.and(qTbUserHistory.actionType.eq(actionType))
        val dateExpression = Expressions.dateTemplate(LocalDate::class.java, "DATE({0})", qTbUserHistory.createdAt)

        val result = jpaQueryFactory
            .select(
                Projections.fields(
                    StatisticDto::class.java,
                    qTbUserHistory.userId,
                    qTbUserHistory.count().coalesce(0L).`as`("value"),
                    qTbUserHistory.createdAt,
                ),
            )
            .from(qTbUserHistory)
            .where(whereCondition)
            .groupBy(dateExpression)
//            .groupBy(qTbUserHistory.createdAt)
            .orderBy(qTbUserHistory.createdAt.asc())
//            .limit(fetchSize.toLong())
            .fetch()
        return result
    }

}