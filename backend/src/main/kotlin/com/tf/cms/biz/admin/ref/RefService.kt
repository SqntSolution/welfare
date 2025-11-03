package com.tf.cms.biz.admin.ref

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.QTbRef
import com.tf.cms.common.jpa.entity.QTbRefGroup
import com.tf.cms.common.jpa.entity.TbRef
import com.tf.cms.common.jpa.entity.TbRefGroup
import com.tf.cms.common.jpa.repository.TbRefGroupRepository
import com.tf.cms.common.jpa.repository.TbRefRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime

/**
 * packageName    : com.tf.cms.biz.admin.ref
 * fileName       : RefService
 * author         : 정상철
 * date           : 25. 4. 28. 오후 1:47
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 25. 4. 28. 오후 1:47        정상철       최초 생성
 */
@Service
class RefService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val tbRefGroupRepository: TbRefGroupRepository,
    private val tbRefRepository: TbRefRepository,
) {
    private val logger = logger()

    /**
     * name: findRefGroupList
     * description: 참조그룹 목록 조회
     * author: 정상철
     * created: 2025-04-28 13:51
     *
     * @return
     */
    fun findRefGroupList(): List<RefGroupDto> {
        val tbRef = QTbRef.tbRef
        val tbRefGroup = QTbRefGroup.tbRefGroup

        val subQuery1 =
            JPAExpressions.select(tbRef.count().intValue()).from(tbRef).where(tbRef.refGroupId.eq(tbRefGroup.id))

        val whereCondition = BooleanBuilder();
        val result = jPAQueryFactory
            .select(
                Projections.fields(
                    RefGroupDto::class.java,
                    tbRefGroup.id,
                    tbRefGroup.groupCode,
                    tbRefGroup.groupName,
                    tbRefGroup.groupType,
                    tbRefGroup.description,
                    tbRefGroup.createdAt,
                    tbRefGroup.createdUserId,
                    tbRefGroup.createdUserNm,
                    tbRefGroup.modifiedAt,
                    tbRefGroup.modifiedUserId,
                    tbRefGroup.modifiedUserNm,
                    ExpressionUtils.`as`(subQuery1, "refCount"),
                )
            )
            .from(tbRefGroup)
            .where(whereCondition)
            .fetch()

        return result;
    }

    /**
     * name: 참조그룹 단건 조회
     * description: 참조그룹 단건 조회
     * author: 정상철
     * created:

     *
     * @return
     */

    fun findRefGroup(refGroupId: Int): RefGroupDetailDto {
        val tbRefGroup = tbRefGroupRepository.findById(refGroupId)
            .orElseThrow { throw BizException("존재하지 않는 데이터입니다.") }

        val tbRef = QTbRef.tbRef

        val tbRefList = jPAQueryFactory
            .select(
                Projections.fields(
                    RefDto::class.java,
                    tbRef.id,
                    tbRef.refGroupId,
                    tbRef.groupCode.`as`("groupCode"),
                    tbRef.code.`as`("code"),
                    tbRef.label.`as`("label"),
                    tbRef.additionalInfo.`as`("additionalInfo"),
                    tbRef.additionalInfo2.`as`("additionalInfo2"),
                    tbRef.seq.`as`("seq"),
                    tbRef.createdAt.`as`("createdAt"),
                    tbRef.createdUserId.`as`("createdUserId"),
                    tbRef.createdUserNm.`as`("createdUserNm"),
                    tbRef.modifiedAt.`as`("modifiedAt"),
                    tbRef.modifiedUserId.`as`("modifiedUserId"),
                    tbRef.modifiedUserNm.`as`("modifiedUserNm"),
                )
            )
            .from(tbRef)
            .where(tbRef.refGroupId.eq(refGroupId))
            .orderBy(tbRef.seq.asc())
            .fetch()

        return RefGroupDetailDto().apply {
            this.id = tbRefGroup.id
            this.groupCode = tbRefGroup.groupCode
            this.groupName = tbRefGroup.groupName
            this.groupType = tbRefGroup.groupType
            this.description = tbRefGroup.description
            this.createdAt = tbRefGroup.createdAt
            this.createdUserId = tbRefGroup.createdUserId
            this.createdUserNm = tbRefGroup.createdUserNm
            this.modifiedAt = tbRefGroup.modifiedAt
            this.modifiedUserId = tbRefGroup.modifiedUserId
            this.modifiedUserNm = tbRefGroup.modifiedUserNm
            this.refList = tbRefList
        }
    }

    /**
     * name: createRefGroup
     * description: 코드그룹 생성
     * author: 정상철
     * created:

     *
     * @return
     */

    @Transactional(rollbackOn = [Throwable::class])
    fun createRefGroup(dto: RefGroupInputDto) {
//        refHolder.notifyCodeMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()

        dto.id?.let {
            tbRefGroupRepository.findById(it).ifPresent {
                throw BizException("이미 존재하는 그룹 참조명")
            }
        }

        val tbRefGroup = TbRefGroup().apply {
            groupCode = dto.groupCode
            groupName = dto.groupName
            groupType = dto.groupType
            description = dto.description
            createdAt = LocalDateTime.now()
            createdUserId = userInfo?.id
            createdUserNm = userInfo?.name
        }
        val refGroupEntity = tbRefGroupRepository.save(tbRefGroup)

        if (!dto.refList.isNullOrEmpty()) {
            val tbRefList = dto.refList?.map {
                TbRef().apply {
                    refGroupId = refGroupEntity.id
                    groupCode = dto.groupCode
                    code = it.code
                    label = it.label
                    seq = it.seq
                    createdAt = LocalDateTime.now()
                    createdUserId = userInfo?.id
                    createdUserNm = userInfo?.name
                }
            }
            tbRefRepository.saveAll(tbRefList!!)
        }

    }

    /**
     * name: updateRefGroup
     * description: 코드그룹 수정
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun updateRefGroup(id: Int, dto: RefGroupInputDto) {
//        codeHolder.notifyCodeMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()

        tbRefGroupRepository.findById(id).ifPresent { tbRefGroup ->
            val refGroup = tbRefGroup.apply {
                groupName = dto.groupName
                groupType = dto.groupType
                description = dto.description
                modifiedAt = LocalDateTime.now()
                modifiedUserId = userInfo?.id
                modifiedUserNm = userInfo?.name
            }
            tbRefGroupRepository.save(refGroup)

            if (!dto.refList.isNullOrEmpty()) {
                // 삭제
                tbRefRepository.deleteByRefGroupId(id)
                // 등록
                val tbRefList = dto.refList?.map {
                    TbRef().apply {
                        refGroupId = id
                        groupCode = dto.groupCode
                        code = it.code
                        label = it.label
                        seq = it.seq
                        createdAt = LocalDateTime.now()
                        createdUserId = userInfo?.id
                        createdUserNm = userInfo?.name
                    }
                }
                tbRefRepository.saveAll(tbRefList!!)
            }
        }
    }

    /**
     * name: deleteRefGroup
     * description: 코드 삭제
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteRefGroup(refGroupId: Int) {
//        codeHolder.notifyCodeMofified()
        tbRefRepository.deleteByRefGroupId(refGroupId)
        tbRefGroupRepository.deleteById(refGroupId)
    }

    /**
     * 그룹코드로 조회
     */
    fun findByGroupCode(groupCode: String, code: String): RefDto {
        val entity = tbRefRepository.findByGroupCodeAndCode(groupCode, code).orElseThrow { BizException("존재하지 않습니다.") }
        return RefMapper.INSTANCE.tbRefEntityToDto(entity)
    }
}
