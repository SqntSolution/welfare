package com.tf.cms.biz.admin.category

import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.logger
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import java.io.ByteArrayOutputStream
import java.net.URLEncoder
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@Tag(name = "[관리자] 카테고리(메뉴) API")
@RestController
@RequestMapping("/api/v1/admin/category")
class CategoryController(
        private val categoryService: CategoryService
) {
    private val logger = logger()

    @Operation(
        summary = "카테고리(메뉴) 조회",
    )
    @GetMapping("")
    fun findCategoryList(): ResponseEntity<List<CategoryViewSaveParam>> {
        val result = categoryService.findCategoryList()
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "카테고리(메뉴) 한건 조회")
    @GetMapping("/{menuId}")
    fun getCategory(@PathVariable("menuId") menuId: Int): ResponseEntity<CategoryViewSaveParam> {
        val result = categoryService.getCategory(menuId)
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "카테고리(메뉴) 한건 삭제")
    @DeleteMapping("/{menuId}")
    fun deleteCategory(@PathVariable("menuId") menuId: Int): ResponseEntity<String> {
        categoryService.deleteCategory(menuId)
        return ResponseEntity.ok("ok")
    }

    @Operation(summary = "카테고리(메뉴)의 순서 저장")
    @PostMapping("/menuseq")
    fun saveCategoryMenuSeq(@Valid @RequestBody list: List<CategorySeqSaveParam>): ResponseEntity<Int> {
        logger.debug { "=== save params : ${list?.size}" }
        categoryService.saveCategoryMenuSeq(list)
        return ResponseEntity.ok(list?.size)
    }

    @Operation(summary = "카테고리(메뉴) 한개 저장")
    @PostMapping("")
    fun saveCategory(@Valid @RequestBody param: CategoryViewSaveParam): ResponseEntity<String> {
        logger.debug { "=== save param : ${param}" }
        categoryService.saveCategory(param)
        return ResponseEntity.ok("ok")
    }


    @Operation(summary = "엑셀 다운로드")
    @GetMapping("/download/excel")
    fun downloadExcel(): ResponseEntity<ByteArray> {
        val list = categoryService.findCategoryList()

        return try {
            val byteArrayOutputStream = createExcelOutputStream(list)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-category_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }
    }


    /**
     * 엑셀 데이터 채우기
     */
    private fun createExcelOutputStream(params: List<CategoryViewSaveParam>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("카테고리")
            header.createCell(1).setCellValue("메뉴")
            header.createCell(2).setCellValue("경로")
            header.createCell(3).setCellValue("타이틀")
            header.createCell(4).setCellValue("사용여부")
            header.createCell(5).setCellValue("컴포넌트")
            header.createCell(6).setCellValue("link url")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                val parentId = param.parentId
                if(parentId==0){
                    row.createCell(0).setCellValue(param.menuNm)
                    row.createCell(1).setCellValue("")
                }else{
                    row.createCell(0).setCellValue("")
                    row.createCell(1).setCellValue(param.menuNm)
                }
                row.createCell(2).setCellValue(param.path)
                row.createCell(3).setCellValue(param.title)
                row.createCell(4).setCellValue(if(param.enabled==true) "사용" else "사용안함")
                if(parentId!=0){
                    row.createCell(5).setCellValue(
                        when(param.contentType){
                            "link" -> "Link"
                            "page" -> "Page"
                            else -> "Board"
                        }
                    )
                    if(param.contentType=="link"){
                        row.createCell(6).setCellValue(param.link ?: "")
                    }
                }
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }
}