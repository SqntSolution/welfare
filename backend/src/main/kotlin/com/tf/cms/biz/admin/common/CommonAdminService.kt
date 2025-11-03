package com.tf.cms.biz.admin.common

import com.tf.cms.common.jpa.entity.QTbAddJobMaster
import com.tf.cms.common.jpa.entity.QTbHrCodeMaster
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.repository.TbAuthGroupRepository
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.QTbHrUserMaster
import com.tf.cms.common.utils.*
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class CommonAdminService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val menuIdHolder: MenuIdHolder,
        private val tbAuthGroupRepository: TbAuthGroupRepository
) {
    private val logger = logger()

    /**
     * 팀 목록 조회
     *
     * @return
     */
    fun findTeamList(): List<TeamInfo> {
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        return jPAQueryFactory
                .select(
                        Projections.fields(
                            TeamInfo::class.java,
                            tbHrCodeMaster.id.fullCode.`as`("code"),
                            tbHrCodeMaster.codeNm,
                            tbHrCodeMaster.displayOrder,
                            tbHrCodeMaster.id.fullCode.`as`("orgKey")
                        )
                )
                .from(tbHrCodeMaster)
                .where(HrUserCondition.defaultHrCodeMasterCondition())
                .orderBy(
                    tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc()
                )
                .fetch()
    }

    /**
     * 그룹 및 조직 정보 조회
     *
     * @return
     */
    fun findGroupAndTeamList(): List<GroupAndTeamInfo> {
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val subQuery1 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2))
                .where(tbHrCode.id.groupCode.eq(tbHrCodeMaster.id.groupCode))
                .where(tbHrCode.id.groupCode.eq("ORG")).limit(1)
        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            GroupAndTeamInfo::class.java,
                            tbHrCodeMaster.id.code.`as`("orgId"),
                            tbHrCodeMaster.codeNm.`as`("orgNm"),
                            tbHrCodeMaster.id.fullCode.`as`("orgFullCode"),
                            ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                            tbHrCodeMaster.id.fullCode.`as`("orgKey")
                        )
                )
                .from(tbHrCodeMaster)
                .where(HrUserCondition.defaultHrCodeMasterCondition())
                .orderBy(
                    tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc()
                )
                .fetch()
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

    /**
     * 권한그룹 목록 조회
     *
     * @return
     */
    fun findAuthGroupList(): List<AuthGroupInfo> {
        return tbAuthGroupRepository.findAll().map { AuthGroupInfo(it) }
    }

    /**
     * 사용자 목록 조회
     *
     * @return
     */
    fun findMemberList(): List<MemberInfo> {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val tbHrUserMaster = QTbHrUserMaster.tbHrUserMaster

        val subQuery1 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery2 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery3 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)
        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            MemberInfo::class.java,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbUserMaster.loginId,
                            tbUserMaster.mailAddr,
                            tbUserMaster.isActive,
                            tbUserMaster.mobileNo,
                            ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm,
                            ExpressionUtils.`as`(subQuery2, "dutyNm"),
                            ExpressionUtils.`as`(subQuery3, "empGradeNm")
                        )
                )
                .from(tbUserMaster)
//                .innerJoin(tbHrUserMaster).on(tbHrUserMaster.empId.eq(tbUserMaster.userId)) // 멤버 조회 범위를 회사 소속으로 변경
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG")))
                .leftJoin(tbAddJobMaster).on(
                        tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .where(
//                        HrUserCondition.defaultUserMasterCondition()
//                                .and(
                                    HrUserCondition.defaultHrCodeMasterCondition(true))
//                )
                .groupBy(tbUserMaster.userId)
                .orderBy(
                        tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc(),
                    tbUserMaster.userNm.asc()
                )
                .fetch()
                .map {
                    //전화번호, 메일주소 마스킹 처리
                    it.mailAddr = if (it.mailAddr != null) Helpers.maskEmail(it.mailAddr!!) else null
                    it.mobileNo = if (it.mobileNo != null) Helpers.maskPhone(it.mobileNo!!) else null
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

    /**
     * 메뉴 목록 조회
     *
     * @return
     */
    fun findMenuInfoList(): List<MenuInfo> {
        val allMenus = menuIdHolder.getAllMenus()
                .filter { !FixedMenuTypes.contains(it.contentType) }
                .map { MenuInfo(it) }
                .sortedBy { it.menuSeq }
        val menuMap = allMenus.groupBy { it.parentId }

        val result = allMenus
                .filter { it.parentId == 0 }
                .map {
                    it.childrenMenu = menuMap[it.id]
                    it
                }

        return result
    }

    /**
     * 정적 메뉴 목록 조회
     *
     * @return
     */
    fun findDynamicMenuInfoList(): List<MenuInfo> {
        val allMenus = menuIdHolder.getAllMenus()
            .filter { !FixedMenuTypes.contains(it.contentType) && it.staticYn == false}
            .map { MenuInfo(it) }
            .sortedBy { it.menuSeq }
        val menuMap = allMenus.groupBy { it.parentId }

        val result = allMenus
            .filter { it.parentId == 0 }
            .map {
                it.childrenMenu = menuMap[it.id]
                it
            }

        return result
    }
}