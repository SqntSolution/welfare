package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * post에 comments
 */
@Entity
@Table(name = "tb_post_comments")
class TbPostComment {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comments_id", nullable = false)
    var id: Int? = null

    /**
     * 댓글 내용
     */
    @Column(name = "contents", length = 1000)
    var contents: String? = null

    /**
     * post안에서 comments의 순서 (0부터 시작)
     */
    @Column(name = "comments_seq", nullable = false)
    var commentsSeq: Int? = null

    /**
     * 그냥 댓글은 1, 댓글에 대한 댓글은 2
     */
    @Column(name = "comments_level", nullable = false)
    var commentsLevel: Short? = null

    /**
     * 삭제되었다면 true
     */
    @Column(name = "deleted", nullable = false)
    var deleted: Boolean? = false

    /**
     * 작성자 이름
     */
    @Column(name = "user_nm", nullable = false, length = 256)
    var userNm: String? = null

    /**
     * 작성자 id
     */
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null

    /**
     * post id
     */
    @Column(name = "post_id")
    var postId: Int? = null

    /**
     * 닉네임
     */
    @Column(name = "nickname", length = 100)
    var nickname: String? = null

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