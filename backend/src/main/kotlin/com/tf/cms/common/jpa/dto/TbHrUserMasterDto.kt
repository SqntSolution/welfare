package com.tf.cms.common.jpa.dto

import java.io.Serializable
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.common.jpa.dto
 * fileName       : TbHrUserMasterDto
 * author         : 정상철
 * date           : 2025-06-04
 * description    : 인사기반의 사용자정보 Dto
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04        정상철       최초 생성
 */
/**
 * DTO for {@link com.tf.cms.common.jpa.entity.TbHrUserMaster}
 */

data class TbHrUserMasterDto(
    var empId: String? = null,
    var empNm: String? = null,
    var orgId: String? = null,
    var orgNm: String? = null,
    var grpYmd: String? = null,
    var retireYmd: String? = null,
    var objCategory: String? = null,
    var officeTelNo: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null
) : Serializable