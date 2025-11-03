package com.tf.cms.biz.admin.cs

import com.tf.cms.biz.common.code.CodeService
import com.tf.cms.biz.common.fileupload.AttachedFileService
import com.tf.cms.biz.common.history.UserHistoryInput
import com.tf.cms.biz.common.history.UserHistoryService
import com.tf.cms.biz.common.ms.MsTeamsEventBroker
import com.tf.cms.biz.common.ms.MsTeamsEventType
import com.tf.cms.common.jpa.entity.QTbBbsNormal
import com.tf.cms.common.jpa.entity.QTbBbsQna
import com.tf.cms.common.jpa.entity.TbBbsNormal
import com.tf.cms.common.jpa.repository.TbBbsNormalRepository
import com.tf.cms.common.jpa.repository.TbBbsQnaRepository
import com.tf.cms.common.jpa.repository.TbMenuRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.FileClassType
import com.tf.cms.common.model.MenuContentType
import com.tf.cms.common.model.UserHistoryActionType
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
class CsAdminService(
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
     * 게시판 목록 조회 (관리자)
     *
     * @param pageable
     * @param pMenuId
     * @param keyword
     * @param pMetaDivision
     * @param pOpenType
     * @return
     */
    fun findBbsNormalList(
            pageable: Pageable,
            pMenuId: Int,
            keyword: String?,
            pMetaDivision: String?,
            pOpenType: Boolean?
    ): Page<BbsNormalDto> {
        val qTbBbsNormal = QTbBbsNormal.tbBbsNormal

        val whereCondition = BooleanBuilder()
        whereCondition.and(qTbBbsNormal.menuId.eq(pMenuId))
        // 공개 여부
        if(pOpenType != null) {
            whereCondition.and(qTbBbsNormal.opened.eq(pOpenType))
        }
        // 검색어
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.title.contains(keyword))
        }
        // FAQ 분류
        if(!pMetaDivision.isNullOrBlank()) {
            whereCondition.and(qTbBbsNormal.metaDivision.eq(pMetaDivision))
        }
        // 권한레벨
        if(UserInfoHelper.getLoginUserInfo()?.authLevel!! >= 0) {
                whereCondition.and(qTbBbsNormal.authLevel.loe(UserInfoHelper.getLoginUserInfo()?.authLevel))
        }

        val resultData = jPAQueryFactory
                .selectFrom(qTbBbsNormal)
                .where(whereCondition)
//                .orderBy(qTbBbsNormal.noticeType.desc(), qTbBbsNormal.createdAt.desc())
            .orderBy(qTbBbsNormal.createdAt.desc())
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
     * 게시판 단건 조회 (관리자)
     *
     * @param pNormalBbsId
     * @return
     */
    fun findBbsNormal(pNormalBbsId: Int): BbsNormalDto {
        val tbBbsNormal = tbBbsNormalRepository.findById(pNormalBbsId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }

        val result = BbsNormalDto(tbBbsNormal).let {
            it.metaDivisionNm = codeService.findCodeLabel(FAQ_TYPE_CODE, it.metaDivision)
            it.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.BBS, it.id!!)
            it
        }

        return result
    }

    /**
     * 게시판 단건 저장 (관리자)
     *
     * @param menuContentType
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveBbsNormal(menuContentType: MenuContentType, dto: BbsNormalRequestDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        var result: TbBbsNormal? = null
        if(dto.id != null) {
            // 수정
            val tbBbsNormal = tbBbsNormalRepository.findById(dto.id!!)
                    .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }

            result = tbBbsNormal.apply {
                this.title = dto.title
                this.opened = dto.opened
                this.metaDivision = dto.metaDivision
                this.metaEtc = dto.metaEtc
                this.contents = dto.contents
                this.authLevel = dto.authLevel
                this.noticeType = dto.noticeType
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = userInfo?.id
                this.modifiedUserNm = userInfo?.name
            }
        } else {
            // 등록
            val tbMenuId = tbMenuRepository.findByContentType(menuContentType.code).firstOrNull()?.id

            result = TbBbsNormal().apply {
                this.menuId = tbMenuId
                this.title = dto.title
                this.viewCnt = 0
                this.createUserId = userInfo?.id
                this.createUserNm = userInfo?.name
                this.opened = dto.opened
                this.metaDivision = dto.metaDivision
                this.metaEtc = dto.metaEtc
                this.contents = dto.contents
                this.authLevel = dto.authLevel
                this.noticeType = dto.noticeType
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo?.id
                this.createdUserNm = userInfo?.name
            }
        }

        if(result != null) {
            // 게시물 저장
            val tbBbsNormal = tbBbsNormalRepository.save(result)

            // 첨부파일 저장
            if(!dto.attachedFileList.isNullOrEmpty()) {
                attachedFileService.insertAttachedFiles(FileClassType.BBS, tbBbsNormal.id!!, dto.attachedFileList!!)
            }

            // 첨부파일 삭제
            if(!dto.deleteFileList.isNullOrEmpty()) {
                attachedFileService.deleteAttachedFiles(dto.deleteFileList!!)
            }

            // (신규 등록된 공지만) 팀즈 메세지 전송
            if(dto.id == null) {
                msTeamsEventBroker.publishEvent(MsTeamsEventType.NoticeRegistered, tbBbsNormal.id!!)
            }
        }
    }

    /**
     * 게시판 단건 삭제 (관리자)
     *
     * @param normalBbsId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteBbsNormal(normalBbsId: Int) {
        tbBbsNormalRepository.deleteById(normalBbsId)

        // 첨부파일 삭제
        val ids = attachedFileService.findAttachedFiles(FileClassType.BBS, normalBbsId).map { it.id!! }
        attachedFileService.deleteAttachedFiles(ids)
    }

    /**
     * Q&A 목록 조회
     *
     * @param pageable
     * @param keyword
     * @param pMetaDivision
     * @return
     */
    fun findBbsQnaList(pageable: Pageable, keyword: String?, pMetaDivision: String?, responseYn: Boolean?): Page<BbsQnaDto> {
        val qTbBbsQna = QTbBbsQna.tbBbsQna

        val whereCondition = BooleanBuilder()
        // 제목 검색
        if(!keyword.isNullOrBlank()) {
            whereCondition.and(qTbBbsQna.title.contains(keyword))
        }
        // Q&A 구분
        if(!pMetaDivision.isNullOrBlank()) {
            whereCondition.and(qTbBbsQna.metaDivision.eq(pMetaDivision))
        }
        // 답변 여부
        if(responseYn != null) {
            if(responseYn) {
                whereCondition.and(qTbBbsQna.responseUserId.isNotNull)
            } else {
                whereCondition.and(qTbBbsQna.responseUserId.isNull)
            }
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

        val result = BbsQnaDto(tbBbsQna).let {
            it.responseYn = !it.responseUserId.isNullOrBlank()
            it.metaDivisionNm = codeService.findCodeLabel(QNA_TYPE_CODE, it.metaDivision)
            it.attachedFileList = attachedFileService.findAttachedFiles(FileClassType.QNA, it.id!!)
            it
        }

        return result
    }

    /**
     * Q&A 답변 등록
     *
     * @param qnaBbsId
     * @param pResponseContents
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertBbsQnaAnswer(qnaBbsId: Int, pResponseContents: String?) {
        val loginUser = UserInfoHelper.getLoginUserInfo()
        val tbBbsQna = tbBbsQnaRepository.findById(qnaBbsId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }
                .apply {
                    this.responseAt = LocalDateTime.now()
                    this.responseContents = pResponseContents
                    this.responseUserId = loginUser?.id
                    this.responseUserNm = loginUser?.name
                    this.modifiedAt = LocalDateTime.now()
                    this.modifiedUserId = loginUser?.id
                    this.modifiedUserNm = loginUser?.name
                }
        tbBbsQnaRepository.save(tbBbsQna)

        // 팀즈 메세지 전송
        msTeamsEventBroker.publishEvent(MsTeamsEventType.QnaResponseRegistered, tbBbsQna.id!!)

        // 이력 생성
        val history = UserHistoryInput().apply {
            this.postId = tbBbsQna.id
            this.userId = tbBbsQna.createUserId
            this.postTitle = tbBbsQna.title
            this.description = "답변이 등록되었습니다."
            this.userName = tbBbsQna.createUserNm
            this.actionType = UserHistoryActionType.qna_response.code
            this.menu1Id = menuIdHolder.getMenuFromId(tbBbsQna.menuId)?.parentId
            this.menu2Id = tbBbsQna.menuId
            this.menu1Nm = menuIdHolder.getMenuFromId(tbBbsQna.menuId)?.parentNm
            this.menu2Nm = menuIdHolder.getMenuFromId(tbBbsQna.menuId)?.menuNm
        }
        userHistoryService.saveUserHistory(history)
    }

    /**
     * Q&A 답변 수정
     *
     * @param qnaBbsId
     * @param pResponseContents
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateBbsQnaAnswer(qnaBbsId: Int, pResponseContents: String?) {
        val loginUser = UserInfoHelper.getLoginUserInfo()
        val tbBbsQna = tbBbsQnaRepository.findById(qnaBbsId)
                .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }

        tbBbsQna.apply {
            this.responseContents = pResponseContents
            this.modifiedAt = LocalDateTime.now()
            this.modifiedUserId = loginUser?.id
            this.modifiedUserNm = loginUser?.name
        }

        tbBbsQnaRepository.save(tbBbsQna)
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
}