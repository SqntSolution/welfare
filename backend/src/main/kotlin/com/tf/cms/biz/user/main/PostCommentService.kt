package com.tf.cms.biz.user.main

import com.tf.cms.biz.common.RoleAndMenuComponent
import com.tf.cms.biz.common.ms.MsTeamsEventBroker
import com.tf.cms.biz.common.ms.MsTeamsEventType
import com.tf.cms.common.jpa.entity.QTbPostComment
import com.tf.cms.common.jpa.entity.QTbUser
import com.tf.cms.common.jpa.entity.TbPostComment
import com.tf.cms.common.jpa.entity.TbUserHistory
import com.tf.cms.common.jpa.repository.TbPostCommentRepository
import com.tf.cms.common.jpa.repository.TbPostContentRepository
import com.tf.cms.common.jpa.repository.TbUserHistoryRepository
import com.tf.cms.common.model.BizException
import com.tf.cms.common.model.UserHistoryActionType
import com.tf.cms.common.utils.MenuIdHolder
import com.tf.cms.common.utils.UserInfoHelper
import com.tf.cms.common.utils.logger
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import jakarta.transaction.Transactional
import java.time.LocalDateTime
import org.springframework.stereotype.Component
import kotlin.jvm.optionals.getOrNull

data class PostCommentDto(
    var id: Int? = null,
    var contents: String? = null,
    var commentsSeq: Int? = null,
    var commentsLevel: Short? = null,
    var deleted: Boolean? = false,
    var userNm: String? = null,
    var userId: String? = null,
    var postId: Int? = null,
    var nickname: String? = null,
    var createdAt: LocalDateTime? = null,
    var createdUserId: String? = null,
    var createdUserNm: String? = null,
    var modifiedAt: LocalDateTime? = null,
    var modifiedUserId: String? = null,
    var modifiedUserNm: String? = null,
    var avatarImgPath: String? = null,
)

@Component
class PostCommentService(
    private val roleAndMenuComponent: RoleAndMenuComponent,
    private val jpaQueryFactory: JPAQueryFactory,
    private val tbPostCommentRepository: TbPostCommentRepository,
    private val tbPostContentRepository: TbPostContentRepository,
    private val menuIdHolder: MenuIdHolder,
    private val tbUserHistoryRepository: TbUserHistoryRepository,
    private val msTeamsEventBroker: MsTeamsEventBroker,
    ) {
    private val logger = logger()

    /**
     * 한개의 Post에 대한 댓글(comment) 목록을 리턴.
     */
    fun getPostComments(authGroupCds: List<String>?, postId: Int): MutableList<PostCommentDto>? {

        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val tbPostComment = QTbPostComment.tbPostComment
        val tbUser = QTbUser.tbUser

        val result = jpaQueryFactory.select(
            Projections.fields(
                PostCommentDto::class.java,
                tbPostComment.id,
                tbPostComment.postId,
                tbPostComment.contents,
                tbPostComment.commentsSeq,
                tbPostComment.commentsLevel,
                tbPostComment.deleted,
                tbPostComment.userId,
                tbPostComment.userNm,
                tbPostComment.createdAt,
                tbUser.avatarImgPath,
            )
        )
            .from(tbPostComment)
            .where(tbPostComment.postId.eq(postId))
            .leftJoin(tbUser).on(tbPostComment.userId.eq(tbUser.userId))
            .orderBy(tbPostComment.commentsSeq.asc())
            .fetch()

        result.forEach {
            // 삭제된건 처리
            if (it.deleted == true) {
                it.contents = "삭제된 건입니다."
            }
        }

        return result
    }

    /**
     * 댓글 한개 입력.
     * (origSeq가 0이면 root 댓글을 입력하는 것이고, 1000 이런 것이면 1000번에 대한 댓글이다.)
     * root댓글은 1000 단위로 증가한다.
     * root댓글에 대한 댓글은 1000 사이에 있는 값으로 증가한다.
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun insertPostComment(authGroupCds: List<String>?, postId: Int, origSeq: Int, comment: String) {
        // Post에 대해 접근가능 권한 체크
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val userInfo = UserInfoHelper.getLoginUserInfo()!!

        if (origSeq <= 0) {
            // root 댓글 입력
            val tbPostComment = QTbPostComment.tbPostComment
            val maxSeq = jpaQueryFactory.select(tbPostComment.commentsSeq.max())
                .from(tbPostComment).where(tbPostComment.postId.eq(postId)).fetchFirst() ?: 0
            TbPostComment().let {
                it.contents = comment
                // seq는 maxSeq보다 큰 것중에 1000 단위인 것
                val newSeq = (maxSeq / 1000 + 1) * 1000
                it.commentsSeq = newSeq
                it.commentsLevel = 1
                it.deleted = false
                it.postId = postId
                it.userNm = userInfo.name
                it.userId = userInfo.id
                it.createdUserNm = userInfo.name
                it.createdUserId = userInfo.id
                it.createdAt = LocalDateTime.now()
                tbPostCommentRepository.save(it)
            }

        } else {
            // root 댓글에 대한 댓글
            // origSeq가 3000 이라고 하면, 4000보다 작은 값 중에서 max+1의 값이 seq가 됨.
            if (origSeq % 1000 != 0) {
                throw BizException("원 댓글의 seq가 유효하지 않음.")
            }
            val tbPostComment = QTbPostComment.tbPostComment
            val maxSeq = jpaQueryFactory.select(tbPostComment.commentsSeq.max())
                .from(tbPostComment)
                .where(tbPostComment.postId.eq(postId))
                .where(tbPostComment.commentsSeq.lt(origSeq + 1000))
                .fetchFirst() ?: throw BizException("원 댓글이 존재하지 않음.")

            val newCommentId = TbPostComment().let {
                it.contents = comment
                // seq는 maxSeq보다 1큰거
                val newSeq = maxSeq + 1
                it.commentsSeq = newSeq
                it.commentsLevel = 2
                it.deleted = false
                it.postId = postId
                it.userNm = userInfo.name
                it.userId = userInfo.id
                it.createdUserNm = userInfo.name
                it.createdUserId = userInfo.id
                it.createdAt = LocalDateTime.now()
                tbPostCommentRepository.save(it)?.id!!
            }

            // teamviewer 알림
            msTeamsEventBroker.publishEvent(MsTeamsEventType.CommentOnComment, newCommentId)

        }

        val post = tbPostContentRepository.findById(postId).getOrNull() ?: throw BizException("Post가 존재하지 않음.")

        // history에 insert
        TbUserHistory().let {
            it.postId = postId
            it.userId = userInfo.id
            it.postTitle = post.title
            it.description = "Post에 댓글을 등록했습니다."
            it.actionType = UserHistoryActionType.comment.name
            it.userName = userInfo.name
            it.menu1Id = post.menu1Id
            it.menu1Nm = menuIdHolder.getMenuNmFromId(post.menu1Id)
            it.menu2Id = post.menu2Id
            it.menu2Nm = menuIdHolder.getMenuNmFromId(post.menu2Id)
            it.createdAt = LocalDateTime.now()
            tbUserHistoryRepository.save(it)
        }
    }

    /**
     * 댓글 한개 삭제
     */
    @Transactional(rollbackOn = [Throwable::class])
    fun deletePostComment(authGroupCds: List<String>?, commentId: Int) {
        // 삭제권한 체크
        val userInfo = UserInfoHelper.getLoginUserInfo()!!
        val entity = tbPostCommentRepository.findById(commentId).orElseGet { throw BizException("해당 댓글이 존재하지 않습니다.") }
        val postId = entity.postId!!
        if (userInfo.id != entity.userId) {
            throw BizException("삭제 권한이 없습니다. (${userInfo.id}) (${entity.userId})")
        }
        roleAndMenuComponent.canAccessToPostByAuthgroupsThrowException(authGroupCds!!, postId)

        val commentsSeq = entity.commentsSeq!!
        if (commentsSeq % 1000 > 0) {
            // 딸린 댓글이 없으면 기냥 삭제. 딸린 댓글이 있다면, 삭제 flag
            tbPostCommentRepository.delete(entity)

        } else {
            val tbPostComment = QTbPostComment.tbPostComment
            val count = jpaQueryFactory.select(tbPostComment.count())
                .from(tbPostComment)
                .where(tbPostComment.postId.eq(postId))
                .where(tbPostComment.commentsSeq.between(commentsSeq + 1, commentsSeq + 999))
                .fetchFirst().toInt()
            if (count == 0) {
                // 딸린 댓글이 없으므로 기냥 삭제
                tbPostCommentRepository.delete(entity)
            } else {
                // 딸린 댓글이 있으므로, 삭제 flag
                entity.deleted = true
                entity.contents = null
                entity.modifiedAt = LocalDateTime.now()
                entity.modifiedUserId = userInfo.id
                entity.modifiedUserId = userInfo.name
            }
        }


    }
}