package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbHrUserMaster
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbHrUserMasterRepository
 * author         : 정상철
 * date           : 2025-06-04
 * description    : 인사기반의 사용자정보 Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04        정상철       최초 생성
 */

interface TbHrUserMasterRepository : JpaRepository<TbHrUserMaster, String> {
}