package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 사용자가 조회 및 각종 action을 한 것에 대한 history
 */
@Entity
@Table(name = "tb_user_history")
class TbUserHistory {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id", nullable = false)
    var id: Long? = null

    /**
     * post또는 page의 id
     */
    @Column(name = "post_id", nullable = false)
    var postId: Int? = null

    /**
     * board 게시물 id
     */
    @Column(name = "board_item_id")
    var boardItemId: Int? = null

    /**
     * 유저 id
     */
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * 게시물의 title
     */
    @Column(name = "post_title", length = 100)
    var postTitle: String? = null

    /**
     * 내용
     */
    @Column(name = "description", length = 500)
    var description: String? = null

    /**
     * 파일 id
     */
    @Column(name = "attached_file_id")
    var attachedFileId: Int? = null

    /**
     * 파일명
     */
    @Column(name = "attached_file_nm", length = 100)
    var attachedFileNm: String? = null

    /**
     * 유저명
     */
    @Column(name = "user_name", length = 100)
    var userName: String? = null

    /**
     * 접속,조회,등록,삭제 등
     */
    @Column(name = "action_type", length = 20)
    var actionType: String? = null

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

    /**
     * 1차 메뉴명
     */
    @Column(name = "menu1_nm", length = 50)
    var menu1Nm: String? = null

    /**
     * 2차 메뉴명
     */
    @Column(name = "menu2_nm", length = 50)
    var menu2Nm: String? = null

    /**
     * 생성한 날짜시간
     */
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime? = null
}