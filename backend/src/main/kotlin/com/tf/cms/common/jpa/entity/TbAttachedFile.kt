package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 첨부파일
 */
@Entity
@Table(name = "tb_attached_file")
class TbAttachedFile {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id", nullable = false)
    var id: Int? = null

    /**
     * post(post 또는 page) , notice(공지), faq(F&Q), qna(Q&A)
     */
    @Column(name = "file_class", nullable = false, length = 20)
    var fileClass: String? = null

    /**
     * 파일명
     */
    @Column(name = "file_nm", nullable = false, length = 100)
    var fileNm: String? = null

    /**
     * 파일 확장자
     */
    @Column(name = "file_extension", length = 20)
    var fileExtension: String? = null

    /**
     * 파일 저장 경로
     */
    @Column(name = "file_path", nullable = false, length = 200)
    var filePath: String? = null

    /**
     * 파일 사이즈
     */
    @Column(name = "file_size")
    var fileSize: Long? = null

    /**
     * post또는 bbs의 게시물 id
     */
    @Column(name = "post_id", nullable = false)
    var postId: Int? = null
    
    /**
     * 파일 다운로드 건수
     */
    @Column(name = "download_cnt")
    var downloadCnt: Int? = null

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