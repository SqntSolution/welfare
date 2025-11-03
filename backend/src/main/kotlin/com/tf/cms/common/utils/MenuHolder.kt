package com.tf.cms.common.utils

import com.tf.cms.common.jpa.entity.QTbMenu
import com.tf.cms.common.jpa.entity.QTbPopup
import com.tf.cms.common.jpa.repository.TbPopupRepository
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.annotation.PostConstruct
import java.time.LocalDate
import kotlin.concurrent.Volatile
import okhttp3.internal.toImmutableList
import org.springframework.context.ApplicationEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionalEventListener


class MenuModifiedEvent() : ApplicationEvent("menu") {
}

/**
 *  contentType이 아래에 해당하는 경우에는 권한을 주지 않더라도 기본적으로 권한이 부여됨.
 */
//val DefaultAllowedMenuContentType = arrayOf("smartfinder", "cscenter", "my")
//val DefaultAllowedMenuContentType = arrayOf("smartfinder", "cscenter", "company", "product", "store", "investment")
val DefaultAllowedMenuContentType = arrayOf("smartfinder", "cscenter")
/**
 * menu중에서 고정된 메뉴의 contentType
 */
//val FixedMenuTypes = arrayOf("smartfinder", "cscenter", "notice", "faq", "qna", "my", "profile", "scrap", "alarm", "history", "mypost")
val FixedMenuTypes = arrayOf("smartfinder", "cscenter", "notice", "faq", "qna")
//val FixedMenuTypes = arrayOf("smartfinder", "cscenter", "notice", "faq", "qna", "company", "overview", "ci", "globalnetworks", "activity", "directions", "product", "catalog", "store",
//    "eagon-house", "goods", "brand-gallery", "investment", "information", "dealer")

/**
 * 고정된 메뉴들의 contentType들.
 * 이 contentType을 보고서 그 고정메뉴들의 path를 얻어올수 있음.
 */
//enum class SpecialMenuContentType {
//    smartfinder, cscenter, notice, faq, qna, my, profile, scrap, alarm, history, mypost,
//}
//enum class SpecialMenuContentType {
//    smartfinder, cscenter, notice, faq, qna, company, overview, ci, globalnetworks, activity, directions, product, catalog, store, eagonhouse, goods, brandgallery, investment, information, dealer
//}
enum class SpecialMenuContentType {
    smartfinder, cscenter, notice, faq, qna
}
/**
 * 팝업을 띄우기 위하여,
 * {메뉴경로} 와 {팝업id}
 */
data class MenuAndPopupid(
    val menuId: Int?,
    val menuPath: String?,
    val popupId: Int?,
)

/**
 *  menuId와 menu path 정보등은 매우 자주 사용되므로, 여기서 메모리에 담고 있음.
 *  메뉴 수정이 발생하면, notifyMenuMofified()를 호출해서, reload하게 만든다.
 *  5분 간격으로 무조건 reload 한다.
 */
@Component
class MenuIdHolder(
    private val jpaQueryFactory: JPAQueryFactory,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val tbPopupRepository: TbPopupRepository,
) {
    private val logger = logger()

    @Volatile
    private var holder = listOf<MenuIdAndPath>()

    @Volatile
    private var holderMap = mapOf<Int, MenuIdAndPath>()

    @Volatile
    private var popupHolder = mapOf<String, List<MenuAndPopupid?>?>()

    /**
     * 다시 읽어들이도록 요청 .
     * [주의] 메뉴가 수정되거나, 팝업이 수정되면 이 메소드를 호출해 줘야 함.
     */
    fun notifyMenuMofified() {
        applicationEventPublisher.publishEvent(MenuModifiedEvent())
    }

    @TransactionalEventListener()
    fun whenMenuModified(event: MenuModifiedEvent) {
        logger.info { "=== Menu가 수정됨.다시 읽어들일것임." }
        reload()
    }

    @PostConstruct
    fun onStarted() {
        reload()
    }

    fun getPopups(): Map<String, List<MenuAndPopupid?>?> {
        return popupHolder
    }

    /**
     * 메뉴의 contentType으로 경로 리턴
     * (예 : /main/my/alarm )
     */
    fun getPathFromContentType(type: String?): String? {
        try {
            val typeEnum = SpecialMenuContentType.valueOf(type ?: "")
            return getPathFromContentType(typeEnum)
        } catch (e: Exception) {
            return null
        }
    }

    /**
     * 메뉴의 contentType으로 경로 리턴
     * (예 : /main/my/alarm )
     */
    fun getPathFromContentType(type: SpecialMenuContentType): String? {
        holder.find { it.contentType == type.name }?.let {
            val thisMenu = it

            if (thisMenu.parentId == 0) {
                // 1차메뉴로 끝
                return "/main/${thisMenu.path}"
            } else {
                // 부모를 찾아야
                holder.find { it.id == thisMenu.parentId }?.let {
                    return "/main/${it.path}/${thisMenu.path}"
                }
            }
        }
        return null
    }

    fun getMenuFromPath(path1: String?): MenuIdAndPath? {
        return holder.find { it.parentId == 0 && it.path == path1 }
    }

    fun getMenuFromPath(path1: String?, path2: String?): MenuIdAndPath? {
        return if (path2 == null) {
            return getMenuFromPath(path1)
        } else {
            holder.find { it.parentPath == path1 && it.path == path2 }
        }
    }

    fun getMenuFromId(pMenuId: Int?): MenuIdAndPath? {
//        return holder.find { it.id == pMenuId }
        return holderMap[pMenuId]
    }

    fun getMenuNmFromId(pMenuId: Int?): String? {
        return getMenuFromId(pMenuId)?.menuNm
    }

    /**
     * menuId로 해당 메뉴를 나타내는 path를 menu1과 menu2의 리스트로 리턴
     * (예) 2 => ['market-analysis', 'local']
     */
    fun getMenuPathsFromId(menuId: Int?): List<String> {
        val menu = getMenuFromId((menuId))
        return if (menu == null) {
            return listOf()
        } else if (menu?.parentPath.isNullOrEmpty()) {
            // 부모가 없음.
            return listOf(menu?.path!!)
        } else {
            // 부모 있음.
            return listOf(menu?.parentPath!!, menu?.path!!)
        }
    }


    fun getAllMenus(): List<MenuIdAndPath> {
        return holder
    }


    /**
     * 권한을 부여하지 않더라도 기본으로 부여되는 메뉴들.
     * 1차 메뉴가 지장된 메뉴(smartfinder, cscenter, my)인 경우에는 권한이 없더라도 모두 보임.
     */
    fun getDefaultAllowedMenuIds(): List<Int> {
        val allowedMenu1s = holder.filter { it.parentId == 0 && DefaultAllowedMenuContentType.contains(it.contentType) }.map { it.id }.toMutableList()
        val allowedMenu2s = holder.filter { allowedMenu1s.contains(it.parentId) }.map { it.id }.toMutableList()
        return allowedMenu1s + allowedMenu2s
    }


    fun reload() {
        logger.info { "=== reload menu Holder" }
        val tbMenu = QTbMenu.tbMenu
        val today = LocalDate.now()

        // 팝업
        try {
            val tbPopup = QTbPopup.tbPopup
            val popupList: Map<String, List<MenuAndPopupid?>> = jpaQueryFactory.selectFrom(tbPopup)
                .where(tbPopup.enabled.eq(true))
                .where((tbPopup.displayStartDate.isNull.or(tbPopup.displayStartDate.loe(today))))
                .where((tbPopup.displayEndDate.isNull.or(tbPopup.displayEndDate.goe(today))))
                .fetch()
                .map {
                    // MenuAndPopupid로 변환
                    val popup = it
                    it.runCatching { it.displayMenuIds!!.trim().toInt() }
                        .map {
                            MenuAndPopupid(
                                menuId = it,
                                menuPath = if (popup.displayMenuIds == "0") {
                                    "_home_"
                                } else {
                                    getMenuFromId(it)?.path ?: ""
                                },
                                popupId = popup.id
                            ) }
                        .getOrNull()
                }
                .filter { it?.menuId != null }
                .groupBy { it!!.menuPath ?: "_home_" }

            this.popupHolder = popupList

        } catch (e: Exception) {
            logger.warn("popup 처리중 에러", e)
        }

        // 메뉴
        val menus = jpaQueryFactory
            .select(
                Projections.fields(
                    MenuIdAndPath::class.java,
                    tbMenu.id,
                    tbMenu.menuEngNm.`as`("path"),
                    tbMenu.menuNm,
                    tbMenu.parentMenuId.`as`("parentId"),
                    tbMenu.contentType,
                    tbMenu.menuSeq,
                    tbMenu.postId,
                    tbMenu.link,
                    tbMenu.linkType,
                    tbMenu.enabled,
                    tbMenu.staticYn,
                    tbMenu.postCategory
                )
            )
            .from(tbMenu)
            .orderBy(tbMenu.parentMenuId.asc(), tbMenu.menuSeq.asc(), tbMenu.id.asc())
            .fetch()
            .toImmutableList()

        menus.forEach {
            // parentPath랑 parentNm 셋팅.
            val parentId = it.parentId
            val me = it
            menus.find { it.id == parentId }?.let {
                me.parentPath = it.path
                me.parentNm = it.menuNm
            }
//            // 메뉴에 popupId를 연결
//            me.popupIds = popupList?.filter { it.displayMenuIds == me.id?.toString() }?.flatMap {
//                try {
//                    listOf(it.displayMenuIds!!.toInt())
//                }catch(ex:Exception){
//                    listOf()
//                }
//            } ?.toList()
        }

        logger.info { "=== menus : (${menus?.size}건) " }
        this.holder = menus

        val map = menus.map { it.id to it }.toMap()
        this.holderMap = map
    }

    @Scheduled(fixedDelay = 5 * 60 * 1000)
    fun schedule() {
        reload()
    }

}

@DefaultConstructor
data class MenuIdAndPath(
    val id: Int,
    /** 메뉴 경로에 쓰임. */
    val path: String,
    val menuNm: String,
    val parentId: Int,
    var parentPath: String? = null,
    var parentNm: String? = null,
    var contentType: String? = null,
    var menuSeq: Int? = null,
    var postId: Int? = null,
    var link: String? = null,
    var linkType: String? = null,
    var enabled: Boolean? = null,
    var popupIds: List<Int>? = null, // 이 메뉴로 들어갈때 보여줄 팝업id
    var staticYn: Boolean? = false, // 정적 페이지 여부
    var postCategory: String? = null // post 카테고리
) {
    constructor(id: Int, path: String, menuNm: String, parentId: Int, contentType: String?, menuSeq: Int?, postId: Int?) : this(
        id = id,
        path = path,
        menuNm = menuNm,
        parentId = parentId,
        parentPath = null,
        parentNm = null,
        contentType = contentType,
        menuSeq = menuSeq,
        postId = postId,
    )
}