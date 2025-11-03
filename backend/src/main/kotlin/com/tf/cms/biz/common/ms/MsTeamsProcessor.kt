package com.tf.cms.biz.common.ms

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.sso.AdSSOLoginService
import com.tf.cms.common.jpa.entity.QTbAuthAdminUserMapp
import com.tf.cms.common.jpa.entity.QTbBbsNormal
import com.tf.cms.common.jpa.entity.QTbBbsQna
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.QTbPostComment
import com.tf.cms.common.jpa.entity.QTbPostContent
import com.tf.cms.common.jpa.entity.QTbUser
//import com.tf.cms.common.jpa.entity.QTbUserSubscribe
import com.tf.cms.common.jpa.repository.TbPostContentRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.logger
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import kotlin.jvm.optionals.getOrNull
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationContext
import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.stereotype.Component

/**
 * 5가지 이벤트(MsTeamsEvent)에 따라서, 전송할 contents를 만들고, 대상을 추려서, teams로 전송
 */
@Component
class MsTeamsProcessor(
    @Value("\${ms.teams.link-domain}") private val linkDomain: String,
    private val jpaQueryFactory: JPAQueryFactory,
    private val msTeamsSender:MsTeamsSender,
    private val messageSource: MessageSource,
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val menuIdHolder: MenuIdHolder,
    private val tbPostContentRepository: TbPostContentRepository,
    private val applicationContext: ApplicationContext,
    private val adSSOLoginService: AdSSOLoginService,
) {
    private val logger = logger()

    private fun me(): MsTeamsProcessor {
        return applicationContext.getBean(this::class.java)
    }

    /**
     * 관리자(마스터, 운영자)가 공지사항을 등록했을 때
     */
    fun processOnNoticeRegistered(id: Int){
        val tbUser = QTbUser.tbUser
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbBbsNormal = QTbBbsNormal.tbBbsNormal

        val targetUserList = jpaQueryFactory
                .select(tbUserMaster.loginId)
                .from(tbUser)
                .innerJoin(tbUserMaster).on(tbUserMaster.userId.eq(tbUser.userId))
                .where(tbUser.noticeAlarmEnabled.isTrue)
                .fetch()
        logger.debug { "=== targetUserList : $targetUserList" }
        val title = jpaQueryFactory.select(tbBbsNormal.title).from(tbBbsNormal).where(tbBbsNormal.id.eq(id)).fetchFirst()
        logger.debug { "=== title : $title" }

        val contents = messageSource.getMessage("TEAMS.CS.NOTICE.001.CONTENTS", arrayOf(title), LocaleContextHolder.getLocale())
        val linkUrl = messageSource.getMessage("TEAMS.CS.NOTICE.001.URL", arrayOf(id), LocaleContextHolder.getLocale())
        logger.debug { "=== contents : $contents" }
        logger.debug { "=== linkUrl : $linkUrl" }

        // 메세지 전송
        for(userId in targetUserList) {
            msTeamsSender.sendMsTeamsExecute(userId, contents, linkDomain + linkUrl)
        }
    }

    /**
     * 사용자가 Q&A에 질문을 등록했을 때
     */
    fun processOnQnaQuestionRegistered(id: Int){
        val tbBbsQna = QTbBbsQna.tbBbsQna
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val tbUserMaster = QTbUserMaster.tbUserMaster

        val qnaInfo = jpaQueryFactory.selectFrom(tbBbsQna).where(tbBbsQna.id.eq(id)).fetchFirst()
        logger.debug { "=== qnaInfo : $qnaInfo" }
        val operatorList = jpaQueryFactory
                .select(tbUserMaster.loginId)
                .from(tbAuthAdminUserMapp)
                .innerJoin(tbUserMaster).on(tbUserMaster.userId.eq(tbAuthAdminUserMapp.userId))
                .where(tbAuthAdminUserMapp.adminRole.`in`(TheRole.ROLE_MASTER.code, TheRole.ROLE_OPERATOR.code))
                .fetch()
        logger.debug { "=== operatorList : $operatorList" }

        val contents = messageSource.getMessage("TEAMS.CS.QNA.001.CONTENTS", arrayOf(qnaInfo.createUserNm, qnaInfo.title), LocaleContextHolder.getLocale())
        val linkUrl = messageSource.getMessage("TEAMS.CS.QNA.001.URL", arrayOf(id), LocaleContextHolder.getLocale())
        logger.debug { "=== contents : $contents" }
        logger.debug { "=== linkUrl : $linkUrl" }

        // 메세지 전송
        for(userId in operatorList) {
            msTeamsSender.sendMsTeamsExecute(userId, contents, linkDomain + linkUrl)
        }
    }

    /**
     * 관리자(마스터, 운영자)가 Q&A에 답변을 등록했을 때
     */
    fun processOnQnaResponseRegistered(id: Int){
        val tbBbsQna = QTbBbsQna.tbBbsQna
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbUser = QTbUser.tbUser

        val qnaInfo = jpaQueryFactory
                .select(
                        tbBbsQna.title,
                    tbUserMaster.loginId,
                        tbUser.qnaAnswerAlarmEnabled
                )
                .from(tbBbsQna)
                .innerJoin(tbUserMaster).on(tbUserMaster.userId.eq(tbBbsQna.createUserId))
                .leftJoin(tbUser).on(tbUser.userId.eq(tbUserMaster.userId))
                .where(tbBbsQna.id.eq(id))
                .fetchFirst()
        logger.debug { "=== qnaInfo : $qnaInfo" }

        // 답변 알림 동의한 사용자
        if(qnaInfo.get(tbUser.qnaAnswerAlarmEnabled) == true) {
            val contents = messageSource.getMessage("TEAMS.CS.QNA.002.CONTENTS", arrayOf(qnaInfo.get(tbBbsQna.title)), LocaleContextHolder.getLocale())
            val linkUrl = messageSource.getMessage("TEAMS.CS.QNA.002.URL", arrayOf(id), LocaleContextHolder.getLocale())
            logger.debug { "=== contents : $contents" }
            logger.debug { "=== linkUrl : $linkUrl" }

            // 메세지 전송
            msTeamsSender.sendMsTeamsExecute(qnaInfo.get(tbUserMaster.loginId)!!, contents, linkDomain + linkUrl)
        }
    }

    @Transactional
    fun updatePost_subscribeAlarmSent(postId:Int){
        tbPostContentRepository.findById(postId).getOrNull()?.let {
            it.subscribeAlarmSent = true
            tbPostContentRepository.save(it)
        }
    }

    /**
     * 사용자가 구독한 카테고리에 신규 Post가 등록되었을 때
     */
    fun processOnNewPostRegistered(newPostId: Int){
//        logger.info { "=== post 신규 등록 (postId : $newPostId)" }
//
//        val tbPostContent = QTbPostContent.tbPostContent
//        val tbUserSubscribe = QTbUserSubscribe.tbUserSubscribe
//        val tbUserMaster = QTbUserMaster.tbUserMaster
//
//        val post = jpaQueryFactory
//                .selectFrom(tbPostContent)
//                .where(tbPostContent.id.eq(newPostId))
//                .fetchFirst() ?: throw BizException("=== 해당 Post가 존재하지 않음 ($newPostId)" )
//
//        logger.info { "=== post teams 알람 전송 통과 (postId : $newPostId) (openType : ${post.openType}) (subscribeAlarmSent:${post.subscribeAlarmSent})" }
//        // public이 아니면 통과
//        if(post.openType != "public") {
//            return
//        }
//        // 이미 발송한 알림은 통과
//        if(post.subscribeAlarmSent == true) {
//            return
//        }
//
//        val userIds = jpaQueryFactory
//                .select(
//                        tbUserSubscribe.id.userId,
//                        tbUserMaster.userId
//                )
//                .from(tbUserSubscribe)
//                .innerJoin(tbUserMaster).on(tbUserSubscribe.id.userId.eq(tbUserMaster.empId))
//                .where(tbUserSubscribe.id.menuId.eq(post.menu2Id))
//                .fetch()
//
//        logger.info { "=== post 신규등록으로 teams로 받는 사람수 (${userIds?.size})" }
//        if(userIds.size == 0) {
//            return
//        }
//
//        // db transaction은 최소화
//        me().updatePost_subscribeAlarmSent(newPostId)
//
//        val postMenuInfo = menuIdHolder.getMenuFromId(post.menu2Id)
//        val categoryName = postMenuInfo?.parentNm + " > " + postMenuInfo?.menuNm
//        val contents = messageSource.getMessage("TEAMS.USER.SUBSCRIBE.001.CONTENTS", arrayOf(categoryName, post.title), LocaleContextHolder.getLocale())
//        val linkUrl = messageSource.getMessage("TEAMS.USER.SUBSCRIBE.001.URL", arrayOf(newPostId), LocaleContextHolder.getLocale())
//
//        userIds.filter {
//            // 사용자가 해당 메뉴에 대한 권한이 있는지 체크
//            val userId = it.get(tbUserSubscribe.id.userId)
//            val thisUserInfo = adSSOLoginService.findUserInfoAndAuth(userId!!)
//            val canAccess = roleAndMenuComponent.canAccessToPostByAuthgroups(thisUserInfo.authGroup?:listOf(), newPostId, thisUserInfo).first
//            logger.info { "=== post teams 전송 검토 (userId:$userId) (canAccess:$canAccess) (thisUserInfo:$thisUserInfo)" }
//            canAccess
//        }.forEach {
//            // 메세지 전송
//            logger.info { "=== post 등록 메시지 전송 (userId:${it.get(tbUserMaster.userId)!!}) (postId:$newPostId)" }
//            try {
//                msTeamsSender.sendMsTeamsExecute(it.get(tbUserMaster.userId)!!, contents, linkDomain + linkUrl)
//            }catch (e:Exception){
//                logger.warn("[무시] teamviewer 보내다 에러 (postId:$newPostId)(userId:${it.get(tbUserMaster.userId)!!})")
//            }
//        }

    }

    /**
     * 사용자가 작성한 댓글에 다른 사용자의 댓글이 등록되었을 때
     */
    fun processOnCommentOnComment(newCommentId: Int){
        logger.info { "=== 댓글 등록으로 teams 알림(commentId:$newCommentId)" }
        val tbPostComment = QTbPostComment.tbPostComment
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val newComment =
            (jpaQueryFactory.selectFrom(tbPostComment).where(tbPostComment.id.eq(newCommentId)).fetchFirst()
                ?: throw BizException("댓글이 존재하지 않음 ($newCommentId)"))
        val postId = newComment.postId
        val commentsSeq = newComment.commentsSeq!!
        // 3002 라면 원 comment는 3000 임
        val origCommentSeq = (commentsSeq / 1000) * 1000
        val origUserId = jpaQueryFactory
                .select(tbUserMaster.loginId)
                .from(tbPostComment)
                .innerJoin(tbUserMaster).on(tbPostComment.userId.eq(tbUserMaster.userId))
                .where(tbPostComment.postId.eq(postId))
                .where(tbPostComment.commentsSeq.eq(origCommentSeq))
                .fetchFirst() ?: throw BizException("원 댓글이 존재하지 않음 ($newCommentId")

        val tbPostContent = QTbPostContent.tbPostContent
        val post = (jpaQueryFactory.selectFrom(tbPostContent).where(tbPostContent.id.eq(postId)).fetchFirst()
            ?: throw BizException("해당 Post가 존재하지 않음 ($postId)"))

        val contents = messageSource.getMessage("TEAMS.USER.COMMENT.001.CONTENTS", arrayOf(post.title), LocaleContextHolder.getLocale())
        val linkUrl = messageSource.getMessage("TEAMS.USER.COMMENT.001.URL", arrayOf(post.id), LocaleContextHolder.getLocale())
        // 메세지 전송
        logger.info { "=== post 댓글 메시지 전송 (id:$origUserId) (postId:$post.id)" }
        msTeamsSender.sendMsTeamsExecute(origUserId, contents, linkDomain + linkUrl)


    }
}