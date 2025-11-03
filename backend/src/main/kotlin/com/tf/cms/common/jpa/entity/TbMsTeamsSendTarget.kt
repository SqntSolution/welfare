package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * MS-Teams 발송 대상 내역
 */
@Entity
@Table(name = "tb_ms_teams_send_target")
class TbMsTeamsSendTarget {
    /**
     * 발송대상내역id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "send_target_id", nullable = false)
    var id: Int? = null

    /**
     * 알림발송id
     */
    @Column(name = "send_id")
    var sendId: Int? = null

    /**
     * 발송대상유형(team, user)
     */
    @Column(name = "target_type", length = 20)
    var targetType: String? = null

    /**
     * 발송대상식별자(user_id, team_id)
     */
    @Column(name = "target_key", length = 64)
    var targetKey: String? = null

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
}