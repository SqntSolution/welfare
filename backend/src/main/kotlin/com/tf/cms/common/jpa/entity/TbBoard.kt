package com.tf.cms.common.jpa.entity


import jakarta.persistence.*
import java.time.LocalDateTime
/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbBoard
 * author         : 정상철
 * date           : 2025-06-20
 * description    : 게시판 기본정보
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

@Entity
@Table(name = "tb_board")
class TbBoard {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id", nullable = false)
    var id: Int? = null

    /**
     * 이 게시물이 속한 카테고리(menu) id
     */
    @Column(name = "menu1_id", nullable = false)
    var menu1Id: Int? = null

    /**
     * 이 게시물이 속한 메뉴(menu) id
     */
    @Column(name = "menu2_id", nullable = false)
    var menu2Id: Int? = null

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