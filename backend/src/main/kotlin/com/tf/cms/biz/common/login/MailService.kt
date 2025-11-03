package com.tf.cms.biz.common.login

import com.tf.cms.common.utils.logger
import jakarta.mail.internet.MimeMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

/**
 * packageName    : com.tf.cms.biz.common.login
 * fileName       : MailService
 * author         : 김정규
 * date           : 25. 4. 17. 오후 2:19
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 17. 오후 2:19        김정규       최초 생성
 */
@Service
class MailService(
    private val javaMailSender: JavaMailSender
) {

    /**
     * 메일 발송
     */
    fun sendVerificationMail(emailData: EmailData) {
        val message: MimeMessage = javaMailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true, "UTF-8")

        helper.setTo(emailData.to!!)
        helper.setSubject(emailData.subject!!)
        helper.setText(emailData.text!!, true) // true → HTML 메일

        // 발신자 설정 (도메인 포함 주소 사용 권장)
        helper.setFrom("noreply@yourdomain.com", "CMS")

        // List-Unsubscribe 헤더 추가 (스팸 필터 우회에 도움)
        message.setHeader("List-Unsubscribe", "<mailto:${emailData.to}>")

        // 로깅
        logger().info { "Sending verification mail to ${emailData.to}" }
        logger().info { "Email Subject: ${emailData.subject}, Body: ${emailData.text}" }

        // 실제 전송
        javaMailSender.send(message)
    }

}
