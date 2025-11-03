package com.tf.cms.biz.user.cs

import com.tf.cms.biz.common.code.CodeService
import com.tf.cms.biz.common.fileupload.AttachedFileService
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.biz.common.ms.MsTeamsEventBroker
import com.tf.cms.biz.common.ms.MsTeamsEventType
import com.tf.cms.common.jpa.entity.QTbBbsNormal
import com.tf.cms.common.jpa.entity.QTbBbsQna
import com.tf.cms.common.jpa.entity.TbBbsNormal
import com.tf.cms.common.jpa.entity.TbBbsQna
import com.tf.cms.common.jpa.repository.TbBbsNormalRepository
import com.tf.cms.common.jpa.repository.TbBbsQnaRepository
import com.tf.cms.common.jpa.repository.TbMenuRepository
import com.tf.cms.common.model.*
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class CsService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val codeService: CodeService,
        private val attachedFileService: AttachedFileService,
        private val tbBbsNormalRepository: TbBbsNormalRepository,
        private val tbBbsQnaRepository: TbBbsQnaRepository,
        private val tbMenuRepository: TbMenuRepository,
        private val msTeamsEventBroker: MsTeamsEventBroker,
        private val userHistoryService: UserHistoryService,
        private val menuIdHolder: MenuIdHolder
) {
    private val logger = logger()

    companion object {
        private const val FAQ_TYPE_CODE = "FAQ_TYPE"
        private const val QNA_TYPE_CODE = "QNA_TYPE"
    }

    /**
     * 게시판 목록 조회
     *
     * @param pageable
     * @param pMenuId
     * @param keyword
     * @param pMetaDivision
     * @return
     */
    fun findBbsNormalList(
            pageable: Pageable,
            pMenuId: Int,
            keyword: String?,
            pMetaDivision: String?,
    ): Page<BbsNormalDto> {
        val qTbBbsNormal = QTbBbsNormal.tbBbsNormal

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbBbsNormal.menuId.eq(pMenuId))
        whereCondition.and(qTbBbsNormal.opened.eq(true))
        // 검색어
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.title.contains(keyword))
        }
        // FAQ 분류
        if(!pMetaDivision.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.metaDivision.eq(pMetaDivision))
        }
        // 권한레벨
        if(UserInfoHelper.getLoginUserInfo()?.authLevel!! >=0) {
                whereCondition.and(qTbBbsNormal.authLevel.loe(UserInfoHelper.getLoginUserInfo()?.authLevel))
        }

        val resultData = jPAQueryFactory
                .selectFrom(qTbBbsNormal)
                .where(whereCondition)
                .orderBy(qTbBbsNormal.noticeType.desc(), qTbBbsNormal.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map { tbBbsNormal ->
                    BbsNormalDto(tbBbsNormal).let { bbsNormalDto ->
                        bbsNormalDto.metaDivisionNm = codeService.findCodeLabel(FAQ_TYPE_CODE, bbsNormalDto.metaDivision)
                        bbsNormalDto.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.BBS, bbsNormalDto.id!!)
                        bbsNormalDto
                    }
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
                .select(qTbBbsNormal.count())
                .from(qTbBbsNormal)
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * 게시판 단건 조회
     *
     * @param pNormalBbsId
     * @return
     */
    fun findBbsNormal(pNormalBbsId: Int): BbsNormalDto {
        val tbBbsNormal = tbBbsNormalRepository.findById(pNormalBbsId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }
        if(tbBbsNormal.opened == false) {
            throw BizException("비공개 게시글입니다.")
        }
        if(tbBbsNormal.authLevel!! > 1  ) {
            throw BizException("비공개 게시글입니다.")
        }

        // 조회수 업데이트
        updateBbsNormalViewCnt(tbBbsNormal)

        val result = BbsNormalDto(tbBbsNormal).let {
            it.metaDivisionNm = codeService.findCodeLabel(FAQ_TYPE_CODE, it.metaDivision)
            it.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.BBS, it.id!!)
            it
        }

        return result
    }

    /**
     * Q&A 목록 조회
     *
     * @param pageable
     * @param keyword
     * @param pMetaDivision
     * @return
     */
    fun findBbsQnaList(pageable: Pageable, keyword: String?, pMetaDivision: String?, onlyMyOwn: Boolean?): Page<BbsQnaDto> {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val role = userInfo?.role
        val qTbBbsQna = QTbBbsQna.tbBbsQna

        val whereCondition = BooleanBuilder()
        
        if (role == TheRole.ROLE_OPERATOR || role == TheRole.ROLE_MASTER) {
            // 관리자: 공개여부가 비공개인 것도 출력
        } else {
            whereCondition.andAnyOf(
                qTbBbsQna.opened.eq(true),
                qTbBbsQna.createUserId.eq(userInfo?.id)
            )
        }

        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbBbsQna.title.contains(keyword))
        }
        if(!pMetaDivision.isNullOrBlank()) {
            whereCondition.and(qTbBbsQna.metaDivision.eq(pMetaDivision))
        }

        if(onlyMyOwn == true) {
            whereCondition.and(qTbBbsQna.createUserId.eq(userInfo?.id))
        }


        val resultData = jPAQueryFactory
                .selectFrom(qTbBbsQna)
                .where(whereCondition)
                .orderBy(qTbBbsQna.createdAt.desc())
                .offset(pageable.offset)
                .limit(pageable.pageSize.toLong())
                .fetch()
                .map { tbBbsQna ->
                    BbsQnaDto(tbBbsQna).let { bbsQnaDto ->
                        bbsQnaDto.responseYn = !bbsQnaDto.responseUserId.isNullOrBlank()
                        bbsQnaDto.metaDivisionNm = codeService.findCodeLabel(QNA_TYPE_CODE, bbsQnaDto.metaDivision)
                        bbsQnaDto.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.QNA, bbsQnaDto.id!!)
                        bbsQnaDto
                    }
                }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
                .select(qTbBbsQna.count())
                .from(qTbBbsQna)
                .where(whereCondition)
                .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * Q&A 단건 조회
     *
     * @param pQnaBbsId
     * @return
     */
    fun findBbsQna(pQnaBbsId: Int): BbsQnaDto {
        val tbBbsQna = tbBbsQnaRepository.findById(pQnaBbsId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }
        if(hasNotViewerAuth(tbBbsQna.opened!!, tbBbsQna.createUserId!!)) {
            throw BizException("비공개 게시글입니다.")
        }

        // 조회수 업데이트
        updateBbsQnaViewCnt(tbBbsQna)

        val result = BbsQnaDto(tbBbsQna).let {
            it.responseYn = !it.responseUserId.isNullOrBlank()
            it.metaDivisionNm = codeService.findCodeLabel(QNA_TYPE_CODE, it.metaDivision)
            it.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.QNA, it.id!!)
            it
        }

        return result
    }

    /**
     * Q&A 질문 등록
     *
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertBbsQnaQuestion(pMenuId: Int, dto: BbsQnaQuestionDto) {
        val loginUser = UserInfoHelper.getLoginUserInfo()

        val tbBbsQna = TbBbsQna().apply {
            this.menuId = pMenuId
            this.title = dto.title
            this.viewCnt = 0
            this.createUserId = loginUser?.id
            this.createUserNm = loginUser?.name
            this.opened = dto.opened
            this.metaDivision = dto.metaDivision
            this.metaEtc = dto.metaEtc
            this.contents = dto.contents
            this.createdAt = LocalDateTime.now()
            this.createdUserId = loginUser?.id
            this.createdUserNm = loginUser?.name
        }

        val entity = tbBbsQnaRepository.save(tbBbsQna)

        // 첨부파일 저장
        if(!dto.attachedFileList.isNullOrEmpty()) {
            attachedFileService.insertAttachedFiles(FileClassType.QNA, entity.id!!, dto.attachedFileList!!)
        }

        // 팀즈 메세지 전송
        msTeamsEventBroker.publishEvent(MsTeamsEventType.QnaQuestionRegistered, entity.id!!)

        // 이력 생성
        val history = UserHistoryInput().apply {
            this.postId = entity.id!!
            this.userId = loginUser?.id!!
            this.postTitle = entity.title
            this.description = "질문이 등록되었습니다."
            this.userName = loginUser.name
            this.actionType = UserHistoryActionType.qna_request.code
            this.menu1Id = menuIdHolder.getMenuFromId(entity.menuId)?.parentId
            this.menu2Id = entity.menuId
            this.menu1Nm = menuIdHolder.getMenuFromId(entity.menuId)?.parentNm
            this.menu2Nm = menuIdHolder.getMenuFromId(entity.menuId)?.menuNm
        }
        userHistoryService.saveUserHistory(history)
    }

    /**
     * Q&A 질문 수정
     *
     * @param bbsQnaId
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateBbsQnaQuestion(bbsQnaId: Int, dto: BbsQnaQuestionDto) {
        val tbBbsQna = tbBbsQnaRepository.findById(bbsQnaId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }
        if(hasNotViewerAuth(tbBbsQna.opened!!, tbBbsQna.createUserId!!)) {
            throw BizException("비공개 게시글입니다.")
        }
        val loginUser = UserInfoHelper.getLoginUserInfo()

        tbBbsQna.apply {
            this.menuId = dto.menuId
            this.title = dto.title
            this.opened = dto.opened
            this.metaDivision = dto.metaDivision
            this.metaEtc = dto.metaEtc
            this.contents = dto.contents
            this.modifiedAt = LocalDateTime.now()
            this.modifiedUserId = loginUser?.id
            this.modifiedUserNm = loginUser?.name
        }

        val entity = tbBbsQnaRepository.save(tbBbsQna)

        // 첨부파일 저장
        if(!dto.attachedFileList.isNullOrEmpty()) {
            attachedFileService.insertAttachedFiles(FileClassType.QNA, entity.id!!, dto.attachedFileList!!)
        }

        // 첨부파일 삭제
        if(!dto.deleteFileList.isNullOrEmpty()) {
            attachedFileService.deleteAttachedFiles(dto.deleteFileList!!)
        }
    }

    /**
     * Q&A 질문 삭제
     *
     * @param bbsQnaId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteBbsQnaQuestion(bbsQnaId: Int) {
        tbBbsQnaRepository.deleteById(bbsQnaId)

        // 첨부파일 삭제
        val ids = attachedFileService.findAttachedFiles(FileClassType.QNA, bbsQnaId).map { it.id!! }
        attachedFileService.deleteAttachedFiles(ids)
    }

    /**
     * CS Center 메인화면 조회
     *
     * @return
     */
    fun findCsCenterMain(): CsCenterMainDto {
        val pageable = PagingRequest(5).toPageable()
        // 공지사항 목록 조회
        val tbMenuNoticeList = tbMenuRepository.findByContentType(MenuContentType.NOTICE.code)
        val noticeList = if(tbMenuNoticeList.isNotEmpty()) {
            findBbsNormalList(pageable, tbMenuNoticeList.first().id!!, null, null).content
        } else {
            emptyList()
        }
        // FAQ 목록 조회
        val tbMenuFaqList = tbMenuRepository.findByContentType(MenuContentType.FAQ.code)
        val faqList = if(tbMenuFaqList.isNotEmpty()) {
            findBbsNormalList(pageable, tbMenuFaqList.first().id!!, null, null).content
        } else {
            emptyList()
        }
        // Q&A 목록 조회
        val qnaLiat = findBbsQnaList(pageable, null, null, null).content

        /** AboutInsightImg, UserManualImg 추가 필요... */


        return CsCenterMainDto().apply {
            this.bbsNoticeList = noticeList
            this.bbsFaqList = faqList
            this.bbsQnaList = qnaLiat
            this.aboutConActImg = ""
            this.userManualImg = ""
        }
    }

    /**
     * 게시판 조회수 증가
     */
    @Transactional(rollbackOn = [Throwable::class])
    private fun updateBbsNormalViewCnt(e: TbBbsNormal) {
        e.apply { viewCnt = viewCnt?.plus(1) }
        tbBbsNormalRepository.save(e)
    }

    /**
     * Q&A 조회수 증가
     */
    @Transactional(rollbackOn = [Throwable::class])
    private fun updateBbsQnaViewCnt(e: TbBbsQna) {
        e.apply { viewCnt = viewCnt?.plus(1) }
        tbBbsQnaRepository.save(e)
    }

    /**
     * 비공개 Q&A 열람 권한 체크
     */
    private fun hasNotViewerAuth(isOpen: Boolean, createUserId: String): Boolean {
        val loginUser = UserInfoHelper.getLoginUserInfo()
        logger.debug { "=== hasViewerAuth : $isOpen, $createUserId, ${loginUser?.id}, ${loginUser?.role}" }
        return !isOpen
                && (loginUser?.id != createUserId
                && loginUser?.role != TheRole.ROLE_MASTER
                && loginUser?.role != TheRole.ROLE_OPERATOR)
    }

    /**
     * 보도자료 목록 조회
     *
     * @param pageable
     * @param pMenuId
     * @param keyword
     * @param pMetaDivision
     * @return
     */
    fun getBbsNormalReleaseList(
        pageable: Pageable,
        pMenuId: Int,
        keyword: String?,
        pMetaDivision: String?,
    ): Page<BbsNormalDto> {
        val qTbBbsNormal = QTbBbsNormal.tbBbsNormal

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbBbsNormal.menuId.eq(pMenuId))
        whereCondition.and(qTbBbsNormal.opened.eq(true))
        // 검색어
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.title.contains(keyword))
        }
        // FAQ 분류
        if(!pMetaDivision.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.metaDivision.eq(pMetaDivision))
        }
        // 권한레벨
        if(UserInfoHelper.getLoginUserInfo()?.authLevel!! >=0) {
            whereCondition.and(qTbBbsNormal.authLevel.loe(UserInfoHelper.getLoginUserInfo()?.authLevel))
        }

        val resultData = jPAQueryFactory
            .selectFrom(qTbBbsNormal)
            .where(whereCondition)
            .orderBy(qTbBbsNormal.noticeType.desc(), qTbBbsNormal.createdAt.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()
            .map { tbBbsNormal ->
                BbsNormalDto(tbBbsNormal).let { bbsNormalDto ->
                    bbsNormalDto.metaDivisionNm = codeService.findCodeLabel(FAQ_TYPE_CODE, bbsNormalDto.metaDivision)
                    bbsNormalDto.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.BBS, bbsNormalDto.id!!)
                    bbsNormalDto
                }
            }
        logger.debug { "=== resultData : ${resultData.size}" }

        val queryFetchCount = jPAQueryFactory
            .select(qTbBbsNormal.count())
            .from(qTbBbsNormal)
            .where(whereCondition)
            .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }
}