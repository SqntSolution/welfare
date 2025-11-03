package com.tf.cms.biz.common.ms

import com.tf.cms.common.utils.logger
import org.springframework.context.ApplicationEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionalEventListener

enum class MsTeamsEventType{
    NoticeRegistered,  // 관리자(마스터, 운영자)가 공지사항을 등록했을 때
    QnaQuestionRegistered, // 사용자가 Q&A에 질문을 등록했을 때
    QnaResponseRegistered, // 관리자(마스터, 운영자)가 Q&A에 답변을 등록했을 때
    NewPostRegistered,  // 사용자가 구독한 카테고리에 신규 Post가 등록되었을 때
    CommentOnComment,  // 사용자가 작성한 댓글에 다른 사용자의 댓글이 등록되었을 때
}

class MsTeamsEvent(val type:MsTeamsEventType, val id: Int) : ApplicationEvent("teams") {
}

/**
 * Teams에 알림을 발송하기 위한 Event 발송/처리.
 * (호출 예시)
 * msTeamsEventBroker.publishEvent(MsTeamsEventType.NoticeRegistered , 123)
 */
@Component
class MsTeamsEventBroker(
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val msTeamsProcessor: MsTeamsProcessor,
) {
    private val logger = logger()

    fun publishEvent(type: MsTeamsEventType, id: Int) {
        applicationEventPublisher.publishEvent(MsTeamsEvent(type, id))
    }

    @Async
    @TransactionalEventListener
    fun onEventReceived(e: MsTeamsEvent) {
        logger.info { "=== TeamsEvent 받음 (${e.type}) (${e.id}" }
        when(e.type){
            MsTeamsEventType.NoticeRegistered -> msTeamsProcessor.processOnNoticeRegistered(e.id)
            MsTeamsEventType.QnaQuestionRegistered -> msTeamsProcessor.processOnQnaQuestionRegistered(e.id)
            MsTeamsEventType.QnaResponseRegistered -> msTeamsProcessor.processOnQnaResponseRegistered(e.id)
            MsTeamsEventType.NewPostRegistered -> msTeamsProcessor.processOnNewPostRegistered(e.id)
            MsTeamsEventType.CommentOnComment -> msTeamsProcessor.processOnCommentOnComment(e.id)
        }
    }
}