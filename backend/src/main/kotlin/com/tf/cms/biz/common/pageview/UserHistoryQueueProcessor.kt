package com.tf.cms.biz.common.pageview

import com.tf.cms.common.jpa.entity.TbPostMetaStatistic
import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.repository.TbPostMetaStatisticRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.logger
import jakarta.annotation.PostConstruct
import jakarta.annotation.PreDestroy
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.BlockingQueue
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread
import org.springframework.context.ApplicationContext
import org.springframework.stereotype.Component

/**
 *  history를 처리하는 (주로 페이지 조회 처리를 목적으로)
 *  - 1시간 이내에 조회한 post는 누적시키지 않음.
 */
@Component
class UserHistoryQueueProcessor(
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val tbPostMetaStatisticRepository: TbPostMetaStatisticRepository,
    private val menuIdHolder: MenuIdHolder,
    private val ctx: ApplicationContext,
) {
    private val logger = logger()
    private val queue: BlockingQueue<UserHistoryDto> = LinkedBlockingQueue()
    private val pageViewHolderMap = ConcurrentHashMap<PostIdAndUserId, LocalDateTime>()

    @Volatile
    private var isStop = false

    @PreDestroy
    fun shutdown() {
        logger.info { "=== UserHistoryQueueProcessor shutdown" }
        isStop = true
    }

    @PostConstruct
    fun setupConsumer() {
        logger.info { "=== UserHistoryQueueProcessor 시작" }


        // queue 처리
        thread(isDaemon = true) {
            while (!isStop) {
                try {
                    val postHistory = queue.poll(2, TimeUnit.SECONDS)
                    if (postHistory != null) {
                        ctx.getBean(UserHistoryQueueProcessor::class.java).process(postHistory)
                    }
                } catch (th: Throwable) {
                    logger.warn { "[ignore] $th" }
                }

            }
        }

        // postId와 userId를 가지고 있는데서, 1시간 지난 것은 삭제
        thread(isDaemon = true) {
            while (!isStop) {
                try {
                    // 1시간 전인것은 삭제
                    val oneHourBefore = LocalDateTime.now().minusHours(1)
//                    val oneHourBefore = LocalDateTime.now().minusMinutes(5)
                    pageViewHolderMap.filter { e -> e.value.isBefore(oneHourBefore) }.forEach { (k, _) ->
                        logger.info { "=== map 삭제 ($k)" }
                        pageViewHolderMap.remove(k)
                    }
                    TimeUnit.SECONDS.sleep(30)
                } catch (th: Throwable) {
                    logger.warn { "[ignore] $th" }
                }
            }
        }
    }

    fun push(p: UserHistoryDto) {
        logger.info { "=== History 한개 추가 ($p)" }
        queue.put(p)
    }

    val yyyyMM: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMM")

    @Transactional(rollbackOn = [Throwable::class])
    fun process(p: UserHistoryDto) {
        logger.info { "=== History 한개 처리 ($p)" }

        // logger.info { "=== pageViewHolderMap : (${pageViewHolderMap.toList()})" }
        // 1시간안에는 1번만 쌓도록 처리.
        if (!pageViewHolderMap.containsKey(PostIdAndUserId(postId = p.postId!!, userId = p.userId!!))) {
            logger.info { "=== 조회수 증가 (${p.postId}) (${p.userId})" }

            // 사용자 history에 insert
            TbUserHistory().apply {
                this.postId = p.postId
                this.userId = p.userId
                this.userName = p.userName
                this.postTitle = p.postTitle
                this.description = p.description
                this.attachedFileId = p.attachedFileId
                this.attachedFileNm = p.attachedFileNm
                this.actionType = p.actionType
                this.menu1Id = p.menu1Id
                this.menu2Id = p.menu2Id
                this.menu1Nm = menuIdHolder.getMenuNmFromId(p.menu1Id)
                this.menu2Nm = menuIdHolder.getMenuNmFromId(p.menu2Id)
                this.createdAt = p.createdAt

                tbUserHistoryRepository.save(this)
            }

            try {
                val found = tbPostMetaStatisticRepository.findById(p.postId!!)
                if (found.isPresent) {
                    tbPostMetaStatisticRepository.increaseViewCnt(p.postId!!)
                } else {
                    TbPostMetaStatistic().apply {
                        id = p.postId
                        viewCnt = 1
                        likesCnt = 0
                        scrapCnt = 0
                        shareCnt = 0

                        tbPostMetaStatisticRepository.save(this)
                    }
                }
                pageViewHolderMap.put(PostIdAndUserId(postId = p.postId!!, userId = p.userId!!), LocalDateTime.now())

            } catch (ex: Exception) {
                logger.warn("[Ignore] $ex", ex)
            }

        }


    }
}

data class PostIdAndUserId(
    val postId: Int, val userId: String,
)

data class UserHistoryDto(
    var postId: Int? = null,
    var userId: String? = null,
    var postTitle: String? = null,
    var description: String? = null,
    var attachedFileId: Int? = null,
    var attachedFileNm: String? = null,
    var userName: String? = null,
    var actionType: String? = null,
    var menu1Id: Int? = null,
    var menu2Id: Int? = null,
    var createdAt: LocalDateTime = LocalDateTime.now(),
)
