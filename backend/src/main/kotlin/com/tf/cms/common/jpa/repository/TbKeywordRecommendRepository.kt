package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbKeywordRecommend
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbKeywordRecommendRepository
 * author         : 정상철
 * date           : 2025-05-15
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-15        정상철       최초 생성
 */
interface TbKeywordRecommendRepository : JpaRepository<TbKeywordRecommend, Int> {
}