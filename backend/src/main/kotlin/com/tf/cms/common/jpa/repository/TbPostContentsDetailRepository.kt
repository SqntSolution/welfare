package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostContentsDetail
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbPostContentsDetailRepository : JpaRepository<TbPostContentsDetail, Int> {
    @Modifying
    @Query("delete from TbPostContentsDetail where postId=:postId")
    fun deleteByPostId(@Param(value = "postId") postId:Int,)
}