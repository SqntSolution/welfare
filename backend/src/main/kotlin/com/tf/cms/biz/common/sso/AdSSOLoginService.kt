package com.tf.cms.biz.common.sso

import com.tf.cms.common.jpa.repository.TbAuthAdminContentsmanagerMenuMappRepository
import com.tf.cms.common.jpa.repository.TbAuthGroupTeamMappRepository
import com.tf.cms.common.jpa.repository.TbAuthGroupUserMappRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UnknownUserException
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.HrUserCondition
import com.tf.cms.common.utils.logger
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbAuthUserRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

const val USERINFO_CACHE_KEY = "loginUserInfo"

@Service
class AdSSOLoginService(
        private val jpaQueryFactory: JPAQueryFactory,
        private val tbAuthGroupTeamMappRepository: TbAuthGroupTeamMappRepository,
        private val tbAuthGroupUserMappRepository: TbAuthGroupUserMappRepository,
        private val tbAuthAdminContentsmanagerMenuMappRepository: TbAuthAdminContentsmanagerMenuMappRepository,
        private val tbAuthUserRepository: TbAuthUserRepository
) {
    private val logger = logger()

    /**
     * AD 계정명(이메일 형식)으로 인터페이스 사용자 사번 조회
     *
     * @param upn
     * @return
     */
//    fun findByUpn(upn: String): String {
//        logger.debug { "=== [findByUpn] upn : $upn" }
//        val tbUserMaster = QTbUserMaster.tbUserMaster
//        val hrUserEmpId = jpaQueryFactory
//                .select(tbUserMaster.empId)
//                .from(tbUserMaster)
//                .where(tbUserMaster.upn.eq(upn))
//                .fetchFirst()
//        if(hrUserEmpId.isNullOrBlank()) {
//            throw UnknownUserException("유효하지 않은 사용자입니다.")
//        }
//        return hrUserEmpId
//    }

    /**
     * Find user info and auth
     *
     * @param pUserId (사번, empId)
     * @return UserInfo
     */
    @Cacheable(value = [USERINFO_CACHE_KEY], key = "#pUserId")
    fun findUserInfoAndAuth(pUserId: String): UserInfo {
        logger.info { "=== findUserInfoAndAuth, pUserId is $pUserId" }
        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val tbUser = QTbUser.tbUser

        val fetchUser = jpaQueryFactory
                .select(
                    tbUserMaster.userId,
                    tbUserMaster.userNm,
                    tbUserMaster.mailAddr,
                    tbUserMaster.mobileNo,
                    tbUserMaster.orgId,
                    tbUserMaster.orgNm,
                    tbHrCodeMaster.id.fullCode,
                    tbUser.avatarImgPath,
                    tbAuthAdminUserMapp.adminRole,
                    tbAuthAdminUserMapp.startAuthAt,
                    tbAuthAdminUserMapp.endAuthAt
                )
                .from(tbUserMaster)
                .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId)
                                .and(tbHrCodeMaster.id.groupCode.eq("ORG"))
                )
                .leftJoin(tbUser).on(tbUserMaster.userId.eq(tbUser.userId))
                .leftJoin(tbAuthAdminUserMapp).on(tbAuthAdminUserMapp.userId.eq(tbUserMaster.userId))
                .where(
                    tbUserMaster.userId.eq(pUserId)
//                                .and(HrUserCondition.defaultUserMasterCondition())
                )
                .fetchFirst()
                .let {
                    if(it == null) {
                        throw BizException("허용되지 않은 사용자입니다.")
                    }
                    val roleCode = it.get(tbAuthAdminUserMapp.adminRole)
                    val startAuthAt = it.get(tbAuthAdminUserMapp.startAuthAt)
                    val endAuthAt = it.get(tbAuthAdminUserMapp.endAuthAt)

                    UserInfo().apply {
                        this.id = it.get(tbUserMaster.userId)
                        this.email = it.get(tbUserMaster.mailAddr)
                        this.name = it.get(tbUserMaster.userNm)
                        this.phone = it.get(tbUserMaster.mobileNo)
                        this.teamCode = it.get(tbHrCodeMaster.id.fullCode) ?: "ORG_NULL"
                        this.teamName = it.get(tbUserMaster.orgNm)
                        this.avatarImgPath = it.get(tbUser.avatarImgPath)
                        this.role = if(roleCode != null) {
                            if(roleCode == TheRole.ROLE_CONTENTS_MANAGER.code) {
                                TheRole.validContentsManager(startAuthAt, endAuthAt)
                            } else {
                                TheRole.findCode(roleCode)
                            }
                        } else if(pUserId == "visitor"){
                            TheRole.ROLE_VISITOR
                        }else {
                            TheRole.ROLE_USER
                        }
                    }
                }
        logger.debug { "=== findUserInfoAndAuth, fetchUser : $fetchUser" }

        val authGroupList = mutableListOf<String>()
        // Team 권한 코드
        if(fetchUser.teamCode != "ORG_NULL") {
            authGroupList.addAll(
                    tbAuthGroupTeamMappRepository.findByTeamId(fetchUser.teamCode!!).map { it.authGroupCd!! }
            )
        }
        // 개인 권한 코드
        if(fetchUser.id != null) {
            authGroupList.addAll(
                    tbAuthGroupUserMappRepository.findByUserId(fetchUser.id!!).map { it.authGroupCd!! }
            )
        }
        // 콘텐츠매니저 접근 메뉴 목록
        val contentsManagerAuthMenuIdList = mutableListOf<Int>()
        if(TheRole.ROLE_CONTENTS_MANAGER == fetchUser.role) {
            contentsManagerAuthMenuIdList.addAll(
                    tbAuthAdminContentsmanagerMenuMappRepository.findByUserId(pUserId).map { it.menuId!! }
            )
        }
        // 권한레벨
        val authLevel = tbAuthUserRepository.findById(pUserId).orElseThrow { BizException("사용자 권한이 없습니다.") }.authLevel

        val resultInfo = fetchUser.apply {
            this.authGroup = authGroupList.distinct()
            this.contentsManagerAuthMenuIds = contentsManagerAuthMenuIdList
            this.authLevel = authLevel
        }
        logger.info { "=== findUserInfoAndAuth, resultInfo : $resultInfo" }

        return resultInfo
    }

}