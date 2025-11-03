package com.tf.cms.biz.common.ms

import com.tf.cms.common.jpa.entity.TbMsTeamsSendHistory
import com.tf.cms.common.jpa.repository.TbMsTeamsSendHistoryRepository
import com.tf.cms.common.utils.HttpHelper
import com.tf.cms.common.utils.logger
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.support.AbstractApplicationContext
import org.springframework.stereotype.Component

/**
 * Teams로 메시지 전송
 */
@Component
class MsTeamsSender(
        @Value("\${ms.teams.send-url}")
        private val TEAMS_SEND_URL: String,
        private val httpHelper: HttpHelper,
        private val tbMsTeamsSendHistoryRepository: TbMsTeamsSendHistoryRepository,
        private val applicationContext: AbstractApplicationContext,
        private val objectMapper: ObjectMapper,
) {
    private val logger = logger()

    fun meFromBean(): MsTeamsSender {
        return applicationContext.getBean(MsTeamsSender::class.java)
    }

    /**
     * Send ms-teams execute
     * 테스트 계정 : sunmin.kim (김선민), jhan (안지훈)
     *
     * @param receiverId
     * @param contents
     */
    fun sendMsTeamsExecute(receiverId: String, contents: String, linkUrl: String?) {
        // 알림 내용
//        val replaceContents = contents.replace("\n".toRegex(), "<br>")
        val replaceContents = contents.replace("[<>]".toRegex(), "").replace("\n".toRegex(), "<br>")
        logger.debug { "=== [sendMsTeamsExecute] params: $receiverId, $replaceContents" }

        // TEAMS 전송할 값 설정
        val sendData = TeamsNotiData().apply {
            this.NOTITYPE = "others"                        // 알림구분(approval/mail/board/default/others 등)
            this.USERID = receiverId                        // 수신자 아이디
            this.SENDER = "INSIGHT"                         // 알림 화면구성을 위해 제목을 발신자 항목에 넣는다.
            this.NOTYSTR = replaceContents                  // 알림내용
            this.POSTDATE = LocalDateTime.now().toString()  // 알림시간
            this.WEBLINKURL = linkUrl                       // 알림내용 팝업 웹URL
            this.MOBILELINKURL = linkUrl                    // 알림내용 팝업 모바일URL
        }
        logger.info { "=== [sendMsTeamsExecute] sendData: $sendData" }

        try {
            // 요청 본문 설정
            var jsonResult: TeamsNotiResult? = null
            val jsonBody = objectMapper.writeValueAsString(sendData)
            logger.debug { "=== [sendMsTeamsExecute] jsonBody: $jsonBody" }

            // 요청 실행
            logger.debug { "=== [sendMsTeamsExecute] URL Sending ===" }
            val responseBody = httpHelper.postJsonHttpRequest(TEAMS_SEND_URL, jsonBody)
            logger.info { "=== [sendMsTeamsExecute] responseBody: $responseBody" }

            // 응답 확인
            if (!responseBody.body.isNullOrBlank()) {
                // JSON 응답 본문을 객체로 변환
                jsonResult = responseBody.body.let {
                    objectMapper.readValue(it, TeamsNotiResult::class.java)
                }
                logger.debug { "=== [sendMsTeamsExecute] jsonResult: $jsonResult" }
            }

            // 이력 저장
            meFromBean().saveSendHistory(sendData, jsonResult)

        } catch (e: Exception) {
            logger.error("=== [sendMsTeamsExecute] Client Protocol Exception : (receiverId:$receiverId) (contents:$contents)", e)
            // 이력 저장
            val errorBody = TeamsNotiResult().apply {
                this.RESULT = "ERROR"
                this.REASON = if(!e.message.isNullOrBlank() && e.message?.length!! > 200) e.message!!.substring(0, 200) else e.message
            }
            meFromBean().saveSendHistory(sendData, errorBody)
        }
    }

    /**
     * MS-Teams 발송 이력 등록
     *
     * @param data
     * @param result
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveSendHistory(data: TeamsNotiData, result: TeamsNotiResult?) {
        logger.debug { "=== [saveSendHistory] $data, $result" }
        val tbMsTeamsSendHistory = TbMsTeamsSendHistory().apply {
            this.notiType = data.NOTITYPE
            this.userId = data.USERID
            this.sender = data.SENDER
            this.notyStr = data.NOTYSTR
            this.postDate = data.POSTDATE
            this.webLinkUrl = data.WEBLINKURL
            this.mobileLinkUrl = data.MOBILELINKURL
            this.sendStatus = result?.RESULT
            this.errorMsg = result?.REASON
            this.createdAt = LocalDateTime.now()
        }
        tbMsTeamsSendHistoryRepository.save(tbMsTeamsSendHistory)
    }
}