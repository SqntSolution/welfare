import React, { useState, useEffect, useRef } from "react";
import { Flex, Table, Divider, Select, Input, Button, Modal, ConfigProvider, Row, Col, Form, Spin, Space, Breadcrumb, Typography, Tag } from 'antd';
import Search from 'antd/es/input/Search';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { TableCommon } from 'components/common/TableCommon'
import { StyledFormItem, StyledTableButton } from "styles/StyledCommon";
import { StyledNavLink } from "styles/StyledCommon";

const { Option } = Select;

//관리자 게시판 메인

const AdminQna = (props) => {

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
            await getGroupCode('QNA_TYPE', setCommoncode, setLoading);
            await getGroupCode('RESPONSE_TYPE', setCommoncode2, setLoading);
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
        await getData('get', 'qna', null, {
            params:
            {
                pageNumber: Number(ofqs?.page ?? 1) - 1, pageSize: ofqs?.size ?? 10, responseStatus: ofqs?.responseStatus, metaDivision: ofqs?.metaDivision
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
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };

    // 구분 선택 metaDivision
    const handleOpenedChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ pageNumber: 1, pageSize: ofqs?.size ?? 10, keyword: ofqs?.keyword, metaDivision: name?.name, responseStatus: ofqs?.responseStatus })}`);
    }

    // 상태 선택 responseStatus
    const handleMetaDivisionChange = (value, name) => { // 수정필요 컨피그 DB에 생성해야함 문의접수 답변완료 이두가지 
        navigate(`${location.pathname}?${qs.stringify({ pageNumber: 1, pageSize: ofqs?.size ?? 10, keyword: ofqs?.keyword, metaDivision: ofqs?.metaDivision, responseStatus: name?.name })}`);
    }

    // 폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, metaDivision: ofqs?.metaDivision, responseStatus: ofqs?.responseStatus })}`);
    };

    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            width: "9%",
            key: 'createdAt',
            ellipsis: true,
        },
        {
            title: '구분',
            dataIndex: 'metaDivisionNm',
            width: "9%",
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
                            to={`${location.pathname}/${record.id}`}
                            state={{ readonly: true }}
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
            title: '상태',
            dataIndex: 'responseYn',
            width: "8%",
            key: 'responseYn',
            render: ((text, record) => {
                return (
                    <>
                        <Tag color={record.responseYn ? 'default' : 'green'} >
                            {record.responseYn ? '답변완료' : '문의접수'}
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
        {
            title: '답변자',
            dataIndex: 'responseUserNm',
            width: "8%",
            key: 'responseUserNm',
            render: ((text, record) => {
                return (
                    <>
                        {record.responseUserNm ? record.responseUserNm : '-'}
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
                title: `문의하기`,
            },
        ]

    const mindleLayout = () => {
        return (
            <>
                <Form.Item label="구분" labelStyle={{ fontSize: '40px' }}>
                    <Select style={{ width: 120 }} onChange={handleOpenedChange} defaultValue='전체' >
                        <Option key='0' >전체</Option>
                        {commoncode?.map((option, index) => (
                            <Option key={option.code} value={option.label} name={option.code}>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="상태">
                    <Select style={{ width: 120 }} onChange={handleMetaDivisionChange} defaultValue='전체' >
                        <Option key='0' >전체</Option>
                        {commoncode2?.map((option, index) => (
                            <Option key={option.code} value={option.label} name={option.code}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </>
        );
    }

    return (
        <>
            <TableCommon data={data}
                columns={columns}
                loading={loading}
                handleTableChange={handleTableChange}
                mindleLayout={mindleLayout}
                title='문의하기'
                items={items}
            />
        </>
    );

}

export default AdminQna;