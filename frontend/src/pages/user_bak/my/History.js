import React, { useState, useEffect, useRef } from 'react';
import { Table, Divider, Flex, Select, Button, Breadcrumb, Typography, Spin, Space, App, DatePicker, Descriptions, Row, Col } from 'antd';
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { ColTitle, InnerDiv } from 'styles/StyledCommon';
import styled from 'styled-components';
import { BookMarkFill, BookMarkLine } from 'components/common/IconComponets';

const { Option } = Select;

export const History = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { error, info } = useMsg();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [data, setData] = useState(); // historydata
    const [commoncode, setCommoncode] = useState(); //공통코드
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const commonData = async () => {
            await getGroupCode('HISTORY_TYPE');
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
                        typeCode: ofqs?.typeCode,
                    }
                },
                '', '');
        }
        fetchData();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async (params, successCallback, errorCallback) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/my/history`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                if (errorCallback) errorCallback();
                setLoading(false);
            });
    };

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/history/type`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, typeCode: ofqs?.typeCode })}`);
    };

    //샐렉트 박스 체인지 검색기능
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, typeCode: name?.name })}`);
    }

    const columns = [
        {
            title: '기록 일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            ellipsis: true,
        },
        {
            title: '항목',
            dataIndex: 'actionName',
            key: 'actionName',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '기록 내용',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => {
                const prefix = record?.actionType?.includes('qna_') ? `/main/cs-center/qna` : `/post`;
                return record?.postTitle ? (
                    <>
                        <NavLink to={`${prefix}/${record?.postId}`}>[{record?.postTitle}]</NavLink>
                        <span>&nbsp;&nbsp; {record.description}</span>
                    </>
                ) : (
                    record.description
                );
            },
            // render: ((text, record) => {
            //     return (
            //         record.description !== '' ?
            //             <>
            //                 <NavLink
            //                     to={`/post/${record.postId}`}
            //                 >
            //                     [{record.postTitle}]
            //                 </NavLink>
            //                 <span>
            //                     &nbsp;&nbsp; {record.description}
            //                 </span>
            //             </>
            //             :
            //             <> &nbsp;&nbsp; {record.description}</>
            //     )
            // }),
        },
    ]


    return (
        <Spin spinning={loading}>
            <InnerDiv>
                <Row align={'middle'}>
                    <ColTitle span={3}
                        style={{
                            fontSize: 16,
                            fontWeight: 500,
                            background: 'transparent',
                            border: 0,
                            textAlign: 'left',
                            paddingTop: 16,
                            paddingBottom: 16
                        }}
                    >History</ColTitle>
                    <Col span={21} align="right" >
                        <span style={{
                            display: 'iline-block',
                            color: 'rgba(0, 0, 0, 0.85)',
                            marginRight: 8,
                            fontSize: 14
                        }}>항목 :</span>
                        <Space direction="horizontality" >
                            <Select style={{ width: 210, textAlign: 'left', marginBottom: '20px', }} onChange={handleChange} defaultValue='전체'>
                                <Option key='0' >전체</Option>
                                {commoncode?.map((option, index) => (
                                    <Option key={option.value} value={option.label} name={option.value}>
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </Col>
                </Row>
                <StyledTable
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={data?.content ?? []}
                    onChange={handleTableChange}
                    loading={loading}
                    size='small'
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
};


const StyledTable = styled(Table)`
.BookmarkFill svg path {fill :#EB2D2B }
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


