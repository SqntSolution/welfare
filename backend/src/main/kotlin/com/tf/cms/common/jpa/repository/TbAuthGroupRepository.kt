package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthGroup
import org.springframework.data.jpa.repository.JpaRepository

interface TbAuthGroupRepository : JpaRepository<TbAuthGroup, String> {
    fun findByAuthGroupCdAndImmutableFalse(authGroupCd: String)
}