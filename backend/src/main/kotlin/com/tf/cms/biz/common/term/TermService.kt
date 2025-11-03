package com.tf.cms.biz.common.term

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.dto.TbTermsDto
import com.tf.cms.common.jpa.entity.QTbCode
import com.tf.cms.common.jpa.entity.QTbTerms
import com.tf.cms.common.jpa.entity.TbTerms
import com.tf.cms.common.jpa.repository.TbTermsRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.UserInfoHelper
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.common.term
 * fileName       : TermService
 * author         : 김정규
 * date           : 25. 5. 27. 오후 3:17
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 5. 27. 오후 3:17        김정규       최초 생성
 */

@Service
class TermService(
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbTermsRepository: TbTermsRepository,
) {


    /**
     * name:
     * description: 약관 조회
     * author: 정상철
     * created: 2025-07-07

     *
     * @return
     */
    fun getTerm(
        termsTypeCode: String
    ): List<TermDto> {
//        val all = tbTermsRepository.findAll()
//        val res: List<TbTermsDto> = TermMapper.INSTANCE.tbTermsEntityToDtos(all)

        val tbTerms = QTbTerms.tbTerms
        val tbCode = QTbCode.tbCode

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbTerms.active.eq(true))
        whereCondition.and(tbTerms.termsTypeCode.eq(termsTypeCode))

        val result = jpaQueryFactory.select(
            Projections.fields(
                TermDto::class.java,
                tbTerms.id,
                tbTerms.termsTypeCode,
                tbCode.label,
                tbTerms.version,
                tbTerms.lang,
                tbTerms.title,
                tbTerms.description,
                tbTerms.content,
                tbTerms.active,
                tbTerms.effectiveStartDate,
                tbTerms.effectiveEndDate,
                tbTerms.createdAt,
                tbTerms.createdUserId,
                tbTerms.createdUserNm,
                tbTerms.modifiedAt,
                tbTerms.modifiedUserId,
                tbTerms.modifiedUserNm,
            )
        ).from(tbTerms)
            .leftJoin(tbCode).on(tbTerms.termsTypeCode.eq(tbCode.code))
            .where(whereCondition)
            .fetch()

        return result
    }

    /**
     * 약관 생성
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertTerm(tbTermsDto: TbTermsDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val entity = TbTerms().apply {
            this.termsTypeCode = tbTermsDto.termsTypeCode
            this.version = tbTermsDto.version
            this.lang = tbTermsDto.lang
            this.title = tbTermsDto.title
            this.content = tbTermsDto.content
            this.active = tbTermsDto.active
            this.createdAt = LocalDateTime.now()
            this.createdUserId = userInfo.id
            this.createdUserNm = userInfo.name
        }
        tbTermsRepository.save(entity)
    }

    /**
     * 약관 수정
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateTerm(tbTermsDto: TbTermsDto) {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val entity = tbTermsRepository.findById(tbTermsDto.id!!).orElseThrow { throw BizException("존재하지 않습니다.") }
        entity.termsTypeCode = tbTermsDto.termsTypeCode
        entity.version = tbTermsDto.version
        entity.lang = tbTermsDto.lang
        entity.title = tbTermsDto.title
        entity.content = tbTermsDto.content
        entity.active = tbTermsDto.active
        entity.modifiedAt = LocalDateTime.now()
        entity.modifiedUserId = userInfo.id
        entity.modifiedUserNm = userInfo.name

        tbTermsRepository.save(entity)
    }

}