package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table

/**
 * 조직 관리
 */
@Entity
@Table(name = "tb_add_job_master")
class TbAddJobMaster {
    @EmbeddedId
    var id: TbAddJobMasterId? = null

    /**
     * 겸직소속 직위코드
     */
    @Column(name = "EMP_GRADE_CD", length = 64)
    var empGradeCd: String? = null

    /**
     * 겸직 부서의 직위명
     */
    @Column(name = "EMP_GRADE_NM", length = 256)
    var empGradeNm: String? = null

    /**
     * 겸직소속 직책코드
     */
    @Column(name = "DUTY_CD", length = 64)
    var dutyCd: String? = null

    /**
     * 겸직 부서의 직책명
     */
    @Column(name = "DUTY_NM", length = 256)
    var dutyNm: String? = null

    /**
     * 조직장 코드 (10:원소속, 20:겸직, 30: 대행)
     */
    @Column(name = "MGR_CLASS", length = 64)
    var mgrClass: String? = null

    /**
     * 발령일
     */
    @Column(name = "STA_YMD", length = 64)
    var staYmd: String? = null

    /**
     * 유효종료일
     */
    @Column(name = "END_YMD", length = 64)
    var endYmd: String? = null

    /**
     * 표시순서
     */
    @Column(name = "DISPLAY_ORDER", length = 64)
    var displayOrder: String? = null

}