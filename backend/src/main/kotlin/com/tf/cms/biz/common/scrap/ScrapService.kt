package com.tf.cms.biz.common.scrap

import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.entity.TbUserScrap
import com.tf.cms.common.jpa.entity.TbUserScrapId
import com.tf.cms.common.jpa.repository.TbPostContentRepository
import com.tf.cms.common.jpa.repository.TbPostMetaStatisticRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.jpa.repository.TbUserScrapRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull
import org.springframework.stereotype.Service

@Service
class ScrapService(
    private val tbUserScrapRepository: TbUserScrapRepository,
    private val tbPostMetaStatisticRepository: TbPostMetaStatisticRepository,
    private val tbPostContentRepository: TbPostContentRepository,
    private val menuIdHolder: MenuIdHolder,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
) {
    private val logger = logger()

    /**
     * Save user scrap
     *
     * @param pPostId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveUserScrap(pPostId: Int): Pair<Boolean, Int> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val userScrapId = TbUserScrapId().apply {
            this.postId = pPostId
            this.userId = userInfo.id
        }
        val tbUserScrap = tbUserScrapRepository.findById(userScrapId)

        val present = tbUserScrap.isPresent
        val result = if (present) {
            tbUserScrapRepository.deleteById(userScrapId)
            // 스크랩 건수 감소
            tbPostMetaStatisticRepository.decreaseScrapCnt(pPostId)
            false
        } else {
            val userScrap = TbUserScrap().apply {
                this.id = userScrapId
                this.createdAt = LocalDateTime.now()
            }
            tbUserScrapRepository.save(userScrap)
            // 스크랩 건수 증가
            tbPostMetaStatisticRepository.increaseScrapCnt(pPostId)
            true
        }

        val scrapCnt = tbPostMetaStatisticRepository.findById(pPostId).getOrNull() ?.scrapCnt ?: 0

        val post = tbPostContentRepository.findById(pPostId).getOrNull() ?: throw BizException("Post가 존재하지 않음.")

        // history에 insert
        TbUserHistory().let {
            it.postId = pPostId
            it.userId = userInfo.id
            it.postTitle = post.title
            if (present) {
                it.description = "Post를 '스크랩'을 해제하였습니다."
                it.actionType = UserHistoryActionType.post_scrap_remove.name
            } else {
                it.description = "Post를 '스크랩'하였습니다."
                it.actionType = UserHistoryActionType.post_scrap.name
            }
            it.userName = userInfo.name
            it.menu1Id = post.menu1Id
            it.menu1Nm = menuIdHolder.getMenuNmFromId(post.menu1Id)
            it.menu2Id = post.menu2Id
            it.menu2Nm = menuIdHolder.getMenuNmFromId(post.menu2Id)
            it.createdAt = LocalDateTime.now()
            tbUserHistoryRepository.save(it)
        }

        return Pair(result, scrapCnt)
    }

    /**
     * Is scraped post
     *
     * @param pPostId
     * @return
     */
    fun isScrapedPost(pPostId: Int): Boolean {
        val userScrapId = TbUserScrapId().apply {
            this.postId = pPostId
            this.userId = UserInfoHelper.getLoginUserInfo()?.id
        }
        return tbUserScrapRepository.findById(userScrapId).isPresent
    }
}