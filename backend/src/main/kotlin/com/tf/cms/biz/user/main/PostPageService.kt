package com.tf.cms.biz.user.main

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.fileupload.FileStorageService
import com.tf.cms.biz.common.ms.MsTeamsEventBroker
import com.tf.cms.biz.common.ms.MsTeamsEventType
import com.tf.cms.biz.common.pageview.UserHistoryDto
import com.tf.cms.biz.common.pageview.UserHistoryQueueProcessor
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.CategoryAccessDeniedException
import com.tf.cms.common.model.DetailsType
import com.tf.cms.common.model.FileClassType
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.CodeHolder
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.google.common.base.Strings
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.common.ref.CommonRefService
import com.tf.cms.common.jpa.dto.*
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrElse
import kotlin.jvm.optionals.getOrNull
import org.springframework.stereotype.Component

/**
 * POST(개시물) 한개에 대한 정보 제공
 */
@Component
class PostPageService(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbPostMeTagRepository: TbPostMetaTagRepository,
    private val tbPostContentsDetailRepository: TbPostContentsDetailRepository,
    private val fileStorageService: FileStorageService,
    private val tbAttachedFileRepository: TbAttachedFileRepository,
    private val userHistoryQueueProcessor: UserHistoryQueueProcessor,
    private val codeHolder: CodeHolder,
    private val menuIdHolder: MenuIdHolder,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val tbPostMetaStatisticRepository: TbPostMetaStatisticRepository,
    private val tbPostMetaInfoRepository: TbPostMetaInfoRepository,
    private val tbPostMetaFieldRepository: TbPostMetaFieldRepository,
    private val msTeamsEventBroker: MsTeamsEventBroker,
    private val commonRefService: CommonRefService,
) {
    private val logger = logger()

    /**
     * post 1개에 대한 기본 정보 조회
     */
    fun getPostInfo(userId: String, authGroupCds: List<String>?, postId: Int): PostDto {

        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        // 접근가능한 menuId들 조회
        val accessibleMenuIds = roleAndMenuComponent.getAccessibleMenuidsByAuthgroups(authGroupCds)

        // 조회
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val tbUserScrap = QTbUserScrap.tbUserScrap
        val tbUser = QTbUser.tbUser

        val post = jpaQueryFactory.select(
            Projections.fields(
                PostDto::class.java,
                tbPostContent.id,
                tbPostContent.postCategory,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.authLevel,
                tbPostContent.menu1Id,
                tbPostContent.menu2Id,
                tbPostContent.createdAt,
                tbPostContent.createdUserId,
                tbPostContent.createdUserNm,
                tbPostContent.modifiedAt,
                tbPostContent.modifiedUserNm,
                tbPostMetaStatistic.viewCnt,
                tbPostMetaStatistic.likesCnt,
                tbPostMetaStatistic.scrapCnt,
                tbPostMetaStatistic.shareCnt,
                tbUser.avatarImgPath,

                tbUserScrap.isNotNull.`as`("scrapes"),
            )
        ).from(tbPostContent)
            // avatar image path
            .leftJoin(tbUser).on(tbPostContent.createdUserId.eq(tbUser.userId))
            // 조회 건수
            .leftJoin(tbPostMetaStatistic).on(tbPostMetaStatistic.id.eq(tbPostContent.id))
            // scrap
            .leftJoin(tbUserScrap).on(tbUserScrap.id.postId.eq(tbPostContent.id).and(tbUserScrap.id.userId.eq(userId)))
            .where(tbPostContent.id.eq(postId))
            .where(tbPostContent.postType.eq("post"))
//            .where(tbPostContent.enabled.eq(true))
//            .where(tbPostContent.openType.`in`("public"))
            .where(MainPostHelper.defaultPostOneCondition())
            .fetchFirst()
            ?.let {
                // menu명 셋팅
                it.menuName1 = menuNamesMap[it.menu1Id]?.name
                it.menuName2 = menuNamesMap[it.menu2Id]?.name
                it.menuEngName1 = menuNamesMap[it.menu1Id]?.engName
                it.menuEngName2 = menuNamesMap[it.menu2Id]?.engName

                val menu2Id = it.menu2Id
                // filedownload 권한 셋팅
                it.canFileDownload = roleAndMenuComponent.getMenuAuthMapByAuthgroups(authGroupCds!!).get(menu2Id)

                val metaList = getPostMataInfo(postId)
                if (it.metaInfoItems == null) {
                    it.metaInfoItems = MetaInfoItems()
                }
//                it.postMetaInfo = metaList
                it.metaInfoItems?.item1 = metaList.find { meta -> meta.metaKey == "item1" }?.metaValue
                it.metaInfoItems?.item2 = metaList.find { meta -> meta.metaKey == "item2" }?.metaValue
                it.metaInfoItems?.item3 = metaList.find { meta -> meta.metaKey == "item3" }?.metaValue
                it.metaInfoItems?.item4 = metaList.find { meta -> meta.metaKey == "item4" }?.metaValue
                it.metaInfoItems?.item5 = metaList.find { meta -> meta.metaKey == "item5" }?.metaValue
                it.metaInfoItems?.item6 = metaList.find { meta -> meta.metaKey == "item6" }?.metaValue
                it.metaInfoItems?.item7 = metaList.find { meta -> meta.metaKey == "item7" }?.metaValue
                it.metaInfoItems?.item8 = metaList.find { meta -> meta.metaKey == "item8" }?.metaValue
                it.metaInfoItems?.item9 = metaList.find { meta -> meta.metaKey == "item9" }?.metaValue
                it.metaInfoItems?.item10 = metaList.find { meta -> meta.metaKey == "item10" }?.metaValue
                it
            }
            ?: throw BizException("게시물이 존재하지 않음.")


        // 접근가능여부 체크
        if (post.menu1Id != null && !accessibleMenuIds.contains(post.menu1Id)) {
            throw CategoryAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        }
        if (post.menu2Id != null && !accessibleMenuIds.contains(post.menu2Id)) {
            throw CategoryAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        }

        return post
    }

    /**
     * pdf, editor 등의 컨텐츠 내용들을 리턴
     */
    fun getPostContentsDetails(authGroupCds: List<String>?, postId: Int): List<TbPostContentsDetailDto> {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val tbPostContentsDetail = QTbPostContentsDetail.tbPostContentsDetail
        val result: List<TbPostContentsDetailDto> = jpaQueryFactory.select(
            Projections.fields(
                TbPostContentsDetailDto::class.java,
                tbPostContentsDetail.id,
                tbPostContentsDetail.postId,
                tbPostContentsDetail.detailsType,
                tbPostContentsDetail.filePath,
                tbPostContentsDetail.contents,
                tbPostContentsDetail.seq
            )
        )
            .from(tbPostContentsDetail)
            .where(tbPostContentsDetail.postId.eq(postId)).orderBy(tbPostContentsDetail.seq.asc())
            .fetch()

        return result
    }


    /**
     * 첨부된 파일목록 가져오기
     */
    fun getAttachedFiles(authGroupCds: List<String>?, postId: Int): MutableList<TbAttachedFileDto> {
        // 파일 다운로드 권한 체크
        val (canAccess, canDownload) = roleAndMenuComponent.canAccessToPostByAuthgroups(authGroupCds!!, postId)
        if (!canDownload) {
            throw BizException("파일 다운로드 권한이 없습니다.")
        }

        val tbAttachedFile = QTbAttachedFile.tbAttachedFile
        val entities = jpaQueryFactory.selectFrom(tbAttachedFile)
            .where(tbAttachedFile.postId.eq(postId))
            .where(tbAttachedFile.fileClass.eq("post"))
            .orderBy(tbAttachedFile.createdAt.asc())
            .fetch()

        val result = AttachFileMapper.INSTANCE.convertAttachFileEntityToDtos(entities)
        return result
    }

    /**
     * 첨부된 파일한개 가져오기
     */
    fun getAttachedFileByFileid(authGroupCds: List<String>?, fileId: Int): TbAttachedFileDto {

        val tbAttachedFile = QTbAttachedFile.tbAttachedFile
        val entity = jpaQueryFactory.selectFrom(tbAttachedFile)
            .where(tbAttachedFile.id.eq(fileId))
            .fetchFirst() ?: throw BizException("해당 파일이 존재하지 않습니다.")

        val attachFileDto = AttachFileMapper.INSTANCE.convertAttachFileEntityToDto(entity)

        // post인 경우에는 파일 다운로드 권한 체크
        if (attachFileDto?.fileClass == "post") {
            // 파일 다운로드 권한 체크
            val (canAccess, canDownload) = roleAndMenuComponent.canAccessToPostByAuthgroups(
                authGroupCds!!,
                attachFileDto.postId!!
            )
            if (!canDownload) {
                throw BizException("파일 다운로드 권한이 없습니다.")
            }
        }

        return attachFileDto
    }

    /**
     * post의  tag 목록 조회.
     */
    fun getPostMetas(authGroupCds: List<String>?, postId: Int): MutableMap<String, List<ValueAndLabel>> {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val resultMap = mutableMapOf<String, List<ValueAndLabel>>()

        // tag
        val tbPostMetaTag = QTbPostMetaTag.tbPostMetaTag
        val tags = jpaQueryFactory.select(
            Projections.constructor(
                ValueAndLabel::class.java,
                tbPostMetaTag.tag,
                tbPostMetaTag.tag,
            )
        ).from(tbPostMetaTag)
            .where(tbPostMetaTag.postId.eq(postId))
            .fetch()

        resultMap["tags"] = tags

        return resultMap
    }

    /**
     *  Post한개에 속한 detail 한개 조회
     */
    fun getPostDetailOne(authGroupCds: List<String>?, detailId: Int): TbPostContentsDetailDto {
        val tbPostContentsDetail = QTbPostContentsDetail.tbPostContentsDetail
        val result = jpaQueryFactory.select(
            Projections.fields(
                TbPostContentsDetailDto::class.java,
                tbPostContentsDetail.id,
                tbPostContentsDetail.postId,
                tbPostContentsDetail.detailsType,
                tbPostContentsDetail.filePath,
                tbPostContentsDetail.contents,
                tbPostContentsDetail.seq
            )
        )
            .from(tbPostContentsDetail)
            .where(tbPostContentsDetail.id.eq(detailId))
            .fetchFirst()
            ?: throw BizException("해당 상세 내용이 존재하지 않습니다. (fileId:$detailId)")

        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, result.postId!!)

        return result
    }


    /**
     * 한개의 Post와 동일한 주제에 속한 Post들
     */
    fun getPostRelatedTopicPosts(authGroupCds: List<String>?, postId: Int, fetchSize: Int): List<PostSimpleDto> {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val tbPostContent = QTbPostContent.tbPostContent

        // post가 속한 menu2Id
        val menu2Id = jpaQueryFactory.select(tbPostContent.menu2Id)
            .from(tbPostContent)
            .where(tbPostContent.id.eq(postId))
            .fetchFirst() ?: throw BizException("게시물이 존재하지 않음(id:$postId)")

        // topic들에 속한 post들 조회
        val result = jpaQueryFactory.select(
            Projections.fields(
                PostSimpleDto::class.java,
                tbPostContent.id,
                tbPostContent.postType,
                tbPostContent.title,
                tbPostContent.description,
                tbPostContent.openType,
                tbPostContent.enabled,
                tbPostContent.representativeImagePath,
                tbPostContent.authLevel,
                tbPostContent.menu2Id,
            )
        ).distinct()
            .from(tbPostContent)
            .where(MainPostHelper.defaultPostListCondition())
            .where(tbPostContent.postType.eq("post"))
            .where(tbPostContent.menu2Id.eq(menu2Id))
            .where(tbPostContent.id.ne(postId))
            .where(tbPostContent.enabled.eq(true)) // 사용
            .where(tbPostContent.openType.eq("public"))  // 공개
            .orderBy(tbPostContent.createdAt.desc())
            .limit(fetchSize.toLong())
            .fetch()
            .map {
                it.menuName2 = menuIdHolder.getMenuNmFromId(it.menu2Id)
                it
            }

        return result
    }

    @Transactional(rollbackOn = [Throwable::class])
    fun savePost(saveParam: PostSaveParam): Int {
        logger.info { "=== param : $saveParam" }
        val post = saveParam.info
        val postId = post.id
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        // postId가 파라미터로 넘어오면 update, 안넘어오면 insert
        if (postId != null) {
            return updatePost(saveParam)
        } else {
            return insertPost(saveParam)
        }
    }

    /**
     * 신규 저장
     */
    private fun insertPost(saveParam: PostSaveParam): Int {
        val post = saveParam.info
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        // 등록 권한 체크
        userInfo.hasPostRegisteringAuthThrowException(post.menu2Id ?: 0)

        // tb_post_contents
        val postId = TbPostContent().let {
            it.title = post.title
            it.description = post.description
            it.openType = post.openType
            it.postCategory = post.postCategory ?: "etc"
            it.postType = post.postType
            it.enabled = true
            it.representativeImagePath = post.representativeImagePath
            it.authLevel = post.authLevel
            it.menu1Id = post.menu1Id
            it.menu2Id = post.menu2Id
            it.createdAt = LocalDateTime.now()
            it.createdUserId = userInfo.id
            it.createdUserNm = userInfo.name
            val savedEntity = tbPostContentRepository.save(it)
            savedEntity?.id!!
        }

        // tb_post_meta_nation
        // 비었다면 etc
        if (saveParam.nations?.size ?: 0 == 0) {
            saveParam.nations = mutableListOf("etc")
        }

        // tb_post_meta_tag
        saveParam.tags?.forEach {
            val tag = it
            TbPostMetaTag().apply {
                this.postId = postId
                this.tag = tag
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostMeTagRepository.save(this)
            }
        }

        val tbPostMetaFieldList = tbPostMetaFieldRepository.findByMenu1IdAndMenu2Id(post.menu1Id!!, post.menu2Id!!)

//        // tb_post_meta_info
//        saveParam.info.metaInfoItems?.let { items ->
//            for (i in 1..10) {
//                val key = "item$i"
//                val value = items::class.members
//                    .firstOrNull { it.name == key }
//                    ?.call(items) as? String
//
//                if (!value.isNullOrBlank() && tbPostMetaFieldList.isNotEmpty()) {
//                    val matchedField = tbPostMetaFieldList.find { it.metaKey == key }
//                    val fieldId = matchedField?.id
//
//                    val entity = TbPostMetaInfo().apply {
//                        this.postId = postId
//                        this.metaFieldId = fieldId
//                        this.metaKey = key
//                        this.metaValue = value
//                        this.createdAt = LocalDateTime.now()
//                        this.createdUserId = userInfo.id
//                        this.createdUserNm = userInfo.name
//                    }
//                    tbPostMetaInfoRepository.save(entity)
//                }
//            }
//        }

        saveParam.info.metaInfoItems?.let { items ->
            // items 클래스에 item으로 시작하는 프로퍼티 이름 리스트 추출
            val itemProperties = items::class.members
                .filter { it.name.startsWith("item") && it.returnType.classifier == String::class }

            for (property in itemProperties) {
                val key = property.name
                val value = property.call(items) as? String

                if (!value.isNullOrBlank() && tbPostMetaFieldList.isNotEmpty()) {
                    val matchedField = tbPostMetaFieldList.find { it.metaKey == key }
                    val fieldId = matchedField?.id

                    val entity = TbPostMetaInfo().apply {
                        this.postId = postId
                        this.menu1Id = post.menu1Id
                        this.menu2Id = post.menu2Id
                        this.metaKey = key
                        this.metaValue = value
                        this.createdAt = LocalDateTime.now()
                        this.createdUserId = userInfo.id
                        this.createdUserNm = userInfo.name
                    }
                    tbPostMetaInfoRepository.save(entity)
                }
            }
        }

        // tb_post_contents_details
        var seq = 0
        saveParam.detail?.forEach {
            val dto = it
            val detailsType = DetailsType.findCode(dto.detailsType)
            if (detailsType == null) {
                throw BizException("detailsType이 유효하지 않음 (${dto.detailsType})")
            }
            seq++
            var path = dto.filePath
            if (detailsType == DetailsType.pdf) {
                if (Strings.isNullOrEmpty(path)) {
                    throw BizException("pdf인데 경로가 비었습니다.")
                }
                if (path!!.startsWith("temp")) {
                    // temp 디렉토리라면 원 디렉토리로 이동
                    path = fileStorageService.moveToActualDir(path)
                }
            }

            TbPostContentsDetail().apply {
                this.postId = postId
                this.detailsType = dto.detailsType
                this.filePath = path
                this.contents = dto.contents
                this.seq = seq.toShort()
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostContentsDetailRepository.save(this)
            }
        }

        // tb_attached_file
        saveParam?.insertedFiles?.forEach {
            val file = it
            var path = file.filePath!!
            path = fileStorageService.moveToActualDir(path)
            TbAttachedFile().apply {
                this.postId = postId
                this.downloadCnt = 0
                this.fileNm = file.fileNm
                if (FileClassType.findCode(file.fileClass) == null) {
                    throw BizException("fileClass가 유효하지 않음 (${file.fileClass})")
                }
                this.fileClass = file.fileClass
                this.fileExtension = file.fileExtension
                this.filePath = path
                this.fileSize = file.fileSize
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbAttachedFileRepository.save(this)
            }
        }

        saveParam?.deletedFileIds?.forEach {
            tbAttachedFileRepository.deleteById(it)
        }

        // tb_post_meta_statistics insert
        TbPostMetaStatistic().let {
            it.id = postId
            it.viewCnt = 0
            it.likesCnt = 0
            it.scrapCnt = 0
            it.shareCnt = 0
            tbPostMetaStatisticRepository.save(it)
        }

        // history에 insert
        TbUserHistory().let {
            it.postId = postId
            it.userId = userInfo.id
            it.postTitle = post.title
            it.description = "Post를 등록하였습니다."
            it.userName = userInfo.name
            it.actionType = UserHistoryActionType.post_register.name
            it.menu1Id = post.menu1Id
            it.menu1Nm = menuIdHolder.getMenuNmFromId(post.menu1Id)
            it.menu2Id = post.menu2Id
            it.menu2Nm = menuIdHolder.getMenuNmFromId(post.menu2Id)
            it.createdAt = LocalDateTime.now()
            tbUserHistoryRepository.save(it)
        }

        // teamviewer 알림
        msTeamsEventBroker.publishEvent(MsTeamsEventType.NewPostRegistered, postId)

        return postId
    }


    private fun updatePost(saveParam: PostSaveParam): Int {
        val post = saveParam.info
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val postId = post.id!!
        val postEntity = tbPostContentRepository.findById(postId).getOrElse { throw BizException("데이타가 존재하지 않음.") }
        // 등록 권한 체크
        userInfo.hasPostRegisteringAuthThrowException(postEntity.menu2Id ?: 0)

        // tb_post_contents
        postEntity.let {
            it.title = post.title
            it.description = post.description
            it.openType = post.openType
            it.enabled = true
            it.representativeImagePath = post.representativeImagePath
            it.authLevel = post.authLevel
//            it.menu1Id = post.menu1Id  메뉴는 수정 불가
//            it.menu2Id = post.menu2Id
            it.modifiedAt = LocalDateTime.now()
            it.modifiedUserId = userInfo.id
            it.modifiedUserNm = userInfo.name
            val newId: Int = tbPostContentRepository.save(it).id!!
            newId
        }

        // tb_post_meta_nation => 전체 삭제후에 새로 insert
        // 비었다면 etc
        if (saveParam.nations?.size ?: 0 == 0) {
            saveParam.nations = mutableListOf("etc")
        }

        // tb_post_meta_tag => 전체 삭제후에 새로 insert
        tbPostMeTagRepository.deleteByPostId(postId)
        saveParam.tags?.forEach {
            val tag = it
            TbPostMetaTag().apply {
                this.postId = postId
                this.tag = tag
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostMeTagRepository.save(this)
            }
        }

        // tb_post_meta_info
        tbPostMetaInfoRepository.deleteByPostId(postId)
        saveParam.info.metaInfoItems?.let { items ->
            // item1 ~ itemN 중 실제 값 있는 항목만 필터링
            val itemProperties = items::class.members
                .filter { it.name.startsWith("item") && it.returnType.classifier == String::class }
                .filter { prop -> !(prop.call(items) as? String).isNullOrBlank() }

            if (itemProperties.isNotEmpty()) {
                // 값이 있는 항목이 있을 때만 삭제 수행
//                tbPostMetaInfoRepository.deleteByPostId(postId)

                // 루프 전에 메타 필드 목록 한 번만 조회
                val tbPostMetaFieldList = tbPostMetaFieldRepository.findByMenu1IdAndMenu2Id(
                    post.menu1Id!!,
                    post.menu2Id!!
                )

                for (property in itemProperties) {
                    val key = property.name
                    val value = property.call(items) as String

                    val matchedField = tbPostMetaFieldList.find { it.metaKey == key }
                    val fieldId = matchedField?.id

                    val entity = TbPostMetaInfo().apply {
                        this.postId = postId
                        this.menu1Id = post.menu1Id
                        this.menu2Id = post.menu2Id
                        this.metaKey = key
                        this.metaValue = value
                        this.createdAt = LocalDateTime.now()
                        this.createdUserId = userInfo.id
                        this.createdUserNm = userInfo.name
                    }

                    tbPostMetaInfoRepository.save(entity)
                }
            }
        }

        // tb_post_contents_details => 전체 삭제후에 새로 insert
        tbPostContentsDetailRepository.deleteByPostId(postId)
        var seq = 0
        saveParam.detail?.forEach {
            val dto = it
            val detailsType = DetailsType.findCode(dto.detailsType)
            if (detailsType == null) {
                throw BizException("detailsType이 유효하지 않음 (${dto.detailsType})")
            }
            seq++
            var path = dto.filePath
            if (detailsType == DetailsType.pdf) {
                if (Strings.isNullOrEmpty(path)) {
                    throw BizException("pdf인데 경로가 비었습니다.")
                }
                if (path!!.startsWith("temp")) {
                    // temp 디렉토리라면 원 디렉토리로 이동
                    path = fileStorageService.moveToActualDir(path)
                }
            }

            TbPostContentsDetail().apply {
                this.postId = postId
                this.detailsType = dto.detailsType
                this.filePath = path
                this.contents = dto.contents
                this.seq = seq.toShort()
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbPostContentsDetailRepository.save(this)
            }
        }

        // tb_attached_file
        saveParam?.insertedFiles?.forEach {
            val file = it
            var path = file.filePath!!
            path = fileStorageService.moveToActualDir(path)
            TbAttachedFile().apply {
                this.postId = postId
                this.downloadCnt = 0
                this.fileNm = file.fileNm
                if (FileClassType.findCode(file.fileClass) == null) {
                    throw BizException("fileClass가 유효하지 않음 (${file.fileClass})")
                }
                this.fileClass = file.fileClass
                this.fileExtension = file.fileExtension
                this.filePath = path
                this.fileSize = file.fileSize
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo.id
                this.createdUserNm = userInfo.name
                tbAttachedFileRepository.save(this)
            }
        }

        saveParam?.deletedFileIds?.forEach {
            tbAttachedFileRepository.deleteById(it)
        }

        // history에 insert
        TbUserHistory().let {
            it.postId = postId
            it.userId = userInfo.id
            it.postTitle = post.title
            it.description = "Post를 수정하였습니다."
            it.userName = userInfo.name
            it.actionType = UserHistoryActionType.post_modify.name
            it.menu1Id = postEntity.menu1Id
            it.menu1Nm = menuIdHolder.getMenuNmFromId(post.menu1Id)
            it.menu2Id = postEntity.menu2Id
            it.menu2Nm = menuIdHolder.getMenuNmFromId(post.menu2Id)
            it.createdAt = LocalDateTime.now()
            tbUserHistoryRepository.save(it)
        }

        // teamviewer 알림
        msTeamsEventBroker.publishEvent(MsTeamsEventType.NewPostRegistered, postId)

        return postId
    }

    /**
     * page 조회를 저장하기 위해서
     */
    fun pushToHistoryQueueForPageView(postId: Int) {
        val entity = tbPostContentRepository.findById(postId).getOrNull()
        // page인 경우에는 통과
        if (entity?.postType == "page") {
            return
        }
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        UserHistoryDto().apply {
            this.postId = postId
            this.postTitle = entity?.title
            this.menu1Id = entity?.menu1Id
            this.menu2Id = entity?.menu2Id
            this.userId = userInfo.id
            this.userName = userInfo.name
            this.actionType = UserHistoryActionType.post_view.code
            this.description = "조회 하였습니다."
            this.createdAt = LocalDateTime.now()

            userHistoryQueueProcessor.push(this)
        }
    }

    /**
     * name:
     * description: 포스트 mata item 정보
     * author: 정상철
     * created: 2025-06-24

     *
     * @return
     */

    fun getPostMataInfo (
        postId: Int
    ): List<MetaInfoDto> {
        val tbPostContent = QTbPostContent.tbPostContent
        val tbPostMetaInfo = QTbPostMetaInfo.tbPostMetaInfo
        val tbPostMetaField = QTbPostMetaField.tbPostMetaField

        val whereCondition = BooleanBuilder();
        whereCondition.and(tbPostMetaInfo.postId.eq(postId))

        val result = jpaQueryFactory.select(
            Projections.fields(
                MetaInfoDto::class.java,
                tbPostMetaInfo.id.`as`("metaInfoId"),
                tbPostMetaInfo.metaKey,
                tbPostMetaInfo.metaValue,
                tbPostMetaField.metaDisplayOrder,
                tbPostMetaField.metaType,
                tbPostMetaField.metaNm,
                tbPostMetaField.groupCode,
            )
        )
            .from(tbPostMetaInfo)
            .leftJoin(tbPostContent).on(tbPostMetaInfo.postId.eq(tbPostContent.id))
            .leftJoin(tbPostMetaField).on(tbPostMetaField.menu1Id.eq(tbPostMetaInfo.menu1Id).and(tbPostMetaField.menu2Id.eq(tbPostMetaField.menu2Id).and(tbPostMetaField.metaKey.eq(tbPostMetaInfo.metaKey))))
            .where(whereCondition)
            .fetch()

        logger.info { "=== resultresultresultresult : ${result}" }

        return result
    }
    
    /**
     * name: 
     * description: postMetaFields 정보 (해당정보로 item label 및 해당하는 참조코드 매핑)
     * author: 정상철
     * created: 
    
     *
     * @return 
     */

    fun getPostFieldsByMenu1IdAndMenu2Id(
        menu1: String,
        menu2: String?,
    ): List<MetaFieldDto>{
        val tbPostMetaField = QTbPostMetaField.tbPostMetaField
        val tbRefGroup = QTbRefGroup.tbRefGroup

        val whereCondition = BooleanBuilder()

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        logger.info { "=== menu1Id : ${menu1Id}" }
        logger.info { "=== menu2Id : ${menu2Id}" }

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbPostMetaField.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbPostMetaField.menu2Id.eq(menu2Id))
        }

        val result = jpaQueryFactory.select(
            Projections.fields(
                MetaFieldDto::class.java,
                tbPostMetaField.id,
                tbPostMetaField.metaKey,
                tbPostMetaField.menu1Id,
                tbPostMetaField.menu2Id,
                tbPostMetaField.metaNm,
                tbPostMetaField.groupCode,
            )
        )
            .from(tbPostMetaField)
            .where(whereCondition)
            .fetch()
            .map { dto ->
                val refList = dto.groupCode
                    ?.takeIf { it.isNotBlank() }
                    ?.let { groupCode ->
                        commonRefService.findRefList(groupCode)
                            ?.map { ref ->
                                RefSelectDto(
                                    value = ref.code,
                                    label = ref.label
                                )
                            }
                    }

                dto.copy(refInfo = refList)
            }

        return result
    }
}

