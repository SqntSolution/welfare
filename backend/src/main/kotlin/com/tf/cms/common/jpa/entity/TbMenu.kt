package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 메뉴
 */
@Entity
@Table(name = "tb_menu")
class TbMenu {
    /**
     * 메뉴 id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id", nullable = false)
    var id: Int? = null

    /**
     * 메뉴명
     */
    @Column(name = "menu_nm", nullable = false, length = 50)
    var menuNm: String? = null

    /**
     * 부모 menu id
     */
    @Column(name = "parent_menu_id", nullable = false)
    var parentMenuId: Int? = null

    /**
     * 영문명(url 경로에 쓰임)
     */
    @Column(name = "menu_eng_nm", nullable = false, length = 50)
    var menuEngNm: String? = null

    /**
     * 메뉴가 보여지는 순서
     */
    @Column(name = "menu_seq", nullable = false)
    var menuSeq: Int? = null

    /**
     * 사용여부 (사용하면 true)
     */
    @Column(name = "enabled", nullable = false)
    var enabled: Boolean? = false

    /**
     * 종류(page, board, link,finder,center,notice,faq,qna,about,manual, null)
     */
    @Column(name = "content_type", length = 40)
    var contentType: String? = null

    /**
     * 음악회, 보도자료 등등 post 카테고리정보 (POST_CATEGORY 참조코드 참조)
     */
    @Column(name = "post_category", length = 100)
    var postCategory: String? = null

    /**
     * 종류가 page인 경우, post_id
     */
    @Column(name = "post_id")
    var postId: Int? = null

    /**
     * 종류가 link인 경우 link 정보
     */
    @Column(name = "link", length = 400)
    var link: String? = null

    /**
     * link에 대해서 _top 또는 _blank
     */
    @Column(name = "link_type", length = 20)
    var linkType: String? = null

    /**
     * 1차메뉴의 banner에 보여질 타이틀
     */
    @Column(name = "title", length = 100)
    var title: String? = null

    /**
     * 1차메뉴의 banner에 보여질 서브 타이틀
     */
    @Column(name = "sub_title", length = 100)
    var subTitle: String? = null

    /**
     * 배너 이미지 경로
     */
    @Column(name = "image_path", length = 400)
    var imagePath: String? = null

    /**
     * 설명
     */
    @Column(name = "description", length = 100)
    var description: String? = null

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
     * 정적 페이지 여부 (사용하면 true)
     */
    @Column(name = "static_yn", nullable = false)
    var staticYn: Boolean? = false
}