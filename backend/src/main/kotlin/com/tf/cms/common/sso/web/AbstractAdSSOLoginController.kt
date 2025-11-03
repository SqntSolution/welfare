package com.tf.cms.common.sso.web

import com.tf.cms.common.model.BizException
import com.tf.cms.common.sso.cm.CipherUtil
import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.sso.service.SSOSessionManager
import com.tf.cms.common.sso.vo.SSORequestDTO
import com.tf.cms.common.sso.vo.SSOResponseDTO
import com.tf.cms.common.utils.logger
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.annotation.PostConstruct
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import java.io.IOException
import java.io.UnsupportedEncodingException
import java.math.BigInteger
import java.security.*
import javax.crypto.BadPaddingException
import javax.crypto.IllegalBlockSizeException
import javax.crypto.NoSuchPaddingException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ResourceLoader
import org.springframework.web.servlet.mvc.support.RedirectAttributes

/**
 *
 * <p>Cosmax SSO 중앙서버 연동
 * Note: properties 는 각 사이트마다 설정이 상이 함으로, 상속 받는곳에서 직접세팅 후 사용
 * </p>
 *
 * @author Hunwoo Park
 *
 */
abstract class AbstractAdSSOLoginController(
        // SSO 중앙서버 Login, Logout URI
        protected open val COSMAX_SSO_AD_LOGIN_URI: String,
        protected open val COSMAX_SSO_AD_LOGOUT_URI: String,
        // Agent 설정
        protected open val AGENT_BASE_URL: String,
        protected open val SITE_CODE: String,
        protected open val SITE_PASSWORD: String,
        // RSA KEY 경로
        protected open val PUBLIC_KEY_PATH: String,
        protected open val AGENT_PRIVATE_KEY_PATH: String,
        // AD Login callback Uri
        protected open val CALLBACK_SUCCESS_URI: String,
        protected open val CALLBACK_FAIL_URI: String,
) {
    private val logger = logger()
    private val objectMapper = ObjectMapper()

    @Autowired
    protected lateinit var ssoSessionManager: SSOSessionManager
    @Autowired
    protected lateinit var resourceLoader: ResourceLoader

    private lateinit var publicKey: PublicKey
    private lateinit var agentPrivateKey: PrivateKey

    @PostConstruct
    @Throws(NoSuchAlgorithmException::class, IOException::class)
    protected open fun init() {
        logger.info{ "AbstractAdSSOLoginController is started.." }

        //공개키 로드
        logger.info{ "Load SSO public key..." }
        val publicRes = resourceLoader.getResource(PUBLIC_KEY_PATH) ?: throw BizException("SSO public key is null")
        publicKey = CipherUtil.getPublicKey(publicRes.inputStream)!!
        logger.info{ "Loaded SSO public key" }

        //개인키 로드
        logger.info{ "Load Agent private key..." }
        val agentPrivateRes = resourceLoader.getResource(AGENT_PRIVATE_KEY_PATH) ?: throw BizException("Agent private key is null")
        agentPrivateKey = CipherUtil.getPrivateKey(agentPrivateRes.inputStream)!!
        logger.info{ "Loaded Agent private key" }
    }

    /**
     * AD SSO 로그인 요청
     * @param request
     * @param response
     * @param redirect
     * @param returnUri
     * @param prompt [null]/none/login
     * @param userData
     * @return
     * @throws JsonProcessingException
     * @throws InvalidKeyException
     * @throws NoSuchPaddingException
     * @throws NoSuchAlgorithmException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     */
    @Throws(JsonProcessingException::class, InvalidKeyException::class, NoSuchPaddingException::class, NoSuchAlgorithmException::class, BadPaddingException::class, IllegalBlockSizeException::class)
    protected fun sendRedirectAdSSOLogin(request: HttpServletRequest, response: HttpServletResponse, redirect: RedirectAttributes,
                                         returnUri: String, prompt: String, userData: String?): String {
        val session: HttpSession = request.session
        // SSO 로그인 완료후 사용할 값
        // return uri
        session.setAttribute(SSOConst.SKEY_SSO_REDIRECT_URI, returnUri)
        // state
        val random = SecureRandom()
        val state: String = BigInteger(130, random).toString()

        val callbackSuccessURI = String.format("%s%s", AGENT_BASE_URL, CALLBACK_SUCCESS_URI)
        val callbackFailURI = String.format("%s%s", AGENT_BASE_URL, CALLBACK_FAIL_URI)

        // SSO Server로 보내기 위한 통신 전문
        val payload: SSORequestDTO = SSORequestDTO().apply {
            this.reqId = state
            this.siteCode = SITE_CODE
            this.sitePassword = SITE_PASSWORD
            this.callbackSuccessURI = callbackSuccessURI
            this.callbackFailURI = callbackFailURI
            this.userData = userData
            this.prompt = prompt
        }
        logger.info { "=== [sendRedirectAdSSOLogin] payload : $payload"}

        val plainText = objectMapper.writeValueAsString(payload)
        val sEncData: String = CipherUtil.encryptRSA(plainText, publicKey) // SSO Public Key 로 암호화
        logger.debug { "=== [sendRedirectAdSSOLogin] EncodeData : $sEncData" }

        redirect.addAttribute("EncodeData", sEncData) // 암호화 페이로드

        return "redirect:$COSMAX_SSO_AD_LOGIN_URI"
    }

    /**
     * AD SSO 요청에 대한 응답 파싱
     * @param encodeData
     * @return
     * @throws InvalidKeyException
     * @throws NoSuchPaddingException
     * @throws NoSuchAlgorithmException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     * @throws UnsupportedEncodingException
     * @throws JsonMappingException
     * @throws JsonProcessingException
     */
    @Throws(InvalidKeyException::class, NoSuchPaddingException::class, NoSuchAlgorithmException::class, BadPaddingException::class, IllegalBlockSizeException::class, UnsupportedEncodingException::class, JsonMappingException::class, JsonProcessingException::class)
    protected fun getAdCallbackResponse(encodeData: String): SSOResponseDTO? {
        var payload: SSOResponseDTO? = null
        logger.debug { "=== getAdCallbackResponse EncodeData : $encodeData" }
        val sDecrpytData: String = CipherUtil.decryptRSA(encodeData, agentPrivateKey)   // SSO Public Key 로 복호화
        logger.info { "=== [getAdCallbackResponse] sDecrpytData : $sDecrpytData" }
        payload = objectMapper.readValue(sDecrpytData, SSOResponseDTO::class.java)
        return payload
    }

//    /**
//     * AD SSO 로그아웃
//     * @param request
//     * @param res
//     * @param redirect
//     * @param retUri
//     * @param userData
//     * @return
//     * @throws JsonProcessingException
//     * @throws InvalidKeyException
//     * @throws NoSuchPaddingException
//     * @throws NoSuchAlgorithmException
//     * @throws BadPaddingException
//     * @throws IllegalBlockSizeException
//     */
//    @Throws(JsonProcessingException::class, InvalidKeyException::class, NoSuchPaddingException::class, NoSuchAlgorithmException::class, BadPaddingException::class, IllegalBlockSizeException::class)
//    protected fun sendRedirectAdSSOLogout(request: HttpServletRequest?, res: HttpServletResponse?,
//                                          redirect: RedirectAttributes, retUri: String?, userData: String?): String {
//        logger.debug{ "request.... sso logout" }
//        var state: String
//        run {
//            //SSO 로그인 완료후 사용할 값
//            //state
//            val random = SecureRandom()
//            state = BigInteger(130, random).toString()
//        }
//
//        //SSO Server로 보내기 위한 통신 전문
//        var payload: SSORequestDTO? = null
//        run {
//            val callbackSuccessURI = String.format("%s%s", AGENT_BASE_URL, retUri)
//            val callbackFailURI = String.format("%s%s", AGENT_BASE_URL, retUri)
//            payload = SSORequestDTO().apply {
//                this.reqId = state
//                this.siteCode = SITE_CODE
//                this.sitePassword = SITE_PASSWORD
//                this.callbackSuccessURI = callbackSuccessURI
//                this.callbackFailURI = callbackFailURI
//                this.userData = userData
//            }
//            logger.debug{ "payload : $payload" }
//            val plainText = objectMapper.writeValueAsString(payload)
//            val sEncData: String = CipherUtil.encryptRSA(plainText, publicKey) //SSO Public Key 로 암호화
//            logger.debug{ "EncodeData for logout : $sEncData" }
//            redirect.addAttribute("EncodeData", sEncData) //암호화 페이로드
//        }
//        val redirectSSOUrl = "redirect:$COSMAX_SSO_AD_LOGOUT_URI"
//        logger.debug{ "request.... sso logout : $redirectSSOUrl" }
//        return redirectSSOUrl
//    }
}