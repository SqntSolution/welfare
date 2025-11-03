import React, { useState, useEffect, useRef } from "react";
import { Modal, Select, Input, Radio, Space, List, Divider, Flex, Row, Button, Layout, Typography, Pagination, App, Form, Col, message, Card, Tag, Spin, Skeleton, Avatar } from "antd";
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { StarFilled, StarOutlined, HeartFilled, HeartOutlined, DownloadOutlined, LinkOutlined, SearchOutlined, CloseOutlined, FileTextOutlined, PaperClipOutlined } from "@ant-design/icons";
import { ColData, ColTitle } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { SearchCond } from "components/page/SearchCond";
import styled from "styled-components";
import { CustomNavLinkButton, CustomSearchInput, CustomTableButton } from "components/common/CustomComps";


export const SearchModal = (props) => {
    const { stateModal, setModal, keyword, setKeyword, afterClose } = props
    const { error, info } = useMsg();

    const searchRef = useRef();
    const location = useLocation();
    const [data, setData] = useState(); // 검색 데이터
    const [isSearch, setIsSearch] = useState(true); // 검색 여부 (보여주는 화면 변경)
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [ListKeyword, setListKeyword] = useState(''); // 검색어 관리
    const [bestKeyword, getbestKeyword] = useState(); //추천검색어
    const [search, setSearch] = useState(); // 검색히스토리
    const [KeyLength, setKeyLength] = useState(0);

    const [form] = Form.useForm();

    // 페이지 상태
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        initData();
    }, [location]);


    useEffect(() => {
        if (keyword === 'select') {
            const commonData = async () => {
                await getKeyword();
                await localStorageKeyWord();
            }
            commonData();
        }
    }, [keyword]);



    //추천검색어 호출
    const getKeyword = async () => {
        setIsLoading(true);
        await AXIOS.get(`/api/v1/user/search/recommend/keyword`)
            .then((resp) => {
                getbestKeyword(resp?.data);
                setIsLoading(false);
                searchRef.current.focus();
            })
            .catch((err) => {
                error(err);
                setIsLoading(false);
            })
    }

    //최근검색 히스토리 호출
    const searchHistory = async () => {
        if (localStorage?.getItem('recentSearches') === "undefined") localStorage.setItem('recentSearches', '[]');
        // 최근 검색어를 저장할 배열
        let recentSearches = [];
        // localStorage에서 최근 검색어 불러오기
        const storedSearches = localStorage?.getItem('recentSearches');
        // localStorage에 최근 검색어가 있으면 배열에 할당
        if (storedSearches) {
            recentSearches = JSON.parse(storedSearches);
        }
        // 새로운 검색어를 배열에 추가
        const newSearchTerm = form.getFieldValue('keyword')?.trim(); // 검색어 앞뒤의 공백 제거

        // 같은 값 추출
        const isDuplicate = recentSearches.some(item => item === newSearchTerm);

        if (newSearchTerm !== '' && !isDuplicate) { // 공백이 아닌 경우에만 최근 검색어에 추가 검색 히스토리에 값이 있다면 추가하지않음.
            recentSearches?.unshift(newSearchTerm);

            // 최근 검색어를 10개로 제한
            if (recentSearches.length > 10) {
                recentSearches?.pop();
            }

            // localStorage에 최근 검색어 저장
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            await localStorageKeyWord();
        } else {
            // info('검색어가 공백입니다. 무시됩니다.');
        }
    }


    // 로컬 스토리지에서 최근 검색어 호출
    const localStorageKeyWord = async () => {
        if (localStorage?.getItem('recentSearches') === "undefined") localStorage.setItem('recentSearches', '[]');
        const storedData = localStorage?.getItem('recentSearches') === "undefined" ? null : localStorage?.getItem('recentSearches');
        const filteredStoredData = JSON.parse(storedData)?.filter(item => {
            if (typeof item === 'string') {
                return item.trim() !== '';
            }
            return item != null;
        });

        localStorage.setItem('recentSearches', JSON.stringify(filteredStoredData));
        // const dataArray = storedData?.split(',').slice(1, -1).map(item => item.replace(/^"(.*)"$/, '$1'));

        // 빈값(null)을 걸러내는 과정
        const filteredSearch = JSON.parse(storedData)?.filter(item => {
            if (typeof item === 'string') {
                return item.trim() !== '';
            }
            return item != null;
        });
        setSearch(filteredSearch);

        const testData = []

        JSON.parse(storedData)?.forEach((item, index) => {
            testData[index]?.keyword(item);
        });

    }

    // 검색 이벤트
    const getData = (urlTag, pageNumber) => {
        setIsLoading(true);
        AXIOS.get(`/api/v1/user/search/${urlTag}`, { // post file
            params: {
                pageNumber: Number(pageNumber ?? 1) - 1,
                pageSize: pageSize,
                keyword: form.getFieldValue('keyword') ?? [],
                //.map(item => item.replace(/[@!\[\]]/g, ''));
            }
        })
            .then((resp) => {
                setData(resp?.data?.content);
                form.setFieldValue('totalElements', resp?.data?.totalElements); //총 갯수
                setPage(pageNumber); //검색시 페이징 1로 셋팅
                searchHistory();
                localStorageKeyWord();
                // info('검색이 완료 되었습니다.');
                setIsSearch(false);
                setIsLoading(false);
            })
            .catch((err) => {
                error(err);
                setIsLoading(false);
            });
    };

    //데이터 초기화
    const initData = () => {
        setModal(false); // 모달 창 클로우즈
        form.setFieldValue('keyword', ''); //걷색어 초기화
        setListKeyword('');// 검색 리스트 초기값
        setIsSearch(true); // 검색전 상태로 변경
        setKeyword('');
        setKeyLength(0);
        // if (searchRef.current) searchRef.current.focus();
    }

    const handleOk = () => {
        initData();
    };

    const handleCancel = () => {
        initData();
    };

    // 추천검색어 리스트 클릭
    const recommendClick = (keyword, value) => {
        form.setFieldsValue({ keyword: keyword });
        setListKeyword(keyword);
        // onSearch();
        getData(form.getFieldValue('postType'), 1);
    }

    //검색히스토리 리스트클릭
    const searchHistoryClick = (keyword, value) => {
        form.setFieldsValue({ keyword: keyword });
        setListKeyword(keyword);
        getData(form.getFieldValue('postType'), 1);
    }


    //검색히스토리 리스트삭제
    const searchHistoryDelete = (e, index) => {
        e.stopPropagation();
        const items = JSON.parse(localStorage?.getItem('recentSearches')) || [];
        items?.splice(index, 1);
        if (items) {
            localStorage?.setItem('recentSearches', JSON.stringify(items));
            setSearch(JSON.parse(JSON.stringify(items)));
        }
    }


    //샐렉트 박스 기능 엔터키로 호출
    const onSearchTextChanged = (value) => {
        // console.log('셀렉트박스 기능 엔터키로 호출', KeyLength);
        form.setFieldsValue({ keyword: value?.join(',').replace(/[@!\[\]]/g, '') });
        setListKeyword(value?.join(',').replace(/[@!\[\]]/g, ''));

        if (value?.length < KeyLength) {
            setKeyLength(value?.length);
            return
        } else {
            setKeyLength(value?.length);
        }

        if (form.getFieldValue('keyword')?.trim() !== '') {
            getData(form.getFieldValue('postType'), 1);
        }
    }

    //돋보기 검색 버튼 클릭
    const onClickText = (e) => {
        if (form.getFieldValue('keyword')?.trim() !== '') {
            getData(form.getFieldValue('postType'), 1);
        }
    }

    //토클버튼 클릭시 데이터 초기화
    const handleRadioChange = () => {
        const word = form.getFieldValue('keyword');
        if (data) setData();
        if (word?.trim() !== '' && typeof word !== 'undefined') {
            getData(form.getFieldValue('postType'), 1);
        }
    }


    return (
        <div>
            {contextHolder}
            <Form
                initialValues={{
                    postType: 'post' // 기본값으로 'post' 설정
                }}
                form={form}
                layout="horizontal"
            >
                <Modal
                    title="SEARCH"
                    width={'750px'}
                    open={stateModal}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okButtonProps={{
                        style: { display: 'none' }
                    }}
                    cancelButtonProps={{
                        style: { display: 'none' }
                    }}
                    style={{
                        fontSize: 24,
                        marginTop: '-14px',
                    }}
                    afterClose={afterClose}
                    className="search-modal"
                >
                    <Spin spinning={isLoading}>
                        {/* <img src="http://cosmax.remote/api/v1/view/image/2024/7a2d1417-0960-4cf4-b023-81f3f56750be.jpg" alt="favicon" /> */}
                        <Row>
                            <Col span={6}>
                                <Form.Item name='postType' style={{ marginBottom: 0, marginTop: 3 }}>
                                    <Radio.Group onChange={handleRadioChange}>
                                        <Radio value={'post'}>
                                            <span>Post</span>
                                        </Radio>
                                        <Radio value={'file'}>
                                            <span>File</span>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={18} >
                                <Form.Item name='keyword'>
                                    <CustomSearchInput>
                                        <Select
                                            mode="tags"
                                            style={{ width: 'calc(100% - 48px)', height: 40, borderRadius: '2px 0 0 2px' }}
                                            placeholder="검색어를 입력해주세요."
                                            onChange={onSearchTextChanged}
                                            ref={searchRef}
                                            tokenSeparators={[',']}
                                            options={[]}
                                            open={false}
                                            value={ListKeyword?.split(",")?.filter(elem => elem !== '')?.map(item => item.replace(/[@!\[\]]/g, ''))}
                                            allowClear
                                        />
                                        <Button
                                            // type="primary"
                                            type="primary"
                                            icon={<SearchOutlined />}
                                            // onClick={onSearch}
                                            onClick={onClickText}
                                            style={{ height: 40, right: 16 }}
                                        />
                                    </CustomSearchInput>
                                </Form.Item>
                            </Col>
                            {isSearch ?
                                <div style={{ width: '100%' }}>
                                    <Row style={{ width: '100%', textAlign: 'left' }}>
                                        <StyledColTitle span={12} name='name'>검색 히스토리</StyledColTitle>
                                        <StyledColTitle span={12} name='name'>추천 검색어 </StyledColTitle>
                                        {/* 검색 히스토리 */}
                                        <ColData span={12} style={{ border: 0 }}>
                                            <List
                                                style={{ width: '100%', height: '100%', border: 0 }} // file
                                                dataSource={search ?? []}
                                                renderItem={(item, index) => {

                                                    if (item !== null) {
                                                        return (
                                                            <List.Item key={index}>
                                                                <List.Item.Meta
                                                                    description={
                                                                        <StyledHistoryItem onClick={(e) => { recommendClick(item) }}>
                                                                            {item}
                                                                            <StyledCloseOutlined onClick={(e) => { searchHistoryDelete(e, index) }}
                                                                            // onMouseEnter={(e) => {e.stopPropagation(); clearTimeout(timer); e.target.style.color = 'black'; }}
                                                                            // onMouseLeave={(e) => { e.stopPropagation(); timer = setTimeout(() => { e.target.style.color = '';  }, 200); }}
                                                                            >
                                                                                <CloseOutlined />
                                                                            </StyledCloseOutlined>
                                                                        </StyledHistoryItem>
                                                                    }
                                                                />
                                                            </List.Item>
                                                        )
                                                    } else {
                                                        return null;
                                                    }
                                                }}
                                            />

                                        </ColData>
                                        {/* 추천 검색어 */}
                                        <ColData span={12} style={{ border: 0 }}>
                                            <List
                                                style={{ width: '100%', height: '100%', border: 0, fontSize: 14 }} // file
                                                dataSource={bestKeyword ?? []}
                                                renderItem={(item, index) => {
                                                    if (item !== null) {
                                                        return (
                                                            <List.Item key={item.seq}>
                                                                <List.Item.Meta
                                                                    description={
                                                                        <div key={item.seq} onClick={(e) => { searchHistoryClick(item.keyword) }} style={{ color: '#EB2D2B', padding: '0 12px' }}>
                                                                            {/* <NavLink>
                                                                            {item.keyword}
                                                                        </NavLink> */}
                                                                            <CustomTableButton text={item.keyword} />
                                                                        </div>
                                                                    } />
                                                            </List.Item>
                                                        )
                                                    } else {
                                                        return null;
                                                    }
                                                }}
                                            />
                                        </ColData>
                                    </Row>
                                </div>
                                :
                                <div style={{ width: '100%' }}>
                                    <SearchCond
                                        initData={initData}
                                        form={form}
                                        data={data}
                                        getData={getData}
                                        setData={setData}
                                        page={page}
                                        setPage={setPage}
                                        pageSize={pageSize}
                                        // loading={isLoading}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            }
                            <Form.Item name="totalElements" hidden />
                        </Row>
                    </Spin>
                </Modal>
            </Form>
        </div>
    );
};


const StyledColTitle = styled(ColTitle)`
    &{
        background: #FAFAFA; 
        font-size:14px; 
        font-weight:500; 
        color:rgba(0, 0, 0, 0.85);
        border:0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        position: relative;
        text-align: left;
        padding:0 12px;
    }
    & + &::after {
        content: '';
        display:block;
        width:1px;
        height:60%;
        background:rgba(0, 0, 0, 0.06);
        position:absolute; top:50%;left:-1px;transform: translateY(-50%);

    }
`;

const StyledSelect = styled(Select)`
&.ant-select .ant-select-selector{border-radius : 2px 0 0 2px; border-right-color:#fff;}
&.ant-select .ant-select-selector:hover{border-right-color:#EB2D2B}
& .ant-btn.ant-btn-icon-only{color: rgba(0, 0, 0, 0.85)}
& .ant-btn.ant-btn-icon-only:hover{color:#f75c54 !important;}

`;


const StyledHistoryItem = styled.div`
    display: inline-flex;
    border: 1px solid rgba(217, 217, 217, 1);
    border-radius: 2px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    background: #FAFAFA;
    color:rgba(0, 0, 0, 0.85);
    font-size:14px;
    padding: 1px 8px;
    gap:3px;
    cursor: pointer;

    .anticon-close{font-size: 10px;color:rgba(0, 0, 0, 0.45)}
`;


const StyledCloseOutlined = styled(CloseOutlined)`
    &:hover *{color: #000;font-weight: bold;}
`