package com.tf.cms.biz.admin.category

import com.tf.cms.common.model.BizException
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.jpa.impl.JPAQueryFactory
import com.tf.cms.common.jpa.entity.*
import com.tf.cms.common.jpa.repository.*
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val jPAQueryFactory: JPAQueryFactory,
    private val menuIdHolder: MenuIdHolder,
    private val tbPostContentRepository: TbPostContentRepository,
    private val tbPostRecommendRepository: TbPostRecommendRepository,
    private val tbMenuRepository: TbMenuRepository,
    private val tbAuthGroupMenuMappRepository: TbAuthGroupMenuMappRepository,
    private val tbPostMetaFieldRepository: TbPostMetaFieldRepository,
) {
    private val logger = logger()

    companion object {
        private val openTypeCodes = listOf("private", "public", "temp")
    }

    /**
     * 카테고리 및 메뉴 조회
     *
     * @return
     */
    fun findCategoryList(): List<CategoryViewSaveParam> {
        val tbMenu = QTbMenu.tbMenu
        val menuEntities = jPAQueryFactory.selectFrom(tbMenu)
            .orderBy(tbMenu.parentMenuId.asc(), tbMenu.menuSeq.asc(), tbMenu.id.asc())
            .fetch()
        val list2 = menuEntities.map {
            val menu = it
            val result = CategoryViewSaveParam()
            result.let {
                it.id = menu.id
                it.contentType = menu.contentType
                it.link = menu.link
                it.linkType = menu.linkType
                it.enabled = menu.enabled
                it.menuNm = menu.menuNm
                it.menuSeq = menu.menuSeq
                it.path = menu.menuEngNm
                it.parentId = menu.parentMenuId
                it.description = menu.description
                it.title = menu.title
                it.subTitle = menu.subTitle
                it.imagePath = menu.imagePath
                it.postId = menu.postId
                it.staticYn = menu.staticYn
                it.postCategory = menu.postCategory
            }
            result
        }
        // 1차메뉴 바로 아래에 해당하는 2차메뉴가 들어가도록 조작
        val result = list2.filter { it.parentId==0 }
            .filter { it.contentType!="smartfinder" && it.contentType!="cscenter"  && it.contentType!="my" }
            .flatMap {
            val thisList = mutableListOf(it)
            val thisId = it.id
            thisList.addAll(list2.filter { it.parentId==thisId })
            thisList
        }
        return result
    }

    /**
     * 카테고리(메뉴)의 순서를 저장
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveCategoryMenuSeq(list: List<CategorySeqSaveParam>) {
        menuIdHolder.notifyMenuMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val now = LocalDateTime.now()
        var idx = 100
        list.forEach {
            val param = it
            tbMenuRepository.findById(param.id!!).ifPresent {
                val m = it
                m.menuSeq = idx++     // param.menuSeq
                m.modifiedAt = now
                m.modifiedUserNm = userInfo.name
                m.modifiedUserId = userInfo.id
                m.parentMenuId = param.parentId
                tbMenuRepository.save(m)
            }
        }
    }

    /**
     * 카테고리(메뉴) 한 건 삭제
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deleteCategory(id:Int) {
        menuIdHolder.notifyMenuMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        logger.warn { "=== category 삭제 (${id}) (${userInfo.name}" }
        tbMenuRepository.findById(id).ifPresent { tbMenu ->
            //tb_post_meta_field 삭제 2레벨기준 메뉴 레벨로만 삭제
            if (tbMenu.parentMenuId != 0) tbPostMetaFieldRepository.deleteByMenu2Id(id)
            //tb_menu 삭제
            tbMenuRepository.deleteById(id)
            // tb_auth_group_menu_mapp 삭제
            tbAuthGroupMenuMappRepository.deleteByMenuId(id)
        }
    }

    /**
     * 카테고리 한건 조회
     */
    fun getCategory(menuId: Int): CategoryViewSaveParam {
        val result = CategoryViewSaveParam()
        val tbMenu = tbMenuRepository.findById(menuId).orElseThrow { BizException("해당 메뉴가 존재하지 않음 (${menuId})") }
        val tbPostMetaFieldList = tbPostMetaFieldRepository.findByMenu1IdAndMenu2Id(tbMenu.parentMenuId!!, tbMenu.id!!)
        result.let {
            it.id = tbMenu.id
            it.contentType = tbMenu.contentType
            it.postCategory = tbMenu.postCategory
            it.link = tbMenu.link
            it.linkType = tbMenu.linkType
            it.enabled = tbMenu.enabled
            it.staticYn = tbMenu.staticYn
            it.menuNm = tbMenu.menuNm
            it.menuSeq = tbMenu.menuSeq
            it.path = tbMenu.menuEngNm
            it.parentId = tbMenu.parentMenuId
            it.description = tbMenu.description
            it.title = tbMenu.title
            it.subTitle = tbMenu.subTitle
            it.imagePath = tbMenu.imagePath
            it.postId = tbMenu.postId
            it.metaFieldInfo = tbPostMetaFieldList.map { field ->
                PostMetaFieldParam(
                    metaType = field.metaType,
                    groupCode = field.groupCode,
                    searchUseYn = field.searchUseYn,
                    metaNm = field.metaNm,
                    metaKey = field.metaKey
                )
            }
        }

        return result

    }

    /**
     * 카테고리 메뉴 한건 저장
     * id가 있고 없음으로 insert/update를 판단함.
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun saveCategory(saveParam: CategoryViewSaveParam) {
        menuIdHolder.notifyMenuMofified()
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        var menuEntity: TbMenu?  =null

        if (saveParam.id == null) {
            // insert
            val entity = saveParam.toEntity()
            // menuSeq가 없을때는 기존의 max+1로
            if(saveParam.menuSeq==null){
                if(saveParam.parentId==0){
                    val max = menuIdHolder.getAllMenus().filter { it.parentId == 0 }.map { it.menuSeq!! }.maxOrNull() ?: 0
                    entity.menuSeq = max+1
                }else{
                    val max = menuIdHolder.getAllMenus().filter { it.parentId == saveParam.parentId }.map { it.menuSeq!! }.maxOrNull() ?: 0
                    entity.menuSeq = max+1
                }
            }
            entity.createdAt = LocalDateTime.now()
            entity.createdUserNm = userInfo.name
            entity.createdUserId = userInfo.id
            menuEntity = tbMenuRepository.save(entity)

            saveParam.metaFieldInfo?.forEach {field ->
                TbPostMetaField().apply {
                    this.menu1Id = menuEntity.parentMenuId
                    this.menu2Id = menuEntity.id
                    this.metaType = field.metaType
                    this.metaDisplayOrder = field.metaDisplayOrder
                    this.searchUseYn = field.searchUseYn
                    this.groupCode = field.groupCode
                    this.metaNm = field.metaNm
                    this.metaKey = field.metaKey
                    this.createdAt  = LocalDateTime.now()
                    this.createdUserId = userInfo.id
                    this.createdUserNm = userInfo.name
                    tbPostMetaFieldRepository.save(this)
                }
            }


        } else {
            // update
            val foundOpt = tbMenuRepository.findById(saveParam.id!!)
            if (foundOpt.isPresent) {
                val entity = foundOpt.get()
//                menuId = entity.id
                entity.title = saveParam.title
                entity.subTitle = saveParam.subTitle
                entity.imagePath = saveParam.imagePath
                entity.contentType = saveParam.contentType
                entity.postCategory = saveParam.postCategory
                entity.enabled = saveParam.enabled
                entity.link = saveParam.link
                entity.linkType = saveParam.linkType
                entity.menuEngNm = saveParam.path
                entity.description = saveParam.description
                entity.menuNm = saveParam.menuNm
                entity.menuSeq = saveParam.menuSeq
                entity.modifiedAt = LocalDateTime.now()
                entity.modifiedUserNm = userInfo.name
                entity.modifiedUserId = userInfo.id
                tbMenuRepository.save(entity)

                if (entity.staticYn == false) {
                    //해당하는 포스트도 이동 해야한다.
                    val postList = tbPostContentRepository.findByMenu2Id(saveParam.id!!)
                    if (postList.isNotEmpty()) {
                        postList.forEach { post ->
                            post.postCategory = saveParam.postCategory
                            post.modifiedAt = LocalDateTime.now()
                            post.modifiedUserNm = userInfo.name
                            post.modifiedUserId = userInfo.id
                        }
                        tbPostContentRepository.saveAll(postList)
                    }

                    // 삭제
                    tbPostMetaFieldRepository.deleteByMenu1IdAndMenu2Id(saveParam.parentId!!, saveParam.id!!)
                    // 등록
                    saveParam.metaFieldInfo?.forEach { field ->
                        TbPostMetaField().apply {
                            this.menu1Id = saveParam.parentId
                            this.menu2Id = saveParam.id
                            this.metaType = field.metaType
                            this.groupCode = field.groupCode
                            this.metaDisplayOrder = field.metaDisplayOrder
                            this.searchUseYn = field.searchUseYn
                            this.metaNm = field.metaNm
                            this.metaKey = field.metaKey
                            this.createdAt = LocalDateTime.now()
                            this.createdUserId = userInfo.id
                            this.createdUserNm = userInfo.name
                            tbPostMetaFieldRepository.save(this)
                        }
                    }
                }
            } else {
                throw BizException("해당하는 메뉴/카테고리가 존재하지 않습니다. (${saveParam.id})")
            }
        }
    }

}