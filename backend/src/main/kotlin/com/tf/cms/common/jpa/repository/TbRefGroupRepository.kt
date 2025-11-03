package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbRefGroup
import org.springframework.data.jpa.repository.JpaRepository

interface TbRefGroupRepository : JpaRepository<TbRefGroup, Int> {
    fun findByGroupType(groupType: String): List<TbRefGroup>
}