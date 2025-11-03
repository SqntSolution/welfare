package com.tf.cms.biz.common

import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.model.PostAccessDeniedException
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UserInfo
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.stereotype.Component

/**
 * role과 menu 관련
 */
@Component
class RoleAndMenuComponent(
    private val jpaQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
) {
    private val logger = logger()

    /**
     * menuId에 대한 메뉴정보를 map으로 리턴.
     * @return  [menuId : menu]
     */
    fun getAllSimpleMenuidAndNames(): Map<Int?, MenuIdAndName> {
        val tbMenu = QTbMenu.tbMenu

        val fetched = jpaQueryFactory.select(
            Projections.fields(
                MenuIdAndName::class.java,
                tbMenu.id.`as`("menuId"), tbMenu.parentMenuId, tbMenu.menuNm.`as`("name"),
                tbMenu.menuEngNm.`as`("engName")
            )
        ).from(tbMenu)
            .where(tbMenu.enabled.eq(true))
            .orderBy(tbMenu.menuSeq.asc())
            .fetch()!!

        val resultMap = fetched.map { it.menuId to it }.toMap()
        return resultMap
    }

    /**
     * 화면에 메뉴를 보여주기 위해서 전체 메뉴 목록을 가져옴.(사용중인 것을 권한에 상관없이)
     */
    fun getTotalMenuListForRendering(): MutableList<Menu> {
        val tbMenu = QTbMenu.tbMenu
        val dbList = jpaQueryFactory.select(
            Projections.fields(
                Menu::class.java,
                tbMenu.id, tbMenu.menuNm, tbMenu.parentMenuId, tbMenu.menuEngNm,
                tbMenu.menuSeq, tbMenu.contentType, tbMenu.postId, tbMenu.link,
                tbMenu.link, tbMenu.title, tbMenu.subTitle, tbMenu.enabled,
                tbMenu.imagePath, tbMenu.linkType, tbMenu.staticYn, tbMenu.postCategory,
                tbMenu.description
            )
        ).from(tbMenu)
            .where(tbMenu.enabled.eq(true))
            .orderBy(tbMenu.menuSeq.asc())
            .fetch()

        val result = mutableListOf<Menu>()
        val children = mutableMapOf<Int, MutableList<Menu>>()

        // 1차 메뉴 추출
        dbList.forEach {  // it => menu
            if (it.parentMenuId == 0) {
                result.add(it.apply { it.level = 1 })
            } else {
                it.level = 2 // 2차 메뉴
                val parentMenuId = it.parentMenuId
                if (children[parentMenuId] == null) {
                    children[parentMenuId!!] = mutableListOf()
                }
                children[parentMenuId]!!.add(it)
            }
        }

        // 2차 메뉴를 1차 메뉴에 추가
        result.forEach {  // it => menu
            if (children[it.id] != null) {
                it.menuChildren = children[it.id]
            }
        }

        return result
    }


    /**
     * 화면에 메뉴를 보여주기 위해서 권한 속성을 포함한 메뉴 목록을 조회.
     * (disabled인 것은 제외)
     */
    fun getTotalMenuListForRenderingIncludingAuth(authGroupCds: List<String>): MutableList<Menu> {
        val menus = getTotalMenuListForRendering()
        // menuId : canDownload
        val menuAuthMap = getMenuAuthMapByAuthgroups(authGroupCds)

        val flattedMenus = menus.flatMap {
            if (it.menuChildren != null) {
                listOf(it, *it.menuChildren!!.toTypedArray())
            } else {
                listOf(it)
            }
        }

        // 각 메뉴에 대해서 권한 속성 setting.
        flattedMenus.forEach {
            val menuId = it.id!!
            if (menuAuthMap.containsKey(menuId)) {
                it.hasAuth = true
                if (menuAuthMap[menuId] == true) {
                    it.canDownload = true
                }
            }
        }

        return menus
    }


    /**
     * 화면에 메뉴를 보여주기 위해서 권한 속성을 포함해서, 권한이 있는 메뉴만 리턴.
     */
    fun getTotalMenuListForRenderingExcludingNoauth(authGroupCds: List<String>): List<Menu> {
        val menus = getTotalMenuListForRenderingIncludingAuth(authGroupCds).filter { it.hasAuth }
        menus.forEach { m->
            if(m.menuChildren?.size?:0 > 0){
                m.menuChildren = m.menuChildren?.filter { m2->m2.hasAuth }
            }
        }

        return menus
    }


    /**
     * 권한그룹으로 접근 가능한 메뉴id들 추출
     */
    fun getAccessibleMenuidsByAuthgroups(authGroupCds: List<String>?): List<Int> {
        val tbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp

        // menuId 들
        return jpaQueryFactory.select(tbAuthGroupMenuMapp.menuId)
            .from(tbAuthGroupMenuMapp)
            .where(tbAuthGroupMenuMapp.authGroupCd.`in`(authGroupCds?:listOf("뭬하나초하자타마")))
            .fetch()!!
            .apply {
                // 기본으로 보여지는 메뉴 추가
                addAll(menuIdHolder.getDefaultAllowedMenuIds())
            } // .distinct() distinct는 굳이 필요없을것 같아서.

    }

    /**
     * 화면에 메뉴를 보여주기 위해서 권한 속성을 포함해서, 1차 메뉴들을 리턴
     */
    fun getTotalMenu1ListForRenderingExcludingNoauthOfMenu1(authGroupCds: List<String>): List<Menu> {
        val menus = getTotalMenuListForRenderingExcludingNoauth(authGroupCds)
        return menus.filter { it.hasAuth }
    }

    /**
     * 권한그룹에 매핑된 menu들을 조회.
     * @return  [menuId : canfiledownload]
     */
    fun getMenuAuthMapByAuthgroups(authGroupCds: List<String>): MutableMap<Int, Boolean> {
        val tbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp

        // menuId 들
        val menuAuths = jpaQueryFactory.select(
            Projections.fields(
                MenuAuth::class.java,
                tbAuthGroupMenuMapp.authGroupCd, tbAuthGroupMenuMapp.menuId, tbAuthGroupMenuMapp.canFiledownload
            )
        ).from(tbAuthGroupMenuMapp)
            .where(tbAuthGroupMenuMapp.authGroupCd.`in`(authGroupCds))
            .fetch()

        val resultMap = mutableMapOf<Int, Boolean>() // menuId : canDownload
        menuAuths.forEach { // it => MenuAuth
            val menuId = it.menuId!!
            if (resultMap.containsKey(menuId)) {
                val canDownload = resultMap.get(menuId)
                if (canDownload != true && it.canFiledownload == true) {
                    resultMap[menuId] = true
                }
            } else {
                resultMap[menuId] = it.canFiledownload
            }
        }

        resultMap.putAll(menuIdHolder.getDefaultAllowedMenuIds().associate { it to true })

        return resultMap
    }


    /**
     * 주어진 권한그룹으로 메뉴2를 access할수 있는지 여부
     * @return (access권한, download권한)
     */
    fun canAccessToMenuByAuthgroups(authGroupCds: List<String>, menuId: Int): Pair<Boolean, Boolean> {
        val authMaps = getMenuAuthMapByAuthgroups(authGroupCds)
        return if (authMaps.containsKey(menuId)) {
            Pair(true, authMaps[menuId] == true)
        } else {
            Pair(false, false)
        }
    }

    /**
     * 주어진 권한그룹으로 postId에 access할 수 있는지 여부
     * @return (access권한, download권한)
     */
    fun canAccessToPostByAuthgroups(authGroupCds: List<String>, postId: Int): Pair<Boolean, Boolean> {
        return canAccessToPostByAuthgroups(authGroupCds, postId, UserInfoHelper.getLoginUserInfo()!!)
    }

    /**
     * 주어진 권한그룹으로 postId에 access할 수 있는지 여부
     * @return (access권한, download권한)
     */
    fun canAccessToPostByAuthgroups(authGroupCds: List<String>, postId: Int, userInfo:UserInfo): Pair<Boolean, Boolean> {
//        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val role = userInfo.role
        if (role == TheRole.ROLE_OPERATOR || role == TheRole.ROLE_MASTER) {
            // master나 운영자인 경우에는 무조건 ok
            return Pair(true, true)
        }


        // postId로 menuId를 구해오자.
        val tbPostContent = QTbPostContent.tbPostContent
        val (menu2Id, authLevel) = jpaQueryFactory.select(
            Projections.constructor(
                Menu2idAndAuthLevel::class.java,
                tbPostContent.menu2Id, tbPostContent.authLevel
            )
        )
            .from(tbPostContent)
            .where(tbPostContent.id.eq(postId))
            .fetchFirst() ?: return Pair(false, false)  // throw BizException("해당 게시물이 존재하지 않음.")

        // 개인 권한
        if(authLevel >= 0){
            if(userInfo.authLevel!! < authLevel){
                return Pair(false, false)
            }
        }

        return canAccessToMenuByAuthgroups(authGroupCds, menu2Id)
    }

    data class Menu2idAndAuthLevel (
        val menu2Id:Int,
        val authLevel: Int,
    )

    /**
     * 주어진 권한그룹으로 postId에 access할 수 없으면 Exception을 throw
     */
    fun canAccessToPostByAuthgroupsThrowException(authGroupCds: List<String>, postId: Int) {
        val pair = canAccessToPostByAuthgroups(authGroupCds, postId)
        if(!pair.first){
            throw PostAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        }
    }


    /**
     * 사용자에 대해서, admin authGroup목록을 조회
     * @return  authGroup의 리스트
     */
    fun getAdminAuthgroupsOfUser(userId: String?): MutableList<String> {
        val tbAuthAdminUserMapp = QTbAuthAdminUserMapp.tbAuthAdminUserMapp
        val adminRoles = jpaQueryFactory.select(tbAuthAdminUserMapp.adminRole)
            .from(tbAuthAdminUserMapp)
            .where(tbAuthAdminUserMapp.userId.eq(userId))
            .fetch()

        return adminRoles!!
    }


//    /**
//     * 사용자에 대해서, user authGroup 목록을 조회
//     * @return authGroup들
//     */
//    @Deprecated("안씀.")
//    fun getUserAuthgroupsOfUser(userId: String): Set<String> {
//        // 사용자에 대한 팀코드 조회
//        val tbUserMaster = QTbUserMaster.tbUserMaster
//        val teamCd = jpaQueryFactory.select(tbUserMaster.orgId)
//            .from(tbUserMaster)
//            .where(tbUserMaster.empId.eq(userId))
//            .fetchFirst() ?: throw BizException("사용자의 팀정보를 얻어오지 못했습니다.")
//
//        // 팀에 할당된
//        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
//        val authGroupsByTeam = jpaQueryFactory.select(tbAuthGroupTeamMapp.authGroupCd)
//            .from(tbAuthGroupTeamMapp)
//            .where(tbAuthGroupTeamMapp.teamId.eq(teamCd))
//            .fetch()!!
//
//        // 개인에 할당된
//        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp
//        val authGroupsByUser = jpaQueryFactory.select(tbAuthGroupUserMapp.authGroupCd)
//            .from(tbAuthGroupUserMapp)
//            .where(tbAuthGroupUserMapp.userId.eq(userId))
//            .fetch()!!
//
//        // 팀 + 개인
//        val result = authGroupsByTeam.apply { this.addAll(authGroupsByUser) }.toSet()
//        return result
//    }

    /**
     * 1차메뉴에 속한 2차메뉴 목록을 리턴.
     */
    fun getMenu2ListByMenu1AndAuthgroups(menu1Id:Int, authGroupCds: List<String>): List<Menu>? {
        return getTotalMenuListForRenderingIncludingAuth(authGroupCds).find { it.id==menu1Id }?.menuChildren
    }

    /**
     * 1차메뉴에 속한 2차메뉴 목록을 리턴.
     */
    fun getMenu2ListByMenu1AndAuthgroupsExcludingNoAuth(menu1Id:Int, authGroupCds: List<String>): List<Menu>? {
        return getTotalMenuListForRenderingExcludingNoauth(authGroupCds).find { it.id==menu1Id }?.menuChildren
    }

    /**
     * 1차메뉴에 속한 2차메뉴 목록을 리턴.
     * (2차메뉴가 0 or null일때는 1차메뉴에 속한 2차메뉴 전체를 리턴.)
     */
    fun getMenu2idsBelongingToMenu1id(menu1Id: Int, menu2Id: Int?, authGroupCds: List<String>,): List<Int>? {
        return if(menu2Id?:0==0){
            // 2차 메뉴가 전체일때는, 하위메뉴 몽땅
            getMenu2ListByMenu1AndAuthgroups(menu1Id, authGroupCds)?.map { it.id!! }
        }else{
            // 2차메뉴 한개
            listOf(menu2Id!!)
        }
    }

    /**
     * 1차메뉴에 속한 2차메뉴 목록을 리턴.
     * (2차메뉴가 0 or null일때는 1차메뉴에 속한 2차메뉴 전체를 리턴.)
     */
    fun getMenu2idsBelongingToMenu1idExcludingNoAuth(menu1Id: Int, menu2Id: Int?, authGroupCds: List<String>,): List<Int>? {
        return if(menu2Id?:0==0){
            // 2차 메뉴가 전체일때는, 하위메뉴 몽땅
            getMenu2ListByMenu1AndAuthgroupsExcludingNoAuth(menu1Id, authGroupCds)?.map { it.id!! }
        }else{
            // 2차메뉴 한개
            return getMenu2ListByMenu1AndAuthgroupsExcludingNoAuth(menu1Id, authGroupCds)?.filter { it.id==menu2Id }?.filter { it.hasAuth }?.map { it.id!! }
        }
    }

    /**
     * 1차 메뉴에 대해서, 메뉴경로로 메뉴를 리턴.
     */
    fun getMenu1ByMenuengname(menu1Path:String, authGroupCds: List<String>): Menu? {
        return getTotalMenuListForRenderingExcludingNoauth(authGroupCds).find { it.menuEngNm==menu1Path }
//        return getTotalMenuListForRenderingIncludingAuth(authGroupCds).find { it.menuEngNm==menu1Path }
    }

    /**
     * 메뉴경로로 메뉴를 리턴.
     */
    fun getMenuidByMenuengname(menu1Path:String, menu2Path:String?): Menu? {
        return if(menu2Path!=null){
            getTotalMenuListForRendering().find { it.menuEngNm==menu1Path }?.menuChildren?.find { it.menuEngNm==menu2Path }

        }else{
            getTotalMenuListForRendering().find { it.menuEngNm==menu1Path }
        }

    }

    /**
     * 사용자의 메뉴 권한 조회
     *
     * @param userInfo
     * @return
     */
    fun getMenuAuthByUser(
            authGroups: List<String>?,
            userRole: TheRole?,
            contentsManagerMenus: List<Int>?
    ): List<MenuAuthByUser> {
        logger.debug { "=== params : $authGroups, $userRole, $contentsManagerMenus" }

        return if(!authGroups.isNullOrEmpty()) {
            val tbAuthGroupMenuMapp = QTbAuthGroupMenuMapp.tbAuthGroupMenuMapp
            val authGroupMenuMapList = jpaQueryFactory
                    .select(
                            Projections.fields(
                                    MenuAuthByUser::class.java,
                                    tbAuthGroupMenuMapp.menuId,
                                    tbAuthGroupMenuMapp.canFiledownload.`when`(true).then(1).otherwise(0).max().`as`("cfdFlag")
                            )
                    )
                    .from(tbAuthGroupMenuMapp)
                    .where(tbAuthGroupMenuMapp.authGroupCd.`in`(authGroups))
                    .groupBy(tbAuthGroupMenuMapp.menuId)
                    .fetch()
                    .map {
                        it.apply {
                            this.downloadAuth = it.cfdFlag == 1
                            this.parentMenuId = menuIdHolder.getMenuFromId(it.menuId)?.parentId
                            this.parentMenuNm = menuIdHolder.getMenuFromId(it.menuId)?.parentNm
                            this.menuNm = menuIdHolder.getMenuFromId(it.menuId)?.menuNm
                        }
                    }
            if(userRole == TheRole.ROLE_CONTENTS_MANAGER) {
                authGroupMenuMapList.forEach {
                    it.apply {
                        this.writeAuth = contentsManagerMenus!!.contains(this.menuId)
                    }
                }
            } else if(userRole == TheRole.ROLE_MASTER || userRole == TheRole.ROLE_OPERATOR) {
                authGroupMenuMapList.forEach {
                    it.apply { this.writeAuth = true }
                }
            }
            authGroupMenuMapList.filter { (it.parentMenuId ?: 0) != 0 }.sortedWith(compareBy({ it.parentMenuId }, { it.menuId }))
        } else {
            emptyList()
        }
    }

}

data class MenuIdAndName(
    var menuId:Int? = null,
    var parentMenuId:Int? = null,
    var name:String? = null,
    var engName:String? = null,
)

data class Menu(
    var id: Int? = null,
    var menuNm: String? = null,
    var parentMenuId: Int? = null,
    var menuEngNm: String? = null,
    var menuSeq: Int? = null,
    var enabled: Boolean? = false,
    var contentType: String? = null,
    var postCategory: String? = null,
    var postId: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var title: String? = null,
    var subTitle: String? = null,
    var description: String? = null,
    var level: Int? = null,
    var hasAuth: Boolean = false,  // 이 메뉴에 대해서 권한이 있는지
    var canDownload: Boolean = false, // 이 메뉴에 대해서 다운로드 권한이 있는지
    var imagePath: String? = null,
    var menuChildren: List<Menu>? = null,
    var staticYn: Boolean? = false,
)

data class MenuAuth(
    var authGroupCd: String? = null,
    var menuId: Int? = null,
    var canFiledownload: Boolean = false,
)

data class MenuAuthByUser(
        var parentMenuId: Int? = null,
        var parentMenuNm: String? = null,
        var menuId: Int? = null,
        var menuNm: String? = null,
        var cfdFlag: Int? = null,
        var downloadAuth: Boolean? = false,
        var writeAuth: Boolean? = false
)