package com.tf.cms.biz.common.metainfo

import com.tf.cms.common.jpa.entity.TbPostMetaStatistic
import com.tf.cms.common.jpa.repository.TbPostMetaStatisticRepository
import com.tf.cms.common.model.MetaType
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Deprecated(message = "Use TbPostMetaStatisticRepository")
@Service
class MetaInfoService(
    private val tbPostMetaStatisticRepository: TbPostMetaStatisticRepository
) {
    private val logger = logger()

    /**
     * Update post meta statistic plus
     *
     * @param postId
     * @param metaType
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updatePostMetaStatisticPlus(postId: Int, metaType: MetaType) {
        logger.debug { "=== updatePostMetaStatisticPlus : $postId, $metaType" }
        val dataOpt = tbPostMetaStatisticRepository.findById(postId)

        if (dataOpt.isPresent) {
            // update
            val data = dataOpt.get()
            when (metaType) {
                MetaType.VIEW -> data.viewCnt = data.viewCnt?.plus(1)
                MetaType.LIKES -> data.likesCnt = data.likesCnt?.plus(1)
                MetaType.SCRAP -> data.scrapCnt = data.scrapCnt?.plus(1)
                MetaType.SHARE -> data.shareCnt = data.shareCnt?.plus(1)
            }
            tbPostMetaStatisticRepository.save(data)

        } else {
            // insert
            TbPostMetaStatistic().apply {
                // 혹시 없다면 빈것을 하나 만들어주자.
                this.id = postId
                this.viewCnt = 0
                this.likesCnt = 0
                this.scrapCnt = 0
                this.shareCnt = 0
                when (metaType) {
                    MetaType.VIEW -> this.viewCnt = 1
                    MetaType.LIKES -> this.likesCnt = 1
                    MetaType.SCRAP -> this.scrapCnt = 1
                    MetaType.SHARE -> this.shareCnt = 1
                }
                tbPostMetaStatisticRepository.save(this)
            }
        }

    }

    /**
     * Update post meta statistic minus
     *
     * @param postId
     * @param metaType
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updatePostMetaStatisticMinus(postId: Int, metaType: MetaType) {
        logger.debug { "=== updatePostMetaStatisticMinus : $postId, $metaType" }
        val findData = tbPostMetaStatisticRepository.findById(postId)
        if (findData.isPresent) {
            val data = findData.get()
            when (metaType) {
                MetaType.VIEW -> data.viewCnt = if (data.viewCnt!! > 0) data.viewCnt?.minus(1) else 0
                MetaType.LIKES -> data.likesCnt = if (data.likesCnt!! > 0) data.likesCnt?.minus(1) else 0
                MetaType.SCRAP -> data.scrapCnt = if (data.scrapCnt!! > 0) data.scrapCnt?.minus(1) else 0
                MetaType.SHARE -> data.shareCnt = if (data.shareCnt!! > 0) data.shareCnt?.minus(1) else 0
            }
            tbPostMetaStatisticRepository.save(data)

        }else{
            // 여기로 온다는건 말이 안되지만,
            TbPostMetaStatistic().apply {
                // 혹시 없다면 빈것을 하나 만들어주자.
                this.id = postId
                this.viewCnt = 0
                this.likesCnt = 0
                this.scrapCnt = 0
                this.shareCnt = 0
                tbPostMetaStatisticRepository.save(this)
            }
        }
    }

}