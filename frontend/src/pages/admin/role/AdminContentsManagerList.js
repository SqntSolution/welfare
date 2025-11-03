/**
 * @format
 */
import { Breadcrumb, Button, Flex, Table, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import qs from 'qs';
import dayjs from 'dayjs';
import { useMsg } from 'hooks/helperHook';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledAdminTable, StyledTableButton } from 'styles/StyledCommon';

export const AdminContentsManagerList = () => {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/admin/role/manager`)
            .then((res) => {
                setTableData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const columnsData = [
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "15%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", ellipsis: true, },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "20%", ellipsis: true, },
        { title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%", ellipsis: true, render: (_, record) => (<>{record ? "활성화" : "비활성화"}</>) },
        { title: '회원 구분', dataIndex: 'adminRoleNm', key: 'adminRoleNm', width: "20%", ellipsis: true, render: (_, record) => (<div>{record?.adminRoleNm}</div>), },
        { title: '팀 권한 그룹', dataIndex: 'authGroupNm', key: 'authGroupNm', width: '25%', ellipsis: true, render: (_, record) => (<div> {record.authGroupNm} </div>), },
        { title: '활동 시작일', dataIndex: 'startAuthAt', key: 'startAuthAt', width: '14%', ellipsis: true, render: (text, record) => <>{dayjs(text).format('YYYY.MM.DD')}</>, },
        { title: '활동 종료일', dataIndex: 'endAuthAt', key: 'endAuthAt', width: '14%', ellipsis: true, render: (text, record) => <>{dayjs(text).format('YYYY.MM.DD')}</>, },
        { title: '수정', dataIndex: 'edit', key: 'edit', width: '8%', ellipsis: true, render: (_, record) => { return (<StyledTableButton type='link' onClick={() => editContentsMangerHandler(record)}> 수정</StyledTableButton>); }, },
    ];

    /**
     * 콘텐츠 관리자 수정 이벤트
     * @TODO 수정 이벤트 연동
     * @param {*} data
     */
    const editContentsMangerHandler = (data) => {
        navigate(`./edit/${data.userId}`, {
            state: {
                data: data,
            },
        });
    };

    const paginations = {
        current: Number(tableData?.number ?? 0) + 1, // 화면에서 사용시 +1 서버로 요청시엔 -1
        pageSize: tableData?.size ?? 15, // 기본값 15
        total: tableData?.totalElements ?? 0, // 전체 페이지 수
        position: ['bottomCenter'], //페이지 버튼 위치
        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
    };

    const tableChangeHandler = (pagination, filters, sorter) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize })}`);
    };
    const breadcrumb = [
        {
            title: 'Home',
        },
        {
            title: '관리자',
        },
        {
            title: '콘텐츠 관리자',
        },
    ];
    return (
        <>

            <CustomAdminTitle title={'관리자'} items={breadcrumb} />
            <InnerAdminDiv >
                <Flex justify='space-between' style={{ marginBottom: 24 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>콘텐츠 관리자</Typography.Title>
                    <Button type='primary' size='large' style={{ width: 114, }} onClick={() => navigate(`./new`)} disabled={loading}>추가</Button>
                </Flex>
                <StyledAdminTable
                    loading={loading}
                    size='small'
                    rowKey='adminRoleId'
                    dataSource={tableData ?? []}
                    columns={columnsData}
                    pagination={paginations}
                    onChange={tableChangeHandler}
                />
            </InnerAdminDiv>
        </>
    );
};

export default AdminContentsManagerList;
