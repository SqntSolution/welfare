package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * 각종 통계 summary
 */
@Entity
@Table(name = "tb_statistics_summary")
class TbStatisticsSummary {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statistics_id", nullable = false)
    var id: Int? = null

    /**
     * 대상일
     */
    @Column(name = "target_date", nullable = false)
    var targetDate: LocalDate? = null

    /**
     * 카운트
     */
    @Column(name = "cnt")
    var cnt: Int? = null

    /**
     * 태그 1
     */
    @Column(name = "tag1", length = 20)
    var tag1: String? = null

    /**
     * 태그 2
     */
    @Column(name = "tag2", length = 20)
    var tag2: String? = null

    /**
     * 태그 3
     */
    @Column(name = "tag3", length = 20)
    var tag3: String? = null

    /**
     * 태그 4
     */
    @Column(name = "tag4", length = 20)
    var tag4: String? = null

    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null

    /**
     * 총방문자 카운트
     */
    @Column(name = "total_visits_cnt")
    var totalVisitsCnt: Int? = null
}