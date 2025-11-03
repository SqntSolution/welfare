package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbAuthGroupTeamMapp
import org.springframework.data.jpa.repository.JpaRepository

interface TbAuthGroupTeamMappRepository : JpaRepository<TbAuthGroupTeamMapp, Int> {
    fun findByTeamId(teamId: String): List<TbAuthGroupTeamMapp>

    fun deleteByAuthGroupCd(authGroupCd: String)
}