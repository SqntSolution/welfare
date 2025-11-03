package com.tf.cms.common.jpa.entity

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import org.hibernate.Hibernate
import java.io.Serializable
import java.util.*


/**
 * packageName    : com.tf.cms.common.jpa.entity
 * fileName       : TbBoardItemFieldId
 * author         : 정상철
 * date           : 2025-06-20
 * description    : 복합 키 클래스 for TbBoardItemField
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-20        정상철       최초 생성
 */
@Embeddable
class TbBoardItemFieldId : Serializable {

    /**
     * 게시판 ID
     */
    @Column(name = "board_id", nullable = false)
    var boardId: Int? = null

    /**
     * item 키 (예: item1, item2 ...)
     */
    @Column(name = "item_key", nullable = false, length = 10)
    var itemKey: String? = null

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as TbBoardItemFieldId
        return boardId == other.boardId &&
                itemKey == other.itemKey
    }

    override fun hashCode(): Int = Objects.hash(boardId, itemKey)

    companion object {
        private const val serialVersionUID = 124578999L
    }
}