/**
 * @file History.js
 * @description 회사소개에 연혁 페이지
 * @author 김단아
 * @since 2025-06-16 18:50
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-16 18:50    김단아       최초 생성
 **/

import { Spin } from 'antd'
import LoadingSpinner from 'components/common/LoadingSpinner';
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUDotList, SUPointText, SUSectionText, SUText48, SUText30 } from 'styles/StyledUser';

const History = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false)
    }, [])
    const data = [
        {
            key: '1',
            img: '/img/sample/company/history-img1.png',
            label: '고객가치를 선도하는 글로벌 엘로리언',
            title: '2020~2025',
            description: '열정적이고 끊임없는 도전으로 미래의 GLOBAL 성장동력 창출',
            yearList: [
                {
                    year: '2025',
                    historyList: [`(주)엘로리언 창호, '월드클래스 기업' 선정`]
                },
                {
                    year: '2024',
                    historyList: [`(주)엘로리언 창호, '월드클래스 기업' 선정`]
                },
                {
                    year: '2023',
                    historyList: [`(주)엘로리언 창호, '월드클래스 기업' 선정`]
                },
                {
                    year: '2022',
                    historyList: [
                        `(주)엘로리언 창호, 서울시, 저탄소 건물 확산을 위한 상생협력 업무 협약`,
                        `엘로리언산업, 프리미엄 강마루 ‘세라 플렉스 스퀘어’ 출시`
                    ]
                },
                {
                    year: '2021',
                    historyList: [
                        '(주)엘로리언 창호, Aluplast 기술제휴 시리즈 출시 (EVO Series)',
                        '엘로리언산업, 프리미엄 천연마루 ‘포레스타’ 출시',
                        '엘로리언산업, 프리미엄 강마루 ‘세라 플렉스 143’ 출시',
                    ]
                },
                {
                    year: '2020',
                    historyList: [
                        '(주)엘로리언 창호, Aluplast 기술제휴 계약 및 협력',
                        '(주)엘로리언 창호, 북미용 AL 슬림제품 개발(슬림 윈도우 및 슬라이딩 도어)',
                        '(주)엘로리언 창호, SKY-FRAME과의 국내 판매계약',
                        '엘로리언산업, 프리미엄 원목마루 ‘라르고’ 출시 (테라, 솔레)',
                    ]
                },
            ]
        },
        {
            key: '2',
            img: '/img/sample/company/history-img2.png',
            label: '고객가치를 선도하는 글로벌 엘로리언',
            title: '2010 ~ 2018',
            description: '열정적이고 끊임없는 도전으로 미래의 GLOBAL 성장동력 창출',
            yearList: [
                {
                    year: '2018',
                    historyList: [
                        `엘로리언산업, 산림청·한국임업진흥원 주최 ‘해외 산림자원개발 유공자 표창’ ‘농림축산식품부 장관상’ 수상`,
                        `엘로리언산업, 산업통상자원부 주최 ‘대한민국 사랑받는 기업 정부 포상’ 글로벌 CSR부문 ‘산업통상자원부 장관상’ 수상`,
                        `엘로리언산업, 솔로몬법인 생산 베니어, 건축자재용 원자재로서 국내 첫 반입`,
                        `엘로리언 창호, 'SUPER진공유리' 국내 최초 독일 패시브 하우스 인증(PHI) 획득, 신기술상 수상`,
                        `엘로리언 창호, 엘로리언산업, 인천공항 제2터미널 건물일체형태양광발전시스템(BIPV), PV, 마띠에 WPCi 수주`,
                    ]
                },
                {
                    year: '2017',
                    historyList: [
                        `엘로리언 창호, 국내 최초 알루미늄 방화도어 방화성능테스트 통과`,
                        `엘로리언 창호, ‘시스템창호’, 한국소비자 평가 최고의 브랜드 대상 수상`,
                        `엘로리언 본사 직영 전시장 ‘엘로리언하우스’ 오픈`,
                    ]
                },
                {
                    year: '2016',
                    historyList: ['엘로리언 창호, 산업통상자원부 국가기술표준원 산하 KOLAS 국제공인시험기관 인정 획득']
                },
                {
                    year: '2015',
                    historyList: ['엘로리언 창호, ‘초단열 진공유리’ 기술로 ‘IR52 장영실상’ 수상']
                },
                {
                    year: '2014',
                    historyList: [
                        '엘로리언 브랜드 전시장 오픈(강남)',
                        '(주)엘로리언 창호, 엘로리언산업(주) B2C 강화를 위한 합동세미나 개최',
                    ]
                },
                {
                    year: '2013',
                    historyList: [
                        `(주)엘로리언 창호 한국건설생활환경시험연구원(KCL)과 건물에너지 절약 MOU 체결`,
                        `(주)엘로리언 창호 진공복층유리 제조기술 '녹색기술인증' 획득`,
                    ]
                },
                {
                    year: '2012',
                    historyList: [
                        `(주)엘로리언 창호 기능성유리 전문회사 Cardinal과 국내 독점판매계약 체결`,
                        `(주)엘로리언 창호 제2남극기지 장보고기지 창호공사 수주`,
                    ]
                },
                {
                    year: '2011',
                    historyList: [
                        `물류포장재 전문기업 (주)엘로리언그린텍 설립`,
                        `(주)엘로리언환경 그린가드레일 신제품 국내 최초 SB3 등급 충돌테스트 통과`,
                        `엘로리언 창호 4년 연속 '그린홈 100만호 보급사업' 참여시공업체 선정`,
                    ]
                },
                {
                    year: '2010',
                    historyList: [
                        `엘로리언산업(주) 산림청 녹색사업단과 '해외조림지 임분생장 공동연구 MOU' 체결`,
                        `(주)엘로리언 창호 DSSC 태양광창호개발 정부지원과제 주관기관 선정`,
                        `(주)엘로리언 창호 세계 최고 단열성능 진공유리 개발`,
                        `엘로리언산업(주) 국제산림협의회(FSC) 산림경영(FM), 가공유통(CoC) 인증 획득`,
                    ]
                },
            ]
        },
        {
            key: '3',
            img: '/img/sample/company/history-img3.png',
            label: '지속적인 기술혁신과 품질향상 노력',
            title: '2000 ~ 2009',
            description: '시장을 선도하기 위한 기술개발을 지속하였으며, 품질 및 서비스 향상을 위해 인천 신사옥을 건축.',
            yearList: [
                {
                    year: '2009',
                    historyList: [
                        `(주)엘로리언 창호시스템, (주)엘로리언 창호로 사명 변경`,
                        `엘로리언에너지(주) 설립`,
                    ]
                },
                {
                    year: '2008',
                    historyList: ['엘로리언산업(주)과 (주)엘로리언리빙 합병']
                },
                {
                    year: '2007',
                    historyList: ['엘로리언 건자재 물류센터 준공']
                },
                {
                    year: '2005',
                    historyList: [
                        `(주)엘로리언 창호시스템 KS인증 획득`,
                        `(주)엘로리언환경 설립`,
                    ]
                },
                {
                    year: '2004',
                    historyList: [`(주)엘로리언 창호시스템 인천 도화동 사옥 및 공장 신축(안산, 남동공장 통합)`]
                },
                {
                    year: '2003',
                    historyList: [
                        `(주)엘로리언 창호시스템 ISO9001 인증 획득`,
                        `엘로리언산업(주) 친환경 선언`,
                    ]
                },
                {
                    year: '2002',
                    historyList: ['엘로리언에너지사업부문 독립, (주)엘로리언리빙 설립']
                },
                {
                    year: '2001',
                    historyList: ['박영주 회장 금탑산업훈장 수훈']
                },
                {
                    year: '2000',
                    historyList: ['(주)엘로리언 창호시스템 코스닥 등록']
                },
            ]
        },
        {
            key: '4',
            img: '/img/sample/company/history-img4.png',
            label: '초우량기업으로의 성장기반 구축',
            title: '1980 ~ 1989',
            description: '안정적인 목재공급원 확보를 위해 솔로몬, 칠레, 동남아 등 해외네트워크를 구축하였으며, (주)엘로리언을 설립하여 국내 최초로 시스템창호를 제작하는 기술 선두 기업으로 발돋움.',
            yearList: [
                {
                    year: '1989',
                    historyList: [`엘로리언산업(주) CI변경`]
                },
                {
                    year: '1988',
                    historyList: [`(주)엘로리언 창호시스템 설립`]
                },
                {
                    year: '1987',
                    historyList: [`엘로리언산업(주) Solomon 군도 삼림개발권 획득(36만ha)`]
                },
                {
                    year: '1983',
                    historyList: [`솔로몬 현지법인 Elorien Resources Development Co., Ltd 설립`]
                },
                {
                    year: '1981',
                    historyList: [`엘로리언산업(주) 상공주방관 표창(수출유공)`]
                },
                {
                    year: '1980',
                    historyList: [`미국 현지법인 Elorien USA Corp. 설립`]
                },
            ]
        },
        {
            key: '5',
            img: '/img/sample/company/history-img5.png',
            label: '목재 전문 회사로서의 힘찬 발걸음',
            title: '1972 ~ 1979',
            description: '탄탄한 기술력과 노사협력을 바탕으로 합판제조 및 수출사업을 이끌어가며, 끊임없는 노력과 성장을 거듭함.',
            yearList: [
                {
                    year: '1979',
                    historyList: [`엘로리언산업(주) 대통령 표창(수출유공)`]
                },
                {
                    year: '1976',
                    historyList: [`엘로리언산업(주) 표창(수출유공)`]
                },
                {
                    year: '1972',
                    historyList: [`엘로리언산업(주) 설립`]
                },
            ]
        },
    ]
    return (
        <HistorySection>
            <LoadingSpinner loading={loading}>
                <ul className='history-list'>
                    {
                        data.map((item, index) => (
                            <li key={item.key} className='history-list-li'>
                                <div className='history-list-left'>
                                    <div className='img'><img src={item.img} alt={item.label} /></div>
                                    <SUPointText className='label'>{item.label}</SUPointText>
                                    <SUText48 className='title'>{item.title}</SUText48>
                                    <SUSectionText className='description'>{item.description}</SUSectionText>
                                </div>
                                <div className='history-list-right'>
                                    {item.yearList.map((year, num) => (
                                        <div key={year.year} className='year-inner'>
                                            <SUText30 className='year-title'>{year.year}</SUText30>
                                            <SUDotList lists={year.historyList} />
                                        </div>
                                    ))
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {/* <img src='/img/sample/sample-page/history.png' alt='' /> */}
            </LoadingSpinner>
        </HistorySection>
    )
}
export default History;


const HistorySection = styled.section`  
    font-size: 16px;
    .history-list{
        &-li{
            padding: var(--gap) 0;
            display: flex;
            gap:  var(--gap);
        }
        &-left{
            width: ${SFEm(560)};
            min-width: ${SFEm(560)};
            .img{
                margin-bottom: ${SFEm(32)};
            }
            .label{
                font-weight: 500;
                line-height: ${24 / 16};
            }
            .description{
                font-size: ${SFEm(20)};
                font-weight: 400;
                margin-top: ${SFEm(10)}
            }
        }
        &-right{
            &{
                width: 100%;
            }
            .year-inner{
                background-color: #FAFAFA;
                padding: ${SFEm(20)};
                border-radius: ${SFEm(15)};
                overflow: hidden;
            }
            .year-inner + .year-inner{
                margin-top: ${SFEm(32)};
            }
            .dot-list{
                margin-top: ${SFEm(20)};
            }
        }
    }

${SFMedia('tab-l', css`
    font-size: 14px;
    .history-list{
        &-li{
            gap:  ${SFEm(45)};
        }
    }
`)};

${SFMedia('tab-m', css`
    .history-list{
        &-li{
            display: block;
        }
        &-left{
            img,.img,&{
                min-width: 0;
                width: 100%;
                object-fit: cover;
            }
        }
        &-right{
            margin-top: ${SFEm(40)};
        }
    }
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(10px,${12 / mediaWidth['mo-s'] * 100}vw, 14px) ;
`)};

`;