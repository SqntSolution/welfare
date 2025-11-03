package com.tf.cms.biz.admin.board

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.admin.content.CategoryMenuSelectbox
import com.tf.cms.biz.admin.content.ContentCategoryDto
import com.tf.cms.biz.admin.content.ContentMenuDto
import com.tf.cms.biz.admin.content.ContentPostDto
import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.user.board.BoardDto
import com.tf.cms.biz.user.board.BoardHelper
import com.tf.cms.biz.user.board.BoardItemInfo
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbBoardItemInfoRepository
import com.tf.cms.common.jpa.repository.TbBoardItemRepository
import com.tf.cms.common.jpa.repository.TbBoardRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.DefaultAllowedMenuContentType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

/**
 * packageName    : com.tf.cms.biz.admin.board
 * fileName       : AdminBoardService
 * author         : 정상철
 * date           : 2025-06-26
 * description    : Admin Board 관리 Service
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-26        정상철       최초 생성
 */
@Service
class AdminBoardService (
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val tbBoardItemRepository: TbBoardItemRepository,
    private val tbBoardRepository: TbBoardRepository,
    private val tbBoardItemInfoRepository: TbBoardItemInfoRepository,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
) {
    private val logger = logger()

    companion object {
        private val openTypeCodes = listOf("private", "public", "temp")
    }

    /**
     * name:
     * description: 카테고리 및 메뉴 조회 (Post를 담고 있는 메뉴들만)
     * author: 정상철
     * created: 2025-06-27

     *
     * @return
     */
    fun findBoardContentList(): List<BoardContentDto> {
        val menuList = menuIdHolder.getAllMenus().filter {
            // Post성 메뉴들만
            !listOf("smartfinder", "cscenter", "my", "page").contains(it.contentType)
                    && it.staticYn == false
        }

        val qTbBoard = QTbBoard.tbBoard
        val qTbMenu = QTbMenu.tbMenu
        val qTbPostRecommend = QTbPostRecommend.tbPostRecommend

        val boardCountMap = jPAQueryFactory
            .select(
                qTbBoard.menu2Id,
                qTbBoard.menu2Id.count()
            )
            .from(qTbBoard)
            .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbBoard.menu2Id))
            .where(qTbMenu.staticYn.eq(false))
            .groupBy(qTbBoard.menu2Id)
            .fetch()
            .associate {
                it.get(qTbBoard.menu2Id) to it.get(qTbBoard.menu2Id.count())
            }
        val recommendPostCountMap = jPAQueryFactory
            .select(
                qTbBoard.menu2Id,
                qTbBoard.menu2Id.count()
            )
            .from(qTbBoard)
            .leftJoin(qTbMenu).on(qTbMenu.id.eq(qTbBoard.menu2Id))
//            .join(qTbPostRecommend).on(qTbPostContents.id.eq(qTbPostRecommend.id))
            .where(qTbMenu.staticYn.eq(false))
            .groupBy(qTbBoard.menu2Id)
            .fetch()
            .associate {
                it.get(qTbBoard.menu2Id) to it.get(qTbBoard.menu2Id.count())
            }

        val childMenuList = menuList.filter { it.parentId != 0 }.map {
            BoardContentMenuDto(it).apply {
                this.boardCount = boardCountMap[it.id]?.toInt() ?: 0
                this.recommendCount = recommendPostCountMap[it.id]?.toInt() ?: 0
            }
        }

        val result = menuList.filter { it.parentId == 0 }.map { parentMenu ->
            BoardContentDto(parentMenu).apply {
                this.menuChildren = childMenuList.filter { it.parentId == this.id }
            }
        }

        return result
    }


    /**
     * name: getCategorySelectbox
     * description: 카테고리(메뉴)의 selectbox 조회
     * author: 정상철
     * created: 2025-06-27

     *
     * @return
     */
    fun getCategorySelectbox(): List<BoardCategoryMenuSelectbox> {
        val allMenus = menuIdHolder.getAllMenus()
        // 1차 메뉴중에서 cs-center, my, smartfinder 등의 메뉴는 뺀거
        val result =
//            listOf( BoardCategoryMenuSelectbox(value ="", label="전체", options=null) ) +
            allMenus.filter { it.parentId == 0 && it.contentType != "page" && !DefaultAllowedMenuContentType.contains(it.contentType) && it.staticYn == false }
                .map { BoardCategoryMenuSelectbox(value = it.id?.toString(), label = it.menuNm) }
        result.forEach {
            // options 추가
            val value = it.value
            it.options = allMenus.filter { it.parentId?.toString() == value && it.contentType != "page" }
                .map { BoardCategoryMenuSelectbox(value = it.id?.toString(), label = it.menuNm) }
        }

        return result
    }


    /**
     * name: findBoardList
     * description: Board 목록 조회
     * author: 정상철
     * created: 2025-06-27
    
     *
     * @return 
     */
    fun findBoardList(
//        pageable: Pageable
    ): List<ContentBoardDto>{
        // 메뉴id, 메뉴명
        val menuNamesMap = roleAndMenuComponent.getAllSimpleMenuidAndNames()

        val qTbBoard = QTbBoard.tbBoard
        val whereCondition = BooleanBuilder()

        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    ContentBoardDto::class.java,
                    qTbBoard.id,
                    qTbBoard.menu1Id,
                    qTbBoard.menu2Id,
                    qTbBoard.createdAt,
                    qTbBoard.createdUserId,
                    qTbBoard.createdUserNm,
                    qTbBoard.modifiedAt,
                    qTbBoard.modifiedUserId,
                    qTbBoard.modifiedUserNm
                )
            )
            .from(qTbBoard)
            .where(whereCondition)
//            .offset(pageable.offset)
//            .limit(pageable.pageSize.toLong())
            .fetch()
            .map {
                // menu명 셋팅
                it.menu1Nm = menuNamesMap[it.menu1Id]?.name
                it.menu2Nm = menuNamesMap[it.menu2Id]?.name
                it
            }

        return resultData
    }

    /**
     * name:
     * description: Board 게시판 단위 메뉴 이동  =>> 안되는 기능
     * author: 정상철
     * created: 2025-06-30

     *
     * @return
     */
//    @Transactional(rollbackOn = [Throwable::class])
//    fun updateMenuOfBoard(pMenuId: Int?, boardId: Int?) {
//        val userInfo = UserInfoHelper.getLoginUserInfo()
//        val menuInfo = menuIdHolder.getMenuFromId(pMenuId) ?: throw BizException("카테고리(메뉴)가 존재하지 않음($pMenuId)")
//
//        val isDuplicate = tbBoardRepository.findByMenu2Id(pMenuId)
//        if (isDuplicate) {
//            throw BizException("이미 해당 메뉴($pMenuId)에 대한 엔티티가 존재합니다")
//        }
//        
//        if (!boardId.isNullOrEmpty()) {
//
//            boardId.forEach { boardItemId ->
//                tbBoardRepository.findById(boardItemId).ifPresent {
//                    // TbMenu 테이블에서 post_category 추출하여 업데이트 필요
//                    it.apply {
//                        this.menu1Id = menuInfo?.parentId
//                        this.menu2Id = menuInfo?.id
//                        this.modifiedAt = LocalDateTime.now()
//                        this.modifiedUserId = userInfo?.id
//                        this.modifiedUserNm = userInfo?.name
//                    }
//                    tbBoardRepository.save(it)
//                }
//
//                // 이동시 board meta 데이터 삭제 필요
//                tbBoardItemInfoRepository.findByPostId(postId)
//                    .takeIf { it.isNotEmpty() }
//                    ?.let {
//                        tbBoardItemInfoRepository.deleteByPostId(postId)
//                    }
//            }
//        }
//    }

    /**
     * name: findBoardItemList
     * description: 메뉴 ID 기준으로 BoardItem List 검색
     * author: 정상철
     * created: 2025-06-30

     *
     * @return
     */

    fun findBoardItemList(
        pMenuId: Int
    ):List<AdminBoardDto>{
        val qTbBoard = QTbBoard.tbBoard
        val qTbBoardItem = QTbBoardItem.tbBoardItem
        val qTbBoardItemInfo = QTbBoardItemInfo.tbBoardItemInfo

        val whereCondition = BooleanBuilder();
        whereCondition.and(qTbBoard.menu2Id.eq(pMenuId))

        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    AdminBoardDto::class.java,
                    qTbBoardItem.id,
                    qTbBoardItem.title,
                    qTbBoardItem.contents,
                    qTbBoardItem.viewCnt,
                    qTbBoardItem.opened,
                    qTbBoardItem.authLevel,
                    qTbBoardItem.createdAt,
                    qTbBoardItem.createdUserId,
                    qTbBoardItem.createdUserNm,
                    qTbBoardItem.modifiedAt,
                    qTbBoardItem.modifiedUserId,
                    qTbBoardItem.modifiedUserNm,
                    qTbBoard.menu1Id,
                    qTbBoard.menu2Id,
                )
            )
            .distinct() // 중복 제거
            .from(qTbBoardItem)
            .leftJoin(qTbBoardItemInfo).on(qTbBoardItem.id.eq(qTbBoardItemInfo.boardItemId))
            .leftJoin(qTbBoard).on(qTbBoard.id.eq(qTbBoardItem.boardId))
            .where(whereCondition)
            .where(BoardHelper.defaultBoardListCondition())
            .orderBy(qTbBoardItem.createdAt.desc())
            .fetch()
            .map {
                it.boardItemInfo = findBoardItemInfoByMenu1IdAndMenu2IdAndStaticYn(it.menu1Id!! , it.menu2Id, it.id,false)
                it
            }

        logger.debug { "=== resultData : $resultData" }

        return resultData
    }

    /**
     * name:
     * description: Board meta 정보
     * author: 정상철
     * created: 2025-06-30

     *
     * @return
     */

    fun findBoardItemInfoByMenu1IdAndMenu2IdAndStaticYn(
        menu1Id: Int,
        menu2Id: Int?,
        boardItemId: Int?,
        staticYn: Boolean?
    ):List<AdminBoardItemInfo>{
        val tbBoard = QTbBoard.tbBoard
        val tbBoardItemInfo = QTbBoardItemInfo.tbBoardItemInfo
        val tbBoardItemField = QTbBoardItemField.tbBoardItemField

        val whereCondition = BooleanBuilder();

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbBoard.menu1Id.eq(menu1Id))
        }

        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbBoard.menu2Id.eq(menu2Id))
        }

        if (staticYn == false) {
            whereCondition.and(tbBoardItemField.staticYn.eq(staticYn))
        }

        if (boardItemId !== null) {
            whereCondition.and(tbBoardItemInfo.boardItemId.eq(boardItemId))
        }

        val result = jPAQueryFactory
            .select(
                Projections.fields(
                    AdminBoardItemInfo::class.java,
                    tbBoardItemInfo.id,
                    tbBoardItemInfo.itemFieldId,
                    tbBoardItemInfo.boardItemId,
                    tbBoardItemInfo.itemKey,
                    tbBoardItemInfo.itemValue,
                    tbBoardItemInfo.createdAt,
                    tbBoardItemInfo.createdUserId,
                    tbBoardItemInfo.createdUserNm,
                    tbBoardItemInfo.modifiedAt,
                    tbBoardItemInfo.modifiedUserId,
                    tbBoardItemInfo.modifiedUserNm
                )
            )
            .from(tbBoardItemInfo)
            .leftJoin(tbBoardItemField).on(tbBoardItemInfo.itemFieldId.eq(tbBoardItemField.id))
            .leftJoin(tbBoard).on(tbBoardItemField.boardId.eq(tbBoard.id))
            .where(whereCondition)
            .orderBy(tbBoardItemInfo.itemKey.asc())
            .fetch()

        return result;
    }

    /**
     * name:
     * description: board item 일괄 삭제
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteBoardList(boardItemIdList: List<Int>) {
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        boardItemIdList.forEach {
            val boardItemId = it
            tbBoardItemRepository.findById(boardItemId).getOrNull()?.apply {
                val boardItem = this
                val boardEntity = tbBoardRepository.findById(boardItem.boardId!!).orElseThrow {
                    BizException("게시판 정보가 존재하지 않습니다. (${boardItem.boardId})")
                }
                // history에 insert
                TbUserHistory().let {
                    it.boardItemId = boardItemId
                    it.userId = userInfo.id
                    it.postTitle = boardItem.title
                    it.description = "Board 게시물을 삭제하였습니다."
                    it.userName = userInfo.name
                    it.actionType = UserHistoryActionType.post_delete.name
                    it.menu1Id = boardEntity.menu1Id
                    it.menu1Nm = menuIdHolder.getMenuNmFromId(boardEntity.menu1Id)
                    it.menu2Id = boardEntity.menu2Id
                    it.menu2Nm = menuIdHolder.getMenuNmFromId(boardEntity.menu2Id)
                    it.createdAt = LocalDateTime.now()
                    tbUserHistoryRepository.save(it)
                }

            }
        }
        tbBoardItemRepository.deleteAllById(boardItemIdList)
        tbBoardItemInfoRepository.deleteAllByBoardItemIdIn(boardItemIdList)
    }
}