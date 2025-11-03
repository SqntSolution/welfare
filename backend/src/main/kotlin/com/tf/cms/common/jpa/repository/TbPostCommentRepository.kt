package com.tf.cms.common.jpa.repository;

import com.tf.cms.common.jpa.entity.TbPostComment
import org.springframework.data.jpa.repository.JpaRepository

interface TbPostCommentRepository : JpaRepository<TbPostComment, Int> {
}