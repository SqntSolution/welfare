package com.tf.cms.common.jpa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbPostMataInfo
 * author         : 정상철
 * date           : 2025-06-24
 * description    : post 또는 page의 meta 정보
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */

@Entity
@Table(name = "tb_post_meta_info")
class TbPostMetaInfo {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meta_info_id", nullable = false)
    var id: Int? = null

    @Column(name = "menu1_id", nullable = false)
    var menu1Id: Int? = null

    @Column(name = "menu2_id", nullable = false)
    var menu2Id: Int? = null

    /**
     * 이 메타가 속한 post_id
     */
    @Column(name = "post_id", nullable = false)
    var postId: Int? = null

    /**
     * 메타 key
     */
    @Column(name = "meta_key", length = 50, nullable = false)
    var metaKey: String? = null

    /**
     * 메타 값
     */
    @Column(name = "meta_value", length = 100, nullable = false)
    var metaValue: String? = null

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
