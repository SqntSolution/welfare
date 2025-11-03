package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbRef
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface TbRefRepository : JpaRepository<TbRef, Int> {
    fun deleteByRefGroupId(refGroupId: Int)
    fun deleteByGroupCode(groupCode: String)

    fun findByGroupCodeAndCode(groupCode: String, code: String): Optional<TbRef>

    fun findByGroupCode(groupCode: String): List<TbRef>

}