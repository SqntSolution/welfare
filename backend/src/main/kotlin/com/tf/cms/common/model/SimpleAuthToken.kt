package com.tf.cms.common.model

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

data class SimpleAuthToken(
    var theId: String,
    var theName: String,
    var theAuthorities: Collection<GrantedAuthority?>,
    var email: String? = null,
    var phone: String? = null,
    var teamCode: String? = null,
    var teamName: String? = null,
    var avatarImgPath: String? = null,
    var authGroup: List<String>? = null,
    var contentsManagerAuthMenuIds: List<Int>? = null,
    var authLevel: Int? = null,
    var jwtId: Int? = null,
) : UsernamePasswordAuthenticationToken(theId, theName, theAuthorities) {

    fun toUserInfo(): UserInfo = UserInfo().let {
        it.id = theId
        it.name = theName
        it.email = email
        it.phone = phone
        it.teamCode = teamCode
        it.teamName = teamName
        it.avatarImgPath = avatarImgPath
        it.role = TheRole.findCode(theAuthorities.first()?.authority)
        it.authGroup = authGroup
        it.contentsManagerAuthMenuIds = contentsManagerAuthMenuIds
        it.authLevel = authLevel
        return it
    }

    companion object {
        fun fromUserInfo(u: UserInfo): SimpleAuthToken {
            val roles = u.role?.let { listOf(SimpleGrantedAuthority(it.code)) } ?: listOf()

            return SimpleAuthToken(u.id!!, u.name!!, roles).apply {
                this.email = u.email
                this.phone = u.phone
                this.teamCode = u.teamCode
                this.teamName = u.teamName
                this.avatarImgPath = u.avatarImgPath
                this.authGroup = u.authGroup
                this.contentsManagerAuthMenuIds = u.contentsManagerAuthMenuIds
                this.authLevel = u.authLevel
            }
        }
    }

}

