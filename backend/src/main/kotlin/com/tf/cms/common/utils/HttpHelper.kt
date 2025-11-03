package com.tf.cms.common.utils

import com.tf.cms.common.model.BizException
import okhttp3.FormBody
import okhttp3.Headers
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.stereotype.Component

@Component
class HttpHelper(
        private val okHttpClient: OkHttpClient
) {
    companion object {
        private val APPLICATION_JSON: MediaType = "application/json".toMediaType()
    }

    private val logger = logger()

    /**
     * form 방식으로 POST 요청
     */
    fun postParamsHttpRequest(url: String, params: MutableMap<String, String>): StatuscodeAndBody {
        val formBody = setFormBody(params)
        val request: Request = Request.Builder()
                .url(url)
                .post(formBody)
                .build()

        okHttpClient.newCall(request).execute().use { response ->
            return StatuscodeAndBody(successful = response.isSuccessful,  statuscode=response.code, body = response?.body?.string())
        }
    }

    /**
     * form 방식으로 POST 요청
     */
    fun postParamsHttpRequest2(url: String, params: MutableMap<String, String>): String? {
        val response = postParamsHttpRequest(url, params)
        if(response.successful) {
            return response.body
        } else {
            logger.error { "=== okhttp error : (${response.successful}) (${response.statuscode}) (${response.body})" }
            throw BizException("API 요청 중 오류 발생 (${response.statuscode})")
        }
    }

    /**
     * JSON 방식으로 POST 요청
     */
    fun postJsonHttpRequest(url: String, json: String): StatuscodeAndBody {
        val body: RequestBody = json.toRequestBody(APPLICATION_JSON)
        val request: Request = Request.Builder()
                .url(url)
                .post(body)
                .build()

        okHttpClient.newCall(request).execute().use { response ->
            return StatuscodeAndBody(successful = response.isSuccessful,  statuscode=response.code, body = response?.body?.string())
        }
    }

    /**
     * JSON 방식으로 POST 요청
     */
    fun postJsonHttpRequest2(url: String, json: String): String? {
        val response = postJsonHttpRequest(url, json)
        if(response.successful) {
            return response.body
        } else {
            logger.error { "=== okhttp error : (${response.successful}) (${response.statuscode}) (${response.body})" }
            throw BizException("API 요청 중 오류 발생 (${response.statuscode})")
        }
    }

    /**
     * JSON 방식으로 POST 요청 (header 추가)
     */
    fun postJsonHttpRequest(url: String, json: String, header: MutableMap<String, String>): StatuscodeAndBody {
        val headers: Headers = setHeaders(header)
        val body: RequestBody = json.toRequestBody(APPLICATION_JSON)
        val request: Request = Request.Builder()
                .url(url)
                .headers(headers)
                .post(body)
                .build()

        okHttpClient.newCall(request).execute().use { response ->
            return StatuscodeAndBody(successful = response.isSuccessful,  statuscode=response.code, body = response?.body?.string())
        }
    }

    /**
     * JSON 방식으로 POST 요청 (header 추가)
     */
    fun postJsonHttpRequest2(url: String, json: String, header: MutableMap<String, String>): String? {
        val response  = postJsonHttpRequest(url, json, header)
        if(response.successful) {
            return response.body
        } else {
            logger.error { "=== okhttp error : (${response.successful}) (${response.statuscode}) (${response.body})" }
            throw BizException("API 요청 중 오류 발생 (${response.statuscode})")
        }
    }

    /**
     * JSON 방식으로 get 요청 (header 추가)
     */
    fun getHttpRequest(url: String, headers: Map<String, String>): String? {
        val request = Request.Builder()
            .url(url)
            .headers(setHeaders(headers))
            .get()
            .build()

        okHttpClient.newCall(request).execute().use { response ->
            if (response.isSuccessful) {
                return response.body?.string()
            } else {
                logger.error { "=== GET 요청 오류 (${response.code}) ${response.body?.string()}" }
                throw BizException("GET 요청 중 오류 발생 (${response.code})")
            }
        }
    }

    fun setFormBody(params: Map<String, String>): FormBody {
        val formBody = FormBody.Builder()
        params.forEach { (key, value) -> formBody.add(key, value) }
        return formBody.build()
    }

    fun setHeaders(params: Map<String, String>): Headers {
        val headersBuilder = Headers.Builder()
        params.forEach { (key, value) -> headersBuilder.add(key, value) }
        return headersBuilder.build()
    }

    data class StatuscodeAndBody(
        val successful:Boolean,
        val statuscode:Int,
        val body:String?,
    )
}