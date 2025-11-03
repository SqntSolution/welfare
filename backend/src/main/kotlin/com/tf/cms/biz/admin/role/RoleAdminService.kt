package com.tf.cms.biz.admin.role

import com.tf.cms.biz.common.UserComponent
import com.tf.cms.biz.common.CacheEvictor
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbAuthAdminContentsmanagerMenuMappRepository
import com.tf.cms.common.jpa.repository.TbAuthAdminUserMappRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.HrUserCondition
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions.select
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.utils.Helpers
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class RoleAdminService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val tbAuthAdminUserMappRepository: TbAuthAdminUserMappRepository,
    private val tbAuthAdminContentsmanagerMenuMappRepository: TbAuthAdminContentsmanagerMenuMappRepository,
    private val cacheEvictor: CacheEvictor,
    private val userComponent: UserComponent
) {
    private val logger = logger()

    /**
     * 관리자 목록 조회
     *
     * @param roleFlag
     * @return
     */
    fun findRoleAdminInfoList(roleFlag: TheRole): List<RoleAdminInfoDto> {
        logger.debug { "=== roleFlag : $roleFlag" }
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrUserMaster = QTbHrUserMaster.tbHrUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val subQuery0 = select(tbHrCode.id.code).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery1 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery2 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery3 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)
        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        val whereCondition = BooleanBuilder()
//        whereCondition.and(HrUserCondition.defaultUserMasterCondition())  // 유저전용 으로 만들기위해서 회사 퇴사자 로직 일시 주석
        whereCondition.and(HrUserCondition.defaultHrCodeMasterCondition(true))
        if(TheRole.ROLE_OPERATOR == roleFlag) {
            whereCondition.and(
                    tbAuthAdminUserMapp.adminRole.eq(TheRole.ROLE_MASTER.code)
                            .or(tbAuthAdminUserMapp.adminRole.eq(TheRole.ROLE_OPERATOR.code))
            )
        } else {
            whereCondition.and(
                    tbAuthAdminUserMapp.adminRole.eq(TheRole.ROLE_CONTENTS_MANAGER.code)
            )
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            RoleAdminInfoDto::class.java,
                            ExpressionUtils.`as`(subQuery0, "parentOrgId"),
                            ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbUserMaster.loginId,
                            tbUserMaster.mobileNo,
                            tbUserMaster.isActive,
                            ExpressionUtils.`as`(subQuery2, "dutyNm"),
                            ExpressionUtils.`as`(subQuery3, "empGradeNm"),
                            tbUserMaster.mailAddr,
                            tbAuthAdminUserMapp.id.`as`("adminRoleId"),
                            tbAuthAdminUserMapp.adminRole.`as`("adminRoleCd"),
                            tbAuthAdminUserMapp.startAuthAt,
                            tbAuthAdminUserMapp.endAuthAt,
                            tbAuthGroupTeamMapp.authGroupCd,
                            tbAuthGroup.groupNm.`as`("authGroupNm")
                        )
                )
                .from(tbAuthAdminUserMapp)
                .innerJoin(tbUserMaster).on(tbUserMaster.userId.eq(tbAuthAdminUserMapp.userId))
//                .innerJoin(tbHrUserMaster).on(tbHrUserMaster.empId.eq(tbAuthAdminUserMapp.userId))  // 임시로 회사정보 주석
                .leftJoin(tbHrUserMaster).on(tbHrUserMaster.empId.eq(tbAuthAdminUserMapp.userId))
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .leftJoin(tbAddJobMaster).on(tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .leftJoin(tbAuthGroupTeamMapp).on(tbAuthGroupTeamMapp.teamId.eq(tbHrCodeMaster.id.fullCode))
                .leftJoin(tbAuthGroup).on(tbAuthGroup.authGroupCd.eq(tbAuthGroupTeamMapp.authGroupCd))
                .where(whereCondition)
                .groupBy(tbUserMaster.userId)
                .fetch()
                .map {
                    it.apply {
                        this.adminRoleNm = TheRole.findCode(it.adminRoleCd)?.label
                        // 메일, 전화번호 마스킹처리
                        this.mailAddr = if (this.mailAddr != null) Helpers.maskEmail(this.mailAddr!!) else null
                        this.mobileNo = if (this.mobileNo != null) Helpers.maskPhone(this.mobileNo!!) else null
                        // 컨텐츠 매니저 인 경우 유효 기간 확인
                    }
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

    /**
     * 운영자 등록
     *
     * @param params
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun createRoleOperator(params: OperatorInputDto) {
        // 중복 체크
        tbAuthAdminUserMappRepository.findByUserId(params.userId!!).ifPresent {
            throw BizException("이미 관리자로 등록된 사용자입니다.")
        }

        val tbAuthAdminUserMapp = TbAuthAdminUserMapp().apply {
            this.adminRole = TheRole.ROLE_OPERATOR.code
            this.userId = params.userId
            this.userNm = params.userNm
            this.createdAt = LocalDateTime.now()
            this.createdUserId = UserInfoHelper.getLoginUserInfo()?.id
            this.createdUserNm = UserInfoHelper.getLoginUserInfo()?.name
        }
        tbAuthAdminUserMappRepository.save(tbAuthAdminUserMapp)

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(params.userId!!)
    }

    /**
     * 운영자 삭제
     *
     * @param userId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteRoleOperator(userId: String) {
        tbAuthAdminUserMappRepository.findByUserId(userId).ifPresent {
            if(it.adminRole == TheRole.ROLE_MASTER.code) {
                throw BizException("Unable to delete master")
            }
        }
        tbAuthAdminUserMappRepository.deleteByUserId(userId)

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(userId)
    }

    /**
     * 콘텐츠관리자 상세 조회
     *
     * @param userId
     * @return
     */
    fun findRoleContentsManagerDetail(userId: String): RoleContentsManagerInfoDto {
        val tbAuthAdminUser = tbAuthAdminUserMappRepository.findByUserId(userId).orElseThrow { throw BizException("해당 사용자가 존재하지 않습니다.") }
        val authMenuIds = tbAuthAdminContentsmanagerMenuMappRepository.findByUserId(userId).map { it.menuId }
        val userDetail = userComponent.getDbUserInfoFromDb(userId)

        return RoleContentsManagerInfoDto().apply {
            this.adminRoleId = tbAuthAdminUser.id
            this.adminRoleCd = tbAuthAdminUser.adminRole
            this.adminRoleNm = TheRole.findCode(tbAuthAdminUser.adminRole)?.label
            this.userId = tbAuthAdminUser.userId
            this.userNm = tbAuthAdminUser.userNm
            this.orgId = userDetail?.orgId
            this.orgNm = userDetail?.orgNm
            this.dutyNm = userDetail?.dutyNm
            this.empGradeNm = userDetail?.empGradeNm
            this.startAuthAt = tbAuthAdminUser.startAuthAt
            this.endAuthAt = tbAuthAdminUser.endAuthAt
            this.authMenuIdList = authMenuIds
        }
    }

    /**
     * 콘텐츠관리자 등록
     *
     * @param params
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun createRoleContentsManager(params: ContentsManagerInputDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        // 중복 체크
        tbAuthAdminUserMappRepository.findByUserId(params.userId!!).ifPresent {
            throw BizException("이미 관리자로 등록된 사용자입니다.")
        }

        val tbAuthAdminUserMapp = TbAuthAdminUserMapp().apply {
            this.adminRole = TheRole.ROLE_CONTENTS_MANAGER.code
            this.userId = params.userId
            this.userNm = params.userNm
            this.startAuthAt = params.getStartAuthAt()
            this.endAuthAt = params.getEndAuthAt()
            this.createdAt = LocalDateTime.now()
            this.createdUserId = userInfo?.id
            this.createdUserNm = userInfo?.name
        }
        tbAuthAdminUserMappRepository.save(tbAuthAdminUserMapp)

        val authMenuList = params.authMenuIdList?.map {
            TbAuthAdminContentsmanagerMenuMapp().apply {
                this.menuId = it
                this.userId = params.userId
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo?.id
                this.createdUserNm = userInfo?.name
            }
        }
        if(!authMenuList.isNullOrEmpty()) {
            tbAuthAdminContentsmanagerMenuMappRepository.saveAll(authMenuList)
        }

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(params.userId!!)
    }

    /**
     * 콘텐츠관리자 수정
     *
     * @param params
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateRoleContentsManager(userId: String, params: ContentsManagerUpdateDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val tbAuthAdminUser = tbAuthAdminUserMappRepository.findByUserId(userId).orElseThrow { throw BizException("존재하지 않는 사용자입니다.") }

        val tbAuthAdminUserMapp = tbAuthAdminUser.apply {
            this.startAuthAt = params.getStartAuthAt()
            this.endAuthAt = params.getEndAuthAt()
            this.modifiedAt = LocalDateTime.now()
            this.modifiedUserId = userInfo?.id
            this.modifiedUserNm = userInfo?.name
        }
        tbAuthAdminUserMappRepository.save(tbAuthAdminUserMapp)

        // 삭제 후 등록
        tbAuthAdminContentsmanagerMenuMappRepository.deleteByUserId(userId)
        val authMenuList = params.authMenuIdList?.map {
            TbAuthAdminContentsmanagerMenuMapp().apply {
                this.menuId = it
                this.userId = userId
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo?.id
                this.createdUserNm = userInfo?.name
            }
        }
        if(!authMenuList.isNullOrEmpty()) {
            tbAuthAdminContentsmanagerMenuMappRepository.saveAll(authMenuList)
        }

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(userId)
    }

    /**
     * 콘텐츠관리자 삭제
     *
     * @param userId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteRoleContentsManager(userId: String) {
        tbAuthAdminUserMappRepository.findByUserId(userId).ifPresent {
            if(it.adminRole == TheRole.ROLE_MASTER.code) {
                throw BizException("Unable to delete master")
            }
        }
        tbAuthAdminUserMappRepository.deleteByUserId(userId)
        tbAuthAdminContentsmanagerMenuMappRepository.deleteByUserId(userId)

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(userId)
    }
}