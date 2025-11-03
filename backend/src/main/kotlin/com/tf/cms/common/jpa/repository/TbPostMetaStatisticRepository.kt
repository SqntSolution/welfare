package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostMetaStatistic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TbPostMetaStatisticRepository : JpaRepository<TbPostMetaStatistic, Int> {
    @Modifying
    @Query("update TbPostMetaStatistic set viewCnt=viewCnt+1 where id=:postId")
    fun increaseViewCnt(@Param(value = "postId") postId:Int,)

    @Modifying
    @Query("update TbPostMetaStatistic set likesCnt=likesCnt+1 where id=:postId")
    fun increaseLikesCnt(@Param(value = "postId") postId:Int,)

    @Modifying
    @Query("update TbPostMetaStatistic set likesCnt=likesCnt-1 where id=:postId")
    fun dereaseLikesCnt(@Param(value = "postId") postId:Int,)

    @Modifying
    @Query("update TbPostMetaStatistic set scrapCnt=scrapCnt+1 where id=:postId")
    fun increaseScrapCnt(@Param(value = "postId") postId:Int,)

    @Modifying
    @Query("update TbPostMetaStatistic set scrapCnt=scrapCnt-1 where id=:postId")
    fun decreaseScrapCnt(@Param(value = "postId") postId:Int,)

    @Modifying
    @Query("update TbPostMetaStatistic set shareCnt=shareCnt+1 where id=:postId")
    fun increaseShareCnt(@Param(value = "postId") postId:Int,)
}