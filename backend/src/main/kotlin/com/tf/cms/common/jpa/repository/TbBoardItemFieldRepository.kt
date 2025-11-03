package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbBoardItemField
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbBoardItemFieldRepository
 * author         : 정상철
 * date           : 2025-06-20
 * description    : TbBoardItemField Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

interface TbBoardItemFieldRepository : JpaRepository<TbBoardItemField, Int> {
    fun findByItemOpened(itemOpened: Boolean) : List<TbBoardItemField>
}