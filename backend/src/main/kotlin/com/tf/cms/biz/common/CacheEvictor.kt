package com.tf.cms.biz.common

import com.tf.cms.biz.common.sso.USERINFO_CACHE_KEY
import org.springframework.cache.annotation.CacheEvict
import org.springframework.stereotype.Component

/**
 * cache해 놓은 데이타들(login UserInfo등)의 cache를 삭제하려는 목적.
 */
@Component
class CacheEvictor {
    /**
     * caching해 놓은 UserInfo 정보를 삭제.
     */
    @CacheEvict(value = [USERINFO_CACHE_KEY], key = "#pUserId")
    fun clearUserInfoCache(pUserId: String) {
    }

    /**
     * UserInfo의 모든 cache 삭제.
     */
    @CacheEvict(value = [USERINFO_CACHE_KEY], allEntries = true)
    fun clearAllUserInfoCache() {
    }
}