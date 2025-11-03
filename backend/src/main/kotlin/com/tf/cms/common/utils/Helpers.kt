package com.tf.cms.common.utils

import com.tf.cms.common.model.BizException
import jakarta.servlet.http.HttpServletRequest
import java.math.BigInteger
import java.security.MessageDigest
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import mu.KotlinLogging
import org.slf4j.LoggerFactory
import java.security.PrivateKey
import javax.crypto.Cipher
import java.util.Base64

inline fun <reified T> T.logger() = KotlinLogging.logger(T::class.java.canonicalName)!!
//inline fun <reified T> T.logger() = LoggerFactory.getLogger(T::class.java)!!
//  KotlinLogging.logger{}

annotation class DefaultConstructor
// com.cosmax.conact.common.utils.DefaultConstructor

val dateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd")
val dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")
val timeStampFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
val yyyyMMddHHmmFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm")
val yyyyMMddFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")
val yyyyMMFormatter = DateTimeFormatter.ofPattern("yyyyMM")

object Helpers{
    fun formatDate(date:LocalDate?): String? {
        return if(date!=null) dateFormatter.format(date) else null
    }
    fun formatDate(date: LocalDateTime?): String? {
        return if(date!=null) dateFormatter.format(date) else null
    }
    fun formatLocalDate(date: LocalDate?): String? {
        return if(date!=null) yyyyMMddFormatter.format(date) else null
    }
    fun formatDateTime(date: LocalDateTime?): String? {
        return if(date!=null) dateTimeFormatter.format(date) else null
    }
    fun formatLocalDateTime(date: LocalDateTime?): String? {
        return if(date!=null) yyyyMMddHHmmFormatter.format(date) else null
    }
    fun formatTimeStamp(date: LocalDateTime?): String? {
        return if(date!=null) timeStampFormatter.format(date) else null
    }
    fun formatDateToYearAndMonth(date: LocalDate): String {
        return yyyyMMFormatter.format(date)
    }

    fun checkFilename(vararg filename:String?){
        filename?.find { it!!.indexOf("..")>-1}
            ?.let { throw BizException("유효하지 않은 문자가 포함됨 ($it)") }
    }

    fun formatStringToLocalDate(stringDate: String): LocalDate? {
        val date = stringDate.replace(Regex("[-/.]"), "")
        return if (date.length == 8) {
            LocalDate.parse(date, yyyyMMddFormatter)
        } else {
            null
        }
    }
    fun formatStringToLocalDateTime(stringDateTime: String?): LocalDateTime? {
        val date = stringDateTime?.replace(Regex("[-/.]"), "")
        return if (date?.length == 12) {
            LocalDateTime.parse(date, yyyyMMddHHmmFormatter)
        } else {
            null
        }
    }

    /**
     * 복호화
     */
    fun decrypt(encryptedData: String?, privateKey: PrivateKey?): String {
        val cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding") // 일반적인 RSA 설정
        cipher.init(Cipher.DECRYPT_MODE, privateKey)

        val encryptedBytes = Base64.getDecoder().decode(encryptedData)
        val decryptedBytes = cipher.doFinal(encryptedBytes)

        return String(decryptedBytes, Charsets.UTF_8)
    }

    /**
     * 주소의 문자열 매핑
     */
    fun resolveTemplate(template: String, variables: Map<String, String>): String {
        var result = template
        for ((key, value) in variables) {
            result = result.replace("\${$key}", value)
        }
        return result
    }

    /**
     * name:
     * description: 전화번호 마스킹
     * author: 정상철
     * created: 2025-07-08

     *
     * @return
     */
    fun maskPhone(phone: String?): String? {
        if (phone.isNullOrBlank()) return phone

        // 숫자만 추출
        val digits = phone.filter { it.isDigit() }

        return when {
            digits.length == 10 -> {
                // 3-3-4 (예: 0311234567)
                digits.replace(Regex("(\\d{3})(\\d{3})(\\d{4})"), "$1-***-$3")
            }
            digits.length == 11 -> {
                // 3-4-4 (예: 01012345678)
                digits.replace(Regex("(\\d{3})(\\d{4})(\\d{4})"), "$1-****-$3")
            }
            digits.length in 8..9 -> {
                // 서울 지역번호 2자리 + 나머지 (예: 021231234)
                val part1 = digits.take(2)
                val part2 = digits.drop(2).take(digits.length - 6)
                val part3 = digits.takeLast(4)
                "$part1-$part2***-$part3"
            }
            else -> phone // 위에 해당하지 않으면 원본 반환
        }
    }

    /**
     * name:
     * description: 이메일 마스킹
     * author: 정상철
     * created: 2025-07-08

     *
     * @return
     */
    fun maskEmail(email: String?): String? {
        if (email.isNullOrBlank()) return email

        val parts = email.split("@")
        if (parts.size != 2) return email

        val id = parts[0]
        val domain = parts[1]

        val maskedId = when {
            id.length <= 1 -> "*"
            id.length == 2 -> id[0] + "*"
            else -> id.take(2) + "*".repeat(id.length - 2)
        }

        return "$maskedId@$domain"
    }

    /**
     * name:
     * description: 모바일 접속여부
     * author: 정상철
     * created: 2025-07-08

     *
     * @return
     */
    fun isMobile(request: HttpServletRequest): Boolean {
        val userAgent = request.getHeader("User-Agent")?.lowercase() ?: return false
        return listOf("android", "iphone", "ipad", "mobile").any { userAgent.contains(it) }
    }
}

object SHA512 {
    val logger =  LoggerFactory.getLogger(SHA512::class.java)
    fun hash(dataHash: String): String? {
        return try {
            val msg = MessageDigest.getInstance("SHA-512")
            msg.update(dataHash.toByteArray())

            String.format("%0128x", BigInteger(1, msg.digest()))
        } catch (e: Exception) {
            logger.warn("(무시) SHA512포맷중 에러 : $e" )
            throw BizException("SHA512 포맷 중 에러")
        }
    }
}

