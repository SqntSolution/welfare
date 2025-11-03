package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.Objects
import org.hibernate.Hibernate

@Embeddable
class TbHrCodeMasterId : Serializable {

    /**
     * 상위포함조직코드, 직급코드, 직책코드
     */
    @Column(name = "FULL_CODE", length = 64)
    var fullCode: String? = null

    /**
     * 그룹코드
     */
    @Column(name = "GROUP_CODE", length = 64)
    var groupCode: String? = null

    /**
     * 조직코드
     */
    @Column(name = "CODE", length = 64)
    var code: String? = null
    override fun hashCode(): Int = Objects.hash(fullCode, groupCode, code)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as TbHrCodeMasterId

        return  fullCode == other.fullCode &&
                groupCode == other.groupCode &&
                code == other.code
    }

    companion object {
        private const val serialVersionUID = 7408836713918113465L
    }
}