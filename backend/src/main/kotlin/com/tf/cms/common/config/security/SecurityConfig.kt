package com.tf.cms.common.config.security

import com.tf.cms.common.utils.logger
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@EnableWebSecurity
@EnableMethodSecurity(
    prePostEnabled = true,
    securedEnabled = true,
    jsr250Enabled = true
)
@Configuration
class SecurityConfig(
    private val theAuthenticationEntryPoint: TheAuthenticationEntryPoint,
    private val theAccessDeniedHandler: TheAccessDeniedHandler,
    private val authFilter: AuthFilter,
) {

    private val logger = logger()

    //    @Bean
//    fun passwordEncoder(): PasswordEncoder {
//        return BCryptPasswordEncoder()
//    }
    @Bean
    fun passwordEncoder(): PasswordEncoder =
        PasswordEncoderFactories.createDelegatingPasswordEncoder()

    @Bean
    @Throws(Exception::class)
    fun filterChain(
        httpSecurity: HttpSecurity,
        @Value("\${env}")
        env: String? = null,
    ): SecurityFilterChain {
        httpSecurity
            .httpBasic { it.disable() }
            .csrf { it.disable() }
            .exceptionHandling {
                it.accessDeniedPage("/access-denied.html")
                    .authenticationEntryPoint(theAuthenticationEntryPoint)
                    .accessDeniedHandler(theAccessDeniedHandler)
            }
//                .sessionManagement { sessionManagement ->
//                    sessionManagement
//                            .sessionConcurrency { sessionConcurrency ->
//                                sessionConcurrency
//                                        .maximumSessions(1)
//                                        .expiredUrl("/login?expired")
//                            }
//                }
            .authorizeHttpRequests {
                // 운영환경이 아니라면 허용
                if (env != "prod") {
                    it.requestMatchers(
                        "/api/v1/admin/dummy/user-switch/clear-session",
                    ).authenticated()
                }
                it.requestMatchers(
                    "/api/v1/test/**",
                    "/api/v1/auth/**",
                    "/api/v1/sso/**",
                    "/swagger/**",
                    "/api-docs/**",
                    "/v1/swagger/api-docs/**",
                    "/api-static/**",
                    "/api/v1/dummy/hc",
                    "/api/v1/common/**",
//                    "**/cs-center/**"
                ).permitAll()
                    .requestMatchers(HttpMethod.OPTIONS).permitAll()
                    .requestMatchers("/api/v1/admin/**").hasAnyRole("OPERATOR", "MASTER")
                    .requestMatchers("/api/v1/code/group").hasAnyRole("MASTER")
                    .anyRequest().hasAnyRole("VISITOR", "USER", "CONTENTS_MANAGER", "OPERATOR", "MASTER")
            }
            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter::class.java)

        return httpSecurity.build()
    }
}