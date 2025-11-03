package com.tf.cms.biz.admin.code

import com.tf.cms.common.jpa.entity.QTbCode
import com.tf.cms.common.jpa.entity.QTbCodeGroup
import com.tf.cms.common.jpa.entity.TbCode
import com.tf.cms.common.jpa.entity.TbCodeGroup
import com.tf.cms.common.jpa.entity.TbCodeId
import com.tf.cms.common.jpa.repository.TbCodeGroupRepository
import com.tf.cms.common.jpa.repository.TbCodeRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.CodeHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.stereotype.Service

@Service
class AdminCodeService(
        private val jPAQueryFactory: JPAQueryFactory,
        private val tbCodeGroupRepository: TbCodeGroupRepository,
        private val tbCodeRepository: TbCodeRepository,
        private val codeHolder: CodeHolder,
){
    private val logger = logger()

    /**
     * 코드그룹 목록 조회
     *
     * @return
     */
    fun findCodeGroupList(): List<CodeGroupDto> {
        val tbCodeGroup = QTbCodeGroup.tbCodeGroup
        val tbCode = QTbCode.tbCode

        val subQuery1 = JPAExpressions.select(tbCode.count().intValue()).from(tbCode).where(tbCode.codeGroupId.eq(tbCodeGroup.id))

        val resultData = jPAQueryFactory
                .select(
                        Projections.fields(
                                CodeGroupDto::class.java,
                                tbCodeGroup.id,
                                tbCodeGroup.groupCode,
                                tbCodeGroup.groupName,
                                tbCodeGroup.description,
                                tbCodeGroup.createdAt,
                                tbCodeGroup.createdUserId,
                                tbCodeGroup.createdUserNm,
                                tbCodeGroup.modifiedAt,
                                tbCodeGroup.modifiedUserId,
                                tbCodeGroup.modifiedUserNm,
                                ExpressionUtils.`as`(subQuery1, "codeCount"),
                        )
                )
                .from(tbCodeGroup)
                .fetch()
        logger.debug { "=== resultData : $resultData" }

        return resultData
    }

    /**
     * 코드그룹 단건 조회
     *
     * @param groupCode
     * @return
     */
    fun findCodeGroup(codeGroupId: Int): CodeGroupDetailDto {
        val tbCodeGroup = tbCodeGroupRepository.findById(codeGroupId)
                .orElseThrow { throw BizException("존재하지 않는 데이터입니다.") }

        val tbCode = QTbCode.tbCode

        val tbCodeList = jPAQueryFactory
                .select(
                        Projections.fields(
                                CodeDto::class.java,
                                tbCode.id,
                                tbCode.codeGroupId,
                                tbCode.groupCode.`as`("groupCode"),
                                tbCode.code.`as`("code"),
                                tbCode.label.`as`("label"),
                                tbCode.additionalInfo.`as`("additionalInfo"),
                                tbCode.additionalInfo2.`as`("additionalInfo2"),
                                tbCode.seq.`as`("seq"),
                                tbCode.createdAt.`as`("createdAt"),
                                tbCode.createdUserId.`as`("createdUserId"),
                                tbCode.createdUserNm.`as`("createdUserNm"),
                                tbCode.modifiedAt.`as`("modifiedAt"),
                                tbCode.modifiedUserId.`as`("modifiedUserId"),
                                tbCode.modifiedUserNm.`as`("modifiedUserNm"),
                        )
                )
                .from(tbCode)
                .where(tbCode.codeGroupId.eq(codeGroupId))
                .orderBy(tbCode.seq.asc())
                .fetch()

        return CodeGroupDetailDto().apply {
            this.id = tbCodeGroup.id
            this.groupCode = tbCodeGroup.groupCode
            this.groupName = tbCodeGroup.groupName
            this.description = tbCodeGroup.description
            this.createdAt = tbCodeGroup.createdAt
            this.createdUserId = tbCodeGroup.createdUserId
            this.createdUserNm = tbCodeGroup.createdUserNm
            this.modifiedAt = tbCodeGroup.modifiedAt
            this.modifiedUserId = tbCodeGroup.modifiedUserId
            this.modifiedUserNm = tbCodeGroup.modifiedUserNm
            this.codeList = tbCodeList
        }
    }

    /**
     * 코드그룹 생성
     *
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun createCodeGroup(dto: CodeGroupInputDto) {
        codeHolder.notifyCodeMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()

        dto.id?.let {
            tbCodeGroupRepository.findById(it).ifPresent {
                throw BizException("이미 존재하는 그룹 코드명")
            }
        }

        val tbCodeGroup = TbCodeGroup().apply {
            groupCode = dto.groupCode
            groupName = dto.groupName
            description = dto.description
            createdAt = LocalDateTime.now()
            createdUserId = userInfo?.id
            createdUserNm = userInfo?.name
        }
        val savedGroup = tbCodeGroupRepository.save(tbCodeGroup)

        if(!dto.codeList.isNullOrEmpty()){
            val tbCodeList = dto.codeList?.map{
                TbCode().apply {
                    codeGroupId = savedGroup.id
                    groupCode = dto.groupCode
                    code = it.code
                    label = it.label
                    seq = it.seq
                    createdAt = LocalDateTime.now()
                    createdUserId = userInfo?.id
                    createdUserNm = userInfo?.name
                }
            }
            tbCodeRepository.saveAll(tbCodeList!!)
        }
    }

    /**
     * 코드그룹 수정
     *
     * @param groupCodeInput
     * @param dto
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateCodeGroup(id: Int, dto: CodeGroupInputDto) {
        codeHolder.notifyCodeMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()

        tbCodeGroupRepository.findById(id).ifPresent{tbCodeGroup ->
            val codeGroup = tbCodeGroup.apply{
                groupName = dto.groupName
                description = dto.description
                modifiedAt = LocalDateTime.now()
                modifiedUserId = userInfo?.id
                modifiedUserNm = userInfo?.name
            }
            tbCodeGroupRepository.save(codeGroup)

            if(!dto.codeList.isNullOrEmpty()) {
                // 삭제
                tbCodeRepository.deleteByCodeGroupId(id)
                // 등록
                val tbCodeList = dto.codeList?.map{
                    TbCode().apply {
                        codeGroupId = id
                        groupCode = dto.groupCode
                        code = it.code
                        label = it.label
                        seq = it.seq
                        createdAt = LocalDateTime.now()
                        createdUserId = userInfo?.id
                        createdUserNm = userInfo?.name
                    }
                }
                tbCodeRepository.saveAll(tbCodeList!!)
            }
        }
    }

    /**
     * 코드그룹 삭제
     *
     * @param groupCode
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteCodeGroup(codeGroupId: Int) {
        codeHolder.notifyCodeMofified()
        tbCodeRepository.deleteByCodeGroupId(codeGroupId)
        tbCodeGroupRepository.deleteById(codeGroupId)
    }
}
