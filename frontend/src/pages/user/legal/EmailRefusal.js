/**
 * @file EmailRefusal.js
 * @description 이메일주소무단수집거부
 * @author 김단아
 * @since 2025-06-17 17:48
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-17 17:48    김단아       최초 생성
 **/

import React from 'react'
import { SUInner1280, SUPointText, SUSectionHeader, SUSectionText, SUText48, SUText30 } from 'styles/StyledUser'
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import styled from 'styled-components';
import { SFEm } from 'styles/StyledFuntion';

const EmailRefusal = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { info, error } = useMsg()
    const [data, setData] = useState([])

    const getTerm = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/term/email`)
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
                    <SUText48>이메일주소무단수집거부</SUText48>
                    <SUSectionText>
                        SQNT는 고객님의 개인정보를 소중하게 생각합니다. <br />
                        저희 웹사이트를 통해 수집되는 모든 정보는 관련 법률을 준수하여 안전하게 보호됩니다.
                    </SUSectionText>
                </SUSectionHeader>
                <div className='terms-inner'>
                    <div className='page-description'>
                        <p className='description'>
                            {data.map((item, index) => (
                                <div key={index} dangerouslySetInnerHTML={{ __html: item.description }}></div>
                            ))}
                        </p>
                    </div>

                </div>
            </SUInner1280>
        </TermsSection>
    )
}
export default EmailRefusal;


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
`;