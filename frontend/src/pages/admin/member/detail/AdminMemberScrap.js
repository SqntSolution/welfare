/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Col, Flex, Row, Table, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import qs from 'qs';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { StyledAdminTable, StyledNavLink } from 'styles/StyledCommon';

export const AdminMemberScrap = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { userId } = useParams();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [searchString, setSearchString] = useState('');
    const { error, info } = useMsg();

    useEffect(() => {
        getData();
        setSearchString(ofqs?.keyword);
    }, [location.search]);

    const getData = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/admin/member/${userId}/scrap`, {
            params: { pageNumber: Number(ofqs?.page ?? 1) - 1, pageSize: ofqs?.size ?? 15, keyword: ofqs?.keyword },
        })
            .then((resp) => {
                setData(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    };

    const columns = [
        {
            title: '스크랩 일시',
            dataIndex: 'createdAt',
            width: 200,
            key: 'createdAt',
        },
        {
            title: '카테고리',
            dataIndex: 'menuNm',
            width: 250,
            key: 'menuNm',
            render: (_, record) => {
                return <span>{record?.menu2Nm !== '' ? `${record?.menu1Nm} > ${record?.menu2Nm}` : `${record?.menu1Nm}`}</span>;
            },
        },
        {
            title: '콘텐츠 제목',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                return (
                    <StyledNavLink to={`/post/${record.postId}`}>
                        {text}
                    </StyledNavLink>
                );
            },
        },
    ];

    /**
     * 검색 이벤트
     * @param {*} searchValue
     */
    const onSearch = (searchValue, e) => {
        searchValue = searchValue.trim();
        setSearchString(searchValue);
        if (searchValue?.length > 0) {
            navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 15, keyword: searchValue })}`);
        } else {
            navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 15 })}`);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize })}`);
    };

    const paginations = {
        current: Number(data?.number ?? 0) + 1, // 화면에서 사용시 +1 서버로 요청시엔 -1
        pageSize: data?.size ?? 15, // 기본값 15
        total: data?.totalElements ?? 0, // 전체 페이지 수
        position: ['bottomCenter'], //페이지 버튼 위치
        showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
        showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
    };

    return (
        <div style={{ width: '100%' }}>
            <Row style={{ marginBottom: 32 }}>
                <Col span={4}>
                    <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>{props?.title}</Typography.Title>
                </Col>
                <Col span={20} align='right'>
                    <Search
                        placeholder='검색어를 입력하세요.'
                        onSearch={onSearch}
                        style={{
                            width: 522,
                            margin: 0,
                        }}
                        allowClear='true'
                        value={searchString}
                        onChange={(data) => {
                            setSearchString(data.value);
                        }}
                    />
                </Col>
            </Row>
            <StyledAdminTable
                bordered
                size='small'
                columns={columns}
                dataSource={data?.content ?? []}
                pagination={paginations}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default AdminMemberScrap;
