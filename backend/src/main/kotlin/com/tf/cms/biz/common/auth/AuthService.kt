package com.tf.cms.biz.common.auth

import com.tf.cms.common.jpa.repository.TbAuthGroupRepository
import com.tf.cms.common.utils.logger
import org.springframework.stereotype.Service
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.PrivateKey
import java.util.Base64
import java.util.concurrent.ConcurrentHashMap
import kotlin.collections.set

@Service
class AuthService(
    private val tbAuthGroupRepository: TbAuthGroupRepository
) {
    private val logger = logger()
    private val keyMap = ConcurrentHashMap<String, KeyPair>()

    /**
     * 권한 그룹 명 조회
     *
     * @param authGroupCd
     * @return
     */
    fun findAuthGroupName(authGroupCd: String): String {
        return tbAuthGroupRepository.findById(authGroupCd).map { it.groupNm ?: "" }.orElse("")
    }

    /**
     * 공개키 생성
     */
    fun generatePublicKey(sessionId: String): String {
        val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
        keyPairGenerator.initialize(2048)
        val keyPair = keyPairGenerator.generateKeyPair()
        keyMap[sessionId] = keyPair

        return Base64.getEncoder().encodeToString(keyPair.public.encoded)
    }

    /**
     * 개인키 가져오기
     */
    fun getPrivateKey(sessionId: String?): PrivateKey? = keyMap.remove(sessionId)?.private

}