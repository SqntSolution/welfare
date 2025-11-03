package com.tf.cms.biz.admin.group

import com.tf.cms.biz.common.CacheEvictor
import com.tf.cms.common.jpa.entity.QTbAuthGroup
import com.tf.cms.common.jpa.entity.QTbAuthGroupTeamMapp
import com.tf.cms.common.jpa.entity.QTbAuthGroupUserMapp
import com.tf.cms.common.jpa.entity.QTbAddJobMaster
import com.tf.cms.common.jpa.entity.QTbHrCodeMaster
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.TbAuthGroup
import com.tf.cms.common.jpa.entity.TbAuthGroupMenuMapp
import com.tf.cms.common.jpa.entity.TbAuthGroupTeamMapp
import com.tf.cms.common.jpa.entity.TbAuthGroupUserMapp
import com.tf.cms.common.jpa.repository.TbAuthGroupMenuMappRepository
import com.tf.cms.common.jpa.repository.TbAuthGroupRepository
import com.tf.cms.common.jpa.repository.TbAuthGroupTeamMappRepository
import com.tf.cms.common.jpa.repository.TbAuthGroupUserMappRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.*
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.CaseBuilder
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import org.springframework.stereotype.Service

@Service
class GroupService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val cacheEvictor: CacheEvictor,
    private val tbAuthGroupRepository: TbAuthGroupRepository,
    private val tbAuthGroupMenuMappRepository: TbAuthGroupMenuMappRepository,
    private val tbAuthGroupTeamMappRepository: TbAuthGroupTeamMappRepository,
    private val tbAuthGroupUserMappRepository: TbAuthGroupUserMappRepository,
) {
    private val logger = logger()

    /**
     * 권한그룹 목록 조회
     *
     * @return
     */
    fun findAuthGroupList(): List<AuthGroupDto> {
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup
        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp

        val subQuery1 = JPAExpressions.select(tbAuthGroupTeamMapp.count().intValue()).from(tbAuthGroupTeamMapp).where(tbAuthGroupTeamMapp.authGroupCd.eq(tbAuthGroup.authGroupCd))
        val subQuery2 = JPAExpressions.select(tbAuthGroupUserMapp.count().intValue()).from(tbAuthGroupUserMapp).where(tbAuthGroupUserMapp.authGroupCd.eq(tbAuthGroup.authGroupCd))

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                AuthGroupDto::class.java,
                                tbAuthGroup.authGroupCd,
                                tbAuthGroup.groupNm,
                                tbAuthGroup.description,
                                tbAuthGroup.createdAt,
                                tbAuthGroup.createdUserId,
                                tbAuthGroup.createdUserNm,
                                tbAuthGroup.modifiedAt,
                                tbAuthGroup.modifiedUserId,
                                tbAuthGroup.modifiedUserNm,
                                ExpressionUtils.`as`(subQuery1, "teamMatchingCount"),
                                ExpressionUtils.`as`(subQuery2, "userMatchingCount"),
                        )
                )
                .from(tbAuthGroup)
                .fetch()
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

    /**
     * Menu 목록 조회 (계층형)
     *
     * @param accessAuthList
     * @param fileDownloadList
     * @return
     */
    fun findMenuInfoList(accessAuthList: List<Int>?, fileDownloadList: List<Int>?): List<MenuInfoDto> {
        val allMenus = if(accessAuthList != null && fileDownloadList != null) {
            // 권한 설정
            menuIdHolder.getAllMenus()
                    .filter { !FixedMenuTypes.contains(it.contentType) }
                    .map {
                        MenuInfoDto(it).apply {
                            this.accessAuthYn = accessAuthList.contains(this.id)
                            this.fileDownloadYn = fileDownloadList.contains(this.id)
                        }
                    }
                    .sortedBy { it.menuSeq }
        } else {
            // 단순 조회
            menuIdHolder.getAllMenus()
                    .filter { !FixedMenuTypes.contains(it.contentType) }
                    .map { MenuInfoDto(it) }
                    .sortedBy { it.menuSeq }
        }
        val menuMap = allMenus.groupBy { it.parentId }

        val result = allMenus
                .filter { it.parentId == 0 }
                .map {
                    it.childrenMenu = menuMap[it.id]
                    it
                }

        return result
    }

    /**
     * 권한그룹 단건 조회
     *
     * @param authGroupCode
     * @return
     */
    fun findAuthGroup(authGroupCode: String): AuthGroupDetailDto {
        val tbAuthGroup = tbAuthGroupRepository.findById(authGroupCode)
                .orElseThrow { throw BizException("존재하지 않는 데이터입니다.") }

        val tbAuthGroupMenuList = tbAuthGroupMenuMappRepository.findByAuthGroupCd(authGroupCode)
        var menuInfoDtoList: List<MenuInfoDto>? = null
        if(tbAuthGroupMenuList.isNotEmpty()) {
            val accessAuthList = tbAuthGroupMenuList.map { it.menuId!! }
            val fileDownloadList = tbAuthGroupMenuList.filter { it.canFiledownload == true }.map { it.menuId!! }
            menuInfoDtoList = findMenuInfoList(accessAuthList, fileDownloadList)
        }

        return AuthGroupDetailDto().apply {
            this.immutable = tbAuthGroup.immutable
            this.authGroupCd = tbAuthGroup.authGroupCd
            this.groupNm = tbAuthGroup.groupNm
            this.description = tbAuthGroup.description
            this.createdAt = tbAuthGroup.createdAt
            this.createdUserId = tbAuthGroup.createdUserId
            this.createdUserNm = tbAuthGroup.createdUserNm
            this.modifiedAt = tbAuthGroup.modifiedAt
            this.modifiedUserId = tbAuthGroup.modifiedUserId
            this.modifiedUserNm = tbAuthGroup.modifiedUserNm
            this.menuInfoList = menuInfoDtoList
        }
    }

    /**
     * 권한그룹 생성
     *
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun createAuthGroup(dto: AuthGroupInputDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val timeId = System.currentTimeMillis().toString()

        // 권한그룹
        val authGroup = TbAuthGroup().apply {
            authGroupCd = timeId
            groupNm = dto.groupNm
            description = dto.description
            createdAt = LocalDateTime.now()
            createdUserId = userInfo?.id
            createdUserNm = userInfo?.name
        }
        tbAuthGroupRepository.save(authGroup)

        // 권한그룹 매핑 매뉴
        if(!dto.authMenuList.isNullOrEmpty()) {
            val authGroupMenuMappList = dto.authMenuList?.map {
                TbAuthGroupMenuMapp().apply {
                    authGroupCd = timeId
                    menuId = it.menuId
                    canFiledownload = it.hasFileDownloadAuth()
                    createdAt = LocalDateTime.now()
                    createdUserId = userInfo?.id
                    createdUserNm = userInfo?.name
                }
            }
            tbAuthGroupMenuMappRepository.saveAll(authGroupMenuMappList!!)
        }
    }

    /**
     * 권한그룹 수정
     *
     * @param authGroupCode
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateAuthGroup(authGroupCode: String, dto: AuthGroupInputDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()

        tbAuthGroupRepository.findById(authGroupCode).ifPresent { tbAuthGroup ->
            // 권한그룹
            val authGroup = tbAuthGroup.apply {
                groupNm = dto.groupNm
                description = dto.description
                modifiedAt = LocalDateTime.now()
                modifiedUserId = userInfo?.id
                modifiedUserNm = userInfo?.name
            }
            tbAuthGroupRepository.save(authGroup)

            // 권한그룹 매핑 매뉴
            if(!dto.authMenuList.isNullOrEmpty()) {
                // 삭제
                tbAuthGroupMenuMappRepository.deleteByAuthGroupCd(authGroupCode)
                // 등록
                val authGroupMenuMappList = dto.authMenuList?.map { authGroupMenuDto ->
                    TbAuthGroupMenuMapp().apply {
                        authGroupCd = authGroupCode
                        menuId = authGroupMenuDto.menuId
                        canFiledownload = authGroupMenuDto.hasFileDownloadAuth()
                        createdAt = LocalDateTime.now()
                        createdUserId = userInfo?.id
                        createdUserNm = userInfo?.name
                    }
                }
                tbAuthGroupMenuMappRepository.saveAll(authGroupMenuMappList!!)
            }
        }

        // 캐시 초기화
        cacheEvictor.clearAllUserInfoCache()
    }

    /**
     * 권한그룹 삭제 (관련 매뉴, 팀, 유저 권한 삭제)
     *
     * @param authGroupCode
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteAuthGroup(authGroupCode: String) {
        tbAuthGroupRepository.findById(authGroupCode).ifPresent { group ->
            if(group.immutable) throw IllegalStateException("삭제 불가능한 권한 그룹이거나 존재하지 않습니다.")
            // 권한그룹
            tbAuthGroupRepository.deleteById(authGroupCode)
            // 매뉴 권한
            tbAuthGroupMenuMappRepository.deleteByAuthGroupCd(authGroupCode)
            // 팀 권한
            tbAuthGroupTeamMappRepository.deleteByAuthGroupCd(authGroupCode)
            // 유저 권한
            tbAuthGroupUserMappRepository.deleteByAuthGroupCd(authGroupCode)

            // 캐시 초기화
            cacheEvictor.clearAllUserInfoCache()
        }
    }

    /**
     * 매칭 팀 권한그룹 조회
     *
     * @return
     */
    fun findMatchingTeamAuthGroup(): List<MatchingTeamAuthGroupDto> {
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val subQuery1 = JPAExpressions.select(tbHrCode.id.code).from(tbHrCode)
            .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2))
            .where(tbHrCode.id.groupCode.eq(tbHrCodeMaster.id.groupCode))
            .where(tbHrCode.id.groupCode.eq("ORG"))
        val subQuery2 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
            .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2))
            .where(tbHrCode.id.groupCode.eq(tbHrCodeMaster.id.groupCode))
            .where(tbHrCode.id.groupCode.eq("ORG"))

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            MatchingTeamAuthGroupDto::class.java,
                            tbHrCodeMaster.id.code.`as`("orgId"),
                            tbHrCodeMaster.codeNm.`as`("orgNm"),
                            tbHrCodeMaster.id.fullCode.`as`("orgFullCode"),
                            tbHrCodeMaster.displayOrder,
                            ExpressionUtils.`as`(subQuery1, "parentOrgId"),
                            ExpressionUtils.`as`(subQuery2, "parentOrgNm"),
                            tbAuthGroupTeamMapp.id.`as`("authMatchingId"),
                            tbAuthGroupTeamMapp.authGroupCd,
                            tbAuthGroup.groupNm.`as`("authGroupNm"),
                            tbHrCodeMaster.id.fullCode.`as`("orgKey")
                        )
                )
                .from(tbHrCodeMaster)
                .leftJoin(tbAuthGroupTeamMapp).on(tbAuthGroupTeamMapp.teamId.eq(tbHrCodeMaster.id.fullCode))
                .leftJoin(tbAuthGroup).on(tbAuthGroup.authGroupCd.eq(tbAuthGroupTeamMapp.authGroupCd))
                .where(HrUserCondition.defaultHrCodeMasterCondition())
                .orderBy(
                        CaseBuilder().`when`(tbAuthGroupTeamMapp.isNull()).then(0).otherwise(1).desc(),
                        tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc()
                )
                .fetch()
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

    /**
     * 매칭 사용자 권한그룹 조회
     *
     * @return
     */
    fun findMatchingUserAuthGroup(): List<MatchingUserAuthGroupDto> {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val subQuery1 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery2 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)

        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            MatchingUserAuthGroupDto::class.java,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbUserMaster.loginId,
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm,
                            tbUserMaster.isActive,
                            tbUserMaster.mobileNo,
                            tbUserMaster.mailAddr,
                            ExpressionUtils.`as`(subQuery1, "dutyNm"),
                            ExpressionUtils.`as`(subQuery2, "empGradeNm"),
                            tbAuthGroupUserMapp.id.`as`("authMatchingId"),
                            tbAuthGroupUserMapp.authGroupCd,
                            tbAuthGroup.groupNm.`as`("authGroupNm")
                        )
                )
                .distinct()
                .from(tbUserMaster)
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG")))
                .leftJoin(tbAddJobMaster).on(
                tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .innerJoin(tbAuthGroupUserMapp).on(tbAuthGroupUserMapp.userId.eq(tbUserMaster.userId))
                .leftJoin(tbAuthGroup).on(tbAuthGroup.authGroupCd.eq(tbAuthGroupUserMapp.authGroupCd))
                .where(
//                        HrUserCondition.defaultUserMasterCondition()
//                                .and(
                                    HrUserCondition.defaultHrCodeMasterCondition(true))
//                )
                .groupBy(tbAuthGroupUserMapp.id)
                .orderBy(
                        tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc(),
                        tbUserMaster.userNm.asc()
                )
                .fetch()
                .map{
                    it.mailAddr = if (it.mailAddr != null) Helpers.maskEmail(it.mailAddr!!) else null
                    it.mobileNo = if (it.mobileNo != null) Helpers.maskPhone(it.mobileNo!!) else null
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }

//    /**
//     * 매칭 정보 일괄 저장
//     *
//     * @param param
//     */
//    @Transactional(rollbackOn = [Throwable::class])
//    fun saveMatchingAuthGroup(param: MatchingInfoInput) {
//        // 매칭 팀 권한그룹 저장
//        saveMatchingTeamAuthGroup(param.matchingTeamInputList)
//        // 매칭 사용자 권한그룹 저장
//        saveMatchingUserAuthGroup(param.matchingUserInputList, param.deleteMatchingUserIdList)
//    }

    /**
     * 매칭 팀 권한그룹 저장
     *
     * @param params
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveMatchingTeamAuthGroup(params: List<MatchingTeamAuthGroupInput>?, deleteParams: List<Int>?) {
        // 삭제
        if(!deleteParams.isNullOrEmpty()) {
            tbAuthGroupTeamMappRepository.deleteAllById(deleteParams)
        }

        if(params.isNullOrEmpty()) return

        val userInfo = UserInfoHelper.getLoginUserInfo()

        params.forEach { inputDto ->
            if(inputDto.authMatchingId != null) {
                // 수정
                val tbAuthGroupTeamMapp = tbAuthGroupTeamMappRepository.findById(inputDto.authMatchingId!!)
                        .orElseThrow { throw BizException("유효하지 않은 데이터입니다.") }
                        .apply {
                            this.authGroupCd = inputDto.authGroupCd
                            this.modifiedAt = LocalDateTime.now()
                            this.modifiedUserId = userInfo?.id
                            this.modifiedUserNm = userInfo?.name
                        }
                tbAuthGroupTeamMappRepository.save(tbAuthGroupTeamMapp)
            } else {
                // 등록
                val tbAuthGroupTeamMapp = TbAuthGroupTeamMapp().apply {
                    this.authGroupCd = inputDto.authGroupCd
                    this.teamId = inputDto.orgFullCode
                    this.createdAt = LocalDateTime.now()
                    this.createdUserId = userInfo?.id
                    this.createdUserNm = userInfo?.name
                }
                tbAuthGroupTeamMappRepository.save(tbAuthGroupTeamMapp)
            }
        }

        // 캐시 초기화
        cacheEvictor.clearAllUserInfoCache()
    }

    /**
     * 매칭 사용자 권한그룹 저장
     *
     * @param params
     * @param deleteParams
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveMatchingUserAuthGroup(params: List<MatchingUserAuthGroupInput>?, deleteParams: List<Int>?) {
        // 삭제
        if(!deleteParams.isNullOrEmpty()) {
            tbAuthGroupUserMappRepository.deleteAllById(deleteParams)
        }

        if(params.isNullOrEmpty()) return

        val userInfo = UserInfoHelper.getLoginUserInfo()

        params.forEach { inputDto ->
            if(inputDto.authMatchingId != null) {
                // 수정
                val tbAuthGroupUserMapp = tbAuthGroupUserMappRepository.findById(inputDto.authMatchingId!!)
                        .orElseThrow { throw BizException("유효하지 않은 데이터입니다.") }
                tbAuthGroupUserMapp.apply {
                    this.authGroupCd = inputDto.authGroupCd
                    this.modifiedAt = LocalDateTime.now()
                    this.modifiedUserId = userInfo?.id
                    this.modifiedUserNm = userInfo?.name
                }
                tbAuthGroupUserMappRepository.save(tbAuthGroupUserMapp)
            } else {
                // 등록
                val tbAuthGroupUserMapp = TbAuthGroupUserMapp().apply {
                    this.authGroupCd = inputDto.authGroupCd
                    this.userId = inputDto.userId
                    this.createdAt = LocalDateTime.now()
                    this.createdUserId = userInfo?.id
                    this.createdUserNm = userInfo?.name
                }
                tbAuthGroupUserMappRepository.save(tbAuthGroupUserMapp)
            }
        }

        // 캐시 초기화
        cacheEvictor.clearAllUserInfoCache()
    }
}