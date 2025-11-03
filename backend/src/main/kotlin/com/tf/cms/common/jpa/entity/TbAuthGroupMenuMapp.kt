package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * 권한그룹에 메뉴를 할당
 */
@Entity
@Table(name = "tb_auth_group_menu_mapp")
class TbAuthGroupMenuMapp {
    /**
     * uuid
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_menu_mapp_id", nullable = false)
    var id: Int? = null

    /**
     * 권한 그룹 코드 (공통코드로 관리되는)
     */
    @Column(name = "auth_group_cd", nullable = false, length = 40)
    var authGroupCd: String? = null

    /**
     * 메뉴 id
     */
    @Column(name = "menu_id", nullable = false)
    var menuId: Int? = null

    /**
     * 파일 다운로드가 가능한지 여부
     */
    @Column(name = "can_filedownload", nullable = false)
    var canFiledownload: Boolean? = false

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