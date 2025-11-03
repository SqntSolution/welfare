package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * POST와 PAGE 정보
 */
@Entity
@Table(name = "tb_post_contents")
class TbPostContent {
    /**
     * post(page) id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    var id: Int? = null

    /**
     * 음악회, 보도자료 등등 post 카테고리정보 (POST_CATEGORY 참조코드 참조)
     */
    @Column(name = "post_category", nullable = false, length = 100)
    var postCategory: String? = null

    /**
     * post or page (post인지 page인지)
     */
    @Column(name = "post_type", nullable = false, length = 10)
    var postType: String? = null

    /**
     * 제목
     */
    @Column(name = "title", nullable = false, length = 100)
    var title: String? = null

    /**
     * 설명
     */
    @Column(name = "description", length = 1000)
    var description: String? = null

    /**
     * private(비공개), public(공개), temp(임시저장)
     */
    @Column(name = "open_type", nullable = false, length = 20)
    var openType: String? = null

    /**
     * 사용여부 (사용하면 true)
     */
    @Column(name = "enabled", nullable = false)
    var enabled: Boolean? = false

    /**
     * 대표 이미지 경로
     */
    @Column(name = "representative_image_path", length = 200)
    var representativeImagePath: String? = null

    /**
     * 구독알림을 보냈는지여부(최초 한번만 구독 알람을 보냄)
     */
    @Column(name = "subscribe_alarm_sent", nullable = true)
    var subscribeAlarmSent: Boolean? = null

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
     * 이 게시물이 속한 1차 메뉴 id
     */
    @Column(name = "menu1_id", nullable = false)
    var menu1Id: Int? = null

    /**
     * 이 게시물이 속한 2차 메뉴 id
     */
    @Column(name = "menu2_id", nullable = false)
    var menu2Id: Int? = null

    /**
     * 이 게시물이 속한 권한 레벨
     */
    @Column(name = "auth_level", nullable = false, length = 10)
    var authLevel: Int? = null
}