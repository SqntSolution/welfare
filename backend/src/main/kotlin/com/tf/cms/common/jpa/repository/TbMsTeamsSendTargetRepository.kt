package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbMsTeamsSendTarget
import org.springframework.data.jpa.repository.JpaRepository

interface TbMsTeamsSendTargetRepository : JpaRepository<TbMsTeamsSendTarget, Int> {
    fun deleteBySendId(sendId: Int)
}