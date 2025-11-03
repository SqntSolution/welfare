package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.Objects
import org.hibernate.Hibernate

@Embeddable
class TbCodeId : Serializable {
    /**
     * 그룹코드
     */
    @Column(name = "group_code", nullable = false, length = 50)
    var groupCode: String? = null

    /**
     * 코드
     */
    @Column(name = "code", nullable = false, length = 50)
    var code: String? = null
    override fun hashCode(): Int = Objects.hash(groupCode, code)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as TbCodeId

        return groupCode == other.groupCode &&
                code == other.code
    }

    companion object {
        private const val serialVersionUID = -8532719422977285095L
    }
}