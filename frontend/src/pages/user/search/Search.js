/**
 * @file Search.js
 * @description 통합검색 페이지
 * @author 김단아
 * @since 2025-06-25 16:23
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-25 16:23    김단아       최초 생성
 * 2025-06-26 13:53    이병은       검색 연동
 **/

import PostCardItem from 'components/user/PostCardItem';
import { useEffect, useState } from 'react';
import { LuChevronRight, LuSearch } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUGrid3Col, SUInner1280, SUSearchInput, SUSectionHeader, SUText24, SUText30, SUText36 } from 'styles/StyledUser';
import { AXIOS } from 'utils/axios';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMenuContext } from 'provider/MenuProvider';
import { useMsg } from 'hooks/helperHook';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { SComLinkBtn } from 'styles/StyledCommon';

const Search = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true })
    const { recommendedKeyword } = useMenuContext();
    const { info, error } = useMsg();
    const [title, setTitle] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        getData();
    }, [location])

    // URL의 keyword를 input에 설정
    useEffect(() => {
        if (ofqs.keyword) {
            const decodedKeyword = decodeURIComponent(ofqs.keyword);
            // title 즉시 설정
            setTitle(decodedKeyword);
            setSearchKeyword(decodedKeyword);
        }
    }, [ofqs.keyword])

    const getData = () => {
        setLoading(true);
        const param = {
            page: 0,
            size: 10,
            keyword: ofqs.keyword,
        }
        AXIOS.get(`/api/v1/user/search/post`, { params: param })
            .then((res) => {
                setPosts(res.data);
                setLoading(false);
                // API 성공 시에도 title 설정 (백업)
                setSearchKeyword(param.keyword);
                if (!title) {
                    setTitle(param.keyword);
                }
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    }

    const handleSearch = (value) => {
        const searchKeyword = encodeURIComponent(value?.trim());
        navigate(`/search?keyword=${searchKeyword}`);
    }

    const handleKeywordClick = (keyword) => {
        const searchKeyword = encodeURIComponent(keyword?.trim());
        navigate(`/search?keyword=${searchKeyword}`);
    }

    return (
        <SUInner1280>
            <LoadingSpinner loading={loading} />
            <SearchResultHeader>
                <SUText36>통합검색</SUText36>
                <SUSearchInput
                    enterButton={<LuSearch className='input-icon' />}
                    placeholder='검색어를 입력해 주세요'
                    onSearch={handleSearch}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <div className='search-keyword'>
                    {recommendedKeyword?.map((keyword, idx) => (
                        <span key={idx} onClick={() => handleKeywordClick(keyword)} style={{ cursor: 'pointer' }}>
                            #{keyword}
                        </span>
                    ))}
                </div>
            </SearchResultHeader>

            <SearchResultSection>
                {!loading && title && <SUText24 className='result-title'><span style={{ color: '#BB3A0B' }}>{title}</span> {posts?.length ? '에 대한 검색 결과입니다.' : '에 대한 검색 결과가 없습니다.'} </SUText24>}
                {posts?.length ?
                    posts.map((post, idx) => (
                        <div key={`main-${idx}`} className='result-wrap'>
                            {/* <SUText30 $weight={700} className='section-title'>{post?.menu1Nm}</SUText30> */}
                            {post?.children?.length &&
                                post.children.map((postChildren, index) => (
                                    <div key={`sub-${index}`} className='result-inner'>
                                        <div className='result-header'>
                                            <div className='title-inner'>
                                                <SUText24 $weight={600} >{post?.menu1Nm} <LuChevronRight /> {postChildren?.menu2Nm}</SUText24>
                                                <SComLinkBtn className="btn" size="small" >더보기</SComLinkBtn>
                                            </div>
                                            <p className='result-text'>
                                                총 <span>{postChildren.totalCnt}</span> 개의 게시글이 검색되었습니다.
                                            </p>
                                        </div>
                                        <SUGrid3Col>
                                            {postChildren?.posts?.length &&
                                                postChildren?.posts?.map((item, idx) => (
                                                    <PostCardItem key={`item-${idx}`} {...item} menuName2={item.menu2Nm} />
                                                ))
                                            }
                                        </SUGrid3Col>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                    : <></>
                }
            </SearchResultSection>
        </SUInner1280>
    )
}
export default Search;


const SearchResultSection = styled.section`
    font-size: 16px;
    margin-bottom: ${SFEm(64)};
    .result-title{
        /* margin-bottom: ${SFEm(24)}; */
        text-align: center;
    }
    .result-wrap + .result-wrap  {margin-top : ${SFEm(96)}}
    .section-title {text-align: center; margin-top: ${SFEm(45)}}
    .result-inner  + .result-inner{
        margin-top: ${SFEm(96)};
    }
    .result-header{
        margin-bottom: 1em;
        margin-top: 1em ;
        /* .text-24{margin-bottom: ${SFEm(0, 24)}} */
        .title-inner{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${SFEm(16)};
            .text-24{
                display: flex;
                align-items: center;
            }
            .btn{
                font-size: ${SFEm(13)};
            }
        }
        .result-text{
            font-size: 1em;
            color: #717680;
            span{
                font-weight: 600;
                color: #BB3A0B;
            }
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;

const SearchResultHeader = styled(SUSectionHeader)`
    text-align: center;
    .text-30{margin-bottom: ${SFEm(28, 30)}}
    .input-search{
        max-width: ${SFEm(380, 12)};
    }
    .ant-input-group-wrapper {
        margin: 0 auto;
    }
    .search-keyword{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: ${SFEm(8)};
        span{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            align-content: center;
            font-size: ${SFEm(12)};
            color: #414651;
            border: 1px solid #D5D7DA;
            border-radius: ${SFEm(6)};
            padding: 3px 6px;
            line-height: normal;
        }
    }
`;