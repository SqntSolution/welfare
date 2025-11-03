/**
 * @file GlobalNetworks.js
 * @description 글로벌네트워크 서브 페이지
 * @author 김단아
 * @since 2025-06-02 11:40
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-02 11:40    김단아       최초 생성
 **/

import styled, { css } from 'styled-components';
import { MotionFadeLeft, MotionFadeUp } from 'styles/Animations';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUPointText, SUSectionText, SUText36, SUTabsBtnStyle } from 'styles/StyledUser';


const GlobalNetworks = () => {
    const tabContentsArr = [
        {
            key: 'con1',
            children: [
                {
                    key: 'con1-1',
                    img: '/img/sample/company/globalnetworks_img1.png',
                    label: '아름다운 생활을 창조하는 최고의 기업',
                    title: '엘로리언홀딩스',
                    description: '엘로리언홀딩스는 지주회사로서 엘로리언그룹의 비전과 전략목표를 수립하고 이를 달성하기 위한 인사, 회계, 재무 및 경영지원 업무를 수행하고 있습니다. 엘로리언홀딩스는 엘로리언산업(주), (주)엘로리언 창호, (주)엘로리언그린텍, 엘로리언에너지(주) 등 국내법인 4개사와 해외법인 5개사를 계열회사로 두고 있습니다.',
                    businessList: [
                        '자회사의 제반 사업내용을 지배, 경영지도, 육성하는 지주사업',
                        '브랜드 및 상표권 등 지적재산권의 관리 및 라이선스업',
                        '시장조사, 경영자문 및 컨설팅업',
                    ]
                },
                {
                    key: 'con1-2',
                    img: '/img/sample/company/globalnetworks_img2.png',
                    label: '사람과 자연이 함께 하는',
                    title: '엘로리언산업',
                    description: <>
                        기업의 이윤보다 환경을 먼저 생각하는 기업. 그 자연 속에서의 풍요로운 삶을 소중하게 여기는 기업. 오랜 시간 동안 새로운 자원을 심고 가꾸는 기업. 이 모든 것이 나무와 자연, 사람을 생각하는 엘로리언산업의 철학입니다. <br />  <br />
                        엘로리언산업은 목재전문회사로서의 오랜 경험과 Global Network를 바탕으로 솔로몬에 대규모 조림지를 조성하여 자원확보의 기반을 마련하고 환경을 생각하는 기업의 비전을 심어가고 있습니다. <br /> <br />
                        사람과 자연이 함께 미소 지을 수 있는 아름다운 공간. <br /> 엘로리언산업이 만들어 가겠습니다. <br />

                    </>,
                    businessList: [
                        '조림 사업',
                        '합판, 보드류 생산',
                        '목조주택자재 유통',
                        '목재바닥재 생산,시공',
                        '무빙월, 인테리어도어 생산,시공',
                    ]
                },
                {
                    key: 'con1-3',
                    img: '/img/sample/company/globalnetworks_img3.png',
                    label: '국내 최고의 창호 전문 회사',
                    title: '엘로리언 창호',
                    description: <>
                        보이는 곳에는 아름다움, 보이지 않는 곳엔 완벽한 기능이 담겨 있는 시스템 창호. <br /> <br />
                        (주)엘로리언 창호는 1988년 설립된 국내 최초의 시스템 창호 선두 기업으로서 단열, 기밀, 방음, 안전의 완벽한 기능과 아름다운 디자인을 갖춘 세계적 품질의 창을 만들고 있는 국내 최고의 창호 전문 회사 입니다.
                    </>,
                    businessList: [
                        '시스템창호 생산',
                        '시공커튼월 생산',
                        '시공태양광창호 생산',
                        '시공방탄, 방폭, 선박용 창호 생산',
                        '시공진공 복층유리 생산',
                    ]
                },
                {
                    key: 'con1-4',
                    img: '/img/sample/company/globalnetworks_img4.png',
                    label: '세계적인 친환경 재생목재 전문기업',
                    title: '엘로리언그린텍',
                    description: '엘로리언그린텍은 세계적인 친환경 재생 목재 전문 기업을 목표로 물류자재인 그린파렛트, 프라스틱파렛트, 폐기물 없는 포장재 클립락 등을 주력사업으로 하고 있습니다. 또한 이와 관련한 우수 재활용 제품 인증과 환경 마크를 획득하여 국내는 물론 해외 시장을 적극적으로 확대하고 있습니다.',
                    businessList: [
                        '물류 포장재 전문기업'
                    ]
                },
                {
                    key: 'con1-5',
                    img: '/img/sample/company/globalnetworks_img5.png',
                    label: '신재생 에너지 전문 기업',
                    title: '엘로리언에너지',
                    description: '엘로리언에너지는 목질계 바이오패스 열병합 발전소를 운영하여, 스팀은 인천지방산업단지 및 배후 단지에 공급하고, 전기는 전력거래소에 역송하는 집단에너지 사업자로써 지역사회의 화석연료 사용량을 저감하고, 친환경설비 운영을 통해 대기환경 개선에서도 이바지하는 신재생 에너지 전문기업입니다.',
                    businessList: [
                        '신재생 에너지 열병합 발전 (스팀, 전기)'
                    ]
                },

            ]
        },
        {
            key: 'con2',
            children: [
                {
                    key: 'con1-6',
                    img: '/img/sample/company/globalnetworks_img6.png',
                    label: 'Elorien USA Corp',
                    title: '미국',
                    description: '건자재 무역업무와 선진목재 정보습득을 위해 미국에 설립한 현지법인 입니다.',
                    businessList: [
                        '건자재 무역업무',
                        '시스템 창호 판매 업무',
                    ]
                },
                {
                    key: 'con1-7',
                    img: '/img/sample/company/globalnetworks_img7.png',
                    label: 'Elorien Lautaro S.A.',
                    title: '칠레',
                    description: '칠레에서 베니어 및 합판을 생산해 유럽, 미국, 멕시코, 호주 등 전세계 시장을 대상으로 판매하고 있는 현지법인 입니다.',
                    businessList: [
                        '베니어 및 합판 생산/영업/판매'
                    ]
                },
                {
                    key: 'con1-8',
                    img: '/img/sample/company/globalnetworks_img8.png',
                    label: 'Elorien Resources Development Co.,(S.I) Ltd.',
                    title: '솔로몬',
                    description: '해외자원개발과 조림사업을 통한 장기적 자원확보를 위해 솔로몬군도에 설립한 현지법인입니다.',
                    businessList: [
                        '조림사업 및 장기적 자원확보'
                    ]
                },
            ]
        },
    ];

    const TabContents = ({ tanContensNumber }) => {
        return (
            <GlobalNetworkList>
                {
                    tanContensNumber.children.map((tabs) => (
                        <li key={tabs.key} className='list-inner'>
                            <MotionFadeLeft>
                                <img src={tabs.img} alt='' />
                            </MotionFadeLeft>
                            <div className='list-contents'>
                                <div>
                                    <MotionFadeUp className='label'><SUPointText>{tabs.label}</SUPointText> </MotionFadeUp>
                                    <MotionFadeUp delay={0.1} className='title'><SUText36>{tabs.title}</SUText36> </MotionFadeUp>
                                    <MotionFadeUp delay={0.2} className='description'><SUSectionText>{tabs.description}</SUSectionText> </MotionFadeUp>
                                </div>
                                <div>
                                    {tabs.businessList ?
                                        (
                                            <>
                                                <MotionFadeUp className='business-label'>주요사업</MotionFadeUp>
                                                <ul className='business-list'>
                                                    {
                                                        tabs.businessList.map((list, num) => (
                                                            <li key={`businessList` + num}>
                                                                <MotionFadeUp delay={(num + 1) * 0.1}>
                                                                    {list}
                                                                </MotionFadeUp>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </li>
                    ))
                }
            </GlobalNetworkList>
        )
    }

    const items = [
        {
            key: '1',
            label: '국내관계사',
            children: <TabContents tanContensNumber={tabContentsArr[0]} />,
        },
        {
            key: '2',
            label: '해외관계사',
            children: <TabContents tanContensNumber={tabContentsArr[1]} />,
        },
    ];

    return (
        <GlobalNetworkSection>
            <SUTabsBtnStyle defaultActiveKey={'1'} items={items} />
        </GlobalNetworkSection>
    )
}
export default GlobalNetworks


const GlobalNetworkSection = styled.section`
    font-size: 16px;
    .ant-tabs-nav{
        padding: ${SFEm(48)} 0;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
   
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    .ant-tabs-nav{
        padding: ${SFEm(48)} 0 0;
        margin-bottom: 0;
    }
`)};
`;


const GlobalNetworkList = styled.ul`
    padding-top: var(--gap);
    
    .list-inner{
        display: flex;
        gap: ${SFEm(64, 16)};
        
        margin-bottom: var(--gap);
        & > * {
            flex: 1 1;
        }
        .list-contents > div + div{
            margin-top: ${SFEm(48)};
        }
        .title{
            margin-top: ${SFEm(12)};
            margin-bottom: ${SFEm(20)};
        }

    }  

    .business-label{
        font-size: ${SFEm(20)};
        font-weight: 400;
        color: var(--color-tertiary);
    }
    .business-list{
        margin-top: ${SFEm(20)};
        padding-left: ${SFEm(10)};
    }
    .business-list li{
        div{
            position: relative;
            padding-left:${SFEm(10, 20)};
            font-size:  ${SFEm(20)};
            line-height: 1;
            color: var(--color-tertiary);
            font-weight: 300;
            &::before{
                content: '';
                display: block;
                width: 4px;
                aspect-ratio: 1 / 1 ;
                border-radius: 50%;
                background-color: currentColor;
                position: absolute;
                top: 0.4em;
                left: 0;
            }
        }
        & + li{
            margin-top:${SFEm(12, 16)};
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('tab-s', css`
    .list-inner{
        display: block;
        img{
            width: 100%;
        }
    }
    .list-contents{
        margin-top: ${SFEm(40)};
    }
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;