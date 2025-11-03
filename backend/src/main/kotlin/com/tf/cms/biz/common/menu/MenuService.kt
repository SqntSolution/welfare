package com.tf.cms.biz.common.menu

import com.querydsl.core.BooleanBuilder
import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.common.jpa.entity.QTbPopup
import com.tf.cms.common.jpa.repository.TbAuthGroupMenuMappRepository
import com.tf.cms.common.jpa.repository.TbMenuRepository
import com.tf.cms.common.model.CategoryAccessDeniedException
import com.tf.cms.common.utils.FixedMenuTypes
import com.tf.cms.common.utils.MenuAndPopupid
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.stereotype.Service

@Service
class MenuService(
    private val tbMenuRepository: TbMenuRepository,
    private val menuIdHolder: MenuIdHolder,
    private val tbAuthGroupMenuMappRepository: TbAuthGroupMenuMappRepository,
    private val jpaQueryFactory: JPAQueryFactory,
    private val roleAndMenuComponent: RoleAndMenuComponent,
) {
    private val logger = logger()

    /**
     * 권한이 있는 메뉴 목록 조회
     *
     * @return
     */
    fun findAuthMenuInfoList(): List<MenuInfoDto> {
        val authMenuIdList = mutableListOf<Int>()
        UserInfoHelper.getLoginUserInfo()?.authGroup
            ?.forEach { authGroupCd ->
                val userAuthMenuInfoIds = tbAuthGroupMenuMappRepository.findByAuthGroupCd(authGroupCd).map { it.menuId!! }
                authMenuIdList.addAll(userAuthMenuInfoIds)
            }
        val loginUserAuthMenuIdList = authMenuIdList.distinct()

        val allMenus = menuIdHolder.getAllMenus()
            .filter { !FixedMenuTypes.contains(it.contentType) && loginUserAuthMenuIdList.contains(it.id) }
            .map { MenuInfoDto(it) }
            .sortedBy { it.menuSeq }
        val menuMap = allMenus.groupBy { it.parentId }

        val result = allMenus
            .filter { it.parentId == 0 }
            .map {
                it.childrenMenu = menuMap[it.id]
                it
            }

        return result
    }

    @Transactional
    fun tmpSaveMenu() {
        tbMenuRepository.findById(2).ifPresent {
            menuIdHolder.notifyMenuMofified()
            it.modifiedAt = LocalDateTime.now()
            tbMenuRepository.save(it)
        }
    }

    fun tmpGetMenu(): LocalDateTime? {
        return tbMenuRepository.findById((2))?.get()?.modifiedAt
    }

    fun getPopupsExcludingUnnecessaryPopups(menu1Path: String, excludePopupIdsStr: String?): MutableList<PopupDto>? {
//        if (excludePopupIdsStr.isNullOrBlank()) {
//            return mutableListOf()
//        }

        val userInfo = UserInfoHelper.getLoginUserInfo()

        val menuId = menuIdHolder.getMenuFromPath(menu1Path)?.id
        // Home이 아니면 권한 체크
        //jsc 권한 체크 주석
//        if (menu1Path != "_home_") {
//            roleAndMenuComponent.canAccessToMenuByAuthgroups(userInfo?.authGroup ?: listOf(), menuId ?: -9).apply {
//                if (!this.first) {
//                    throw CategoryAccessDeniedException("팝업 조회에 대한 권한이 없습니다.")
//                }
//            }
//        }

        val popupsMap: Map<String, List<MenuAndPopupid?>?> = menuIdHolder.getPopups()
        val popupIds = popupsMap[menu1Path]?.map { it?.popupId }?.filter { it != null }
        val excludingPopupIds = (excludePopupIdsStr
            ?.split(",")
            ?.filter { it?.length ?: 0 > 0 }
            ?.map { it.runCatching { it.toInt() }.getOrElse { -999 } }
            ?: listOf())
            ?.toMutableList()
            .apply {
                if (this!!.isEmpty()) {
                    this.add(-999)
                }
            }
            // 비었을때는 -999 를 추가
            .apply { this?.add(-999) }!!

        val filteredIds = popupIds?.filter { !excludingPopupIds.contains(it) }


        // 조회해올 id가 있을때만 처리
        return if (filteredIds?.size ?: 0 > 0) {
            val tbPopup = QTbPopup.tbPopup
            val whereCondition = BooleanBuilder()
            if (excludingPopupIds.isNotEmpty()) {
                whereCondition.and(tbPopup.id.notIn(excludingPopupIds))
            }
            val result = jpaQueryFactory.select(
                Projections.fields(
                    PopupDto::class.java,
                    tbPopup.id, tbPopup.title, tbPopup.contents,
                )
            ).from(tbPopup)
                .where(tbPopup.id.`in`(popupIds))
//                .where(tbPopup.id.notIn(excludingPopupIds))
                .where(whereCondition)
                .fetch()
            result

        } else {
            mutableListOf()
        }

    }


}