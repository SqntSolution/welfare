package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbTerms
 * author         : 정상철
 * date           : 2025-05-30
 * description    : 약관 내용 관리 Entity
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-30        정상철       최초 생성
 */


/**
 * 약관 내용 관리
 */

@Entity
@Table(
    name = "tb_terms",
    uniqueConstraints = [UniqueConstraint(name = "uq_terms_type_version_lang", columnNames = ["terms_type_code", "version", "lang"])],
    indexes = [
        Index(name = "idx_terms_active", columnList = "active_yn"),
        Index(name = "idx_terms_created_at", columnList = "created_at")
    ]
)
class TbTerms {

    /**
     * 약관 고유 ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "terms_id", nullable = false)
    var id: Int? = null

    /**
     * 약관 종류 코드 (공통코드 TOS_TYPE 참조)
     */
    @Column(name = "terms_type_code", nullable = false, length = 20)
    var termsTypeCode: String? = null

    /**
     * 약관 버전
     */
    @Column(name = "version", nullable = false, length = 10)
    var version: String? = null

    /**
     * 언어 코드 (예: ko, en, zh)
     */
    @Column(name = "lang", nullable = false, length = 10)
    var lang: String? = "ko"

    /**
     * 약관 제목
     */
    @Column(name = "title", length = 255)
    var title: String? = null

    /**
     * 설명 내용 (HTML 또는 텍스트)
     */
    @Column(name = "description")
    var description: String? = null

    /**
     * 약관 본문 내용 (HTML 또는 텍스트)
     */
    @Column(name = "content")
    var content: String? = null

    /**
     * 현재 활성화 여부
     */
    @Column(name = "active_yn")
    var active: Boolean? = false

    // 약관 적용 시작일
    @Column(name = "effective_start_date", nullable = false)
    var effectiveStartDate: LocalDate? = null

    // 약관 적용 종료일 (null이면 현재까지 유효)
    @Column(name = "effective_end_date")
    var effectiveEndDate: LocalDate? = null

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