package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthGroupMenuMapp
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbAuthGroupMenuMappRepository : JpaRepository<TbAuthGroupMenuMapp, Int> {
    fun findByAuthGroupCd(authGroupCd: String): List<TbAuthGroupMenuMapp>

    fun deleteByAuthGroupCd(authGroupCd: String)

    @Modifying
    @Query("delete from TbAuthGroupMenuMapp where menuId=:menuId")
    fun deleteByMenuId(@Param(value = "menuId") menuId:Int,)
}