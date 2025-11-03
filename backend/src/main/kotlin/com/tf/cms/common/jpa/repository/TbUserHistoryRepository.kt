package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbUserHistory
import org.springframework.data.jpa.repository.JpaRepository

interface TbUserHistoryRepository : JpaRepository<TbUserHistory, Long> {
}