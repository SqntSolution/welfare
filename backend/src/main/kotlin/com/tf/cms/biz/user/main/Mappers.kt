package com.tf.cms.biz.user.main

import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.jpa.dto.TbPostCommentDto
import com.tf.cms.common.jpa.entity.TbAttachedFile
import com.tf.cms.common.jpa.entity.TbPostComment
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper
interface PostCommentMapper{
    companion object{
        val INSTANCE: PostCommentMapper = Mappers.getMapper(PostCommentMapper::class.java)
    }

    fun convertPostCommentEntityToDto(e: TbPostComment) : TbPostCommentDto
    fun convertPostCommentEntityToDtos(e : MutableList<TbPostComment>) : MutableList<TbPostCommentDto>
}

@Mapper
interface AttachFileMapper{
    companion object{
        val INSTANCE: AttachFileMapper = Mappers.getMapper(AttachFileMapper::class.java)
    }

    fun convertAttachFileEntityToDto(e: TbAttachedFile) : TbAttachedFileDto
    fun convertAttachFileEntityToDtos(e : MutableList<TbAttachedFile>) : MutableList<TbAttachedFileDto>
}


