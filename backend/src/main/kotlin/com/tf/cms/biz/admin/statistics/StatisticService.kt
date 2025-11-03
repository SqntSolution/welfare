package com.tf.cms.biz.admin.statistics

import com.tf.cms.biz.admin.common.MemberInfo
import com.tf.cms.biz.admin.group.GroupService
import com.tf.cms.biz.common.history.*
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.TbPostContentRepository
import com.tf.cms.common.utils.Helpers
import com.tf.cms.common.utils.HrUserCondition
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.logger
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.ExpressionUtils
import com.querydsl.core.types.Projections
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.net.URLEncoder
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime


/**
 * 통계 처리 Service
 */
@Service
class StatisticService(
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbPostContentRepository: TbPostContentRepository,
    private val menuIdHolder: MenuIdHolder,
    private val userHistoryService: UserHistoryService,
    private val groupService: GroupService,
) {
    private val logger = logger()

    /**
     * 통계 목록 조회 (관리자)
     *
     * @param actionType
     * @param startDate
     * @param endDate
     * @return
     */

    fun findStatisticList(
        actionType : String?,
        startDate : String?,
        endDate : String?,
    ) : List<StatisticMain> {
        require(!actionType.isNullOrBlank()) { "actionType은 필수 값입니다." }
        require(!startDate.isNullOrBlank()) { "startDate는 필수 값입니다." }
        require(!endDate.isNullOrBlank()) { "endDate는 필수 값입니다." }

        val qTbStatisticsSummary = QTbStatisticsSummary.tbStatisticsSummary
        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val whereCondition = BooleanBuilder()

        whereCondition.and(
            qTbStatisticsSummary.targetDate.between(Helpers.formatStringToLocalDate(startDate), Helpers.formatStringToLocalDate(endDate))
        )

        whereCondition.and(qTbStatisticsSummary.tag1.eq(actionType))

        val dateExpression = Expressions.dateTemplate(LocalDate::class.java, "DATE({0})", qTbStatisticsSummary.targetDate)

        val result = jpaQueryFactory
            .select(
                Projections.fields(
                    StatisticMain::class.java,
                    qTbStatisticsSummary.id,
                    qTbStatisticsSummary.cnt.`as`("value"),
                    qTbStatisticsSummary.targetDate,
                    qTbStatisticsSummary.tag1,
                    qTbStatisticsSummary.totalVisitsCnt
                ),
            )
            .from(qTbStatisticsSummary)
            .where(whereCondition)
            .groupBy(dateExpression)
            .orderBy(qTbStatisticsSummary.targetDate.asc())
            .fetch()

        return result
    }

    /**
     * 통계 목록 상세 조회 (방문자)
     *
     * @param targetDate
     * @return
     */

    fun findLoginList(
        targetDate: String?
    ): List<MemberInfo> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }

        val tbUserMaster = QTbUserMaster.tbUserMaster
        val tbHrCodeMaster = QTbHrCodeMaster.tbHrCodeMaster
        val tbAddJobMaster = QTbAddJobMaster.tbAddJobMaster
        val tbUserHistory = QTbUserHistory.tbUserHistory
        val tbAuthGroupUserMapp = QTbAuthGroupUserMapp.tbAuthGroupUserMapp
        val tbAuthGroup2 = QTbAuthGroup("tbAuthGroup2") // 개인 권한그룹 매핑
        val tbHrCode = QTbHrCodeMaster("tbHrCode")
        val whereCondition = BooleanBuilder()

        Helpers.formatStringToLocalDate(targetDate)?.let { date ->
            val startOfDay = date.atStartOfDay()
            val endOfDay = date.atTime(LocalTime.MAX)

            whereCondition.and(
                tbUserHistory.createdAt.between(startOfDay, endOfDay)
            )
        }

//        whereCondition.and(HrUserCondition.defaultUserMasterCondition())
        whereCondition.and(tbUserHistory.actionType.eq("login"))

        val subQuery1 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
            .where(tbHrCode.id.fullCode.eq(tbHrCodeMaster.fullCode2)).limit(1)
        val subQuery2 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
            .where(tbHrCode.id.code.eq(tbAddJobMaster.dutyCd)).limit(1)
        val subQuery3 = JPAExpressions.select(tbHrCode.codeNm).from(tbHrCode)
            .where(tbHrCode.id.code.eq(tbAddJobMaster.empGradeCd)).limit(1)
        val templateEndYmd = Expressions.dateTemplate(LocalDate::class.java, "STR_TO_DATE({0}, '%Y%m%d')", tbAddJobMaster.endYmd)

        val resultData = jpaQueryFactory
            .select(
                Projections.fields(
                    MemberInfo::class.java,
                    tbUserMaster.userId,
                    tbUserMaster.userNm,
                    tbUserMaster.loginId,
                    ExpressionUtils.`as`(subQuery1, "parentOrgNm"),
                    tbUserMaster.orgId,
                    tbUserMaster.orgNm,
                    tbUserMaster.isActive,
                    tbUserMaster.mobileNo,
                    tbUserMaster.mailAddr,
                    tbHrCodeMaster.id.fullCode.`as`("fullcode"),
                    ExpressionUtils.`as`(subQuery2, "dutyNm"),
                    ExpressionUtils.`as`(subQuery3, "empGradeNm"),
                    tbAuthGroupUserMapp.authGroupCd.`as`("authGroupCd"),
                    tbAuthGroup2.groupNm.`as`("authGroupNm"),
                )
            )
            .distinct()
            .from(tbUserHistory)
            .leftJoin(tbUserMaster).on(tbUserHistory.userId.eq(tbUserMaster.userId))
            .leftJoin(tbHrCodeMaster).on(tbHrCodeMaster.id.code.eq(tbUserMaster.orgId).and(tbHrCodeMaster.id.groupCode.eq("ORG")))
            .leftJoin(tbAddJobMaster).on(tbAddJobMaster.id.empId.eq(tbUserMaster.userId)
                .and(tbAddJobMaster.id.orgId.eq(tbHrCodeMaster.id.fullCode))
                .and(tbAddJobMaster.mgrClass.eq("10").or(tbAddJobMaster.mgrClass.isNull))
                .and(templateEndYmd.goe(LocalDate.now()))
            )
            .leftJoin(tbAuthGroupUserMapp).on(tbAuthGroupUserMapp.userId.eq(tbUserHistory.userId))
            .leftJoin(tbAuthGroup2).on(tbAuthGroup2.authGroupCd.eq(tbAuthGroupUserMapp.authGroupCd))
            .where(whereCondition)
            .groupBy(tbUserMaster.userId)
            .orderBy(tbUserMaster.orgId.asc(), tbUserMaster.userNm.asc())
            .fetch()
//            .filter {
//                it.loginId != null
//            }
            .map {
                //전화번호, 메일주소 마스킹 처리
                it.apply {
                    mailAddr = mailAddr?.let { Helpers.maskEmail(it) }
                    mobileNo = mobileNo?.let { Helpers.maskPhone(it) }
                }
            }

        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }


    /**
     * 통계 목록 상세 조회 (조회)
     *
     * @param targetDate
     * @return
     */

    fun findViewList(
        targetDate: String?,
    ) : List<ViewHistoryDto> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }

        val qTbPostContent = QTbPostContent.tbPostContent
        val qTbPostMetaStatistic = QTbPostMetaStatistic.tbPostMetaStatistic
        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val qTbUserMaster = QTbUserMaster.tbUserMaster
        val whereCondition = BooleanBuilder()

        Helpers.formatStringToLocalDate(targetDate)?.let { date ->
            val startOfDay = date.atStartOfDay()
            val endOfDay = date.atTime(LocalTime.MAX)

            whereCondition.and(
                qTbUserHistory.createdAt.between(startOfDay, endOfDay)
            )
        }
        whereCondition.and(qTbUserHistory.actionType.eq("post_view"))
//        whereCondition.and(HrUserCondition.defaultUserMasterCondition())

        val resultData = jpaQueryFactory
            .select(
                Projections.fields(
                    ViewHistoryDto::class.java,
                    qTbUserHistory.id,
                    qTbUserHistory.postId,
                    qTbPostContent.postType,
                    qTbUserHistory.postTitle,
                    qTbUserHistory.description,
                    qTbUserHistory.menu1Id,
                    qTbUserHistory.menu2Id,
                    qTbUserHistory.menu1Nm,
                    qTbUserHistory.menu2Nm,
                    qTbUserHistory.createdAt,
                    qTbUserHistory.postId.count().`as`("viewCnt")
//                    qTbPostMetaStatistic.viewCnt,
                ),
            )
            .distinct()
            .from(qTbUserHistory)
            .where(whereCondition)
            .leftJoin(qTbPostContent).on(qTbUserHistory.postId.eq(qTbPostContent.id))
            .leftJoin(qTbUserMaster).on(qTbUserHistory.userId.eq(qTbUserMaster.userId))
//            .join(qTbPostMetaStatistic).on(qTbUserHistory.postId.eq(qTbPostMetaStatistic.id))
            .groupBy(qTbUserHistory.postId)
            .orderBy(qTbUserHistory.createdAt.desc())
            .fetch()
//            .map {
//                it.menuNm1 = menuIdHolder.getMenuFromId(it.menuId1)?.menuNm
//                it.menuNm2 = menuIdHolder.getMenuFromId(it.menuId2)?.menuNm
//                it
//            }

        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }


    /**
     * 통계 목록 상세 조회 (구독)
     *
     * @param targetDate
     * @return
     */

    fun findSubscribeList(
        targetDate: String?,
    ) : List<SubScribeHistoryDto> {
//다시 history 메인으로 조인해서 봐야한다
        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }

        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val qTbUserMaster = QTbUserMaster.tbUserMaster

        val whereCondition = BooleanBuilder()

        val configs = findSubscribeUserName("subscribe" ,targetDate)

        Helpers.formatStringToLocalDate(targetDate)?.let { date ->
            val startOfDay = date.atStartOfDay()
            val endOfDay = date.atTime(LocalTime.MAX)

            whereCondition.and(
                qTbUserHistory.createdAt.between(startOfDay, endOfDay)
            )
        }

        whereCondition.and(qTbUserHistory.actionType.eq("subscribe").or(qTbUserHistory.actionType.eq("subscribe_remove")))

        val resultData = jpaQueryFactory
            .select(
                Projections.fields(
                    SubScribeHistoryDto::class.java,
                    qTbUserHistory.postId,
                    qTbUserHistory.postTitle,
                    qTbUserHistory.userId,
                    qTbUserHistory.description,
                    qTbUserHistory.attachedFileId,
                    qTbUserHistory.attachedFileNm,
                    qTbUserHistory.actionType,
                    qTbUserHistory.menu1Id,
                    qTbUserHistory.menu2Id,
                    qTbUserHistory.menu1Nm,
                    qTbUserHistory.menu2Nm,
                    qTbUserHistory.createdAt,
                ),
            )
            .from(qTbUserHistory)
            .leftJoin(qTbUserMaster).on(qTbUserHistory.userId.eq(qTbUserMaster.userId))
            .where(whereCondition)
            .groupBy(qTbUserHistory.menu2Id)
            .orderBy(qTbUserHistory.createdAt.desc())
            .fetch()
            .map {
                val menu2Id = it.menu2Id
                it.subscriber = configs.filter { config ->
                    configs.any { menu2Id == config.menu2Id && config.actionType == "subscribe"}
                }
                it.subscriberRemove = configs.filter { config ->
                    configs.any { menu2Id == config.menu2Id && config.actionType == "subscribe_remove"}
                }
                val subscriberSize = it.subscriber?.size ?: 0
                val subscriberRemoveSize = it.subscriberRemove?.size ?: 0

                it.subscribeCnt = subscriberSize - subscriberRemoveSize
                it.subscribeYn = it.subscribeCnt!! >= 0
                it
            }
        logger.debug { "=== resultData : ${resultData.size}" }

        return resultData
    }


    /**
     * 통계 유저리스트 조회 (구독)
     *
     * @param actionType
     * @param targetDate
     * @param compid
     * @return
     */

    fun findSubscribeUserName(
//            menu1Id: Int?,
//            menu2Id: Int?,
        actionType: String?,
        targetDate: String?,
    ) : List<UserNameListDto> {

//        require(!createdAt.isNullOrBlank()) { "targetDate는 필수 값입니다." }

        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val qTbIfViewUserMaster = QTbUserMaster.tbUserMaster
        val whereCondition = BooleanBuilder()

//        if (menu1Id != null) {
//            if (menu1Id >= 0) {
//                whereCondition.and(qTbUserHistory.menu1Id.eq(menu1Id))
//            }
//        }
//
//        if (menu2Id != null) {
//            if (menu2Id >= 0) {
//                whereCondition.and(qTbUserHistory.menu2Id.eq(menu2Id))
//            }
//        }

//        whereCondition.and(qTbUserHistory.actionType.eq(actionType))

        whereCondition.and(qTbUserHistory.actionType.eq("subscribe").or(qTbUserHistory.actionType.eq("subscribe_remove")))

        if (targetDate != null) {
            Helpers.formatStringToLocalDate(targetDate)?.let { date ->
                val startOfDay = date.atStartOfDay()
                val endOfDay = date.atTime(LocalTime.MAX)

                whereCondition.and(
                    qTbUserHistory.createdAt.between(startOfDay, endOfDay)
                )
            }
        }


        val resultData = jpaQueryFactory
            .select(
                Projections.fields(
                    UserNameListDto::class.java,
                    qTbUserHistory.userId,
                    qTbUserHistory.userName,
                    qTbUserHistory.actionType,
                    qTbUserHistory.menu2Id,
                ),
            )
            .from(qTbUserHistory)
            .leftJoin(qTbIfViewUserMaster).on(qTbUserHistory.userId.eq(qTbIfViewUserMaster.userId))
            .where(whereCondition)
//            .groupBy(qTbUserHistory.menu2Id, qTbUserHistory.userId)
            .fetch()

        return resultData
    }

    /**
     * 통계 목록 상세 조회 (파일다운로드)
     *
     * @param targetDate
     * @return
     */

    fun findFileDownloadList(
        targetDate: String?,
    ) : List<DownHistoryDto> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }

        val qTbUserHistory = QTbUserHistory.tbUserHistory
        val qTbUserHistory2 = QTbUserHistory.tbUserHistory
        val qTbUserMaster = QTbUserMaster.tbUserMaster

        val whereCondition = BooleanBuilder()

        val subQuery1 = JPAExpressions.select(qTbUserHistory2.attachedFileId.count()).from(qTbUserHistory2)
            .where(qTbUserHistory2.postId.eq(qTbUserHistory.postId)).groupBy(qTbUserHistory2.attachedFileId)

        targetDate?.let {
            Helpers.formatStringToLocalDate(it)?.let { date ->
                val startOfDay = date.atStartOfDay()
                val endOfDay = date.atTime(LocalTime.MAX)

                whereCondition.and(
                    qTbUserHistory.createdAt.between(startOfDay, endOfDay)
                )
            }
        }

        whereCondition.and(qTbUserHistory.actionType.eq("file_download"))

        val resultData = jpaQueryFactory
            .select(
                Projections.fields(
                    DownHistoryDto::class.java,
//                    qTbUserHistory.id,
                    qTbUserHistory.postId,
                    qTbUserHistory.postTitle,
                    qTbUserHistory.description,
                    qTbUserHistory.attachedFileId,
                    qTbUserHistory.attachedFileNm,
                    qTbUserHistory.actionType,
                    qTbUserHistory.menu1Id,
                    qTbUserHistory.menu2Id,
                    qTbUserHistory.menu1Nm,
                    qTbUserHistory.menu2Nm,
                    qTbUserHistory.createdAt,
//                    ExpressionUtils.`as`(subQuery1, "downCnt"),
                    qTbUserHistory.attachedFileId.count().`as` ("downCnt")
                ),
            )
            .distinct()
            .from(qTbUserHistory)
            .leftJoin(qTbUserMaster).on(qTbUserHistory.userId.eq(qTbUserMaster.userId))
            .where(whereCondition, qTbUserHistory.attachedFileId.isNotNull)
//            .join(qTbPostContent).on(qTbUserHistory.postId.eq(qTbPostContent.id))
            .orderBy(qTbUserHistory.createdAt.desc())
            .groupBy(qTbUserHistory.attachedFileId)
//            .groupBy(qTbUserHistory.postId, qTbUserHistory.attachedFileId)
            .fetch()

        return resultData
    }


    /**
     * 매칭 팀 권한그룹 조회
     * @param fullCode
     * @return
     */
    fun findMatchingTeamAuthGroup(fullCode: String): String? {
        val tbAuthGroupTeamMapp = QTbAuthGroupTeamMapp.tbAuthGroupTeamMapp
        val tbAuthGroup = QTbAuthGroup.tbAuthGroup

        return jpaQueryFactory
            .select(tbAuthGroup.groupNm)
            .from(tbAuthGroupTeamMapp)
            .leftJoin(tbAuthGroup).on(tbAuthGroupTeamMapp.authGroupCd.eq(tbAuthGroup.authGroupCd))
            .where(
                tbAuthGroupTeamMapp.teamId.eq(fullCode)
            )
            .fetchFirst()
    }


    /**
     * 통계 메인 엑셀 다운로드 (메인)
     * @param actionType
     * @param startDate
     * @param endDate
     * @return
     */

    fun downloadExcelStatisticsMainList(
        actionType: String?,
        startDate: String?,
        endDate: String?,
    ) : ResponseEntity<ByteArray> {

        require(!actionType.isNullOrBlank()) { "targetDate는 필수 값입니다." }
        require(!startDate.isNullOrBlank()) { "startDate는 필수 값입니다." }
        require(!endDate.isNullOrBlank()) { "endDate는 필수 값입니다." }

        val statisticsMainList = findStatisticList(actionType,startDate, endDate)

        return try {
            val byteArrayOutputStream = createExcelOutputStream(statisticsMainList, actionType)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-statistic_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }
    }


    /**
     * 엑셀 데이터 채우기
     */
    private fun createExcelOutputStream(params: List<StatisticMain>, actionType: String?): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")
            val type = when (actionType) {
                "login" -> "순 방문자 수"
                "post_view" -> "조회 수"
                "file_download" -> "다운로드 수"
                "subscribe" -> "구독 수"
                else -> "error"
            }

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("날짜")
            header.createCell(1).setCellValue(type)
            if(actionType == "login") header.createCell(2).setCellValue("총 방문자 수")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                row.createCell(0).setCellValue((param.targetDate?.toString() ?: ""))
                row.createCell(1).setCellValue((param.value?.toString() ?: ""))
                if(actionType == "login") row.createCell(2).setCellValue(param.totalVisitsCnt.toString() ?: "")
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }


    /**
     * 통계 상세 엑셀 다운로드 (방문자)
     *
     * @param targetDate
     * @return
     */

    fun downloadExcelStatisticLogin(
//        actionType: String?,
        targetDate: String?,
    ) : ResponseEntity<ByteArray> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }
        val statisticsSubList = findLoginList(targetDate)

        return try {
            val byteArrayOutputStream = createExcelLogin(statisticsSubList)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-statistic-login_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }


    }

    /**
     * 엑셀 데이터 채우기 (방문자)
     */

    private fun createExcelLogin(params: List<MemberInfo>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("ID")
            header.createCell(1).setCellValue("이름")
            header.createCell(2).setCellValue("이메일")
            header.createCell(3).setCellValue("전화번호")
            header.createCell(4).setCellValue("계정 활성화 여부")
            header.createCell(5).setCellValue("개인 권한 그룹")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                row.createCell(0).setCellValue(param.loginId ?: "")
                row.createCell(1).setCellValue(param.userNm ?: "")
                row.createCell(2).setCellValue(param.mailAddr ?: "")
                row.createCell(3).setCellValue(param.mobileNo ?: "")
                row.createCell(4).setCellValue(if (param.isActive == true) "활성화" else "비활성화")
                row.createCell(5).setCellValue(param.authGroupNm ?: "")

            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }


    /**
     * 통계 상세 엑셀 다운로드 (조회)
     *
     * @param targetDate
     * @return
     */

    fun downloadExcelStatisticPostView(
//        actionType: String?,
        targetDate: String?,
    ) : ResponseEntity<ByteArray> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }
        val statisticsSubList = findViewList(targetDate)

//        val statisticsSubList: List<*> = when (targetDate) {
//            "post_view" -> findViewList(targetDate)
//            "2" -> listOf<Any>()
//            "3" -> listOf<Any>()
//            else -> listOf<Any>()
//        }

        return try {
            val byteArrayOutputStream = createExcelPostView(statisticsSubList)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-statistic-pv_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }


    }

    /**
     * 엑셀 데이터 채우기 (조회)
     */

    private fun createExcelPostView(params: List<ViewHistoryDto>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("구분")
            header.createCell(1).setCellValue("카테고리")
            header.createCell(2).setCellValue("제목")
            header.createCell(3).setCellValue("조회수")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                row.createCell(0).setCellValue(param.postType ?: "")
                row.createCell(1).setCellValue((param.menu1Nm ?: "") + ">" + (param.menu2Nm ?: ""))
                row.createCell(2).setCellValue(param.postTitle ?: "")
                row.createCell(3).setCellValue((param.viewCnt?.toString() ?: ""))
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }


    /**
     * 통계 상세 엑셀 다운로드 (파일다운로드)
     *
     * @param targetDate
     * @return
     */

    fun downloadExcelStatisticDownload(
        targetDate: String?,
    ) : ResponseEntity<ByteArray> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }
        val statisticsSubList = findFileDownloadList(targetDate)

        return try {
            val byteArrayOutputStream = createExcelDownload(statisticsSubList)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-statistic-download_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }


    }

    /**
     * 엑셀 데이터 채우기 (파일다운로드)
     */

    private fun createExcelDownload(params: List<DownHistoryDto>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("카테고리")
            header.createCell(1).setCellValue("제목")
            header.createCell(2).setCellValue("파일명")
            header.createCell(3).setCellValue("다운로드 수")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                row.createCell(0).setCellValue((param.menu1Nm ?: "") + ">" + (param.menu2Nm ?: ""))
                row.createCell(1).setCellValue(param.postTitle ?: "")
                row.createCell(2).setCellValue(param.attachedFileNm ?: "")
                row.createCell(3).setCellValue((param.downCnt?.toString() ?: ""))
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }

    /**
     * 통계 상세 엑셀 다운로드 (구독)
     *
     * @param targetDate
     * @return
     */

    fun downloadExcelStatisticSubscribe(
        targetDate: String?,
    ) : ResponseEntity<ByteArray> {

        require(!targetDate.isNullOrBlank()) { "targetDate는 필수 값입니다." }
        val statisticsSubList = findSubscribeList(targetDate)

        return try {
            val byteArrayOutputStream = createExcelSubscribe(statisticsSubList)

            val currentDate = Helpers.formatLocalDateTime(LocalDateTime.now())

            val encodedFileName = URLEncoder.encode("cms-statistic-subscribe_$currentDate.xlsx", "UTF-8")
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_OCTET_STREAM
            headers.setContentDispositionFormData("attachment", encodedFileName)

            ResponseEntity(byteArrayOutputStream.toByteArray(), headers, 200)
        } catch (e: Exception) {
            logger.error("excel 생성중 에러", e)
            ResponseEntity.status(500).body("Internal Server Error".toByteArray())
        }


    }

    /**
     * 엑셀 데이터 채우기 (구독)
     */

    private fun createExcelSubscribe(params: List<SubScribeHistoryDto>): ByteArrayOutputStream {
        return WorkbookFactory.create(true).use {
            val sheet = it.createSheet("Sheet1")

            // 엑셀 Header 설정
            val header = sheet.createRow(0)
            header.createCell(0).setCellValue("카테고리")
            header.createCell(1).setCellValue("구독자")
            header.createCell(2).setCellValue("구독자수")

            // 엑셀 본문 설정
            for((idx, param) in params.withIndex()) {
                val row = sheet.createRow(idx + 1)
                val subscriberNames = param.subscriber?.mapNotNull { it.userName }?.toTypedArray()
                row.createCell(0).setCellValue((param.menu1Nm ?: "") + ">" + (param.menu2Nm ?: ""))
                row.createCell(1).setCellValue((subscriberNames ?: arrayOf()).contentToString())
                row.createCell(2).setCellValue(
                    (if (param.subscribeYn == true) "+" else if (param.subscribeYn == false) "-" else "?") +
                            (param.subscribeCnt?.toString() ?: "")
                )
            }
            
            val byteArrayOutputStream = ByteArrayOutputStream()
            it.write(byteArrayOutputStream)
            byteArrayOutputStream
        }
    }

    }

