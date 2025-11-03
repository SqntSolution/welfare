/**
 * @file Ci.js
 * @description 회사소개 ci 서브 페이지
 * @author 김단아
 * @since 2025-06-02 10:21
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-02 10:21    김단아       최초 생성
 **/

import React from 'react'
import styled, { css } from 'styled-components'
import { MotionFadeUp } from 'styles/Animations'
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion'
import { SUPointText, SUSectionText, SUText36 } from 'styles/StyledUser'

const Ci = () => {
    return (
        <>
            <CiSection className='ci-sec1'>
                <MotionFadeUp className="ci-top-img"><span><img src='/img/sample/company/ci_img.png' alt='' /></span></MotionFadeUp>
                <div>
                    <MotionFadeUp delay={0.1}>
                        <SUPointText className='label'> 브랜드 정체성 </SUPointText>
                    </MotionFadeUp>

                    <MotionFadeUp delay={0.2}>
                        <SUText36 className='title'> 엘로리언의 단단하고 섬세한 </SUText36>
                    </MotionFadeUp>

                    <MotionFadeUp delay={0.3}>
                        <SUSectionText className='text'>
                            새롭게 리뉴얼된 엘로리언의 CI는 <br />
                            “공간에는 철학이 깃들어야 하며, 시간이 흐를수록 더 깊이 있게 완성되어야 한다”<br />
                            건축에 대한 엘로리언의 신념을 담고 있습니다.
                        </SUSectionText>
                        <SUSectionText className='text'>
                            브랜드 서체는 견고함과 섬세함을 조화롭게 표현하며,<br />
                            정제된 디테일을 통해 시간이 지날수록 신뢰를 더해갑니다.<br />
                            이는 엘로리언이 추구하는, 단순한 구조를 넘어 사람과 시간을 담는 공간 브랜드의 이미지를<br />
                            형성합니다.
                        </SUSectionText>
                    </MotionFadeUp>
                </div>
            </CiSection>

            <CiSection className='ci-sec2'>
                <div>
                    <MotionFadeUp>
                        <SUText36 className='title'> 사용금지 규정</SUText36>
                    </MotionFadeUp>

                    <MotionFadeUp delay={0.1}>
                        <SUSectionText className='text'>
                            코퍼리트 마크의 형태 등을 임의로 바꿀 경우 본래의 이미지가 손상되므로 반드시 표준형태를<br />
                            사용하여야 합니다.<br />
                            예시된 항목 이외에도 이미지의 혼란을 초래한다고 판단되는 경우 CI 주관부서에 문의하여 본래의<br />
                            이미지가 변경되지 않도록 하여주시기 바랍니다.
                        </SUSectionText>
                    </MotionFadeUp>
                </div>

                <ul className='color-card'>
                    <CiColorLi $color={'#E96827'}>
                        <MotionFadeUp delay={0.2}>
                            <div className='info-box'>
                                <p className='name'>Elorien Orange</p>
                                <p className='info'>
                                    Pantone 152 <br />
                                    CO, M 70, Y 100, K 0
                                </p>
                            </div>
                        </MotionFadeUp>
                    </CiColorLi>
                    <CiColorLi $color={'#E9EAEB'}>
                        <MotionFadeUp delay={0.3}>
                            <div className='info-box'>
                                <p className='name'>Elorien Gray</p>
                                <p className='info'>
                                    Pantone 245C <br />
                                    CO, MO, Y 10, K70
                                </p>
                            </div>
                        </MotionFadeUp>
                    </CiColorLi>
                    <CiColorLi $color={'#FFF3E1'}>
                        <MotionFadeUp delay={0.4}>
                            <div className='info-box'>
                                <p className='name'>Elorien Orange</p>
                                <p className='info'>
                                    Pantone 877C <br />
                                    CO, MO, Y 10, K70
                                </p>
                            </div>
                        </MotionFadeUp>
                    </CiColorLi>
                    <CiColorLi $color={'#fff'}>
                        <MotionFadeUp delay={0.5}>
                            <div className='info-box'>
                                <p className='name'>Elorien White</p>
                                <p className='info'>
                                    Pantone 872C <br />
                                    CO, MO, Y 10, K70
                                </p>
                            </div>
                        </MotionFadeUp>
                    </CiColorLi>
                </ul>
            </CiSection>
        </>
    )
}
export default Ci;

const CiSection = styled.section`
    &{
        display: flex;
        flex-wrap: wrap;
        gap: var(--gap);
        padding: var(--gap) 0;
        font-size: 16px;
        > *{width: 100%}
    }
    .ci-top-img{
        width: 100%;
        span{
            display: block;
            img{
                object-fit: cover;
                width: 100%;
            }
        }
    }
    .label{
        display: block;
        margin-bottom: ${SFEm(12, 14)}; //font-size: 14px;
    }
    .title{
        margin-bottom:  ${SFEm(20, 36)}; //font-size: 36px;
    }
    .text{
        font-weight: 400;
    }
    .text + .text{
        margin-top: 1em;
    }

    .color-card{
        font-size: inherit;
        display: flex;
        gap: ${SFEm(32)};
        width: 100%;
        justify-content: space-between;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};

${SFMedia('tab-s', css`
    font-size:  clamp(10px, ${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    .color-card{
        flex-wrap: wrap;
        li{
            flex: 1 1 calc(50% - ${SFEm(32)});
        }
        .info-box{
            margin-top:${SFEm(120)};
            padding:  ${SFEm(14)};
        }
    }
`)};


`;

const CiColorLi = styled.li`
    border: 1px solid #E9EAEB;
    border-radius: 10px;
    overflow: hidden;
    background-color: ${(props) => props?.$color ? props?.$color : '#fff'};
    flex: 1 1;

    .info-box{
        background-color: #fff;
        margin-top: ${SFEm(149, 16)};
        padding:  ${SFEm(24, 16)};
        text-align: center;
    }
    .info-box .name{
        font-size:  ${SFEm(24, 16)};
        font-weight: 600;
        line-height: ${32 / 24};
        margin-bottom:${SFEm(12, 24)} ;
    }
    .info-box .info{
        font-size: ${SFEm(16, 16)};
        font-weight: 400;
        line-height: ${24 / 16};
        color: #535862;
    }
`;