package com.tf.cms.biz.common.fileupload

import com.tf.cms.common.jpa.repository.TbAttachedFileRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.StorageException
import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.logger
import jakarta.annotation.PostConstruct
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import java.io.File
import java.io.IOException
import java.net.URLEncoder
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile

@Component
class FileStorageService(
    @Value("\${location.fileupload}") private val uploadRootPath: String,
    private val tbAttachedFileRepository: TbAttachedFileRepository,

    ) {
    private val logger = logger()

    @PostConstruct
    fun createDir() {
        File(uploadRootPath).mkdirs()
    }

    fun FileStorageService() {
    }

    fun store(files: Array<MultipartFile>?, etcInfo: String?, etcId: String?): MutableList<FileUploadInfo> {
        val result: MutableList<FileUploadInfo> = ArrayList()
        try {
            if (files == null) {
                return ArrayList()
            }

            for (f in files) {
                val r = store(f, etcInfo, etcId)
                result.add(r)
            }
        } catch (e: IOException) {
            // 이미 올라간 파일 삭제
            for ((path) in result) {
                deleteUploadedFile(path)
            }
            throw StorageException("Failed to store file.", e)
        }
        return result
    }

    private fun deleteUploadedFile(path: String) {
        try {
            val f = File(uploadRootPath, path)
            if (f != null && f.isFile) {
                f.delete()
            }
        } catch (e: Exception) {
            logger.warn { "== [ignore] deleting file : $path ($e)" }
        }
    }


    // 업로드 디렉토리는 연단위로 만들자
    val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM")  // yyyy-MM

    fun store(file: MultipartFile, etcInfo: String?, etcId: String?): FileUploadInfo {
        val uniqueFilename: String = UUID.randomUUID().toString() + if (etcId == null && etcId != "") "" else "_" + etcId
        val subPath = formatter.format(LocalDate.now())
        // /fileupload/2024
        val dir = File(uploadRootPath, subPath)
        try {
            if (file.isEmpty) {
                throw StorageException("File is empty.")
            }
            dir.mkdirs()
            val destinationFile = File(dir, uniqueFilename)
            file.inputStream.use { inputStream ->
                Files.copy(inputStream, destinationFile.toPath(), StandardCopyOption.REPLACE_EXISTING)
            }
            val originalFilename = file.originalFilename
            val lastIdx = originalFilename!!.lastIndexOf(".")
            val fileExt = if (lastIdx > -1) originalFilename!!.substring(lastIdx + 1) else ""
            return FileUploadInfo(
                path = "$subPath/$uniqueFilename",
                etcInfo = etcInfo,
                fileExtension = fileExt,
                filename = originalFilename,
                fileSize = file.size
            )

        } catch (e: Exception) {
            deleteUploadedFile(File(subPath, uniqueFilename).path)
            throw e
        }
    }

    fun storeToTempDir(file: MultipartFile, etcInfo: String?, etcId: String?): FileUploadInfo {
        val path: String = UUID.randomUUID().toString()+ if (etcId == null && etcId != "") "" else "_" + etcId
        val subPath = "temp"
        // (예) /image/temp
        val dir = File(uploadRootPath, subPath)
        dir.mkdirs()
        try {
            if (file.isEmpty) {
                throw StorageException("File is empty.")
            }
            val destinationFile = File(dir, path)
            file.inputStream.use { inputStream ->
                Files.copy(inputStream, destinationFile.toPath(), StandardCopyOption.REPLACE_EXISTING)
            }
            val originalFilename = file.originalFilename!!
            val lastIdx = originalFilename.lastIndexOf(".")
            val fileExt = if (lastIdx > -1) originalFilename.substring(lastIdx + 1) else ""
            return FileUploadInfo(
                path = "$subPath/$path",
                etcInfo = etcInfo,
                fileExtension = fileExt,
                filename = originalFilename,
                fileSize = file.size
            )

        } catch (e: Exception) {
            deleteUploadedFile(File(dir, path).path)
            throw e
        }
    }

    /**
     * 임시저장경로에 있는 파일을 실제 사용할 경로로 이동한다.
     *
     * @param tempPath 임시저장경로
     */
    fun moveToActualDir(tempPath: String): String {
        try {
            if(!tempPath.startsWith("temp/")){
                throw BizException("임시 업로드 파일의 경로가 temp 디렉토리가 아닙니다.")
            }
            val subPath = formatter.format(LocalDateTime.now())
            val dir = File(uploadRootPath, subPath)
            dir.mkdirs()

            val sourcePath: Path = Paths.get(uploadRootPath, tempPath)
            val targetPath: Path = Paths.get(uploadRootPath, subPath, sourcePath.fileName.toString())

            // temp 파일이 존재하는데, target파일이 존재하지 않으면 지극히 정상적인 상태임. => move
            if (Files.exists(sourcePath) && !Files.exists(targetPath)) {
                Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING)
                return subPath + "/" + targetPath.fileName.toString()
            }

            // 만일 temp파일이 존재하지 않는데, target 파일이 존재하면, 이미 옮겨진 거라고 간주하고서(정상) 통과
            if (!Files.exists(sourcePath) && Files.exists(targetPath)) {
                logger.warn{"=== 파일이 이미 옮겨짐 ($tempPath)"}
                return subPath + "/" + targetPath.fileName.toString()
            }


            // temp 파일이 존재하는데, target파일도 존재하면 => WTF! 복사하자.
            if (Files.exists(sourcePath) && Files.exists(targetPath)) {
                logger.warn{"=== temp파일과 target파일이 모두 존재, 덮어쓸것임 ($tempPath)" }
                Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING)
                return subPath + "/" + targetPath.fileName.toString()
            }

            // 여기까지 왔다면, 잘못된 것임.
            throw BizException("temp 파일이 존재하지 않음 ($tempPath)")

        } catch (e: Exception) {
            throw e
        }
    }


    fun loadAsResource(filename: String, vararg path: String): FileDownloadInfo {
        Helpers.checkFilename(filename)
        Helpers.checkFilename(*path)

        val file: Path = Paths.get(uploadRootPath, *path)
        val fdi = FileDownloadInfo()
        val resource: Resource = UrlResource(file.toUri())
        if (resource.exists() && resource.isReadable()) {
            fdi.resource = resource
            fdi.size = resource.contentLength()
            fdi.filename = filename
            return fdi
        } else {
            throw RuntimeException("Could not read file: ${path?.joinToString(separator = "/")}")
        }
    }

    fun loadAsResource(path: String): Resource {
        Helpers.checkFilename(path)

        val file: Path = Paths.get(uploadRootPath, path)
        val resource: Resource = UrlResource(file.toUri())
        if (resource.exists() && resource.isReadable()) {
            return resource
        } else {
            throw BizException("파일을 읽을 수 없습니다.")
        }
    }

    fun getUploadRootPath(): String? {
        return uploadRootPath
    }

    @Transactional(rollbackOn = [Throwable::class])
    fun download(request: HttpServletRequest?, record: FileDownloadInfo, fileIdForIncrease:Int=0): ResponseEntity<Resource> {
        if(fileIdForIncrease>0){
            tbAttachedFileRepository.increaseDownloadCnt(fileIdForIncrease)
        }
        val originalFileName = record.filename
        val encodedFileName: String = URLEncoder.encode(originalFileName, "UTF-8").replace("+", "%20");

        logger.debug { "=== service file-download / originalFileName : $originalFileName" }
        logger.debug { "=== service file-download / encodedFileName : $encodedFileName" }
        val headers: HttpHeaders = HttpHeaders()
        headers.setContentDisposition(ContentDisposition.builder("attachment").filename(encodedFileName).build()) // 다운로드 되거나 로컬에 저장되는 용도로 쓰이는지를 알려주는 헤더

        return ResponseEntity<Resource>(record.resource, headers, HttpStatus.OK)
    }
}