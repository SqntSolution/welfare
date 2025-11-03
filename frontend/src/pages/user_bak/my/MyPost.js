import React, { useEffect, useState } from 'react';
import { Flex, Table, Divider, Select, Input, Button, ConfigProvider, Row, Col, Breadcrumb, App, Spin, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { ColTitle, InnerDiv } from 'styles/StyledCommon';
import styled from 'styled-components';


const { Option } = Select;

export const MyPost = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { error, info } = useMsg();
    const { menu1, menu2 } = useParams();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(); // 화면 데이터
    const [commoncode, setCommoncode] = useState(); // 셀렉트박스 공통코드


    useEffect(() => {
        const commonData = async () => {
            await getGroupCode('MYPOST_TYPE');
            await getData(
                {
                    params:
                    {
                        pageNumber: Number(ofqs?.page ?? 1) - 1,
                        pageSize: ofqs?.size ?? 10,
                        openType: ofqs?.openType,
                        keyword: ofqs?.keyword
                    }
                },
                '', '');
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
                        openType: ofqs?.openType,
                        keyword: ofqs?.keyword
                    }
                },
                '', '');
        }
        fetchData();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async (params, successCallback, errorCallback) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/my/post`, params)
            .then((resp) => {
                setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                if (errorCallback) errorCallback();
                setLoading(false);
            })
    };

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    };

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, keyword: ofqs?.keyword?.trim(), openType: ofqs?.openType })}`);
    };

    //샐렉트 박스 체인지 검색기능
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: ofqs?.keyword?.trim(), openType: name?.name })}`);
    }

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue.trim(), openType: ofqs?.openType })}`);
    }


    const columns = [
        {
            title: '기록 일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '200px',
        },
        {
            title: '카테고리',
            dataIndex: 'cateGory',
            key: 'cateGory',
            width: '200px',
            onCell: (() => ({
                style: { whiteSpace: 'nowrap' },
            })),
            render: ((text, record) => {
                return (
                    <span>{record.menuNm2 !== '' ? `${record.menuNm1} > ${record.menuNm2}` : `${record.menuNm1}`}</span>
                )
            }),
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            width: '540px',
            render: ((text, record) => {
                return (
                    <>
                        <NavLink
                            to={`/post/${record?.id}`}
                            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                        >
                            {record?.title}
                        </NavLink>
                    </>
                )
            }),
        },
        {
            title: 'View',
            dataIndex: 'viewCnt',
            key: 'viewCnt',
            width: '100px',
        },
        {
            title: '공개',
            dataIndex: 'openType',
            key: 'openType',
            width: '100px',
            render: ((text, record) => ({
                children: <span
                    style={{
                        color: `${record.openType === 'public' ? 'rgba(0, 0, 0, 0.85)' : record.openType === 'private' ? 'rgba(0, 0, 0, 0.45)' : '#D48806'}`
                    }}
                >
                    {record.openType === 'public' ? '공개' : record.openType === 'private' ? '비공개' : '임시저장'}
                </span>
                ,
            }))
        },
        {
            title: '수정',
            dataIndex: 'update',
            key: 'update',
            width: '100px',
            render: (((text, record) => {
                return (
                    <NavLink
                        to={`/post/edit/${record.id}`}
                    >
                        수정
                    </NavLink>
                )
            })),
        },
    ];


    return (
        <Spin spinning={loading}>
            <InnerDiv>
                <Row align={'middle'}>
                    <ColTitle
                        span={3}
                        style={{
                            fontSize: 16,
                            fontWeight: 500,
                            background: 'transparent',
                            border: 0,
                            textAlign: 'left',
                            paddingTop: 16,
                            paddingBottom: 16
                        }}
                    >
                        My Post
                    </ColTitle>
                    <Col span={21} align="right">
                        <span style={{ display: 'iline-block', color: 'rgba(0, 0, 0, 0.85)', marginRight: 8, fontSize: 14 }}>
                            공개 :
                        </span>
                        <Select style={{ width: 210, textAlign: 'left' }} onChange={handleChange} defaultValue='전체' >
                            <Option key='0' >전체</Option>
                            {commoncode?.map((option, index) => (
                                <Option key={option.code} value={option.label} name={option.code}>
                                </Option>
                            ))}
                        </Select>
                        <Search
                            placeholder="검색어를 입력하세요."
                            onSearch={onSearch}
                            style={{
                                width: '234px',
                                marginBottom: '20px',
                                marginLeft: 16
                            }}
                            allowClear='true'
                        />
                    </Col>
                </Row>
                <StyledTable
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={data?.content ?? []}
                    onChange={handleTableChange}
                    loading={loading}
                    size="small"
                    pagination={{
                        current: Number(data?.number ?? 0) + 1,
                        pageSize: data?.size ?? 10,
                        total: data?.totalElements ?? 0,
                        position: ['bottomCenter'], //페이지 버튼 위치
                        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
                        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
                    }}
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: 14
                    }}
                />
            </InnerDiv>
        </Spin>
    );
}


const StyledTable = styled(Table)`
&.ant-table-wrapper .ant-table.ant-table-small{font-size:14px; color: rgba(0, 0, 0, 0.85)}

&.ant-table-wrapper .ant-table.ant-table-small .ant-table-title,
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:12px}
`;