package com.tf.cms.common.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.servers.Server
import org.springframework.context.annotation.Configuration

// https://www.baeldung.com/spring-boot-swagger-jwt
// https://www.baeldung.com/spring-rest-openapi-documentation
// https://springdoc.org/#springdoc-openapi-core-properties
@OpenAPIDefinition(
    servers = arrayOf(
            Server(url="http://localhost"),
            Server(url="http://cms.local"),
            Server(url="http://localhost:9000"),
            Server(url="http://cms.local:9000"),
            Server(url="http://cms.remote:81"),
            Server(url="http://172.27.37.56:81"),
//            Server(url="http://10.210.52.60"),
    ),
    info = Info(title = "TF-CMS API 명세서", description = "TF-CMS API 명세서", version = "v1")
)
@Configuration
class SwaggerConfig {

//    private fun createAPIKeyScheme(): SecurityScheme {
//        return SecurityScheme().type(SecurityScheme.Type.HTTP)
//            .bearerFormat("JWT")
//            .scheme("bearer")
//    }
//
//    @Bean
//    fun openAPI(): OpenAPI {
//        return OpenAPI().addSecurityItem(
//            SecurityRequirement().addList("Bearer Authentication")
//        ).components(Components().addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()))
//    }
}