import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, Form, Spin, Space, Carousel, Popconfirm, Tag } from 'antd';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { CheckOutlined, FileOutlined } from "@ant-design/icons";
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import qs from 'qs';
import { TableCommon } from 'components/common/TableCommon'
import { CustomNavLinkButton, CustomTableButton } from "components/common/CustomComps";
import { StyledNavLink } from "styles/StyledCommon";



const { Option } = Select;

//관리자 게시판 메인

const AdminBannerList = (props) => {

    const location = useLocation();
    const navigate = useNavigate();

    const { menu1, menu2, id } = useParams();
    const { error, info } = useMsg();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        const fetchData = async () => {
            await onReload();
        }
        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            await onReload();
        }
        fetchData();
    }, [location.search]); // 주소 url 변경시 실행


    // 데이터 조회
    const onReload = async () => {
        await getData('get', null, {
            params:
            {
                pageNumber: Number(ofqs?.page ?? 1) - 1,
                pageSize: ofqs?.size ?? 10,
                // openType: ofqs?.openType
            }
        }, '');
    }

    //데이터 가져오는 기능 메인 bbs faq fna
    const getData = async (type, code1, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/banner${code1 == null ? '' : '/' + code1}`, params)
            .then((resp) => {
                setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
                if (type === 'delete') info('게시물이 삭제 되었습니다.');
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize })}`);
    };


    const columns = [
        {
            title: '표시 순서',
            dataIndex: 'displayOrder',
            width: "5%",
            key: 'displayOrder',
        },
        {
            title: '등록 일시',
            dataIndex: 'createdAt',
            width: "9%",
            key: 'createdAt',
            ellipsis: true,
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <StyledNavLink to={`${location.pathname}/edit/${record.id}`} state={{ readonly: false, state: 'update' }}>
                            {record.title ? text : '-'}
                        </StyledNavLink>
                    </>
                )
            }),
        },
        {
            title: '시작일',
            dataIndex: 'displayStartDate',
            width: "9%",
            key: 'createdAt',
            ellipsis: true,
        },
        {
            title: '종료일',
            dataIndex: 'displayEndDate',
            width: "9%",
            key: 'createdAt',
            ellipsis: true,
        },
        {
            title: '전마 전용',
            dataIndex: 'strategicMarketingOnly',
            width: "6%",
            key: 'strategicMarketingOnly',
            render: (text, record) => {
                return <Tag color={record.strategicMarketingOnly ? 'red' : 'rgba(255,255,255,0)'} >
                    {record.strategicMarketingOnly ? '전마' : ''}
                </Tag >;
            }
            // render: ((text, record) => {
            //     return (
            //         <span>
            //             {text ? <CheckOutlined /> : ''}
            //         </span>
            //     )
            // }),
        },
        {
            title: '공개',
            dataIndex: 'enabled',
            width: "6%",
            key: 'enabled',
            render: ((text, record) => {
                return (
                    <span style={{ color: record.enabled == true ? 'blue' : 'lightgray' }}>
                        {record.enabled ? <Tag color="purple">공개</Tag> : <Tag >비공개</Tag>}
                    </span>
                )
            }),
        },
        {
            title: '등록자',
            dataIndex: 'createdUserNm',
            key: 'createdUserNm',
            width: "6%",
            ellipsis: true,
        },
        // {
        //     title: '수정',
        //     dataIndex: 'No',
        //     width: "6%",
        //     key: 'No',
        //     render: ((text, record) => {
        //         return (
        //             <>
        //                 {/* <NavLink
        //                     style={{
        //                         color: 'blue',
        //                         // textDecoration: 'underline' 
        //                     }}
        //                     to={`${location.pathname}/edit/${record.id}`}
        //                     state={{ readonly: false, state: 'update' }}
        //                 // onClick={() => navigate(`${location.pathname}/edit/${record.id}`)}
        //                 >
        //                     수정
        //                 </NavLink> */}

        //                 <CustomNavLinkButton text={"수정"} to={`${location.pathname}/edit/${record.id}`} state={{ readonly: false, state: 'update' }} />
        //             </>
        //         )
        //     }),
        // },
        {
            title: '삭제',
            dataIndex: 'No',
            width: "6%",
            key: 'No',
            render: ((text, record) => {
                return (
                    <>
                        <Popconfirm
                            title='해당 게시물을 삭제 하시겠습니까?'
                            description=''
                            okText='삭제'
                            cancelText='취소'
                            onConfirm={() => getData('delete', record.id, { params: {} }, onReload)}
                        >
                            {/* <Button type=""
                                style={{ color: 'red' }}
                            >
                                삭제
                            </Button> */}
                            <CustomTableButton text={'삭제'} />
                        </Popconfirm>
                    </>
                )
            })
        },
    ];

    //getData('delete', id, { params: {} }, onReload)
    const getRowStyle = (record) => {
        return record.enabled == true ? { backgroundColor: 'lightblue' } : { backgroundColor: 'lightgray' };
    };


    const items = [
        { title: 'Home', },
        { title: `배너`, },
    ];


    const mindleLayout = () => {
        return (
            <>
                <Button type="primary" size="large" style={{ width: 114 }} onClick={() => navigate(`${location.pathname}/new`, { state: { readonly: false, state: 'new' } })}>추가</Button>
            </>
        );
    }


    return (
        <>
            <TableCommon
                data={data}
                columns={columns}
                loading={loading}
                handleTableChange={handleTableChange}
                mindleLayout={mindleLayout}
                title='Banner'
                items={items}
                getRowStyle={getRowStyle}
            />
        </>
    );
}

export default AdminBannerList;