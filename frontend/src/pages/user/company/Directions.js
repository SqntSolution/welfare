/**
 * @file Directions.js
 * @description 오시는길 서브 페이지
 * @author 김단아
 * @since 2025-06-04 09:26
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04 09:26    김단아       최초 생성
 **/

import KakaoMap from 'components/common/map/kakao/KakaoMap';
import styled, { css } from 'styled-components';
import { SUPointText, SUSectionText, SUText36, SUTabsBtnStyle } from 'styles/StyledUser';
import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';
import { MotionFadeUp } from 'styles/Animations';

const Directions = () => {
    const directionsArr = [
        {
            key: 'korea',
            name: '국내',
            description: '고객과의 만남, 이곳에서 시작됩니다.',
            children: [
                {
                    key: '1-1',
                    company: '(주)엘로리언 창호, 엘로리언산업(주)',
                    address: '서울특별시 영등포 선유로70, 우리벤처타운2 901호',
                    workingHours: '운영시간 오전 8:00 ~ 오후 6:00',
                    phoneInfo: '02-2086-1300',
                    lat: 37.482760,
                    lng: 126.657160,
                },
                {
                    key: '1-2',
                    company: '서울사무소(직영 전시장)',
                    address: '서울특별시 영등포 선유로70, 우리벤처타운2 901호',
                    workingHours: '운영시간 오전 8:00 ~ 오후 6:00',
                    phoneInfo: '02-2086-1300',
                    lat: 37.556085,
                    lng: 126.919702,
                },
                {
                    key: '1-3',
                    company: '엘로리언에너지㈜, 엘로리언산업㈜ 공장',
                    address: '서울특별시 영등포 선유로70, 우리벤처타운2 901호',
                    workingHours: '운영시간 오전 8:00 ~ 오후 6:00',
                    phoneInfo: '02-2086-1300',
                    lat: 37.556085,
                    lng: 126.919702,
                },
            ]
        },
        {
            key: 'international',
            name: '해외',
            description: 'The starting point of our partnership with clients.',
            children: [
                {
                    key: '2-1',
                    company: '(미국) Elorien USA Corp.',
                    address: 'PO BOX 22 ISSAQUAH WA 98027 USA',
                    workingHours: '운영시간 오전 8:00 ~ 오후 6:00',
                    phoneInfo: '1-425-369-6629',
                    faxInfo: '1-425-837-3591',
                    lat: 37.482760,
                    lng: 126.657160,
                },
                {
                    key: '2-2',
                    company: '(솔로몬) Elorien Pacific Plantation Ltd.',
                    address: 'P.O. Box 529 Honiara, Solomon Islands',
                    workingHours: '운영시간 오전 8:00 ~ 오후 6:00',
                    phoneInfo: '677-30016',
                    lat: 37.482760,
                    lng: 126.657160,
                },
            ]
        }
    ];

    const DirectionsItem = ({ categoryArr }) => {
        return (
            <>
                <div className='section-header'>
                    <MotionFadeUp> <SUText36 className='title'>{categoryArr[0].name}</SUText36></MotionFadeUp>
                    <MotionFadeUp delay={0.1}> <SUSectionText className='description'>{categoryArr[0].description}</SUSectionText></MotionFadeUp>
                </div>

                {categoryArr.map((category, i) => (
                    <div key={category.key + i} className='directions-item'>
                        <MotionFadeUp delay={0.1}>
                            {category.children.map((location, j) => (
                                <div key={location.key} className='directions-inner'>
                                    <div className='directions-info'>
                                        <div className='info-address info-inner'>
                                            <span className='icon'>
                                                <span>
                                                    <HiOutlineLocationMarker />
                                                </span>
                                            </span>
                                            <SUSectionText className='label'>{location.company}</SUSectionText>
                                            <SUPointText className='point-txt'>{location.address}</SUPointText>
                                        </div>
                                        <div className='info-phone  info-inner'>
                                            <span className='icon'>
                                                <span>
                                                    <HiOutlinePhone />
                                                </span>
                                            </span>
                                            <SUSectionText className='label'>Phone</SUSectionText>
                                            <p className='txt'>{location.workingHours}</p>
                                            <SUPointText className='point-txt'>{location.phoneInfo}</SUPointText>
                                            {location.faxInfo ? <div className='fax-txt'><span>팩스 : </span><span>{location.faxInfo}</span></div> : null}
                                        </div>
                                    </div>
                                    <div className='directions-map'>
                                        <KakaoMap
                                            option={{
                                                level: 3,
                                                draggable: true,
                                                scrollwheel: false,
                                            }}
                                            marker={{
                                                visible: true,
                                                text: location.company,
                                            }}
                                            address={location.address}
                                        />
                                    </div>
                                </div>
                            ))}
                        </MotionFadeUp>
                    </div>
                ))}
            </>
        )
    }
    const items = [
        {
            key: 'korea',
            label: '국내',
            children: <DirectionsItem categoryArr={directionsArr.filter(cat => cat.key === 'korea')} />,
        },
        {
            key: 'international',
            label: '해외',
            children: <DirectionsItem categoryArr={directionsArr.filter(cat => cat.key === 'international')} />,
        },
    ];


    return (
        <DirectionsSection>
            <SUTabsBtnStyle
                items={items}
            />
        </DirectionsSection>
    )
}
export default Directions;

const DirectionsSection = styled.section`
    font-size: 16px;
    
    .ant-tabs-nav{
        padding: ${SFEm(48)} 0 ;
    }
    .section-header{
        padding: ${SFEm(64)} 0 ;
        .title{
            margin-bottom:  ${SFEm(20, 36)};
        }
    }
    .directions-inner{
        display: flex;
        justify-content: space-between;
        gap: ${SFEm(64)};
        padding:${SFEm(96)} 0;
    }

    .directions-info{
        .info-inner{
            position: relative;
            padding-left: ${SFEm(48 + 16, 16)};
            padding-top: ${SFEm(10, 16)};
        }
        
        .icon{
            ${SFFlexCenter};
            width: ${SFEm(48)};
            aspect-ratio: 1/1;
            overflow: hidden;
            border-radius:  ${SFEm(8)};
            background-color: #FFF8EE;
            position: absolute;
            top:0; left: 0;
            span{
                ${SFFlexCenter};
                font-size : ${SFEm(24)};
                color: #E96827;
            }
        }
        .label{
            color: #181D27;
            font-size:  ${SFEm(20)};
            font-weight: 600;
        }
        .txt{
            margin-top:  ${SFEm(8)};
            font-size: 1em;
            font-weight: 400;
            color: var(--color-tertiary);
        }
        .point-txt{
            margin-top:  ${SFEm(20, 16)};
            display: block;
        }
        .info-address {
            margin-bottom:  ${SFEm(28, 16)};
            
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
    .directions-map .map-wrap{
        width: ${SFEm(480)} !important;
    }
`)};

${SFMedia('tab-m', css`
    .directions-inner{
        display: block;
    }
    .directions-map{
        margin-top: ${SFEm(40)};
    }
    .directions-map .map-wrap{
        width: 100% !important;
    }
`)};
${SFMedia('mo-l', css`
    &,.ant-tabs-content-holder,.directions-inner{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
    .section-header,.directions-inner{padding: ${SFEm(40)} 0}
    .ant-tabs-nav{
        padding: ${SFEm(48)} 0 0;
        margin-bottom: 0;
    }
`)};
`;