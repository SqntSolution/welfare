package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthUser
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface TbAuthUserRepository : JpaRepository<TbAuthUser, String> {

}