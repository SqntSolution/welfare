/**
 * @file TermsOfService.js
 * @description 이용약관 페이지
 * @author 김단아
 * @since 2025-06-17 15:08
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-17 15:08    김단아       최초 생성
 **/

import React from 'react'
import { SUInner1280, SUPointText, SUSectionHeader, SUSectionText, SUText48, SUText30 } from 'styles/StyledUser'
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';

const TermsOfService = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { info, error } = useMsg()
    const [data, setData] = useState([])
    
    const getTerm = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/term/terms`)
            .then((res) => {
                const resp = res?.data
                setData(resp || [])
                setLoading(false)
            })
            .catch((err) => {
                error(err, 10)
                setLoading(false)
            })
    }
    useEffect(() => {
        getTerm()
    }, [])

    return (
        <TermsSection>
            <SUInner1280>
                <SUSectionHeader className='section-header'>
                    <SUPointText>2025년 7월 11일 기준</SUPointText>
                    <SUText48>이용약관</SUText48>
                    <SUSectionText>
                        SQNT는 고객님의 개인정보를 소중하게 생각합니다. <br />
                        저희 웹사이트를 통해 수집되는 모든 정보는 관련 법률을 준수하여 안전하게 보호됩니다.
                    </SUSectionText>
                </SUSectionHeader>
                <div className='terms-inner'>
                    <div className='page-description'>
                        <SUSectionText className='title'>
                            SQNT는 고객 한 분 한 분의 목소리에 귀 기울이며, 신뢰받는 파트너로 함께 성장하는 기업이 되겠습니다.
                        </SUSectionText>
                        <p className='description'>
                            SQNT는 고객님의 개인정보를 소중하게 생각합니다. 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「전기통신사업법」 등 관계 법령을 준수하며, 수집·보유·처리되는 개인정보는 정당한 목적과 절차에 따라 안전하게 관리됩니다. 고객님의 권리를 보호하고, 투명한 업무 수행을 위해 최선을 다하겠습니다.
                        </p>
                    </div>
                    {
                        data.map((item, index) => (
                            <div key={index}>
                                {/* <SUText30>{item.title}</SUText30> */}
                                <SUSectionText>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                </SUSectionText>
                            </div>
                        ))
                    }
                </div>
            </SUInner1280>
        </TermsSection>
    )
}
export default TermsOfService;


const TermsSection = styled.section`
    font-size: 16px;
    .section-header{
        text-align: center;
    }
    .terms-inner{
        max-width: ${SFEm(720)};
        margin: 0 auto;
    }
    .page-description{
        background-color: #FAFAFA;
        padding: ${SFEm(24)};
        border-radius: ${SFEm(15)};
        overflow: hidden;
        margin-bottom: ${SFEm(48)};
        .title{
            color: #181D27;
            font-weight: 600;
        }
        .description{
            font-size: ${SFEm(16)};
            margin-top: ${SFEm(8)};
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