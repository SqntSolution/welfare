package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAddJobMaster
import com.tf.cms.common.jpa.entity.TbAddJobMasterId
import org.springframework.data.jpa.repository.JpaRepository

interface TbAddJobMasterRepository : JpaRepository<TbAddJobMaster, TbAddJobMasterId> {
}