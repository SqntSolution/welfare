/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Row, Select, Space, Popconfirm } from 'antd';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { InnerAdminDiv, StyledAdminTable } from 'styles/StyledCommon';
import { CustomTableButton } from 'components/common/CustomComps';
const { Option } = Select;

const pageSizeOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '40', label: '40' },
    { value: '60', label: '60' },
    { value: '80', label: '80' },
    { value: '100', label: '100' },
];

const userDisvList = [
    { value: 'ROLE_MASTER', label: '마스터 관리자' },
    { value: 'ROLE_OPERATOR', label: '운영 관리자' },
    { value: 'ROLE_CONTENTS_MANAGER', label: '콘텐츠 관리자' },
    { value: 'ROLE_USER', label: '일반 사용자' },
];

export const AdminMemberList = () => {
    const [loading, setLoading] = useState(true);
    const [memberData, setMemberData] = useState();
    const [form] = Form.useForm();
    const [dummy, setDummy] = useState(0);
    const [searchCond, setSearchCond] = useState({ pageNumber: 0 });
    const [matchGroupList, setMatchGroupList] = useState();
    const [teamList, setTeamList] = useState();
    const { error, info } = useMsg();

    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        restoreFromQueryStr();
        getCommonCd();
    }, []);

    useEffect(() => {
        restoreFromQueryStr();
        dummyClick();
    }, [location]);

    const dummyClick = () => {
        setDummy((prev) => prev + 1);
    };

    useEffect(() => {
        if (dummy > 0) {
            onSearch();
        }
    }, [dummy]);

    const getCommonCd = () => {
        AXIOS.get(`/api/v1/admin/common/groups`)
            .then((res) => {
                let groupTemp = [{ key: 0, value: '', label: '전체' }];
                groupTemp = [
                    ...groupTemp,
                    ...res.data.map(({ authGroupCd, groupNm }, index) => ({
                        key: index + 1,
                        value: authGroupCd,
                        label: groupNm,
                    })),
                ];
                setMatchGroupList(groupTemp);
            })
            .catch((err) => {
                error(err);
            })
            .then(() => {
                AXIOS.get(`/api/v1/admin/common/teams`).then((res) => {
                    let teamTemp = [{ key: 0, value: '', label: '전체' }];
                    teamTemp = [
                        ...teamTemp,
                        ...res.data.map(({ code, codeNm }, index) => ({
                            key: index + 1,
                            value: code,
                            label: codeNm,
                        })),
                    ];
                    setTeamList(teamTemp);
                });
            })
            .catch((err) => {
                error(err);
            });
    };

    const onSearch = () => {
        setLoading(true);
        // const formData = form.getFieldsValue();
        AXIOS.get(`/api/v1/admin/member`, { params: { ...searchCond, pageNumber: (searchCond?.pageNumber ?? 1) - 1, pageSize: searchCond?.pageSize ?? 10 } })
            .then((res) => {
                setMemberData(res.data);
                setLoading(false)
            })
            .catch((err) => {
                error(err);
                setLoading(false)
            })
    };

    const restoreFromQueryStr = () => {
        const keys = ['notMatchingYn', 'teamCode', 'adminRoleCode', 'authGroupCode', 'keyword', 'pageSize', 'pageNumber'];
        let newObj = {};
        for (const k in ofqs) {
            if (keys.includes(k)) {
                newObj[k] = ofqs[k];
            }
        }
        setSearchCond(newObj);
    };


    /**
     * @name 회원 삭제 
     * @description 회원을 삭제
     * @author 이름
     * @since 2025-05-30 09:33
     * 
     * @param {*} v 
     * @returns 
     */

    const deleteMember = async (record) => {
        console.log('record', record)
        if (record?.userId === undefined || record?.userId === "") {
            return;
        } else if (record?.userId === "visitor") {
            info('방문자 기본 회원 은 삭제불가 합니다.');
            return;
        }

        return await AXIOS.delete(`/api/v1/admin/member/${record?.userId}`)
            .then((resp) => {
                info('회원이 삭제 되었습니다.');
                restoreFromQueryStr();
                dummyClick();
            })
            .catch((err) => {
                error(err);
            });
    }


    const columns = [
        // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: "8%", ellipsis: true, },
        // {
        //     title: '상위팀 명',
        //     dataIndex: 'parentOrgNm',
        //     key: 'parentOrgNm',
        //     width: '8%',
        //     ellipsis: true,
        // },
        // {
        //     title: '상위팀 코드',
        //     dataIndex: 'parentOrgId',
        //     key: 'parentOrgId',
        //     width: '8%',
        //     ellipsis: true,
        // },
        // {
        //     title: '팀 명',
        //     dataIndex: 'orgNm',
        //     key: 'orgNm',
        //     width: '6%',
        //     ellipsis: true,
        // },
        // {
        //     title: '팀 코드',
        //     dataIndex: 'orgId',
        //     key: 'orgId',
        //     width: '6%',
        //     ellipsis: true,
        // },
        // {
        //     title: '이름/직함',
        //     dataIndex: 'userNm',
        //     key: 'userNm',
        //     width: '8%',
        //     ellipsis: true,
        //     render: (_, record) => (
        //         <Space size={2}>
        //             {record.userNm} {record.empGradeNm}{' '}
        //         </Space>
        //     ),
        // },
        {
            title: 'ID',
            dataIndex: 'loginId',
            key: 'loginId',
            width: '8%',
            ellipsis: true,
        },
        {
            title: '이름',
            dataIndex: 'userNm',
            key: 'userNm',
            width: '8%',
            ellipsis: true,
            render: (_, record) => (
                <Space size={2}>
                    {record.userNm}
                </Space>
            ),
        },
        {
            title: '이메일',
            dataIndex: 'mailAddr',
            key: 'mailAddr',
            width: '12%',
            ellipsis: true,
        },
        {
            title: '회원 구분',
            dataIndex: 'adminRoleNm',
            key: 'adminRoleNm',
            width: '8%',
            ellipsis: true,
        },
        {
            title: '전화 번호',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: '8%',
            ellipsis: true,
        },
        {
            title: '계정 활성화 여부',
            dataIndex: 'active',
            key: 'active',
            width: '8%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <>
                        {record ? "활성화" : "비활성화"}
                    </>
                );
            },
        },
        {
            title: '팀 권한 그룹',
            dataIndex: 'authGroupNm',
            key: 'authGroupNm',
            width: '12%',
            ellipsis: true,
        },
        {
            title: '상세보기',
            dataIndex: 'detail',
            key: 'detail',
            width: '4%',
            render: (text, record) => {
                return (
                    <>
                        <CustomTableButton
                            color={"#1677ff"}
                            onClick={() => {
                                navigate(`${location.pathname}/${record.userId}/profile`);
                            }}
                            text={"보기"}
                        />
                    </>
                );
            },
        },
        {
            title: '회원 삭제',
            dataIndex: 'delete',
            key: 'delete',
            width: '4%',
            render: (text, record) => {
                return (
                    <>
                        <Popconfirm
                            title={<div> [{record?.userId}] 해당 회원을 삭제합니다.</div>}
                            description=''
                            okText='확인'
                            cancelText='취소'
                            onConfirm={() => deleteMember(record)}>
                            <Button size='small' type="link" danger disabled={record?.userId === "visitor" || record?.userId === "112190028"}>삭제</Button>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const paginations = {
        current: Number(memberData?.number ?? 0) + 1, // 화면에서 사용시 +1 서버로 요청시엔 -1
        pageSize: memberData?.size ?? 15, // 기본값 15
        total: memberData?.totalElements ?? 0, // 전체 페이지 수
        position: ['bottomCenter'], //페이지 버튼 위치
        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
    };

    const updateFunctions = {
        //권한 그룹 없음 여부
        notMatchingYn: (list) => {
            ofqs['notMatchingYn'] = list === '' ? undefined : list;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //팀
        teamCode: (list) => {
            ofqs['teamCode'] = list === '' ? undefined : list;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //회원구분
        adminRoleCode: (list) => {
            ofqs['adminRoleCode'] = list === '' ? undefined : list;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //권한 그룹
        authGroupCode: (list) => {
            ofqs['authGroupCode'] = list === '' ? undefined : list;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //페이지 사이즈
        pageSize: (list) => {
            ofqs['pageSize'] = list ?? 8;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //페이지 번호
        pageNumber: (list) => {
            ofqs['pageNumber'] = list ?? 0;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //검색어
        keyword: (list) => {
            ofqs['keyword'] = list === '' ? undefined : list;
            ofqs['pageNumber'] = 1;
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
    };

    //url 업데이트
    const updateUrl = (list, type) => {
        const updateFunction = updateFunctions[type];
        if (updateFunction) {
            updateFunction(list);
        }
    };

    const OnTalbeChangeHandler = (pagination, filters, sorter) => {
        updateUrl(pagination?.current, 'pageNumber');
        // navigate(`${location.pathname}?${qs.stringify({ pageNumber: pagination?.current, pageSize: pagination?.pageSize })}`);
    };

    const pageSizeChangeHandler = (e) => {
        updateUrl(e ?? 8, 'pageSize');
    };

    const notMatchingChangeHandler = (e) => {
        updateUrl(e.target.checked ? 'y' : '', 'notMatchingYn');
    };

    const teamChangeHandler = (e) => {
        updateUrl(e ?? '', 'teamCode');
    };

    const adminRoleChangeHandler = (e) => {
        updateUrl(e ?? '', 'adminRoleCode');
    };

    const groupChangeHandler = (e) => {
        updateUrl(e ?? '', 'authGroupCode');
    };

    const keywordChangeHandler = (e) => {
        updateUrl(e ?? '', 'keyword');
    };

    return (
        <>
            <InnerAdminDiv>
                <Row style={{ width: '100%' }} justify={'space-between'} align='middle' gutter={16}>
                    <Col>
                        <Checkbox checked={(searchCond?.notMatchingYn ?? '') === 'y' ? true : false} onChange={notMatchingChangeHandler}>
                            <span style={{ fontSize: 14 }}>권한 그룹 없음</span>
                        </Checkbox>
                    </Col>
                    <Col>
                        <Space size={[16, 8]} wrap>
                            <Select options={pageSizeOptions} value={searchCond?.pageSize ?? 10} onChange={pageSizeChangeHandler}
                                style={{ width: 180 }}
                            ></Select>

                            {/* <Space size={6}>
                                <label style={{ fontSize: 14, }}>팀 : </label>
                                <Select
                                    style={{ width: 180, }}
                                    value={searchCond?.teamCode ?? ''}
                                    onChange={teamChangeHandler}
                                    showSearch
                                    optionFilterProp='children'
                                    filterOption={(input, option) => (option.label ?? '').includes(input)}
                                    options={teamList ?? []}
                                    allowClear
                                >
                                </Select>
                            </Space> */}

                            <Space size={6}>
                                <label style={{ fontSize: 14, }}>회원구분 : </label>
                                <Select
                                    style={{ width: 180, }}
                                    value={searchCond?.adminRoleCode ?? ''}
                                    onChange={adminRoleChangeHandler}
                                    allowClear>
                                    <Option key='0' value='' name='all'>
                                        전체
                                    </Option>
                                    {userDisvList?.map((elem, idx) => (
                                        <Option key={idx + 1} value={elem.value} name={elem.value}>
                                            {elem.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Space>
                            <Space size={6}>
                                <label style={{ fontSize: 14, }}>팀 권한 그룹 : </label>
                                <Select
                                    style={{ minWidth: 180, }}
                                    value={searchCond?.authGroupCode ?? ''}
                                    onChange={groupChangeHandler}
                                    showSearch
                                    optionFilterProp='children'
                                    filterOption={(input, option) => (option.label ?? '').includes(input)}
                                    options={matchGroupList ?? []}
                                    allowClear />
                            </Space>
                            <Input.Search allowClear style={{ width: 256 }} onSearch={keywordChangeHandler} placeholder='이름 혹은 이메일로 검색' />
                        </Space>
                    </Col>
                </Row>
                <StyledAdminTable
                    dataSource={memberData?.content ?? []}
                    columns={columns}
                    size='small'
                    loading={loading}
                    pagination={paginations}
                    onChange={OnTalbeChangeHandler}
                    style={{ marginTop: 24 }}
                />
            </InnerAdminDiv>
        </>
    );
};

export default AdminMemberList;