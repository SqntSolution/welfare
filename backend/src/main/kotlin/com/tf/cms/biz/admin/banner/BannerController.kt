package com.tf.cms.biz.admin.banner

import com.tf.cms.common.model.PagingRequest
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[관리자] 배너 API")
@RestController
@RequestMapping("/api/v1/admin/banner")
class BannerController (
        private val bannerService: BannerService
){
    private val logger = logger()

    @Operation(
            summary = "배너 목록 조회 (관리자)",
            responses = [
                ApiResponse(responseCode = "200", description = "ok", content = [
                    Content(schema = Schema(implementation = BannerDto::class))
                ])
            ],
            parameters = [
                Parameter(name = "pageNumber", `in` = ParameterIn.QUERY),
                Parameter(name = "pageSize", `in` = ParameterIn.QUERY)
            ]
    )

    @GetMapping("")
    fun findBannerList(
            @Parameter(hidden = true) pageable: PagingRequest
    ): ResponseEntity<Page<BannerDto>> {
        val result = bannerService.findBannerList(pageable.toPageable())
        return ResponseEntity.ok(result)
    }
    
    @Operation(summary = "배너 단건 조회 (관리자)")
    @GetMapping("/{bannerId}")
    fun findBanner(@PathVariable("bannerId") bannerId : Int): ResponseEntity<BannerDto>{
        logger.debug { "=== params : $bannerId" }
        val result = bannerService.findBanner(bannerId)
        return ResponseEntity.ok(result)
    }


    @Operation(summary = "배너 저장 (관리자)")
    @PostMapping("")
    fun saveBanner(@Valid @RequestBody bannerRequestDTO: BannerRequestDTO): ResponseEntity<Any> {
        logger.debug { "=== params : $bannerRequestDTO" }
        bannerService.saveBanner(bannerRequestDTO)
        return ResponseEntity.ok(HttpStatus.OK)
    }


    @Operation(summary = "배너 삭제 (관리자)")
    @DeleteMapping("/{bannerId}")
    fun deleteBanner(@PathVariable("bannerId") bannerId: Int): ResponseEntity<Any> {
        logger.debug { "=== params : $bannerId" }
        bannerService.deleteBanner(bannerId)
        return ResponseEntity.ok(HttpStatus.OK)
    }







}