package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbPostMetaFieldDto
 * author         : 정상철
 * date           : 2025-06-24
 * description    : TbPostMetaField dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */

/**
 * DTO for tb_post_meta_field
 */
data class TbPostMetaFieldDto(
    val postMetaId: Int? = null,
    val menu1Id: Int? = null,
    val menu2Id: Int? = null,
    val metaKey: String? = null,
    val metaNm: String? = null,
    val groupCode: String? = null,
    val metaType: String? = null,
    var metaDisplayOrder: Int? = null,
    var searchUseYn: Boolean? = false,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable