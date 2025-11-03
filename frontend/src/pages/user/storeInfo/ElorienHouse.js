/**
 * @file ElorienHouse.js
 * @description 매장안내에  하우스 서브 페이지
 * @author 김단아
 * @since 2025-06-04 16:16
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04 16:16    김단아       최초 생성
 **/

import React from 'react'
import { SUBadge, SUInner1280, SUPointText, SUSectionText, SUText36 } from 'styles/StyledUser';
import { LuLightbulb, LuHouse, LuMessageSquare, LuSquarePen, LuHardHat, LuSettings } from "react-icons/lu";
import { SILogoMark } from 'styles/StyledIcon';
import KakaoMap from 'components/common/map/kakao/KakaoMap';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';

const ElorienHouse = () => {

    const ElorienHouseAboutList = (props) => {
        return (
            <li>
                <span className='icon'>
                    <span>{props.icon}</span>
                </span>
                <div className='text-box'>
                    <span className='title'>{props.title}</span>
                    <p className='description'>
                        {props.description}
                    </p>
                </div>
            </li>
        )
    }
    return (
        <ElorienHouseWrap>
            <section className='about-sec'>
                <div className='about-header'>
                    <span className='icon'><SILogoMark /></span>
                    <SUText36>
                        엘로리언 디자인<br />
                        컨설팅 시스템
                    </SUText36>
                    <p>엘로리언 디자인 컨설팅 시스템<br />체계화된 6단계 프로그램을 확인하세요!</p>
                </div>

                <div className='list-wrap'>
                    <ul className='list'>
                        <ElorienHouseAboutList
                            icon={<LuLightbulb />}
                            title={'전문가 상담'}
                            description={<>공간에 맞는 제품과 디자인 방향을 제안합니다.<br />당신의 니즈를 반영한 첫 설계가 시작됩니다.</>}
                        />
                        <ElorienHouseAboutList
                            icon={<LuHouse />}
                            title={'현장방문'}
                            description={<>실제 공간을 직접 살펴보고 상황을 진단합니다.<br />보다 정밀한 창호, 도어, 마루 계획이 수립됩니다.</>}
                        />
                        <ElorienHouseAboutList
                            icon={<LuMessageSquare />}
                            title={'컨설팅'}
                            description={<>맞춤 자재, 컬러, 기능까지 디테일한 플랜 제안.<br />디자인과 성능을 모두 고려한 솔루션을 만납니다.</>}
                        />
                        <ElorienHouseAboutList
                            icon={<LuSquarePen />}
                            title={'계약'}
                            description={<>최적의 조건과 일정으로 실행 준비를 마무리합니다.<br />신뢰를 바탕으로 투명한 계약이 진행됩니다.</>}
                        />
                        <ElorienHouseAboutList
                            icon={<LuHardHat />}
                            title={'공사'}
                            description={<>숙련된 시공팀이 체계적으로 공정을 진행합니다.<br />안전하고 정밀한 설치로 완성도를 높입니다.</>}
                        />
                        <ElorienHouseAboutList
                            icon={<LuSettings />}
                            title={'관리'}
                            description={<>시공 후에도 철저한 품질 점검과 A/S가 이어집니다.<br />지속 가능한 만족을 위한  약속입니다.</>}
                        />
                    </ul>
                </div>
            </section>

            <section className='directions-sec'>
                <SUBadge className='badge'>Modelhouse</SUBadge>
                <SUText36>엘로리언하우스 본사 직영 전시장</SUText36>
                <SUSectionText>엘로리언의 철학이 담긴 집을 만나실 수 있습니다.</SUSectionText>
                <KakaoMap
                    option={{
                        // center: { lat: 37.556085, lng: 126.919702 },
                        level: 3,
                        draggable: true,
                        scrollwheel: false,
                    }}
                    marker={{
                        visible: true,
                        text: '엘로리언하우스 본사 직영 전시장',
                    }}
                    address='엘로리언하우스 본사 직영 전시장'
                />
                <div className='directions-list'>
                    <dl>
                        <dt>주소</dt>
                        <dd>서울특별시 영등포구 여의공원로 68-1</dd>
                    </dl>
                    <dl>
                        <dt>열람시간</dt>
                        <dd> 평일 오프닝타임: 10:00~19:30</dd>
                        <dd> 토요일 오프닝타임 : 10:00~17:00</dd>
                        <dd> 일요일, 공휴일 휴관</dd>
                    </dl>
                    <dl>
                        <dt>문의전화</dt>
                        <dd>02-2086-1300</dd>
                    </dl>
                </div>
            </section>
            <section className='room-sec'>
                <div className='room-item'>
                    <div className='img'><img src='/img/sample/store/sqnt-house-img1.png' alt='' /></div>
                    <div className='text-box'>
                        <SUPointText>1F Showroom</SUPointText>
                        <SUText36>Showroom</SUText36>
                        <SUSectionText>5개의 컨셉룸으로 꾸며진 공간의 특성에 따라 다양한 제품들을 만나실 수 있습니다.</SUSectionText>
                    </div>
                </div>
                <div className='room-item'>
                    <div className='img'><img src='/img/sample/store/sqnt-house-img2.png' alt='' /></div>
                    <div className='text-box'>
                        <SUPointText>2F SQNT lab</SUPointText>
                        <SUText36>SQNT lab</SUText36>
                        <SUSectionText>다양한 소재의 샘플들을 직접 비교하고 체험하면서 전문적인 제품상담과 견적에서 시공까지 나의집에 맞는 맞춤 컨설팅 서비스를 받아보실 수 있습니다.</SUSectionText>
                    </div>
                </div>
            </section>
        </ElorienHouseWrap>
    )
}
export default ElorienHouse;


const ElorienHouseWrap = styled.div`
    font-size: 16px;
    section{
        padding: var(--gap) 0;
    }
    .about-sec{
        display: flex;
        justify-content: space-between;
        gap: ${SFEm(64, 16)};
        .icon{
            ${SFFlexCenter};
            width:  ${SFEm(48, 16)};
            aspect-ratio: 1/ 1;
            border-radius: ${SFEm(8, 16)};
                span{
                    ${SFFlexCenter};
                    font-size: ${SFEm(24, 16)};
                }
            }
        .about-header{
            .icon{
                ${SFFlexCenter};
                border: 1px solid #D5D7DA;
                box-shadow: 0px 4px 2px 0px rgba(10, 13, 18, 0.05);
                color: #E96827;
            }
            & > * {
                margin-bottom: 20px;
            }
            p{
                color: var(--color-tertiary);
                font-size:${SFEm(18, 16)};
                line-height: ${28 / 18};
                font-weight: 400;
            }
        }
        .list-wrap{
            
            .list{
                display: grid;
                gap: ${SFEm(32, 16)};
                grid-template-columns: repeat(2,1fr);

            }
            .list li{
                height:${SFEm(240, 16)};
                display: flex;
                align-content: space-between;
                flex-wrap: wrap;
                background-color: #FAFAFA;
                padding: ${SFEm(24, 16)};
                .icon{
                    background-color: #E96827;
                    color: #fff;
                }
                .text-box{
                    width: 100%;
                }
                .text-box .title {
                    font-size: ${SFEm(18, 16)};
                    font-weight: 600;
                }
                .text-box .description {
                    font-size: 1em;
                    font-weight: 400;
                    line-height: ${24 / 16};
                    margin-top: ${SFEm(4, 16)};
                }
            }
        }
    }

    .directions-sec{
        text-align: center;
        .badge{
            font-size: ${SFEm(14, 16)};  
            margin-bottom: ${SFEm(16, 14)};
        }
        h3{
            margin-bottom: ${SFEm(20, 36)};
        }
        .map-wrap{
            margin-top: ${SFEm(64, 16)};
            margin-bottom: ${SFEm(80, 16)};
            width: 100% !important;
        }
        .directions-list{
            display: flex;
            dl{
                flex:  1 1;
                padding: ${SFEm(24, 16)}  1em 0;
                border-top: 4px solid #F5F5F5;
            }
            dl:first-child{
                border-color: #FCA049;
            }
            dt{
                font-size: ${SFEm(20, 16)}; 
                font-weight: 600;
                line-height: ${30 / 20};
                margin-bottom: ${SFEm(8, 20)}; 
            }
            dd{
                font-size: 1em;
                font-weight: 400;
                line-height: ${24 / 16};
                color: var(--color-tertiary);
            }
        }
    }

    .room-item{
        display: flex;
        gap: ${SFEm(64)};
        .text-36{
            margin-top: ${SFEm(16, 36)};
            margin-bottom: ${SFEm(20, 36)};
        }
        .text-20{font-weight:400}
        .img{
            min-width: max-content;
        }
    }
    .room-item +  .room-item{
        margin-top:  var(--gap);
    }

${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('tab-m', css`
    .about-sec,.room-item{
        display: block;
    }
    .room-item{
        .img,img{
            width: 100%;
            object-fit: cover;
            min-width: 0;
        }
        .text-box{
            margin-top: ${SFEm(40)};
        }
    }
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
${SFMedia('mo-s', css`
    .about-sec .list-wrap .list{display: block}
    .about-sec .list-wrap .list li + li{margin-top : ${SFEm(34)}}
`)};
`;
