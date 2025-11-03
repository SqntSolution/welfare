package com.tf.cms.common.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import com.tf.cms.common.utils.logger


@Configuration
class CorsConfig {
    private val logger = logger()

    @Bean
    fun corsConfigurer(): WebMvcConfigurer? {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                logger.info("=== addCorsMappings")
                registry.addMapping("/**")  // [주의] ** 는 안되고 /** 처럼 앞에 /를 붙여야 한다.
                    .allowedMethods("*")
                    .allowedOrigins("*")
//                    .allowCredentials(true)
//                    .allowedHeaders("Authorization")
            }
        }
    }
}

