package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbTerms
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbTermsRepository
 * author         : 정상철
 * date           : 2025-05-30
 * description    : 약관 내용 관리 repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-30        정상철       최초 생성
 */
interface TbTermsRepository : JpaRepository<TbTerms, Int> {
}