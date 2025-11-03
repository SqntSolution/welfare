package com.tf.cms.test

import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import mu.KotlinLogging

class CoroutineTest {
}

suspend fun main_() {
    val logger = KotlinLogging.logger(CoroutineTest::class.java.canonicalName)!!

    test()
}


suspend fun test(): Unit = coroutineScope {
    val logger = KotlinLogging.logger(CoroutineTest::class.java.canonicalName)!!
    logger.info{"===== start"}
    val channel = Channel<Int>()
    launch {
        repeat(500) { index ->
            delay(1000)
            logger.info{"Producing next one"}
            channel.send(index * 2)
        }
    }

    launch {
        while(true) {
            val received = channel.receive()
            logger.info{"$received"}
        }
    }
}