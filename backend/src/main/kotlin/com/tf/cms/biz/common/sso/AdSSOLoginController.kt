package com.tf.cms.biz.common.sso

import com.tf.cms.biz.common.ThumbnailRetriever
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.sso.cm.SSOLoginError
import com.tf.cms.common.sso.vo.SSOResponseDTO
import com.tf.cms.common.sso.web.AbstractAdSSOLoginController
import com.tf.cms.common.utils.logger
import jakarta.annotation.PostConstruct
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import java.io.IOException
import java.security.NoSuchAlgorithmException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.servlet.mvc.support.RedirectAttributes


@Controller
@RequestMapping("/api/v1/sso")
class AdSSOLoginController(
        // SSO 중앙서버 Login, Logout URI
    @Value("\${sso.server.login-url}") override val COSMAX_SSO_AD_LOGIN_URI: String,
    @Value("\${sso.server.logout-url}") override val COSMAX_SSO_AD_LOGOUT_URI: String,
        // Agent 설정
    @Value("\${sso.agent.base.url}") override val AGENT_BASE_URL: String,
    @Value("\${sso.agent.site-code}") override val SITE_CODE: String,
    @Value("\${sso.agent.site-password}") override val SITE_PASSWORD: String,
        // RSA 키 경로
    @Value("\${sso.server.public-key.path}") override val PUBLIC_KEY_PATH: String,
    @Value("\${sso.agent.private-key.path}") override val AGENT_PRIVATE_KEY_PATH: String,
        // AD Login callback Uri
    override val CALLBACK_SUCCESS_URI: String = "/api/v1/sso/callback/success",
    override val CALLBACK_FAIL_URI: String = "/api/v1/sso/callback/fail",
        // service
    private val adSSOLoginService: AdSSOLoginService,
    private val userHistoryService: UserHistoryService,
    private val thumbnailRetriever: ThumbnailRetriever,
) : AbstractAdSSOLoginController(
        COSMAX_SSO_AD_LOGIN_URI = COSMAX_SSO_AD_LOGIN_URI,
        COSMAX_SSO_AD_LOGOUT_URI = COSMAX_SSO_AD_LOGOUT_URI,
        PUBLIC_KEY_PATH = PUBLIC_KEY_PATH,
        AGENT_BASE_URL = AGENT_BASE_URL,
        SITE_CODE = SITE_CODE,
        SITE_PASSWORD = SITE_PASSWORD,
        AGENT_PRIVATE_KEY_PATH = AGENT_PRIVATE_KEY_PATH,
        CALLBACK_SUCCESS_URI = CALLBACK_SUCCESS_URI,
        CALLBACK_FAIL_URI = CALLBACK_FAIL_URI
) {
    companion object {
        private const val URI_LOGIN_FORM = "/api/v1/sso/error-page" // 로그인 폼 페이지 URL (로그인 실패 시)
        private const val REDIRECT_LOGIN_FORM = "redirect:$URI_LOGIN_FORM"
        private const val DEFAULT_LOGINED_PAGE = "/" // 메인페이지 URL
    }
    private val logger = logger()

    /**
     * 부팅시 Properties 를 로드하여 초기화
     */
    @PostConstruct
    @Throws(NoSuchAlgorithmException::class, IOException::class)
    override fun init() {
        logger.info{ "=== AdSSOLoginController is started.." }
        super.init()
    }

    /**
     * [필수설정] AD 로그인 요청
     *
     * @param request
     * @param response
     * @param redirect
     * @return
     */
    @RequestMapping("/ad-sso/login")
    fun adSSOLogin(request: HttpServletRequest, response: HttpServletResponse, redirect: RedirectAttributes): String {
        val returnUri: String = request.cookies?.find { it.name == "originPath" }?.value
                ?: DEFAULT_LOGINED_PAGE
        val prompt: String = ""
        logger.info{ "=== [adSSOLogin] returnUri : $returnUri" }

        return try {
            // SSO 중앙서버로 SSO 로그인 요청 : redirect 방식으로 작동
            sendRedirectAdSSOLogin(request, response, redirect, returnUri, prompt, null)
        } catch (e: Exception) {
            logger.error( "=== [adSSOLogin] error : $e" , e)
            REDIRECT_LOGIN_FORM
        }
    }

    /**
     * [필수설정] SSO 로그인 성공 URL
     *
     * @param model
     * @param request
     * @return
     */
    @RequestMapping("/callback/success")
    @Throws(Exception::class)
    fun callbackSuccess(
            @RequestParam paramMap: HashMap<String?, Any?>?,
            model: Model?, request: HttpServletRequest, response: HttpServletResponse?, redirect: RedirectAttributes?,
            @RequestParam(value = "EncodeData", defaultValue = "") encodeData: String?,
    ): String {
        logger.debug { "=== [callbackSuccess] success encodeData : $encodeData" }
        //**** 주의사항: SSO 결과 파라미터 수신 처리 전까지 session.invalidate(); 처리 하지 말것
        val session: HttpSession = request.session

        // 로그인 후 리턴 페이지
        var returnUri = session.getAttribute(SSOConst.SKEY_SSO_REDIRECT_URI)?.toString()
        logger.info { "=== [callbackSuccess] success returnUri : $returnUri" }

        if (returnUri.isNullOrBlank()) {
            returnUri = DEFAULT_LOGINED_PAGE
        }

        // SSO 처리 결과 수신
        var payload: SSOResponseDTO? = null
        payload = try {
            getAdCallbackResponse(encodeData!!)
        } catch (e: Exception) {
            logger.error( "=== [callbackSuccess] ad response decrypt error : $e", e)
            return REDIRECT_LOGIN_FORM
        }
        logger.debug { "=== [callbackSuccess] payload : $payload" }

        // SSO 처리 결과 확인
        if (payload == null || !SSOLoginError.isOk(payload.errorCode!!)) {
            logger.error { "=== [callbackSuccess] ad response error payload : $payload" }
            return REDIRECT_LOGIN_FORM
        }

        // Step1. SSO 로그인 시 session에 payload 값 등록
        // *********************** CON-NAT ***********************
        // *******************************************************
        session.setAttribute(SSOConst.USER_ID, payload.userId)  // 인증된 userId
        session.setAttribute(SSOConst.USER_NAME, payload.userName)  // 인증된 userName
//        val idmsUserNumber = adSSOLoginService.findByUpn(payload.userId!!)
//        logger.info { "=== [callbackSuccess] idmsUserNumber : $idmsUserNumber" }
//        session.setAttribute(SSOConst.USER_NUMBER, idmsUserNumber)  // 인터페이스 인사정보 사번
        // 로그인 이력 저장
        val loginHistory = UserHistoryInput().apply {
            this.postId = 0
//            this.userId = idmsUserNumber
            this.userId = ""
            this.description = "채널에 접속하였습니다."
            this.userName = payload.userName
            this.actionType = UserHistoryActionType.login.code
        }
        userHistoryService.saveUserHistory(loginHistory)
        // *******************************************************
        // *********************** CON-NAT ***********************

        // Step2. 로그인 처리 완료 후 SSO SessionManager에 등록 ([필수] AD SSO session 관련 세팅)
        session.setAttribute(SSOConst.SKEY_SSO_REDIRECT_URI, returnUri) // Session invalidate 하면 returnUri 잃어버리기 때문에 다시 세팅
        session.setAttribute(SSOConst.SKEY_SSO_IS_SSO_LOGIN, "Y") // SSO 로그인
        session.setAttribute(SSOConst.SKEY_SSO_TOKEN, payload.ssoToken)
        session.setAttribute(SSOConst.SKEY_SSO_ACCESS_IP, request.remoteAddr)

        ssoSessionManager.addSession(session.id, session)

//        thumbnailRetriever.processThumbnail(idmsUserNumber)

        // 로그인 완료 후 returnUri 로 redirect 처리 (main 등으로 이동)
        return "redirect:$returnUri"
    }

    /**
     * [필수설정]SSO 로그인 실패 URL
     *
     * @param model
     * @param request
     * @return
     */
    @RequestMapping("/callback/fail")
    fun callbackFail(
            model: Model?, request: HttpServletRequest?, response: HttpServletResponse?, redirect: RedirectAttributes,
            @RequestParam(value = "EncodeData", defaultValue = "") encodeData: String?,
    ): String {
        logger.debug { "=== [callbackFail] fail encodeData : $encodeData" }

        var payload: SSOResponseDTO? = null
        payload = try {
            getAdCallbackResponse(encodeData!!)
        } catch (e: Exception) {
            logger.error("=== [callbackFail] ad response parse error : $e", e)
            return REDIRECT_LOGIN_FORM
        }

        // 실패 처리 (로그인 페이지로 이동)
        if (payload != null) {
            redirect.addFlashAttribute("ssoError", payload.errorCode)
            redirect.addFlashAttribute("ssoErrorMsg", payload.errorMessage)
            logger.warn { "=== [callbackFail] AD Fail error ${payload.errorCode}, ${payload.errorMessage}" }
        }
        return REDIRECT_LOGIN_FORM
        // End [수정 필요 없음, 필요시만 수정 처리]
    }

    /**
     * SSO 오류 페이지
     *
     * @param request
     * @param response
     * @param redirect
     * @param model
     * @param ssoError
     * @param ssoErrorMsg
     * @return
     */
    @RequestMapping("/error-page")
    fun showErrorPage(
            model: Model,
            @ModelAttribute("ssoError") ssoError: String?,
            @ModelAttribute("ssoErrorMsg") ssoErrorMsg: String?
    ): String {
        logger.debug { "=== [showErrorPage] ssoError : $ssoError, $ssoErrorMsg" }
        model.addAttribute("ssoErrorMsg", ssoErrorMsg)
        return "error-page"
    }

//    /**
//     * [필수설정]로그아웃
//     *
//     * @param request
//     * @param res
//     * @param retUri
//     * @param redirect
//     * @return
//     */
//    @RequestMapping("/login/out")
//    fun logout(request: HttpServletRequest, res: HttpServletResponse?,
//               @RequestParam(value = "retUri", defaultValue = "") paramRetUri: String,
//               @RequestParam(value = "mode", defaultValue = "ANL") paramMode: String?,  //@RequestParam(value="mode", defaultValue="ALO" /*AD까지로그아웃*/) String paramMode,
//               redirect: RedirectAttributes): String? {
//
//        //[수정 필요 없음, 필요시만 수정 처리]
//        val session: HttpSession = request.getSession()
//        var retUri = URI_LOGIN_FORM //로그아웃 후 이동할 페이지
//        if (paramRetUri.isBlank()) {
//            retUri = paramRetUri //파라미터로 return uri 넘어오면 우선처리
//        }
//
//        //AD SSO 로그인이 아니면, 바로 로그아웃, 로그인 폼으로 이동
//        if ("Y" != session.getAttribute(SSOConst.SKEY_SSO_IS_SSO_LOGIN) as String) {
//            logger.debug("Not AdSSOLogin. return : {}", retUri)
//
//            // 리턴전 session invalidate 처리 : Note:리턴 전까지는 session 이 유효해야함
//            session.invalidate()
//
//            // 리턴 페이지로 리다이렉트
//            return "redirect:$retUri"
//        }
//
//        //Ad SSO logout 처리
//        logger.debug("request.... sso logout {}", session.getAttribute(SSOConst.SKEY_SSO_TOKEN) as String)
//        var redirectSsoLogout: String? = null
//        try {
//            //SSO 중앙서버에 로그아웃 알림.
//            redirectSsoLogout = sendRedirectAdSSOLogout(request, res, redirect, retUri, null)
//            redirect.addAttribute("mode", paramMode) //로그아웃 모드
//        } catch (e: JsonProcessingException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri" //SSO 메시지 작성 오류시, 기본페이지로 redirect
//        } catch (e: InvalidKeyException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri"
//        } catch (e: NoSuchPaddingException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri"
//        } catch (e: NoSuchAlgorithmException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri"
//        } catch (e: BadPaddingException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri"
//        } catch (e: IllegalBlockSizeException) {
//            logger.error("ad logout request error", e)
//            redirectSsoLogout = "redirect:$retUri"
//        }
//
//        // sso 로그아웃 과 상관없이 세션 무효화
//        // 리턴전 session invalidate 처리 : Note:리턴 전까지는 session 이 유효해야함
//        session.invalidate()
//        return redirectSsoLogout
//        // End [수정 필요 없음, 필요시만 수정 처리]
//    }

}