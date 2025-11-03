import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, Form, Spin, Space, Popconfirm, Tag } from 'antd';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { TableCommon } from 'components/common/TableCommon'
import { StyledButtonUnderLine } from "styles/StyledCommon";
import { CustomNavLinkButton, CustomTableButton } from "components/common/CustomComps";
import { StyledNavLink } from "styles/StyledCommon";

const { Option } = Select;

//관리자 게시판 메인
const AdminFaq = (props) => {

    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [commoncode, setCommoncode] = useState([]); // 공통 코드 공개여부
    const [commoncode2, setCommoncode2] = useState([]); // 공통 코드 FAQ

    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg();

    useEffect(() => {
        const commomData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode, setLoading);
            await getGroupCode('FAQ_TYPE', setCommoncode2, setLoading);
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
        await getData('get', 'bbs', 'faq', { params: { pageNumber: Number(ofqs?.page ?? 1) - 1, pageSize: ofqs?.size ?? 10, openType: ofqs?.openType, metaDivision: ofqs?.metaDivision } }, '');
    }

    //공통코드 호출
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


    // 공개 여부 선택
    const handleOpenedChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ pageNumber: 1, pageSize: ofqs?.size ?? 10, openType: name?.name, metaDivision: ofqs?.metaDivision })}`);
    }


    // 구분 선택
    const handleMetaDivisionChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ pageNumber: 1, pageSize: ofqs?.size ?? 10, openType: ofqs?.openType, metaDivision: name?.name })}`);
    }


    // 폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, metaDivision: ofqs?.metaDivision, openType: ofqs?.openType })}`);
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
            title: '구분',
            dataIndex: 'metaDivisionNm',
            width: "8%",
            key: 'metaDivisionNm',
        },
        {
            title: '제목',
            dataIndex: 'title',
            // width: 150,
            key: 'title',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <StyledNavLink
                            style={{
                            }}
                            to={`${location.pathname}/${record.id}`}
                            state={{ readonly: false }}
                        >
                            {text}
                        </StyledNavLink>
                    </>
                )
            })
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
            width: "8%",
            key: 'opened',
            render: ((text, record) => {
                return (
                    <>
                        <Tag color={text ? 'purple' : 'default'} >
                            {text ? '공개' : '비공개'}
                        </Tag>
                    </>
                )
            })
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            width: "8%",
            key: 'createUserNm',
        },
        // {
        //     title: '수정',
        //     dataIndex: 'update',
        //     width:  "8%",
        //     key: 'update',
        //     render: ((text, record) => {
        //         return (
        //             <>
        //                 <CustomNavLinkButton
        //                     to={`${location.pathname}/${record.id}`}
        //                     text={"수정"}
        //                     state={{ readonly: false }}
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
            render: ((text, record) => {
                return (
                    <>
                        <Popconfirm
                            title='해당 게시물을 삭제 하시겠습니까?'
                            description=''
                            okText='삭제'
                            cancelText='취소'
                            onConfirm={() => getData('delete', 'bbs', record.id,
                                { params: { pageNumber: Number(ofqs?.page ?? 1) - 1, pageSize: ofqs?.size ?? 10, openType: ofqs?.openType, metaDivision: ofqs?.metaDivision } },
                                onReload)}
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
                title: `질문모음`,
            },
        ]


    const mindleLayout = () => {
        return (
            <>
                <Form.Item label="구분">
                    <Select style={{ width: 120 }} onChange={handleMetaDivisionChange} defaultValue='전체' >
                        <Option key='0' >전체</Option>
                        {commoncode2?.map((option, index) => (
                            <Option key={option.code} value={option.label} name={option.code}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="공개">
                    <Select style={{ width: 120 }} onChange={handleOpenedChange} defaultValue='전체' >
                        <Option key='0' >전체</Option>
                        {commoncode?.map((option, index) => (
                            <Option key={option.code} value={option.label} name={option.code}>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
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
                title='질문모음'
                items={items}
            />
        </>
    );

}
export default AdminFaq;
