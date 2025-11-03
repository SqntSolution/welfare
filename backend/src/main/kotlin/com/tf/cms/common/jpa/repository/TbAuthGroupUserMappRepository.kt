package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthGroupUserMapp
import org.springframework.data.jpa.repository.JpaRepository

interface TbAuthGroupUserMappRepository : JpaRepository<TbAuthGroupUserMapp, Int> {
    fun findByUserId(userId: String): List<TbAuthGroupUserMapp>

    fun deleteByAuthGroupCd(authGroupCd: String)

    fun deleteByUserId(userId: String)
}