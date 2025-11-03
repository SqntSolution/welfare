package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table

/**
 * 조직,직급,직책 정보
 */
@Entity
@Table(name = "tb_hr_code_master")
class TbHrCodeMaster {
    @EmbeddedId
    var id: TbHrCodeMasterId? = null

    /**
     * 상위포함조직코드(현조직제외), 직급코드, 직책코드
     */
    @Column(name = "FULL_CODE2", length = 64)
    var fullCode2: String? = null

    /**
     * 조직명, 직급명, 직책명
     */
    @Column(name = "CODE_NM", length = 256)
    var codeNm: String? = null

    /**
     * 계정명
     */
    @Column(name = "UID", length = 20)
    var uid: String? = null

    /**
     * 메일 주소
     */
    @Column(name = "EMAIL", length = 256)
    var email: String? = null

    /**
     * 유효시작
     */
    @Column(name = "CODE_REGD", length = 64)
    var codeRegd: String? = null

    /**
     * 표시순서
     */
    @Column(name = "DISPLAY_ORDER", length = 64)
    var displayOrder: String? = null
}