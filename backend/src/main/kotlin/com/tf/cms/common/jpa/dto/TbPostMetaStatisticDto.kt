package com.tf.cms.common.jpa.dto

import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbPostMetaStatistic}
 */
data class TbPostMetaStatisticDto(
    var id: Int? = null,
    var viewCnt: Int? = null,
    var likesCnt: Int? = null,
    var scrapCnt: Int? = null,
    var shareCnt: Int? = null
) : Serializable