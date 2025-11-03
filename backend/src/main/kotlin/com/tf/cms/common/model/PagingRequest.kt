package com.tf.cms.common.model

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

/**
 * Pageable과 동일하게 시작페이지를 0으로 맞춤.
 */
open class PagingRequest() {
    constructor(defaultPageSize:Int):this(){
        this.thePageSize = defaultPageSize
    }
    /** 한페이지에 보여줄 default row 수  */
    protected var thePageSize = 10

    /** 페이지 번호 (첫페이지가 0페이지)  */
    private var thePageNumber = 0

    fun getPageSize(): Int {
        return thePageSize
    }

    fun getPageNumber(): Int {
        return thePageNumber
    }

    fun setPageSize(size: String?) {
        thePageSize = size?.toIntOrNull() ?: thePageSize
        thePageSize = if (thePageSize > 1000) {
            1000
        } else if (thePageSize < 3) {
            3
        } else {
            thePageSize
        }
    }

    fun setPageNumber(no: String?) {
        thePageNumber = no?.toIntOrNull() ?: thePageNumber
        thePageNumber = if (thePageNumber < 0) {
            0
        } else {
            thePageNumber
        }
    }

    //==== limit, offset

    //==== limit, offset
    fun getLimit(): Int {
        return getPageSize()
    }

    /**
     * 0부터 시작
     */
    fun getOffset(): Int {
        return getPageSize() * getPageNumber()
    }

    /*
    Pageable은 0페이지부터 시작한다.
     */
    fun toPageable(): Pageable = PageRequest.of(getPageNumber(), getPageSize())

    override fun toString(): String {
        return "PagingRequest(thePageSize=$thePageSize, thePageNumber=$thePageNumber)"
    }


}