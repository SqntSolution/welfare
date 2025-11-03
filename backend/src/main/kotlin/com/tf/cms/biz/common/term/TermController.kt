package com.tf.cms.biz.common.term

import com.tf.cms.common.jpa.dto.TbTermsDto
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

/**
 * packageName    : com.tf.cms.biz.common.term
 * fileName       : TermController
 * author         : 김정규
 * date           : 25. 5. 29. 오전 9:09
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 5. 29. 오전 9:09        김정규       최초 생성
 */
@Tag(name = "[공통] 약관 API")
@Controller
@RequestMapping("/api/v1/common/term")
class TermController(
    private val termService: TermService
) {

    @Operation(summary = "약관 조회")
    @GetMapping("/{termsTypeCode}")
    fun getTerm(
        @PathVariable("termsTypeCode") termsTypeCode: String
    ): ResponseEntity<List<TermDto>> {
        val res = termService.getTerm(termsTypeCode)
        return ResponseEntity.ok(res)
    }

    @Operation(summary = "약관 생성")
    @PostMapping("")
    fun insertTerm(@RequestBody tbTermsDto: TbTermsDto): ResponseEntity<Any> {
        termService.insertTerm(tbTermsDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @Operation(summary = "약관 수정")
    @PostMapping("/update")
    fun updateTerm(@RequestBody tbTermsDto: TbTermsDto): ResponseEntity<Any> {
        termService.updateTerm(tbTermsDto)
        return ResponseEntity.ok(HttpStatus.OK)
    }

}