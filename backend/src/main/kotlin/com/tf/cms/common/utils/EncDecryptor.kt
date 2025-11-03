package com.tf.cms.common.utils

import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

object EncDecryptor {
    final val key = SecretKeySpec("slvkfEnrrnfrsi99".toByteArray(), "AES")
    final val iv = IvParameterSpec(ByteArray(16))
    final val algorithm = "AES/CBC/PKCS5Padding"

    fun decrypt(cipherText: String?): String? {
        cipherText ?: return null

        val cipher = Cipher.getInstance(algorithm)
        cipher.init(Cipher.DECRYPT_MODE, key, iv)
        val plainText = cipher.doFinal(Base64.getDecoder().decode(cipherText))
        return String(plainText)
    }

    fun decryptOrNull(cipherText: String) : String?{
        try {
            return decrypt(cipherText)
        }catch (ex:Exception) {
            return null
        }
    }

    fun decryptOrEmpty(cipherText: String) : String{
        try {
            return decrypt(cipherText) ?: ""
        }catch (ex:Exception) {
            return ""
        }
    }

    fun encrypt(inputText: String?): String? {
        inputText ?: return null

        val cipher = Cipher.getInstance(algorithm)
        cipher.init(Cipher.ENCRYPT_MODE, key, iv)
        val cipherText = cipher.doFinal(inputText.toByteArray())
        return Base64.getEncoder().encodeToString(cipherText)
    }
}

