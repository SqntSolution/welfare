package com.tf.cms.biz.common

import com.tf.cms.biz.common.code.AntDesignSelectForm
import com.tf.cms.biz.common.code.CodeService
import com.tf.cms.biz.common.menu.MenuInfoDto
import com.tf.cms.biz.common.menu.MenuService
import com.tf.cms.biz.common.menu.PopupDto
import com.tf.cms.biz.common.ref.CommonRefService
import com.tf.cms.common.jpa.dto.TbCodeDto
import com.tf.cms.common.jpa.dto.TbRefDto
import com.tf.cms.common.model.TheRole
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@Tag(name = "[공통] 공통 API")
@RestController
@RequestMapping("/api/v1/common")
class CommonController(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val codeService: CodeService,
    private val commonRefService: CommonRefService,
    private val codeHolder: CodeHolder,
    private val menuService: MenuService
) {
    private val logger = logger()

    @Operation(summary = "1차 메뉴목록 조회")
    @GetMapping("/menu/main")
    fun getMenu1s(): ResponseEntity<List<Menu>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val menus = roleAndMenuComponent.getTotalMenu1ListForRenderingExcludingNoauthOfMenu1(userInfo?.authGroup?:listOf())
//        val menus = roleAndMenuComponent.getTotalMenuListForRenderingIncludingAuth(userInfo?.authGroup?:listOf())
        return ResponseEntity.ok(menus)
    }

    @Operation(summary = "1차 메뉴 한개 조회 (1차 메뉴에 딸린 children 메뉴들도 같이)")
    @GetMapping("/menu/main/{mainMenuName}")
    fun getMenu1(@PathVariable("mainMenuName") mainMenuName: String): ResponseEntity<Menu> {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val menu = roleAndMenuComponent.getMenu1ByMenuengname(mainMenuName, userInfo?.authGroup?:listOf())
        return ResponseEntity.ok(menu)
    }

    @Operation(summary = "2차 메뉴목록 조회")
    @GetMapping("/menu/sub/{mainMenuName}")
    fun getSubMenus(@PathVariable("mainMenuName") mainMenuName: String): ResponseEntity<List<Menu>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()
        val authGroup = userInfo?.authGroup
        val menu1 = roleAndMenuComponent.getMenu1ByMenuengname(mainMenuName, userInfo?.authGroup?:listOf())
        if(menu1!=null && authGroup!=null){
//            val menus = roleAndMenuComponent.getMenu2ListByMenu1AndAuthgroups(menu1.id!!, authGroup) ?: listOf()
            val menus = roleAndMenuComponent.getMenu2ListByMenu1AndAuthgroupsExcludingNoAuth(menu1.id!!, authGroup) ?: listOf()
            return ResponseEntity.ok(menus)

        }else{
            return ResponseEntity.ok(listOf())
        }
    }

    @Operation(summary = "권한이 있는 메뉴목록 조회")
    @GetMapping("/menu/auth")
    fun findAuthMenuInfoList(): ResponseEntity<List<MenuInfoDto>> {
        val menus = menuService.findAuthMenuInfoList()
        return ResponseEntity.ok(menus)
    }


    @Operation(summary = "공통코드 목록 조회")
    @GetMapping("/code")
    fun getCodeList(@RequestParam groupCode: String): ResponseEntity<List<TbCodeDto>> {
        val codeList = codeService.findCodeList(groupCode)
        return ResponseEntity.ok(codeList)
    }

    @Operation(summary = "화면에 selectbox 등을 만들기 위해서, value,label 속성으로 리턴.")
    @GetMapping("/code-render/{groupCode}")
    fun getCodeList2(@PathVariable("groupCode") groupCode: String): ResponseEntity<List<CodeValueAndLabel>> {
        return ResponseEntity.ok(codeHolder.getCodes(groupCode))
    }

    @Operation(summary = """화면에 selectbox 등을 만들기 위해서, value,label 속성으로 리턴. (comma로 구분해서 여러codeGroup에 대해서 요청)
        | (예) /api/v1/common/code-render-multi/META_NATION,META_TOPIC
    """)
    @GetMapping("/code-render-multi/{groupCode}")
    fun getCodeList3(@PathVariable("groupCode") groupCode: String): ResponseEntity<MutableMap<String, List<CodeValueAndLabel>>> {
        val result = mutableMapOf<String, List<CodeValueAndLabel>>()
        groupCode.split(",").map{it.trim()}.filter { it != "" }.forEach {
            result[it] = codeHolder.getCodes(it)
        }
        return ResponseEntity.ok(result)
    }

    @Operation(summary = "History 유형 조회")
    @GetMapping("/history/type")
    fun getUserHistoryActionType(): ResponseEntity<List<AntDesignSelectForm>> {
        val codeList = UserHistoryActionType.entries.map {
            AntDesignSelectForm().apply {
                this.label = it.label
                this.value = it.code
            }
        }
        return ResponseEntity.ok(codeList)
    }


    @Operation(summary = """팝업 정보 조회 """)
    @GetMapping("/popup/{menu1Path}")
    fun getPopup(@PathVariable("menu1Path") menu1Path: String, @RequestParam(name="excludePopupIds", required = false) excludePopupIdsStr: String?)
        : ResponseEntity<MutableList<PopupDto>> {
        val list = menuService.getPopupsExcludingUnnecessaryPopups(menu1Path, excludePopupIdsStr)
        return ResponseEntity.ok(list)
    }


    @Operation(summary = "참조코드 목록 조회")
    @GetMapping("/ref")
    fun getRefList(@RequestParam groupCode: String): ResponseEntity<List<TbRefDto>> {
        val refList = commonRefService.findRefList(groupCode)
        return ResponseEntity.ok(refList)
    }

    @Operation(summary = "화면에 selectbox 등을 만들기 위해서, value,label 속성으로 리턴(참조코드).")
    @GetMapping("/ref-render/{groupCode}")
    fun getRefList2(@PathVariable("groupCode") groupCode: String): ResponseEntity<List<RefCodeValueAndLabel>> {
        val refList = commonRefService.findRefList(groupCode)
        return ResponseEntity.ok(refList.map {
            RefCodeValueAndLabel(
                value = it.code ?: "",
                label = it.label ?: ""
            )
        })
    }

    @Operation(summary = """화면에 selectbox 등을 만들기 위해서, value,label 속성으로 리턴. (comma로 구분해서 여러codeGroup에 대해서 요청)
        | (예) /api/v1/common/ref-render-multi/META_NATION,META_TOPIC
    """)
    @GetMapping("/ref-render-multi/{groupCode}")
    fun getRefList3(@PathVariable("groupCode") groupCode: String): ResponseEntity<MutableMap<String, List<RefCodeValueAndLabel>>> {
        val result = mutableMapOf<String, List<RefCodeValueAndLabel>>()
        groupCode.split(",").map{it.trim()}.filter { it != "" }.forEach {
            val refList = commonRefService.findRefList(it)
            result[it] = refList.map {
                RefCodeValueAndLabel(
                    value = it.code ?: "",
                    label = it.label ?: ""
                )
            }
        }
        return ResponseEntity.ok(result)
    }
    @Operation(summary = "refGroup 코드 관련 SELECT_BOX 만들기 위한 데이터 ALL - groupType 별")
    @GetMapping("/ref-render-type/{groupType}")
    fun finAllRefGroupCodeList(@PathVariable("groupType") groupType: String): ResponseEntity<List<RefCodeValueAndLabel>> {
        val refGroupCodeList = commonRefService.finAllRefGroupCodeList(groupType)
        return ResponseEntity.ok(refGroupCodeList.map {
            RefCodeValueAndLabel(
                value = it.groupCode ?: "",
                label = it.groupName ?: ""
            )
        })
    }

    @Operation(summary = "모든 메뉴 리턴. (1차, 2차메뉴의 selectbox를 만들기 위해서 POST_EDIT)")
    @GetMapping(path=["/all-menus"])
    fun getAllMenus( ): ResponseEntity<List<Menu>> {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val role = userInfo.role
        val menusConfig = roleAndMenuComponent.getTotalMenu1ListForRenderingExcludingNoauthOfMenu1(userInfo?.authGroup?:listOf())
        // master나 operator는 모든 메뉴에 대해서 가능, contents master는 자기한테 주어진 메뉴만 가능
        val menus = when (role){
            TheRole.ROLE_MASTER  -> menusConfig.filter { it.contentType!="page" && it.staticYn == false && it.enabled == true }
            TheRole.ROLE_OPERATOR  -> menusConfig.filter { it.contentType!="page" && it.staticYn == false && it.enabled == true }
            TheRole.ROLE_CONTENTS_MANAGER -> menusConfig
                .filter { userInfo.contentsManagerAuthMenuIds?.contains(it?.id) ?: false }.filter { it.contentType!="page" && it.staticYn == false && it.enabled == true }
            else -> listOf()
        }
        return ResponseEntity.ok(menus)
    }

}

data class RefCodeValueAndLabel(
    val value: String,
    val label: String,
)