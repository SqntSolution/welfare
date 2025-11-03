package com.tf.cms.biz.admin.ref

import com.tf.cms.common.jpa.entity.TbRef
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers
import java.util.*

@Mapper
interface RefMapper{
    companion object{
        val INSTANCE: RefMapper = Mappers.getMapper(RefMapper::class.java)
    }

    fun tbRefEntityToDto(e: TbRef) : RefDto

    fun tbRefEntityToDtos(e : List<TbRef>) : MutableList<RefDto>
}


