package com.tf.cms.biz.common.social

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.tf.cms.biz.admin.auth.UserAuthDto
import com.tf.cms.biz.admin.auth.UserAuthService
import com.tf.cms.biz.admin.group.GroupService
import com.tf.cms.biz.admin.group.MatchingUserAuthGroupInput
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.biz.common.login.CookieHelper
import com.tf.cms.biz.common.login.UserService
import com.tf.cms.biz.common.sso.AdSSOLoginService
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.jpa.entity.TbUserMaster
import com.tf.cms.common.jpa.repository.TbUserMasterRepository
import com.tf.cms.common.model.DefaultGroupAuth
import com.tf.cms.common.model.SimpleAuthToken
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.HttpHelper
import com.tf.cms.common.utils.JwtTokenUtil
import com.tf.cms.common.utils.logger
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : KakaoAuthService
 * author         : 정상철
 * date           : 2025-05-21
 * description    : Kakao 외부 연동 인증 서비스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */
@Service
class KakaoAuthService (
    @Value("\${kakao.auth.client-id}") private val clientId: String,
    @Value("\${kakao.auth.redirect-uri}") private val redirectUri: String,
    @Value("\${kakao.auth.user-info-url}") private val userInfoUrl: String,
    @Value("\${kakao.auth.token-url}") private val tokenUrl: String,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    @Value("\${jwt.auth.secret}") private var authKey: String,
    @Value("\${jwt.auth.expiration}") private val expiration: Long,

    private val tbUserMasterRepository: TbUserMasterRepository,
    private val socialLoginService: SocialLoginService,
    private val adSSOLoginService: AdSSOLoginService,
    private val userService: UserService,
    private val userAuthService: UserAuthService,
    private val userHistoryService: UserHistoryService,
    private val groupService: GroupService,
    private val httpHelper: HttpHelper,

    ) {
    private val objectMapper = jacksonObjectMapper()
    private val passwordEncoder = BCryptPasswordEncoder()

    /**
     * name: linkKakaoAccount
     * description: 카카오 계정 연동 정보 저장
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun linkKakaoAccount(kakaoUserInfo: KakaoUserInfo) {
        val pUserId =  UUID.randomUUID().toString().replace("-","")
        val encodedId = passwordEncoder.encode((100_000_000..999_999_999).random().toString()) // 9자리 문자열(숫자) 생성 해서 암호화
        val encodedPassword = passwordEncoder.encode((100_000_000..999_999_999).random().toString()) //9자리 문자열(숫자) 생성 해서 암호화

        // TbUserMaster
        val user = TbUserMaster().apply {
            this.loginId = kakaoUserInfo.email
            this.passwdHash = ""
            this.userId = pUserId
            this.userNm = kakaoUserInfo.nickname
            this.mailAddr = kakaoUserInfo.email
            this.mobileNo = ""
            this.isActive = true
            this.createdAt = LocalDateTime.now()
        }
        tbUserMasterRepository.save(user)

        // tb_User_Social_Login
        val registerSocialData = RegisterSocialDto(
            userId = pUserId,
            socialUserId = kakaoUserInfo.id,
            socialType = "kakao",
            profileImageUrl = kakaoUserInfo.profileImage,
        );
        socialLoginService.saveSocialLoginInfo(registerSocialData)

        // tb_Auth_User
        val userAuthData = UserAuthDto().apply {
            userId = pUserId
            userNm = kakaoUserInfo.nickname
            authLevel = 1 //권한 레벨 1로 설정
            startAuthAt = LocalDateTime.now()
            endAuthAt = null //Helpers.formatStringToLocalDateTime("9999-12-31 00:00")
            createdAt = LocalDateTime.now()
            createdUserId = pUserId
            createdUserNm = kakaoUserInfo.nickname
        }
        userAuthService.insertUserAuth(userAuthData)

        // 유저 개인 권한 그룹
        val userGroupAuthList = listOf(
            MatchingUserAuthGroupInput(authMatchingId = null, userId = pUserId, authGroupCd = DefaultGroupAuth.USER.code),
        )
        groupService.saveMatchingUserAuthGroup(userGroupAuthList, null)

        val socialLoginDto = SocialLoginDto(
                userId = pUserId,
                userNm = kakaoUserInfo.nickname
        )
        saveUserHistory(socialLoginDto)
    }


    /**
     * name: loginWithKakao
     * description: 카카오 로그인
     * author: 정상철
     * created:

     *
     * @return
     */
    fun loginWithKakao(request: HttpServletRequest, code: String): KakaoLoginResult {
        val accessToken = requestAccessToken(code)
        val kakaoUserInfo = getUserInfoFromKakao(accessToken)
//        logger().debug { "kakaoUserInfokakaoUserInfo>>${kakaoUserInfo}" }
        /*해당 kakaoUserInfo 로 세팅 진행*/
        val kakaoUserData = SocialLoginDto(
            socialType = "kakao",
            socialUserId = kakaoUserInfo.id,
            profileImageUrl = kakaoUserInfo.profileImage
        )
//        logger().debug { "kakaoUserData>>${kakaoUserData}" }
        val socialLoginDto = socialLoginService.getSocialLoginInfo(kakaoUserData)
//        logger().debug { "userSocialLogin>>${userSocialLogin}" }
        return if (socialLoginDto != null) {

            if (socialLoginDto.isActive == false) { // 휴면 계정
                KakaoLoginResult(success = true, socialUserId = kakaoUserInfo.id, kakaoUserInfo = kakaoUserInfo, isActive = false)

            }else{
                val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth(socialLoginDto.userId!!)
                val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
                SecurityContextHolder.getContext().authentication = authentication
                val token = JwtTokenUtil().createToken(authentication, authKey, accessTokenExpiration)
                KakaoLoginResult(success = true, jwtToken = token, socialUserId = kakaoUserInfo.id, kakaoUserInfo = kakaoUserInfo, socialLoginDto= socialLoginDto)
            }

        } else {
            KakaoLoginResult(success = false, socialUserId = kakaoUserInfo.id, kakaoUserInfo = kakaoUserInfo)
        }
    }


    /**
     * name: socialAuthLogin
     * description: 소셜 인증 후 로그인 처리
     * author: 정상철
     * created:

     *
     * @return
     */
    fun socialAuthLogin(kakaoLoginResult: KakaoLoginResult, request: HttpServletRequest): TbJwtTokenDto {

        val socialLoginData = SocialAuthLoginDto(
            socialUserId = kakaoLoginResult.socialUserId,
            socialType = "kakao"
        )
        return socialLoginService.socialAuthLogin(socialLoginData, request);
    }


    /**
     * name: createJwtCookies
     * description: JWT 발급 및 쿠키 생성
     * author: 정상철
     * created:

     *
     * @return
     */
    fun createJwtCookies (kakaoLoginResult: KakaoLoginResult, request: HttpServletRequest, response: HttpServletResponse) {
        val tbJwtTokenDto = socialAuthLogin(kakaoLoginResult, request)
        val refreshToken = tbJwtTokenDto.refreshToken
        val accessToken = tbJwtTokenDto.accessToken
        val rememberMe = true
        val refreshExpiration = if (rememberMe) {
            expiration / 1000
        } else {
            refreshTokenExpiration / 1000
        }
        // 쿠키헬퍼
        CookieHelper.loginCookies(
            response, accessToken, accessTokenExpiration / 1000,
            refreshToken, refreshExpiration, rememberMe
        )

    }

    /**
     * name:
     * description: 휴면계정 해제용 쿠키 생성
     * author: 정상철
     * created:

     *
     * @return
     */
    fun createDormantCookies(kakaoLoginResult: KakaoLoginResult, request: HttpServletRequest, response: HttpServletResponse) {
        val tbJwtTokenDto = socialAuthLogin(kakaoLoginResult, request)
        tbJwtTokenDto.accessToken?.let { CookieHelper.createDormantCookies(it,expiration / 1000, response) }
    }


    fun issuedAtTime(token: String?): Long {
        return userService.issuedAtTime(token)
    }


    /**
     * name: requestAccessToken
     * description: kakao AccessToKen 요청
     * author: 정상철
     * created:

     *
     * @return
     */
    fun requestAccessToken(code: String): String {
        val params = mutableMapOf(
            "grant_type" to "authorization_code",
            "client_id" to clientId,
            "redirect_uri" to redirectUri,
            "code" to code
        )

        val responseBody = httpHelper.postParamsHttpRequest2(tokenUrl, params)
        // responseBody 예시: {"access_token":"xxx","token_type":"bearer", ...}

        val jsonNode = objectMapper.readTree(responseBody)
        val accessToken = jsonNode.get("access_token").asText()

        return accessToken
    }


    /**
     * name: getUserInfoFromKakao
     * description: kakao AccessToken 으로 사용자 정보 조회
     * author: 정상철
     * created:

     *
     * @return
     */
    fun getUserInfoFromKakao(accessToken: String): KakaoUserInfo {
        val headers = mutableMapOf(
            "Authorization" to "Bearer $accessToken"
        )
        val responseBody = httpHelper.postJsonHttpRequest2(userInfoUrl, "", headers)
        val jsonNode = objectMapper.readTree(responseBody)

        logger().debug { "jsonNode>>${jsonNode}" }

        return KakaoUserInfo(
            id = jsonNode.get("id").asText(),
            nickname = jsonNode.get("properties").get("nickname").asText(),
            email = jsonNode.get("kakao_account").get("email")?.asText() ?: "",
            profileImage = jsonNode.get("properties").get("profile_image")?.asText() ?: ""
        )
    }

    /**
     * name:
     * description: 로그인시 히스토리
     * author: 정상철
     * created:

     *
     * @return
     */

    fun saveUserHistory(socialLoginDto : SocialLoginDto) {
        // 로그인 이력 저장
        val loginHistory = UserHistoryInput().apply {
            this.postId = 0
            this.userId = socialLoginDto.userId
//            this.description = "[${socialLoginDto.socialType ?: ""}]채널에 접속하였습니다."
            this.description = "[kakao]채널에 접속하였습니다."
            this.userName = socialLoginDto.userNm
            this.actionType = UserHistoryActionType.login.code
        }
        userHistoryService.saveUserHistory(loginHistory)
    }

}