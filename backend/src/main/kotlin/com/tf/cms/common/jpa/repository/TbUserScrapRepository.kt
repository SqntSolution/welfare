package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbUserScrap
import com.tf.cms.common.jpa.entity.TbUserScrapId
import org.springframework.data.jpa.repository.JpaRepository

interface TbUserScrapRepository : JpaRepository<TbUserScrap, TbUserScrapId> {
}