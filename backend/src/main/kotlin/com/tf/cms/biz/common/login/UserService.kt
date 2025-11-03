package com.tf.cms.biz.common.login

import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.admin.auth.UserAuthDto
import com.tf.cms.biz.admin.auth.UserAuthService
import com.tf.cms.biz.admin.group.GroupService
import com.tf.cms.biz.admin.group.MatchingUserAuthGroupInput
import com.tf.cms.biz.admin.ref.RefService
import com.tf.cms.biz.common.auth.AuthService
import com.tf.cms.biz.common.token.JwtTokenService
import com.tf.cms.biz.user.my.UserProfile
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.QTbUserSocialLogin
import com.tf.cms.common.jpa.entity.TbUserDeletion
import com.tf.cms.common.jpa.entity.TbUserMaster
import com.tf.cms.common.jpa.repository.TbUserDeletionRepository
import com.tf.cms.common.jpa.repository.TbUserMasterRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.DefaultGroupAuth
import com.tf.cms.common.utils.*
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import org.apache.commons.lang3.ObjectUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.security.SignatureException
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import kotlin.math.log

/**
 * packageName    : com.tf.cms.biz.common.login
 * fileName       : UserService
 * author         : 김정규
 * date           : 25. 5. 20. 오후 2:52
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 5. 20. 오후 2:52        김정규       최초 생성
 */
@Service
class UserService(
    @Value("\${jwt.auth.secret}") private var authKey: String? = null,
    @Value("\${jwt.email.secret}") private var emailKey: String,
    @Value("\${jwt.email.expiration}") private val emailExpiredMs: Long,
    @Value("\${domains.cms}") private val domains: String,
    private val tbUserMasterRepository: TbUserMasterRepository,
    private val mailService: MailService,
    private val templateService: TemplateService,
    private val jwtTokenService: JwtTokenService,
    private val tbUserDeletionRepository: TbUserDeletionRepository,
    private val userAuthService: UserAuthService,
    private val groupService: GroupService,
    private val authService: AuthService,
    private val refService: RefService,
    private val jpaQueryFactory: JPAQueryFactory
) {
    private val passwordEncoder = BCryptPasswordEncoder()

    /**
     * name: registerUser
     * description: 사용자 회원가입
     * author: 김정규
     * created: 2025-04-09 13:51
     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertUser(registerData: RegisterData) {

        // 공개키로 복호화
        val passwd = if (ObjectUtils.isNotEmpty(registerData.passwd!!)) {
            val privateKey = authService.getPrivateKey(registerData.key)
            val decryptData = Helpers.decrypt(registerData.passwd, privateKey).split("||")
            passwordEncoder.encode(decryptData[1])
        } else {
            registerData.passwd!!
        }

        val user = TbUserMaster().apply {
            this.loginId = registerData.loginId
            this.passwdHash = passwd
            this.userId = registerData.userId
            this.userNm = registerData.name
            this.mailAddr = registerData.email
            this.mobileNo = registerData.phone
            this.isActive = true
            this.createdAt = LocalDateTime.now()
        }
        tbUserMasterRepository.save(user)

        //권한 레벨 1로 설정
        val auth = UserAuthDto().apply {
            userId = user.userId
            userNm = user.userNm
            authLevel = 1
            startAuthAt = LocalDateTime.now()
            endAuthAt = null //Helpers.formatStringToLocalDateTime("9999-12-31 00:00")
            createdAt = LocalDateTime.now()
            createdUserId = user.userId
            createdUserNm = user.userNm
        }
//        logger().debug { "auth>$auth" }
        userAuthService.insertUserAuth(auth) // 유저 권한

        // 유저 개인 권한 그룹
        val userGroupAuthList = listOf(
            MatchingUserAuthGroupInput(
                authMatchingId = null,
                userId = user.userId,
                authGroupCd = DefaultGroupAuth.USER.code
            ),
        )
        groupService.saveMatchingUserAuthGroup(userGroupAuthList, null)

        if (ObjectUtils.isNotEmpty(registerData.email)) {
            this.sendCompletionEmail(registerData)
        }
    }

    /**
     * 메일 발송
     */
    fun sendEmail(registerData: RegisterData, ck: String, request: HttpServletRequest) {
        val emailExpired = emailExpiredMs / 1000 / 60

        val emailCode = refService.findByGroupCode("EMAIL_SEND", ck)
        val additionalInfo = emailCode.additionalInfo!!.split("||")

        val id: String //메일에 보여주는 id
        val userId: String
        val name: String
        when (ck) {
            "re" -> {
                id = registerData.loginId!!
                userId = UUID.randomUUID().toString().replace("-", "")
                name = registerData.name!!
            }

            "id" -> {
                val getUser = this.findId(registerData)
                id = getUser[0].loginId!! //additionalInfo[2]
                userId = getUser[0].userId!!
                name = registerData.name!!
            }

            "pw" -> {
                id = registerData.loginId!!
                val getUser = this.findPw(registerData)
                userId = getUser.userId!!
                name = getUser.name!!
            }

            else -> {
                id = ""
                userId = ""
                name = ""
            }
        }

        val tbJwtTokenDtoInput = TbJwtTokenDto(
            userId = userId,
        )

        registerData.ck = ck
        val tbJwtTokenDto =
            jwtTokenService.generateJwtToken(false, tbJwtTokenDtoInput, null, registerData, request) // 토큰 생성

        val baseUrl = domains
        val token = tbJwtTokenDto.accessToken!!
        val header = Helpers.resolveTemplate(
            additionalInfo[0],
            mapOf("name" to name)
        )
        val url = Helpers.resolveTemplate(
            additionalInfo[1],
            mapOf("baseUrl" to baseUrl, "token" to token)
        )
        val additionalInfo2 = emailCode.additionalInfo2!!.split("||")
        val titNm = additionalInfo2[0]
        val expiration = Helpers.resolveTemplate(
            additionalInfo2[1],
            mapOf("emailExpired" to emailExpired.toString())
        )
        val args = arrayOf(
            header, id, url, titNm, expiration
        )
        logger().info { "args>${args.joinToString(",")}" }
        val emailData = EmailData()
        emailData.to = registerData.email
        emailData.text = templateService.getTemplateAuth(args)
        emailData.subject = emailCode.label!!

        mailService.sendVerificationMail(emailData)
    }

    /**
     * 메일 인증
     */
    fun verifyEmail(token: String, registerData: RegisterData): String {
        val did = registerData.userId
        val dataJwtId = registerData.jwtId
        val useToken = if (ObjectUtils.isNotEmpty(dataJwtId) && ObjectUtils.isNotEmpty(did)) {
            logger().debug { "1111" }
            registerData.ck = "rc"
            jwtTokenService.jwtIdAccessToken(dataJwtId!!.toInt(), false, registerData).accessToken.toString()
        } else {
            logger().debug { "2222" }
            token
        }

        val info = JwtTokenUtil().parseEmailVerificationToken(useToken, emailKey)
        val jwtId = info.jwtId!!
        val ck = if (jwtTokenService.isTokenExpired(jwtId)) {
            "no"
        } else {
            info.ck!!
        }

        when (ck) {
            "re" -> {
                this.insertUser(info)
                jwtTokenService.revokeJwtToken(jwtId) // 토큰만료
            }

            "id" -> {
                this.findId(info)[0].loginId!!
                jwtTokenService.revokeJwtToken(jwtId) // 토큰만료
            }

            "pw" -> {
                this.findPw(info)
                jwtTokenService.revokeJwtToken(jwtId) // 토큰만료
            }

            else -> {
            }
        }

        return ck
    }

    /**
     * ID 중복 체크
     */
    fun checkId(id: String) {
        if (tbUserMasterRepository.findByLoginId(id).isPresent) {
            throw BizException("중복된 ID입니다.")
        }
    }

    /**
     * ID 찾기
     */
    fun findId(registerData: RegisterData): List<RegisterData> {
//        val entityList =
//            tbUserMasterRepository.findByEmpNmAndMailAddrAndIsActive(registerData.name, registerData.email)
//        if (entityList.isEmpty()) {
//            throw BizException("존재하지 않는 사용자 ID입니다.")
//        }
//        val res = LoginMapper.INSTANCE.tbUserMasterEntityToDtos(entityList)
//        // 비밀번호 제거
//        res.forEach { it.passwd = "" }

        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbUserSocialLogin = QTbUserSocialLogin.tbUserSocialLogin

        val res = jpaQueryFactory.select(
            Projections.fields(
                RegisterData::class.java,
                tbUserMaster.userId,
                tbUserMaster.loginId,
                tbUserMaster.userNm.`as`("name"),
                tbUserMaster.mailAddr.`as`("email"),
                tbUserMaster.mobileNo.`as`("phone"),
                tbUserSocialLogin.socialType
            )
        )
            .from(tbUserMaster)
            .where(tbUserMaster.userNm.eq(registerData.name), tbUserMaster.mailAddr.eq(registerData.email))
            .leftJoin(tbUserSocialLogin).on(tbUserMaster.userId.eq(tbUserSocialLogin.userId))
            .fetch()
        if (res.isEmpty()) {
            throw BizException("존재하지 않는 사용자 ID입니다.")
        }
        return res
    }

    /**
     * PW 찾기
     */
    fun findPw(registerData: RegisterData): RegisterData {
        logger().debug { "registerData>$registerData" }
        val tbUserMaster =
            tbUserMasterRepository.findByLoginIdAndMailAddrAndIsActive(registerData.loginId, registerData.email)
                .orElseThrow { throw BizException("존재하지 않는 사용자 ID입니다.") }
        val res = LoginMapper.INSTANCE.tbUserMasterEntityToDto(tbUserMaster)
        res.passwd = ""
        return res
    }

    /**
     * 토큰으로 조회
     */
    fun findToken(token: String): List<RegisterData> {
        val info = JwtTokenUtil().parseEmailVerificationToken(token, emailKey)
        val jwtId = info.jwtId!!
        val res = if (ObjectUtils.isNotEmpty(info.name) && ObjectUtils.isNotEmpty(info.email)) {
            this.findId(info)
        } else if (ObjectUtils.isNotEmpty(info.loginId) && ObjectUtils.isNotEmpty(info.email)) {
            listOf(this.findPw(info))
        } else {
            listOf(RegisterData())
        }

        jwtTokenService.revokeJwtToken(jwtId) // 토큰만료

        return res
    }

    /**
     * 비밀번호 변경
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun setPw(token: String, registerData: RegisterData): String? {
        val info = JwtTokenUtil().parseEmailVerificationToken(token, emailKey)
        val jwtId = info.jwtId!!
        val result = this.findPw(info)

        // 공개키로 복호화
        val privateKey = authService.getPrivateKey(registerData.key)
        val decryptData = Helpers.decrypt(registerData.passwd, privateKey).split("||")
        val passwd = decryptData[1]

        val entity: TbUserMaster = tbUserMasterRepository.findByLoginIdAndIsActive(result.loginId)
            .orElseThrow { throw BizException("존재하지 않습니다.") }

        val encodedPassword = passwordEncoder.encode(passwd)
        entity.apply {
            this.passwdHash = encodedPassword
            this.modifiedAt = LocalDateTime.now()
        }
        tbUserMasterRepository.save(entity)

        result.url = domains
        result.ck = info.ck
        this.sendCompletionEmail(result)

        jwtTokenService.revokeJwtToken(jwtId) // 토큰만료
        return info.option
    }

    /**
     * 토큰 연장
     */
    fun generateAccessTokenFromRefreshToken(accessToken: String): String {
        val info = JwtTokenUtil().getAuthentication(accessToken, authKey) // 토큰가져오기
        val tbJwtTokenDto = jwtTokenService.jwtIdAccessToken(info!!.jwtId!!, true, null)
        return tbJwtTokenDto.accessToken!!
    }

    /**
     * 토큰 발급 시간
     */
    fun issuedAtTime(token: String?): Long {
        return try {
            JwtTokenUtil().expirationTime(token, authKey)
        } catch (e: ExpiredJwtException) {
            0
        } catch (e: MalformedJwtException) {
            0
        } catch (e: SignatureException) {
            0
        } catch (e: BizException) {
            0
        } catch (e: Exception) {
            0
        }
    }

    /**
     * 완료 메일 발송
     */
    fun sendCompletionEmail(registerData: RegisterData) {
        val url = domains
        val ck = registerData.ck!!
        val emailCode = refService.findByGroupCode("EMAIL_COMPLETE", ck)
        val additionalInfo = emailCode.additionalInfo!!.split("||")
        val additionalInfo2 = emailCode.additionalInfo2!!.split("||")
        val header = additionalInfo[0]
        var id = registerData.loginId!!
        val expiration = additionalInfo[1]
        val titNm = additionalInfo2[0]
        when (ck) {
            "re" -> {
                if (registerData.option != null) { // 소셜 여부
                    id = registerData.option + additionalInfo2[1]
                }
            }

            "pw" -> {
                id = this.findPw(registerData).loginId!!
            }

            "de" -> {
            }

            "rc" -> {
            }

            else -> {
                id = ""
            }
        }

        val args = arrayOf(
            header, id, url, titNm, expiration
        )
        logger().info { "args>${args.joinToString(",")}" }
        val emailData = EmailData()
        emailData.to = registerData.email
        emailData.text = templateService.getTemplateAuth(args)
        emailData.subject = emailCode.label!!
        mailService.sendVerificationMail(emailData)
    }

    /**
     * 내 정보 조회 시 비밀번호로 인증
     */
    fun authenticatePassword(accessToken: String?, loginData: LoginData): Boolean {
        val info = JwtTokenUtil().getAuthentication(accessToken, authKey) // 토큰가져오기
        val entity: TbUserMaster = tbUserMasterRepository.findByUserId(info!!.theId)
            .orElseThrow { throw BizException("존재하지 않습니다.") }

        if (entity.passwdHash.isNullOrBlank()) {
            return false
        }

        // 공개키로 복호화
        val privateKey = authService.getPrivateKey(loginData.si)
        val decryptData = Helpers.decrypt(loginData.rd, privateKey).split("||")
        val passwd = decryptData[1]

        if (passwordEncoder.matches(passwd, entity.passwdHash)) {
            return true
        } else {
            throw BizException("다시 시도하세요.")
        }
    }

    /**
     * 내정보 변경 시 인증키 생성
     */
    fun changeInfo(registerData: RegisterData, ck: String, request: HttpServletRequest): String {
//        logger().debug { "registerData>$registerData" }
        registerData.ck = ck
        registerData.option = ck
        val resultData = registerDataReset(registerData)
//        logger().debug { "registerDataafter>$resultData" }
        val tbJwtTokenDtoInput = TbJwtTokenDto(
//            userId = entity.loginId,
            userId = resultData.userId,
        )
//        logger().debug { "tbJwtTokenDtoInput>>$tbJwtTokenDtoInput" }
//        logger().debug { "registerData>$registerData" }
        val tbJwtTokenDto = jwtTokenService.generateJwtToken(false, tbJwtTokenDtoInput, null, resultData, request)
        val emailCode = refService.findByGroupCode("EMAIL_COMPLETE", "pu")

        return "${emailCode.additionalInfo}${tbJwtTokenDto.accessToken}"
    }

    /**
     * 회원 계정 비활성화 30일 기준
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun withdrawMember(token: String, withdrawMemberData: WithdrawMemberData) {
        val info = JwtTokenUtil().parseEmailVerificationToken(token, emailKey)

        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val after30Days = LocalDate.now().plusDays(30).atTime(0, 0) // 자정
        val loginId = info.loginId
        val reason = withdrawMemberData.reason
        val url = domains
        val jwtId = info.jwtId

        // 비활성화 처리
        val user =
            tbUserMasterRepository.findByLoginIdAndIsActive(loginId)
                .orElseThrow { throw BizException("정보가 존재하지 않습니다.") }
        user.isActive = false
        user.modifiedAt = LocalDateTime.now()

        tbUserMasterRepository.save(user)
        val userId = user.userId
        // 삭제 관리 테이블 insert
        val tbUserDeletion = TbUserDeletion().apply {
            this.userId = userId
            this.deletedAt = after30Days
            this.deletedBy = "self"
            this.reason = reason
            this.userRole = userInfo.role.toString()
            this.authLevel = userInfo.authLevel
            this.isDeleted = true
            this.createdAt = LocalDateTime.now()
            this.createdUserId = userInfo.id
            this.createdUserNm = userInfo.name
        }
        tbUserDeletionRepository.save(tbUserDeletion)

        val emailCode = refService.findByGroupCode("EMAIL_COMPLETE", "pu")
        val registerData = RegisterData()
        registerData.userId = userId
        registerData.loginId = loginId
        registerData.email = info.email
        registerData.url = Helpers.resolveTemplate(
            emailCode.additionalInfo2!!,
            mapOf("url" to url, "jwtId" to jwtId.toString(), "id" to tbUserDeletion.id!!.toString())
        )

        registerData.ck = info.ck
        this.sendCompletionEmail(registerData)

    }

    /**
     * ID 복구 - 삭제 취소
     */
    fun recoverUserId(registerData: RegisterData) {
        val jwtId = registerData.jwtId!!
        if (!jwtTokenService.isTokenExpired(jwtId)) {
            val did: Int = registerData.userId!!.toInt()
            val tbUserDeletion =
                tbUserDeletionRepository.findById(did).orElseThrow { throw BizException("정보가 존재하지 않습니다.") }
            // 삭제 관리 테이블 수정
            tbUserDeletion.isDeleted = false
            tbUserDeletion.modifiedAt = LocalDateTime.now()
            tbUserDeletion.modifiedUserId = "self"
            tbUserDeletion.modifiedUserNm = "복구"
            tbUserDeletionRepository.save(tbUserDeletion)

            // 활성화 처리
            val userId = tbUserDeletion.userId!!
            val user =
                tbUserMasterRepository.findByUserId(userId)
                    .orElseThrow { throw BizException("정보가 존재하지 않습니다.") }
            user.isActive = true
            user.modifiedAt = LocalDateTime.now()
            tbUserMasterRepository.save(user)

            jwtTokenService.revokeJwtToken(jwtId) // 토큰만료

            //완료 메일
            registerData.loginId = user.loginId
            registerData.name = user.userNm
            registerData.phone = user.mobileNo
            registerData.email = user.mailAddr
            registerData.ck = "rc"
            this.sendCompletionEmail(registerData)
        } else {
            throw BizException("만료되었습니다.")
        }
    }

    /**
     * 마이페이지 수정 - 이메일 바꾸면 이메일 발송.... 디자인이 수정버튼이 업슴,, 백부터 수정할거가,, 이멜뿐인가 , 닉네임?
     */
    fun updateUser(userProfile: UserProfile) {

        val userId = userProfile.id
        val newEmail = userProfile.email!!
        val phone = userProfile.phone

        val entity = tbUserMasterRepository.findByUserId(userId!!).get()
        entity.mailAddr = newEmail //이메일
        entity.mobileNo = phone //휴대전화
        entity.modifiedAt = LocalDateTime.now()
        tbUserMasterRepository.save(entity)

        val oldEmail = entity.mailAddr!!
        if (oldEmail != newEmail) {
            val emailCode = refService.findByGroupCode("EMAIL_SEND", "ch")
            val additionalInfo = emailCode.additionalInfo!!.split("||")
            val additionalInfo2 = emailCode.additionalInfo2!!.split("||")
            val header = additionalInfo[0]
            val id = Helpers.resolveTemplate(
                additionalInfo[1],
                mapOf("oldEmail" to oldEmail, "newEmail" to newEmail)
            )
            val url = domains
            val titNm = additionalInfo2[0]
            val expiration = additionalInfo2[1]
            val args = arrayOf(
                header, id, url, titNm, expiration
            )

            val emailData = EmailData()
            emailData.to = oldEmail
            emailData.text = templateService.getTemplateAuth(args)
            emailData.subject = emailCode.label!!

            mailService.sendVerificationMail(emailData)
        }
    }

    /**
     * name:
     * description:  registerDataReset 를 UserID 기준으로 재정의
     * author: 정상철
     * created:

     *
     * @return
     */
    fun registerDataReset(registerData: RegisterData) :RegisterData{
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val id = userInfo.id
        val entity: TbUserMaster = tbUserMasterRepository.findByUserId(id!!)
            .orElseThrow { throw BizException("존재하지 않습니다.") }
        registerData.email = entity.mailAddr
        registerData.phone = entity.mobileNo
        registerData.loginId = entity.loginId
        registerData.userId = entity.userId

        return registerData
    }
}