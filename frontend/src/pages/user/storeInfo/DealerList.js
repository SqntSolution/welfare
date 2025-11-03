/**
 * @file DealerList.js
 * @description 매장안내 > 대리점 리스트 페이지
 * @author 김단아
 * @since 2025-06-05 16:58
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-05 16:58    김단아       최초 생성
 * 2025-06-30 17:18    이병은       대리점 조회 추가
 * 2025-07-03 16:27    이병은       전체 조회 기능 추가
 **/

import { Flex, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SComLinkBtn } from 'styles/StyledCommon';
import { SFEm } from 'styles/StyledFuntion';
import { SUBoardHeader, SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows, SUSearchInputFilter, SUTabel } from 'styles/StyledUser';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { deviceInfoState } from 'atoms/atom';
import { useRecoilValue } from 'recoil';

const DealerList = () => {
    const { menu1, menu2, detail } = useParams();
    const [sido, setSido] = useState(null);
    const [sigungu, setSigungu] = useState(null);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const { info, error } = useMsg();
    const [gubun, setGubun] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [selectOptions, setSelectOptions] = useState([]);
    const [searchCondition, setSearchCondition] = useState({});
    const deviceInfo = useRecoilValue(deviceInfoState);
    const [mobileColumns, setMobileColumns] = useState([]);

    useEffect(() => {
        getColumns();
        // page, size 제외한 첫 번째 동적 key 추출
        const filteredKeys = Object.keys(ofqs).filter(
            (key) => key !== 'page' && key !== 'size'
        );

        if (filteredKeys.length > 0) {
            setGubun(filteredKeys[0]); // 첫 번째 동적 키만 사용
        } else {
            setGubun('keywords');
        }
    }, [location]);

    // 컬럼 정보 가져오기
    const getColumns = () => {
        AXIOS.get(`/api/v1/user/board/columns/${menu1}/${menu2}`)
            .then((res) => {
                const data = res.data;

                const col = data?.filter(e => e.itemOpened)?.map((column) => {
                    let tmpCol = {
                        title: column.itemNm,
                        dataIndex: column.itemKey, // item1, item2 등의 키를 dataIndex로 사용
                        key: column.itemKey,
                        width: column.itemWidth,
                        ellipsis: column.itemEllipsis,
                        searchUseYn: column.searchUseYn,
                        showMobile: column.mobileVisibleYn,
                    }

                    // itemType이 'link'인 경우 렌더링 함수 추가
                    if (column.itemType === 'link') {
                        tmpCol.render = (text, record) => (
                            <SComLinkBtn to={`${text}?${qs.stringify({ id: record?.id })}`} state={{ record: record }}>
                                {column.itemNm}
                            </SComLinkBtn>
                        );
                    }

                    return tmpCol;
                });

                const selectOptions = data?.filter(e => e.searchUseYn)?.map(column => ({ value: column.itemKey, label: column.itemNm })) ?? [];

                setSelectOptions(selectOptions);
                setColumns(col);
                setMobileColumns(col.filter(e => e.showMobile));
            })
            .then(() => {
                getTableData();
            })
            .catch((err) => {
            })
    }

    // 테이블 데이터 가져오기
    const getTableData = () => {
        setLoading(true);
        const param = { ...ofqs, size: 10, page: Number(ofqs.page ?? 1) - 1 }

        AXIOS.get(`/api/v1/user/board/main/${menu1}/${menu2}`, { params: param })
            .then((res) => {
                setSearchCondition(param);
                const data = res.data;
                const mergedBoardItemList = data.content?.map((item) => {
                    // boardItemInfo를 하나의 객체로 합침
                    const merged = Object.assign({}, ...((item?.boardItemInfo ?? [])?.map(e => ({ [e.itemKey]: e.label ?? e.itemValue })) || []));
                    // item의 나머지 속성과 합침 (boardItemInfo는 제외)
                    return { ...item, ...merged };
                }).filter(obj => Object.keys(obj).length > 0);

                setData({ ...data, content: mergedBoardItemList });
            })
            .catch((err) => {
                console.error('테이블 데이터 가져오기 실패:', err);
            })
            .finally(() => {
                setLoading(false);
            })
    }


    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: page, size: pageSize })}`);
    };

    const onSearch = (value) => {
        const param = {
            page: 1, size: 10,
        }
        param[gubun] = value.trim();
        navigate(`${location.pathname}?${qs.stringify(param)}`)
    }

    // const selectOptions = [
    //     { value: 'item1', label: '분류', },
    //     { value: 'item2', label: '매장명', },
    // ]

    const selectOnChange = (v) => {
        setGubun((prev) => {
            setSearchCondition({ ...searchCondition, [prev]: undefined });
            return v
        });
    }

    const selectBefore = (
        <Select style={{ width: 80, }} popupMatchSelectWidth={false} options={[{ value: 'keywords', label: '전체' }, ...(selectOptions ?? [])]} value={gubun} onChange={(v) => selectOnChange(v)} />
    );

    return (
        <>
            <DealerSection>
                <LoadingSpinner loading={loading} />
                <SUInner1280>
                    <SUBoardHeaderWrap>
                        <SUBoardHeader
                            title={'대리점'}
                            description={'전국 어디서나 믿고 찾을 수 있는 엘로리언창호의 공식 대리점'}
                        />
                        <SUSearchInputFilter
                            addonBefore={selectBefore}
                            placeholder='키워드를 입력하세요'
                            onSearch={onSearch}
                            onChange={(e) => setSearchCondition({ ...searchCondition, [gubun]: e.target.value })}
                            value={searchCondition[gubun] ?? ''}
                        />
                    </SUBoardHeaderWrap>
                    <SUTabel
                        dataSource={data?.content ?? []}
                        columns={deviceInfo.device !== 'pc' ? mobileColumns : columns}
                        pagination={false}
                        loading={loading}
                        rowKey={(record) => record.id}
                        scroll={{ x: 'max-content' }}
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
                </SUInner1280>
            </DealerSection>
        </>
    )
}
export default DealerList;


const DealerSection = styled.section`
    font-size: 16px;
    padding:var(--gap) 0;

    .filter-area-wrapper{
        display: flex;
        gap: ${SFEm(12)};
        padding-bottom: ${SFEm(24)};
        .right{
            margin-left: auto;
        }
        dl{
            max-width: ${SFEm(320)};
            width: 100%;
        }
        dl dt{
            font-size: ${SFEm(14)};
            font-weight: 500;
            line-height: ${20 / 14};
            color: #414651;
            margin-bottom: ${SFEm(6, 14)};
        }
     
        .ant-select{
            width: 100%;
        }
        .ant-select-single{
            height: ${SFEm(40, 14)};
        }
        .ant-select .ant-select-arrow{
            font-size: ${SFEm(20, 14)};
        }
    }

`;