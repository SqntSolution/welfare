// New Posts 목록
import { useEffect, useState } from 'react';
import { Pagination, Row, Col } from 'antd';

import { AXIOS } from 'utils/axios';
import { PostItemSmall } from 'components/page_bak/PostItemSmall';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { getMenuIdFromPath } from 'utils/menuHolder'
import qs from 'qs';
import { FileCardForm } from 'components/page_bak/FileCardForm';
import { useMsg } from 'hooks/helperHook';
import { InnerDiv } from 'styles/StyledCommon';
import { useUserInfo } from 'hooks/useUserInfo';
import { Submenu } from './Submenu';
import { useGetMenus } from 'hooks/helperHook';
import { SUGrid3Col } from 'styles/StyledUser';
import LoadingSpinner from 'components/common/LoadingSpinner';
import PostCardItem from 'components/user/PostCardItem';
import { SearchResultPostsConditions } from './SearchResultPostsConditions';
import { isEmptyCheck } from 'utils/helpers';

export const SearchResultPosts = (props) => {
    // const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const { menu1, menu2 } = useParams();
    const [searchCondition, setSearchCondition] = useState({ pageNumber: 0, pageSize: 20 });
    // const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [dummy, setDummy] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    const [isOpenNation, setIsOpenNation] = useState(false);
    const [isOpenTopic, setIsOpenTopic] = useState(false);
    const [isOpenRegisterDate, setIsOpenRegisterDate] = useState(false);
    const [isOpenDataType, setIsOpenDataType] = useState(false);
    const [bigView, setBigView] = useState(true); // 큰이미지로 볼지 여부
    const { error, info } = useMsg()
    const userInfo = useUserInfo()
    const mainMenus = useGetMenus()
    const [placeholderText, setPlaceholderText] = useState()
    const [current, setCurrent] = useState(1)
    const [filterOptions, setFilterOptions] = useState([]);

    useEffect(() => {
        // console.log("=== location.search  : ", location.search)
        // onSearch()
        restoreFromQueryStr();
        touch();
        getFilterOptions();
    }, [location]);

    useEffect(() => {
        restoreFromQueryStr();
        touch()
    }, []);

    useEffect(() => {
        if (mainMenus == null) {
            return
        }
        // 1차 메뉴
        const menuNm1 = (mainMenus ?? [])?.find(e => e?.menuEngNm == 'product')?.menuNm
        // 2차 메뉴
        const menuNm2 = (mainMenus ?? [])?.filter(e => e?.menuEngNm == 'product')?.flatMap(e => e?.menuChildren)?.find(e => e?.menuEngNm == menu2)?.menuNm
        let text = ""
        if (menuNm2 != null) {
            text = `[${menuNm1}] [${menuNm2}] 카테고리 내 검색 `
        } else {
            text = `[${menuNm1}] 카테고리 내 검색 `
        }
        setPlaceholderText(text)
    }, [mainMenus, menu2])

    const touch = () => {
        // console.log('=== touch ', searchCond);
        setDummy((old) => old + 1);
    };

    useEffect(() => {
        // console.log("=== useEffect-dummy : ", searchCond, dummy)
        if (dummy > 1) {
            onSearch()
        }
    }, [dummy]);

    const restoreFromQueryStr = () => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("=== restoreFromQueryStr : ", objFromQueryStr)
        const keys = ['keyword', 'pageNumber', 'pageSize', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'];
        let newObj = {};
        for (const k in objFromQueryStr) {
            if (keys.includes(k)) {
                newObj[k] = objFromQueryStr[k];
            } else {
                // console.log("=== 안 맞음 ", k)
            }
        }
        // console.log("=== restoreFromQueryStr 2 : ", newObj)
        // 페이지 사이즈는 기본이 20
        newObj.pageSize = newObj.pageSize ?? 12
        setSearchCondition(newObj);
    };

    const getFilterOptions = () => {
        AXIOS.get(`/api/v1/user/sub/meta-info-group/${menu1}${menu2 ? `/${menu2}` : ''}`)
            .then((resp) => {
                const data = resp?.data

                // searchUseYn이 true인 옵션들만 필터링하고, 각 옵션의 values 배열에 "전체" 옵션 추가
                const filteredData = data?.map(option => ({
                    ...option,
                    values: [
                        { label: '전체', value: '' },
                        ...option.values
                    ]
                }));

                setFilterOptions(filteredData);
            }).catch((err) => {
                console.log("=== getFilterOptions 에러 : ", err?.response);
                error(err)
            })
    }


    const onSearch = () => {
        setLoading(true);
        let param = {}
        param.menu1 = menu1
        param.menu2 = menu2
        // console.log("=== searchCondition 1000 : ", searchCondition)
        param = { ...param, ...searchCondition }
        let dataTypeCondition = 'post'
        if (searchCondition?.dataTypeCondition == 'file') {
            dataTypeCondition = 'file'
        }
        AXIOS.get(`/api/v1/user/sub/${dataTypeCondition}/search`, { params: param })
            .then((resp) => {
                const data = resp?.data
                setPosts(data.content ?? [])
                setSearchCondition({ ...searchCondition, pageNumber: (data?.pageable?.pageNumber ?? 1 - 1), pageSize: data?.pageable?.pageSize })
                setTotalCnt(data?.totalElements ?? 0)
                setCurrent(Number(data?.pageable?.pageNumber ?? 0) + 1)
            })
            .catch((err) => {
                console.log('=== onSearch 에러 : ', err?.response);
                // message.error(errorMsg(err), 3);
                error(err)
            })
            .finally(() => setLoading(false));
    };

    const onChange = (page) => {
        // setSearchCondition({...searchCondition, pageNumber:page})
        const newSearchCondition = {
            ...searchCondition,
            pageNumber: page - 1,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
        setCurrent(page);
    };

    const onChangeOrder = (e) => {
        const newSearchCondition = {
            ...searchCondition,
            order: e.target.value,
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    const onSearchTextChanged = (value) => {
        // console.log(`==== onSearchTextChanged `, value);
        //  (list?.join(',') ?? '')
        const newSearchCondition = {
            ...searchCondition,
            keyword: value,
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };


    const onSearchSelectChanged = (metaKey, value) => {
        // console.log(`==== onSearchTextChanged `, value);
        //  (list?.join(',') ?? '')
        const newSearchCondition = {
            ...searchCondition,
            [metaKey]: value,
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    //==== 검색조건

    return (
        <section>
            <LoadingSpinner loading={loading} />
            <Submenu />
            <SearchResultPostsConditions isShowFilter={!isEmptyCheck(menu2)} filterOptions={filterOptions} searchCondition={searchCondition} setSearchCondition={setSearchCondition} onSearchTextChanged={onSearchTextChanged} onSearchSelectChanged={onSearchSelectChanged} />
            <SUGrid3Col>
                {
                    searchCondition?.dataTypeCondition == 'file' ? (
                        <>
                            <FileCardForm data={posts} />
                        </>
                    ) : (
                        bigView ? (
                            posts?.map((elem, idx) => {
                                return (
                                    <div className='subTagPosition' key={`post-${elem.id}`}>
                                        {/* <PostItemBig {...elem} ></PostItemBig> */}

                                        <PostCardItem {...elem} />
                                    </div>
                                )
                            })

                        ) : (
                            posts?.map((elem, idx) => {
                                return (
                                    <div key={idx}>
                                        <PostItemSmall {...elem} ></PostItemSmall>
                                    </div>
                                )
                            })

                        )
                    )
                }
            </SUGrid3Col>
            {
                // 데이타가 없는 경우
                (posts?.length ?? 0) == 0 ? (
                    <InnerDiv>
                        <Row style={{
                            width: '100%',
                            // backgroundColor: '#cbffac',
                            height: 150,
                        }} justify='left' align='middle' gutter={[16, 16]}
                        >
                            <Col span={24} align='center'>데이터가 없습니다. </Col>
                        </Row>
                    </InnerDiv>
                ) : (
                    null
                )
            }

            <InnerDiv>
                <Row style={{
                    width: '100%',
                    marginTop: 48,
                    marginBottom: 72,
                }} justify='center' align='middle' gutter={[16, 16]}
                >
                    <Pagination defaultPageSize={20} defaultCurrent={1} total={totalCnt} showSizeChanger={false}
                        onChange={onChange} pageSize={searchCondition?.pageSize ?? 20}
                        current={current}
                    />
                </Row>
            </InnerDiv>
        </section>
    )
}

