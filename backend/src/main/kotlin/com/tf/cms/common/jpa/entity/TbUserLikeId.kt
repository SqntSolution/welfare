package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.Objects
import org.hibernate.Hibernate

@Embeddable
class TbUserLikeId : Serializable {
    /**
     * post또는 page의 id
     */
    @Column(name = "post_id", nullable = false)
    var postId: Int? = null

    /**
     * 유저 id
     */
    @Column(name = "user_id", nullable = false, length = 100)
    var userId: String? = null
    override fun hashCode(): Int = Objects.hash(postId, userId)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as TbUserLikeId

        return postId == other.postId &&
                userId == other.userId
    }

    companion object {
        private const val serialVersionUID = 7534172125037854758L
    }
}