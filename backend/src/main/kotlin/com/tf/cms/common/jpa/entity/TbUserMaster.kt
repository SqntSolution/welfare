package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 인사마스터 정보
 */
@Entity
@Table(name = "tb_user_master")
class TbUserMaster {
    /**
     * 사번(인사임직원 empno, 인사외임직원 uid)
     */
    @Id
    @Column(name = "user_id", length = 64)
    var userId: String? = null

//    /**
//     * 사번(인사임직원 empno, 인사외임직원 uid)
//     */
//    @Id
//    @Column(name = "emp_id", length = 64)
//    var empId: String? = null

    /**
     * 전체 이름
     */
    @Column(name = "user_nm", length = 256)
    var userNm: String? = null

//    /**
//     * 전체 이름
//     */
//    @Column(name = "emp_nm", length = 256)
//    var empNm: String? = null

    /**
     * 부서 코드
     */
    @Column(name = "org_id", length = 64)
    var orgId: String? = null

    /**
     * 부서명
     */
    @Column(name = "org_nm", length = 256)
    var orgNm: String? = null

    /**
     * 메일 주소
     */
    @Column(name = "mail_addr", length = 256)
    var mailAddr: String? = null

    /**
     * 휴대폰 번호
     */
    @Column(name = "mobile_no", length = 64)
    var mobileNo: String? = null

    /**
     * AD계정명
     */
    @Column(name = "login_id", length = 100)
    var loginId: String? = null

//    /**
//     * AD계정명
//     */
//    @Column(name = "user_id", length = 100)
//    var userId: String? = null


    /**
     * 비밀번호 hash
     */
    @Column(name = "passwd_hash", length = 100)
    var passwdHash: String? = null


    /**
     * 계정 활성화 여부
     */
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean? = true


    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

//    /**
//     * 작성자 ID
//     */
//    @Column(name = "created_user_id", length = 100)
//    var createdUserId: String? = null
//
//    /**
//     * 작성자명
//     */
//    @Column(name = "created_user_nm", length = 100)
//    var createdUserNm: String? = null

    /**
     * 수정일시
     */
    @Column(name = "modified_at")
    var modifiedAt: LocalDateTime? = null

//    /**
//     * 수정자 ID
//     */
//    @Column(name = "modified_user_id", length = 100)
//    var modifiedUserId: String? = null
//
//    /**
//     * 수정자명
//     */
//    @Column(name = "modified_user_nm", length = 100)
//    var modifiedUserNm: String? = null
}