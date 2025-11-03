package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 사용자
 */
@Entity
@Table(name = "tb_user")
class TbUser {
    /**
     * 유저 id
     */
    @Id
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * 닉네임
     */
    @Column(name = "nickname", length = 100)
    var nickname: String? = null

    /**
     * 아바타 이미 경로
     */
    @Column(name = "avatar_img_path", length = 200)
    var avatarImgPath: String? = null

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

    /**
     * 공지등록시에 알람을 받을지 여부
     */
    @Column(name = "notice_alarm_enabled")
    var noticeAlarmEnabled: Boolean? = false

    /**
     * Q&A 답변을 등록했을때, 알람을 받을지 여부
     */
    @Column(name = "qna_answer_alarm_enabled")
    var qnaAnswerAlarmEnabled: Boolean? = false

    /**
     * 댓글에 대한 알람을 받을지 여부
     */
    @Column(name = "comment_alarm_enabled")
    var commentAlarmEnabled: Boolean? = false

    /**
     * 구독하는 카테고리에 신규 Post가 등록되었을때, 알람을 받을지 여부
     */
    @Column(name = "new_post_alarm_enabled")
    var newPostAlarmEnabled: Boolean? = false
}