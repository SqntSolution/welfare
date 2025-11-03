import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, ConfigProvider, Flex, Row, Select, Space, Table, Typography } from "antd";
import { useMsg } from "hooks/helperHook";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { AXIOS } from 'utils/axios';
import { SelectTableModal } from "./SelectTableModal";

export const AdminGroupMatchUser = (props) => {
    const [userTableOrgData, setUserTableOrgData] = useState([]);
    const [userTableFilteredData, setUserTableFilteredData] = useState([]);
    const [selectFilterData, setSelectFilterData] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [userModifiedRows, setUserModifiedRows] = useState([]);
    const [userDeletedRows, setUserDeletedRows] = useState([]);
    const [userFilter, setUserFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [current, setCurrent] = useState(1);

    const { error, info } = useMsg()

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        setUserTableFilteredData(userTableOrgData.filter(d => (d.authGroupCd ?? '').includes(userFilter)));
    }, [userTableOrgData, userFilter]);

    useEffect(() => {
        setCurrent(1);
    }, [userFilter]);

    const userColumn = [
        {
            title: <CloseOutlined />, key: 'empId', width: 52, align: 'center',
            render: (_, record) => (
                <Button style={{ padding: 0, border: 0, height: '3px' }} type='link' danger
                    onClick={() => deleteUser(record.authMatchingId)}>
                    {userDeletedRows.includes(record.authMatchingId) ? <PlusOutlined /> : <CloseOutlined />}
                </Button>
            )
        },
        // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: "25%", ellipsis: true, },
        // { title: '팀 명', key: 'orgNm', dataIndex: 'orgNm', width: "25%", },
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "25%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "25%", },
        {
            title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "25%",
            render: (_, record) => (
                <>
                    {record ? "활성화" : "비활성화"}
                </>
            )
        },
        // { title: '직함', key: 'empGradeNm', dataIndex: 'empGradeNm', width: "25%", ellipsis: true, },
        {
            title: '개인 권한 그룹', key: 'authMatchingId', width: "25%", ellipsis: true,
            render: (_, record) => (
                <Select style={{ width: '100%' }}
                    options={selectFilterData}
                    value={record.authGroupCd}
                    placeholder="없음"
                    onChange={(v) => handleUserRowChange(record.authMatchingId, v)} />
            )
        },
    ];

    const modalColumn = [
        // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: "25%", ellipsis: true, },
        // { title: '상위팀', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: '25%', ellipsis: true, },
        // { title: '팀', key: 'orgNm', dataIndex: 'orgNm', width: '25%', ellipsis: true, },
        // {
        //     title: '이름/직함', key: 'userNm', width: '25%', ellipsis: true,
        //     render: (_, record) => <>{record.userNm} {record.empGradeNm}</>
        // },
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "25%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "30%", },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "25%", },
        {
            title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%",
            render: (_, record) => (
                <>
                    {record ? "활성화" : "비활성화"}
                </>
            )
        },
        {
            title: '선택', width: '15%', ellipsis: true, align: 'center',
            render: (_, record) => <Button onClick={() => onRowSelect(record)} >선택</Button>
        },
    ]

    const pageSizeOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '40', label: '40' },
        { value: '60', label: '60' },
        { value: '80', label: '80' },
        { value: '100', label: '100' },
    ];

    const getMatchGroupData = async () => {
        return await AXIOS.get("/api/v1/admin/group/match/user")
            .then((resp) => {
                setUserTableOrgData(resp?.data);
            })
            .catch((err) => {
                error(err);
            })
    };

    const getGroupCdList = async () => {
        return await AXIOS.get("/api/v1/admin/common/groups")
            .then((resp) => {
                setSelectFilterData(resp?.data.map(d => ({ label: d.groupNm, value: d.authGroupCd })));
            })
            .catch((err) => {
                error(err);
            })
    };

    const getMemberList = async () => {
        setOpen(true);
        setModalLoading(true);

        return await AXIOS.get("/api/v1/admin/common/members")
            .then((resp) => {
                setMemberList(resp?.data);
                setModalLoading(false);
            })
            .catch((err) => {
                error(err);
                setModalLoading(false);
                setOpen(false);
            })
    };

    const handleUserRowChange = (id, value) => {
        setUserModifiedRows([...userModifiedRows, id]);
        setUserTableOrgData(userTableOrgData.map(d => {
            if (d.authMatchingId === id)
                return { ...d, authGroupCd: value };
            return d;
        }));
    }

    const submit = async () => {
        setLoading(true);

        const params = {
            matchingUserInputList: userTableOrgData.filter(d =>
                userModifiedRows.includes(d.authMatchingId) && !userDeletedRows.includes(d.authMatchingId)).map(d => ({
                    authMatchingId: d.authMatchingId.toString().startsWith('temp') ? null : d.authMatchingId,
                    authGroupCd: d.authGroupCd,
                    userId: d.userId,
                })),
            deleteMatchingUserIdList: userTableOrgData.filter(d => userDeletedRows.includes(d.authMatchingId)).map(d => d.authMatchingId)
        };

        const validateMessage = await validateInput(params);

        if (validateMessage !== '') {
            error(validateMessage);
        }
        else {
            return await AXIOS.post(`/api/v1/admin/group/match/user`, params)
                .then((resp) => {
                    info('저장되었습니다.');
                    refresh();
                })
                .catch((err) => {
                    error(err);
                })
        }
        setLoading(false);
    }

    const validateInput = async (params) => {
        const set = new Set([]);
        let flagUnselected = true;
        let flagDuplicate = false;

        userTableOrgData?.forEach(d => {
            if (d.authMatchingId.toString().startsWith('temp') && d.authGroupCd === undefined)
                flagUnselected = false;
        })

        if (!flagUnselected)
            return '추가한 사용자의 권한 그룹을 선택해주세요.';

        userTableOrgData?.forEach(d => {
            if (!userDeletedRows.includes(d.authMatchingId)) {
                if (set.has(d.userId + d.authGroupCd))
                    flagDuplicate = true;
                else
                    set.add(d.userId + d.authGroupCd);
            }
        });

        if (flagDuplicate)
            return '중복되는 데이터(사용자 + 권한 그룹)가 존재합니다.';

        if (params.matchingUserInputList?.length === 0
            && params.deleteMatchingUserIdList?.length === 0) {
            return '수정된 내용이 없습니다.';
        }

        return '';
    }

    const deleteUser = (id) => {
        if (!userDeletedRows.includes(id)) {
            if (id.toString().startsWith('temp')) {
                setUserTableOrgData(userTableOrgData.filter(d => d.authMatchingId !== id));
                return;
            }
            setUserDeletedRows([...userDeletedRows, id]);
        }
        else {
            setUserDeletedRows(userDeletedRows.filter(d => d !== id));
        }
    }

    const onRowSelect = (data) => {
        setUserTableOrgData([{
            userId: data.userId,
            userNm: data.userNm,
            orgNm: data.orgNm,
            dutyNm: data.dutyNm,
            authMatchingId: 'temp' + new Date().getTime() + data.userId, // 임시 ID
        }, ...userTableOrgData]);
    }

    const refresh = async () => {
        setLoading(true);
        await getMatchGroupData();
        await getGroupCdList();
        setUserFilter('');
        setLoading(false);
        setUserModifiedRows([]);
        setUserDeletedRows([]);
    }

    return (
        <>
            <SelectTableModal
                title='매칭 사용자 검색 및 선택'
                isModalOpen={open}
                setIsModalOpen={setOpen}
                data={memberList}
                columns={modalColumn}
                loading={modalLoading}
                rowKey='userId'
                placeholder='이름 또는 팀명으로 검색하세요'
                width={800} />

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowHoverBg: 'none',
                        }
                    }
                }}>
                <Row>
                    <Col span={24}>
                        <Flex justify="space-between" style={{ marginBottom: 24 }}>
                            <Typography.Title level={5} style={{ margin: 0 }}>{props.title}</Typography.Title>
                            <Space>
                                <Select style={{ width: 200 }} onChange={setPageSize} value={pageSize}
                                    options={pageSizeOptions} defaultValue={10}
                                />
                                <span>개인 권한 그룹 : </span>
                                <Select style={{ width: 300 }} onChange={setUserFilter} value={userFilter}
                                    options={[{ value: '', label: '전체', }, ...selectFilterData]} defaultValue={''} placeholder="전체" />
                                <Button style={{ width: 104 }} type='primary' onClick={() => getMemberList()}>추가</Button>
                            </Space>
                        </Flex>

                        <HeightFixedTable
                            pagination={{
                                showSizeChanger: false,
                                defaultPageSize: 10,
                                pageSize: pageSize,
                                current: current,
                                onChange: (page) => setCurrent(page)
                            }}
                            // bordered
                            size='small'
                            columns={userColumn}
                            dataSource={userTableFilteredData}
                            loading={loading}
                            rowKey='authMatchingId'
                            onRow={(record) => ({
                                style: {
                                    background: userDeletedRows.includes(record.authMatchingId) ? 'rgba(255, 186, 186, 0.2)' :
                                        userModifiedRows.includes(record.authMatchingId) ? '#ccc' :
                                            record.authGroupCd ? 'white' : 'rgba(250, 186, 18, 0.2)',
                                }
                            })} />
                    </Col>
                </Row>
            </ConfigProvider>

            <Flex justify='center' style={{ paddingRight: '30px' }}>
                <Button type='primary' style={{ width: 114, marginTop: 32 }} onClick={() => submit()}>저장</Button>
            </Flex>
        </>
    );
};

export default AdminGroupMatchUser;


const HeightFixedTable = styled(Table)`
    .ant-table-body {
        height: 100%;
    }

    &.ant-table-wrapper .ant-table{ background: #fff;}

    && .ant-table-thead>tr>th{
        background:  rgba(250, 250, 250, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 8px;
        font-size: 14px;
        height: 40px;
        white-space: nowrap;
    }
    &.ant-card-small >.ant-card-body{padding:0}

    &.ant-table-wrapper .ant-table-tbody >tr >th, 
    &.ant-table-wrapper .ant-table-tbody >tr >td{
        padding: 8px;
        font-size: 14px;
        color:rgba(0, 0, 0, 0.85);
        height: 40px;
        border-inline-end:0 !important;
        border-bottom: 1px solid rgba(250, 250, 250, 1);
    }

    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px;}

    &.ant-table-wrapper .ant-table-pagination-right{ justify-content: center;}
    &.ant-table-wrapper .ant-table-bordered .ant-table-cell-scrollbar{
        background:  rgba(250, 250, 250, 1);
    }

`;