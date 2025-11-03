package com.tf.cms.biz.common.fileupload

import com.tf.cms.common.jpa.dto.TbAttachedFileDto
import com.tf.cms.common.jpa.entity.TbAttachedFile
import com.tf.cms.common.jpa.repository.TbAttachedFileRepository
import com.tf.cms.common.model.FileClassType
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AttachedFileService(
        private val fileStorageService: FileStorageService,
        private val tbAttachedFileRepository: TbAttachedFileRepository
) {
    private val logger = logger()

    /**
     * Find attached files
     *
     * @param fileClassType
     * @param postId
     * @return
     */
    fun findAttachedFiles(fileClassType: FileClassType, postId: Int): List<TbAttachedFileDto> {
        return tbAttachedFileRepository.findByFileClassAndPostId(fileClassType.code, postId)
                .map { TbAttachedFileDto(it) }
    }

    /**
     * Save attached files
     *
     * @param fileClassType
     * @param postId
     * @param fileList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertAttachedFiles(fileClassType: FileClassType, postId: Int, fileList: List<FileUploadInfo>) {
        if (fileList.isEmpty()) return

        val loginUserInfo = UserInfoHelper.getLoginUserInfo()

        val tbAttachedFileList = fileList.map {
            TbAttachedFile().apply {
                this.fileClass = fileClassType.code
                this.fileNm = it.filename
                this.fileExtension = it.fileExtension
                this.filePath = fileStorageService.moveToActualDir(it.path)    // 파일 디렉토리 이동
                this.fileSize = it.fileSize
                this.postId = postId
                this.createdAt = LocalDateTime.now()
                this.createdUserId = loginUserInfo?.id
                this.createdUserNm = loginUserInfo?.name
            }
        }

        tbAttachedFileRepository.saveAll(tbAttachedFileList)
    }

    /**
     * Insert attached img file
     *
     * @param pFile
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertAttachedImgFile(pFile: FileUploadInfo): TbAttachedFile {
        val loginUserInfo = UserInfoHelper.getLoginUserInfo()

        val tbAttachedFile = TbAttachedFile().apply {
            this.fileClass = FileClassType.IMG.code
            this.fileNm = pFile.filename
            this.fileExtension = pFile.fileExtension
            this.filePath = fileStorageService.moveToActualDir(pFile.path)    // 파일 디렉토리 이동
            this.fileSize = pFile.fileSize
            this.postId = 0
            this.createdAt = LocalDateTime.now()
            this.createdUserId = loginUserInfo?.id
            this.createdUserNm = loginUserInfo?.name
        }

        return tbAttachedFileRepository.save(tbAttachedFile)
    }

    /**
     * Delete attached file
     *
     * @param fileId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteAttachedFile(fileId: Int) {
        tbAttachedFileRepository.deleteById(fileId)
    }

    /**
     * Delete attached files
     *
     * @param fileIdList
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteAttachedFiles(fileIdList: List<Int>) {
        if(fileIdList.isEmpty()) return

        fileIdList.forEach {
            tbAttachedFileRepository.deleteById(it)
        }
    }
}