package com.tf.cms.biz.common.ref

import com.tf.cms.common.jpa.dto.TbRefDto
import com.tf.cms.common.jpa.entity.TbRefGroup
import com.tf.cms.common.jpa.repository.TbRefGroupRepository
import com.tf.cms.common.jpa.repository.TbRefRepository
import com.tf.cms.common.utils.logger
import org.springframework.stereotype.Service

/**
 * packageName    : com.tf.cms.biz.common.ref
 * fileName       : RefService
 * author         : 정상철
 * date           : 2025-06-12
 * description    : 내부적 참조코드 호출
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-12        정상철       최초 생성
 */

@Service
class CommonRefService (
    private val tbRefRepository: TbRefRepository,
    private val tbRefGroupRepository: TbRefGroupRepository,
){
    private val logger = logger()

    fun findRefList(groupCode: String): List<TbRefDto> {
        logger.debug { "=== findRefList : $groupCode" }
        val tbRefList = tbRefRepository.findByGroupCode(groupCode)
        return tbRefList.map { TbRefDto(it) }
    }

    fun findRefLabel(groupCode: String, code: String?): String {
        logger.debug { "=== findREfLabel : $groupCode" }
        if(code.isNullOrBlank()) return ""
        val tbRef = tbRefRepository.findByGroupCode(groupCode)
            .firstOrNull { it.code == code }

        return tbRef?.label ?: ""
    }


    /**
     * name:
     * description: refGroup 코드 관련 SELECT_BOX 만들기 위한 데이터 (groupType 별)
     * author: 정상철
     * created:

     *
     * @return
     */
    fun finAllRefGroupCodeList(
        groupType: String
    ): List<TbRefGroup> {
        return tbRefGroupRepository.findByGroupType(groupType)
    }
}

