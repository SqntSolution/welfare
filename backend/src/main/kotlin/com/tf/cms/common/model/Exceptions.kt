package com.tf.cms.common.model

import org.springframework.security.access.AccessDeniedException

open class BizException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(cause: Throwable) : super(cause)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}

/**
 * 해당 카테고리(메뉴)에 권한이 없을때.
 */
open class CategoryAccessDeniedException : AccessDeniedException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}

/**
 * 해당 Post(게시물)에 권한이 없을때.
 */
open class PostAccessDeniedException : AccessDeniedException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}

class StorageException : BizException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}

/**
 * Unknown user exception
 */
open class UnknownUserException : AccessDeniedException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}

/**
 * 해당 Board(게시물)에 권한이 없을때.
 */
open class BoardAccessDeniedException : AccessDeniedException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable) : super(message, cause)
}