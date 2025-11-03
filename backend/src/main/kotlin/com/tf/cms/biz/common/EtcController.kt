package com.tf.cms.biz.common

import com.tf.cms.common.sso.cm.SSOConst
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import java.awt.Dimension
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import net.coobird.thumbnailator.Thumbnails
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.rendering.PDFRenderer
import org.apache.poi.xslf.usermodel.XMLSlideShow
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@Tag(name = "[공통] 기타 API")
@RestController
@RequestMapping("/api/v1/dummy")
class EtcController(
    @Value("\${env}")
    private val env: String? = null,
    private val menuIdHolder: MenuIdHolder,
    private val thumbnailRetriever:ThumbnailRetriever,
) {
    private val logger = logger()

    @GetMapping("/hc")
    fun serviceHealthCheck(request: HttpServletRequest): ResponseEntity<Any> {
        logger.debug { "=== Who called hc : ${request.remoteAddr}" }
        return ResponseEntity.ok(HttpStatus.OK)
    }

    @PostMapping("/clear-session")
    fun clearSession( request: HttpServletRequest): ResponseEntity<String> {
        val session = request.session
        session.removeAttribute(SSOConst.USER_NUMBER)
        return ResponseEntity.ok("ok")
    }

    @PostMapping("/user-thumbnail/{userId}")
    fun getThumbnailFromLdap( @PathVariable("userId") userId: String): ResponseEntity<String> {
        thumbnailRetriever.processThumbnail(userId)
        return ResponseEntity.ok("ok")
    }


    /** 화면에 보내주기 위한 */
    data class MyInfoForDisplay(
            var v: String?,
            var id: String?,
            var name: String?,
            var email: String?,
            var phone: String?,
            var teamCode: String?,
            var teamName: String?,
            var avatarImgPath: String?,
            var role: String?,
            var contentsManagerAuthMenuNames: List<List<String>>?,
            var authLevel: Int? = null,
//        var popups:Map<String, List<MenuAndPopupid?>?>? = null
    )

    @Operation(summary = "내(로그인 사용자) 정보 조회")
    @PostMapping("/w")
    fun getMyInfo(): ResponseEntity<MyInfoForDisplay> {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val menuPaths = userInfo?.contentsManagerAuthMenuIds?.map {
            menuIdHolder.getMenuPathsFromId(it)
        }
        val myInfo = MyInfoForDisplay(
                v = env,
                id = userInfo?.id,
                name = userInfo?.name,
                email = userInfo?.email,
                phone = userInfo?.phone,
                teamCode = userInfo?.teamCode,
                teamName = userInfo?.teamName,
                avatarImgPath = userInfo?.avatarImgPath,
                role = userInfo?.role?.code,
                contentsManagerAuthMenuNames = menuPaths,
                authLevel = userInfo?.authLevel,
//            popups = menuIdHolder.getPopups()
        )
        return ResponseEntity.ok(myInfo)
    }

    @Operation(summary = "Generate PPT", description = "Generate PPT...")
    @PostMapping("/ppt", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE], produces = [MediaType.IMAGE_PNG_VALUE])
    fun generatePptThumbnail(@RequestBody pptFile: MultipartFile): ResponseEntity<ByteArray> {
        logger.debug { "=== start generatePptThumbnail ===" }
        try {
            // Load PPT file into XMLSlideShow
            val inputStream = ByteArrayInputStream(pptFile.bytes)
            val ppt = XMLSlideShow(inputStream)

            // Get the first slide's image
            val slideImage = extractSlideImage(ppt)

            // Convert BufferedImage to byte array
            val baos = ByteArrayOutputStream()
            Thumbnails.of(slideImage).size(200, 200).outputFormat("png").toOutputStream(baos)
            val thumbnailBytes = baos.toByteArray()

            logger.debug { "=== end generatePptThumbnail ===" }
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(thumbnailBytes)
        } catch (e: Exception) {
            e.printStackTrace()
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @Operation(summary = "Generate PDF", description = "Generate PDF...")
    @PostMapping("/pdf", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE], produces = [MediaType.IMAGE_PNG_VALUE])
    fun generatePdfThumbnail(@RequestBody pdfFile: MultipartFile): ResponseEntity<ByteArray> {
        logger.debug { "=== start generatePdfThumbnail ===" }
        try {
            val inputStream = ByteArrayInputStream(pdfFile.bytes)
            val document = PDDocument.load(inputStream)
            val renderer = PDFRenderer(document)

            // Render the first page of the PDF (300 DPI)
            val pageImage: BufferedImage = renderer.renderImageWithDPI(0, 300f)

            // Convert BufferedImage to byte array
            val baos = ByteArrayOutputStream()
            Thumbnails.of(pageImage).size(200, 200).outputFormat("png").toOutputStream(baos)
            val thumbnailBytes = baos.toByteArray()

            document.close()

            logger.debug { "=== end generatePdfThumbnail ===" }
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(thumbnailBytes)
        } catch (e: Exception) {
            e.printStackTrace()
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    private fun extractSlideImage(ppt: XMLSlideShow): BufferedImage {
        val slide = ppt.slides[0]
        val dimension = Dimension(720, 540)
        val image = BufferedImage(dimension.width, dimension.height, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()

        try {
            slide.draw(graphics)
        } catch (e: Exception) {
            throw Exception("ERROR : ${e.message}")
        } finally {
            graphics.dispose()
        }

        return image
    }
}