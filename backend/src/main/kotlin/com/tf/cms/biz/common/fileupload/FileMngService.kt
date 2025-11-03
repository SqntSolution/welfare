package com.tf.cms.biz.common.fileupload

import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.repository.TbAttachedFileRepository
import com.tf.cms.common.jpa.repository.TbPostContentRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.stereotype.Service

@Service
class FileMngService(
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbAttachedFileRepository: TbAttachedFileRepository,
    private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    /**
     * 다운로드 정보를 tb_user_history 테이블에 insert
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertDownloadInfoToUserHistory(fileId:Int){
        val fileEntity = tbAttachedFileRepository.findById(fileId).orElseThrow { BizException("해당 파일이 존재하지 않음.(fileId:$fileId)") }
        // post인 경우에만 처리
        if(fileEntity.fileClass!="post"){
            return
        }
        val postId = fileEntity.postId!!
        val postEntity = tbPostContentRepository.findById(postId).orElseThrow { BizException("해당 Post가 존재하지 않음.($postId)") }

        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        var tbUserHistory = TbUserHistory().let {
            it.postId = postId
            it.userId = userInfo.id
            it.userName = userInfo.name
            it.postTitle = postEntity.title
            it.description = "파일을 다운로드 했습니다."
            it.attachedFileId = fileId
            it.attachedFileNm = fileEntity.fileNm
            it.actionType = UserHistoryActionType.file_download.code
            it.menu1Id = postEntity.menu1Id
            it.menu2Id = postEntity.menu2Id
            it.menu1Nm = menuIdHolder.getMenuNmFromId(postEntity.menu1Id)
            it.menu2Nm = menuIdHolder.getMenuNmFromId(postEntity.menu2Id)
            it.createdAt = LocalDateTime.now()
            tbUserHistoryRepository.save(it)
        }

    }

}