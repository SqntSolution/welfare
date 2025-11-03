package com.tf.cms.biz.common.login

import com.tf.cms.common.jpa.entity.TbUserMaster
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers
import java.util.*

@Mapper
interface LoginMapper{
    companion object{
        val INSTANCE: LoginMapper = Mappers.getMapper(LoginMapper::class.java)
    }

    @Mapping(source = "userNm", target = "name")
    @Mapping(source = "mailAddr", target = "email")
    @Mapping(source = "mobileNo", target = "phone")
    fun tbUserMasterEntityToDto(e: TbUserMaster) : RegisterData

    @Mapping(source = "userNm", target = "name")
    @Mapping(source = "mailAddr", target = "email")
    @Mapping(source = "mobileNo", target = "phone")
    fun tbUserMasterEntityToDtos(e: List<TbUserMaster>) : MutableList<RegisterData>
}


