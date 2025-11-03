package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbPostMetaInfo
import org.springframework.data.jpa.repository.JpaRepository

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbPostMetaInfoRepository
 * author         : 정상철
 * date           : 2025-06-24
 * description    : TbPostMetaInfo Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-24        정상철       최초 생성
 */
interface TbPostMetaInfoRepository: JpaRepository<TbPostMetaInfo, Int> {
    fun deleteByPostId(postId: Int)
    fun findByPostId(postId: Int): List<TbPostMetaInfo>
    fun findByPostIdAndMetaKey(postId: Int, metaKey: String): TbPostMetaInfo
}