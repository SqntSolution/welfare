package com.tf.cms.biz.common.scrap

import com.tf.cms.common.model.ResultValue2
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[공통] 스크랩 API")
@RestController
@RequestMapping("/api/v1/common/scrap")
class ScrapController(
        private val scrapService: ScrapService
) {
    private val logger = logger()

    @Operation(summary = "스크랩 저장")
    @PostMapping("/{postId}")
    fun saveUserScrap(@PathVariable("postId") postId: Int): ResponseEntity<ResultValue2<Boolean, Int>> {
        logger.debug { "=== saveScrap : $postId" }
        val (result, cnt) = scrapService.saveUserScrap(postId)
        return ResponseEntity.ok(ResultValue2(result, cnt))
    }
}