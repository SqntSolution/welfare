/**
 * @file AutoCompleteInput.js
 * @description 헤더 검색 인풋 박스
 * @author 김단아
 * @since 2025-05-28 16:07
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 16:07    김단아       최초 생성
 * 2025-06-26 13:53    이병은       검색기능 추가
 **/

import { AutoComplete, Flex, Input, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { LuSearch } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AutoCompleteInput = ({ recommendedKeywords }) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [key, setKey] = useState(0); // 강제 리렌더링을 위한 key

    // 검색창 자동완성 타이틀 컴포넌트
    const AutoCompleteTitle = props => (
        <Flex align="center" justify="space-between">
            {props.title}
            {/* <a href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
                more
            </a> */}
        </Flex>
    );

    // 검색창 자동완성 태그
    const autoCompleteRenderItem = (title, count) => ({
        value: title,
        label: (
            <Flex align="center" justify="space-between" >
                # {title}
            </Flex>
        ),
    });

    const handleSearch = (value) => {
        const searchKeyword = encodeURIComponent(value?.trim());
        navigate(`/search?keyword=${searchKeyword}`);
        
        // key를 변경하여 AutoComplete를 강제로 리렌더링
        setTimeout(() => {
            setKey(prev => prev + 1);
        }, 50);
    }

    const onSelect = (value) => {
        const searchKeyword = encodeURIComponent(value?.trim());
        navigate(`/search?keyword=${searchKeyword}`);

        // key를 변경하여 AutoComplete를 강제로 리렌더링
        setTimeout(() => {
            setKey(prev => prev + 1);
        }, 50);
    }

    // 검색창 자동완성 옵션
    const aotoCompleteOptions = [
        {
            label: <AutoCompleteTitle title="추천검색어" />,
            options: recommendedKeywords?.map(keyword => autoCompleteRenderItem(keyword)),
        },
    ];
    return (
        <InputStyle>
            <AutoComplete
                key={key}
                className={{ popup: { root: 'header-search-autoConplete' } }}
                options={aotoCompleteOptions}
                onSelect={onSelect}
            >
                <Input.Search onSearch={handleSearch} size='large' placeholder="검색어를 입력해주세요." prefix={<LuSearch className='input-icon' />} suffix={null} ref={inputRef} />
            </AutoComplete>
        </InputStyle>
    );
}

export default AutoCompleteInput;

const InputStyle = styled.div`
&{width : 100%}
  &:focus-within{
        .ant-input-outlined{
            background-color: #fff;
        }
        input::placeholder{
            color: #ddd;
        }
    }
    .ant-input-group-addon{
        display: none;
    }
    .ant-select-single .ant-select-selector{
        border-radius: 8px;
        overflow: hidden;
    }

    && .ant-input-affix-wrapper:not(:last-child){
        border-start-end-radius:  8px;
        border-end-end-radius: 8px;
    }
    input::placeholder{
        color: #181D27;
    }
    .input-icon{
        font-size: 20px;
    }

`;




