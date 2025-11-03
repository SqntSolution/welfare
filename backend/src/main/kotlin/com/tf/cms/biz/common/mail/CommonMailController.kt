package com.tf.cms.biz.common.mail

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.tf.cms.biz.common.mail
 * fileName       : CommonMailController
 * author         : 정상철
 * date           : 2025-06-26
 * description    : 공통 메일 전송 서비스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-26        정상철       최초 생성
 */

@Tag(name = "[공통] 이메일 전송 API")
@RestController
@RequestMapping("/api/v1/common/email")
class CommonMailController (
    private val commonMailService: CommonMailService
){
    @Operation(summary = "문의 메일 전송")
    @PostMapping(path=["/inquiry"])
    fun sendInquiryMail( @RequestBody input:InquiryMailDto): ResponseEntity<String> {
        try {
            commonMailService.sendInquiryMail(input)
            return ResponseEntity.ok("문의 메일 전송 성공")
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("메일 전송 실패: ${e.message}")
        }
    }
}