package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 추천 post
 */
@Entity
@Table(name = "tb_post_recommend")
class TbPostRecommend {
    /**
     * postId
     */
    @Id
    @Column(name = "post_id", nullable = false)
    var id: Int? = null

//    /**
//     * 1차 메뉴id
//     */
//    @Column(name = "menu1_id", nullable = false)
//    var menu1Id: Int? = null
//
//    /**
//     * 2차 메뉴id
//     */
//    @Column(name = "menu2_id", nullable = false)
//    var menu2Id: Int? = null
//
//    /**
//     * 적용일시-최신이 우선순위가 높음.
//     */
//    @Column(name = "applied_at", nullable = false)
//    var appliedAt: LocalDateTime? = null

        /**
     * 2차 메뉴id
     */
    @Column(name = "display_seq", nullable = false)
    var displaySeq: Int? = null

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