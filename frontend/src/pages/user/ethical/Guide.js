/**
 * @file Management.js
 * @description 윤리경영 > 제도안내
 * @author 이름
 * @since 2025-06-17 13:55
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-17 13:55    이름       최초 생성
 **/

import React from 'react'
import styled, { css } from 'styled-components';
import { SUDotList, SUInner1280, SUSectionText, SUText24, SUText36, SUText30, SUText18, SUText16, SUText20 } from 'styles/StyledUser';
import { LuCheck, LuChevronsRight } from "react-icons/lu";
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';

const Guide = () => {
    return (
        <GuideSection>
            <div className='guide-inner'>

                <SUText36 className='title-1'>윤리신고제도 운영안내</SUText36>
                <SUText20 $weight={400}>
                    Elorien 은 투명하고 윤리적인 기업문화 정착을 위해 거래업체 등 외부 이해관계자와 관련되어 회사 임직원의 부정행위 및 불공정 거래 행위 에 대한 신고를 받고 있습니다.
                </SUText20>

                <SUText30 className='title-2'>신고 대상</SUText30>
                <SUDotList>
                    <li> 임직원의 직무에 관한 위법 및 범죄 행위</li>
                    <li> 이해관계자에게 부당한 지시를 하는 행위</li>
                    <li> 회사의 자산과 정보를 부적절하게 사용하거나, 부당한 이득을 취하는 행위</li>
                    <li> 회계정보의 허위 작성, 위 변조, 훼손 또는 파기 및 이를 지시하는 행위</li>
                    <li> 건전한 기업문화를 해치는 행위</li>
                    <li> 기타 이해관계자와 관련된 비윤리 행위</li>
                </SUDotList>

                <SUText24 className='title-2'>신고자 보호 정책</SUText24>
                <div className='text-box'>
                    <SUText20 className='title-3' $weight={600}>신고자 보호 정책</SUText20>
                    <SUDotList>
                        <li> 임직원의 직무에 관한 위법 및 범죄 행위</li>
                        <li> 이해관계자에게 부당한 지시를 하는 행위</li>
                        <li> 회사의 자산과 정보를 부적절하게 사용하거나, 부당한 이득을 취하는 행위</li>
                        <li> 회계정보의 허위 작성, 위 변조, 훼손 또는 파기 및 이를 지시하는 행위</li>
                        <li> 건전한 기업문화를 해치는 행위</li>
                        <li> 기타 이해관계자와 관련된 비윤리 행위</li>
                    </SUDotList>
                    <SUText20 className='title-3' $weight={600}>신고자 신분보장</SUText20>
                    <SUDotList>
                        <li> 정당한 신고를 한 이유로 신고자의 인사상 또는 신분상 불이익이나 차별을 하지 않습니다.</li>
                        <li> 신고로 불이익을 받은 경우 보호조치를 요청할 수 있으며, 불이익이 최소화 되도록 조치할 것입니다.</li>
                        <li> 신고자가 전환배치를 요청할 경우 소속부서장은 우선 배려하여 조치합니다.</li>
                        <li> 자진 신고한 경우 비위 정도, 근무태도, 반성 정도 등을 종합적으로 고려하여 책임을 감면 받을 수 있습니다.</li>
                    </SUDotList>
                </div>


                <SUText24 className='title-2'>포상정책</SUText24>
                <SUText18 $weight={400} $color={'#535862'}>
                    당사는 사업의 투명성 제고 및 건전한 기업문화 정착을 위해 부정행위에 대한 신고자 보상제도를 운영하고 있습니다.
                </SUText18>
                <br />
                <SUText18 $weight={400} $color={'#535862'}>
                    신고의 결과로 회사의 경영활동과 부정행위 근절에 기여한 경우 내부 심의를 거쳐 포상 등 보상조치를 실행 하겠습니다.다만, 신고 내용이 사실이 아니거나 증거 부족으로 사실 확인이 곤란한 경우, 이미 조사가 진행 또는 완료되었거나 기타 회사의 심의결과 포상이 부적절하다고 인정되는 경우 보상조치에서 제외될 수 있습니다.
                </SUText18>

                <SUText24 className='title-2'>운영 및 절차</SUText24>
                <div className='step-wrap'>
                    <div className='step-item'>
                        <span className='icon'><LuCheck /></span>
                        <SUText16 className="title" $weight={600} $color={'#414651'}>접수·검토</SUText16>
                        <SUDotList>
                            <li> 접수확인</li>
                            <li> 신고사항검토</li>
                            <li> 조사결정</li>
                        </SUDotList>
                    </div>
                    <LuChevronsRight className='arrow-right' />
                    <div className='step-item'>
                        <span className='icon'><LuCheck /></span>
                        <SUText16 className="title" $weight={600} $color={'#414651'}>응답</SUText16>
                        <SUDotList>
                            <li> 조사응답</li>
                            <li> 사실관계 조사 <br />(비밀보장)</li>
                        </SUDotList>
                    </div>
                    <LuChevronsRight className='arrow-right' />
                    <div className='step-item'>
                        <span className='icon'><LuCheck /></span>
                        <SUText16 className="title" $weight={600} $color={'#414651'}>사실관계조사</SUText16>
                        <SUDotList>
                            <li> 사실관계 조사</li>
                            <li> 결과 조치</li>
                        </SUDotList>
                    </div>
                    <LuChevronsRight className='arrow-right' />
                    <div className='step-item'>
                        <span className='icon'><LuCheck /></span>
                        <SUText16 className="title" $weight={600} $color={'#414651'}>결과회신</SUText16>
                        <SUDotList>
                            <li>신고자 회신</li>
                        </SUDotList>
                    </div>

                </div>
            </div>
        </GuideSection>
    )
}
export default Guide;
const GuideSection = styled.section`
    padding: var(--gap) 0;
    font-size: 16px;
    .guide-inner{
        max-width: 720px;
        margin: 0 auto;
    }
    .title-1 {
        margin-bottom: ${SFEm(20, 36)};
    }
    .title-2{
        margin: ${SFEm(32, 30)} 0 ${SFEm(16, 30)};
    }
    .title-3{
        margin-bottom: ${SFEm(12, 20)};
    }
    .text-box{
        background-color: #FAFAFA;
        padding: ${SFEm(24)};
        border-radius: ${SFEm(15)};
        .dot-list{
            margin-left: ${SFEm(8)};
        }
        .dot-list + .title-3{
            margin-top: ${SFEm(32, 20)};
        }
    }
    .step-wrap{
        display: flex;
        position: relative;
        justify-content: center;
        margin-left: ${SFEm(-48)};
        & > div{flex : 1 1}
        &::after{
            content: '';
            display: block;
            position: absolute;
            top:${SFEm(24)};
            left: ${SFEm(48 * 2.5)};
            width: calc(100% - ${SFEm(48 * 4)});
            height: 1px;
            border: 1px dashed #D5D7DA;
            z-index: -1;

        }
        .step-item{
            padding: 0 ${SFEm(24)};
            min-width: ${SFEm(162)};
        }
        .icon{
            ${SFFlexCenter};
            font-size: ${SFEm(20)} ;
            width: ${SFEm(40)};
            aspect-ratio: 1 / 1;
            border: 1px solid #D5D7DA; 
            border-radius: ${SFEm(8, 20)};
            overflow: hidden;
            box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
            margin: 0 auto ${SFEm(16, 20)};
            background-color: #fff;
        }
        .title{
            /* max-width: fit-content; */
            text-align: center;
            margin-bottom: ${SFEm(8, 16)};
            margin-left: ${SFEm(12)};
        }
        .arrow-right{
            font-size: ${SFEm(24)};
            color: #A4A7AE;
            position: relative;
            top: ${SFEm(70, 24)};
            /* left: ${SFEm(-24, 24)}; */
        }
        .dot-list{
            max-width: fit-content;
            font-size: ${SFEm(14)};
            margin: 0 auto;
        }
        .dot-list li{
            color: #535862;
            font-weight: 400;
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};

${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    .step-wrap::after{
        display: none;
    }

    .step-wrap{
        /* display: block; */
        margin-left: 0;

        .step-item + svg{
            display: none;
        }
        .step-item{
            min-width: 0;
            padding: 0 ${SFEm(10)};
        }
    }
    
`)};

${SFMedia('mo-s', css`
    .step-wrap{
        flex-wrap: wrap;
        .step-item{
            flex: 1 1;
            width: 50%;
        }
    }
`)};
`;