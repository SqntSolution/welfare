package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.Objects
import org.hibernate.Hibernate

@Embeddable
class TbAddJobMasterId : Serializable {
    /**
     * 사번 또는 임직원 식별번호
     */
    @Column(name = "EMP_ID", length = 64)
    var empId: String? = null

    /**
     * 겸직소속 조직코드
     */
    @Column(name = "ORG_ID", length = 64)
    var orgId: String? = null
    override fun hashCode(): Int = Objects.hash(empId, orgId)
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as TbAddJobMasterId

        return empId == other.empId &&
                orgId == other.orgId
    }

    companion object {
        private const val serialVersionUID = -6722819579604089994L
    }
}