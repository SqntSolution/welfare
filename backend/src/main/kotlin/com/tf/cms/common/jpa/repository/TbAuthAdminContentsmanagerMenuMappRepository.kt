package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthAdminContentsmanagerMenuMapp
import org.springframework.data.jpa.repository.JpaRepository

interface TbAuthAdminContentsmanagerMenuMappRepository : JpaRepository<TbAuthAdminContentsmanagerMenuMapp, Int> {
    fun findByUserId(userId: String): List<TbAuthAdminContentsmanagerMenuMapp>

    fun deleteByUserId(userId: String)
}