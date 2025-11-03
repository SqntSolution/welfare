package com.tf.cms.common.sso.cm

import com.tf.cms.common.utils.logger
import org.bouncycastle.util.io.pem.PemObject
import org.bouncycastle.util.io.pem.PemReader
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.io.UnsupportedEncodingException
import java.security.*
import java.security.interfaces.RSAPublicKey
import java.security.spec.InvalidKeySpecException
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.util.*
import javax.crypto.BadPaddingException
import javax.crypto.Cipher
import javax.crypto.IllegalBlockSizeException
import javax.crypto.NoSuchPaddingException

/**
 * <p>RSA 암호화 유틸</p>
 *
 * @author Hunwoo Park
 */
object CipherUtil {

    private val logger = logger()

    /**
     * 1024비트 RSA 키쌍을 생성합니다.
     *
     * @return
     * @throws NoSuchAlgorithmException
     */
    @Throws(NoSuchAlgorithmException::class)
    fun genRSAKeyPair(): KeyPair {
        val secureRandom = SecureRandom()
        val gen: KeyPairGenerator = KeyPairGenerator.getInstance("RSA")
        gen.initialize(1024, secureRandom)
        return gen.genKeyPair()
    }

    /**
     * Public Key로 RSA 암호화를 수행합니다.
     *
     * @param plainText 암호화할 평문입니다.
     * @param publicKey publicKey 공개키 입니다.
     * @return 암호화된 데이터를 base64 인코딩하여 리턴
     * @throws NoSuchPaddingException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     */
    @Throws(NoSuchPaddingException::class, NoSuchAlgorithmException::class, InvalidKeyException::class, BadPaddingException::class, IllegalBlockSizeException::class)
    fun encryptRSA(plainText: String, publicKey: Key?): String {
        val cipher = Cipher.getInstance("RSA")
        cipher.init(Cipher.ENCRYPT_MODE, publicKey)
        val bytePlain = cipher.doFinal(plainText.toByteArray())
        return Base64.getEncoder().encodeToString(bytePlain)
    }

    /**
     * RAS 복호화를 수행합니다.
     *
     * @param encrypted  암호화된 이진데이터를 base64 인코딩한 문자열 입니다.
     * @param privateKey 복호화를 위한 개인키 입니다.
     * @return
     * @throws NoSuchPaddingException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     * @throws UnsupportedEncodingException
     */
    @Throws(NoSuchPaddingException::class, NoSuchAlgorithmException::class, InvalidKeyException::class, BadPaddingException::class, IllegalBlockSizeException::class, UnsupportedEncodingException::class)
    fun decryptRSA(encrypted: String, privateKey: Key?): String {
        val cipher = Cipher.getInstance("RSA")
        val byteEncrypted = Base64.getDecoder().decode(encrypted.toByteArray())
        cipher.init(Cipher.DECRYPT_MODE, privateKey)
        val bytePlain = cipher.doFinal(byteEncrypted)
        return String(bytePlain, charset("utf-8"))
    }

    /**
     * Base64 엔코딩된 개인키 문자열로부터 PrivateKey객체를 얻는다.
     *
     * @param keyString
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    @Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
    fun getPrivateKeyFromBase64String(keyString: String): PrivateKey {
        val privateKeyString = keyString.replace("\\n".toRegex(), "").replace("-{5}[ a-zA-Z]*-{5}".toRegex(), "")
        val keyFactory = KeyFactory.getInstance("RSA")
        val keySpecPKCS8 = PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyString))
        return keyFactory.generatePrivate(keySpecPKCS8)
    }

    /**
     * Base64 엔코딩된 공용키 문자열로부터 PublicKey객체를 얻는다.
     *
     * @param keyString
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    @Throws(NoSuchAlgorithmException::class, InvalidKeySpecException::class)
    fun getPublicKeyFromBase64String(keyString: String): PublicKey {
        val publicKeyString = keyString.replace("\\n".toRegex(), "").replace("-{5}[ a-zA-Z]*-{5}".toRegex(), "")
        val keyFactory = KeyFactory.getInstance("RSA")
        val keySpecX509 = X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyString))
        return keyFactory.generatePublic(keySpecX509)
    }

    /**
     * pem 파일로 부터 PKCS8 형식의 개인키를 읽어온다
     *
     * @param inputStream
     * @return
     * @throws NoSuchAlgorithmException
     * @throws Exception
     */
    @Throws(NoSuchAlgorithmException::class)
    fun getPrivateKey(inputStream: InputStream?): PrivateKey? {
        val factory = KeyFactory.getInstance("RSA")
        try {
            InputStreamReader(inputStream!!).use { keyReader ->
                PemReader(keyReader).use { pemReader ->
                    val pemObject: PemObject = pemReader.readPemObject()
                    val content: ByteArray = pemObject.content
                    val privKeySpec = PKCS8EncodedKeySpec(content)
                    return factory.generatePrivate(privKeySpec)
                }
            }
        } catch (e: InvalidKeySpecException) {
            logger.error("Error, Cannot getPrivateKey", e)
            return null
        } catch (e: IOException) {
            logger.error("Error, Cannot getPrivateKey", e)
            return null
        }

    }

    @Throws(NoSuchAlgorithmException::class)
    fun getPublicKey(inputStream: InputStream?): RSAPublicKey? {
        val factory = KeyFactory.getInstance("RSA")
        try {
            InputStreamReader(inputStream!!).use { keyReader ->
                PemReader(keyReader).use { pemReader ->
                    val pemObject: PemObject = pemReader.readPemObject()
                    val content: ByteArray = pemObject.content
                    return factory.generatePublic(X509EncodedKeySpec(content)) as RSAPublicKey
                }
            }
        } catch (e: InvalidKeySpecException) {
            logger.error("Error, Cannot getPublicKey", e)
            return null
        } catch (e: IOException) {
            logger.error("Error, Cannot getPublicKey", e)
            return null
        }
    }

}

///**
// * Util 테스트용
// *
// * @param args
// * @throws NoSuchAlgorithmException
// */
//@Throws(NoSuchAlgorithmException::class)
//fun main() {
//    //test key
//    val keys: KeyPair = CipherUtil.genRSAKeyPair()
//    val publicKey = keys.public
//    val privateKey = keys.private
//
//    // 공개키를 Base64 인코딩한 문자일을 만듭니다.
//    val bytePublicKey = publicKey.encoded
//    val base64PublicKey = Base64.getEncoder().encodeToString(bytePublicKey)
//    println("Base64 Public Key : $base64PublicKey")
//
//    // 개인키를 Base64 인코딩한 문자열을 만듭니다.
//    val bytePrivateKey = privateKey.encoded
//    val base64PrivateKey = Base64.getEncoder().encodeToString(bytePrivateKey)
//    println("Base64 Private Key : $base64PrivateKey")
//}