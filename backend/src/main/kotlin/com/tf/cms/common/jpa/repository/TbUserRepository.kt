package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbUser
import org.springframework.data.jpa.repository.JpaRepository

interface TbUserRepository : JpaRepository<TbUser, String> {
}