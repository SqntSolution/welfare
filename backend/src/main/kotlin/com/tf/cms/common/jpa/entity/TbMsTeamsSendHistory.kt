package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * MS-Teams 발송 이력
 */
@Entity
@Table(name = "tb_ms_teams_send_history")
class TbMsTeamsSendHistory {
    /**
     * 발송이력id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
    var id: Int? = null

    /**
     * 알림구분 (approval/mail/board/default/others 등)
     */
    @Column(name = "noti_type", length = 20)
    var notiType: String? = null

    /**
     * 수신자 AD ID
     */
    @Column(name = "user_id", length = 20)
    var userId: String? = null

    /**
     * 발신자명
     */
    @Column(name = "sender", length = 64)
    var sender: String? = null

    /**
     * 알림내용
     */
    @Column(name = "noty_str", length = 4000)
    var notyStr: String? = null

    /**
     * 알림발송날짜
     */
    @Column(name = "post_date")
    var postDate: String? = null

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
     * 발송결과
     */
    @Column(name = "send_status", length = 10)
    var sendStatus: String? = null

    /**
     * 발송오류내용
     */
    @Column(name = "error_msg", length = 200)
    var errorMsg: String? = null

    /**
     * 작성일시
     */
    @Column(name = "created_at")
    var createdAt: LocalDateTime? = null
}