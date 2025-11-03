package com.tf.cms.common.jpa.dto

import com.tf.cms.common.jpa.entity.TbUserScrapId
import java.io.Serializable

/**
 * DTO for {@link com.cosmax.conact.common.jpa.entity.TbUserScrapId}
 */
data class TbUserScrapIdDto(
        var postId: Int? = null,
        var userId: String? = null
) : Serializable {
    constructor(e: TbUserScrapId): this(
            postId = e.postId,
            userId = e.userId
    )
}