package com.tf.cms.biz.common.fileupload


import com.tf.cms.common.model.StorageException
import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.logger
import jakarta.annotation.PostConstruct
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile

@Component
class ImageStorageService(
    @Value("\${location.image}") private val uploadRootPath: String
) {
    private val logger = logger()

    @PostConstruct
    fun createDir() {
        File(uploadRootPath).mkdirs()
    }

    fun store(files: Array<MultipartFile>?, etcInfo: String?, etcId:String?): MutableList<FileUploadInfo> {
        val result: MutableList<FileUploadInfo> = ArrayList()
        try {
            if (files == null) {
                return mutableListOf<FileUploadInfo>()
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
            logger.warn{"== [ignore] deleting file : $path ($e)"}
        }
    }

    // 이미지 디렉토리는 연단위로 만들자
    val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM")  // yyyy-MM

    fun store(file: MultipartFile, etcInfo: String?, etcId:String?): FileUploadInfo {
            val originalFilename = file.originalFilename!!
//            val lastIdx = originalFilename!!.lastIndexOf(".")
//            val fileExt = if (lastIdx > -1) originalFilename!!.substring(lastIdx + 1) else ""
        val fileExtension = safeImageExtension(originalFilename)
        val uniqueFilename: String = UUID.randomUUID().toString() + (if(etcId==null || etcId=="") "" else "_${etcId}") + "${fileExtension}"
        val subPath = formatter.format(LocalDate.now())
        // /image/2024
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
            return FileUploadInfo(path = "$subPath/$uniqueFilename", etcInfo=etcInfo, fileExtension=fileExtension, filename=originalFilename, fileSize=file.size)

        } catch (e: Exception) {
            deleteUploadedFile(File(subPath, uniqueFilename).path)
            throw e
        }
    }

    val contentsTypeMappings = mapOf("apng" to "image/apng", "avif" to "image/avif", "gif" to "image/gif",
        "jpg" to "image/jpeg", "jpeg" to "image/jpeg","jfif" to "image/jpeg","pjpeg" to "image/jpeg","pjp" to "image/jpeg" ,
        "png" to "image/png", "svg" to "image/svg+xml", "webp" to "image/webp", "bmp" to "image/bmp",
        "ico" to "image/x-icon", "cur" to "image/x-icon", "tif" to "image/tiff", "tiff" to "image/tiff",
        )

    fun getFileExtension(filename:String): String {
        val lastIdx = filename.lastIndexOf(".")
        return if (lastIdx > -1) {
            filename.substring(lastIdx + 1)
        }else{
            ""
        }
    }

    /**
     * 알려진 이미지 확장자인 경우에는 그것을 쓰고 아니면, ""을 리턴.
     */
    fun safeImageExtension(filename:String): String {
        val lastIdx = filename.lastIndexOf(".")
        return if (lastIdx > -1) {
            val ext = filename.substring(lastIdx + 1)
            if(contentsTypeMappings.contains(ext.lowercase())){
                ".${ext}"
            }else{
                ""
            }
        } else {
            ""
        }
    }

    fun loadAsResource(filename: String, vararg path: String): FileDownloadInfo {
        Helpers.checkFilename(filename)
        Helpers.checkFilename(*path)

        val file: Path = Paths.get(uploadRootPath, *path)
        val fdi = FileDownloadInfo()
        val resource: Resource = UrlResource(file.toUri())
        if (resource.exists() || resource.isReadable()) {
            fdi.resource = resource
            fdi.size = resource.contentLength()
            fdi.filename = filename
            return fdi
        } else {
            throw RuntimeException("Could not read file: ${path?.joinToString(separator = "/")}")
        }
    }

//    fun loadAsResource(path: String, filename: String?): FileDownloadInfo {
//        val file: Path = Paths.get(uploadRootPath, path)
//        val fdi = FileDownloadInfo()
//        val resource: Resource = UrlResource(file.toUri())
//        if (resource.exists() || resource.isReadable()) {
//            fdi.resource = resource
//            fdi.size = resource.contentLength()
//            fdi.filename = filename
//            return fdi
//        } else {
//            throw RuntimeException("Could not read file: $path")
//        }
//    }

//    fun getFile(path: String?): File {
//        val p: Path = Paths.get(uploadRootPath, path)
//        return p.toFile()
//    }
//
//    fun getFile(path: String?, path2: String?): File {
//        val p: Path = Paths.get(uploadRootPath, path, path2)
//        return p.toFile()
//    }

    fun getFile(vararg paths:String): File {
        Helpers.checkFilename(*paths)

        val p = Paths.get(uploadRootPath, *paths)
        return p.toFile()
    }
}