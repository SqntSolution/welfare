package com.tf.cms.biz.common.social

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.admin.auth.UserAuthDto
import com.tf.cms.biz.admin.auth.UserAuthService
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.biz.common.login.RegisterData
import com.tf.cms.biz.common.login.UserService
import com.tf.cms.biz.common.token.JwtTokenService
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.jpa.dto.TbUserMasterDto
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.QTbUserSocialLogin
import com.tf.cms.common.jpa.entity.TbUserSocialLogin
import com.tf.cms.common.jpa.repository.TbUserSocialLoginRepository
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.logger
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import org.apache.commons.lang3.ObjectUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.time.LocalDateTime
import java.util.*
import kotlin.jvm.optionals.getOrNull

/**
 * packageName    : com.tf.cms.biz.common.login
 * fileName       : SocialLoginService
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */
@Service
class SocialLoginService(
    @Value("\${domains.cms}") private val domains: String,
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbUserSocialLoginRepository: TbUserSocialLoginRepository,
    private val jwtTokenService: JwtTokenService,
    private val userService: UserService,
    private val userHistoryService: UserHistoryService,
    private val userAuthService: UserAuthService,
) {

    /**
     * name: socialAuthLogin
     * description: 소셜 로그인으로 인증 후 내부 로그인 정보
     * author: 정상철
     * created:
     *
     * @return
     */
    fun socialAuthLogin(socialAuthLoginDto: SocialAuthLoginDto, request: HttpServletRequest): TbJwtTokenDto {
        logger().info("socialAuthLoginDto>>{}", socialAuthLoginDto)
        // 소셜 고유 id 와 소셜 타입으로 소셜 로그인 테이블 하고 유저테이블 조회 후 로그인 진행
        val tbUserSocialLogin = QTbUserSocialLogin.tbUserSocialLogin
        val tbUserMaster = QTbUserMaster.tbUserMaster

        val whereCondition = BooleanBuilder();
        whereCondition.and(tbUserSocialLogin.socialUserId.eq(socialAuthLoginDto.socialUserId))
        whereCondition.and(tbUserSocialLogin.socialType.eq(socialAuthLoginDto.socialType))
//        whereCondition.and(tbUserMaster.isActive.eq(true))

        val loginData = jpaQueryFactory
            .select(
                Projections.fields(
                    TbUserMasterDto::class.java,
                    tbUserMaster.userId,
                    tbUserMaster.loginId
                )
            )
            .from(tbUserMaster)
            .where(whereCondition)
            .innerJoin(tbUserSocialLogin).on(tbUserMaster.userId.eq(tbUserSocialLogin.userId))
            .fetchFirst()
//            .orElseThrow { throw BizException("로그인에 실패하였습니다.") }

        logger().info { "loginData>>$loginData" }

//        if (loginData != null) {
//            if (loginData.isActive == false) logger().info { "휴면 사용자 isActive >>" }
//        }

        val tbJwtTokenDtoInput = TbJwtTokenDto(
//            loginId = loginData?.loginId,
            userId = loginData?.userId,
        )

        logger().info { "tbJwtTokenDtoInput>>$tbJwtTokenDtoInput" }

        val tbJwtTokenDto = jwtTokenService.generateJwtToken(true, tbJwtTokenDtoInput, true, null, request) // 로그인상태 유지
        logger().info { "tbJwtTokenDto>>$tbJwtTokenDto" }
        return tbJwtTokenDto
    }

    /**
     * name: socialLogin
     * description: 소셜 로그인 정보 조회
     * author: 정상철
     * created:

     *
     * @return
     */
    fun getSocialLoginInfo(socialLoginDto: SocialLoginDto): SocialLoginDto? {

        val tbUserSocialLogin = QTbUserSocialLogin.tbUserSocialLogin
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val whereCondition = BooleanBuilder();

        whereCondition.and(tbUserSocialLogin.socialType.eq(socialLoginDto.socialType!!))
//        whereCondition.and(tbUserSocialLogin.userId.eq(data.userId))
        whereCondition.and(tbUserSocialLogin.socialUserId.eq(socialLoginDto.socialUserId!!))

        val result = jpaQueryFactory
            .select(
                Projections.fields(
                    SocialLoginDto::class.java,
                    tbUserSocialLogin.id,
                    tbUserSocialLogin.userId,
                    tbUserSocialLogin.socialType,
                    tbUserSocialLogin.socialUserId,
                    tbUserSocialLogin.profileImageUrl,
                    tbUserSocialLogin.linkedAt,
                    tbUserMaster.userId,
                    tbUserMaster.userNm,
                    tbUserMaster.isActive,
                )
            )
            .from(tbUserSocialLogin)
            .innerJoin(tbUserMaster).on(tbUserSocialLogin.userId.eq(tbUserMaster.userId))
            .where(whereCondition)
            .fetchOne()
//            ?: throw BizException("소셜 로그인 정보가 존재하지 않습니다.")

        return result

    }

    /**
     * name: saveSocialLoginInfo
     * description: 소셜 로그인 연동 시 연동 정보 저장
     * author: 정상철
     * created:

     *
     * @return
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun saveSocialLoginInfo(data: RegisterSocialDto) {
        val tbUserSocialLoginEntity = TbUserSocialLogin().apply {
            this.userId = data.userId
            this.socialType = data.socialType // kakao, google, naver
            this.socialUserId = data.socialUserId
            this.profileImageUrl = data.profileImageUrl
            this.linkedAt = LocalDateTime.now()
        }
        tbUserSocialLoginRepository.save(tbUserSocialLoginEntity)
    }

    /**
     * 없으면 등록 후 로그인, 있으면 로그인
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun ckSocialLogin(
        request: HttpServletRequest,
        name: String,
        email: String,
        socialLoginDto: SocialLoginDto
    ): TbJwtTokenDto {
        //우리한테 있나
//        val userSocialLogin = this.getSocialLoginInfo(socialLoginDto)
        val userSocialLogin = tbUserSocialLoginRepository.findBySocialTypeAndSocialUserId(
            socialLoginDto.socialType!!, socialLoginDto.socialUserId!!
        ).getOrNull()

        val res: TbJwtTokenDto
        if (ObjectUtils.isEmpty(userSocialLogin)) {
            //없으면
            logger().debug { "social>>없다" }
            val pUserId = UUID.randomUUID().toString().replace("-", "")
            val loginId = socialLoginDto.socialType + "_" + (100_000_000..999_999_999).random().toString()
            val registerData = RegisterData(
                userId = pUserId,
                passwd = "",
                loginId = loginId,
                name = name,
                email = email,
                phone = null,
                url = domains,
                ck = "re",
                option = socialLoginDto.socialType,
            )

            socialLoginDto.loginId = loginId
            socialLoginDto.userId = pUserId

            // TbUserSocialLogin
            val registerSocialData = RegisterSocialDto(
                userId = socialLoginDto.userId,
                socialUserId = socialLoginDto.socialUserId,
                socialType = socialLoginDto.socialType,
                profileImageUrl = socialLoginDto.profileImageUrl,
            )
            this.saveSocialLoginInfo(registerSocialData)

            //TbUserMaster
            userService.insertUser(registerData)

            // tb_Auth_User
            val userAuthData = UserAuthDto().apply {
                userId = pUserId
                userNm = name
                authLevel = 1 //권한 레벨 1로 설정
                startAuthAt = LocalDateTime.now()
                endAuthAt = null //Helpers.formatStringToLocalDateTime("9999-12-31 00:00")
                createdAt = LocalDateTime.now()
                createdUserId = pUserId
                createdUserNm = name
            }
            userAuthService.insertUserAuth(userAuthData)

            val tbJwtTokenDtoInput = TbJwtTokenDto(
                userId = socialLoginDto.userId,
//                loginId = socialLoginDto.loginId,
            )
            logger().debug { "tbJwtTokenDtoInput>>$tbJwtTokenDtoInput" }

            res = jwtTokenService.generateJwtToken(true, tbJwtTokenDtoInput, true, null, request) // 로그인상태 유지
            logger().debug { "tbJwtTokenDto>>$res" }

        } else {
            logger().debug { "social>>있다" }

            val socialLoginData = SocialAuthLoginDto(
                socialUserId = socialLoginDto.socialUserId,
                socialType = socialLoginDto.socialType
            )
            res = this.socialAuthLogin(socialLoginData, request)
        }

        // 로그인 이력 저장
        val loginHistory = UserHistoryInput().apply {
            this.postId = 0
            this.userId = res.userId
//            this.description = "[${socialLoginDto.socialType ?: ""}]채널에 접속하였습니다."
            this.description = "[${socialLoginDto.socialType}]채널에 접속하였습니다."
            this.userName = name
            this.actionType = UserHistoryActionType.login.code
        }
        userHistoryService.saveUserHistory(loginHistory)

        return res
    }

}