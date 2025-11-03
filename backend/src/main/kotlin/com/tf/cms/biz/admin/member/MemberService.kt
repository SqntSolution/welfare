package com.tf.cms.biz.admin.member

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.auth.AuthService
import com.tf.cms.biz.common.CacheEvictor
import com.tf.cms.biz.user.my.UserAlarmDto
import com.tf.cms.biz.user.my.UserAlarmRequestDto
import com.tf.cms.biz.user.my.UserPostDto
import com.tf.cms.biz.user.my.UserScrapDto
import com.tf.cms.common.jpa.dto.TbUserHistoryDto
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.*
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions.select
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class MemberService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val authService: AuthService,
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val cacheEvictor: CacheEvictor,
    private val tbUserRepository: TbUserRepository,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbAuthGroupTeamMappRepository: TbAuthGroupTeamMappRepository,
    private val tbAuthGroupUserMappRepository: TbAuthGroupUserMappRepository,
    private val tbAuthAdminContentsmanagerMenuMappRepository: TbAuthAdminContentsmanagerMenuMappRepository,
    private val tbUserDeletionRepository: TbUserDeletionRepository,
    private val tbUserMasterRepository: TbUserMasterRepository,
    private val tbUserSocialLoginRepository: TbUserSocialLoginRepository,
    private val tbAuthUserRepository: TbAuthUserRepository,
) {
    private val logger = logger()

    /**
     * 회원 목록 조회
     *
     * @param pageable
     * @param cond
     * @return
     */
    fun findMemberList(pageable: Pageable, cond: MemberSearchParams): Page<MemberInfoDto> {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup
        val tbHrCode = QTbHrCodeMaster("tbHrCode")

        val tbHrUserMaster = QTbHrUserMaster.tbHrUserMaster

        val whereCondition = BooleanBuilder()
//        whereCondition.and(HrUserCondition.defaultUserMasterCondition())
        whereCondition.and(HrUserCondition.defaultHrCodeMasterCondition(true))
        // 매칭된 그룹 여부
        if(cond.hasNotMatchingGroup()) {
            whereCondition.and(tbAuthGroupTeamMapp.authGroupCd.isNull)
        }
        // 소속 팀
        if(!cond.teamCode.isNullOrBlank()) {
            whereCondition.and(tbHrCodeMaster.id.fullCode.eq(cond.teamCode))
        }
        // 사용자 권한
        if(!cond.adminRoleCode.isNullOrBlank()) {
            if(TheRole.findCode(cond.adminRoleCode) != TheRole.ROLE_USER) {
                whereCondition.and(tbAuthAdminUserMapp.adminRole.eq(cond.adminRoleCode))
            } else {
                whereCondition.and(tbAuthAdminUserMapp.id.isNull)
            }
        }
        // 소속 팀 권한
        if(!cond.authGroupCode.isNullOrBlank()) {
            whereCondition.and(tbAuthGroupTeamMapp.authGroupCd.eq(cond.authGroupCode))
        }
        // 키워드
        if(!cond.keyword.isNullOrBlank()) {
            whereCondition.and(
                tbUserMaster.userNm.contains(cond.keyword)
                            .or(tbUserMaster.mailAddr.contains(cond.keyword))
            )
        }

        val subQuery0 = select(tbHrCode.id.code).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery1 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery2 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery3 = select(tbHrCode.codeNm).from(tbHrCode)
                .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)

        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                            MemberInfoDto::class.java,
                            tbUserMaster.loginId,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbUserMaster.mailAddr,
                            tbUserMaster.isActive,
                            tbUserMaster.mobileNo,
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm,
                            ExpressionUtils.`as`(subQuery0, "parentOrgId"),
                            ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                            ExpressionUtils.`as`(subQuery2, "dutyNm"),
                            ExpressionUtils.`as`(subQuery3, "empGradeNm"),
                            tbAuthAdminUserMapp.adminRole.coalesce("ROLE_USER").`as`("adminRole"),
                            tbAuthAdminUserMapp.startAuthAt,
                            tbAuthAdminUserMapp.endAuthAt,
                            tbAuthGroupTeamMapp.authGroupCd,
                            tbAuthGroup.groupNm.`as`("authGroupNm")
                        )
                )
                .from(tbUserMaster)
//                .innerJoin(tbHrUserMaster).on(tbHrUserMaster.empId.eq(tbUserMaster.userId)) // 멤버 조회 범위를 회사 소속으로 변경
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .leftJoin(tbAddJobMaster).on(
                tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .leftJoin(tbAuthAdminUserMapp).on(tbUserMaster.userId.eq(tbAuthAdminUserMapp.userId))
                .leftJoin(tbAuthGroupTeamMapp).on(tbHrCodeMaster.id.fullCode.eq(tbAuthGroupTeamMapp.teamId))
                .leftJoin(tbAuthGroup).on(tbAuthGroupTeamMapp.authGroupCd.eq(tbAuthGroup.authGroupCd))
                .where(whereCondition)
                .groupBy(tbUserMaster.userId)
                .orderBy(
                        tbHrCodeMaster.fullCode2.asc(),
                        Expressions.numberTemplate(Int::class.java, "CAST({0} AS INTEGER)", tbHrCodeMaster.displayOrder).asc(),
                        tbUserMaster.userId.asc()
                )
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()

        resultData.forEach {
            // 메일, 전화번호 마스킹처리
            it.mailAddr = if (it.mailAddr != null) Helpers.maskEmail(it.mailAddr!!) else null
            it.mobileNo = if (it.mobileNo != null) Helpers.maskPhone(it.mobileNo!!) else null
            // 컨텐츠 매니저 인 경우 유효 기간 확인
            if(it.adminRole == TheRole.ROLE_CONTENTS_MANAGER.code) {
                it.apply {
                    this.adminRole = TheRole.validContentsManager(it.startAuthAt, it.endAuthAt).code
                    this.adminRoleNm = TheRole.validContentsManager(it.startAuthAt, it.endAuthAt).label
                }
            } else {
                it.apply {
                    this.adminRoleNm = TheRole.findCode(it.adminRole)?.label
                }
            }
        }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultDataCount = jPAQueryFactory
                .selectFrom(tbUserMaster)
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .leftJoin(tbAddJobMaster).on(
                tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                                .and(templateEndYmd.goe(LocalDate.now()))
                )
                .leftJoin(tbAuthAdminUserMapp).on(tbUserMaster.userId.eq(tbAuthAdminUserMapp.userId))
                .leftJoin(tbAuthGroupTeamMapp).on(tbHrCodeMaster.id.fullCode.eq(tbAuthGroupTeamMapp.teamId)
                )
                .leftJoin(tbAuthGroup).on(tbAuthGroupTeamMapp.authGroupCd.eq(tbAuthGroup.authGroupCd))
                .where(whereCondition)
                .groupBy(tbUserMaster.userId)
                .fetch()
        logger.debug { "=== resultDataCount : ${resultDataCount.size}" }

        return PageImpl(resultData, pageable, resultDataCount.size.toLong())
    }

    /**
     * 회원 이름 및 권한 조회
     *
     * @param pUserId
     * @return
     */
    fun findMemberById(pUserId: String): MemberNameAndRole {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp

        return jPAQueryFactory
                .select(
                        Projections.fields(
                            MemberNameAndRole::class.java,
                            tbUserMaster.userId,
                            tbUserMaster.userNm,
                            tbAuthAdminUserMapp.adminRole,
                            tbAuthAdminUserMapp.startAuthAt,
                            tbAuthAdminUserMapp.endAuthAt
                        )
                )
                .from(tbUserMaster)
                .leftJoin(tbAuthAdminUserMapp).on(tbAuthAdminUserMapp.userId.eq(tbUserMaster.userId))
                .where(tbUserMaster.userId.eq(pUserId))
                .fetchFirst()
                .apply {
                    this.adminRole = when(this.adminRole) {
                        TheRole.ROLE_CONTENTS_MANAGER.code -> TheRole.validContentsManager(this.startAuthAt, this.endAuthAt).code
                        null -> TheRole.ROLE_USER.code
                        else -> TheRole.findCode(this.adminRole)?.code
                    }
                    this.adminRoleNm = TheRole.findCode(this.adminRole)?.label
                }
    }

    /**
     * 회원 프로필 조회
     *
     * @param pUserId
     * @return
     */
    fun findMemberProfile(pUserId: String): MemberProfileDto {
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val tbUser = QTbUser.tbUser

        val member = jPAQueryFactory
                .select(
                        Projections.fields(
                            MemberProfileDto::class.java,
                            tbUserMaster.userId.`as`("id"),
                            tbUserMaster.loginId,
                            tbUserMaster.userNm.`as`("name"),
                            tbUserMaster.mailAddr.`as`("email"),
                            tbUserMaster.mobileNo.`as`("phone"),
                            tbUserMaster.isActive,
                            tbHrCodeMaster.id.fullCode.`as`("teamCode"),
                            tbUserMaster.orgNm.`as`("teamName"),
                            tbUser.avatarImgPath,
                            tbAuthAdminUserMapp.adminRole.`as`("roleCd"),
                            tbAuthAdminUserMapp.startAuthAt,
                            tbAuthAdminUserMapp.endAuthAt
                        )
                )
                .from(tbUserMaster)
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG")))
                .leftJoin(tbUser).on(tbUserMaster.userId.eq(tbUser.userId))
                .leftJoin(tbAuthAdminUserMapp).on(tbUserMaster.userId.eq(tbAuthAdminUserMapp.userId))
                .where(
                    tbUserMaster.userId.eq(pUserId)
//                        .and(HrUserCondition.defaultUserMasterCondition())
                )
                .fetchFirst()
                .apply {
                    this.role = when(this.roleCd) {
                        TheRole.ROLE_CONTENTS_MANAGER.code -> TheRole.validContentsManager(this.startAuthAt, this.endAuthAt)
                        null -> TheRole.ROLE_USER
                        else -> TheRole.findCode(this.roleCd)
                    }
                    this.roleNm = this.role?.label
                    this.email = if (this.email != null) Helpers.maskEmail(this.email!!) else null
                    this.phone = if (this.phone != null) Helpers.maskPhone(this.phone!!) else null
                }
        logger.debug { "=== member : $member" }

        if(member == null) {
            throw BizException("해당 사용자가 존재하지 않습니다.")
        }

        // 권한 코드 리스트
        val authGroupList = mutableListOf<String>()
        if(member.teamCode != null) {
            authGroupList.addAll(
                    tbAuthGroupTeamMappRepository.findByTeamId(member.teamCode!!).map { it.authGroupCd!! }
            )
        }
        if(member.id != null) {
            authGroupList.addAll(
                    tbAuthGroupUserMappRepository.findByUserId(member.id!!).map { it.authGroupCd!! }
            )
        }
        // 콘텐츠관리자 접근 메뉴 리스트
        val contentsManagerAuthMenus = mutableListOf<Int>()
        if(TheRole.ROLE_CONTENTS_MANAGER == member.role) {
            contentsManagerAuthMenus.addAll(
                    tbAuthAdminContentsmanagerMenuMappRepository.findByUserId(pUserId).map { it.menuId!! }
            )
        }

        return member.apply {
            this.authGroupCd = authGroupList.distinct().toString()
            this.authGroupNm = authGroupList.distinct().map { authService.findAuthGroupName(it) }.toString()
            this.userAuthInfoList = roleAndMenuComponent.getMenuAuthByUser(authGroupList.distinct(), member.role, contentsManagerAuthMenus)
        }
    }

    /**
     * 프로필 이미지 변경
     *
     * @param pUserId
     * @param imgPath
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateAvatarImgPath(pUserId: String, imgPath: String) {
        val loginUserInfo = UserInfoHelper.getLoginUserInfo()
        val tbUser = tbUserRepository.findById(pUserId)
        val entity: TbUser
        if(tbUser.isPresent) {
            // 수정
            entity = tbUser.get().apply {
                this.avatarImgPath = imgPath
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = loginUserInfo?.id
                this.modifiedUserNm = loginUserInfo?.name
            }
        } else {
            // 등록
            entity = TbUser().apply {
                this.userId = pUserId
                this.avatarImgPath = imgPath
                this.createdAt = LocalDateTime.now()
                this.createdUserId = loginUserInfo?.id
                this.createdUserNm = loginUserInfo?.name
            }
        }
        tbUserRepository.save(entity)

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(pUserId)
    }

    /**
     * 스크랩 목록 조회 (페이징)
     *
     * @param pUserId
     * @param keyword
     * @param pageable
     * @return
     */
    fun findUserScrapList(pUserId: String, keyword: String?, pageable: Pageable): Page<UserScrapDto> {
        val qTbUserScrap = QTbUserScrap.tbUserScrap
        val qTbPostContent = QTbPostContent.tbPostContent

        val joinCondition = qTbUserScrap.id.postId.eq(qTbPostContent.id)
                .and(qTbUserScrap.id.userId.eq(pUserId))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContent.enabled.eq(true))
        whereCondition.and(qTbPostContent.openType.eq("public"))
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbPostContent.title.contains(keyword))
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                UserScrapDto::class.java,
                                qTbUserScrap.id.postId,
                                qTbUserScrap.id.userId,
                                qTbUserScrap.createdAt,
                                qTbPostContent.title,
                                qTbPostContent.menu1Id.`as`("menu1Id"),
                                qTbPostContent.menu2Id.`as`("menu2Id")
                        )
                )
                .from(qTbUserScrap)
                .innerJoin(qTbPostContent).on(joinCondition)
                .where(whereCondition)
                .orderBy(qTbUserScrap.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menu1Nm = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menu2Nm = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
                .select(qTbUserScrap.count())
                .from(qTbUserScrap)
                .innerJoin(qTbPostContent).on(joinCondition)
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * 알람설정 조회
     *
     * @param pUserId
     * @return
     */
    fun findUserAlarm(pUserId: String): UserAlarmDto {
        val tbUser = tbUserRepository.findById(pUserId)

        return if(tbUser.isPresent) {
            val tbUserGet = tbUser.get()
            UserAlarmDto().apply {
                this.noticeAlarmEnabled = tbUserGet.noticeAlarmEnabled!!
                this.qnaAnswerAlarmEnabled = tbUserGet.qnaAnswerAlarmEnabled!!
                this.commentAlarmEnabled = tbUserGet.commentAlarmEnabled!!
                this.newPostAlarmEnabled = tbUserGet.newPostAlarmEnabled!!
            }
        } else {
            UserAlarmDto().apply {
                this.noticeAlarmEnabled = false
                this.qnaAnswerAlarmEnabled = false
                this.commentAlarmEnabled = false
                this.newPostAlarmEnabled = false
            }
        }
    }

    /**
     * 알람설정 수정
     *
     * @param pUserId
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateUserAlarm(pUserId: String, dto: UserAlarmRequestDto) {
        // 알림설정 수정
        val loginUserInfo = UserInfoHelper.getLoginUserInfo()
        val tbUser = tbUserRepository.findById(pUserId)
        val entity: TbUser
        if(tbUser.isPresent) {
            entity = tbUser.get().apply {
                this.noticeAlarmEnabled = dto.noticeAlarmEnabled
                this.qnaAnswerAlarmEnabled = dto.qnaAnswerAlarmEnabled
                this.commentAlarmEnabled = dto.commentAlarmEnabled
                this.newPostAlarmEnabled = dto.newPostAlarmEnabled
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = loginUserInfo?.id
                this.modifiedUserNm = loginUserInfo?.name
            }
        } else {
            entity = TbUser().apply {
                this.userId = pUserId
                this.noticeAlarmEnabled = dto.noticeAlarmEnabled
                this.qnaAnswerAlarmEnabled = dto.qnaAnswerAlarmEnabled
                this.commentAlarmEnabled = dto.commentAlarmEnabled
                this.newPostAlarmEnabled = dto.newPostAlarmEnabled
                this.createdAt = LocalDateTime.now()
                this.createdUserId = loginUserInfo?.id
                this.createdUserNm = loginUserInfo?.name
            }
        }
        tbUserRepository.save(entity)

        // 캐시 초기화
        cacheEvictor.clearUserInfoCache(pUserId)
    }

    /**
     * 이력 목록 조회
     *
     * @param pUserId
     * @param typeCode
     * @param startDate
     * @param endDate
     * @param pageable
     * @return
     */
    fun findUserHistory(pUserId: String, typeCode: String?, startDate: String?, endDate: String?, pageable: Pageable): Page<TbUserHistoryDto> {
        val qTbUserHistory = QTbUserHistory.tbUserHistory

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbUserHistory.userId.eq(pUserId))
        // 유형
        if(!typeCode.isNullOrBlank()) {
            whereCondition.and(qTbUserHistory.actionType.eq(typeCode))
        }
        // 등록시작일
        if(!startDate.isNullOrBlank()) {
            Helpers.formatStringToLocalDate(startDate)?.let {
                whereCondition.and(qTbUserHistory.createdAt.goe(it.atStartOfDay()))
            }
        }
        // 등록종료일
        if(!endDate.isNullOrBlank()) {
            Helpers.formatStringToLocalDate(endDate)?.let {
                whereCondition.and(qTbUserHistory.createdAt.loe(it.atTime(LocalTime.MAX)))
            }
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                TbUserHistoryDto::class.java,
                                qTbUserHistory.id,
                                qTbUserHistory.postId,
                                qTbUserHistory.userId,
                                qTbUserHistory.postTitle,
                                qTbUserHistory.description,
                                qTbUserHistory.attachedFileId,
                                qTbUserHistory.attachedFileNm,
                                qTbUserHistory.userName,
                                qTbUserHistory.actionType,
                                qTbUserHistory.menu1Id,
                                qTbUserHistory.menu2Id,
                                qTbUserHistory.createdAt
                        )
                )
                .from(qTbUserHistory)
                .where(whereCondition)
                .orderBy(qTbUserHistory.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.actionName = UserHistoryActionType.findCode(it.actionType)?.label
                    it.menu1Nm = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menu2Nm = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
                .select(qTbUserHistory.count())
                .from(qTbUserHistory)
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * 나의 게시글 목록 조회
     *
     * @param pUserId
     * @param openType
     * @param keyword
     * @param pageable
     * @return
     */
    fun findUserPost(pUserId: String, openType: String?, keyword: String?, pageable: Pageable): Page<UserPostDto> {
        val qTbPostContent = QTbPostContent.tbPostContent
        val qTbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContent.enabled.eq(true))
        whereCondition.and(qTbPostContent.postType.eq("post"))
        whereCondition.and(qTbPostContent.createdUserId.eq(pUserId))
        if(!openType.isNullOrBlank()) {
            whereCondition.and(qTbPostContent.openType.eq(openType))
        }
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbPostContent.title.contains(keyword))
        }

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                UserPostDto::class.java,
                                qTbPostContent.id,
                                qTbPostContent.postType,
                                qTbPostContent.title,
                                qTbPostContent.description,
                                qTbPostContent.openType,
                                qTbPostContent.enabled,
                                qTbPostContent.representativeImagePath,
                                qTbPostContent.authLevel,
                                qTbPostContent.menu1Id,
                                qTbPostContent.menu2Id,
                                qTbPostContent.createdAt,
                                qTbPostContent.createdUserId,
                                qTbPostContent.createdUserNm,
                                qTbPostContent.modifiedAt,
                                qTbPostContent.modifiedUserId,
                                qTbPostContent.modifiedUserNm,
                                qTbPostMetaStatistic.viewCnt
                        )
                )
                .from(qTbPostContent)
                .leftJoin(qTbPostMetaStatistic).on(qTbPostContent.id.eq(qTbPostMetaStatistic.id))
                .where(whereCondition)
                .orderBy(qTbPostContent.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.menuNm1 = menuIdHolder.getMenuFromId(it.menu1Id)?.menuNm
                    it.menuNm2 = menuIdHolder.getMenuFromId(it.menu2Id)?.menuNm
                    it
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
                .select(qTbPostContent.count())
                .from(qTbPostContent)
                .leftJoin(qTbPostMetaStatistic).on(qTbPostContent.id.eq(qTbPostMetaStatistic.id))
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * Post 단건 삭제
     *
     * @param postId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deletePostById(postId: Int) {
        tbPostContentRepository.deleteById(postId)
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
    fun deleteMember (
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

        val deleteUserData = jPAQueryFactory
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

        tbUserMasterRepository.findByUserId(userId).ifPresent {
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