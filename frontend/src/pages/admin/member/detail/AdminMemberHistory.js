/**
 * @format
 */
import { Col, DatePicker, Flex, Row, Select, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { StyledAdminTable, StyledNavLink } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';
const { RangePicker } = DatePicker;

export const AdminMemberHistory = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { userId } = useParams();

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(); // historydata
    const [typeCode, setTypeCode] = useState(); //검색 타입
    const [dateValues, setDateValues] = useState([]);
    const [selectedTypeCode, setSelectedTypeCode] = useState();
    const [dummy, setDummy] = useState(0);
    const { error, info } = useMsg();

    //로딩시에 초기값 세팅
    useEffect(() => {
        getGroupCode();
    }, []);

    //검색 시 조회
    useEffect(() => {
        restoreFromQueryStr();
        setDummy(prev => prev + 1);
        // getData();
    }, [location.search]);

    useEffect(() => {
        if (dummy > 0) {
            getData();
        }
    }, [dummy]);

    const restoreFromQueryStr = () => {
        setSelectedTypeCode(ofqs?.typeCode ?? '');
        const dum = ofqs?.startDate && ofqs?.endDate ? [dayjs(ofqs?.startDate) ?? null, dayjs(ofqs?.endDate) ?? null] : [];
        setDateValues(dum);
    }

    //화면 데이터 조회 api
    const getData = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/admin/member/${userId}/history`, {
            params: {
                pageNumber: Number(ofqs?.page ?? 1) - 1,
                pageSize: ofqs?.size ?? 15,
                typeCode: ofqs?.typeCode ?? '',
                startDate: ofqs?.startDate ?? '',
                endDate: ofqs?.endDate ?? '',
            },
        })
            .then((resp) => {
                setData(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    //그룹코드 조회
    const getGroupCode = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/history/type`)
            .then((res) => {
                setTypeCode([{ label: '전체', value: '' }, ...res.data]);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const columns = [
        {
            title: '기록일시',
            dataIndex: 'createdAt',
            width: 250,
            key: 'createdAt',
            // fixed: 'left',
            ellipsis: true,
        },
        {
            title: '항목',
            dataIndex: 'actionName',
            width: 250,
            key: 'actionName',
            ellipsis: true,
        },
        {
            title: '기록내용',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text, record) => {
                const prefix = record?.actionType?.includes('qna_') ? `/main/cs-center/qna` : `/post`;
                return record?.postTitle ? (
                    <>
                        <StyledNavLink to={`${prefix}/${record?.postId}`}>[{record?.postTitle}]</StyledNavLink>
                        <span>&nbsp;&nbsp; {record?.description}</span>
                    </>
                ) : (
                    record?.description
                );
            },
        },
    ];

    //폐이징처리
    const handleTableChange = (pagination, filters, sorter) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: pagination?.current })}`);
    };

    //샐렉트 박스 값 변경 이벤트
    const handleChange = (value, option) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 15, typeCode: option?.value })}`);
    };

    const onDateChange = (dates, dateStrings) => {
        setDateValues(dates);
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, startDate: dateStrings[0] ?? undefined, endDate: dateStrings[1] ?? undefined })}`);
    };

    const rangePresets = [
        {
            label: '오늘',
            value: [dayjs(), dayjs()],
        },
        {
            label: '7일',
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: '14일',
            value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
            label: '30일',
            value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
            label: '90일',
            value: [dayjs().add(-90, 'd'), dayjs()],
        },
    ];

    return (
        <>
            <Row justify='end' style={{ marginBottom: '32px' }}>
                {/* 티이틀 */}
                <Col span={4}>
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{props?.title}</Typography.Title>
                </Col>
                <Col span={20} align='right'>
                    <Space>
                        <span>기록 : </span>
                        <RangePicker onChange={onDateChange} value={dateValues} presets={rangePresets} />
                        <span>항목 : </span>
                        <Select style={{ textAlign: 'left', width: '210px' }} onChange={handleChange} value={selectedTypeCode} defaultValue='' options={typeCode} />
                    </Space>
                </Col>
            </Row>
            <StyledAdminTable
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={data?.content ?? []}
                pagination={{
                    current: Number(data?.number ?? 0) + 1,
                    pageSize: data?.size ?? 15,
                    total: data?.totalElements ?? 0,
                    position: ['bottomCenter'], //페이지 버튼 위치
                    showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
                    showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
                }}
                loading={loading}
                onChange={handleTableChange}
                size='small'
            />
        </>
    );
};

export default AdminMemberHistory;
