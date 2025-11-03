import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, Form, Spin, Space, Carousel, Popconfirm, Tag } from 'antd';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { CheckOutlined, FileOutlined } from "@ant-design/icons";
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import qs from 'qs';
import { TableCommon } from 'components/common/TableCommon'
import { StyledNavLink, StyledTableButton } from "styles/StyledCommon";

const { Option } = Select;

//관리자 게시판 메인

const AdminPopupList = (props) => {

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
            }
        }, '');
    }


    //데이터 가져오는 기능 메인 bbs faq fna
    const getData = async (type, code1, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/popup${code1 == null ? '' : '/' + code1}`, params)
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
            title: '등록 일시',
            dataIndex: 'createdAt',
            width: 100,
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
                        <StyledNavLink
                            style={{
                            }}
                            to={`${location.pathname}/edit/${record.id}`}
                            state={{ readonly: false, state: 'update' }}
                        >
                            {text}
                        </StyledNavLink>
                    </>
                )
            }),
            width: 300,
        },
        {
            title: '메뉴',
            dataIndex: 'menuNm',
            width: 100,
            key: 'menuNm',
            ellipsis: true,
        },
        {
            title: '시작일',
            dataIndex: 'displayStartDate',
            width: 70,
            // align: 'center',
            key: 'displayStartDate',
            ellipsis: true,
        },
        {
            title: '종료일',
            dataIndex: 'displayEndDate',
            width: 70,
            // align: 'center',
            key: 'displayEndDate',
            ellipsis: true,
        },
        {
            title: '공개',
            dataIndex: 'enabled',
            width: 60,
            key: 'enabled',
            render: ((text, record) => {
                return (
                    <>
                        <Tag color={text ? 'purple' : 'default'} >
                            {record.enabled ? '공개' : '비공개'}
                        </Tag>
                    </>
                )
            }),
        },
        {
            title: '등록자',
            dataIndex: 'createdUserNm',
            key: 'createdUserNm',
            width: 80,
            ellipsis: true,
        },
        // {
        //     title: '수정',
        //     dataIndex: 'No',
        //     width: 80,
        //     key: 'updete',
        //     
        //     render: ((text, record) => {
        //         return (
        //             <>
        //                 <NavLink
        //                     style={{
        //                         color: 'blue',
        //                     }}
        //                     to={`${location.pathname}/edit/${record.id}`}
        //                     state={{ readonly: false, state: 'update' }}
        //                 >
        //                     수정
        //                 </NavLink>
        //             </>
        //         )
        //     }),
        // },
        {
            title: '삭제',
            dataIndex: 'No',
            width: 50,
            key: 'delete',
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
                            <StyledTableButton type="link" danger>
                                삭제
                            </StyledTableButton>
                        </Popconfirm>
                    </>
                )
            })
        },
    ];


    const getRowStyle = (record) => {
        return record.enabled == true ? { backgroundColor: 'lightblue' } : { backgroundColor: 'lightgray' };
    };


    const items =
        [
            {
                title: 'Home',
            },
            {
                title: `팝업`,
            },
        ]


    const mindleLayout = () => {
        return (
            <>
                <Button type="primary" onClick={() => navigate(`${location.pathname}/new`, { state: { readonly: false, state: 'new' } })}>
                    추가
                </Button>
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
                title='Popup'
                items={items}
                getRowStyle={getRowStyle}
            />
        </>
    );
}

export default AdminPopupList;