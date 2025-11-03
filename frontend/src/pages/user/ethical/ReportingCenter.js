/**
 * @file ReportingCenter.js
 * @description 윤리경영 > 제도안내
 * @author 김단아
 * @since 2025-06-17 14:22
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-17 14:22    김단아       최초 생성
 **/

import { Button } from 'antd';
import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi';
import { LuSearch } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUDotList, SUText18, SUText24, SUText30 } from 'styles/StyledUser';

const ReportingCenter = () => {
    return (
        <ReportingCenterSection>
            <div className='center-inner'>

                <SUText30>신고자 보호</SUText30>
                <SUText18 $color={'#535862'}>신고자 본인의 동의 없이 그 신분을 노출하거나 이를 암시하는 어떠한 정보도 공개하지 않으며, 철저히 보호하겠습니다</SUText18>
                <SUText24>신고방법</SUText24>
                <div className='center-list'>
                    <ol>
                        <li>
                            <div><span>1.</span>익명신고</div>
                            <SUDotList>
                                <li>신고자정보 노출이 우려되시는 분은 익명신고가 가능합니다.</li>
                            </SUDotList>

                        </li>
                        <li>
                            <div>
                                <span>2.</span>실명신고
                            </div>
                            <SUDotList>
                                <li> 신고자의 정보 입력 및 제공 동의를 받습니다.</li>
                                <li> 신고자의 신원에 대해서는 철저히 비밀을 보장해드립니다.</li>
                            </SUDotList>

                        </li>
                        <li>
                            <div>
                                <span>3.</span>그 외 신고방법
                            </div>
                            <SUDotList>
                                <li> 우편 : 서울특별시 선유로 100(도화동) 윤리경영신고센터</li>
                                <li> 연락처 : 032-760-0655 (전용회선)</li>
                                <li> 이메일 : ethics@Elorien.com</li>
                                <li> 제품에 대한 고객 불만은 콜센터(1522-1271)로 문의해 주시기 바랍니다.</li>
                            </SUDotList>

                        </li>
                    </ol>
                </div>
                <div className='btn-inner'>
                    <Button icon={<FiAlertTriangle />}>신고하기</Button>
                    <Button icon={<LuSearch />}>신고결과조회</Button>
                </div>
            </div>

            {/* <img src='/img/sample/sample-page/reporting-center.png' alt='' /> */}
        </ReportingCenterSection>

    )
}
export default ReportingCenter;


const ReportingCenterSection = styled.section`
padding: var(--gap) 0;
.center-inner{
    max-width: ${SFEm(720)};
    margin: 0 auto;
}
.text-30{
    margin-bottom: ${SFEm(20, 30)};
}
.text-24{
    margin-top: ${SFEm(16 * 2, 24)};
    margin-bottom: ${SFEm(16, 24)};
}
.center-list{
    li{
        font-size: ${SFEm(18)};
        color: #535862;
        font-weight: 400;
        line-height: ${28 / 18};
        > div span  {
            display: inline-flex;
            margin-right: ${SFEm(5)};
        }
    }
    li li{
        font-size: 1em;
        
    }
    li ul{padding-left: ${SFEm(24, 18)};}
}
.btn-inner{
    display: flex;
    justify-content: center;
    margin-top: ${SFEm(34)};
    gap: ${SFEm(12)};
    .ant-btn-icon{
        font-size: ${SFEm(20)};
    }
}
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &,.ant-btn{
        font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    }
`)};
`;