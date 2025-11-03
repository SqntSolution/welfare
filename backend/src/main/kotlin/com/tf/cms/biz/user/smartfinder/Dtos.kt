package com.tf.cms.biz.user.smartfinder

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
data class SmartFinderParams(
        var nations: List<String>? = null,          // 국가
        var topics: List<String>? = null,           // 주제
        var startDate: String? = null,              // 등록시작일
        var endDate: String? = null,                // 등록종료일
        var fileTypes: List<String>? = null,        // file의 종류 (PPT, PDF, EXCEL, MOVIE, IMAGE 등)
        var keywords: List<String>? = null,         // 검색어
        var authLevel: Int? = null,
        var order: String? = null,                  // 정렬 (최신순, 조회수 높은순)
        var tag: String? = null
) {
    // 정렬 (기본: 최신순)
    fun isNewOrder(): Boolean {
        return order != "count"
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class SmartFinderKeywords(
        var keywords: List<String>? = null, // 검색어
)

data class SmartFinderPostDto(
        var id: Int? = null,
        var postType: String? = null,
        var title: String? = null,
        var description: String? = null,
        var openType: String? = null,
        var enabled: Boolean? = false,
        var representativeImagePath: String? = null,
        var authLevel: Int? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menuNm1: String? = null,
        var menuNm2: String? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var recommendAt: LocalDateTime? = null,
        var monthlyViewCnt: Int? = null,
        var viewCnt: Int? = null,
        var likesCnt: Int? = null,
        var userLikeYn: Boolean? = false,
        var userScrapYn: Boolean? = false,
)

data class SmartFinderFileDto(
        var postId: Int? = null,
        var title: String? = null,
        var postType: String? = null,
        var openType: String? = null,
        var enabled: Boolean? = false,
        var authLevel: Int? = null,
        var menu1Id: Int? = null,
        var menu2Id: Int? = null,
        var menuNm1: String? = null,
        var menuNm2: String? = null,
        var fileId: Int? = null,
        var fileClass: String? = null,
        var fileNm: String? = null,
        var fileExtension: String? = null,
        var filePath: String? = null,
        var fileSize: Long? = null,
        var downloadCnt: Int? = null,
        var createdAt: LocalDateTime? = null,
        var createdUserId: String? = null,
        var createdUserNm: String? = null,
        var modifiedAt: LocalDateTime? = null,
        var modifiedUserId: String? = null,
        var modifiedUserNm: String? = null
)