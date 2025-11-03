package com.tf.cms

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling
import java.util.*

@SpringBootApplication
@EnableScheduling
@EnableAsync
class CmsApplication

fun main(args: Array<String>) {
	TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"))
	runApplication<com.tf.cms.CmsApplication>(*args)
}
