import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, Spin, Space, Breadcrumb, Typography, Popconfirm, Form, Tag } from 'antd';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { TableCommon } from "components/common/TableCommon";
import { CheckOutlined, FileOutlined } from "@ant-design/icons";
import qs from 'qs';
import { CustomNavLinkButton, CustomTableButton } from "components/common/CustomComps";
import { StyledNavLink } from "styles/StyledCommon";

const { Option } = Select;

//관리자 보도자료 메인

const AdminRelease = (props) => {

    const location = useLocation();
    const navigate = useNavigate();

    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commoncode, setCommoncode] = useState(); // 공통 코드

    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });


    useEffect(() => {
        const commomData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode, setLoading);
            await onReload();
        }
        commomData();
    }, []); //화면 첫 호출시 실행

    useEffect(() => {
        const fetchData = async () => {
            await onReload();
        }
        fetchData();
    }, [location.search]); // 주소 url 변경시 실행


    // 데이터 조회
    const onReload = async () => {
        await getData('get', 'bbs', 'release', {
            params:
            {
                pageNumber: Number(ofqs?.page ?? 1) - 1,
                pageSize: ofqs?.size ?? 10,
                openType: ofqs?.openType
            }
        }, '');
    }

    //공통코드 호출
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type, setCommoncode, setLoading) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };

    //데이터 가져오는 기능 메인 bbs faq fna
    const getData = async (type, code1, code2, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/${code1}${code2 == null ? '' : '/' + code2}`, params)
            .then((resp) => {
                setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
                if (type === 'delete') info('게시물이 삭제 되었습니다.');
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };


    //공개 여부 선택
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ page: ofqs?.current, size: ofqs?.pageSize ?? 10, openType: name?.name })}`);
    }

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, openType: ofqs?.openType })}`);
    };

    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            width: "10%",
            key: 'createdAt',
            ellipsis: true,
        },
        {
            title: '제목',
            dataIndex: 'title',
            // width: 180,
            key: 'title',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <StyledNavLink
                            to={`${location.pathname}/${record.id}`}
                            state={{ readonly: false, newyn: 'update' }}
                        >
                            {text}
                        </StyledNavLink>
                    </>
                )
            }),
        },
        {
            title: '공지유형',
            dataIndex: 'noticeType',
            key: 'noticeType',
            width: "7%",

            render: ((text, record) => {
                return (
                    <>
                        <Tag color={text ? 'green' : 'default'} >
                            {record.noticeType === 0 ? '일반' : record.noticeType === 1 ? '중요' : ''}
                        </Tag>
                    </>
                )
            }),
        },
        // {
        //     title: '',
        //     dataIndex: '',
        //     width: "8%",
        //     key: '',

        //     render: (text, record) => {
        //         return <Tag color={record.text ? 'red' : 'rgba(255,255,255,0)'} >
        //             {record.text ? '태그' : ''}
        //         </Tag >;
        //     }
        //     // render: ((text, record) => {
        //     //     return (
        //     //         <span>
        //     //             {text ? <CheckOutlined /> : ''}
        //     //         </span>
        //     //     )
        //     // }),
        // },
        {
            title: '파일',
            dataIndex: 'attachedFileList',
            width: "8%",
            key: 'attachedFileList',
            render: ((text, record) => {
                if (record?.attachedFileList?.length > 0) {
                    return (
                        <span>
                            <FileOutlined />
                        </span>
                    );
                } else {
                    return null;
                }
            }),
        },
        {
            title: '조회수',
            dataIndex: 'viewCnt',
            width: "8%",
            key: 'viewCnt',
        },
        {
            title: '공개',
            dataIndex: 'opened',
            width: "7%",
            key: 'opened',
            render: ((text, record) => {
                return (
                    <Tag color={text ? 'purple' : 'default'} >
                        {text ? '공개' : '비공개'}
                    </Tag>
                )
            }),
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            width: "10%",
            key: 'createUserNm',
        },
        // {
        //     title: '업데이트',
        //     dataIndex: 'update',
        //     width: "8%",
        //     key: 'update',
        //     render: ((text, record) => {
        //         return (
        //             <>
        //                 {/* <NavLink
        //                     style={{
        //                         // color: 'blue', 
        //                     }}

        //                     state={{ readonly: false, newyn: 'update' }}
        //                 >
        //                     <Button type="link" >수정</Button>
        //                 </NavLink> */}
        //                 <CustomNavLinkButton
        //                     to={`${location.pathname}/${record.id}`}
        //                     state={{ readonly: false, newyn: 'update' }}
        //                     text={'수정'}
        //                 />
        //             </>
        //         )
        //     }),
        // },
        {
            title: '삭제',
            dataIndex: 'delete',
            width: "6%",
            key: 'delete',
            align: 'left',
            render: ((text, record) => {
                return (
                    <>
                        <Popconfirm
                            title='해당 게시물을 삭제 하시겠습니까?'
                            description=''
                            okText='삭제'
                            cancelText='취소'
                            onConfirm={() => getData('delete', 'bbs', record.id, { params: {} }, onReload)}
                        >
                            {/* <Button type="" style={{ color: 'red' }}>
                                삭제
                            </Button> */}
                            <CustomTableButton text={"삭제"} />
                        </Popconfirm>
                    </>
                )
            }),
        },

    ]

    const items =
        [
            {
                title: 'Home',
            },
            {
                title: `고객센터`,
            },
            {
                title: `보도자료`,
            },
        ]

    const mindleLayout = () => {
        return (
            <>
                <Form.Item label="공개" labelStyle={{ fontSize: '40px' }}>
                    <Select style={{ width: 120 }} onChange={handleChange} defaultValue='전체' >
                        <Option key='0' >전체</Option>
                        {commoncode?.map((option, index) => (
                            <Option key={option.code} value={option.label} name={option.code}>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Button type="primary" style={{ width: 104 }}
                    onClick={() => navigate(`${location.pathname}/new`, { state: { readonly: false, newyn: 'new' } })}>
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
                title='보도자료'
                items={items}
            />
        </>
    );
}


export default AdminRelease;