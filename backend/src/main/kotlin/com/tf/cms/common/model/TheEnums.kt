package com.tf.cms.common.model

import java.time.LocalDateTime

enum class TheRole(val code: String, val label: String) {
    ROLE_VISITOR("ROLE_VISITOR", "방문자"),
    ROLE_USER("ROLE_USER", "일반 사용자"),
    ROLE_CONTENTS_MANAGER("ROLE_CONTENTS_MANAGER", "콘텐츠 관리자"),
    ROLE_OPERATOR("ROLE_OPERATOR", "운영 관리자"),
    ROLE_MASTER("ROLE_MASTER", "마스터 관리자")
    ;

    companion object {
        fun findLabel(label: String?): TheRole? = entries.find { it.label == label }
        fun findCode(code: String?): TheRole? = entries.find { it.code == code }
        // 콘텐츠 관리자의 유효 기간 확인
        fun validContentsManager(startDate: LocalDateTime?, endDate: LocalDateTime?): TheRole {
            val current = LocalDateTime.now()
            return if(startDate != null && endDate != null && current.isAfter(startDate) && current.isBefore(endDate))
                ROLE_CONTENTS_MANAGER
            else
                ROLE_USER
        }
    }
}

enum class MetaType(val code: String, val label: String) {
    VIEW("VIEW", "조회"),
    LIKES("LIKES", "좋아요"),
    SCRAP("SCRAP", "스크랩"),
    SHARE("SHARE", "공유")
    ;

    companion object {
        fun findLabel(label: String?): MetaType? = entries.find { it.label == label }
        fun findCode(code: String?): MetaType? = entries.find { it.code == code }
    }
}

enum class FileClassType(val code: String, val label: String) {
    POST("post", "post"),
    BBS("bbs", "bbs"),
    QNA("qna", "qna"),
    IMG("img", "img")
    ;

    companion object {
        fun findLabel(label: String?): FileClassType? = entries.find { it.label == label }
        fun findCode(code: String?): FileClassType? = entries.find { it.code == code }
    }
}

enum class MenuContentType(val code: String, val label: String) {
    PAGE("page", "Page"),
    POST("post", "Board"),  // DB에는 post로 저장되지만, 보여주기는 board로 보여줌.
    LINK("link", "Link"),
    SMART_FINDER("smartfinder", "Smartfinder"),
    CS_CENTER("cscenter", "Cscenter"),
    NOTICE("notice", "Notice"),
    FAQ("faq", "Faq"),
    QNA("qna", "Qna"),
    RELEASE("release", "Release");
//    ABOUT("about", "about"),
//    MANUAL("manual", "manual");

    companion object {
        fun findLabel(label: String?): MenuContentType? = entries.find { it.label == label }
        fun findCode(code: String?): MenuContentType? = entries.find { it.code == code }
    }
}

enum class SearchType(val code: String, val label: String) {
    POST("POST", "POST"),
    FILE("FILE", "FILE")
    ;

    companion object {
        fun findLabel(label: String?): SearchType? = entries.find { it.label == label }
        fun findCode(code: String?): SearchType? = entries.find { it.code == code }
    }
}

enum class DetailsType(val code: String) {
    pdf("pdf"),
    editor("editor")
    ;

    companion object {
        fun findCode(code: String?): DetailsType? = entries.find { it.code == code }
    }
}

/**
 * 첨부파일에서 file_class .
 * (post, bbs, qna중 한개)
 */
enum class FileClass{
    post, // post 또는 page
    bbs,  // 공지 또는 faq
    qna,  // Q&A
}

/**
 * tb_user_history의 actionType
 */
enum class UserHistoryActionType(val code: String, val label: String) {
    login("login", "접속"),
    post_view("post_view", "Post 조회"),
    post_register("post_register", "Post 등록"),
    file_download("file_download", "파일 다운로드"),
    post_modify("post_modify", "Post 수정"),
    post_delete("post_delete", "Post 삭제"),
    subscribe("subscribe", "메뉴 구독"),
    subscribe_remove("subscribe_remove", "메뉴 구독 해제"),
    post_scrap("post_scrap", "Post 스크랩"),
    post_scrap_remove("post_scrap_remove", "Post 스크랩 해제"),
    post_likes("post_likes", "Post 좋아요"),
    post_likes_remove("post_likes_remove", "Post 좋아요 해제"),
    qna_request("qna_request", "Q&A 요청 등록"),
    qna_response("qna_response", "Q&A 답변 등록"),
    comment("comment", "댓글 등록");

    companion object {
        fun findLabel(label: String?): UserHistoryActionType? = entries.find { it.label == label }
        fun findCode(code: String?): UserHistoryActionType? = entries.find { it.code == code }
    }
}

/**
 * 공지사항 유형 (0: 일반, 1: 중요)
 */
enum class NoticeType(val code: String, val label: String) {
    NORMAL("0", "일반"),
    IMPORTANT("1", "중요")
    ;

    companion object {
        fun findLabel(label: String?): NoticeType? = entries.find { it.label == label }
        fun findCode(code: String?): NoticeType? = entries.find { it.code == code }
    }
}


/**
 * 알림 발송상태
 */
enum class AlarmSendStatus(val label: String) {
    WAIT("발송 예약"),
    COMPLETE("발송 완료")
}

/**
 * 알림 발송대상 유형
 */
enum class AlarmSendTarget {
    USER,
    TEAM
}


enum class DefaultGroupAuth(val code: String, val label: String) {
    VISITOR("1747639035602", "방문자"),
    USER("1747717630907", "일반 사용자 그룹"),
    ;

    companion object {
        fun findLabel(label: String?): DefaultGroupAuth? = entries.find { it.label == label }
        fun findCode(code: String?): DefaultGroupAuth? = entries.find { it.code == code }
    }
}


/**
 * name:
 * description: 포스트 카테고리 종류
 * author: 정상철
 * created:

 *
 * @return
 */


enum class PostCategoryType(val code: String, val label: String) {
    SALES("sales","판매제품 상세페이지"),
    PHOTO("photo", "포토 슬라이드가 있는 상세페이지"),
    EDITOR("editor", "기존 에디터 상세 페이지");

    companion object {
        fun findLabel(label: String?): PostCategoryType? = entries.find { it.label == label }
        fun findCode(code: String?): PostCategoryType? = entries.find { it.code == code }
    }
}