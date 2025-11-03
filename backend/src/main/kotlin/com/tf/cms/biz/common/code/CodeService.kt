package com.tf.cms.biz.common.code

import com.tf.cms.common.jpa.dto.TbCodeDto
import com.tf.cms.common.jpa.entity.TbCode
import com.tf.cms.common.jpa.entity.TbCodeId
import com.tf.cms.common.jpa.repository.TbCodeGroupRepository
import com.tf.cms.common.jpa.repository.TbCodeRepository
import com.tf.cms.common.utils.logger
import org.springframework.stereotype.Service

@Service
class CodeService(
        private val tbCodeGroupRepository: TbCodeGroupRepository,
        private val tbCodeRepository: TbCodeRepository
) {
    private val logger = logger()

    fun findCodeList(groupCode: String): List<TbCodeDto> {
        logger.debug { "=== findCodeList : $groupCode" }
        val tbCodeList = tbCodeRepository.findByGroupCode(groupCode)
        return tbCodeList.map { TbCodeDto(it) }
    }

    fun findCodeLabel(groupCode: String, code: String?): String {
        logger.debug { "=== findCodeLabel : $groupCode" }
        if(code.isNullOrBlank()) return ""
        val tbCode = tbCodeRepository.findByGroupCode(groupCode)
            .firstOrNull { it.code == code }

        return tbCode?.label ?: ""
    }
}