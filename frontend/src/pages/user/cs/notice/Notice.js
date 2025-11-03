import { useState, useEffect, useRef } from "react";
import { Flex, Typography } from 'antd';
import { PushpinFilled } from "@ant-design/icons";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import styled, { css } from "styled-components";
import { SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows, SUSearchInput, SUTabel } from "styles/StyledUser";
import { LuSearch } from "react-icons/lu";
import { mediaWidth, SFEm, SFMedia } from "styles/StyledFuntion";
import LoadingSpinner from "components/common/LoadingSpinner";


export const Notice = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();

    const [data, setData] = useState([]); // 게시판 데이터
    const [loading, setLoading] = useState(false); // 로딩관련
    const [searchKeyword, setSearchKeyword] = useState(ofqs?.keyword ?? '');

    const menu1 = 'cs-center';
    const menu2 = 'notice';

    useEffect(() => {
        getData();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async (params) => {
        setLoading(true);
        params = {
            pageNumber: Number(ofqs?.page ?? 1) - 1,
            pageSize: ofqs?.size ?? 10,
            openType: ofqs?.openType ?? undefined,
            keyword: ofqs?.keyword ?? undefined,
        }
        await AXIOS.get(`/api/v1/user/cs/bbs/${menu2}`, { params })
            .then((resp) => {
                setData(resp?.data ?? []);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, keyword: ofqs?.keyword })}`);
    };

    // 폐이징처리  
    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ page: page, size: pageSize, keyword: ofqs?.keyword })}`);
    };

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue.trim() })}`);
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'id',
            width: 72
        },

        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            width: '632px',
            align: 'left',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <NavLink to={`/${menu1}/${menu2}/${record.id}`}>
                            <Flex gap={4}>
                                {record.noticeType ? <PushpinFilled style={{ color: '#EA1D22', fontSize: 11 }} /> : null}
                                <Typography.Text ellipsis={true}>{record.title}</Typography.Text>
                            </Flex>
                        </NavLink>
                    </>
                )
            }),
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            key: 'createUserNm',
            width: '90px',
            align: 'left',
        },
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '130px',
        },
    ]


    return (
        <NoticeSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} >
                    <SUBoardHeaderWrap>
                        <SUSearchInput
                            enterButton={<LuSearch className='input-icon' />}
                            placeholder='검색어를 입력하세요'
                            onSearch={onSearch}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            value={searchKeyword}
                        />
                    </SUBoardHeaderWrap>

                    <SUTabel
                        columns={columns}
                        rowKey={(record) => record?.id}
                        dataSource={data?.content ?? []}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        size="small"
                    />
                    {!loading &&
                        < SUPaginationWithArrows
                            onChange={handlePageChange}
                            current={Number(data?.number ?? 0) + 1}
                            pageSize={data?.pageSize ?? 10}
                            total={data?.totalElements}
                            position={'bottomCenter'}
                            showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                            showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                        />}
                </LoadingSpinner>
            </SUInner1280>
        </NoticeSection>
    );


}

const NoticeSection = styled.section`
    .board-headerWrap{
        justify-content: flex-end !important;
        margin-bottom: ${SFEm(24)};
    }
${SFMedia('mo-l', css`
    .board-headerWrap{display: flex}
`)};
`;