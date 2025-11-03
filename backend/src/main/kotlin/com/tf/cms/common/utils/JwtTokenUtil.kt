package com.tf.cms.common.utils

import com.tf.cms.biz.common.login.RegisterData
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.SimpleAuthToken
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import java.security.SignatureException
import java.util.*
import java.util.stream.Collectors


/**
 * packageName    : com.tf.cms.common.utils
 * fileName       : JwtTokenUtil
 * author         : 김정규
 * date           : 25. 4. 10. 오후 2:19
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 10. 오후 2:19        김정규       최초 생성
 */
@Component
class JwtTokenUtil {
    // JWT Token 발급
    @Throws(Exception::class)
    fun createToken(authentication: SimpleAuthToken, authKey: String?, expireTimeMs: Long?): String {
        logger().info("createToken")
        val authorities: String = authentication.getAuthorities().stream()
            .map { obj: GrantedAuthority -> obj.authority }
            .collect(Collectors.joining(","))

//        val menuRole: String = Arrays.toString(authentication.getMenuRole())
//        logger().info("menuRole: {}", menuRole)
        val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))

        return Jwts.builder()
            .subject(EncDecryptor.encrypt(authentication.getPrincipal().toString()))
            .claim("theAuth", EncDecryptor.encrypt(authorities))
            .claim("theName", EncDecryptor.encrypt(authentication.theName))
            .claim("theEmail", EncDecryptor.encrypt(authentication.email))
            .claim("thePhone", EncDecryptor.encrypt(authentication.phone))
            .claim("theTeamCode", EncDecryptor.encrypt(authentication.teamCode))
            .claim("theTeamName", EncDecryptor.encrypt(authentication.teamName))
            .claim("theAvatarImgPath", EncDecryptor.encrypt(authentication.avatarImgPath))
            .claim("theAuthGroup", EncDecryptor.encrypt(authentication.authGroup.toString()))
            .claim(
                "theContentsManagerAuthMenuIds",
                EncDecryptor.encrypt(authentication.contentsManagerAuthMenuIds.toString())
            )
            .claim(
                "authLevel",
                EncDecryptor.encrypt(authentication.authLevel.toString())
            )
            .claim("theJwtId", EncDecryptor.encrypt(authentication.jwtId.toString()))
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + expireTimeMs!!))
            .signWith(key)
            .compact()
    }

    /**
     * 이메일 인증 토큰 생성
     */
    @Throws(Exception::class)
    fun createEmailVerificationToken(
        registerData: RegisterData,
        authKey: String,
        expireTimeMs: Long,
    ): String {
//        logger().info("createEmailVerificationToken")
//        logger().debug { "registerData>>>$registerData"}
        val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))

        return Jwts.builder()
            .claim("ck", EncDecryptor.encrypt(registerData.ck))
            .claim("userId", EncDecryptor.encrypt(registerData.userId))
            .claim("loginId", EncDecryptor.encrypt(registerData.loginId))
            .claim("passwd", EncDecryptor.encrypt(registerData.passwd))
            .claim("name", EncDecryptor.encrypt(registerData.name))
            .claim("email", EncDecryptor.encrypt(registerData.email))
            .claim("url", EncDecryptor.encrypt(registerData.url))
            .claim("phone", EncDecryptor.encrypt(registerData.phone))
            .claim("option", EncDecryptor.encrypt(registerData.option))
            .claim("jwtId", EncDecryptor.encrypt(registerData.jwtId.toString()))
            .claim("publicKey", EncDecryptor.encrypt(registerData.key))
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + expireTimeMs))
            .signWith(key)
            .compact()
    }

    /**
     * 이메일 인증 토큰 해석
     */
    @Throws(Exception::class)
    fun parseEmailVerificationToken(token: String, authKey: String): RegisterData {
//        logger().info("parseEmailVerificationToken")
        val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))
        val registerData = RegisterData()

        try {
            // 2. Refresh 토큰 유효성 검사 및 클레임 추출
            val claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload
//          logger().info("claims>>$claims")

            registerData.ck = claims["ck"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.userId = claims["userId"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.loginId = claims["loginId"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.passwd = claims["passwd"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.name = claims["name"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.email = claims["email"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.url = claims["url"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.phone = claims["phone"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.option = claims["option"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            registerData.jwtId = EncDecryptor.decrypt(claims["jwtId"].toString())!!.toInt()
            registerData.key = claims["publicKey"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""

        } catch (e: ExpiredJwtException) {
            throw BizException("토큰이 만료되었습니다.")
        } catch (e: MalformedJwtException) {
            throw BizException("잘못된 형식의 토큰입니다.")
        } catch (e: SignatureException) {
            throw BizException("서명이 유효하지 않은 토큰입니다.") // 여기서 SignatureException 처리
        } catch (e: BizException) {
            throw e // 이미 BizException이므로 다시 래핑하지 않음
        } catch (e: Exception) {
            throw BizException("알 수 없는 오류가 발생했습니다.>>$e") // 기타 예외 대비
        }

        return registerData
    }

    /**
     * 만료 시간
     */
    fun expirationTime(token: String?, authKey: String?): Long {
        val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))

        if (token.isNullOrBlank()) {
            return 0 // JWT 토큰이 빈값이거나 널일때
        }

        val claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload

        val tokenExpiration = claims.expiration.time // 밀리 초

        return tokenExpiration
    }

    /**
     * 발급 시간
     */
    fun issuedAtTime(token: String?, authKey: String?): Long {
        val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))

        if (token.isNullOrBlank()) {
            return 0 // JWT 토큰이 빈값이거나 널일때
        }

        val claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload

        val tokenExpiration = claims.issuedAt.time // 밀리 초

        return tokenExpiration
    }

    /**
     * 토큰 가져오기
     */
    fun getAuthentication(token: String?, authKey: String?): SimpleAuthToken? {
        try {
            val key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(authKey))
            val claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload

//            logger().debug { "claims>>$claims" }

            val authStrArr = if (claims["theAuth"] != null) {
                EncDecryptor.decrypt(claims["theAuth"].toString())!!.split(",".toRegex()).dropLastWhile { it.isEmpty() }
                    .toTypedArray()
            } else {
                arrayOf()
            }

//            logger().debug { "authStrArr>>$authStrArr" }

            val authorities: Collection<GrantedAuthority> = Arrays
                .stream(authStrArr)
                .map { SimpleGrantedAuthority(it) }
                .collect(Collectors.toList())

//            logger().debug { "authorities>>$authorities" }

            val userId = EncDecryptor.decrypt(claims.subject)
//            logger().debug { "userId>>$userId" }

            val userName = if (claims["theName"] != null) {
                EncDecryptor.decrypt(claims["theName"]!!.toString())
            } else {
                ""
            }
//            logger().debug { "userName>>$userName" }

            val decryptedAuthGroup = EncDecryptor.decrypt(claims["theAuthGroup"].toString())
                ?.removeSurrounding("[", "]")
                ?.split(",")
                ?.map { it.trim() }
                ?: listOf()

            val decryptedContentsManagerAuthMenuIds =
                EncDecryptor.decrypt(claims["theContentsManagerAuthMenuIds"].toString())
                    ?.removeSurrounding("[", "]")
                    ?.split(",")
                    ?.mapNotNull { it.trim().toIntOrNull() }
                    ?: listOf()

            // SimpleAuthToken 반환
            val authToken = SimpleAuthToken(userId!!, userName!!, authorities)
            authToken.email = claims["theEmail"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            authToken.phone = claims["thePhone"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            authToken.teamCode = claims["theTeamCode"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            authToken.teamName = claims["theTeamName"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            authToken.avatarImgPath = claims["theAvatarImgPath"]?.let { EncDecryptor.decrypt(it.toString()) } ?: ""
            authToken.authGroup = decryptedAuthGroup
            authToken.contentsManagerAuthMenuIds = decryptedContentsManagerAuthMenuIds
            authToken.authLevel = claims["authLevel"]?.let { EncDecryptor.decrypt(it.toString())?.toIntOrNull() } ?: 0
            authToken.jwtId = EncDecryptor.decrypt(claims["theJwtId"].toString())!!.toInt()

            logger().info("getAuthentication>authToken>>$authToken")

            return authToken

        } catch (e: ExpiredJwtException) {
            throw BizException("토큰이 만료되었습니다.")
        } catch (e: MalformedJwtException) {
            throw BizException("잘못된 형식의 토큰입니다.")
        } catch (e: SignatureException) {
            throw BizException("서명이 유효하지 않은 토큰입니다.") // 여기서 SignatureException 처리
        } catch (e: BizException) {
            throw e // 이미 BizException이므로 다시 래핑하지 않음
        } catch (e: Exception) {
            logger().error("JWT 인증 중 오류 발생: {}", e.message, e)
            throw BizException("알 수 없는 오류가 발생했습니다.") // 기타 예외 대비
        }
    }
}