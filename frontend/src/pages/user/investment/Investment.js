/**
 * @file Investment.js
 * @description  투자 정보에 투자 정보 서브페이지
 * @author 김단아
 * @since 2025-06-10 15:42
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-10 15:42    김단아       최초 생성
 * 2025-07-03 16:41    이병은       전체 조회 기능 추가
 **/

import { Flex, Select, Table } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { SUBoardHeader, SUBoardHeaderWrap, SUFileDownload, SUInner1280, SUPaginationWithArrows, SUSearchInputFilter, SUTabel, SUText16 } from 'styles/StyledUser';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { SComLinkBtn } from 'styles/StyledCommon';
import { deviceInfoState } from 'atoms/atom';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';

const Investment = () => {
    const { menu1, menu2 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [data, setData] = useState({});
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const { info, error } = useMsg();
    const [gubun, setGubun] = useState();
    const [selectOptions, setSelectOptions] = useState([]);
    const [searchCondition, setSearchCondition] = useState({});
    const [mobileColumns, setMobileColumns] = useState([]);
    const deviceInfo = useRecoilValue(deviceInfoState);

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
                            <SComLinkBtn to={`${text}`} state={{ record: record }}>
                                {column.itemNm}
                            </SComLinkBtn>
                        );
                    }

                    if (column.itemType === 'file') {
                        tmpCol.render = (text, record) => (
                            <SUFileDownload title={record?.item1} download={record?.item2} />
                        );
                    }

                    if (column.itemType === 'date') {
                        tmpCol.render = (text, record) => (
                            <div>{dayjs(text).format('YYYY-MM-DD')}</div>
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
                    const merged = Object.assign({}, ...((item?.boardItemInfo ?? [])?.map(e => ({ [e.itemKey]: e.itemValue })) || []));
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
            page: 0, size: 10,
        }
        param[gubun] = value.trim();
        navigate(`${location.pathname}?${qs.stringify(param)}`)
    }

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
        <InformationSection>
            <SUInner1280>
                <SUBoardHeaderWrap>
                    <SUBoardHeader
                        title={'공시자료'}
                        description={'기업의 공시 및 지배구조 현황을 한눈에 확인하세요.'}
                    />
                    <div>
                        <SUSearchInputFilter
                            addonBefore={selectBefore}
                            placeholder='키워드를 입력하세요'
                            onSearch={onSearch}
                            onChange={(e) => setSearchCondition({ ...searchCondition, [gubun]: e.target.value })}
                            value={searchCondition[gubun] ?? ''}
                        />
                    </div>
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
        </InformationSection>
    )
}
export default Investment;

const InformationSection = styled.section`
    padding-top: var(--gap);
`