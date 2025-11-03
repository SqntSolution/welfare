//package com.tf.cms.common.utils
//
//import com.querydsl.core.types.Projections
//import com.querydsl.jpa.impl.JPAQueryFactory
//import com.tf.cms.common.jpa.entity.QTbCode
//import com.tf.cms.common.jpa.entity.QTbRef
//import jakarta.annotation.PostConstruct
//import org.springframework.context.ApplicationEvent
//import org.springframework.context.ApplicationEventPublisher
//import org.springframework.scheduling.annotation.Scheduled
//import org.springframework.stereotype.Component
//import org.springframework.transaction.event.TransactionalEventListener
//
///**
// * packageName    : com.tf.cms.common.utils
// * fileName       : RefHolder
// * author         : 정상철
// * date           : 2025-05-16
// * description    : 참조
// * ===========================================================
// * DATE              AUTHOR             NOTE
// * -----------------------------------------------------------
// * 2025-05-16        정상철       최초 생성
// */
//
///**
// *  단지 menuId와 menuPath를 저장하는 용도
// */
//
//
//class RefModifiedEvent() : ApplicationEvent("ref") {
//}
//
//@Component
//class RefHolder(
//    private val jpaQueryFactory: JPAQueryFactory,
//    private val applicationEventPublisher: ApplicationEventPublisher,
//) {
//    private val logger = logger()
//
//    @Volatile
//    private var holder = mapOf<String, List<RefValueAndLabel>>()
//
//    fun notifyRefMofified() {
//        applicationEventPublisher.publishEvent(RefModifiedEvent())
//    }
//
//    @TransactionalEventListener()
//    fun whenMenuModified(event: RefModifiedEvent) {
//        logger.info { "=== code가 수정됨.다시 읽어들일것임." }
//        reload()
//    }
//
//    @PostConstruct
//    fun onStarted() {
//        reload()
//    }
//
//    fun getRefs(refGroup: String): List<RefValueAndLabel> {
//        return holder[refGroup] ?: listOf()
//    }
//
//    fun getRefLabel(refGroup: String, code: String?): RefValueAndLabel? {
//        return getRefs(refGroup)?.find { it.value == code }
//    }
//
//    fun reload() {
//        logger.info { "=== reload ref" }
//        val tbRef = QTbRef.tbRef
//        val refs = jpaQueryFactory.select(
//            Projections.constructor(
//                ValueAndLabelAndGroupCode::class.java,
//                tbRef.groupCode, tbRef.code.`as`("value"), tbRef.label,
//            )
//        )
//            .from(tbRef)
//            .orderBy(tbRef.groupCode.asc(), tbRef.seq.asc())
//            .fetch()
//            .toList()
//
//        val result = mutableMapOf<String, List<ValueAndLabelAndGroupCode>>()
//        refs.groupBy { it.groupCode }.entries.forEach { e ->
//            // groupCode는 필요없으므로 제거
//            result[e.key] = e.value?.map { ValueAndLabelAndGroupCode(it.value, it.label) } ?: listOf()
//        }
//        logger.info { "=== codes : (${result?.size}건)" }
////        logger.info { "=== codes : \n$result" }
//
//        this.holder = result
//    }
//
//    @Scheduled(fixedDelay = 5 * 60 * 1000)
//    fun schedule() {
//        reload()
//    }
//
//
//}
//
//data class RefValueAndLabel(
//    val value: String,
//    val label: String,
//)
//
//data class ValueAndLabelAndGroupCode(
//    val groupCode: String,
//    val value: String,
//    val label: String,
//)