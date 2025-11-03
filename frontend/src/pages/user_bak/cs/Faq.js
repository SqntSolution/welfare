import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, App, Spin, Typography, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { InnerDiv, StyledSearch, StyledNavLink } from "styles/StyledCommon";
import styled from "styled-components";

const { Option } = Select;

export const Faq = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();
    const { menu1, menu2 } = useParams();

    const [loading, setLoading] = useState(false); // 로딩관련
    const [data, setData] = useState(); // 게시판 데이터
    const [commoncode, setCommoncode] = useState(); // 공통 코드

    useEffect(() => {
        const commonData = async () => {
            await getGroupCode('FAQ_TYPE', setCommoncode);
        }
        commonData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getData(
                {
                    params:
                    {
                        pageNumber: Number(ofqs?.page ?? 1) - 1,
                        pageSize: ofqs?.size ?? 10,
                        metaDivision: ofqs?.metaDivision,
                        keyword: ofqs?.keyword
                    }
                },
                '');
        }
        if (menu2 === 'faq') fetchData();
        // searchRef.current.focus();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async (params, successCallback) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/bbs/${menu2}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type, setCommoncode) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    const columns = [
        {
            title: '구분',
            dataIndex: 'metaDivisionNm',
            key: 'metaDivisionNm',
            width: '80px',
            align: 'left',
            ellipsis: true,
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            width: '632px',
            align: 'left',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <NavLink to={`/main/${menu1}/${menu2}/${record.id}`} >
                            <Typography.Text ellipsis={true} style={{ minWidth: 0, fontSize: 14 }} >{record.title}</Typography.Text>
                        </NavLink>
                    </>
                )
            }),
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            key: 'createUserNm',
            width: '80px',
            align: 'left',
            ellipsis: true,
        },
    ]

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue?.trim(), metaDivision: ofqs?.metaDivision })}`);
    }

    //셀렉트박스 이벤트
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: ofqs?.keyword?.trim(), metaDivision: name?.name })}`);
    }

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, keyword: ofqs?.keyword?.trim(), metaDivision: ofqs?.metaDivision })}`);
    };

    const title = () => {
        return (
            <>
                <Typography.Title
                    style={{
                        fontSize: 24,
                        fontWeight: 500,
                        margin: 0,
                        color: 'rgba(0, 0, 0, 0.85)',
                    }}
                >{menu2?.toUpperCase()}</Typography.Title>
            </>
        );
    }

    const mindleLayout = () => {
        return (
            <>
                <Select defaultValue="전체" style={{ width: 120, height: 32, textAlign: 'left' }} onChange={handleChange}>
                    <Option key='0' value='전체' name={null}>전체</Option>
                    {commoncode?.map((option, index) => (
                        <Option key={option.code} value={option.label} name={option.code}>
                        </Option>
                    ))}
                </Select>

                <StyledSearch
                    placeholder="검색어를 입력하세요."
                    onSearch={onSearch}
                    allowClear='true'
                    ref={searchRef}
                />
            </>
        );
    }

    return (
        <InnerDiv>
            <Spin spinning={loading}>
                {/* <Flex justify="space-between" align="end">
                    {title()}
                </Flex>
                <Flex justify='right'>
                    <div style={{ marginBottom: 20 }}>
                        <Space direction="horizontal">
                            {mindleLayout()}
                        </Space>
                    </div>
                </Flex> */}
                <Row align={'middle'} style={{ height: 64 }}>
                    <Col span={12} style={{ padding: '16px 8px' }}>{title()} </Col>
                    <Col span={12} align="right">
                        <Space direction="horizontal">
                            {mindleLayout()}
                        </Space>
                    </Col>
                </Row>
                <StyledTable
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={data?.content ?? []}
                    onChange={handleTableChange}
                    // loading={loading}
                    style={{ fontSize: 14 }}
                    pagination={{
                        current: Number(data?.number ?? 0) + 1,
                        pageSize: data?.size ?? 10,
                        total: data?.totalElements ?? 0,
                        position: ['bottomCenter'], //페이지 버튼 위치
                        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
                        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
                    }}
                />
            </Spin>
        </InnerDiv>
    );
}





const StyledTable = styled(Table)`
    &.ant-table-wrapper .ant-table-thead >tr>th{font-weight:500;}
    &.ant-table-wrapper .ant-table-tbody >tr >th, 
    &.ant-table-wrapper .ant-table-tbody >tr >td{font-weight:400;}
    &.ant-table-wrapper .ant-table-thead >tr>th, 
    &.ant-table-wrapper .ant-table-thead >tr>td,
    &.ant-table-wrapper .ant-table-tbody >tr >th, 
    &.ant-table-wrapper .ant-table-tbody >tr >td{font-size: 14px;padding:12px;}
    & table a {display:block;width:100%; text-align:left; color:rgba(0, 0, 0, 0.85); text-decoration: none !important;}
    & table a:hover{color:#EB2D2B;text-decoration: underline;}
    &.ant-table-wrapper .ant-table-tbody >tr >th,&.ant-table-wrapper .ant-table-tbody >tr >td{
        border-color: rgba(0, 0, 0, 0.06);
    }
`;