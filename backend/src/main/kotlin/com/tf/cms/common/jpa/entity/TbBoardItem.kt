package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbBoardItem
 * author         : 정상철
 * date           : 2025-06-20
 * description    : 게시판 아이템 정보
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

@Entity
@Table(name = "tb_board_item")
class TbBoardItem {

    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_item_id", nullable = false)
    var id: Int? = null

    /**
     * 게시판 ID
     */
    @Column(name = "board_id", nullable = false)
    var boardId: Int? = null

    /**
     * 타이틀
     */
    @Column(name = "title", nullable = false, length = 500)
    var title: String? = null

    /**
     * 내용
     */
    @Lob
    @Column(name = "contents")
    var contents: String? = null

    /**
     * 조회수
     */
    @Column(name = "view_cnt", columnDefinition = "int default 0")
    var viewCnt: Int? = 0

    /**
     * 공개여부 (true이면 공개)
     */
    @Column(name = "opened", nullable = false, columnDefinition = "tinyint(1) default 1")
    var opened: Boolean = true

    /**
     * 권한 레벨
     */
    @Column(name = "auth_level", columnDefinition = "int default 0")
    var authLevel: Int? = 0

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
