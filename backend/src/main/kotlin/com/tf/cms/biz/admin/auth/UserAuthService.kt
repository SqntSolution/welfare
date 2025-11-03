package com.tf.cms.biz.admin.auth

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.admin.group.GroupService
import com.tf.cms.biz.admin.group.MatchingUserAuthGroupInput
import com.tf.cms.common.jpa.entity.QTbAuthUser
import com.tf.cms.common.jpa.entity.TbAuthUser
import com.tf.cms.common.jpa.repository.TbAuthUserRepository
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import com.tf.cms.common.model.DefaultGroupAuth

/**
 * packageName    : com.tf.cms.biz.admin.auth
 * fileName       : UserAuthService
 * author         : 정상철
 * date           : 2025-05-08
 * description    : (관리자) 개인권한 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-08        정상철       최초 생성
 */
@Service
class UserAuthService (
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbAuthUserRepository: TbAuthUserRepository,
    private val groupService: GroupService
){
    private val loggger = logger()

    companion object {
        private const val DEFAULT_VISITOR_GROUP = "VISITOR"
        private const val DEFAULT_USER_GROUP = "USER"
    }

    /**
     * name: findUserAuthList
     * description: 개인권한 목록 조회
     * author: 정상철
     * created: 2025-05-08 09:53

     *
     * @return
     */

    fun findUserAuthList(): List<UserAuthDto>{
        val tbAuthUser = QTbAuthUser.tbAuthUser

        val whereCondition = BooleanBuilder()

        val result = jpaQueryFactory
            .select(
            Projections.fields(
                UserAuthDto::class.java,
                tbAuthUser.userId,
                tbAuthUser.userNm,
                tbAuthUser.authLevel,
                tbAuthUser.startAuthAt,
                tbAuthUser.endAuthAt,
                tbAuthUser.createdAt,
                tbAuthUser.createdUserId,
                tbAuthUser.createdUserNm,
                tbAuthUser.modifiedAt,
                tbAuthUser.modifiedUserId,
                tbAuthUser.modifiedUserNm
            )
            )
            .from(tbAuthUser)
            .where(whereCondition)
            .fetch()

        return result
    }

    /**
     * name: insertUserAuth
     * description: 개인권한 등록 (초기)
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertUserAuth(userAuthDto : UserAuthDto) {
        logger().debug { "insertUserAuth" }
        val auth = TbAuthUser().apply {
            userId = userAuthDto.userId
            userNm = userAuthDto.userNm
            authLevel = userAuthDto.authLevel
            startAuthAt = LocalDateTime.now()
            endAuthAt = null //Helpers.formatStringToLocalDateTime("9999-12-31 00:00")
            createdAt = LocalDateTime.now()
            createdUserId = userAuthDto.userId
            createdUserNm = userAuthDto.userNm
        }

        tbAuthUserRepository.save(auth)
    }
}