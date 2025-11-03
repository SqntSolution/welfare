package com.tf.cms.biz.admin.popup

import com.tf.cms.common.jpa.entity.QTbPopup
import com.tf.cms.common.jpa.entity.TbPopup
import com.tf.cms.common.jpa.repository.TbPopupRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class PopupService (
        private val jpaQueryFactory: JPAQueryFactory,
        private val tbPopupRepository: TbPopupRepository,
        private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    companion object {
        private const val POPUP_TYPE_CODE = "POPUP_TYPE"
    }

    /**
     * 팝업 목록 조회 (관리자)
     *
     * @param pageable
     * @return
     */
    fun findPopupList(
            pageable: Pageable
    ): Page<PopupDto> {
        val qTbPopup = QTbPopup.tbPopup

        val whereCondition = BooleanBuilder()
//        whereCondition.and(true)

        val resultData = jpaQueryFactory
            .selectFrom(qTbPopup)
            .where(whereCondition)
            .orderBy(qTbPopup.createdAt.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()
            .map { tbPopup ->
                PopupDto(tbPopup).apply {
                    val popupDto = this
                    if(displayMenuIds=="0"){
                        popupDto.menuNm = "Home"
                    }else{
                        popupDto?.displayMenuIds?.runCatching { popupDto.menuNm = menuIdHolder.getMenuNmFromId(this.toInt())   }
                    }
                }
            }

//        logger.debug { "resultData : $resultData" }

        val queryFetchCount = jpaQueryFactory
            .select(qTbPopup.count())
            .from(qTbPopup)
            .where(whereCondition)
            .fetchFirst()


//        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }


    /**
     * 팝업 단건 조회 (관리자)
     *
     * @param pPopupId
     * @return
     */

    fun findPopup(pPopupId: Int): PopupDto {
        val tbPopup = tbPopupRepository.findById(pPopupId)
            .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.")}

        val result = PopupDto(tbPopup)

        return result
    }

    /**
     * 팝업 저장 (관리자)
     *
     * @param dto
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun savePopup(dto: PopupRequestDto) {
        menuIdHolder.notifyMenuMofified()

        val userInfo = UserInfoHelper.getLoginUserInfo()
        var result: TbPopup? = null

        if(dto.id != null){
            //수정 로직
            val tbPopup = tbPopupRepository.findById(dto.id!!)
                .orElseThrow { BizException("해당 팝업이 존재 하지 않습니다.") }

            result = tbPopup.apply {
                this.title = dto.title
                this.enabled = dto.enabled
                this.displayMenuIds = dto.displayMenuIds
                this.link = dto.link
                this.displayType = dto.displayType
                this.displayStartDate = dto.displayStartDate
                this.displayEndDate = dto.displayEndDate
                this.contents = dto.contents
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = userInfo?.id
                this.modifiedUserNm = userInfo?.name
            }
        }else {
            //등록의 경우
            result = TbPopup().apply {
                this.title = dto.title
                this.enabled = dto.enabled
                this.displayMenuIds = dto.displayMenuIds
                this.link = dto.link
                this.displayType = dto.displayType
                this.displayStartDate = dto.displayStartDate
                this.displayEndDate = dto.displayEndDate
                this.contents = dto.contents
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo?.id
                this.createdUserNm = userInfo?.name
            }
        }

        if(result != null) {
            tbPopupRepository.save(result)
        }
    }

    /**
     * 팝업 삭제 (관리자)
     *
     * @param pPopupId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deletePopup(pPopupId: Int){
        menuIdHolder.notifyMenuMofified()
        tbPopupRepository.deleteById(pPopupId)
//        팝업 이미지? 삭제 고려해야한다
    }
}