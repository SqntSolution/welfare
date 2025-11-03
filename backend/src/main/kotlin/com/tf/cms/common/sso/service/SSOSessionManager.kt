package com.tf.cms.common.sso.service

import com.tf.cms.common.sso.cm.ApiResultError
import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.utils.HttpHelper
import com.tf.cms.common.utils.logger
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import java.util.concurrent.ConcurrentHashMap

/**
 * SSO Sesstion을 관리한다.
 *
 * @author mkpark (origin: Hunwoo Park)
 */
@Component
class SSOSessionManager(
        @Value("\${env}") private val env: String? = null,
        // 배치 실행여부
        @Value("\${sso.agent.batch.session.check.enable}") private val isRunCheckBatch: Boolean = false,
        // SSO 중앙서버 SSO 세션체크 API
        @Value("\${sso.server.check-sso-url}") private val COSMAX_SSO_CHECK_URI: String,
        // Agent 정보
        @Value("\${sso.agent.site-code}") private val siteCode: String,
        @Value("\${sso.agent.site-password}") private val sitePassword: String,
        // Helper
        private val httpHelper: HttpHelper,
        private val objectMapper: ObjectMapper,
) {
    private val logger = logger()

    // 세션 아이디를 키로, HttpSession 객체를 값으로 가지는 맵
    private val sessionMap: MutableMap<String, HttpSession> = ConcurrentHashMap()

    fun addSession(sessionId: String, session: HttpSession) {
        sessionMap[sessionId] = session
    }

    fun getSession(sessionId: String): HttpSession? {
        return sessionMap[sessionId]
    }

    fun removeSession(sessionId: String) {
        sessionMap.remove(sessionId)
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    internal data class SSOTokenCheck(
            var siteCode: String?,
            var ssoTokens: List<SSOTokenInfo>
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    internal data class SSOTokenInfo(
            var ssoTokenRefId: String? = null,
            var ssoToken: String? = null,
            var ip: String? = null,
            var validYn: String? = null
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    internal data class ResSSOTokenCheck(
            var resultCode: String = "9999",
            var resultFailMessage: String = "Error",
            var data: List<SSOTokenInfo>? = null
    ) {
        override fun toString(): String {
            return "ResSSOTokenCheck [resultCode=$resultCode, resultFailMessage=$resultFailMessage, data=$data]"
        }
    }
    //{resultCode=0000, resultFailMessage=OK, data=[{sso_token=A72E1FA2D70177CB366B337361170E4C, ip=0:0:0:0:0:0:0:1, valid_yn=Y}]}

    /**
     * 주기적으로 SSO session을 체크하고 invalid 한경우 삭제
     */
//    @Scheduled(fixedDelay = 10-20 * * ?) /* 10~21시 매 30초 */
//    @Scheduled(fixedRate =  30000) /* 매 30초 마다 */
//    @Scheduled(cron = "0 0/1 10-18 * * ?") /* 10~18시 매 1분마다 */
    @Scheduled(fixedRate = 300000) /* 매 5분 마다 */
    fun checkSsoLoginSession() {
        if(!isRunCheckBatch || ("local" == env || "dev" == env)) return
        logger.debug { "=== [checkSsoLoginSession] Start" }

        //파라미터 작성
        val checkList: MutableList<SSOTokenInfo> = ArrayList()
        val invalidSessionList: MutableList<String?> = ArrayList()

        for (ssoTokenRefId in sessionMap.keys) {
            val checkSession = sessionMap[ssoTokenRefId]
            try {
                val ssoToken = checkSession?.getAttribute(SSOConst.SKEY_SSO_TOKEN) as? String
                val accessIp = checkSession?.getAttribute(SSOConst.SKEY_SSO_ACCESS_IP) as? String
                // ssoToken 이 없는 경우는 잘못 들어온 경우
                if (!StringUtils.hasText(ssoToken)) {
                    logger.info { "=== [checkSsoLoginSession] Session $ssoTokenRefId is missing ssoToken" }
                    sessionMap.remove(ssoTokenRefId)
                    continue
                }

                checkList.add(SSOTokenInfo(ssoTokenRefId, ssoToken, accessIp, "N"))
            } catch (e: IllegalStateException) {
                // 이미 무효화 된 경우
                invalidSessionList.add(ssoTokenRefId)
            }
        }

        // 이미 무효화 된 세션 제거
        for (invalidSessionId in invalidSessionList) {
            sessionMap.remove(invalidSessionId)
        }

        if (checkList.isEmpty()) {
            logger.info { "=== [checkSsoLoginSession] checkList is empty. Don't need check." }
            return
        }

        // SSO Api call
        val checkParam = SSOTokenCheck(siteCode, checkList)
        val apiUrl = COSMAX_SSO_CHECK_URI
        logger.debug { "=== [checkSsoLoginSession] Request Api: $apiUrl, $checkParam" }

        var apiRes: ResSSOTokenCheck? = null
        try {
            // 요청 본문 설정
            val jsonBody = objectMapper.writeValueAsString(checkParam)
            logger.debug { "=== [checkSsoLoginSession] jsonBody: $jsonBody" }

            // 요청 실행
            val responseBody: String? = httpHelper.postJsonHttpRequest2(apiUrl, jsonBody)

            // 응답 확인
            if (!responseBody.isNullOrEmpty()) {
                // JSON 응답 본문을 객체로 변환
                apiRes = responseBody.let {
                    objectMapper.readValue(it, ResSSOTokenCheck::class.java)
                }
                logger.debug { "=== [checkSsoLoginSession] apiRes: $apiRes" }
            }

        } catch (e: Exception) {
            logger.error { "=== [checkSsoLoginSession] Client Protocol Exception : $e" }
            // 예외 처리 로직 (생략 가능)
            return
        }
        logger.debug { "=== [checkSsoLoginSession] Request Api: $apiUrl, $apiRes" }

        // 오류!!
        if (ApiResultError.NO_ERROR.code != apiRes!!.resultCode) {
            return
        }

        // Invalid sso token 제거
        var removeCnt = 0
        for (sti in apiRes.data!!) {
            logger.debug { "=== [checkSsoLoginSession] sti: $sti" }

            if ("Y" == sti.validYn) {
                continue  // Valid session, skip
            }
            removeCnt++

            // 유효하지 않은 SSO Login invalidate 시키기
            val removeSession = sessionMap.remove(sti.ssoTokenRefId)
            if (null != removeSession) {
                logger.debug { "=== [checkSsoLoginSession] invalidate session : ${removeSession.id}" }
                try {
                    removeSession.invalidate()
                } catch (e: IllegalStateException) {
                    // 이미 무효화 된 경우
                    logger.debug { "=== [checkSsoLoginSession] ${e.message}" }
                }
            }
        }

        logger.info{ "=== [checkSsoLoginSession] Done checkSsoLoginSession. $removeCnt SSO sessions removed." }
    }
}