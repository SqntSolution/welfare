package com.tf.cms.biz.user.search

interface SearchMapperDao {
    /**
     * Get search post
     *
     * @param params
     * @return
     */
    fun getSearchPost(params: SearchParam): MutableList<SearchPostResponseDto>

    /**
     * Get search post count
     *
     * @param params
     * @return
     */
    fun getSearchPostCount(params: SearchParam): Int
}