package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbJwtToken
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface TbJwtTokenRepository : JpaRepository<TbJwtToken, Int> {
    fun findByRefreshToken(refreshToken: String): Optional<TbJwtToken>
}