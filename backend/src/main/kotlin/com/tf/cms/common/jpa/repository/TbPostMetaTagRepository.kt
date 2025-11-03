package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostMetaTag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbPostMetaTagRepository : JpaRepository<TbPostMetaTag, Int> {
    @Modifying
    @Query("delete from TbPostMetaTag where postId=:postId")
    fun deleteByPostId(@Param(value = "postId") postId:Int,)
}