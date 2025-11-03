package com.tf.cms.biz.user.main

import com.tf.cms.common.jpa.entity.QTbPostContent
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.utils.UserInfoHelper
import com.querydsl.core.BooleanBuilder

object MainPostHelper {
    /**
     * [결론], 사용자 화면에서는 공개만 조회되도록.
     * 
     * Post 목록에 대한 기본 조회조건을 위한 QueryDsl where조건
     * (공개, 사용여부, 전략마케팅전용)
     * ROLE_CONTENTS_MANAGER(컨텐츠 관리자)인 경우에는 자기한테 권한이 있는 메뉴에 대해서는, 사용,공개여부를 체크하지 않음.
     */
    fun defaultPostListCondition(): BooleanBuilder {
        val tbPostContent = QTbPostContent.tbPostContent
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val role = userInfo.role
        val condition = BooleanBuilder()

        // 관리자 여부에 상관없이, 사용자화면에서는 공개중인 것만 조회
        condition.and(tbPostContent.enabled.eq(true)) // 사용
            .and(tbPostContent.openType.eq("public"))  // 공개
        
//        if (role == TheRole.ROLE_OPERATOR || role == TheRole.ROLE_MASTER) {
//            // 마스트와 운영관리자는 제약이 없이 몽땅 다 보임.
//
//        }else if(role == TheRole.ROLE_CONTENTS_MANAGER ){
//            // 컨텐츠 관리자는, 권한이 있는 메뉴들에 대해서는 몽땅 다 보이고, 권한이 없는 메뉴들은 사용중,공개중인 것만 보임
//            condition.and(tbPostContent.menu2Id.`in`(userInfo.contentsManagerAuthMenuIds)
//                .or((tbPostContent.enabled.eq(true)).and(tbPostContent.openType.eq("public"))))
//
//        }else{
//            // 일반 사용자는, 사용중,공개중인 것만 보임
//            condition.and(tbPostContent.enabled.eq(true)) // 사용
//                .and(tbPostContent.openType.eq("public"))  // 공개
//
//        }

        // 권한 레벨
        if (userInfo.authLevel!! >= 0) {
            condition.and(tbPostContent.authLevel.loe(userInfo.authLevel))
        }

        return condition
    }

    /**
     * Post 한건에 대한 기본 조회조건을 위한 QueryDsl where조건
     * (관리자는 모두 볼수 있게)
     * (공개, 사용여부, 전략마케팅전용)
     */
    fun defaultPostOneCondition(): BooleanBuilder {
        val tbPostContent = QTbPostContent.tbPostContent
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val role = userInfo.role
        val condition = BooleanBuilder()
        if (role == TheRole.ROLE_OPERATOR || role == TheRole.ROLE_MASTER) {
            // 마스트와 운영관리자는 제약이 없이 몽땅 다 보임.

        }else if(role == TheRole.ROLE_CONTENTS_MANAGER ){
            // 컨텐츠 관리자는, 권한이 있는 메뉴들에 대해서는 몽땅 다 보이고, 권한이 없는 메뉴들은 사용중,공개중인 것만 보임
            condition.and(tbPostContent.menu2Id.`in`(userInfo.contentsManagerAuthMenuIds)
                .or((tbPostContent.enabled.eq(true)).and(tbPostContent.openType.eq("public"))))

        }else{
            // 일반 사용자는, 사용중,공개중인 것만 보임
            condition.and(tbPostContent.enabled.eq(true)) // 사용
                .and(tbPostContent.openType.eq("public"))  // 공개

        }

        // 권한 레벨
        if (userInfo.authLevel!! >= 0 && (role != TheRole.ROLE_OPERATOR && role != TheRole.ROLE_MASTER)) {
            // 사용자가 전마가 아니면, 전마전용이 아닌 것들만 보이도록
            condition.and(tbPostContent.authLevel.loe(userInfo.authLevel))
        }

        return condition
    }

}