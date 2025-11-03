/**
 * @file OverviewPage.js
 * @description 회사소개 > 개요 페이지
 * @author 김단아
 * @since 2025-05-29 13:16
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-29 13:16    김단아       최초 생성
 **/

import styled, { css } from 'styled-components';
import { MotionFadeLeft, MotionFadeRight, MotionFadeUp } from 'styles/Animations';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUPointText, SUSectionText, SUText48 } from 'styles/StyledUser'

const OverviewPage = () => {
    return (
        <>
            <OverviewList>
                <li>
                    <MotionFadeRight className='img'>
                        <img src='/img/sample/company/overview_1.png' alt='' />
                    </MotionFadeRight>
                    <div className='contets'>
                        <MotionFadeUp><SUPointText>Philosophy</SUPointText></MotionFadeUp>
                        <MotionFadeUp delay={0.1}><SUText48>경영이념</SUText48></MotionFadeUp>
                        <MotionFadeUp delay={0.2}>
                            <SUSectionText>
                                신뢰를 바탕으로, 공간의 본질을 고민합니다. <br />
                                정직한 기술과 품질로 건축의 기준을 높이고, <br />
                                사람과 삶을 연결하는 가치를 만듭니다.
                            </SUSectionText>
                        </MotionFadeUp>
                    </div>
                </li>
                <li>
                    <MotionFadeLeft className='img'>
                        <img src='/img/sample/company/overview_2.png' alt='' />
                    </MotionFadeLeft>
                    <div className='contets'>
                        <MotionFadeUp><SUPointText>Elorien</SUPointText> </MotionFadeUp>
                        <MotionFadeUp delay={0.1}><SUText48>엘로리언인</SUText48> </MotionFadeUp>
                        <MotionFadeUp delay={0.2}><SUSectionText>
                            창의성과 책임감을 갖춘 전문 인재, <br />
                            사용자의 삶을 먼저 생각하며, <br />
                            미래를 만들어가는 엘로리언의 사람들입니다.
                        </SUSectionText>
                        </MotionFadeUp>
                    </div>
                </li>

                <li>
                    <MotionFadeRight className='img'>
                        <img src='/img/sample/company/overview_3.png' alt='' />
                    </MotionFadeRight>
                    <div className='contets'>
                        <MotionFadeUp><SUPointText>Vision</SUPointText></MotionFadeUp>
                        <MotionFadeUp delay={0.1}><SUText48>비전</SUText48></MotionFadeUp>
                        <MotionFadeUp delay={0.2}>
                            <SUSectionText>
                                기술과 디자인, 품질로 완성된 창호를 넘어 <br />
                                건축 환경의 새로운 가능성을 제시하고, <br />
                                세계가 주목하는 프리미엄 브랜드로 도약합니다.
                            </SUSectionText>
                        </MotionFadeUp>
                    </div>
                </li>
            </OverviewList>
        </>
    )
}
export default OverviewPage;


const OverviewList = styled.ul`
    padding: var( --gap) 0;
    display: flex;
    flex-wrap: wrap;
    gap:  var( --gap);
    font-size: 16px;
    .contets{
        > div:nth-child(2) p{
            margin-top: ${SFEm(12, 48)};
            margin-bottom: ${SFEm(20, 48)};
        }
    }
    li{
        width: 100%;
        display: flex;
        gap:  ${SFEm(96)};
        align-items: center;
        > * {
            flex:  1 1;
        }
    }
    li:nth-child(odd){
        flex-direction: row-reverse;
    }

${SFMedia('tab-l', css`
    font-size: 14px;
    gap : ${SFEm(45)} ;
    li{
        gap : ${SFEm(34)} ;
    }
`)};

${SFMedia('mo-l', css`
    /* font-size: ${12 / mediaWidth['mo-m'] * 100}vw; */
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    gap : ${SFEm(45)} ;
    .contets{
        margin-top: ${SFEm(24)};
    }
    .img{
        width: 100%;
        img{
            object-fit: cover;
            width: 100%;
        }
    }
    li{
        display: block;
        text-align: center;
    }
    li + li{
        margin-top: ${SFEm(40)};
    }
`)};
`;