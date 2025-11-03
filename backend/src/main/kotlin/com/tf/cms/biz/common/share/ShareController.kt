package com.tf.cms.biz.common.share

import com.tf.cms.common.jpa.repository.TbPostMetaStatisticRepository
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.transaction.Transactional
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[공통] 공유건수 API")
@RestController
@RequestMapping("/api/v1/common/share")
class ShareController(
        private val tbPostMetaStatisticRepository: TbPostMetaStatisticRepository
) {
    private val logger = logger()

    @Operation(summary = "공유건수 증가")
    @Transactional(rollbackOn = [Throwable::class])
    @PostMapping("/{postId}")
    fun saveUserScrap(@PathVariable("postId") postId: Int): ResponseEntity<String> {
        tbPostMetaStatisticRepository.increaseShareCnt(postId)
        return ResponseEntity.ok("ok")
    }
}