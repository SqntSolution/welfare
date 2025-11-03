package com.tf.cms.biz.common.mail

import com.tf.cms.biz.common.ref.CommonRefService
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.logger
import jakarta.mail.internet.MimeMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

/**
 * packageName    : com.tf.cms.biz.common.mail
 * fileName       : CommonMailService
 * author         : 정상철
 * date           : 2025-06-25
 * description    : 공통 메일 전송 서비스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-25        정상철       최초 생성
 */
@Service
class CommonMailService (
    private val javaMailSender: JavaMailSender,
    private val commonRefService: CommonRefService
){

    /**
     * name:
     * description: 문의사항 메일 발송
     * author: 정상철
     * created:

     *
     * @return
     */
    fun sendInquiryMail(input:InquiryMailDto){

        val emailInquiry = commonRefService.findRefList("EMAIL_INQUIRY")

        val to = emailInquiry.find { it.code == "to" }?.label
            ?: throw BizException("수신자 이메일 설정이 없습니다.")
        val title = emailInquiry.find { it.code == "title" }?.label ?: "문의사항 도착"

        val from = input.email
        val mobileNo = input.mobileNo
        val messageBody = input.message

        // 이메일 본문 구성 (템플릿 사용 대신 직접 구성 예시)
        val body = """
        <h3>문의사항 도착</h3>
        <p><strong>이름:</strong> ${input.name}</p>
        <p><strong>이메일:</strong> $from</p>
        <p><strong>전화번호:</strong> $mobileNo</p>
        <p><strong>메시지:</strong><br/>${messageBody?.replace("\n", "<br/>")}</p>
    """.trimIndent()

        val emailData = EmailFormData().apply {
            this.to = to
            this.subject = title
            this.text = body
            this.from = from
        }

        sendVerificationMail(emailData)
    }




    /**
     * name:
     * description: 실제 메일 발송
     * author: 정상철
     * created:

     *
     * @return
     */
    fun sendVerificationMail(emailData: EmailFormData) {
        val message: MimeMessage = javaMailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true, "UTF-8")

        helper.setTo(emailData.to!!)
        helper.setSubject(emailData.subject!!)
        helper.setText(emailData.text!!, true) // true → HTML 메일

        // 발신자 설정 (도메인 포함 주소 사용 권장)
//        helper.setFrom("noreply@yourdomain.com", "CMS")
        helper.setFrom(emailData.from!!, "CMS")

        // List-Unsubscribe 헤더 추가 (스팸 필터 우회에 도움)
        message.setHeader("List-Unsubscribe", "<mailto:${emailData.to}>")

        // 로깅
        logger().info { "Sending verification mail to ${emailData.to}" }
        logger().info { "Email Subject: ${emailData.subject}, Body: ${emailData.text}" }

        // 실제 전송
        javaMailSender.send(message)
    }
}