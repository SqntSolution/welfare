package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * post의 상세 내용들(editor, pdf등)
 */
@Entity
@Table(name = "tb_post_contents_details")
class TbPostContentsDetail {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "details_id", nullable = false)
    var id: Int? = null

    /**
     * 속한 post_id
     */
    @Column(name = "post_id", nullable = false)
    var postId: Int? = null

    /**
     * 종류 (editor,pdf)
     */
    @Column(name = "details_type", nullable = false, length = 20)
    var detailsType: String? = null

    /**
     * pdf 경로 등
     */
    @Column(name = "file_path", length = 200)
    var filePath: String? = null

    /**
     * 아마도 editor의 내용
     */
    @Lob
    @Column(name = "contents")
    var contents: String? = null

    /**
     * 보여지는 순서
     */
    @Column(name = "seq", nullable = false)
    var seq: Short? = null

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
     * 파일 사이즈
     */
    @Column(name = "file_size")
    var fileSize: Long? = null

    /**
     * 파일 다운로드 건수
     */
    @Column(name = "download_cnt")
    var downloadCnt: Int? = null

    override fun toString(): String {
        return "TbPostContentsDetail(id=$id, postId=$postId, detailsType=$detailsType, filePath=$filePath, contents=${contents?.take(50)}, " +
                "seq=$seq, createdAt=$createdAt, createdUserId=$createdUserId, createdUserNm=$createdUserNm, " +
                "modifiedAt=$modifiedAt, modifiedUserId=$modifiedUserId, modifiedUserNm=$modifiedUserNm, fileNm=$fileNm)"
    }


}