import { CloseOutlined, FileExcelOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, ConfigProvider, Divider, Flex, Input, Row, Select, Space, Table, Typography } from "antd";
import { useMsg } from "hooks/helperHook";
import { useConfirmPopup } from 'hooks/popups';
import { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import { AXIOS } from 'utils/axios';
import { SelectTableModal } from "./SelectTableModal";
import { CustomAdminTitle, CustomButtonExcel } from "components/common/CustomComps";
import { InnerAdminDiv } from "styles/StyledCommon";



const { Search } = Input;

export const AdminGroupMatch = () => {
    const [teamTableOrgData, setTeamTableOrgData] = useState([]);
    const [userTableOrgData, setUserTableOrgData] = useState([]);
    const [teamTableFilteredData, setTeamTableFilteredData] = useState([]);
    const [userTableFilteredData, setUserTableFilteredData] = useState([]);
    const [selectFilterData, setSelectFilterData] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [teamModifiedRows, setTeamModifiedRows] = useState([]);
    const [userModifiedRows, setUserModifiedRows] = useState([]);
    const [userDeletedRows, setUserDeletedRows] = useState([]);
    const [teamFilter, setTeamFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    // const [orgNmSearchValue, setOrgNmSearchValue] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const orgNmInputRef = useRef();

    const [orgNmSearchInputVal, setOrgNmSearchInputVal] = useState('');
    const [orgNmSearch, setOrgNmSearch] = useState('');

    const { error, info } = useMsg()

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        console.log("=== setTeamTableFilteredData : ", teamTableOrgData?.length)
        const authGroupCdIsEmpty = (teamFilter ?? '') == ''
        setTeamTableFilteredData(teamTableOrgData.filter(d => (authGroupCdIsEmpty || (d.authGroupCd ?? '').includes(teamFilter)) &&
            (d.orgNm?.toLowerCase().includes(orgNmSearch.toLowerCase()))));
    }, [teamTableOrgData, teamFilter, orgNmSearch]);

    useEffect(() => {
        setUserTableFilteredData(userTableOrgData.filter(d => (d.authGroupCd ?? '').includes(userFilter)));
    }, [userTableOrgData, userFilter]);

    // useEffect(() => {
    //     setFilterDropdownOpen(false);
    //     setTeamTableFilteredData(teamTableOrgData.filter(d => d.orgNm.toLowerCase().includes(orgNmSearchValue.toLowerCase())));
    // }, [orgNmSearchValue]);

    const teamColumn = [
        { title: '그룹 명', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: "20%", ellipsis: true, },
        { title: '그룹 코드', key: 'parentOrgId', dataIndex: 'parentOrgId', width: "20%", ellipsis: true, },
        {
            title: '팀 명', key: 'orgNm', dataIndex: 'orgNm', width: "20%", ellipsis: true,
            // filterDropdownOpen: filterDropdownOpen,
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8, }} onKeyDown={(e) => e.stopPropagation()}>
            //         <Space>
            //             <Input
            //                 allowClear
            //                 ref={orgNmInputRef}
            //                 onChange={(e) => e.target.value === '' && setOrgNmSearchValue('')}
            //                 onPressEnter={() => setOrgNmSearchValue(orgNmInputRef.current.input.value)}
            //                 style={{ marginBottom: 8, width: 188}}
            //             />
            //         </Space>
            //         <Flex justify="space-between">
            //             <Button
            //                 type="primary"
            //                 onClick={() => setOrgNmSearchValue(orgNmInputRef.current.input.value)}
            //                 icon={<SearchOutlined />}
            //                 size="small"
            //                 style={{ width: 90, }}
            //             >
            //                 Search
            //             </Button>
            //             <Button
            //                 onClick={() => setFilterDropdownOpen(false)}
            //                 size="small"
            //                 style={{ width: 90, }}
            //             >
            //                 Cancel
            //             </Button>
            //         </Flex>
            //     </div>
            // ),
            // filterIcon: (filtered) => (
            //     <SearchOutlined onClick={() => setFilterDropdownOpen(true)}/>
            // ),
        },
        { title: '팀 코드', key: 'orgId', dataIndex: 'orgId', width: "20%", ellipsis: true, },
        {
            title: '권한 그룹', width: "20%", ellipsis: true,
            render: (_, record) => (
                <Select style={{ width: '100%' }}
                    options={selectFilterData}
                    value={record.authGroupCd}
                    placeholder="없음"
                    onChange={(v) => handleTeamRowChange(record.orgFullCode, v)} />
            )
        },
    ];

    const userColumn = [
        {
            title: <CloseOutlined />, key: 'empId', width: 52,
            render: (_, record) => (
                <Button style={{ padding: 0, border: 0, height: '3px' }} type='link' danger
                    onClick={() => deleteUser(record.authMatchingId)}>
                    {/* confirm(`${record.name}님을 ${selectFilterData[record.id]?.label ?? '목록'}에서 삭제합니다.`, () =>  */}
                    {userDeletedRows.includes(record.authMatchingId) ? <PlusOutlined /> : <CloseOutlined />}
                </Button>
            )
        },
        { title: 'SCM IT팀', key: 'orgNm', dataIndex: 'orgNm', width: "25%", },
        { title: '이름', key: 'empNm', dataIndex: 'empNm', width: "25%", ellipsis: true, },
        { title: '직함', key: 'dutyNm', dataIndex: 'dutyNm', width: "25%", ellipsis: true, },
        {
            title: '권한 그룹', key: 'authMatchingId', width: "25%", ellipsis: true,
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
        { title: '소속', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: '25%', ellipsis: true, },
        { title: '팀', key: 'orgNm', dataIndex: 'orgNm', width: '25%', ellipsis: true, },
        {
            title: '이름/직책', key: 'empNm', width: '25%', ellipsis: true,
            render: (_, record) => <>{record.empNm} {record.dutyNm}</>
        },
        {
            title: '선택', width: '15%', ellipsis: true,
            render: (_, record) => <Button size="small" onClick={() => onRowSelect(record)} >선택</Button>
        },
    ]

    const getMatchGroupData = async () => {
        return await AXIOS.get("/api/v1/admin/group/match")
            .then((resp) => {
                setTeamTableOrgData(resp?.data.matchingTeamInfoList);
                // setTeamTableFilteredData(resp?.data.matchingTeamInfoList);
                setUserTableOrgData(resp?.data.matchingUserInfoList);
                setUserTableFilteredData(resp?.data.matchingUserInfoList);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally();
    };

    const getGroupCdList = async () => {
        return await AXIOS.get("/api/v1/admin/common/groups")
            .then((resp) => {
                setSelectFilterData(resp?.data.map(d => ({ label: d.groupNm, value: d.authGroupCd })));
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally();
    };

    const getMemberList = async () => {
        setOpen(true);
        setModalLoading(true);

        return await AXIOS.get("/api/v1/admin/common/members")
            .then(async (resp) => {
                setMemberList(resp?.data);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setModalLoading(false));
    };

    const handleTeamRowChange = (id, value) => {
        setTeamModifiedRows([...teamModifiedRows, id]);
        setTeamTableOrgData(teamTableOrgData.map(d => {
            if (d.orgFullCode === id)
                return { ...d, authGroupCd: value };
            return d;
        }));
    }

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
            matchingTeamInputList: teamTableOrgData.filter(d => teamModifiedRows.includes(d.orgFullCode)),
            matchingUserInputList: userTableOrgData.filter(d =>
                userModifiedRows.includes(d.authMatchingId) && !userDeletedRows.includes(d.authMatchingId)).map(d => ({
                    authMatchingId: d.authMatchingId.toString().startsWith('temp') ? null : d.authMatchingId,
                    authGroupCd: d.authGroupCd,
                    empId: d.empId,
                })),
            deleteMatchingUserIdList: userTableOrgData.filter(d => userDeletedRows.includes(d.authMatchingId)).map(d => d.authMatchingId)
        };

        const validateMessage = await validateInput(params);

        if (validateMessage !== '') {
            error(validateMessage);
        }
        else {
            return await AXIOS.post(`/api/v1/admin/group/match`, params)
                .then(async (resp) => {
                    info('저장되었습니다.');
                    refresh();
                    return resp;
                })
                .catch((err) => {
                    error(err);
                })
        }
        setLoading(false);
    }

    const validateInput = async (params) => {
        let flag = true;

        userTableOrgData?.forEach(d => {
            if (d.authMatchingId.toString().startsWith('temp') && d.authGroupCd === undefined)
                flag = false;
        })

        if (!flag)
            return '추가한 사용자의 권한 그룹을 선택해주세요.';

        if (params.matchingTeamInputList?.length === 0
            && params.matchingUserInputList?.length === 0
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
            empId: data.empId,
            empNm: data.empNm,
            orgNm: data.orgNm,
            dutyNm: data.dutyNm,
            authMatchingId: 'temp' + new Date().getTime() + data.empId, // 임시 ID
        }, ...userTableOrgData]);
    }

    const refresh = async () => {
        setLoading(true);
        await getMatchGroupData();
        await getGroupCdList();
        setTeamFilter('');
        setUserFilter('');
        setLoading(false);
        setTeamModifiedRows([]);
        setUserModifiedRows([]);
        setUserDeletedRows([]);
    }

    const breadcrumb = [
        { title: "Home" },
        { title: "그룹" },
    ];

    return (
        <>
            <SelectTableModal
                title='매칭 사용자 검색 및 선택'
                isModalOpen={open}
                setIsModalOpen={setOpen}
                data={memberList}
                columns={modalColumn}
                loading={modalLoading}
                rowKey='empId'
                placeholder='이름 또는 팀명으로 검색하세요' />

            <CustomAdminTitle title={'그룹'} items={breadcrumb} />
            <InnerAdminDiv>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                rowHoverBg: 'none',
                            }
                        }
                    }}>
                    <Row>
                        {/* INSIGHT Group List 왼쪽 */}
                        <Col span={12} style={{ paddingRight: 32 }}>
                            <Flex justify="space-between" style={{ marginBottom: 24 }}>
                                <Typography.Title level={5} style={{ margin: 0 }}>그룹 권한 관리</Typography.Title>

                                <Space>
                                    <Search placeholder="팀 명으로 검색"
                                        value={orgNmSearchInputVal}
                                        onChange={(e) => setOrgNmSearchInputVal(e.target.value)}
                                        onBlur={(e) => setOrgNmSearch(orgNmSearchInputVal)}
                                        // onSearch={() => setTeamTableFilteredData(teamTableOrgData.filter(d => d.orgNm?.toLowerCase().includes(orgNmSearchInputVal.toLowerCase())))}/>
                                        onSearch={(e) => setOrgNmSearch(orgNmSearchInputVal)} />
                                    {/* <Button style={{ width: 123,background:'#389E0D',color:'#fff' }} 
                                            icon={<FileExcelOutlined />}
                                            href='/api/v1/admin/group/match/excel'>
                                    엑셀다운로드</Button> */}
                                    <CustomButtonExcel href='/api/v1/admin/group/match/excel' />
                                    <span>권한 그룹 : </span>
                                    <Select style={{ maxWidth: 200 }} onChange={setTeamFilter} value={teamFilter}
                                        options={[{ value: '', label: '전체', }, ...selectFilterData]} defaultValue={''} placeholder="전체"
                                    />
                                </Space>
                            </Flex>

                            <HeightFixedTable bordered
                                pagination={false}
                                size='small'
                                // virtual={true}
                                columns={teamColumn}
                                loading={loading}
                                dataSource={teamTableFilteredData}
                                rowKey='orgFullCode'
                                scroll={{ y: 660, }}
                                onRow={(record) => ({
                                    style: {
                                        background: teamModifiedRows.includes(record.orgFullCode) ? '#ccc' : record.authGroupCd ? 'white' : '#F9F0FF',
                                    }
                                })} />
                        </Col>
                        {/* INSIGHT Matching user 오른쪽 */}
                        <Col span={12} style={{ paddingLeft: 32, borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>
                            <Flex justify="space-between" style={{ marginBottom: 24 }}>
                                <Typography.Title level={5} style={{ margin: 0 }}>개인 권한 관리</Typography.Title>
                                <Space>
                                    <Button style={{ width: 104 }} type='primary' onClick={() => getMemberList()}>추가</Button>
                                    <span>권한 그룹</span>
                                    <Select style={{ maxWidth: 200 }} onChange={setUserFilter} value={userFilter}
                                        options={[{ value: '', label: '전체', }, ...selectFilterData]} defaultValue={''} placeholder="전체" />
                                </Space>
                            </Flex>

                            <HeightFixedTable
                                // bordered
                                pagination={false}
                                size='small'
                                columns={userColumn}
                                dataSource={userTableFilteredData}
                                loading={loading}
                                rowKey='authMatchingId'
                                scroll={{ y: '660px', }}
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
            </InnerAdminDiv>

        </>
    );
};

export default AdminGroupMatch;


const HeightFixedTable = styled(Table)`
    .ant-table-container {
        height: 700px;
    }

    .ant-table-body {
        height: 100%;
    }

    .ant-empty-normal {
        height: 579px;
        align-content: center;
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