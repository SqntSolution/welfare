package com.tf.cms.biz.common.fileupload

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.user.main.PostPageService
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.google.common.base.Strings
import com.google.common.io.ByteStreams
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.File
import java.io.FileInputStream
import java.time.Duration
import org.springframework.core.io.Resource
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@Tag(name = "[공통] 파일 업다운로드 API")
@RestController
class FileMngController(
    private val fileStorageService: FileStorageService,
    private val imageStorageService: ImageStorageService,
    private val postPageService: PostPageService,
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val fileMngService: FileMngService,
) {

    private val logger = logger()

    //============== file upload

    @PostMapping("/api/v1/fileupload")
    fun handleFileUpload(
        @RequestParam("file") file: MultipartFile,
//        @RequestParam(value = "etcInfo", required = false) etcInfo: String?
    ): ResponseEntity<FileUploadInfo> {
//        FileUploadInfo stored = fileStorageService.store(file, etcInfo);
        val stored: FileUploadInfo = fileStorageService.storeToTempDir(file, null, null)
        logger.info{"=== stored : $stored"}

        return ResponseEntity.ok<FileUploadInfo>(stored)
    }

    @PostMapping("/api/v1/image")
    fun imageUpload(
        @RequestParam("file") file: MultipartFile,
        @RequestParam(value = "etcInfo", required = false) etcInfo: String?
    ): ResponseEntity<FileUploadInfo> {
        logger.info{"== image file upload (${file.name}) (${file.originalFilename})"}
        val stored: FileUploadInfo = imageStorageService.store(file, etcInfo, "")
        logger.info{"=== stored : $stored"}

        return ResponseEntity.ok<FileUploadInfo>(stored)
    }


    //============== image view

    fun setImageContentType( filename:String, response: HttpServletResponse){
        val fileExtension = imageStorageService.getFileExtension(filename)
        if(fileExtension!=""){
            val contentType = imageStorageService.contentsTypeMappings[fileExtension.lowercase()]
            if(contentType!=null){
                response.setHeader("Content-Type", contentType)
                // 8일동안 cache
                response.setHeader("Cache-Control", "max-age=" + 8*24*60*60)
            }
        }
    }

//    @GetMapping("/api/v1/image/{path}")
//    fun imageDownload(@PathVariable("path") path: String, response: HttpServletResponse) {
//        logger.info{"== image download : ${path}"}
//        val f: File = imageStorageService.getFile(path)
//        logger.info{"=== image : ${f.absolutePath}" }
//
//        setImageContentType(path, response)
//
//        FileInputStream(f).use { inputStream ->
//            response.outputStream.use { outputStream ->
//                ByteStreams.copy(FileInputStream(f), response.outputStream)
//            }
//        }
//    }

    @GetMapping(path=["/api/v1/image/{path}/{path2}", "/api/v1/view/image/{path}/{path2}"])
    fun imageView(@PathVariable("path") path: String, @PathVariable("path2") path2: String, response: HttpServletResponse) {
        logger.info("== image download : {}/{}", path, path2)
        val f: File = imageStorageService.getFile(path, path2)
        logger.info{"=== image : ${f.absolutePath}"}

        setImageContentType(path2, response)

        FileInputStream(f).use { inputStream ->
            response.outputStream.use { outputStream ->
                ByteStreams.copy(FileInputStream(f), response.outputStream)
            }
        }
    }

    @GetMapping(path=["/api/v1/view/image/{path}/{path2}/{path3}"])
    fun imageView3Depth(@PathVariable("path") path: String, @PathVariable("path2") path2: String,
                        @PathVariable("path3") path3: String, response: HttpServletResponse) {
        logger.info{"== image download : $path/$path2/$path3"}
        val f: File = imageStorageService.getFile(path, path2)
        logger.info{"=== image : ${f.absolutePath}"}

        setImageContentType(path2, response)

        FileInputStream(f).use { inputStream ->
            response.outputStream.use { outputStream ->
                ByteStreams.copy(FileInputStream(f), response.outputStream)
            }
        }
    }


    //============== image download

    @GetMapping("/api/v1/image-download/{path1}/{path2}")
    fun imageDownload(
        request: HttpServletRequest?,
        @PathVariable("path1") path1: String,
        @PathVariable("path2") path2: String,
//        @PathVariable(value = "path3", required = false) path3: String?,
        response: HttpServletResponse?, @RequestParam(name = "name", required = true) name: String
    ): ResponseEntity<*> {
        logger.info{"== file download : ${path1}/${path2} (${name})" }
        val name = if (Strings.isNullOrEmpty(name)) {
            "image"
        } else {
            name.trim()
        }
        val fdi: FileDownloadInfo = imageStorageService.loadAsResource(name, path1, path2)
        try {
            return fileStorageService.download(request, fdi)
        } catch (e: Exception) {
            logger.error{"${e.message} => file download : ${path1}/${path2} (${name}) "}
            throw BizException("첨부파일 조회 오류")
        }
    }


    //============== 첨부파일에 대해 temp파일 다운로드 (upload한후에 저장하기 전)

//    http://cosmax.local/api/v1/download/temp/33ed35f1-ed26-4146-b02f-80c5bc775700?name=castle5.jpg
//    @GetMapping("/api/v1/download/{path}/{path2}")
//    @GetMapping("/api/v1/download/{postId}/{fileId}")
    @GetMapping("/api/v1/download/temp/{path2}")
    fun tempFiledownload(
        request: HttpServletRequest?,
//        @PathVariable("path") path: String,
        @PathVariable("path2") path2: String,
        response: HttpServletResponse?, @RequestParam(name = "name", required = false) name: String
    ): ResponseEntity<*> {
        val path = "temp"
        logger.info{"== file download : ${path}/${path2} (${name})" }
        val name = if (Strings.isNullOrEmpty(name)) {
            "nobody"
        } else {
            name.trim()
        }
        //        name = URLEncoder.encode(name, "UTF-8"); => fileStorageService.download() 여기에서 encoding을 하므로, 여기서는 하면 안됨.
        val fdi: FileDownloadInfo = fileStorageService.loadAsResource(name, path, path2)

        try {
            return fileStorageService.download(request, fdi)
        } catch (e: Exception) {
            logger.error{"${e.message} => file download : ${path}/${path2} (${name}) "}
            throw BizException("첨부파일 조회 오류")
        }
    }
    

    //============== 첨부 파일 다운로드 (이미지가 아닌)
    /**
     * 첨부파일 한개 다운로드 (post, 공지, faq, qna 상관없이 여기서 다운로드 )
     */
    @GetMapping("/api/v1/download/{fileId}")
    fun fileDownload_post(
        request: HttpServletRequest?,
        @PathVariable("fileId") fileIdStr: String,
        response: HttpServletResponse?): ResponseEntity<*> {

        var fileId:Int = -1
        try {
            fileId = fileIdStr.toInt()
        }catch(e:Exception){
            throw BizException("해당 파일이 존재하지 않음 (${fileIdStr})")
        }

        val userInfo = UserInfoHelper.getLoginUserInfo()
        // 아래 메소드안에서, post인 경우에 권한 체크를 한다.
        val detailDto = postPageService.getAttachedFileByFileid(userInfo?.authGroup, fileId)
        val postId = detailDto.postId
//        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(userInfo?.authGroup!!, detailDto.postId!!)
        val fdi: FileDownloadInfo = fileStorageService.loadAsResource(detailDto.fileNm!!,detailDto.filePath!!)

        try {
            val result = fileStorageService.download(request, fdi, fileId)
            // post의 파일다운로드인 경우에는 user history에 insert
            if(detailDto.fileClass=="post"){
                try {
                    fileMngService.insertDownloadInfoToUserHistory(fileId)
                }catch (e:Exception){
                    logger.warn("file download를 user history에 insert중에 에러", e)
                }
            }
            return result
        } catch (e: Exception) {
            logger.error("error in file download : (fileId:$fileId) $e", e)
            throw BizException("첨부파일 다운로드 실패")
        }
    }


    //============= pdf viewer

    @GetMapping("/api/v1/view/pdf/post/{detailId}")
    fun pdfView(
        request: HttpServletRequest?,
        @PathVariable("detailId") detailIdStr: String,
        response: HttpServletResponse,
    ): ResponseEntity<*> {
        var detailId:Int = -1
        try {
            detailId = detailIdStr.toInt()
        }catch(e:Exception){
            throw BizException("해당 pdf가 존재하지 않음 (${detailIdStr})")
        }

        val userInfo = UserInfoHelper.getLoginUserInfo()

        val detailDto = postPageService.getPostDetailOne(userInfo?.authGroup, detailId)
        if(detailDto.detailsType!="pdf"){
            throw BizException("pdf 타입이 아닙니다. ($detailId)")
        }

        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(userInfo?.authGroup!!, detailDto.postId!!)
        val resource = fileStorageService.loadAsResource(detailDto.filePath!!)
        return pdfViewResponse(resource )
    }

    /**
     * temp 디렉토리에 있는 파일을 pdfviewer로 보기 위한
     */
    @GetMapping("/api/v1/view/pdf/temp/{path}")
    fun pdfViewFromTempDir(
        request: HttpServletRequest?,
        @PathVariable("path") path: String,
        response: HttpServletResponse,
        @RequestParam(name = "name", required = false) name: String?
    ): ResponseEntity<*> {
        val name = if (Strings.isNullOrEmpty(name)) {
            "noname"
        } else {
            name!!.trim()
        }
        val resource = fileStorageService.loadAsResource(name, "temp", path)?.resource!!
        return pdfViewResponse(resource )
    }

    /**
     * pdf로 content-type을 셋팅
     */
    fun pdfViewResponse(resource: Resource): ResponseEntity<Resource> {
        val headers: HttpHeaders = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_PDF
        // 하루
        headers.cacheControl = CacheControl.maxAge(Duration.ofDays(1)).headerValue
        return ResponseEntity<Resource>(resource, headers, HttpStatus.OK)
    }

}