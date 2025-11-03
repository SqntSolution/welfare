/**
 * @file PressRelease.js
 * @description 보도자료
 * @author 이병은
 * @since 2025-06-16 19:04
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-16 19:04    이병은       최초 생성
 **/

import CardItem from 'components/user/CardItem';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUGrid3Col, SUInner1280, SUPaginationWithArrows } from 'styles/StyledUser';
import qs from 'qs';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import LoadingSpinner from 'components/common/LoadingSpinner';

const PressRelease = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { info, error } = useMsg();
    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const DEFAULT_PAGE_SIZE = 9;

    useEffect(() => {
        getData();
    }, [location.pathname])

    // 게시판 데이터 조회
    const getData = async () => {
        setLoading(true);
        const params = {
            pageNumber: Number(ofqs?.page ?? 1) - 1,
            pageSize: ofqs?.size ?? DEFAULT_PAGE_SIZE,
        }
        await AXIOS.get(`/api/v1/user/cs/qna`, { params })
            .then((resp) => {
                setData(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // 폐이징처리  
    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ page: page, size: pageSize })}`);
    };

    return (
        <SUInner1280>
            <PressReleaseSection>
                <LoadingSpinner loading={loading}>
                    <SUGrid3Col>
                        {data?.content?.map((item, idx) => (
                            <div key={idx} >
                                <CardItem title={item.title} text={dayjs(item.createdAt).format('YYYY-MM-DD')} />
                            </div>
                        ))}
                    </SUGrid3Col>
                    {!loading &&
                        <SUPaginationWithArrows
                            onChange={handlePageChange}
                            current={Number(data?.number ?? 0) + 1}
                            pageSize={data?.pageSize ?? DEFAULT_PAGE_SIZE}
                            total={data?.totalElements}
                            position={'bottomCenter'}
                            showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                            showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                        />
                    }
                </LoadingSpinner>
            </PressReleaseSection>
        </SUInner1280>
    )
}
export default PressRelease;

const PressReleaseSection = styled.section`
    font-size: 16px;
`;