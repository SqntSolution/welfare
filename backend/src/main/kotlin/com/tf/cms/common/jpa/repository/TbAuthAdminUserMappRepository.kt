package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthAdminUserMapp
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface TbAuthAdminUserMappRepository : JpaRepository<TbAuthAdminUserMapp, Int> {
    fun findByUserId(userId: String): Optional<TbAuthAdminUserMapp>

    fun deleteByUserId(userId: String)
}