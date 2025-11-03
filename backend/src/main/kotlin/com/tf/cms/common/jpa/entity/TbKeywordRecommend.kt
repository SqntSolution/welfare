package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbKeywordRecommend
 * author         : 정상철
 * date           : 2025-05-15
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-15        정상철       최초 생성
 */
/**
 * 추천 검색어
 */
@Entity
@Table(name = "tb_keyword_recommend")
class TbKeywordRecommend {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommend_id", nullable = false)
    var id: Int? = null

    /**
     * 키워드
     */
    @Column(name = "keyword", nullable = false, length = 50)
    var keyword: String? = null

    /**
     * 정렬순서
     */
    @Column(name = "seq", nullable = false)
    var seq: Short? = null

    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

    /**
     * 작성자 id
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
     * 수정자 id
     */
    @Column(name = "modified_user_id", length = 100)
    var modifiedUserId: String? = null

    /**
     * 수정자명
     */
    @Column(name = "modified_user_nm", length = 100)
    var modifiedUserNm: String? = null
}