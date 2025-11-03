package com.tf.cms.biz.common

import com.tf.cms.common.jpa.entity.QTbAddJobMaster
import com.tf.cms.common.jpa.entity.QTbHrCodeMaster
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions.select
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.stereotype.Component
import java.time.LocalDate


/**
 * user 관련한 조회
 */
@Component
class UserComponent(
        private val jpaQueryFactory: JPAQueryFactory,
) {
    private val logger = logger()

    /**
     * (인사 정보) 사용자 부서 및 직급 정보 단건 조회
     *
     * @param userId
     * @return
     */
    fun getDbUserInfoFromDb(userId: String): DbUserInfo? {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val subQuery1 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery2 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery3 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)

        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        return jpaQueryFactory
                .select(
                        Projections.fields(
                            DbUserInfo::class.java,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm,
                            ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                            ExpressionUtils.`as`(subQuery2, "dutyNm"),
                            ExpressionUtils.`as`(subQuery3, "empGradeNm")
                        )
                )
                .from(tbUserMaster)
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .leftJoin(tbAddJobMaster).on(
                tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .where(tbUserMaster.userId.eq(userId))
                .groupBy(tbUserMaster.userId)
                .fetchFirst()
    }

}

data class DbUserInfo(
        var userId: String? = null,
        var userNm: String? = null,
        var orgId: String? = null,
        var orgNm: String? = null,
        var parentOrgNm: String? = null,
        var dutyNm: String? = null,
        var empGradeNm: String? = null,
)