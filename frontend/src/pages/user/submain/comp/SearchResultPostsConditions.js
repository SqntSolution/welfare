/**
 * @file SearchResultPostsConditions.js
 * @description 서브메인의 필터 영역
 * @author 이병은
 * @since 2025-07-02 11:18
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-07-02 11:18    이병은       최초 생성
 **/

import { Select, Space } from 'antd';
import React, { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { SUBoardHeaderWrap, SUSearchInput } from 'styles/StyledUser';

export const SearchResultPostsConditions = ({ isShowFilter, filterOptions, searchCondition, setSearchCondition, onSearchTextChanged, onSearchSelectChanged }) => {
    return (
        <SUBoardHeaderWrap>
            <div></div>
            <SUSearchInput
                enterButton={<LuSearch className='input-icon' />}
                placeholder='검색어를 입력하세요'
                onSearch={(text) => onSearchTextChanged(text)}
                value={searchCondition?.keyword}
                onChange={(e) => setSearchCondition({ ...searchCondition, keyword: e.target.value })}
            />
        </SUBoardHeaderWrap>
    )
}