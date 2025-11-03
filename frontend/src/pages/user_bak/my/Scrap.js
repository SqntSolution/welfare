/**
 * @format
 */
import { useEffect, useState } from "react";
import { Button, Col, Row, Table, message } from "antd";
import Search from "antd/es/input/Search";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import qs from 'qs';
import { AXIOS } from "utils/axios";
import { ColTitle, InnerDiv } from "styles/StyledCommon";
import { BookMarkFill, BookMarkLine } from "components/common/IconComponets";
import styled from "styled-components";
import { useMsg } from "hooks/helperHook";


export const Scrap = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [searchString, setSearchString] = useState('');

    // 행의 삭제 상태를 관리
    const [deletedRows, setDeletedRows] = useState([]);
    const { error, info } = useMsg();


    useEffect(() => {
        getData();
        setSearchString(ofqs?.keyword);
    }, [location.search]);

    const getData = () => {
        setLoading(true);
        setDeletedRows([]);
        AXIOS.get(`/api/v1/user/my/scrap`, { params: { pageNumber: Number(ofqs?.page ?? 1) - 1, pageSize: ofqs?.size ?? 15, keyword: ofqs?.keyword } })
            .then((resp) => {
                setData(resp?.data);
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    }

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
            render: ((_, record) => {
                return (
                    <span>{record?.menu2Nm !== '' ? `${record?.menu1Nm} > ${record?.menu2Nm}` : `${record?.menu1Nm}`}</span>
                )
            })
        },
        {
            title: '콘텐츠 제목',
            dataIndex: 'title',
            key: 'title',
            render: ((text, record) => {
                return (
                    <NavLink
                        to={`/post/${record.postId}`}
                        style={{ color: ' rgba(0, 0, 0, 0.85)', }}
                    >
                        {text}
                    </NavLink>
                )
            })
        },
        {
            title: <BookMarkLine />,
            dataIndex: 'isScraped',
            key: 'isScraped',
            width: 50,
            align: 'center',
            render: ((text, record) => {
                return (
                    <StyledButton
                        style={{ width: '100%' }}
                        type='text'
                        onClick={() => onScrapClicked(record)}
                    >
                        {
                            deletedRows.includes(record.postId) ? <BookMarkLine /> : <div className="BookmarkFill"><BookMarkFill /></div>
                        }
                    </StyledButton>)
            })
        }
    ];

    /**
     * 스크랩 이벤트
     * @param {*} record 
     */
    const onScrapClicked = (record) => {
        const postId = record.postId;
        if (deletedRows.includes(postId)) { // 취소상태인 경우
            AXIOS.post(`/api/v1/common/scrap/${postId}`)
                .then(res => {
                    if (res.status === 200) {
                        setDeletedRows(prev => prev.filter(id => id !== postId));
                        info('스크랩 되었습니다.');
                    }
                }).catch(err => {
                    error(err);
                })
        } else { // 취소상태가 아닌경우
            AXIOS.post(`/api/v1/common/scrap/${postId}`)
                .then(res => {
                    if (res.status === 200) {
                        setDeletedRows(prev => [...prev, postId]);
                        error('스크랩이 해제 되었습니다.');
                    }
                }).catch(err => {
                    error(err);
                })
        }
    }

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
    }

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

    const rowClassName = (record) => {
        if (deletedRows.includes(record.postId)) {
            return 'deleted-row';
        }
        return '';
    }


    return (
        <InnerDiv>
            <Row align={'middle'}>
                <ColTitle
                    span={3}
                    style={{
                        fontSize: 16,
                        fontWeight: 500,
                        background: 'transparent',
                        border: 0,
                        textAlign: 'left',
                        paddingTop: 16,
                        paddingBottom: 16
                    }}
                >
                    Scrap
                </ColTitle>
                <Col span={21} align="right">
                    <Search
                        placeholder="검색어를 입력하세요."
                        onSearch={onSearch}
                        style={{
                            width: '234px',
                            marginBottom: '20px',
                        }}
                        allowClear='true'
                        value={searchString}
                        onChange={(data) => { setSearchString(data.value) }}
                    />
                </Col>
            </Row>
            <StyledTable
                size='small'
                columns={columns}
                dataSource={data?.content ?? []}
                pagination={paginations}
                loading={loading}
                onChange={handleTableChange}
                rowClassName={rowClassName}
                style={{
                    width: '100%',
                    textAlign: 'left',
                    fontSize: 14
                }}
            />
        </InnerDiv>
    )
};
const StyledButton = styled(Button)`
    .BookmarkFill svg path {fill :#EB2D2B }
`;

const StyledTable = styled(Table)`
&.ant-table-wrapper .ant-table.ant-table-small{font-size:14px; color: rgba(0, 0, 0, 0.85)}

&.ant-table-wrapper .ant-table.ant-table-small .ant-table-title,
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:12px}
`;

