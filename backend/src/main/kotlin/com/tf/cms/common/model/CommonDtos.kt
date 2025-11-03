package com.tf.cms.common.model

data class ErrorResponse(val errCode:String, val errMsg:String?)

data class ResultValue<V>(var result:V?)
data class ResultValue2<V, V2>(var result:V?, var result2:V2?)