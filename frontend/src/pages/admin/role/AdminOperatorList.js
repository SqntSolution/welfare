/**
 * @format
 */
import { Breadcrumb, Button, Flex, Popconfirm, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import qs from 'qs';
import { isEmptyCheck } from 'utils/helpers';
import { SelectTableModal } from '../group/SelectTableModal';
import { useMsg } from 'hooks/helperHook';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledAdminTable, StyledTableButton } from 'styles/StyledCommon';

export const AdminOperatorList = () => {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();
    const [modalLoading, setModalLoading] = useState(true);

    useEffect(() => {
        refresh();
        // getData();
        // getUser();
    }, []);

    const refresh = () => {
        // setLoading(true);
        getData();
        // await getUser();
        setIsModalOpen(false);
        // setLoading(false);
    };

    const getData = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/admin/role/operator`)
            .then((res) => {
                setTableData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const getUser = async () => {
        // setLoading(true);
        setIsModalOpen(true);
        setModalLoading(true);
        return await AXIOS.get(`/api/v1/admin/common/members`)
            .then((res) => {
                setUserList(res.data ?? []);
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setModalLoading(false));
    };

    const columnsData = [
        // {
        //     title: '상위팀 명',
        //     dataIndex: 'parentOrgNm',
        //     key: 'parentOrgNm',
        //     width: '24%',
        //     ellipsis: true,

        // },
        // {
        //     title: '상위팀 코드',
        //     dataIndex: 'parentOrgId',
        //     key: 'parentOrgId',
        //     width: '24%',
        //     ellipsis: true,

        // },
        // {
        //     title: '팀 명',
        //     dataIndex: 'orgNm',
        //     key: 'orgNm',
        //     width: '24%',
        //     ellipsis: true,

        // },
        // {
        //     title: '팀 코드',
        //     dataIndex: 'orgId',
        //     key: 'orgId',
        //     width: '24%',
        //     ellipsis: true,

        // },
        // {
        //     title: '이름/직함',
        //     dataIndex: 'userNm',
        //     key: 'userNm',
        //     width: '24%',
        //     ellipsis: true,

        //     render: (text, record) => (
        //         <>
        //             {text} {record.empGradeNm}
        //         </>
        //     ),
        // },
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "20%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", ellipsis: true, },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "20%", ellipsis: true, },
        { title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%", ellipsis: true, render: (_, record) => (<>{record ? "활성화" : "비활성화"}</>) },
        { title: '회원 구분', dataIndex: 'adminRoleNm', key: 'adminRoleNm', width: "20%", ellipsis: true, render: (_, record) => (<div>{record?.adminRoleNm}</div>), },
        { title: '팀 권한 그룹', dataIndex: 'authGroupNm', key: 'authGroupNm', width: '25%', ellipsis: true, render: (_, record) => (<div> {record.authGroupNm} </div>), },
        {
            title: '삭제',
            dataIndex: 'delete',
            key: 'delete',
            width: '8%',
            ellipsis: true,

            render: (_, record) => {
                if (record.adminRoleCd !== 'ROLE_MASTER') {
                    return (
                        <Popconfirm
                            title={`${record?.userNm} ${record?.empGradeNm ?? ''}님을 운영자에서 삭제합니다.`}
                            description=''
                            okText='확인'
                            cancelText='취소'
                            onConfirm={() => operatorDeleteHandler(record)}>
                            <StyledTableButton type='link' danger>
                                삭제
                            </StyledTableButton>
                        </Popconfirm>
                    );
                } else {
                    return (
                        <StyledTableButton type='link' danger disabled>
                            삭제
                        </StyledTableButton>
                    );
                }
            },
        },
    ];

    const modalColumn = [
        // { title: '상위팀', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: '25%', ellipsis: true },
        // { title: '팀', key: 'orgNm', dataIndex: 'orgNm', width: '25%', ellipsis: true },
        // {
        //     title: '이름/직함',
        //     key: 'userNm',

        //     width: '25%',
        //     ellipsis: true,
        //     render: (_, record) => (
        //         <span title={`${record.userNm} ${record.empGradeNm}`}>
        //             {record.userNm} {record.empGradeNm}
        //         </span>
        //     ),
        // },
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "20%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", ellipsis: true, },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "20%", ellipsis: true, },
        { title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%", ellipsis: true, render: (_, record) => (<>{record ? "활성화" : "비활성화"}</>) },
        {
            title: '선택',
            align: 'center',
            width: '15%',
            ellipsis: true,
            render: (_, record) => (
                <Button onClick={() => modalOkHandler(record)}>
                    선택
                </Button>
            ),
        },
    ];

    const openModal = () => {
        getUser();
        // setIsModalOpen(true);
    };

    /**
     * 모달 ok 클릭 이벤트
     * @param {*} e
     */
    const modalOkHandler = async (data) => {
        setIsModalOpen(false);
        const valid = await validateData(data);
        if (valid !== '') {
            return;
        } else {
            await operatorRegistrationHandler(data);
        }
    };

    const validateData = async (data) => {
        if (isEmptyCheck(data)) {
            return '사용자 선택되지 않음';
        }
        if (isEmptyCheck(data.userNm)) {
            return '사용자 이름이 없음';
        }
        if (isEmptyCheck(data.userId)) {
            return '사용자 아이디가 없음';
        }
        return '';
    };

    const operatorRegistrationHandler = async (data) => {
        const postData = {
            userId: data?.userId,
            userNm: data?.userNm,
        };
        return await AXIOS.post(`/api/v1/admin/role/operator`, postData)
            .then((res) => {
                info('성공적으로 추가 되었습니다.');
                getData();
            })
            .catch((err) => {
                error(err);
                getData();
            });
    };

    /**
     * 운영자 삭제 이벤트
     * @TODO 삭제 이벤트 연동
     * @param {*} data
     */
    const operatorDeleteHandler = async (data) => {
        const userId = data?.userId;
        await operatorDelete(userId);
    };

    const operatorDelete = async (userId) => {
        return await AXIOS.delete(`/api/v1/admin/role/operator/${userId}`)
            .then((res) => {
                info('삭제 되었습니다.');
                getData();
            })
            .catch((err) => {
                error(err);
                getData();
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
            title: '운영자',
        },
    ];
    return (
        <>
            <CustomAdminTitle title={'관리자'} items={breadcrumb} />
            <InnerAdminDiv>
                <SelectTableModal
                    title='운영자 검색 및 선택'
                    data={userList}
                    columns={modalColumn}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    rowKey='userId'
                    placeholder='이름 또는 팀명으로 검색하세요.'
                    loading={modalLoading}
                    width={800}
                />


                <>
                    <Flex justify='space-between' align="end" style={{ marginBottom: 24 }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>운영자</Typography.Title>
                        <Button type='primary' onClick={() => openModal()} disabled={loading} size='large' style={{ width: 114, }}>
                            추가
                        </Button>
                    </Flex>
                    <StyledAdminTable
                        loading={loading}
                        size='small'
                        dataSource={tableData ?? []}
                        columns={columnsData}
                        pagination={paginations}
                        onChange={tableChangeHandler}
                        rowKey='adminRoleId'
                    />
                </>
            </InnerAdminDiv>
        </>
    );
};

export default AdminOperatorList;
