/**
 * @format
 */
import { DatePicker, Button, Col, Flex, Modal, Popconfirm, Row, Select, Space, Table, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import dayjs from 'dayjs';
import { StyledAdminTable, StyledNavLink } from 'styles/StyledCommon';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const AdminMemberPost = (props) => {
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    const [data, setData] = useState(); // 화면 데이터
    const [commoncode, setCommoncode] = useState(); // 셀렉트박스 공통코드
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();
    const [dateValues, setDateValues] = useState([]);
    //화면 첫로드시 수행
    useEffect(() => {
        getData();
    }, [location.search]);

    useEffect(() => {
        getGroupCode();
    }, []);

    ///api/v1/common/code?groupCode=MYPOST_TYPE
    const getGroupCode = () => {
        AXIOS.get(`/api/v1/common/code`, { params: { groupCode: 'MYPOST_TYPE' } })
            .then((resp) => {
                setCommoncode([
                    {
                        value: '',
                        label: '전체',
                    },
                    ...resp.data.map((elem) => {
                        return {
                            value: elem?.code,
                            label: elem?.label,
                        };
                    }),
                ]);
            })
            .catch((err) => {
                error(err);
            });
    };

    const getData = () => {
        //openType은 private(비공개), public(공개), temp(임시저장)
        AXIOS.get(`/api/v1/admin/member/${userId}/post`, {
            params: {
                pageNumber: Number(ofqs?.page ?? 1) - 1,
                pageSize: ofqs?.size ?? 10,
                openType: ofqs?.openType ?? [null],
                keyword: ofqs?.keyword,
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

    const columns = [
        {
            title: '기록 일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            // align: 'center',
        },
        {
            title: '카테고리',
            dataIndex: 'cateGory',
            key: 'cateGory',
            width: 200,
            // align: 'center',
            onCell: () => ({
                style: { whiteSpace: 'nowrap' },
            }),
            render: (text, record) => {
                return <span>{record.menuNm2 !== '' ? `${record.menuNm1} > ${record.menuNm2}` : `${record.menuNm1}`}</span>;
            },
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <>
                        <StyledNavLink to={`/post/${record?.id}`}>{record?.title}</StyledNavLink>
                    </>
                );
            },
        },
        {
            title: 'View',
            dataIndex: 'viewCnt',
            key: 'viewCnt',
            width: 100,
            // align: 'center',
        },
        {
            title: '공개',
            dataIndex: 'openType',
            key: 'openType',
            width: 100,
            // align: 'center',
            render: (text, record) => (
                <span
                    style={{
                        color: `${record.openType === 'public' ? 'rgba(0, 0, 0, 0.85)' : record.openType === 'private' ? 'rgba(0, 0, 0, 0.45)' : '#D48806'}`,
                    }}>
                    {commoncode?.find((elem) => elem.value === record.openType)?.label}
                </span>
            ),
        },
        {
            title: '수정',
            dataIndex: 'edit',
            key: 'edit',
            // align: 'center', // 텍스트를 가운데 정렬
            width: 100,
            render: (text, record) => {
                return (
                    <Button
                        style={{
                            color: 'blue',
                        }}
                        type='text'
                        onClick={() => navigate(`/post/edit/${record.id}`)}>
                        수정
                    </Button>
                );
            },
        },
        {
            title: '삭제',
            dataIndex: 'delete',
            key: 'delete',
            // align: 'center', // 텍스트를 가운데 정렬
            width: 100,
            render: (text, record) => (
                <Popconfirm title='콘텐츠 삭제' description='정말로 삭제하시겠습니까?' okText='삭제' cancelText='취소' onConfirm={() => deleteClick(record)}>
                    <Button
                        style={{
                            color: 'red',
                        }}
                        type='text'>
                        삭제
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    //삭제기능
    const deleteClick = (record) => {
        AXIOS.delete(`/api/v1/admin/member/post/${record.id}`)
            .then((res) => {
                info('Post가 삭제되었습니다.');
                getData();
            })
            .catch((err) => {
                error(err);
                getData();
            });
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(
            `${location.pathname}?${qs.stringify({
                page: pagination?.current,
                size: pagination?.pageSize,
                keyword: ofqs?.keyword?.trim(),
                openType: ofqs?.openType,
            })}`
        );
    };

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue.trim(), openType: ofqs?.openType })}`);
    };

    //샐렉트 박스 체인지 검색기능
    const handleChange = (value, option) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 10, keyword: ofqs?.keyword?.trim(), openType: value })}`);
    };


    // 데이터피커 
    const onDateChange = (dates, dateStrings) => {
        setDateValues(dates);
        navigate(`${location.pathname}?${qs.stringify({ startDate: dateStrings[0], endDate: dateStrings[1] })}`);
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

    //openType은 private(비공개), public(공개), temp(임시저장)
    return (
        <>
            <Row style={{ marginBottom: 32 }}>
                {/* 타이틀 */}
                <Col span={4}>
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{props?.title}</Typography.Title>
                </Col>
                <Col span={20} align="right">
                    {/* <span style={{ display: 'iline-block', color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}>공개 :</span> */}
                    <Space size={[16, 8]}>
                        {/* <Space>
                            <span>기록 : </span>
                            <RangePicker onChange={onDateChange} value={dateValues} presets={rangePresets} />
                        </Space> */}
                        <Space>
                            <span>공개 : </span>
                            <Select style={{ textAlign: 'left', width: 210 }} onChange={handleChange} defaultValue='전체' options={commoncode} />
                        </Space>
                        <Search
                            placeholder='검색어를 입력하세요.'
                            onSearch={onSearch}
                            style={{
                                width: '400px',
                            }}
                            allowClear='true'
                        />
                    </Space>
                </Col>
            </Row>
            <StyledAdminTable
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={data?.content ?? []}
                pagination={{
                    current: Number(data?.number ?? 0) + 1,
                    pageSize: data?.size ?? 10,
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

export default AdminMemberPost;
