package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbHrUserMaster
 * author         : 정상철
 * date           : 2025-06-04
 * description    : 인사기반의 사용자정보 Entity
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04        정상철       최초 생성
 */

/**
 * 인사기반의 사용자정보
 */
@Entity
@Table(name = "tb_hr_user_master")
class TbHrUserMaster {

    /**
     * 사번(인사임직원 empno, 인사외임직원 uid)
     */
    @Id
    @Column(name = "emp_id", length = 64)
    var empId: String? = null

    /**
     * 전체 이름
     */
    @Column(name = "emp_nm", length = 256)
    var empNm: String? = null

    /**
     * 부서 코드
     */
    @Column(name = "org_id", length = 64, nullable = false)
    var orgId: String? = null

    /**
     * 부서명
     */
    @Column(name = "org_nm", length = 256, nullable = false)
    var orgNm: String? = null

    /**
     * 입사일자 (YYYYMMDD)
     */
    @Column(name = "grp_ymd", length = 64, nullable = false)
    var grpYmd: String? = null

    /**
     * 퇴사일자 (YYYYMMDD)
     */
    @Column(name = "retire_ymd", length = 64)
    var retireYmd: String? = null

    /**
     * 인사정보 구분(인사,인사외,협력업체)
     */
    @Column(name = "obj_category", length = 256)
    var objCategory: String? = null

    /**
     * 사무실전화번호
     */
    @Column(name = "office_tel_no", length = 64)
    var officeTelNo: String? = null

    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

    /**
     * 작성자 ID
     */
    @Column(name = "created_user_id", length = 100)
    var createdUserId: String? = null

    /**
     * 작성자명
     */
    @Column(name = "created_user_nm", length = 100)
    var createdUserNm: String? = null

    /**
     * 수정일시
     */
    @Column(name = "modified_at")
    var modifiedAt: LocalDateTime? = null

    /**
     * 수정자 ID
     */
    @Column(name = "modified_user_id", length = 100)
    var modifiedUserId: String? = null

    /**
     * 수정자명
     */
    @Column(name = "modified_user_nm", length = 100)
    var modifiedUserNm: String? = null
}
