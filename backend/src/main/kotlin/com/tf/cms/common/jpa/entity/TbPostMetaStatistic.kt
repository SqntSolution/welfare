package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/**
 * post 또는 page의 조회/좋아요/별표 등의 정보
 */
@Entity
@Table(name = "tb_post_meta_statistics")
class TbPostMetaStatistic {

    /**
     *  post_id
     */
    @Id
    @Column(name = "post_id", nullable = false)
    var id: Int? = null

    /**
     * 조회 건수
     */
    @Column(name = "view_cnt", nullable = false)
    var viewCnt: Int? = null

    /**
     * 좋아요 건수
     */
    @Column(name = "likes_cnt", nullable = false)
    var likesCnt: Int? = null

    /**
     * scrap 건수
     */
    @Column(name = "scrap_cnt", nullable = false)
    var scrapCnt: Int? = null

    /**
     * 공유 건수
     */
    @Column(name = "share_cnt", nullable = false)
    var shareCnt: Int? = null
}