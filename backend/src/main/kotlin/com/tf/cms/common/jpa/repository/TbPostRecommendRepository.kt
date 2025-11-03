package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostRecommend
import org.springframework.data.jpa.repository.JpaRepository

interface TbPostRecommendRepository : JpaRepository<TbPostRecommend, Int> {
}