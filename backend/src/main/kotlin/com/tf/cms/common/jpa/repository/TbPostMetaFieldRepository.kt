package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbPostMetaField
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbPostMetaFieldRepository
 * author         : 정상철
 * date           : 2025-06-24
 * description    : TbPostMetaField Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */


interface TbPostMetaFieldRepository : JpaRepository<TbPostMetaField, Int> {
//    fun deleteByIdPostId(postId: Int)
    fun findByMenu1IdAndMenu2Id(menu1Id: Int, menu2Id: Int): List<TbPostMetaField>

    fun deleteByMenu1IdAndMenu2Id(menu1Id: Int, menu2Id: Int)
    fun deleteByMenu2Id(menu2Id: Int)
}