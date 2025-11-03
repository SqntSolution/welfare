package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 사용자의 scrap
 */
@Entity
@Table(name = "tb_user_scrap")
class TbUserScrap {
    @EmbeddedId
    var id: TbUserScrapId? = null

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
     * 생성한 날짜시간
     */
    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime? = null
}