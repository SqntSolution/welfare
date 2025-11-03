// 사용자 전환 페이지 - 사용자를 바꿔서 테스트 하기 위해서
import { useEffect, useState } from 'react';
import { Space, Table, Tag, Segmented, Button, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { useUserInfo } from 'hooks/useUserInfo'
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledAdminTable } from 'styles/StyledCommon';

import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";

export const UserSwitchingPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [origData, setOrigData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const { error, info } = useMsg()
    const userInfo = useUserInfo()

    useEffect(() => {
        const s = searchText
        if (s != "") {
            // setData(origData.filter(e => (e.userId?.includes(s) || e.dutyNm?.includes(s) || e.orgNm?.includes(s) || e.userNm?.includes(s)) || e.adminRole?.includes(s) || e.authGroupNm?.includes(s)))
            setData(origData.filter(e => (e.userId?.includes(s) || e.userNm?.includes(s)) || e.adminRoleNm?.includes(s) || e.authGroupNm?.includes(s)))
        } else {
            setData([...origData])
        }
    }, [origData, searchText])

    const columns = [
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        { title: 'userId', dataIndex: 'userId', key: 'userId', width: "30%", ellipsis: true, },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "20%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "20%", },
        { title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%", render: (_, record) => (<>{record ? "활성화" : "비활성화"}</>) },
        { title: '회원 구분', dataIndex: 'adminRoleNm', key: 'adminRoleNm', width: "20%", render: (_, record) => (<div>{record?.adminRoleNm}</div>), },
        { title: '팀 권한 그룹', dataIndex: 'authGroupNm', key: 'authGroupNm', width: '25%', render: (_, record) => (<div> {record.authGroupNm} </div>), },
        {
            title: '전환', dataIndex: 'detail', key: 'detail', width: '10%',
            render: (text, record) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                switchUser(record?.userId, record?.userNm)
                            }}>
                            전환
                        </Button>
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        setLoading(true);
        AXIOS.post(`/api/v1/admin/dummy/user-switch/list`)
            .then((resp) => {
                const data = resp?.data?.content ?? []
                setOrigData(data)
            })
            .catch((err) => {
                error(err)
            })
            .finally(() => setLoading(false));
    };

    /**
     * @name switchUser
     * @description  SWITCH_USER
     * @author 이름
     * @since 2025-06-09 10:23
     * 
     * @param {*} v 
     * @returns 
     */
    const switchUser = (userId, name) => {
        setLoading(true);
        AXIOS.post(`/api/v1/admin/dummy/user-switch/login/${userId}`)
            .then((resp) => {
                info(`전환되었음. ${name} (${userId}) `)
                try {
                    AXIOS.post(`/api/v1/common/login/loginw`);
                    localStorage.setItem("SWITCH_USER", Date.now().toString());
                }
                catch (err) {
                    error(err);
                }
                setLoading(false)
            })
            .catch((err) => {
                error(err)
                setLoading(false)
            })
    };


    const breadcrumb = [
        { title: 'Home' },
        { title: '사용자 전환' },
    ];

    return (
        <>
            <CustomAdminTitle title={'사용자 전환 (권한 테스트를 위해서)'} items={breadcrumb} />
            <InnerAdminDiv>

                {/* <Row justify='end' style={{width: '100%',}} >
                    <Col span={18}> */}
                {/* 내 정보 : (id:{userInfo?.id}) (name:{userInfo?.name}) (role:{userInfo?.role})
                    (strategicMarketingGroupYn : {JSON.stringify(userInfo?.strategicMarketingGroupYn)})
                    (contentsManagerAuthMenuNames : {JSON.stringify(userInfo?.contentsManagerAuthMenuNames)}) */}
                {/* </Col>
                    <Col span={6}>
                        
                    </Col>
                    <Col span={24}>
                    </Col>
                </Row> */}
                <Flex justify='end' style={{ marginBottom: 24 }}>
                    <Input.Search
                        placeholder="사번, 이름, 회원구분 으로 검색"
                        allowClear
                        onChange={e => setSearchText(e.target.value)}
                        style={{
                            width: 304,
                        }}
                    />
                </Flex>
                <StyledAdminTable dataSource={data} columns={columns} size='small' loading={loading}
                    pagination={{ showSizeChanger: true, defaultPageSize: 10, pageSizeOptions: [10, 15, 20, 40] }}
                />
            </InnerAdminDiv>

        </>
    )
}


