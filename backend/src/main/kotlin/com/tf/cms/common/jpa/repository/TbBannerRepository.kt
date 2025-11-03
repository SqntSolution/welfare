package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbBanner
import org.springframework.data.jpa.repository.JpaRepository

interface TbBannerRepository : JpaRepository<TbBanner, Int> {
}