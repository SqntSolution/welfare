package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbHrCodeMaster
import com.tf.cms.common.jpa.entity.TbHrCodeMasterId
import org.springframework.data.jpa.repository.JpaRepository

interface TbHrCodeMasterRepository : JpaRepository<TbHrCodeMaster, TbHrCodeMasterId> {
}