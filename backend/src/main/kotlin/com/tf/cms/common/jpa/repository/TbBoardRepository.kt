package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbBoard
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbBoardRepository
 * author         : 정상철
 * date           : 2025-06-20
 * description    : TbBoard Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

interface TbBoardRepository : JpaRepository<TbBoard, Int> {
}