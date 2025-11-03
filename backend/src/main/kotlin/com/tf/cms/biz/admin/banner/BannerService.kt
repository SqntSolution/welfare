package com.tf.cms.biz.admin.banner

import com.tf.cms.biz.common.code.CodeService
import com.tf.cms.common.jpa.entity.QTbBanner
import com.tf.cms.common.jpa.entity.TbBanner
import com.tf.cms.common.jpa.repository.TbBannerRepository
import com.tf.cms.common.model.BizException
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
class BannerService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val codeService: CodeService,
        private val tbBannerRepository: TbBannerRepository
) {
    private val logger = logger()

    companion object {
        private const val BENNER_TYPE_CODE = "BENNER_TYPE"
    }

    /**
     * 배너 목록 조회 (관리자)
     *
     * @param pageable
     * @return
     */

    fun findBannerList(
        pageable: Pageable
    ): Page<BannerDto> {
        val qTbBanner = QTbBanner.tbBanner

        val whereCondition = BooleanBuilder()

        val resultData = jPAQueryFactory
            .selectFrom(qTbBanner)
            .where(whereCondition)
            .orderBy(qTbBanner.enabled.desc(), qTbBanner.displayOrder.asc(), qTbBanner.createdAt.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()
            .map { tbBanner ->
                BannerDto(tbBanner)
            }

        logger.debug { "=== resultData : $resultData" }

        val queryFetchCount = jPAQueryFactory
            .select(qTbBanner.count())
            .from(qTbBanner)
            .where(whereCondition)
            .fetchFirst()

        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
    }

    /**
     * 배너 단건 조회 (관리자)
     *
     * @param pBannerId
     * @return
     */

    fun findBanner(pBannerId: Int): BannerDto {
        val tbBanner = tbBannerRepository.findById(pBannerId)
            .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.")}

        val result = BannerDto(tbBanner)

        return result
    }

    /**
     * 배너 저장 (관리자)
     *
     * @param dto
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun saveBanner(dto: BannerRequestDTO) {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        var result: TbBanner? = null

        if(dto.id != null){
            // 수정 로직
            val tbBanner = tbBannerRepository.findById(dto.id!!)
                .orElseThrow { BizException("해당 팝업이 존재 하지 않습니다.") }

            result = tbBanner.apply {
                this.title = dto.title
                this.subTitle = dto.subTitle
                this.imagePath = dto.imagePath
                this.menu1Id = dto.menu1Id
                this.menu2Id = dto.menu2Id
                this.link = dto.link
                this.linkType = dto.linkType
                this.enabled = dto.enabled
                this.backgroundColor = dto.backGroundColor
                this.displayOrder = dto.displayOrder
                this.authLevel = dto.authLevel ?: 0
                this.displayStartDate = dto.displayStartDate
                this.displayEndDate = dto.displayEndDate
                this.modifiedAt = LocalDateTime.now()
                this.modifiedUserId = userInfo?.id
                this.modifiedUserNm = userInfo?.name
            }
        }else {
            //등록의 경우
            //insert 값 지정
            result = TbBanner().apply {
                this.title = dto.title
                this.subTitle = dto.subTitle
                this.imagePath = dto.imagePath
                this.menu1Id = dto.menu1Id
                this.menu2Id = dto.menu2Id
                this.link = dto.link
                this.linkType = dto.linkType
                this.enabled = dto.enabled
                this.backgroundColor = dto.backGroundColor
                this.displayOrder = dto.displayOrder
                this.authLevel = dto.authLevel ?: 0
                this.displayStartDate = dto.displayStartDate
                this.displayEndDate = dto.displayEndDate
                this.createdAt = LocalDateTime.now()
                this.createdUserId = userInfo?.id
                this.createdUserNm = userInfo?.name
            }
        }

        if(result != null) {
            tbBannerRepository.save(result)
        }
    }

    /**
     * 배너 삭제 (관리자)
     *
     * @param bannerId
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteBanner(bannerId: Int) {
        tbBannerRepository.deleteById(bannerId)
        // 배너 이미지 삭제? 고려해야한다.
    }

}