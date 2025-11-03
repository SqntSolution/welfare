import { useState, useEffect, useRef } from "react";
import { Table, Select, Button, Row, Col, Spin, Space, Typography, Input, Checkbox } from 'antd';
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { StyledSearch } from "styles/StyledCommon";
import { SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows, SUSearchInput, SUSearchInputFilter, SUTabel, SUText14 } from "styles/StyledUser";
import LoadingSpinner from "components/common/LoadingSpinner";
import { LuSearch } from "react-icons/lu";
import styled, { css } from "styled-components";
import { SFEm, SFMedia } from "styles/StyledFuntion";
import { useUserInfo } from "hooks/useUserInfo";

//const { confirm } = Modal;

export const Qna = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { error, info } = useMsg();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const userInfo = useUserInfo();
    const [typeList, setTypeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [optionValue, setOptionValue] = useState();
    const [searchCondition, setSearchCondition] = useState({});

    const menu1 = 'cs-center';
    const menu2 = 'qna';

    const isChecked = searchCondition?.onlyMyOwn === true || searchCondition?.onlyMyOwn === "true";

    useEffect(() => {
        getData();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async () => {
        setLoading(true);

        // 공통코드 먼저 조회
        await getGroupCode('QNA_TYPE');

        const params = {
            pageNumber: Number(ofqs?.page ?? 1) - 1,
            pageSize: ofqs?.size ?? 10,
            metaDivision: ofqs?.metaDivision,
            keyword: ofqs?.keyword,
            onlyMyOwn: ofqs?.onlyMyOwn
        }

        await AXIOS.get(`/api/v1/user/cs/${menu2}`, { params })
            .then((resp) => {
                const resData = resp.data;
                setSearchCondition(params);
                setData(resData);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    //공통코드 호출 
    const getGroupCode = async (type) => {
        await AXIOS.get(`/api/v1/common/code-render/${type}`)
            .then((resp) => {
                setTypeList([{ value: '', label: '전체' }, ...resp?.data]);
                setOptionValue(ofqs.metaDivision);
            })
            .catch((err) => {
                error(err);
            });
    };

    // 폐이징처리  
    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: page, size: pageSize })}`);
    };

    //검색기능
    const onSearch = (searchValue) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 10, keyword: searchValue?.trim() })}`);
    }

    //샐렉트 박스 선택
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 10, metaDivision: value })}`);
    }

    const onClickQna = () => {
        if (userInfo?.role === "ROLE_VISITOR") {
            navigate(`/login`)
        } else {
            navigate(`${location.pathname}/new`)
        }
    }

    // 내 문의
    const handleMyQna = (e) => {
        const onlyMyOwn = e.target.checked;
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: 1, size: ofqs?.pageSize ?? 10, onlyMyOwn: onlyMyOwn })}`);
    }

    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '130px',
            // align: 'center',
            ellipsis: true,
        },
        {
            title: '구분',
            dataIndex: 'metaDivisionNm',
            key: 'metaDivisionNm',
            width: '100px',
            // align: 'center',
            ellipsis: true,
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            width: '432px',
            align: 'left',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <NavLink
                            state={{ readonly: true }} // state를 객체로 래핑
                            to={{
                                pathname: `/${menu1}/${menu2}/${record.id}`,

                            }}
                        >
                            <SUText14 ellipsis={true}>{record.title}</SUText14>
                        </NavLink>
                    </>
                )
            }),
        },
        {
            title: '상태',
            dataIndex: 'responseYn',
            key: 'responseYn',
            width: '80px',
            // align: 'center',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <span style={{ color: record.responseYn ? "#52C41A" : "#BFBFBF" }}>
                        {record.responseYn ? '답변 완료' : '문의 접수'}
                    </span>
                )
            }),
        },
        {
            title: '작성자',
            dataIndex: 'createUserNm',
            key: 'createUserNm',
            width: '70px',
            align: 'left',
            ellipsis: true,
        },
    ];

    return (
        <QnaSection>
            <SUInner1280>
                <LoadingSpinner loading={loading}>
                    <SUBoardHeaderWrap>
                        {userInfo?.role !== "ROLE_VISITOR" && <Checkbox onChange={(e) => { handleMyQna(e) }} checked={isChecked} className="ch-my-qna">내 문의</Checkbox>}
                        <SUSearchInputFilter
                            placeholder="검색어를 입력하세요."
                            onSearch={onSearch}
                            enterButton={<LuSearch className='input-icon' />}
                            // allowClear='true'
                            value={searchCondition?.keyword}
                            onChange={(e) => { setSearchCondition({ ...searchCondition, keyword: e.target.value }) }}
                            addonBefore={<Select popupMatchSelectWidth={false} value={optionValue ?? ''} onChange={handleChange} align='left' options={typeList ?? []} />}
                        />
                        <Button type="primary"
                            onClick={() => onClickQna()}
                        >
                            문의등록
                        </Button>
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
                        <SUPaginationWithArrows
                            onChange={handlePageChange}
                            current={Number(data?.number ?? 0) + 1}
                            pageSize={data?.pageSize ?? 10}
                            total={data?.totalElements}
                            position={'bottomCenter'}
                            showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                            showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                        />
                    }
                </LoadingSpinner>
            </SUInner1280>
        </QnaSection>
    );
}

const QnaSection = styled.section`
    .board-headerWrap{
        justify-content: flex-end !important;
    }
    .ant-input-group-wrapper{
        width: ${SFEm(420)};
    }
    .ch-my-qna{
        display: flex;
        align-items: center;
    }
${SFMedia('mo-l', css`
    .board-headerWrap{display: flex}
`)};
`;