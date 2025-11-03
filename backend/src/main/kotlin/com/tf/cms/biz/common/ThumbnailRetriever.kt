package com.tf.cms.biz.common

import com.tf.cms.common.jpa.entity.QTbUserMaster
import com.tf.cms.common.jpa.entity.QTbUser
import com.tf.cms.common.jpa.entity.TbUser
import com.tf.cms.common.jpa.repository.TbUserRepository
import com.tf.cms.common.utils.logger
import com.google.common.io.Files
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.io.File
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import javax.naming.directory.Attributes
import javax.naming.directory.SearchControls
import kotlin.concurrent.thread
import kotlin.jvm.optionals.getOrElse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationContext
import org.springframework.ldap.core.LdapTemplate
import org.springframework.stereotype.Component

/**
 *
 */
@Component
class ThumbnailRetriever(
    @Value("\${env}") private val env: String,
    @Value("\${location.image}") private val uploadRootPath: String,
    private val jpaQueryFactory: JPAQueryFactory,
    private val ldapTemplate: LdapTemplate,
    private val tbUserRepository: TbUserRepository,
    private val applicationContext: ApplicationContext,
    private val cacheEvictor: CacheEvictor,
) {
    val logger = logger()

    private fun me(): ThumbnailRetriever {
        return applicationContext.getBean(this::class.java)
    }

    fun processThumbnail(userId:String){
        logger.info { "=== processThumbnail userId:$userId" }
        if(env!="prod" && env!="test"){
            logger.info { "=== processThumbnail skip (env:$env)" }
            return
        }

        val tbUserMaster = QTbUserMaster.tbUserMaster
        val email = jpaQueryFactory.select(tbUserMaster.mailAddr)
            .from(tbUserMaster)
            .where(tbUserMaster.userId.eq(userId))
            .fetchFirst()

        if(email.isNullOrEmpty()){
            logger.info { "=== email이 비어서 통과 (userId:$userId)" }
            return
        }

        val tbUser = QTbUser.tbUser
        val avatarImgPath = jpaQueryFactory.select(tbUser.avatarImgPath)
            .from(tbUser)
            .where(tbUser.userId.eq(userId))
            .fetchFirst()

        if(avatarImgPath?.isNotBlank()==true){
            logger.info { "=== avatarImgPath가 있어서 통과 (userId:$userId)" }
            return
        }

        val thread = thread {
            me().updateThumbnailIfAvatarImagePathIsEmpty(userId, email)
        }
        thread.join(7 * 1000) // 5초 동안 대기
    }

    /**
     * tb_user테이블에 avatar_img_path가 비었다면, ldap에서 thumbnail을 가져와서 셋팅해 줌.
     */
    fun updateThumbnailIfAvatarImagePathIsEmpty(userId:String, email:String) {
        logger.info { "==== ldap thumbnail check : (userId:$userId) (email:$email)" }

        val controls = SearchControls()
        controls.searchScope = SearchControls.SUBTREE_SCOPE
        val list = ldapTemplate.search(
//            "CN=Organizational-Unit,CN=Schema,CN=Configuration,DC=cosmax,DC=ad",
            "",
            "mail=${email}",
            controls,
            { attr: Attributes -> attr }
        )

        logger.info{"=== ldap ($email) 갯수 : ${list.size}"}
        list.forEach {
            logger.info{"[${it.get("description").get()}] [${it.get("mail").get()}] "}
            val some = it.get("thumbnailPhoto")?.get()
            logger.info { "=== ldap thumbnail image($email) : ${some is ByteArray}) " }
            if(some is ByteArray){
                val filePath = generateImagePath()
                Files.write(some, File(uploadRootPath, filePath))
                me().updateAvatarImgPath(userId, filePath)
                cacheEvictor.clearUserInfoCache(userId)
            }
        }
    }

    val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM")  // yyyy-MM

    private fun generateImagePath(): String {
        val uniqueFilename: String = "avatar_${UUID.randomUUID().toString()}.jpg"
        val subPath = formatter.format(LocalDate.now())
        // /image/2024
        val dir = File(uploadRootPath, subPath)
        val resultFile = File(subPath, uniqueFilename)
        return resultFile.path
    }

    @Transactional
    fun updateAvatarImgPath(userId:String, path:String){
        // insert or update
        tbUserRepository.findById(userId).getOrElse {
            TbUser().let {
                it.userId = userId
                it
            }
        }.let {
            it.avatarImgPath = path
            tbUserRepository.save(it)
        }
    }

}