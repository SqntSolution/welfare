import { Button, Col, ConfigProvider, Flex, Input, Row, Select, Space, Table, Typography } from "antd";
import { CustomButtonExcel } from "components/common/CustomComps";
import { useMsg } from "hooks/helperHook";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { AXIOS } from 'utils/axios';

const { Search } = Input;

export const AdminGroupMatchTeam = (props) => {
    const [teamTableOrgData, setTeamTableOrgData] = useState([]);
    const [teamTableFilteredData, setTeamTableFilteredData] = useState([]);
    const [selectFilterData, setSelectFilterData] = useState([]);
    const [selectCompsData, setSelectCompsData] = useState([]);
    const [teamModifiedRows, setTeamModifiedRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [teamFilter, setTeamFilter] = useState('');
    const [compsFilter, setCompsFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(1);

    const [orgNmSearchInputVal, setOrgNmSearchInputVal] = useState('');
    const [orgNmSearch, setOrgNmSearch] = useState('');

    const { error, info } = useMsg();

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        setTeamTableFilteredData(teamTableOrgData.filter(d => (d.authGroupCd ?? 'NOAUTH').includes(teamFilter) && (d.compid ?? '').includes(compsFilter) &&
            (d.orgNm?.toLowerCase().includes(orgNmSearch.toLowerCase()))));
    }, [teamTableOrgData, teamFilter, compsFilter, orgNmSearch]);

    useEffect(() => {
        setCurrent(1);
    }, [teamFilter, compsFilter, orgNmSearch]);

    const teamColumn = [
        // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: "20%", ellipsis: true, },
        { title: '상위팀 명', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: "20%", ellipsis: true, },
        { title: '상위팀 코드', key: 'parentOrgId', dataIndex: 'parentOrgId', width: "20%", ellipsis: true, },
        { title: '팀 명', key: 'orgNm', dataIndex: 'orgNm', width: "20%", ellipsis: true, },
        { title: '팀 코드', key: 'orgId', dataIndex: 'orgId', width: "20%", ellipsis: true, },
        {
            title: '권한 그룹', width: "20%", ellipsis: true,
            render: (_, record) => (
                <Select style={{ width: '100%' }}
                    options={[{ value: 'NOAUTH', label: '없음', }, ...selectFilterData]}
                    value={record.authGroupCd ?? 'NOAUTH'}
                    onChange={(v) => handleTeamRowChange(record.orgKey, v, record.authMatchingId)} />
            )
        },
    ];

    const pageSizeOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '40', label: '40' },
        { value: '60', label: '60' },
        { value: '80', label: '80' },
        { value: '100', label: '100' },
    ];

    const getMatchGroupData = async () => {
        return await AXIOS.get("/api/v1/admin/group/match/team")
            .then((resp) => {
                setTeamTableOrgData(resp?.data);
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

    const getCompIdList = async () => {
        return await AXIOS.get("/api/v1/admin/common/comps")
            .then((resp) => {
                setSelectCompsData(resp?.data.map(d => ({ label: d, value: d })));
            })
            .catch((err) => {
                error(err);
            })
    };

    const handleTeamRowChange = (id, value, authMatchingId) => {
        if (!teamModifiedRows.includes(id))
            setTeamModifiedRows([...teamModifiedRows, id]);

        if (teamModifiedRows.includes(id) && value === 'NOAUTH' && authMatchingId === undefined)
            setTeamModifiedRows(teamModifiedRows.filter(d => d !== id));

        setTeamTableOrgData(teamTableOrgData.map(d => {
            if (d.orgKey === id)
                return { ...d, authGroupCd: value };
            return d;
        }));
    }

    const submit = async () => {
        setLoading(true);

        const modifiedList = teamTableOrgData.filter(d => teamModifiedRows.includes(d.orgKey));

        const params = {
            matchingTeamInputList: modifiedList.filter(d => d.authGroupCd !== 'NOAUTH'),
            deleteMatchingTeamIdList: modifiedList.filter(d => d.authGroupCd === 'NOAUTH').map(d => d.authMatchingId)
        };

        const validateMessage = await validateInput(params);

        if (validateMessage !== '') {
            error(validateMessage);
        }
        else {
            return await AXIOS.post(`/api/v1/admin/group/match/team`, params)
                .then(() => {
                    info('저장되었습니다.');
                    refresh();
                })
                .catch((err) => {
                    error(err);
                });
        }
        setLoading(false);
    }

    const validateInput = async (params) => {
        if (params.matchingTeamInputList?.length === 0 && params.deleteMatchingTeamIdList?.length === 0) {
            return '수정된 내용이 없습니다.';
        }

        return '';
    }

    const refresh = async () => {
        setLoading(true);
        await getMatchGroupData();
        await getGroupCdList();
        // await getCompIdList();
        setTeamFilter('');
        setLoading(false);
        setTeamModifiedRows([]);
    }

    return (
        <>
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
                                {/* <span>법인코드 : </span>
                                <Select style={{ width: 200 }} onChange={setCompsFilter} value={compsFilter}
                                    options={[{ value: '', label: '전체', }, ...selectCompsData]} defaultValue={''} placeholder="전체"
                                /> */}
                                <Search placeholder="팀 명으로 검색"
                                    value={orgNmSearchInputVal}
                                    onChange={(e) => setOrgNmSearchInputVal(e.target.value)}
                                    onBlur={(e) => setOrgNmSearch(orgNmSearchInputVal)}
                                    // onSearch={() => setTeamTableFilteredData(teamTableOrgData.filter(d => d.orgNm?.toLowerCase().includes(orgNmSearchInputVal.toLowerCase())))}/>
                                    onSearch={(e) => setOrgNmSearch(orgNmSearchInputVal)} />
                                <span>권한 그룹 : </span>
                                <Select style={{ width: 300 }} onChange={setTeamFilter} value={teamFilter}
                                    options={[{ value: '', label: '전체', }, ...selectFilterData, { value: 'NOAUTH', label: '없음', }]} defaultValue={''} placeholder="전체"
                                />
                                <CustomButtonExcel href='/api/v1/admin/group/match/excel' />
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
                            columns={teamColumn}
                            loading={loading}
                            dataSource={teamTableFilteredData}
                            rowKey='orgKey'
                            onRow={(record) => ({
                                style: {
                                    background: teamModifiedRows.includes(record.orgKey) ? '#ccc' : (record.authGroupCd ?? 'NOAUTH') !== 'NOAUTH' ? 'white' : '#ededed',
                                }
                            })} />
                    </Col>
                </Row>
            </ConfigProvider>
            <Flex justify='center' style={{ paddingRight: '30px' }}>
                <Button type='primary' size="large" style={{ width: 114, marginTop: 32 }} onClick={() => submit()}>저장</Button>
            </Flex>
        </>
    );
};

export default AdminGroupMatchTeam;


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