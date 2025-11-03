/**
 * @file DealerDetailPage.js
 * @description 매장소개에 대리점 상세 페이지
 * @author 김단아
 * @since 2025-06-09 16:25
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-09 16:25    김단아       최초 생성
 **/

import KakaoMap from 'components/common/map/kakao/KakaoMap'
import { useMsg } from 'hooks/helperHook'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion'
import { SUInner1280, SUPointText, SUSectionText, SUText36 } from 'styles/StyledUser'
import { AXIOS } from 'utils/axios'
import { isEmptyCheck } from 'utils/helpers';
import qs from 'qs';
import LoadingSpinner from 'components/common/LoadingSpinner'

const DealerDetailPage = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState(null);
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();

    useEffect(() => {
        if (!isEmptyCheck(ofqs.id)) {
            getDealerInfo();
        }
    }, [location]);

    const getDealerInfo = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/board/detail/${ofqs.id}`).then((res) => {
            const data = res.data;
            const items = {};
            data?.boardItemInfo.forEach(item => {
                if (item.itemKey !== undefined && item.itemValue !== undefined) {
                    items[item.itemKey] = item.itemValue;
                }
            });

            setRecord(items);
            setLoading(false);
        }).catch((err) => {
            error(err);
            setLoading(false);
        });
    }

    return (
        <DetailSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} />
                <div className='section-header'>
                    <SUPointText className='label'>대리점</SUPointText>
                    <SUText36 className='title'>{record?.item2}</SUText36>
                    <SUSectionText className='description'>{record?.item3}</SUSectionText>
                </div>
                <div className='detail-wrap'>
                    <div className='detail-direction'>
                        <dl>
                            <dt>주소</dt>
                            <dd>
                                {record?.item3}
                            </dd>
                        </dl>
                        <dl>
                            <dt>영업시간</dt>
                            {record?.item6?.split(',').map((e, idx) => (
                                <dd key={idx}>{e}</dd>
                            ))}
                        </dl>
                        <dl>
                            <dt>문의전화</dt>
                            <dd>{record?.item4}</dd>
                        </dl>
                    </div>
                    <div className='directions-map'>
                        <KakaoMap
                            option={{
                                // center: { lat: 37.556839, lng: 126.922974 },
                                level: 1,
                                draggable: true,
                                scrollwheel: false,
                            }}
                            marker={{
                                visible: true,
                                text: record?.item2,
                            }}
                            address={record?.item3 ?? ''}
                        />
                    </div>
                </div>
            </SUInner1280>
        </DetailSection>
    )
}
export default DealerDetailPage;

const DetailSection = styled.section`
    padding: var(--gap) 0;
    font-size: 16px;
    .section-header{
        .title{
            margin: ${SFEm(12, 36)} 0 ${SFEm(20, 36)};
        }
    }
    .detail-wrap{
        display: flex;
        gap: ${SFEm(64)};
        margin-top: ${SFEm(64)};
    }
    .detail-direction{
        dl{
            position: relative;
            padding-left: ${SFEm(48 + 16)};
            padding-top: ${SFEm(10)};
            &::before{
                content: '';
                display: block;
                width: ${SFEm(48)};
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                position: absolute;
                top:0; 
                left: 0;
                border: 8px solid  #FFF8EE;
                background-color: #E96827;
            }
        }
        dl + dl {
            margin-top: ${SFEm(48)};
        }
        dt{
            font-size: ${SFEm(20)};
            font-weight: 600;
            line-height: ${30 / 20};
            margin-bottom: ${SFEm(8, 20)};
        }
        dd{
            font-weight: 400;
            font-size: 1em;
            line-height: ${24 / 16};
            color: #535862;
        }
    }
    ${SFMedia('tab-l', css`
        .detail-wrap{
            display: block;
        }
        .directions-map{
            margin-top:${SFEm(48)};

            .map-wrap{
                width:  100% !important;
            }
        }
    `)};
    ${SFMedia('mo-l', css`
        font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
        .directions-map{

            .map-wrap{
                height:  ${SFEm(300)} !important;
            }
        }
    `)};
`;