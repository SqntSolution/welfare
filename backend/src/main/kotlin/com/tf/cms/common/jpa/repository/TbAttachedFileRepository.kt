package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAttachedFile
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbAttachedFileRepository : JpaRepository<TbAttachedFile, Int> {
    fun findByPostId(postId: Int): List<TbAttachedFile>

    fun findByFileClassAndPostId(fileClass: String, postId: Int): List<TbAttachedFile>

    @Modifying
    @Query("update TbAttachedFile set downloadCnt=downloadCnt+1 where id=:id")
    fun increaseDownloadCnt(@Param(value = "id") id:Int,)

}