package com.tf.cms.biz.user.board

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.biz.admin.alarm.AlarmSendContentDto
import com.tf.cms.biz.user.smartfinder.SmartFinderParams
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbBoardItemFieldRepository
import com.tf.cms.common.jpa.repository.TbBoardItemRepository
import com.tf.cms.common.jpa.repository.TbBoardRepository
import com.tf.cms.common.model.*
import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import jakarta.servlet.http.HttpServletRequest
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import kotlin.math.log

/**
 * packageName    : com.tf.cms.biz.user.board
 * fileName       : BoardService
 * author         : 정상철
 * date           : 2025-06-20
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */

@Service
class BoardService (
    private val jPAQueryFactory: JPAQueryFactory,
    private val tbBoardItemRepository: TbBoardItemRepository,
    private val tbBoardRepository: TbBoardRepository,
    private val menuIdHolder: MenuIdHolder,
    private val tbBoardItemFieldRepository: TbBoardItemFieldRepository,
){
    private val logger = logger()


    /**
     * name: findBoardListByMenu1IdAndMenu2Id
     * description: 카탈로그 종류, 메뉴 종류 별 boardLList 조회
     * author: 정상철
     * created:

     *
     * @return
     */

    fun findBoardListByMenu1IdAndMenu2Id(
        menu1: String,
        menu2: String?,
        cond: BoardSearchParams,
        pageable: Pageable,
        request: HttpServletRequest
    ):Page<BoardDto>{

        val tbBoard = QTbBoard.tbBoard
        val tbBoardItem = QTbBoardItem.tbBoardItem
        val tbBoardItemInfo = QTbBoardItemInfo.tbBoardItemInfo
        val tbBoardItemField = QTbBoardItemField.tbBoardItemField

        val userAgent = request.getHeader("User-Agent")
        val isMobile = Helpers.isMobile(request)
        logger.info { "=== userAgent : ${userAgent}" }
        logger.info { "=== isMobile : ${isMobile}" }
        val whereCondition = BooleanBuilder()
//        whereCondition.and(tbBoardItemField.staticYn.eq(false))

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }

        logger.info { "=== menu1Id : ${menu1Id}" }
        logger.info { "=== menu2Id : ${menu2Id}" }

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbBoard.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbBoard.menu2Id.eq(menu2Id))
        }

        val itemKeys = findItemKeyList(menu1Id, menu2Id, isMobile)
            logger.info { "=== itemKeys : ${itemKeys}" }
        searchWhereCondition(whereCondition, cond, itemKeys);

        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    BoardDto::class.java,
                    tbBoardItem.id,
                    tbBoardItem.title,
                    tbBoardItem.contents,
                    tbBoardItem.viewCnt,
                    tbBoardItem.opened,
                    tbBoardItem.authLevel,
                    tbBoardItem.createdAt,
                    tbBoardItem.createdUserId,
                    tbBoardItem.createdUserNm,
                    tbBoardItem.modifiedAt,
                    tbBoardItem.modifiedUserId,
                    tbBoardItem.modifiedUserNm,
                )
            )
            .distinct() // 중복 제거
            .from(tbBoardItem)
            .leftJoin(tbBoardItemInfo).on(tbBoardItem.id.eq(tbBoardItemInfo.boardItemId))
            .leftJoin(tbBoard).on(tbBoard.id.eq(tbBoardItem.boardId))
            .where(whereCondition)
            .where(BoardHelper.defaultBoardListCondition())
            .orderBy(tbBoardItem.createdAt.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()
            .map {
                it.boardItemInfo = findBoardItemInfoByMenu1IdAndMenu2IdAndStaticYn(menu1Id!! , menu2Id, it.id,false)
                it
            }

        logger.debug { "=== resultData : $resultData" }

        val queryFetchCount = jPAQueryFactory
            .select(tbBoardItem.id.countDistinct())
            .from(tbBoardItem)
            .where(whereCondition)
            .where(BoardHelper.defaultBoardListCondition())
            .leftJoin(tbBoardItemInfo).on(tbBoardItem.id.eq(tbBoardItemInfo.boardItemId))
            .leftJoin(tbBoard).on(tbBoard.id.eq(tbBoardItem.boardId))
            .fetchFirst()
        logger.debug { "=== queryFetchCount : $queryFetchCount" }

        return PageImpl(resultData, pageable, queryFetchCount)
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
    ):List<BoardItemInfo>{
        val tbBoard = QTbBoard.tbBoard
        val tbBoardItemInfo = QTbBoardItemInfo.tbBoardItemInfo
        val tbBoardItemField = QTbBoardItemField.tbBoardItemField
        val tbRefGroup = QTbRef("tbRefGroup")
        val tbRefValue = QTbRef("tbRefValue")

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
                    BoardItemInfo::class.java,
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
                    tbBoardItemInfo.modifiedUserNm,
                    tbRefValue.label.`as`("label")
                )
            )
            .from(tbBoardItemInfo)
            .distinct() // 중복 제거
            .leftJoin(tbBoardItemField).on(tbBoardItemInfo.itemFieldId.eq(tbBoardItemField.id))
            .leftJoin(tbBoard).on(tbBoardItemField.boardId.eq(tbBoard.id))
            .leftJoin(tbRefGroup).on(tbRefGroup.groupCode.eq(tbBoardItemField.groupCode))
            .leftJoin(tbRefValue).on(tbRefValue.code.eq(tbBoardItemInfo.itemValue).and(tbRefValue.groupCode.eq(tbBoardItemField.groupCode)))
            .where(whereCondition)
            .orderBy(tbBoardItemInfo.itemKey.asc())
            .fetch()

        return result;
    }

    /**
     * name: 
     * description: Board 상세조회
     * author: 정상철
     * created: 
    
     *
     * @return 
     */
    fun findBoardByBoardItemId(
        boardItemId: Int
    ): BoardDetailDto{
        val loginUser = UserInfoHelper.getLoginUserInfo()
        val tbBoardItemEntity = tbBoardItemRepository.findById(boardItemId)
            .orElseThrow { BizException("해당 게시글이 존재하지 않습니다.") }

//        if(loginUser?.authLevel!! < tbBoardItemEntity.authLevel!!) {
            if (hasNotViewerAuth(tbBoardItemEntity.opened, tbBoardItemEntity.createdUserId!!)) {
                throw BizException("비공개 게시글입니다.")
            }
//        }
        // 권한
        if(loginUser?.authLevel!! < tbBoardItemEntity.authLevel!!) {
            throw BoardAccessDeniedException("해당 게시물에 대한 권한이 없습니다.")
        }

        val tbBoard = QTbBoard.tbBoard
        val tbBoardItem = QTbBoardItem.tbBoardItem
        val tbBoardInfo = QTbBoardItemInfo.tbBoardItemInfo

        val whereCondition = BooleanBuilder();
        whereCondition.and(tbBoardItem.id.eq(boardItemId))

        val resultData = jPAQueryFactory
            .select(
                Projections.fields(
                    BoardDetailDto::class.java,
                    tbBoardItem.id,
                    tbBoard.menu1Id,
                    tbBoard.menu2Id,
                    tbBoardItem.title,
                    tbBoardItem.contents,
                    tbBoardItem.viewCnt,
                    tbBoardItem.opened,
                    tbBoardItem.authLevel,
                    tbBoardItem.createdAt,
                    tbBoardItem.createdUserId,
                    tbBoardItem.createdUserNm,
                    tbBoardItem.modifiedAt,
                    tbBoardItem.modifiedUserId,
                    tbBoardItem.modifiedUserNm,
                )
            )
            .from(tbBoardItem)
            .leftJoin(tbBoard).on(tbBoard.id.eq(tbBoardItem.boardId))
            .where(whereCondition)
            .where(BoardHelper.defaultBoardOneCondition())
            .fetchFirst()
            .let {
                it.boardItemInfo = findBoardItemInfoByMenu1IdAndMenu2IdAndStaticYn(it.menu1Id!! , it.menu2Id, boardItemId ,false)
                it
            }

        // 조회수 업데이트
        updateBoardViewCnt(tbBoardItemEntity)
        return resultData
    }

    /**
     * name: 
     * description: menu1, menu2 아이디로 컬럼 정보 조회
     * author: 정상철
     * created: 
    
     *
     * @return 
     */
    fun getBoardColumnsByMenu1IdAndMenu2Id(
        menu1: String,
        menu2: String?,
    ): List<BoardColumnsTitleDto>{

        val tbBoard = QTbBoard.tbBoard
        val tbBoardItemField = QTbBoardItemField.tbBoardItemField

        val whereCondition = BooleanBuilder()

        val menu1Id = menuIdHolder.getMenuFromPath(menu1)?.id
        val menu2Id = if (menu2 == null) {
            null
        } else {
            menuIdHolder.getMenuFromPath(menu1, menu2)?.id
        }
        logger.info { "=== menu1 : ${menu1}" }
        logger.info { "=== menu2 : ${menu2}" }

        logger.info { "=== menu1Id : ${menu1Id}" }
        logger.info { "=== menu2Id : ${menu2Id}" }

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbBoard.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbBoard.menu2Id.eq(menu2Id))
        }

        val result = jPAQueryFactory
            .select(
                Projections.fields(
                    BoardColumnsTitleDto::class.java,
                    tbBoardItemField.id,
                    tbBoardItemField.boardId,
                    tbBoardItemField.staticYn,
                    tbBoardItemField.itemKey,
                    tbBoardItemField.itemNm,
                    tbBoardItemField.itemOpened,
                    tbBoardItemField.searchUseYn,
                    tbBoardItemField.itemType,
                    tbBoardItemField.itemWidth,
                    tbBoardItemField.itemEllipsis,
                    tbBoardItemField.itemDisplayOrder,
                    tbBoardItemField.mobileVisibleYn,
                    tbBoardItemField.createdAt,
                    tbBoardItemField.createdUserId,
                    tbBoardItemField.createdUserNm,
                    tbBoardItemField.modifiedAt,
                    tbBoardItemField.modifiedUserId,
                    tbBoardItemField.modifiedUserNm
                )
            )
            .from(tbBoardItemField)
            .leftJoin(tbBoard).on(tbBoard.id.eq(tbBoardItemField.boardId))
            .where(whereCondition)
            .orderBy(tbBoardItemField.itemDisplayOrder.asc())
            .fetch()

        return result;
    }

    /**
     * name: 
     * description: 게시판 검색 조건 설정
     * author: 정상철
     * created: 
    
     *
     * @return 
     */ 
    private fun searchWhereCondition(whereCondition: BooleanBuilder, cond: BoardSearchParams, itemKeys: List<Pair<String?, Boolean?>>){
        val tbBoardItem = QTbBoardItem.tbBoardItem
        val tbBoardItemInfo = QTbBoardItemInfo.tbBoardItemInfo


        if (!cond.keywords.isNullOrBlank()) {
            val keyword = cond.keywords!!.trim()
            val keywordCondition = BooleanBuilder()

            itemKeys.forEach { (itemKey, staticYn) ->
                if (staticYn == true) {

                    // tbBoardItem 컬럼으로 직접 접근 (Expression으로)
                    when (itemKey) {
                        "title" -> keywordCondition.or(tbBoardItem.title.containsIgnoreCase(keyword))
//                        "viewCnt" -> keywordCondition.or(
//                            Expressions.stringTemplate("CAST({0} AS CHAR)", tbBoardItem.viewCnt)
//                                .like("%$keyword%")
//                        )
//                        "createdAt" -> {
//                            val start = Helpers.formatStringToLocalDate(keyword)?.atStartOfDay()
//                            val end = Helpers.formatStringToLocalDate(keyword)?.atTime(LocalTime.MAX)
//                            keywordCondition.or(tbBoardItem.createdAt.between(start, end))
//                        }

                        "viewCnt" -> {
                            val viewCount = keyword.toIntOrNull()
                            if (viewCount != null) {
                               keywordCondition.or(tbBoardItem.viewCnt.eq(viewCount))
                            }
                        }

                        "createdUserNm" -> keywordCondition.or(tbBoardItem.createdUserNm.containsIgnoreCase(keyword))
                        // 필요한 static 필드 추가...
                    }
                } else {
                    // itemKey가 있는 tbBoardItemInfo로 접근
                    keywordCondition.or(
                        tbBoardItemInfo.itemKey.eq(itemKey)
                            .and(tbBoardItemInfo.itemValue.containsIgnoreCase(keyword))
                    )
                }
            }

            whereCondition.and(keywordCondition)
        }

        if (!cond.createdUserNm.isNullOrBlank()) {
            whereCondition.and(tbBoardItem.createdUserNm.containsIgnoreCase(cond.createdUserNm))
        }

        if (!cond.title.isNullOrBlank()) {
            whereCondition.and(tbBoardItem.title.containsIgnoreCase(cond.title))
        }

        if (!cond.contents.isNullOrBlank()) {
            whereCondition.and(tbBoardItem.contents.containsIgnoreCase(cond.contents))
        }

        if (!cond.item1.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item1")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item1))
            )
        }
        if (!cond.item2.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item2")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item2))
            )
        }
        if (!cond.item3.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item3")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item3))
            )
        }
        if (!cond.item4.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item4")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item4))
            )
        }
        if (!cond.item5.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item5")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item5))
            )
        }
        if (!cond.item6.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item6")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item6))
            )
        }
        if (!cond.item7.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item7")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item7))
            )
        }
        if (!cond.item8.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item8")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item8))
            )
        }
        if (!cond.item9.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item9")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item9))
            )
        }
        if (!cond.item10.isNullOrBlank()) {
            whereCondition.and(
                tbBoardItemInfo.itemKey.eq("item10")
                    .and(tbBoardItemInfo.itemValue.containsIgnoreCase(cond.item10))
            )
        }
    }

    /**
     * name:
     * description: Board 조회수 증가
     * author: 정상철
     * created:

     *
     * @return
     */
    @Transactional(rollbackOn = [Throwable::class])
    private fun updateBoardViewCnt(e: TbBoardItem) {
        e.apply { viewCnt = viewCnt?.plus(1) }
        tbBoardItemRepository.save(e)
    }


    /**
     * name:
     * description: Board 비공개 열람 체크
     * author: 정상철
     * created:

     *
     * @return
     */
    private fun hasNotViewerAuth(isOpen: Boolean, createdUserId: String): Boolean {
        val loginUser = UserInfoHelper.getLoginUserInfo()
        logger.debug { "=== hasViewerAuth : $isOpen, $createdUserId, ${loginUser?.id}, ${loginUser?.role}" }
        return !isOpen
                && (loginUser?.id != createdUserId
                && loginUser?.role != TheRole.ROLE_MASTER
                && loginUser?.role != TheRole.ROLE_OPERATOR)
    }

    /**
     * name:
     * description: 게시물 검색에 사용 가능한 item key List
     * author: 정상철
     * created:

     *
     * @return
     */

    fun findItemKeyList(
        menu1Id: Int?,
        menu2Id: Int?,
        isMobile: Boolean
    ): List<Pair<String?, Boolean?>>  {
        val tbBoardItemField = QTbBoardItemField.tbBoardItemField
        val tbBoard = QTbBoard.tbBoard

        val whereCondition = BooleanBuilder()
        whereCondition.and(tbBoardItemField.itemOpened.eq(true))
//        whereCondition.and(tbBoardItemField.staticYn.eq(false))

        if ((menu1Id ?: 0) > 0){
            whereCondition.and(tbBoard.menu1Id.eq(menu1Id))
        }
        if ((menu2Id ?: 0) > 0) {
            whereCondition.and(tbBoard.menu2Id.eq(menu2Id))
        }
        if(isMobile) {
            whereCondition.and(tbBoardItemField.mobileVisibleYn.eq(true))
        }

        val result = jPAQueryFactory
            .select(
                tbBoardItemField.itemKey,
                tbBoardItemField.staticYn,
            )
            .from(tbBoardItemField)
            .leftJoin(tbBoard).on(tbBoard.id.eq(tbBoardItemField.boardId))
            .where(whereCondition)
            .fetch()

        return result.map { tuple ->
            Pair(
                tuple.get(tbBoardItemField.itemKey),
                tuple.get(tbBoardItemField.staticYn)
            )
        }
    }
}