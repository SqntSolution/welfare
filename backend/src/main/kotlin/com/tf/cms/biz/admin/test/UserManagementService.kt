package com.tf.cms.biz.admin.test

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import com.tf.cms.biz.common.CacheEvictor

/**
 * packageName    : com.tf.cms.biz.admin.test
 * fileName       : UserManagementService
 * author         : 정상철
 * date           : 2025-05-28
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28        정상철       최초 생성
 */
@Service
class UserManagementService (
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbUserDeletionRepository: TbUserDeletionRepository,
    private val tbUserMasterRepository: TbUserMasterRepository,
    private val tbUserSocialLoginRepository: TbUserSocialLoginRepository,
    private val tbAuthUserRepository: TbAuthUserRepository,
    private val tbAuthGroupUserMappRepository: TbAuthGroupUserMappRepository,
    private val cacheEvictor: CacheEvictor,

    ){
    private val logger = logger()



    /**
     * name:
     * description: 유저관리 목록 조회
     * author: 정상철
     * created:

     *
     * @return
     */
    fun findUserManagementList(
        pageable: Pageable
    ): Page<UserManagementDto> {
        val tbUserDeletion = QTbUserDeletion.tbUserDeletion
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbUserSocialLogin = QTbUserSocialLogin.tbUserSocialLogin
        val tbAuthUser = QTbAuthUser.tbAuthUser
        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp

        val whereCondition = BooleanBuilder()

        val result = jpaQueryFactory
            .select(
                Projections.fields(
                    UserManagementDto::class.java,
                    tbUserMaster.userId,
                    tbUserMaster.userNm,
                    tbUserMaster.loginId,
                    tbUserMaster.isActive,
                    tbUserMaster.mailAddr,
                    tbAuthUser.authLevel,
                    tbAuthUser.startAuthAt,
                    tbAuthUser.endAuthAt
                )
            )
            .from(tbUserMaster)
//            .leftJoin(tbUserDeletion).on(tbUserDeletion.userId.eq(tbUserMaster.empId))   // 일대다
//            .leftJoin(tbUserSocialLogin).on(tbUserSocialLogin.userId.eq(tbUserMaster.empId)) // 일대다
            .leftJoin(tbAuthUser).on(tbAuthUser.userId.eq(tbUserMaster.userId)) // 일대일
//            .leftJoin(tbAuthGroupUserMapp).on(tbAuthGroupUserMapp.userId.eq(tbUserMaster.empId))  //일대담
            .where(whereCondition)
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        logger.debug { "=== resultData : ${result.size}" }

        val resultCount = jpaQueryFactory
            .selectFrom(tbUserMaster)
            .leftJoin(tbAuthUser).on(tbAuthUser.userId.eq(tbUserMaster.userId)) // 일대일
            .where(whereCondition)
            .fetch()

        return PageImpl(result, pageable, resultCount.size.toLong())
    }


    /**
     * name: deleteUserManagement
     * description: 유저 완전 삭제
     * author: 정상철
     * created:

     *
     * @return
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun deleteUserManagement (
        userId: String
    ) {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        logger.info { "=== 관리자에 의한 유저 완전 삭제 관리자 id : (${userInfo.id})" }


        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbAuthUser = QTbAuthUser.tbAuthUser
        val tbUserDeletion = QTbUserDeletion.tbUserDeletion
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbUserMaster.userId.eq(userId))

        val deleteUserData = jpaQueryFactory
            .select(
                tbUserMaster.loginId,
                tbUserMaster.userId,
                tbAuthUser.authLevel,
                tbAuthAdminUserMapp.adminRole
            )
            .from(tbUserMaster)
            .leftJoin(tbUserDeletion).on(tbUserDeletion.userId.eq(tbUserMaster.userId))
            .leftJoin(tbAuthUser).on(tbAuthUser.userId.eq(tbUserMaster.userId))
            .leftJoin(tbAuthAdminUserMapp).on(tbAuthAdminUserMapp.userId.eq(tbUserMaster.userId))
            .where(whereCondition)
            .fetchFirst()

        if(deleteUserData.size() == 0) return

        tbUserMasterRepository.findByUserId(userId).ifPresent { userData ->
            // user 정보
            tbUserMasterRepository.deleteByUserId(userId)

            val tbUserDeletionIn = TbUserDeletion().apply {
                this.userId = userId
                this.deletedAt = LocalDateTime.now()
                this.deletedBy = "admin"
                this.reason = "운영자에 의한 계정삭제"
                this.userRole = deleteUserData?.get(tbAuthAdminUserMapp.adminRole) ?: TheRole.ROLE_USER.code
                this.authLevel = deleteUserData?.get(tbAuthUser.authLevel) ?: 0
                this.isDeleted = true
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
            }
            tbUserDeletionRepository.save(tbUserDeletionIn)

            // 소셜 로그인 정보
            tbUserSocialLoginRepository.deleteByUserId(userId)

            // 유저 권한
            tbAuthUserRepository.deleteById(userId)

            // 그룹 권한 테이블
            tbAuthGroupUserMappRepository.deleteByUserId(userId)

            // 캐시 초기화
            cacheEvictor.clearAllUserInfoCache()
        }
    }
}