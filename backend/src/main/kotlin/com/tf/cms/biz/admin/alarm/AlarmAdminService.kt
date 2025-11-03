package com.tf.cms.biz.admin.alarm

import com.tf.cms.biz.common.ms.MsTeamsSender
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbMsTeamsSendContentRepository
import com.tf.cms.common.jpa.repository.TbMsTeamsSendTargetRepository
import com.tf.cms.common.model.AlarmSendStatus
import com.tf.cms.common.model.AlarmSendTarget
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.concurrent.thread

@Service
class AlarmAdminService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val msTeamsSender: MsTeamsSender,
        private val tbMsTeamsSendContentRepository: TbMsTeamsSendContentRepository,
        private val tbMsTeamsSendTargetRepository: TbMsTeamsSendTargetRepository
) {
    private val logger = logger()

    /**
     * 알림 목록조회
     *
     * @param pageable
     * @return
     */
    fun findAlarmSendContentList(pageable: Pageable): Page<AlarmSendContentDto> {
        val tbMsTeamsSendContent = QTbMsTeamsSendContent.tbMsTeamsSendContent
        val tbTarget = QTbMsTeamsSendTarget.tbMsTeamsSendTarget

        val subQuery1 = JPAExpressions.select(tbTarget.count().intValue()).from(tbTarget)
                .where(tbTarget.sendId.eq(tbMsTeamsSendContent.id).and(tbTarget.targetType.eq(AlarmSendTarget.TEAM.name)))
        val subQuery2 = JPAExpressions.select(tbTarget.count().intValue()).from(tbTarget)
                .where(tbTarget.sendId.eq(tbMsTeamsSendContent.id).and(tbTarget.targetType.eq(AlarmSendTarget.USER.name)))

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                AlarmSendContentDto::class.java,
                                tbMsTeamsSendContent.id,
                                tbMsTeamsSendContent.sendTitle,
                                tbMsTeamsSendContent.useScheduleSend,
                                tbMsTeamsSendContent.scheduleSendAt,
                                tbMsTeamsSendContent.sentAt,
                                tbMsTeamsSendContent.notyStr,
                                tbMsTeamsSendContent.createdAt,
                                tbMsTeamsSendContent.createdUserId,
                                tbMsTeamsSendContent.createdUserNm,
                                tbMsTeamsSendContent.modifiedAt,
                                tbMsTeamsSendContent.modifiedUserId,
                                tbMsTeamsSendContent.modifiedUserNm,
                                ExpressionUtils.`as`(subQuery1, "targetTeamCount"),
                                ExpressionUtils.`as`(subQuery2, "targetUserCount")
                        )
                )
                .from(tbMsTeamsSendContent)
                .orderBy(tbMsTeamsSendContent.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map {
                    it.apply {
                        this.sendStatus = if(it.sentAt == null) {
                            AlarmSendStatus.WAIT.label
                        } else {
                            AlarmSendStatus.COMPLETE.label
                        }
                    }
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val resultCount = jPAQueryFactory
                .select(tbMsTeamsSendContent.count())
                .from(tbMsTeamsSendContent)
                .fetchFirst()
        logger.debug { "=== resultCount : $resultCount" }

        return PageImpl(resultData, pageable, resultCount)
    }

    /**
     * 알림 상세조회
     *
     * @param sendId
     * @return
     */
    fun findAlarmSendContent(sendId: Int): AlarmSendContentDetailDto {
        val contents = tbMsTeamsSendContentRepository.findById(sendId).orElseThrow {
            throw BizException("해당 내역이 존재하지 않습니다.")
        }

        val tbMsTeamsSendTarget = QTbMsTeamsSendTarget.tbMsTeamsSendTarget
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbUserMaster = QTbUserMaster.tbUserMaster

        val targetTeamInfoList = jPAQueryFactory
                .select(
                        Projections.fields(
                            AlarmTargetTeamInfo::class.java,
                            tbMsTeamsSendTarget.targetKey.`as`("orgId"),
                            tbHrCodeMaster.codeNm.`as`("orgNm"),
                           tbHrCodeMaster.id.fullCode.`as`("orgKey")
                        )
                )
                .from(tbMsTeamsSendTarget)
                .leftJoin(tbHrCodeMaster).on(
                tbMsTeamsSendTarget.targetKey.eq(tbHrCodeMaster.id.fullCode)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .where(
                        tbMsTeamsSendTarget.targetType.eq(AlarmSendTarget.TEAM.name)
                                .and(tbMsTeamsSendTarget.sendId.eq(sendId))
                )
                .fetch()
        val targetUserInfoList = jPAQueryFactory
                .select(
                        Projections.fields(
                            AlarmTargetUserInfo::class.java,
                            tbMsTeamsSendTarget.targetKey.`as`("userId"),
                            tbUserMaster.userNm,
                            tbUserMaster.orgId,
                            tbUserMaster.orgNm
                        )
                )
                .from(tbMsTeamsSendTarget)
                .leftJoin(tbUserMaster).on(tbMsTeamsSendTarget.targetKey.eq(tbUserMaster.userId))
                .where(
                        tbMsTeamsSendTarget.targetType.eq(AlarmSendTarget.USER.name)
                                .and(tbMsTeamsSendTarget.sendId.eq(sendId))
                )
                .fetch()

        return AlarmSendContentDetailDto().apply {
            this.id = contents.id
            this.sendTitle = contents.sendTitle
            this.useScheduleSend = contents.useScheduleSend
            this.scheduleSendAt = contents.scheduleSendAt
            this.sentAt = contents.sentAt
            this.notyStr = contents.notyStr
            this.createdAt = contents.createdAt
            this.createdUserId = contents.createdUserId
            this.createdUserNm = contents.createdUserNm
            this.modifiedAt = contents.modifiedAt
            this.modifiedUserId = contents.modifiedUserId
            this.modifiedUserNm = contents.modifiedUserNm
            this.sendStatus = if(contents.sentAt == null) AlarmSendStatus.WAIT.label else AlarmSendStatus.COMPLETE.label
            this.targetTeamList = targetTeamInfoList
            this.targetUserList = targetUserInfoList
        }
    }

    /**
     * 알림 등록
     *
     * @param input
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertAlarmSendContent(input: AlarmSendContentInput) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        // 본문
        val contents = TbMsTeamsSendContent().apply {
            this.sendTitle = input.sendTitle
            this.useScheduleSend = input.useScheduleSend
            this.scheduleSendAt = input.validScheduleSendAt()
            this.notyStr = input.notyStr
            this.webLinkUrl = input.webLinkUrl
            this.mobileLinkUrl = input.mobileLinkUrl
            this.createdAt = LocalDateTime.now()
            this.createdUserId = userInfo?.id
            this.createdUserNm = userInfo?.name
        }
        val contentsResult = tbMsTeamsSendContentRepository.save(contents)
        // 타겟
        val targets: MutableList<TbMsTeamsSendTarget> = mutableListOf()
        if(!input.teamIdList.isNullOrEmpty()) {
            input.teamIdList
                    ?.map {
                        TbMsTeamsSendTarget().apply {
                            this.sendId = contentsResult.id
                            this.targetType = AlarmSendTarget.TEAM.name
                            this.targetKey = it.orgId
                            this.createdAt = LocalDateTime.now()
                            this.createdUserId = userInfo?.id
                            this.createdUserNm = userInfo?.name
                        }
                    }
                    .apply {
                        targets.addAll(this!!)
                    }
        }
        if(!input.userIdList.isNullOrEmpty()) {
            input.userIdList
                    ?.map {
                        TbMsTeamsSendTarget().apply {
                            this.sendId = contentsResult.id
                            this.targetType = AlarmSendTarget.USER.name
                            this.targetKey = it
                            this.createdAt = LocalDateTime.now()
                            this.createdUserId = userInfo?.id
                            this.createdUserNm = userInfo?.name
                        }
                    }
                    .apply {
                        targets.addAll(this!!)
                    }
        }
        logger.debug { "=== targets : $targets" }

        if(targets.isNotEmpty()) {
            tbMsTeamsSendTargetRepository.saveAll(targets)
        }

        // 알림 발송
        if(contentsResult.useScheduleSend == false) {
            sendAlarmMessage(contentsResult.id!!)
        }
    }

    /**
     * 알림 수정
     *
     * @param sendId
     * @param input
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateAlarmSendContent(sendId: Int, input: AlarmSendContentInput) {
        val contents = tbMsTeamsSendContentRepository.findById(sendId).orElseThrow {
            throw BizException("해당 내역이 존재하지 않습니다.")
        }
        if(contents.sentAt != null) {
            throw BizException("이미 발송된 알림입니다.")
        }
        val userInfo = UserInfoHelper.getLoginUserInfo()
        // 본문
        contents.apply {
            this.sendTitle = input.sendTitle
            this.useScheduleSend = input.useScheduleSend
            this.scheduleSendAt = input.validScheduleSendAt()
            this.notyStr = input.notyStr
            this.webLinkUrl = input.webLinkUrl
            this.mobileLinkUrl = input.mobileLinkUrl
            this.modifiedAt = LocalDateTime.now()
            this.modifiedUserId = userInfo?.id
            this.modifiedUserNm = userInfo?.name
        }
        tbMsTeamsSendContentRepository.save(contents)
        // 타겟
        tbMsTeamsSendTargetRepository.deleteBySendId(sendId)
        val targets: MutableList<TbMsTeamsSendTarget> = mutableListOf()
        if(!input.teamIdList.isNullOrEmpty()) {
            input.teamIdList
                    ?.map {
                        TbMsTeamsSendTarget().apply {
                            this.sendId = sendId
                            this.targetType = AlarmSendTarget.TEAM.name
                            this.targetKey = it.orgId
                            this.createdAt = LocalDateTime.now()
                            this.createdUserId = userInfo?.id
                            this.createdUserNm = userInfo?.name
                        }
                    }
                    .apply {
                        targets.addAll(this!!)
                    }
        }
        if(!input.userIdList.isNullOrEmpty()) {
            input.userIdList
                    ?.map {
                        TbMsTeamsSendTarget().apply {
                            this.sendId = sendId
                            this.targetType = AlarmSendTarget.USER.name
                            this.targetKey = it
                            this.createdAt = LocalDateTime.now()
                            this.createdUserId = userInfo?.id
                            this.createdUserNm = userInfo?.name
                        }
                    }
                    .apply {
                        targets.addAll(this!!)
                    }
        }
        logger.debug { "=== targets : $targets" }

        if(targets.isNotEmpty()) {
            tbMsTeamsSendTargetRepository.saveAll(targets)
        }

        // 알림 발송
        if(contents.useScheduleSend == false) {
            sendAlarmMessage(sendId)
        }
    }

    /**
     * 알림 삭제
     *
     * @param sendId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteAlarmSendContent(sendId: Int) {
        tbMsTeamsSendContentRepository.deleteById(sendId)
        tbMsTeamsSendTargetRepository.deleteBySendId(sendId)
    }

    /**
     * 타겟의 userId를 조회 후 메세지 발송
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun sendAlarmMessage(sendId: Int) {
        val contents = tbMsTeamsSendContentRepository.findById(sendId).get()

        val tbMsTeamsSendTarget = QTbMsTeamsSendTarget.tbMsTeamsSendTarget
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbUserMaster = QTbUserMaster.tbUserMaster

        val userIdList = mutableListOf<String>()
        // Team에 속한 사용자
        jPAQueryFactory
                .select(tbUserMaster.loginId)
                .distinct()
                .from(tbMsTeamsSendTarget)
                .innerJoin(tbHrCodeMaster).on(tbMsTeamsSendTarget.targetKey.eq(tbHrCodeMaster.id.fullCode)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG")))
                .innerJoin(tbUserMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId))
                .where(
                        tbMsTeamsSendTarget.targetType.eq(AlarmSendTarget.TEAM.name)
                                .and(tbMsTeamsSendTarget.sendId.eq(sendId))
                )
                .fetch()
                .let {
                    userIdList.addAll(it)
                }
        logger.debug { "=== userIdList - Team : $userIdList" }
        // 개인 지정 사용자
        jPAQueryFactory
                .select(tbUserMaster.loginId)
                .from(tbMsTeamsSendTarget)
                .innerJoin(tbUserMaster).on(tbMsTeamsSendTarget.targetKey.eq(tbUserMaster.userId))
                .where(
                        tbMsTeamsSendTarget.targetType.eq(AlarmSendTarget.USER.name)
                                .and(tbMsTeamsSendTarget.sendId.eq(sendId))
                )
                .fetch()
                .let {
                    userIdList.addAll(it)
                }
        logger.debug { "=== userIdList - User : $userIdList" }

        if(userIdList.isEmpty()) {
            throw BizException("유효한 알림 대상이 존재하지 않습니다.")
        }

        // 알림 발송
        thread {
            userIdList
                    .distinct()
                    .forEach {
                        msTeamsSender.sendMsTeamsExecute(it, contents.notyStr!!, contents.webLinkUrl)
                    }
        }
        // 알림 발송시간 저장
        contents.apply {
            this.sentAt = LocalDateTime.now()
        }
        tbMsTeamsSendContentRepository.save(contents)
    }

    /**
     * 예약 메세지 확인 스케쥴러
     */
    @Scheduled(cron = "0 0/10 * * * ?")
    fun scheduledSendAlarmMessage() {
        val tbMsTeamsSendContent = QTbMsTeamsSendContent.tbMsTeamsSendContent

        val current = LocalDateTime.now()
        val baseMinute = current.minute / 10 * 10
        val baseSendTime = current.withMinute(baseMinute).withSecond(0).withNano(0)
        logger.info { "=== scheduledSendAlarmMessage Start ($baseSendTime)" }

        val scheduledSendIdList = jPAQueryFactory
                .select(tbMsTeamsSendContent.id)
                .from(tbMsTeamsSendContent)
                .where(
                        tbMsTeamsSendContent.useScheduleSend.eq(true)
                                .and(tbMsTeamsSendContent.sentAt.isNull)
                                .and(tbMsTeamsSendContent.scheduleSendAt.eq(baseSendTime))
                )
                .fetch()
        logger.debug { "=== [scheduledSendAlarmMessage] sendIdList : $scheduledSendIdList" }
        // 예약된 알림 전송
        scheduledSendIdList.forEach {
            try {
                sendAlarmMessage(it)
            } catch (e: Exception) {
                logger.error("=== [scheduledSendAlarmMessage] Exception sendId ($it) : ", e)
            }
        }
    }
}