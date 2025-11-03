package com.tf.cms.common.utils

import com.tf.cms.common.jpa.entity.QTbHrCodeMaster
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.querydsl.core.BooleanBuilder
import com.tf.cms.common.jpa.entity.QTbHrUserMaster
import java.time.LocalDate

object HrUserCondition {
    /**
     * Default if view hr code master condition
     */
    fun defaultHrCodeMasterCondition(includeTopLevel: Boolean? = false): BooleanBuilder {
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster

        val condition = BooleanBuilder()
//        condition.and(tbHrCodeMaster.id.groupCode.eq("ORG"))   //임시주석

//        condition.and(
//                tbHrCodeMaster.id..`in`("1100", "1200")
//                        .and(
//                                tbHrCodeMaster.id.fullCode.length().loe(10)
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000D0106%"))  /* BTI R＆I Unit */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000D0178%"))  /* GCC */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000D0203%"))  /* EAST 기획본부 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000D0205%"))  /* WEST 기획본부 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0055%"))  /* R＆I Unit */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0108%"))  /* 전략마케팅본부 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0112%"))  /* 디자인R&I 본부 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0189%"))  /* 마케팅부문 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0221%"))  /* Digital 사업부문 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0227%"))  /* OBM본부 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT12C0000D0255%"))  /* HR부문 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000C0016%"))  /* 해외마케팅부문 */
//                                        .or(tbHrCodeMaster.id.fullCode.like("DPT11C0000D0145%"))  /* IT부문 */
//                        )
//        )

//        if(includeTopLevel != true) {
//            condition.and(tbHrCodeMaster.id.fullCode.ne("99999"))
//        }

        return condition
    }

    /**
     * Default if view user master condition
     */
    fun defaultUserMasterCondition(): BooleanBuilder {
//        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrUserMaster = QTbHrUserMaster.tbHrUserMaster
        val currentDate = Helpers.formatLocalDate(LocalDate.now())

        val condition = BooleanBuilder()
        condition.and(tbHrUserMaster.empId.isNotNull)
        condition.and(tbHrUserMaster.retireYmd.isNull
                        .or(tbHrUserMaster.retireYmd.goe(currentDate)))

        return condition
    }
}