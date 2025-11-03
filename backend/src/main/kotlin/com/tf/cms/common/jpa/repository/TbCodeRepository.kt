package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbCode
import com.tf.cms.common.jpa.entity.TbCodeId
import org.springframework.data.jpa.repository.JpaRepository

interface TbCodeRepository : JpaRepository<TbCode, Int> {
    fun deleteByCodeGroupId(codeGroupId: Int)

    fun findByGroupCode(groupCode: String): List<TbCode>

    fun findByCodeGroupId(codeGroupId: Int): List<TbCode>
}