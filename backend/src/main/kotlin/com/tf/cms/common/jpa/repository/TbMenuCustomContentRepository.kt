package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbMenuCustomContent
import org.springframework.data.jpa.repository.JpaRepository

interface TbMenuCustomContentRepository : JpaRepository<TbMenuCustomContent, Int> {
}