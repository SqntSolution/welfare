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
 * 배너 관리
 */
@Entity
@Table(name = "tb_banner")
class TbBanner {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id", nullable = false)
    var id: Int? = null

    /**
     * 타이틀
     */
    @Column(name = "title", length = 200)
    var title: String? = null

    /**
     * sub title
     */
    @Column(name = "sub_title", length = 200)
    var subTitle: String? = null

    /**
     * 배너 이미지 경로
     */
    @Column(name = "image_path", length = 400)
    var imagePath: String? = null

    /**
     * link
     */
    @Column(name = "link", length = 1000)
    var link: String? = null

    /**
     * link에 대해서 _top 또는 _blank
     */
    @Column(name = "link_type", length = 20)
    var linkType: String? = null

    /**
     * 사용여부 (사용하면 true)
     */
    @Column(name = "enabled", nullable = false)
    var enabled: Boolean? = false

    /**
     * 배경색깔
     */
    @Column(name = "background_color", length = 20)
    var backgroundColor: String? = null

    /**
     * 보여지는 순서
     */
    @Column(name = "display_order")
    var displayOrder: Int? = null

    /**
     * 권한 레벨 (0~9)
     */
    @Column(name = "auth_level", nullable = false)
    var authLevel: Int? = null

    /**
     * 배너시작일자
     */
    @Column(name = "display_start_date")
    var displayStartDate: LocalDate? = null

    /**
     * 배너종료일자
     */
    @Column(name = "display_end_date")
    var displayEndDate: LocalDate? = null

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
     * 1 depth 메뉴 id
     */
    @Column(name = "menu1_id")
    var menu1Id: Int? = null

    /**
     * 2 depth 메뉴 id
     */
    @Column(name = "menu2_id")
    var menu2Id: Int? = null

}