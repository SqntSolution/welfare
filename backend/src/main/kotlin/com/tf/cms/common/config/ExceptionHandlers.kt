package com.tf.cms.common.config

import com.tf.cms.common.model.*
import com.tf.cms.common.utils.logger
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.validation.ObjectError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.support.RedirectAttributes
import java.sql.SQLException

@ControllerAdvice
class RestControllerExceptionHandler{
    private val logger = logger()

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = [BizException::class])
    @ResponseBody
    protected fun onBizException(ex: BizException, request: WebRequest?): ErrorResponse {
        logger.error(ex) { "=== BizException - ${ex.message}" }
        return ErrorResponse("9100", ex.message)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = [SQLException::class])
    @ResponseBody
    protected fun onSqlError(ex: SQLException, request: WebRequest?): ErrorResponse {
        logger.error(ex) { "=== error - ${ex.message}" }
        return ErrorResponse("9200", "SQL 에러가 발생했습니다.")
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = [MethodArgumentNotValidException::class])
    @ResponseBody
    protected fun dtoValidation(ex: MethodArgumentNotValidException): ErrorResponse {
        logger.error(ex) { "=== error - ${ex.message}" }
        val errors = ex.bindingResult.allErrors
        val msg = errors.map { e: ObjectError -> e.defaultMessage }.joinToString(prefix = "(", postfix = ")", separator = ") (")
        return ErrorResponse("9300", "[validation error] : $msg")
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(value = [AccessDeniedException::class])
    @ResponseBody
    protected fun onAccessDeniedException(ex: AccessDeniedException, request: WebRequest?): ErrorResponse {
        logger.error(ex) { "=== error - ${ex.message}" }
        return ErrorResponse("9400", "권한이 없습니다.")
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(value = [CategoryAccessDeniedException::class, PostAccessDeniedException::class])
    @ResponseBody
    protected fun onCategoryAccessDeniedException(ex: AccessDeniedException, request: WebRequest?): ErrorResponse {
        logger.error(ex) { "=== error - ${ex.message}" }
        return ErrorResponse("9410", ex.message)
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = [Throwable::class])
    @ResponseBody
    protected fun onThrowable(ex: Throwable, request: WebRequest?): ErrorResponse {
        logger.error(ex) { "=== error - ${ex.message}" }
        return ErrorResponse("9000", ex.message)
    }

    @ResponseStatus(HttpStatus.FOUND)
    @ExceptionHandler(value = [UnknownUserException::class])
    protected fun onAccessUnknownUser(ex: UnknownUserException, request: WebRequest?, redirect: RedirectAttributes): String {
        logger.error(ex) { "=== error - ${ex.message}" }
        redirect.addFlashAttribute("ssoErrorMsg", ex.message)
        return "redirect:/api/v1/sso/error-page"
    }
}