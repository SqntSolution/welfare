// New Posts 목록
import { useEffect, useState } from 'react';
import { Space, Checkbox, Radio, Select, Button, Pagination, Row, Col, Popover } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, SearchOutlined, PaperClipOutlined, DownOutlined, UpOutlined, GlobalOutlined } from '@ant-design/icons';

import { AXIOS } from 'utils/axios';
import { PostItemBig } from 'components/page/PostItemBig';
import { PostItemSmall } from 'components/page/PostItemSmall';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { getMenuIdFromPath } from 'utils/menuHolder'
import { ConditionsNation, ConditionsTopic, ConditionsRegisterDate, ConditionsDataType } from './SearchResultPostsConditions';
import qs from 'qs';
import { FileCardForm } from 'components/page/FileCardForm';
import { useMsg } from 'hooks/helperHook';
import { CalendarLine, FillterLine } from 'components/common/IconComponets';
import { InnerDiv } from 'styles/StyledCommon';
import styled from 'styled-components';
import { useUserInfo } from 'hooks/useUserInfo';
import { Submenu } from './Submenu';
import { CustomSearchInput } from 'components/common/CustomComps';
import { useGetMenus } from 'hooks/helperHook';

export const SearchResultPosts = (props) => {
    // const [form] = Form.useForm();product
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

    useEffect(() => {
        // console.log("=== location.search  : ", location.search)
        // onSearch()
        restoreFromQueryStr();
        touch()
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
        const menuNm1 = (mainMenus ?? [])?.find(e => e?.menuEngNm == menu1)?.menuNm
        // 2차 메뉴
        const menuNm2 = (mainMenus ?? [])?.filter(e => e?.menuEngNm == menu1)?.flatMap(e => e?.menuChildren)?.find(e => e?.menuEngNm == menu2)?.menuNm
        let text = ""
        if (menuNm2 != null) {
            text = `[${menuNm1}] [${menuNm2}] 카테고리 내 검색 `
        } else {
            text = `[${menuNm1}] 카테고리 내 검색 `
        }
        setPlaceholderText(text)
    }, [mainMenus, menu1, menu2])

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
        const keys = ['nationConditions', 'topicConditions', 'startDateCondition', 'endDateCondition', 'strategicMarketingOnly', 'order', 'textCondition',
            'dataTypeCondition', 'fileTypeCondition', 'pageNumber', 'pageSize'];
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
        newObj.pageSize = newObj.pageSize ?? 20
        setSearchCondition(newObj);
    };


    const pageSizeOptions = [
        { value: '8', label: '8 개', },
        { value: '12', label: '12 개', },
        { value: '16', label: '16 개', },
        { value: '20', label: '20 개', },
        { value: '40', label: '40 개', },
    ]


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

    const onChangeStrategicMarketingOnly = (e) => {
        // setSmOnly(e.target.checked ? 'y' : null);
        const newSearchCondition = {
            ...searchCondition,
            strategicMarketingOnly: (e.target.checked ? 'y' : null),
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    const onChangeOrder = (e) => {
        const newSearchCondition = {
            ...searchCondition,
            order: e.target.value,
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    const onChangePagesize = (value) => {
        // console.log("== change pagesize : ", value)
        const newSearchCondition = {
            ...searchCondition,
            pageSize: value,
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    const onSearchTextChanged = (value) => {
        // console.log(`==== onSearchTextChanged `, value);
        //  (list?.join(',') ?? '')
        const newSearchCondition = {
            ...searchCondition,
            textCondition: value?.join(','),
            pageNumber: 0,
        };
        navigate(`${location.pathname}?${qs.stringify(newSearchCondition)}`);
    };

    //==== 검색조건

    return (
        <>
            <Row style={{
                width: '1240px',
                borderRadius: 0,
                margin: '0 auto'
            }} align='middle'>
                <Col span={17} align='left' >
                    <Submenu />
                </Col>
                <Col span={7} align="right" style={{ padding: "16px 0" }}>
                    <CustomSearchInput>
                        <Select
                            mode="tags"
                            style={{ width: "100%", border: 0, paddingRight: 40, textAlign: "left" }}
                            placeholder={placeholderText}
                            onChange={onSearchTextChanged}
                            tokenSeparators={[',', ' ']}
                            options={[]}
                            value={searchCondition?.textCondition?.split(",")?.filter(elem => elem !== '')}
                            allowClear
                            open={false}
                        >
                        </Select>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                        // loading={loading}
                        // onClick={onSearch}
                        />
                    </CustomSearchInput>
                </Col>
            </Row>
            <div style={{ width: '100%', height: 64, backgroundColor: '#FAFAFA', marginBottom: 72 }} >
                <Row style={{ width: 1240, height: '100%', margin: '0 auto' }} justify='center' align='middle' gutter={[0, 0]}>
                    <Col span={12} align="left" >
                        <Popover
                            content={<ConditionsNation />}
                            title={null}
                            placement="bottomLeft"
                            trigger="click"
                            open={isOpenNation}
                            arrow={false}
                            onOpenChange={open => setIsOpenNation(open)}
                        >
                            {/* <Button type="text" > 국가별 {<CaretDownFilled />}</Button> */}
                            <StyledFillterButton type="text" color={isOpenNation ? '#EB2D2B' : ''}><GlobalOutlined title="국가별" /> {isOpenNation ? <UpOutlined /> : <DownOutlined />}</StyledFillterButton>
                        </Popover>
                        <Popover
                            content={<ConditionsTopic />}
                            title={null}
                            placement="bottomLeft"
                            trigger="click"
                            open={isOpenTopic}
                            arrow={false}
                            onOpenChange={open => setIsOpenTopic(open)}
                        >
                            {/* <Button type="text" > 주제별 {<CaretDownFilled />}</Button> */}
                            <StyledFillterButton type="text" color={isOpenTopic ? '#EB2D2B' : ''}> <FillterLine title="주제별" /> {isOpenTopic ? <UpOutlined /> : <DownOutlined />} </StyledFillterButton>
                        </Popover>
                        <Popover
                            content={<ConditionsRegisterDate />}
                            title={null}
                            placement="bottomLeft"
                            trigger="click"
                            open={isOpenRegisterDate}
                            arrow={false}
                            onOpenChange={open => setIsOpenRegisterDate(open)}
                        >
                            {/* <Button type="text" > 등록일 {<CaretDownFilled />}</Button> */}
                            <StyledFillterButton type="text" color={isOpenRegisterDate ? '#EB2D2B' : ''} ><CalendarLine title="등록일" /> {isOpenRegisterDate ? <UpOutlined /> : <DownOutlined />}</StyledFillterButton>
                        </Popover>
                        <Popover
                            content={<ConditionsDataType />}
                            title={null}
                            placement="bottomLeft"
                            trigger="click"
                            open={isOpenDataType}
                            arrow={false}
                            onOpenChange={open => setIsOpenDataType(open)}
                        >
                            {/* <Button type="text" > 자료타입 {<CaretDownFilled />}</Button> */}
                            <StyledFillterButton type="text" color={isOpenDataType ? '#EB2D2B' : ''} > <PaperClipOutlined title='자료타입' /> {isOpenDataType ? <UpOutlined /> : <DownOutlined />}</StyledFillterButton>
                        </Popover>
                    </Col>
                    <Col span={12} align="right" >
                        <Space>
                            {
                                userInfo?.strategicMarketingGroupYn == true ? (
                                    <Checkbox checked={searchCondition?.strategicMarketingOnly == 'y'} onChange={onChangeStrategicMarketingOnly}>전략마케팅 전용</Checkbox>
                                ) : (
                                    null
                                )
                            }
                            <Radio.Group onChange={onChangeOrder} value={searchCondition?.order ?? 'new'}>
                                <Radio value='new'>최신순</Radio>
                                <Radio value='count'>조회수 높은순</Radio>
                            </Radio.Group>
                            <UnorderedListOutlined style={{ fontSize: '18px', color: (!bigView ? '#EB2D2B' : '#262626'), height: 32, }} onClick={() => setBigView(!bigView)} />
                            <AppstoreOutlined style={{ fontSize: '18px', color: (bigView ? '#EB2D2B' : '#262626'), height: 32, marginLeft: 16 }} onClick={() => setBigView(!bigView)} />
                            <Select options={pageSizeOptions} style={{ width: 72, height: 32, fontSize: 14, marginLeft: 24 }} defaultValue="20"
                                value={`${searchCondition?.pageSize}`} onChange={onChangePagesize} size='small'></Select>

                        </Space>

                    </Col>
                </Row>
            </div>
            <InnerDiv>
                <Row justify='left' align='middle' gutter={[24, 24]}>
                    {
                        searchCondition?.dataTypeCondition == 'file' ? (
                            <>
                                <FileCardForm data={posts} />
                            </>

                        ) : (
                            bigView ? (
                                posts?.map((elem, idx) => {
                                    return (
                                        <StyledPostItemBig span={6} className='subTagPosition'>
                                            <PostItemBig {...elem} ></PostItemBig>
                                        </StyledPostItemBig>
                                    )
                                })

                            ) : (
                                posts?.map((elem, idx) => {
                                    return (
                                        <Col span={12} >
                                            <PostItemSmall {...elem} ></PostItemSmall>
                                        </Col>
                                    )
                                })

                            )
                        )
                    }
                    {/* {
                            bigView ? (
                                posts?.map((elem, idx) => {
                                    return (
                                        <Col span={6} >
                                            <PostItemBig {...elem} ></PostItemBig>
                                        </Col>
                                    )
                                })

                            ) : (
                                posts?.map((elem, idx) => {
                                    return (
                                        <Col span={12} >
                                            <PostItemSmall {...elem} ></PostItemSmall>
                                        </Col>
                                    )
                                })

                            )
                        } */}
                </Row>
            </InnerDiv>
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
        </>
    )
}


const StyledFillterButton = styled(Button)`
    &{
        padding:0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        gap: 7px;
        margin-inline-end: 16px;
        color: #262626;
    }

    &.ant-btn-text:not(:disabled):not(.ant-btn-disabled):hover{background : transparent;}

    & > span:not([role='img']){display:none;}
    &&& .anticon{margin-inline-start:0;padding:0;}
    .anticon.anticon-paper-clip{
        font-size: 15px;
    }
    .anticon:is(.anticon-down,.anticon-up){font-size: 10px;}
    &&& .anticon{color:  ${props => props.color ? '#EB2D2B' : '#262626'}}
    svg path{fill:${props => props.color ? '#EB2D2B' : '#262626'} }
`;

const StyledPostItemBig = styled(Col)`
    &&& .tagPosition {bottom: auto !important; }
    &&& .ant-ribbon-corner{opacity: 1;}
    `;