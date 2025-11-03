package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * MS-Teams 발송 내역
 */
@Entity
@Table(name = "tb_ms_teams_send_contents")
class TbMsTeamsSendContent {
    /**
     * 알림발송id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "send_id", nullable = false)
    var id: Int? = null

    /**
     * 알림 제목
     */
    @Column(name = "send_title", length = 100)
    var sendTitle: String? = null

    /**
     * 예약발송여부
     */
    @Column(name = "use_schedule_send", nullable = false)
    var useScheduleSend: Boolean? = false

    /**
     * 예약발송일시
     */
    @Column(name = "schedule_send_at")
    var scheduleSendAt: LocalDateTime? = null

    /**
     * 실제발송일시
     */
    @Column(name = "sent_at")
    var sentAt: LocalDateTime? = null

    /**
     * 알림내용
     */
    @Column(name = "noty_str", length = 4000)
    var notyStr: String? = null

    /**
     * 알림내용 팝업 웹URL
     */
    @Column(name = "web_link_url", length = 200)
    var webLinkUrl: String? = null

    /**
     * 알림내용 팝업 모바일URL
     */
    @Column(name = "mobile_link_url", length = 200)
    var mobileLinkUrl: String? = null

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