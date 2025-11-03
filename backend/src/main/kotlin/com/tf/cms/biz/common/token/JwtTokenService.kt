package com.tf.cms.biz.common.token

import com.tf.cms.biz.common.login.RegisterData
import com.tf.cms.biz.common.login.UserService
import com.tf.cms.biz.common.sso.AdSSOLoginService
import com.tf.cms.common.jpa.dto.TbJwtTokenDto
import com.tf.cms.common.jpa.entity.TbJwtToken
import com.tf.cms.common.jpa.repository.TbUserMasterRepository
import com.tf.cms.common.jpa.repository.TbJwtTokenRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.SimpleAuthToken
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.JwtTokenUtil
import com.tf.cms.common.utils.logger
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

/**
 * packageName    : com.tf.cms.biz.common.token
 * fileName       : JwtTokenService
 * author         : 정상철
 * date           : 2025-05-12
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-12        정상철       최초 생성
 */

@Service
class JwtTokenService(
    @Value("\${jwt.auth.secret}") private var authKey: String,
    @Value("\${jwt.auth.expiration}") private val expiration: Long,
    @Value("\${jwt.auth.access-token-expiration}") private val accessTokenExpiration: Long,
    @Value("\${jwt.auth.refresh-token-expiration}") private val refreshTokenExpiration: Long,
    @Value("\${jwt.email.secret}") private var emailKey: String,
    @Value("\${jwt.email.expiration}") private val emailExpiration: Long,
    @Value("\${jwt.email.draw-expiration}") private val drawExpiration: Long,
    private val jwtTokenRepository: TbJwtTokenRepository,
    private val adSSOLoginService: AdSSOLoginService,
) {

    /**
     * name: generateJwtToken
     * description: 토큰발급
     * author: 정상철
     * created:
     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun generateJwtToken(
        ck: Boolean,
        tbJwtTokenDto: TbJwtTokenDto,
        rememberMe: Boolean?,
        registerData: RegisterData?,
        request: HttpServletRequest
    ): TbJwtTokenDto {
        logger().debug { "rememberMe>>$rememberMe" }

        val savedToken = TbJwtToken().apply {
            this.userId = tbJwtTokenDto.userId
            this.accessToken = null
            this.refreshToken = null
            this.issuedAt = LocalDateTime.now()
            this.expiresAt = LocalDateTime.now()
            this.revoked = false
            this.ipAddress = getClientIp(request)
            this.userAgent = request.getHeader("User-Agent") ?: null
        }
        jwtTokenRepository.save(savedToken)
        logger().debug { "savedToken>$savedToken" }

        val jwtId = savedToken.jwtId!!
        val accessToken: String
        val expirationTime: Long
        val key: String
        if (ck) {
            val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth(tbJwtTokenDto.userId!!)
            logger().debug { "generateJwtToken>userInfo>$userInfo" }
            val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
            SecurityContextHolder.getContext().authentication = authentication

            authentication.jwtId = jwtId
            key = authKey
            accessToken = JwtTokenUtil().createToken(authentication, key, accessTokenExpiration)
            expirationTime = if (rememberMe == true) {
                expiration
            } else {
                refreshTokenExpiration
            }
        } else {
            registerData?.jwtId = jwtId
            registerData?.userId = tbJwtTokenDto.userId
            key = emailKey
            logger().debug { "generateJwtToken>registerData>$registerData" }
            accessToken = JwtTokenUtil().createEmailVerificationToken(registerData!!, key, emailExpiration)
            expirationTime = drawExpiration
        }
        val refreshToken = UUID.randomUUID().toString() // Refresh Token은 UUID로 생성

        val issuedAtMillis = JwtTokenUtil().issuedAtTime(accessToken, key) // 발급된 시간
        val expiresAtMillis = expirationTime // 만료 시간

        val issuedAt = Instant.ofEpochMilli(issuedAtMillis)
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime()
        val expiresAt = issuedAt.plusSeconds(expiresAtMillis / 1000)

        val entity = jwtTokenRepository.findById(jwtId).orElseThrow()

        entity.apply {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.issuedAt = issuedAt
            this.expiresAt = expiresAt
        }
        jwtTokenRepository.save(entity)
        logger().debug { "entity>$entity" }

        // DTO 반환
        return TbJwtTokenDto(
            jwtId = entity.jwtId,
            userId = entity.userId,
            accessToken = entity.accessToken,
            refreshToken = entity.refreshToken,
            issuedAt = entity.issuedAt,
            expiresAt = entity.expiresAt,
            revoked = entity.revoked,
            ipAddress = entity.ipAddress,
            userAgent = entity.userAgent
        )
    }

    /**
     * name: refreshAccessToken
     * description: jwtId 을 이용한 Access Token 재발급
     * author: 정상철
     * created:
     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun jwtIdAccessToken(jwtId: Int, ck: Boolean, registerData: RegisterData?): TbJwtTokenDto {
        val tokenEntity = jwtTokenRepository.findById(jwtId).orElseThrow { throw BizException("존재하지 않는 토큰입니다.") }
        return if (!this.isTokenExpired(jwtId)) {
            val newAccessToken: String
            if (ck) {
                logger().debug { "11111" }
                val userInfo: UserInfo = adSSOLoginService.findUserInfoAndAuth(tokenEntity.userId!!)
                val authentication: SimpleAuthToken = SimpleAuthToken.fromUserInfo(userInfo)
                SecurityContextHolder.getContext().authentication = authentication
                authentication.jwtId = jwtId
                newAccessToken =
                    JwtTokenUtil().createToken(authentication, authKey, accessTokenExpiration)
            } else {
                logger().debug { "22222" }
                registerData?.jwtId = jwtId
                registerData?.userId = tokenEntity.userId
                logger().debug { ">>>>$registerData" }
                newAccessToken =
                    JwtTokenUtil().createEmailVerificationToken(registerData!!, emailKey, emailExpiration)
            }

            val updatedToken = tokenEntity.apply {
                this.accessToken = newAccessToken
            }
            jwtTokenRepository.save(updatedToken)

            TbJwtTokenDto(
                jwtId = updatedToken.jwtId,
                userId = updatedToken.userId,
                accessToken = updatedToken.accessToken,
                refreshToken = updatedToken.refreshToken,
                issuedAt = updatedToken.issuedAt,
                expiresAt = updatedToken.expiresAt,
                revoked = updatedToken.revoked,
                ipAddress = updatedToken.ipAddress,
                userAgent = updatedToken.userAgent
            )
        } else {
            logger().debug { "33333" }
            TbJwtTokenDto(
                jwtId = tokenEntity.jwtId,
                userId = tokenEntity.userId,
                accessToken = tokenEntity.accessToken,
                refreshToken = tokenEntity.refreshToken,
                issuedAt = tokenEntity.issuedAt,
                expiresAt = tokenEntity.expiresAt,
                revoked = tokenEntity.revoked,
                ipAddress = tokenEntity.ipAddress,
                userAgent = tokenEntity.userAgent
            )
        }
    }

    /**
     * name: revokeJwtToken
     * description: JWT 토큰 강제 만료 (로그아웃 처리 등)
     * author: 정상철
     * created:
     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun revokeJwtToken(jwtId: Int): Boolean {
        logger().debug { "revokeJwtToken>$jwtId" }
        val tokenEntity = jwtTokenRepository.findById(jwtId).orElse(null)
        return if (tokenEntity != null) {
            tokenEntity.revoked = true
            jwtTokenRepository.save(tokenEntity)
            true
        } else {
            false
        }
    }

    /**
     * name: isTokenExpired
     * description: 만료된 토큰 체크
     * author: 정상철
     * created:
     *
     * @return
     */
    fun isTokenExpired(jwtId: Int): Boolean {
        val tokenEntity = jwtTokenRepository.findById(jwtId).orElseThrow { BizException("해당 토큰 미존재") }

        val isExpired = tokenEntity.expiresAt?.isBefore(LocalDateTime.now()) == true
        val isRevoked = tokenEntity.revoked == true

//        logger().debug { "isExpired>$isExpired" }
//        logger().debug { "isRevoked>$isRevoked" }
//        logger().debug { "isExpired || isRevoked>${isExpired || isRevoked}" }
        return isExpired || isRevoked //true == 만료
    }

    /**
     * Refresh Token 을 이용한 Access Token 재발급
     */
    fun refreshAccessToken(refreshToken: String): String {
        val entity = jwtTokenRepository.findByRefreshToken(refreshToken).orElseThrow { BizException("해당 토큰 미존재") }
        val jwtId = entity.jwtId!!
        val res = this.jwtIdAccessToken(jwtId, true, null)
        return res.accessToken!!
    }

    /**
     * name:
     * description: JWT 토큰 복호화
     * author: 정상철
     * created:

     *
     * @return
     */

    fun decodeJwtClaims(token: String): Map<String, String?>{ //authKey
        try {
//            logger().debug {"token 이름: ${"token"}, 값: ${token}" }
            val parts = token.split(".")
            if (parts.size != 3) {
                throw IllegalArgumentException("JWT token format 에러")
            }
            val header = String(Base64.getUrlDecoder().decode(parts[0]))
            val payload = String(Base64.getUrlDecoder().decode(parts[1]))
//            logger().debug {"token header: ${"header"}, 값: ${header}" }
//            logger().debug {"token payload: ${"payload"}, 값: ${payload}" }

            val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))
            val claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload

//            logger().debug { "claims>>$claims" }
            return claims.entries.associate { (k, v) -> k to v?.toString() }
        } catch (e: Exception) {
            println("JWT 검증 실패 또는 만료됨: ${e.message}")
            return emptyMap()
        }
    }

    /**
     * ip 조회
     */
    fun getClientIp(request: HttpServletRequest): String {
        val headerNames = listOf(
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        )
        //nginx 설정 하면 담김
//        proxy_set_header Host $host;
//        proxy_set_header X-Real-IP $remote_addr;
//        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        for (header in headerNames) {
            val ip = request.getHeader(header)
            if (!ip.isNullOrEmpty() && !"unknown".equals(ip, ignoreCase = true)) {
                return ip.split(",").first().trim() // 여러 IP 중 첫 번째가 클라이언트 IP
            }
        }
        return request.remoteAddr
    }
}