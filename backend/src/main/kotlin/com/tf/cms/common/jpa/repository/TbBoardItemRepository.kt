package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbBoardItem
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbBoardItemRepository
 * author         : 정상철
 * date           : 2025-06-20
 * description    : TbBoardItem Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

interface TbBoardItemRepository : JpaRepository<TbBoardItem, Int> {
}