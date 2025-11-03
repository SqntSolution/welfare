package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbPopup
import org.springframework.data.jpa.repository.JpaRepository

interface TbPopupRepository : JpaRepository<TbPopup, Int>{
}