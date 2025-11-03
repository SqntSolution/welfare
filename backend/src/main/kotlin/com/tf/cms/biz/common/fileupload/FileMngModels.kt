package com.tf.cms.biz.common.fileupload
import com.tf.cms.common.utils.DefaultConstructor
import org.springframework.core.io.Resource;

data class FileDownloadInfo (
    var filename: String? = null,
    var resource: Resource? = null,
    var size: Long = 0,
)

@DefaultConstructor
data class FileUploadInfo (
    var path: String,
    var filename: String,
    var fileSize: Long,
    var fileExtension: String? = null,
    var etcInfo: String? = null,
)
