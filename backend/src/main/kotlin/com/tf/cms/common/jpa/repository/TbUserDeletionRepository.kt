package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbUserDeletion
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbUserDeletionRepository
 * author         : 정상철
 * date           : 2025-05-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-20        정상철       최초 생성
 */
interface TbUserDeletionRepository : JpaRepository<TbUserDeletion, Int> {
    fun deleteByUserId(userId: String)
    fun findByUserId(userId: String)
}