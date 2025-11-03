/**
 * @file LoadingSpinner.js
 * @description 로딩 스피너
 * @author 김단아
 * @since 2025-06-18 14:26
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-18 14:26    김단아       최초 생성
 **/

import React from 'react'
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';

const LoadingSpinner = ({ children, loading }) => {
    if (loading) {
        return (
            <>
                {/* {children} */}
                <LodingWrap>
                    <div className='loading-box'>
                        <div>
                            <img src='/img/sample/loading.gif' alt='' />
                            {/* <p className='loading-txt'> Loading...</p> */}
                        </div>
                    </div>
                </LodingWrap>
            </>
        )
    }
    return children;
}
export default LoadingSpinner;

const LodingWrap = styled.div`
    &{
        position: fixed;
        top:0; left: 0;
        z-index: 9999;
        width: 100vw;
        height: 100vh;
        backdrop-filter: blur(4px);
        background-color: rgba(0,0,0,0.5);
        ${SFFlexCenter};
        color: #fff;
        font-size: 16px;
        text-align: center;
    }
    .loading-txt{
        letter-spacing: 0;
        font-size: ${SFEm(24)};
        font-weight: 500;
        margin-top: ${SFEm(11, 24)};
    }
    img{
        width: ${SFEm(96)};
        border-radius: 50%;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    img{
            width:20%;
    }
`)};
`;