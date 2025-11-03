package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbBoardItemInfo
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbBoardItemInfoRepository
 * author         : 정상철
 * date           : 2025-06-27
 * description    : TbBoardItemInfo Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-27        정상철       최초 생성
 */

interface TbBoardItemInfoRepository : JpaRepository<TbBoardItemInfo, Int> {

    fun deleteAllByBoardItemIdIn(boardItemId: List<Int>)
}
