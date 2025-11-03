package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbMsTeamsSendHistory
import org.springframework.data.jpa.repository.JpaRepository

interface TbMsTeamsSendHistoryRepository : JpaRepository<TbMsTeamsSendHistory, Int> {
}