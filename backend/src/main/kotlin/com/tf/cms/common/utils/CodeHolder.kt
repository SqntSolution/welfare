package com.tf.cms.common.utils

import com.tf.cms.common.jpa.entity.QTbCode
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.annotation.PostConstruct
import kotlin.concurrent.Volatile
import org.springframework.context.ApplicationEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionalEventListener


/**
 *  단지 menuId와 menuPath를 저장하는 용도
 */


class CodeModifiedEvent() : ApplicationEvent("code") {
}

@Component
class CodeHolder(
    private val jpaQueryFactory: JPAQueryFactory,
    private val applicationEventPublisher: ApplicationEventPublisher,
) {
    private val logger = logger()

    @Volatile
    private var holder = mapOf<String, List<CodeValueAndLabel>>()

    fun notifyCodeMofified() {
        applicationEventPublisher.publishEvent(CodeModifiedEvent())
    }

    @TransactionalEventListener()
    fun whenMenuModified(event: CodeModifiedEvent) {
        logger.info { "=== code가 수정됨.다시 읽어들일것임." }
        reload()
    }

    @PostConstruct
    fun onStarted() {
        reload()
    }

    fun getCodes(codeGroup: String): List<CodeValueAndLabel> {
        return holder[codeGroup] ?: listOf()
    }

    fun getCodeLabel(codeGroup: String, code: String?): CodeValueAndLabel? {
        return getCodes(codeGroup)?.find { it.value == code }
    }

    fun reload() {
        logger.info { "=== reload code" }
        val tbCode = QTbCode.tbCode
        val codes = jpaQueryFactory.select(
            Projections.constructor(
                ValueAndLabelAndGroup::class.java,
                tbCode.groupCode, tbCode.code.`as`("value"), tbCode.label,
            )
        )
            .from(tbCode)
            .orderBy(tbCode.groupCode.asc(), tbCode.seq.asc())
            .fetch()
            .toList()

        val result = mutableMapOf<String, List<CodeValueAndLabel>>()
        codes.groupBy { it.groupCode }.entries.forEach { e ->
            // groupCode는 필요없으므로 제거
            result[e.key] = e.value?.map { CodeValueAndLabel(it.value, it.label) } ?: listOf()
        }
        logger.info { "=== codes : (${result?.size}건)" }
//        logger.info { "=== codes : \n$result" }

        this.holder = result
    }

    @Scheduled(fixedDelay = 5 * 60 * 1000)
    fun schedule() {
        reload()
    }


}

data class CodeValueAndLabel(
    val value: String,
    val label: String,
)

data class ValueAndLabelAndGroup(
    val groupCode: String,
    val value: String,
    val label: String,
)