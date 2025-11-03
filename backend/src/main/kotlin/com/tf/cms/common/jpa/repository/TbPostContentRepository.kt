package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostContent
import org.springframework.data.jpa.repository.JpaRepository

interface TbPostContentRepository : JpaRepository<TbPostContent, Int> {
    fun findByMenu2Id(menu2Id: Int): List<TbPostContent>
}