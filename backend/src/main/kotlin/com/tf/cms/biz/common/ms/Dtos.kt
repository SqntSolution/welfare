package com.tf.cms.biz.common.ms

import com.fasterxml.jackson.annotation.JsonProperty

data class TeamsNotiData (
        @JsonProperty("NOTITYPE")
        var NOTITYPE: String? = null,       // 알림구분(approval/mail/board/default/others 등)
        @JsonProperty("USERID")
        var USERID: String? = null,         // 수신자 AD ID
        @JsonProperty("SENDER")
        var SENDER: String? = null,         // 발신자명
        @JsonProperty("NOTYSTR")
        var NOTYSTR: String? = null,        // 알림내용
        @JsonProperty("POSTDATE")
        var POSTDATE: String? = null,       // 알림발송날짜
        @JsonProperty("WEBLINKURL")
        var WEBLINKURL: String? = null,     // 알림내용 팝업 웹URL
        @JsonProperty("MOBILELINKURL")
        var MOBILELINKURL: String? = null,  // 알림내용 팝업 모바일URL
)

data class TeamsNotiResult (
        @JsonProperty("RESULT")
        var RESULT: String? = null,
        @JsonProperty("REASON")
        var REASON: String? = null
)