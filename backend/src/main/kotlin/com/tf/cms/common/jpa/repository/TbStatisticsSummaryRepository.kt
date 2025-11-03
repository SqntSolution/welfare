package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbStatisticsSummary
import org.springframework.data.jpa.repository.JpaRepository

interface TbStatisticsSummaryRepository : JpaRepository<TbStatisticsSummary, Int> {
}