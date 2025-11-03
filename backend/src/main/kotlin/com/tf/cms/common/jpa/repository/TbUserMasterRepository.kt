package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbUserMaster
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface TbUserMasterRepository : JpaRepository<TbUserMaster, String> {
    fun findByUserId(userId: String): Optional<TbUserMaster>

    fun findByLoginIdAndIsActive(loginId: String?, isActive: Boolean=true): Optional<TbUserMaster>

    fun findByUserIdAndIsActive(userId: String?, isActive: Boolean=true): Optional<TbUserMaster>

    fun findByLoginId(loginId: String?): Optional<TbUserMaster>

    fun findByUserNmAndMailAddrAndIsActive(userNm: String?, mailAddr: String?, isActive: Boolean=true): List<TbUserMaster>

    fun deleteByLoginId(loginId: String)

    fun findByLoginIdAndMailAddrAndIsActive(loginId: String?, mailAddr: String?, isActive: Boolean=true): Optional<TbUserMaster>

    fun deleteByUserId(userId: String)

}