package com.tf.cms.biz.common.scheduler

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.common.scheduler
 * fileName       : UserScheduler
 * author         : 정상철
 * date           : 2025-05-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-20        정상철       최초 생성
 */


/**
 * 유저 데이타를 관리하기 위한 scheduler
 */
@Component
class UserScheduler (
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbUserDeletionRepository: TbUserDeletionRepository,
    private val tbUserMasterRepository: TbUserMasterRepository,
    private val tbUserSocialLoginRepository: TbUserSocialLoginRepository,
    private val tbAuthUserRepository: TbAuthUserRepository,
    private val tbAuthGroupUserMappRepository: TbAuthGroupUserMappRepository
) {

    private val logger = logger()

    /**
     * name: userDataForHistory
     * description: 유저 데이터 관리 스케줄러
     * author: 정상철
     * created:
     * updated:

     *
     * @return
     */
//    @Scheduled(initialDelay = 5 * 60 * 1000, fixedDelay = 12 * 60 * 60 * 1000)
//    @Scheduled(initialDelay = 30 * 1000, fixedDelay = 12 * 60 * 60 * 1000)
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional(rollbackOn = [Throwable::class])
    fun userDataForHistory() {
        logger.info { "=== 유저 관리 스케쥴러 시작" }
        val now = LocalDateTime.now()

//        if(now.hour<1){ // 새벽 1시에만 실행
            deleteUserData(now)
            dormantUserData(now)
//        }
    }


    /**
     * name: deleteUserData
     * description: 유저 데이터 삭제
     * author: 정상철
     * created:
     * updated:

     *
     * @return
     */
    private fun deleteUserData(date:LocalDateTime){
        logger.info { "=== 삭제 동의 후 30일 경과 대상 조회 및 삭제 시작" }

        val tbUserDeletion = QTbUserDeletion.tbUserDeletion
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbUserSocialLogin = QTbUserSocialLogin.tbUserSocialLogin
        val tbAuthUser = QTbAuthUser.tbAuthUser
        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp
//        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
//        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbUserDeletion.isDeleted.eq(true))
        whereCondition.and(tbUserDeletion.deletedAt.loe(date))
        whereCondition.and(tbUserMaster.isActive.eq(false))

        val userIds = jpaQueryFactory
            .select(
                tbUserDeletion.id,
                tbUserMaster.loginId,
                tbUserMaster.userId,
                tbUserSocialLogin.userId,
                tbAuthUser.userId,
                tbAuthGroupUserMapp.userId
            )
            .from(tbUserMaster)
            .leftJoin(tbUserDeletion).on(tbUserDeletion.userId.eq(tbUserMaster.userId))
            .leftJoin(tbUserSocialLogin).on(tbUserSocialLogin.userId.eq(tbUserMaster.userId))
            .leftJoin(tbAuthUser).on(tbAuthUser.userId.eq(tbUserMaster.userId))
            .leftJoin(tbAuthGroupUserMapp).on(tbAuthGroupUserMapp.userId.eq(tbUserMaster.userId))
            .where(whereCondition)
            .fetch()

        logger.info { "=== 유저정보 삭제 대상 수 (${userIds?.size})" }

        if(userIds.size == 0) {
            return
        }

        userIds.filter {
            true
        }.forEach {
            // 삭제 시작
            try {
                logger.info { "=== 삭제 대상 UserId (userId:${it.get(tbUserMaster.userId)!!})" }

                //유저정보
                it.get(tbUserMaster.userId)?.let { userId ->
                    tbUserMasterRepository.deleteByUserId(userId)
                }

                //유저 삭제 관리
                it.get(tbUserDeletion.id)?.let { deletionId ->
                    tbUserDeletionRepository.findById(deletionId).ifPresent { deletion ->
                        deletion.apply {
                            this.modifiedAt = LocalDateTime.now()
                            this.modifiedUserId = "system"
                            this.modifiedUserNm = "deleteUserData"
                        }
                        tbUserDeletionRepository.save(deletion)
                    }
                }

                // 소셜 로그인 정보
                it.get(tbUserSocialLogin.userId)?.let { userId ->
                    tbUserSocialLoginRepository.deleteByUserId(userId)
                }

                // user 권한 테이블
                it.get(tbAuthUser.userId)?.let { userId ->
                    tbAuthUserRepository.deleteById(userId)
                }

                // user 그룹권한 테이블
                it.get(tbAuthGroupUserMapp.userId)?.let { userId ->
                    tbAuthGroupUserMappRepository.deleteByUserId(userId)
                }


                //추가 고려 사항
                //부서 및 다른 유저정보 매핑 테이블들을 추가적으로 제거해야한다.

            }catch (e:Exception){
                logger.warn("[무시] 삭제 대상 UserId 삭제 하다가 에러 (userId:${it.get(tbUserMaster.userId)!!})")
            }
        }
    }


    /**
     * name:
     * description: 30일 미접속 계정 비활성화작업
     * author: 정상철
     * created:

     *
     * @return
     */

    private fun dormantUserData(date:LocalDateTime){
        logger.info { "=== 미접속 30일 경과 대상 조회 및 휴면 계정 등록 시작" }
        val after3000Days = LocalDate.now().plusDays(3000).atTime(0, 0)

        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbAuthUser = QTbAuthUser.tbAuthUser
        val tbUserDeletion = QTbUserDeletion.tbUserDeletion
        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp

        val now = LocalDateTime.now()
        val thirtyDaysAgo = now.minusDays(30)

        val subQuery = JPAExpressions.select(tbUserHistory.userId)
            .from(tbUserHistory)
            .where(tbUserHistory.actionType.eq(UserHistoryActionType.login.code))
            .groupBy(tbUserHistory.userId)
            .having(tbUserHistory.createdAt.max().lt(thirtyDaysAgo))


        val whereCondition = BooleanBuilder()
        whereCondition.and(tbUserMaster.isActive.eq(true))
        whereCondition.and(tbUserDeletion.userId.isNull)
        whereCondition.and(tbUserMaster.userId.`in`(subQuery))


        val userIds = jpaQueryFactory
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
            .fetch()

        logger.info { "=== 미접속 30일 경과 대상 userIds (${userIds})" }

        userIds.filter {
            true
        }.forEach {
            // 삭제 시작
            try {
                logger.info { "=== 휴면계정 전환 대상 UserId (userId:${it.get(tbUserMaster.userId)!!})" }

                it.get(tbUserMaster.userId)?.let { userId ->
                    jpaQueryFactory.update(tbUserMaster)
                        .set(tbUserMaster.isActive, false)
                        .where(tbUserMaster.userId.eq(userId))
                        .execute()
                }

                val tbUserDeletionData = TbUserDeletion().apply {
                    this.userId = it.get(tbUserMaster.userId)
                    this.deletedAt = after3000Days
                    this.deletedBy = "system"
                    this.reason = "30일 미접속으로 인한 계정 비활성화"
                    this.userRole = it.get(tbAuthAdminUserMapp.adminRole) ?: TheRole.ROLE_USER.code
                    this.authLevel = it.get(tbAuthUser.authLevel) ?: 0
                    this.isDeleted = false
                    this.createdAt = LocalDateTime.now()
                    this.createdUserId = "system"
                    this.createdUserNm = "dormantUserData"
                }
                tbUserDeletionRepository.save(tbUserDeletionData)

            }catch (e:Exception){
                logger.warn("[무시] 휴면계정 전환 하다가 에러 (e:${e})")
                logger.warn("[무시] 휴면계정 전환 하다가 에러 (userId:${it.get(tbUserMaster.userId)!!})")
            }
        }
    }
}