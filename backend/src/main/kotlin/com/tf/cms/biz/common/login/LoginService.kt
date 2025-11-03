package com.tf.cms.biz.common.login

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.common.auth.AuthService
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.biz.common.sso.AdSSOLoginService
import com.tf.cms.biz.common.token.JwtTokenService
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.jpa.entity.QTbUserDeletion
import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.TbUserMaster
import com.tf.cms.common.jpa.repository.TbUserDeletionRepository
import com.tf.cms.common.jpa.repository.TbUserMasterRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.SimpleAuthToken
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.*
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime


/**
 * packageName    : com.tf.cms.biz.common.login
 * fileName       : LoginService
 * author         : 김정규
 * date           : 25. 4. 9. 오후 1:47
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 9. 오후 1:47        김정규       최초 생성
 */
@Service
class LoginService(
    @Value("\${jwt.auth.secret}") private var authKey: String? = null,
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbUserMasterRepository: TbUserMasterRepository,
    private val tbUserDeletionRepository: TbUserDeletionRepository,
    private val jwtTokenService: JwtTokenService,
    private val authService: AuthService,
    private val userHistoryService: UserHistoryService,
    private val adSSOLoginService: AdSSOLoginService,
) {
    private val passwordEncoder = BCryptPasswordEncoder()

    /**
     * 로그인
     */
    fun login(loginData: LoginData, request: HttpServletRequest): TbJwtTokenDto {
//        logger().info("loginData>>{}", loginData)
        // 공개키로 복호화
        val privateKey = authService.getPrivateKey(loginData.si)
        val decryptData = Helpers.decrypt(loginData.rd, privateKey).split("||")
        val rememberMe = loginData.rememberMe ?: false
        val entity: TbUserMaster = tbUserMasterRepository.findByLoginIdAndIsActive(decryptData[0])
            .orElseThrow { throw BizException("로그인에 실패하였습니다.") }

        if (passwordEncoder.matches(decryptData[1], entity.passwdHash)) {
            return loginProcess(entity, request, rememberMe)

        } else {
            throw BizException("입력하신 정보가 정확한지 확인해 주세요.")
        }
    }


    /**
     * name:
     * description: 로그인 프로세스
     * author: 정상철
     * created:

     *
     * @return
     */

    fun loginProcess(entity: TbUserMaster, request: HttpServletRequest, rememberMe: Boolean): TbJwtTokenDto {
        val tbJwtTokenDtoInput = TbJwtTokenDto(
            userId = entity.userId
        )
//        logger().info { "tbJwtTokenDtoInput>>$tbJwtTokenDtoInput" }

        val tbJwtTokenDto = jwtTokenService.generateJwtToken(true, tbJwtTokenDtoInput, rememberMe, null, request)
//        logger().info { "tbJwtTokenDto>>$tbJwtTokenDto" }

        // 로그인 이력 저장
        val loginHistory = UserHistoryInput().apply {
            this.postId = 0
            this.userId = entity.userId
            this.description = "채널에 접속하였습니다."
            this.userName = entity.userNm
            this.actionType = UserHistoryActionType.login.code
        }
        userHistoryService.saveUserHistory(loginHistory)

        return tbJwtTokenDto
    }

    /**
     * 로그아웃
     */
    fun logout(accessToken: String?) {
        val info = JwtTokenUtil().getAuthentication(accessToken, authKey) // 토큰가져오기
        val jwtId = info!!.jwtId!!
        val ck = jwtTokenService.isTokenExpired(jwtId)
        if (!ck) { // 정상토큰 일때
            jwtTokenService.revokeJwtToken(jwtId) // 토큰만료
        }
    }


    /**
     * name:
     * description: 휴면 해제
     * author:
     * created:

     *
     * @return
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun reactivateUser(request: HttpServletRequest): TbJwtTokenDto {
        val token = request.cookies.firstOrNull { it.name == "dormant" }?.value
            ?: throw BizException("휴면해제(dormant) 사용자 정보가 없습니다.")
        val decodeClaims = jwtTokenService.decodeJwtClaims(token)
        val subSt = EncDecryptor.decrypt(decodeClaims["sub"].toString()) ?: ""

        logger().debug { "empId>> ${subSt}" }

        // 휴면 해제 인증 로직 미구현 (핸드폰 혹은 이메일 구현 예정 현재는 프리패스)
        /*
        *
        *
        * */


        val tbUserDeletion = QTbUserDeletion.tbUserDeletion
        val tbUserMaster = QTbUserMaster.tbUserMaster

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbUserMaster.isActive.eq(false))
        whereCondition.and(tbUserMaster.userId.eq(subSt))

        val userIds = jpaQueryFactory
            .select(
                tbUserDeletion.id,
                tbUserMaster.loginId,
                tbUserMaster.userId,
            )
            .from(tbUserMaster)
            .leftJoin(tbUserDeletion).on(tbUserDeletion.userId.eq(tbUserMaster.userId))
            .where(whereCondition)
            .fetch()


        logger().debug { "userIdsuserIds>> ${userIds}" }

        if (userIds.size == 0) {
            return TbJwtTokenDto()
        }

        userIds.filter {
            true
        }.forEach {
            // 삭제 시작
            try {
                //유저 삭제 정보
                it.get(tbUserDeletion.id)?.let { id ->
                    tbUserDeletionRepository.deleteById(id)
                }

                //유저 관리 활성화
                it.get(tbUserMaster.userId)?.let { userId ->
                    tbUserMasterRepository.findByUserId(userId).ifPresent { deletion ->
                        deletion.apply {
                            this.isActive = true
                            this.modifiedAt = LocalDateTime.now()
                        }
                        tbUserMasterRepository.save(deletion)
                    }
                }

            } catch (e: Exception) {
                logger().debug { "[에러] 휴면 대상 데이터 패치 에러 (userId:${it.get(tbUserMaster.userId)!!})" }
            }
        }

        //데이터 패치 후 로그인 진행
        val userEntity: TbUserMaster = tbUserMasterRepository.findByUserId(subSt)
            .orElseThrow { throw BizException("휴면해제 사용자 조회에 실패하였습니다.") }

        return loginProcess(userEntity, request, true)
    }


    /**
     * name:
     * description: 스위칭 로그인
     * author: 정상철
     * created: 2025.06.09

     *
     * @return
     */
    fun switchUser(userId: String, request: HttpServletRequest): TbJwtTokenDto {
//        logger().info("loginData>>{}", loginData)
        val rememberMe = false
        val entity: TbUserMaster = tbUserMasterRepository.findByUserIdAndIsActive(userId)
            .orElseThrow { throw BizException("로그인에 실패하였습니다.") }
            return loginProcess(entity, request, rememberMe)

    }


    /**
     * name:
     * description:
     * author: 정상철
     * created:

     *
     * @return
     */
    fun loginw(
        request: HttpServletRequest
    ): UserInfo {
        val pUserInfo = UserInfoHelper.getLoginUserInfo()!!
        val tbJwtTokenDtoInput = TbJwtTokenDto(
            userId = pUserInfo.id
        )
//        logger().info { "tbJwtTokenDtoInput>>$tbJwtTokenDtoInput" }

        val tbJwtTokenDto = jwtTokenService.generateJwtToken(true, tbJwtTokenDtoInput, true, null, request)

//        val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth(tbJwtTokenDto.userId!!)
//        logger().debug { "generateJwtToken>userInfo>$userInfo" }
//        val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
//        SecurityContextHolder.getContext().authentication = authentication

        return UserInfoHelper.getLoginUserInfo()!!
    }
}