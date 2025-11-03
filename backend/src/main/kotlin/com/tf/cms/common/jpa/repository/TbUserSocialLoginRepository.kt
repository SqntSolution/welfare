package com.tf.cms.common.jpa.repository

import com.tf.cms.common.jpa.entity.TbUserSocialLogin
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

/**
 * packageName    : com.tf.cms.common.jpa.repository
 * fileName       : TbUserSocialLoginRepository
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */
interface TbUserSocialLoginRepository : JpaRepository<TbUserSocialLogin, Int> {
    fun findByUserId(userId: String): List<TbUserSocialLogin>
    fun deleteByUserId(userId: String)
    fun findBySocialTypeAndSocialUserId(socialType: String, socialUserId :String): Optional<TbUserSocialLogin>
}