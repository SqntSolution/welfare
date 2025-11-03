package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime


/**
 * 팝업 게시판
 */

@Entity
@Table(name = "tb_popup")
class TbPopup {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType .IDENTITY)
    @Column(name = "popup_id", nullable = false)
    var id: Int? =null

    /**
     * 타이틀
     */
    @Column(name = "title", length = 500)
    var title: String? = null

    /**
     * 사용여부
     */
    @Column(name = "enabled")
    var enabled: Boolean? = false

    /**
     *  팝업게시할 메뉴 ID 목록
     */
    @Column(name = "display_menu_ids")
    var displayMenuIds: String? = null

    /**
     * 팝업 link
     */
    @Column(name = "link")
    var link:  String? = null

    /**
     * 창열림 Type
     */
    @Column(name = "display_type")
    var displayType: String? = null

    /**
     * 게시 시작 일자
     */
    @Column(name = "display_start_date")
    var displayStartDate: LocalDate? = null

    /**
     * 게시 종료 일자
     */
    @Column(name = "display_end_date")
    var displayEndDate: LocalDate? = null

    /**
     *  팝업 본문 내용
     */
    @Lob
    @Column(name = "contents")
    var contents: String? = null

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