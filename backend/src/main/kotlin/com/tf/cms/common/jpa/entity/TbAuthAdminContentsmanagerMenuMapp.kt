package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * admin role의 contents manager와 메뉴 매핑
 */
@Entity
@Table(name = "tb_auth_admin_contentsmanager_menu_mapp")
class TbAuthAdminContentsmanagerMenuMapp {
    /**
     * id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mgr_menu_mapp_id", nullable = false)
    var id: Int? = null

    /**
     * 메뉴id
     */
    @Column(name = "menu_id", nullable = false)
    var menuId: Int? = null

    /**
     * 해당 매뉴에 대한 content_manager의 권한이 있는 유저 id
     */
    @Column(name = "user_id", nullable = false)
    var userId: String? = null

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