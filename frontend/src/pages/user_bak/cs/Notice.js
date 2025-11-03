import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, App, Spin, Space, Typography } from 'antd';
import { CheckOutlined, FileOutlined, PushpinFilled } from "@ant-design/icons";
import Search from 'antd/es/input/Search';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { InnerDiv, StyledSearch, StyledNavLink } from "styles/StyledCommon";
import styled from "styled-components";


export const Notice = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg();

    const [data, setData] = useState([]); // 게시판 데이터
    const [loading, setLoading] = useState(false); // 로딩관련

    useEffect(() => {
        const fetchData = async () => {
            await getData(
                {
                    params:
                    {
                        pageNumber: Number(ofqs?.page ?? 1) - 1,
                        pageSize: ofqs?.size ?? 10,
                        openType: ofqs?.openType ?? [null],
                        keyword: ofqs?.keyword
                    }
                },
                '');
        }
        if (menu2 === 'notice') fetchData();
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

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, keyword: ofqs?.keyword })}`);
    };

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue.trim() })}`);
    }

    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '130px',
            // align: 'center',
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
                        <NavLink to={`/main/${menu1}/${menu2}/${record.id}`}>
                            <Flex gap={4}>
                                {record.noticeType ? <PushpinFilled style={{ color: '#EA1D22', fontSize: 11 }} /> : null}
                                <Typography.Text ellipsis={true}>{record.title}</Typography.Text>
                            </Flex>
                        </NavLink>
                    </>
                )
            }),
        },
        {
            title: '파일',
            dataIndex: 'attachedFileList',
            key: 'attachedFileList',
            width: '52px',
            // align: 'center',
            render: ((text, record) => {
                if (record?.attachedFileList?.length > 0) {
                    return (
                        <span>
                            <FileOutlined style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: 14, }} />
                        </span>
                    );
                } else {
                    return null;
                }
            }),
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            key: 'createUserNm',
            width: '90px',
            align: 'left',
        },
    ]

    const title = () => {
        return (
            <>
                <Typography.Title
                    style={{
                        fontSize: 24,
                        fontWeight: 500,
                        margin: 0,
                        color: 'rgba(0, 0, 0, 0.85)'
                    }}
                >{menu2?.toUpperCase()}</Typography.Title>
            </>
        );
    }

    const mindleLayout = () => {
        return (
            <>
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
                    pagination={{
                        current: Number(data?.number ?? 0) + 1,
                        pageSize: data?.size ?? 10,
                        total: data?.totalElements ?? 0,
                        position: ['bottomCenter'], //페이지 버튼 위치
                        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
                        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
                    }}

                    onRow={(record) => ({
                        style: {
                            background: record.noticeType && 'rgba(255, 247, 247, 1)',
                        }
                    })}
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
    & [class^="ant-typography"], & [class*=" ant-typography"]{font-size:14px}
    & table a {display:block;width:100%; text-align:left; color:rgba(0, 0, 0, 0.85); text-decoration: none !important;}
    & table a:hover{color:#EB2D2B;text-decoration: underline;}
    &.ant-table-wrapper .ant-table-tbody >tr >th,&.ant-table-wrapper .ant-table-tbody >tr >td{
        border-color: rgba(0, 0, 0, 0.06);
    }
`;