/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Breadcrumb, Button, ConfigProvider, Flex, Popconfirm, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { AXIOS } from 'utils/axios';
import qs from 'qs';
import { InnerAdminDiv, StyledAdminTable, StyledNavLink, StyledTableButton } from 'styles/StyledCommon';
import { useMsg } from 'hooks/helperHook';

export const AdminAlarmList = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [dataSource, setDataSource] = useState([]);
    const [dummy, setDummy] = useState(0);
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();

    useEffect(() => {
        dummyClick();
    }, [location]);

    const dummyClick = () => {
        setDummy((prev) => prev + 1);
    };

    useEffect(() => {
        if (dummy > 0) {
            getData();
        }
    }, [dummy]);

    const getData = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/admin/alarm`, { params: { ...ofqs, pageSize: ofqs?.pageSize ?? 10, pageNumber: (ofqs?.pageNumber ?? 1) - 1 } })
            .then((res) => {
                setDataSource(res.data ?? []);
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const columns = [
        {
            key: 'id',
            title: '번호',
            dataIndex: 'id',
            width: 70,
        },
        {
            key: 'sendTitle',
            title: '제목',
            dataIndex: 'sendTitle',
            // align: 'center',
            render: (text, record) => {
                return <StyledNavLink to={`./edit/${record.id}`}>{text}</StyledNavLink>;
            },
        },
        {
            key: 'targetTeamCount',
            title: '팀',
            dataIndex: 'targetTeamCount',
            // align: 'center',
            width: 100,
        },
        {
            key: 'targetUserCount',
            title: '개인',
            dataIndex: 'targetUserCount',
            // align: 'center',
            width: 100,
        },
        {
            key: 'sentAt',
            title: '발송 일시',
            dataIndex: 'sentAt',
            // align: 'center',
            width: 150,
        },
        {
            key: 'scheduleSendAt',
            title: '예약 일시',
            dataIndex: 'scheduleSendAt',
            // align: 'center',
            width: 150,
            render: (text, record) => {
                return <>{record?.useScheduleSend ? record?.scheduleSendAt : record?.sentAt}</>;
            },
        },
        {
            key: 'sendStatus',
            title: '상태',
            dataIndex: 'sendStatus',
            // align: 'center',
            width: 100,
        },
        {
            key: 'createdUserNm',
            title: '발송자',
            dataIndex: 'createdUserNm',
            // align: 'center',
            width: 100,
        },
        {
            key: 'delete',
            title: '삭제',
            dataIndex: 'delete',
            // align: 'center',
            width: 100,
            render: (text, record) => {
                return (
                    <Popconfirm title='알림을 삭제합니다.' okText='확인' cancelText='취소' onConfirm={() => deleteOnClick(record?.id)}>
                        <StyledTableButton type='link' danger disabled={record?.sentAt}>
                            삭제
                        </StyledTableButton>
                    </Popconfirm>
                );
            },
        },
    ];

    const deleteOnClick = async (sendId) => {
        return await AXIOS.delete(`/api/v1/admin/alarm/${sendId}`)
            .then((res) => {
                info('삭제되었습니다.');
                navigate(`/admin/alarm`);
            })
            .catch((err) => {
                error(err);
            });
    };

    const tableChange = (pagination, filters, sorter) => {
        navigate(`${location.pathname}?${qs.stringify({ pageNumber: pagination?.current })}`);
    };

    const breadcrumbItems = [{ title: 'Home' }, { title: '알림' }, { title: '목록' }];

    const paginations = {
        current: Number(ofqs?.pageNumber ?? 1), // 화면에서 사용시 +1 서버로 요청시엔 -1
        pageSize: ofqs?.pageSize ?? 10, // 기본값 10
        total: dataSource?.totalElements ?? 0, // 전체 페이지 수
        position: ['bottomCenter'], //페이지 버튼 위치
        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
    };
    return (
        <>
            <CustomAdminTitle title={'알림'} items={breadcrumbItems} />
            <InnerAdminDiv>
                <Flex justify='space-between' align='end' style={{ marginBottom: 24 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        발송 목록
                    </Typography.Title>
                    <Button onClick={() => navigate(`./new`)} type="primary" style={{ width: 104 }} >
                        추가
                    </Button>
                </Flex>
                <StyledAdminTable
                    loading={loading}
                    dataSource={dataSource?.content ?? []}
                    columns={columns ?? []}
                    size='small'
                    rowKey='id'
                    pagination={paginations}
                    onChange={tableChange}
                />
            </InnerAdminDiv>
        </>
    );
};

export default AdminAlarmList;
