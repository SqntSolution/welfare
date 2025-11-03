package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * qna 게시판
 */
@Entity
@Table(name = "tb_bbs_qna")
class TbBbsQna {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_bbs_id", nullable = false)
    var id: Int? = null

    /**
     * 이 게시물이 속한 카테고리(menu) id
     */
    @Column(name = "menu_id", nullable = false)
    var menuId: Int? = null

    /**
     * 타이틀
     */
    @Column(name = "title", nullable = false, length = 500)
    var title: String? = null

    /**
     * 조회수
     */
    @Column(name = "view_cnt")
    var viewCnt: Int? = null

    /**
     * 작성자 user id
     */
    @Column(name = "create_user_id", nullable = false, length = 100)
    var createUserId: String? = null

    /**
     * 작성자명
     */
    @Column(name = "create_user_nm", length = 100)
    var createUserNm: String? = null

    /**
     * 공개여부 (true이면 공개)
     */
    @Column(name = "opened", nullable = false)
    var opened: Boolean? = false

    /**
     * 구분 정보
     */
    @Column(name = "meta_division", length = 100)
    var metaDivision: String? = null

    /**
     * 기타 정보
     */
    @Column(name = "meta_etc", length = 100)
    var metaEtc: String? = null

    /**
     * 내용
     */
    @Lob
    @Column(name = "contents")
    var contents: String? = null

    /**
     * 답변일시
     */
    @Column(name = "response_at")
    var responseAt: LocalDateTime? = null

    /**
     * 답변자 user id
     */
    @Column(name = "response_user_id", length = 100)
    var responseUserId: String? = null

    /**
     * 답변자명
     */
    @Column(name = "response_user_nm", length = 100)
    var responseUserNm: String? = null

    /**
     * 답변 내용
     */
    @Lob
    @Column(name = "response_contents")
    var responseContents: String? = null

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