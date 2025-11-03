package com.tf.cms.biz.user.my

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.common.CacheEvictor
import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.auth.AuthService
import com.tf.cms.biz.common.login.RegisterData
import com.tf.cms.biz.common.login.UserService
import com.tf.cms.common.jpa.dto.TbUserHistoryDto
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbUserRepository
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.Helpers.maskEmail
import com.tf.cms.common.utils.Helpers.maskPhone
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

@Service
class MyPageService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val authService: AuthService,
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val tbUserRepository: TbUserRepository,
    private val cacheEvictor: CacheEvictor,
    private val userService: UserService,
) {
    private val logger = logger()

    /**
     * 프로필 조회
     *
     * @return
     */
    fun findMyProfile(): UserProfile {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val userId = userInfo.id!!
        val name = userInfo.name
        val email = userInfo.email
        // 프로필 이미지
        val myAvatarImgPath = tbUserRepository.findById(userId).getOrNull()
        val authGroupNmStr = userInfo.authGroup
            ?.map { authService.findAuthGroupName(it) }.toString()

        val registerData = RegisterData(
            name = name,
            email = email,
        )
        val userList = userService.findId(registerData).filter { e -> e.userId == userId }
        val user = userList[0]
        val socialType = user.socialType
        val phone = user.phone

        return UserProfile().apply {
            this.id = userInfo.id
            this.loginId = user.loginId
            this.name = name
            this.email = if (email != null) maskEmail(email) else null
            this.teamName = userInfo.teamName
            this.role = userInfo.role
            this.roleNm = userInfo.role?.label
            this.authGroupCd = userInfo.authGroup.toString()
            this.authGroupNm = authGroupNmStr
            this.userAuthInfoList = roleAndMenuComponent.getMenuAuthByUser(
                userInfo.authGroup,
                userInfo.role,
                userInfo.contentsManagerAuthMenuIds
            )
            this.avatarImgPath = myAvatarImgPath?.avatarImgPath
            this.socialType = socialType
            this.phone = if (phone != null) maskPhone(phone) else null
        }
    }

    /**
     * 프로필 이미지 변경
     *
     * @param imgPath
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateAvatarImgPath(imgPath: String) {
        val loginUserInfo = UserInfoHelper.getLoginUserInfo()
        val tbUser = tbUserRepository.findById(loginUserInfo?.id!!)
        val entity: TbUser
        if (tbUser.isPresent) {
            // 수정
            entity = tbUser.get().apply {
                this.avatarImgPath = imgPath
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = loginUserInfo.id
                this.modifiedUserNm = loginUserInfo.name
            }
        } else {
            // 등록
            entity = TbUser().apply {
                this.userId = loginUserInfo.id!!
                this.avatarImgPath = imgPath
                this.createdAt = LocalDateTime.now()
                this.createdUserId = loginUserInfo.id
                this.createdUserNm = loginUserInfo.name
            }
        }
        tbUserRepository.save(entity)
        cacheEvictor.clearUserInfoCache(loginUserInfo.id!!)
    }

    /**
     * 스크랩 목록 조회 (페이징)
     *
     * @param keyword
     * @param pageable
     * @return
     */
    fun findUserScrapList(keyword: String?, pageable: Pageable): Page<UserScrapDto> {
        val loginUserId = UserInfoHelper.getLoginUserInfo()?.id

        val qTbUserScrap = QTbUserScrap.tbUserScrap
        val qTbPostContent = QTbPostContent.tbPostContent

        val joinCondition = qTbUserScrap.id.postId.eq(qTbPostContent.id)
            .and(qTbUserScrap.id.userId.eq(loginUserId))

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContent.enabled.eq(true))
        whereCondition.and(qTbPostContent.openType.eq("public"))
        if (!keyword.isNullOrBlank()) {
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
     * @return
     */
    fun findUserAlarm(): UserAlarmDto {
        val loginUserId = UserInfoHelper.getLoginUserInfo()?.id

        val tbUser = tbUserRepository.findById(loginUserId!!)

        return if (tbUser.isPresent) {
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
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateUserAlarm(dto: UserAlarmRequestDto) {
        // 알림설정 수정
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val userId = userInfo?.id!!

        val tbUser = tbUserRepository.findById(userInfo?.id!!)
        val entity: TbUser
        if (tbUser.isPresent) {
            entity = tbUser.get().apply {
                this.noticeAlarmEnabled = dto.noticeAlarmEnabled
                this.qnaAnswerAlarmEnabled = dto.qnaAnswerAlarmEnabled
                this.commentAlarmEnabled = dto.commentAlarmEnabled
                this.newPostAlarmEnabled = dto.newPostAlarmEnabled
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = userInfo.id
                this.modifiedUserNm = userInfo.name
            }
        } else {
            entity = TbUser().apply {
                this.userId = userInfo.id!!
                this.noticeAlarmEnabled = dto.noticeAlarmEnabled
                this.qnaAnswerAlarmEnabled = dto.qnaAnswerAlarmEnabled
                this.commentAlarmEnabled = dto.commentAlarmEnabled
                this.newPostAlarmEnabled = dto.newPostAlarmEnabled
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
            }
        }
        tbUserRepository.save(entity)

        cacheEvictor.clearUserInfoCache(userInfo.id!!)
    }

    /**
     * 이력 목록 조회
     *
     * @param typeCode
     * @param pageable
     * @return
     */
    fun findUserHistory(typeCode: String?, pageable: Pageable): Page<TbUserHistoryDto> {
        val qTbUserHistory = QTbUserHistory.tbUserHistory

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbUserHistory.userId.eq(UserInfoHelper.getLoginUserInfo()?.id))
        if (!typeCode.isNullOrBlank()) {
            whereCondition.and(qTbUserHistory.actionType.eq(typeCode))
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
     * @param openType
     * @param keyword
     * @param pageable
     */
    fun findUserPost(openType: String?, keyword: String?, pageable: Pageable): Page<UserPostDto> {
        val loginUserId = UserInfoHelper.getLoginUserInfo()?.id
        val qTbPostContent = QTbPostContent.tbPostContent
        val qTbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbPostContent.enabled.eq(true))
        whereCondition.and(qTbPostContent.postType.eq("post"))
        whereCondition.and(qTbPostContent.createdUserId.eq(loginUserId))
        if (!openType.isNullOrBlank()) {
            whereCondition.and(qTbPostContent.openType.eq(openType))
        }
        if (!keyword.isNullOrBlank()) {
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
}