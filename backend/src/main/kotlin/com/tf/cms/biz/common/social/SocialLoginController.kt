package com.tf.cms.biz.common.social

import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * packageName    : com.tf.cms.biz.common.social
 * fileName       : SocialLoginController
 * author         : 정상철
 * date           : 2025-05-21
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21        정상철       최초 생성
 */
@Tag(name = "[공통] 소셜 로그인 API")
@RestController
@RequestMapping("/api/v1/common/social")
class SocialLoginController (
    private val socialLoginService: SocialLoginService
) {
    private val logger = logger()

//    /**
//     * name: socialLogin
//     * description: 소셜 로그인 정보조회
//     * author: 정상철
//     * created:
//
//     *
//     * @return
//     */
//    @Operation(summary = "소셜 로그인 정보조회")
//    @GetMapping("/login")
//    fun getSocialLoginInfo(socialData: SocialLoginDto){
//        socialLoginService.getSocialLoginInfo(socialData)
//    }
}