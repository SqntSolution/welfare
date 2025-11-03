package com.tf.cms.common.config

import com.tf.cms.common.utils.logger
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import com.fasterxml.jackson.module.kotlin.KotlinFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.addDeserializer
import com.fasterxml.jackson.module.kotlin.addSerializer
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonConfig {
    companion object {
        val dateFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        val datetimeFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")

        fun javaModule(): JavaTimeModule {
            val javaTimeModule = JavaTimeModule()

            javaTimeModule.addSerializer(LocalDate::class, LocalDateSerializer(dateFormatter))
            javaTimeModule.addSerializer(LocalDateTime::class, LocalDateTimeSerializer(datetimeFormatter))

            javaTimeModule.addDeserializer(LocalDate::class, LocalDateDeserializer(dateFormatter))
            javaTimeModule.addDeserializer(LocalDateTime::class, LocalDateTimeDeserializer(datetimeFormatter))

            return javaTimeModule
        }
    }

    private val logger = logger()

//    @Bean  => 아래 jackson2ObjectMapperBuilderCustomizer만 있어야 제대로 적용됨.
    fun objectMapper(): ObjectMapper {
        logger.info { "=== objectMapper()" }
        val objectMapper = ObjectMapper()
//    val javaTimeModule = JavaTimeModule()
//
//    javaTimeModule.addSerializer(LocalDate::class, LocalDateSerializer(dateFormatter))
//    javaTimeModule.addSerializer(LocalDateTime::class, LocalDateTimeSerializer(datetimeFormatter))
//
//    javaTimeModule.addDeserializer(LocalDate::class, LocalDateDeserializer(dateFormatter))
//    javaTimeModule.addDeserializer(LocalDateTime::class, LocalDateTimeDeserializer(datetimeFormatter))

        objectMapper.registerModule(javaModule())

        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

        objectMapper.registerModule(
            KotlinModule.Builder()
                .withReflectionCacheSize(512)
                .configure(KotlinFeature.NullToEmptyCollection, true)
                .configure(KotlinFeature.NullToEmptyMap, true)
                .configure(KotlinFeature.NullIsSameAsDefault, true)
                .configure(KotlinFeature.SingletonSupport, false)
                .configure(KotlinFeature.StrictNullChecks, false)
                .build()
        )

        return objectMapper

    }

    /**
     * 위에껀 빼고, 아래만 있어야 제대로 적용됨.
     */
    @Bean
    fun jackson2ObjectMapperBuilderCustomizer(): Jackson2ObjectMapperBuilderCustomizer =
        Jackson2ObjectMapperBuilderCustomizer { builder ->
            builder.featuresToDisable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
            builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            builder.serializationInclusion(JsonInclude.Include.NON_NULL)
            builder.failOnUnknownProperties(false)
            builder.failOnEmptyBeans(false)
            builder.modules(javaModule())
        }
}


