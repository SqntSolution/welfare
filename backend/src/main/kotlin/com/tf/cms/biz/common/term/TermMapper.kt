package com.tf.cms.biz.common.term

import com.tf.cms.common.jpa.dto.TbTermsDto
import com.tf.cms.common.jpa.entity.TbTerms
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper
interface TermMapper {
    companion object {
        val INSTANCE: TermMapper = Mappers.getMapper(TermMapper::class.java)
    }
    fun tbTermsEntityToDto(e: TbTerms): TbTermsDto
    fun tbTermsEntityToDtos(e: MutableList<TbTerms>): MutableList<TbTermsDto>
}