package com.tf.cms.common.config

import com.github.benmanes.caffeine.cache.Caffeine
import java.util.concurrent.TimeUnit
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.caffeine.CaffeineCache
import org.springframework.cache.support.SimpleCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
@EnableCaching
class CacheConfig {

    /**
     * Cache manager
     *
     * @return
     */
    @Bean
    fun cacheManager(): CacheManager {
        val cacheManager = SimpleCacheManager()
        val caches: List<CaffeineCache> = listOf(
                CaffeineCache(
                        "loginUserInfo",
                        Caffeine.newBuilder().expireAfterWrite(10, TimeUnit.MINUTES).maximumSize(10_000).build()
                ),
//                CaffeineCache(
//                        "testInfo",
//                        Caffeine.newBuilder().expireAfterWrite(5, TimeUnit.SECONDS).maximumSize(10_000).build()
//                )
        )
        cacheManager.setCaches(caches)
        return cacheManager
    }

}