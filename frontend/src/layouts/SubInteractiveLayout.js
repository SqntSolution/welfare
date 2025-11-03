/**
 * @file SubInteractiveLayout.js
 * @description 인터렉티브 배너가 들어가는 정적 페이지 레이아웃 입니다. 
 * @author 이름
 * @since 2025-05-29 14:59
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-29 14:59    이름       최초 생성
 **/

import { useSpring, motion, useScroll, useTransform } from 'framer-motion';
import { useGetMenus } from 'hooks/helperHook';
import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { MotionFadeUp } from 'styles/Animations';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';
import { SUInner1440, SUPointText, SUText36, SUVarDiv } from 'styles/StyledUser';


const SubInteractiveLayout = (props) => {
    const location = useLocation();
    const path = location.pathname;
    const menus = useGetMenus();
    const innerEndRef = useRef(null);

    // 1. 상위 path 찾기
    const matchedSection = menus.find(section => path.startsWith(`/${section.menuEngNm}`));
    // console.log('matchedSection::', matchedSection);

    // 2. 자식 path 찾기
    const childPath = path.split('/').pop();
    const matchedPage = matchedSection?.menuChildren?.find(child => child.menuEngNm === childPath);
    // console.log('matchedPage::', matchedPage);


    const { scrollYProgress } = useScroll({
        target: innerEndRef,
        offset: ['start end', 'end end'],
        //target  view      target view 
    });

    const innerTranslateY = useTransform(scrollYProgress, [0, 0.2, 1], ['36.875em', '36.875em', '0em']);
    const textBoxTranslateY = useTransform(scrollYProgress, [0, 0.2, 1], [`-${36.875 * 2}em`, `-${36.875 * 2.23}em`, '0em']);
    const bgTranslateY = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.99, 1], [1, 1, 0.7]);


    const translateY = useSpring(bgTranslateY, {
        damping: 20,
        stiffness: 200,
        mass: 1,
        restDelta: 0.001
    });

    const renderWithLineBreaks = (text) =>
        text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
                {line}
                <br />
            </React.Fragment>
        ));

    return (
        <>
            {/* 배너 */}
            <SubBannerSection>
                {/* {matchedPage ?
                    ( */}
                <div className='banner-wrap'>
                    <div className='banner-inner inner-start inner-com-style' >
                        <div className='banner-contents'>
                            <div className='text-box'>
                                <MotionFadeUp delay={0.1}> <SUPointText className='label'>{matchedSection?.menuNm || ''} </SUPointText></MotionFadeUp>
                                <MotionFadeUp delay={0.3}> <SUText36 className='title'>{matchedPage?.title || ''}</SUText36></MotionFadeUp>
                                <MotionFadeUp delay={0.5}>
                                    <p className='description'>
                                        {renderWithLineBreaks(matchedPage?.description || '')}
                                    </p>
                                </MotionFadeUp>
                            </div>
                        </div>
                    </div>
                    <div className='banner-img'>
                        <img 
                            src={matchedPage?.imagePath ? `/api/v1/view/image/${matchedPage.imagePath}` : '/img/sample/main-sec1-bg.png'} 
                            alt='' 
                            onError={(e) => {
                                e.target.src = '/img/sample/main-sec1-bg.png';
                                e.target.onerror = null; // 무한 루프 방지
                            }}
                        />
                    </div>
                </div>

            </SubBannerSection>

            {/* 서브 콘텐츠 영역 */}
            <SUInner1440>
                <SUVarDiv>
                    <Outlet />
                </SUVarDiv>
            </SUInner1440>
        </>
    )
}
export default SubInteractiveLayout;



const SubBannerSection = styled.section`
    font-size: 16px;
    position: relative;    
    width: 100vw;
    min-height: 100svh;
    overflow: hidden;
    .inner-com-style{
        ${SFFlexCenter};
        position: sticky; top:0;
        width: 100%;
        height: 100svh;
    }

    .banner-contents{
        ${SFFlexCenter};
        overflow: hidden;
        position: absolute;
        width: 100%;
        height: ${SFEm(590, 16)};
        overflow: hidden;
    }

    .text-box{
        &{
            max-width: 1440px;
            padding: 0 32px;
            width: 96%;
            min-height: ${SFEm(380, 16)};
            color:#fff;
            
        }
        .label{color:#fff;}
        .title{
            margin-top : ${SFEm(12, 36)};
            color:#fff;
        }
        .description{
            font-size: ${SFEm(48, 16)};
            font-weight: 600;
            line-height: ${60 / 48};
            letter-spacing: -0.045em;
            color: #fff;
            margin-top: ${SFEm(40, 48)};
            word-break: keep-all;
        }
    }

    .banner-img{
        position: absolute;
        top:0; left: 0;
        transform: scale(1.4);
        transform-origin: center center;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        /* transition: transform 0.3s; */
        animation:1.4s forwards ease-in-out bannerImg-ani ;
        img{
            width: 100%;
            height: 100%;
            /* background-size: cover; */
            object-fit: cover;
        }
    }

    @keyframes bannerImg-ani {
        0%{
            transform: scale(1.4);
        }
        100%{
            transform: scale(1);

        }
    }

    ${SFMedia('tab-l', css`
        .text-box{
            font-size: ${SFEm(12)};
        }
    `)};
    ${SFMedia('mo-l', css`
        .text-box{
            font-size: ${12 / mediaWidth['mo-m'] * 100}vw;
            br{display:none}
        }
    `)};
`;
