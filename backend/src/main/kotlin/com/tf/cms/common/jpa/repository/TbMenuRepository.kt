package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbMenu
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbMenuRepository : JpaRepository<TbMenu, Int> {
    fun findByContentType(contentType: String): List<TbMenu>
    @Modifying
    @Query("update TbMenu set menuSeq=:menuSeq where id=:id")
    fun updateMenuSeq(@Param(value = "id") id:Int, @Param("menuSeq")menuSeq:Int)
}