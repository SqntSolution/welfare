import { Col, Divider, Flex, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from "styles/StyledFuntion";
import { motion, useScroll, useTransform } from "framer-motion";
import { MotionFadeUp } from 'styles/Animations';


import { useRef } from "react";
import { SUBadge } from "styles/StyledUser";


export const MainWrap = styled.div`
--text-brand-secondary : #FCA049;
--text-quaternary:#717680;

section {
    min-height: 100svh;
    min-width: 100svw;
    padding: 96px 0;
}
${SFMedia('mo-l', css`
    section {
        padding: 64px 0;
    }
`)};
${SFMedia('mo-m', css`
    section {
        padding: ${64 / mediaWidth['mo-m'] * 100}vw 0;
    }
`)};
`;
export const SectionHeader = styled.div`
    
    display: flex;
    flex-wrap: wrap;
    text-align: ${(props) => props.$align};
    gap:  ${SFEm(12, 16)};
    width: 100%;
    font-size: 16px;
    
    & * {
        display: block;
        width: 100%;
    }
    p{margin-top:${SFEm(8, 16)}; word-break: keep-all;}
    h3{
        word-break: keep-all;
    }
    ${SFMedia('pc-s', css`
        &{font-size: 14px}
    `)}

    ${SFMedia('mo-l', css`
        span{
            font-size: ${SFEm(14, 14)};
            font-weight: 400;
        }
        h3{
            font-size: ${SFEm(30, 14)};
        }
        p{
            font-size: ${SFEm(20, 14)};
        }
    `)}
    ${SFMedia('mo-m', css`
        font-size: ${14 / mediaWidth['mo-m'] * 100}vw  !important;
    `)}
    
`;


export const Section1 = styled.section`
    min-width: 100svw;
    min-height: 100svh;
    background: url('/img/sample/main-sec1-bg.png') top center no-repeat ;
    background-size: cover;
    ${SFFlexCenter};
    color: #fff;
    position: relative;
    top: var(--section1-top); 
    overflow: hidden;
    word-break: keep-all;
    .sec1-title{
        font-size: ${SFEm(60, 16)};
        font-weight: 700;
        line-height: ${72 / 60};
        
    }
    .sec1-text{
        font-size: ${SFEm(20, 16)};
        line-height: ${30 / 20};
        margin-top:${SFEm(24, 20)};
    }
    .sec1-more{
        background-color: rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        margin-top: ${SFEm(48, 16)};
        font-size: 1em;
        padding-left: 1em;
        
        &:hover,
        &:hover .text{
            color:#181D27 ;
        }
        .icon{
            color:#181D27 ;
        }
        .icon::after{
            background-color: #fff;

        }
    }

    .blinds{
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 200;
    }
    .blinds-inner{
        display: flex;
        height: 50%;
    }
    .blinds-top {
        .blinds-line::after{
            top:0;
            animation: 1.3s forwards blindEffectTop ease;
        }
    }
    .blinds-bottom{
        .blinds-line::after{
            bottom:0;
            animation: 1.3s forwards blindEffectBottom ease;
        }
    }
    .blinds-line{
        display: block;
        flex: 1 1;
        position: relative;
        
    }
    .blinds-line::after{
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 50%; transform: translateX(-50%);
        background-color: var(--color-point);
        z-index: 1;
    }

    ${[...Array(5)].map(
    (_, i) => `
        .blinds-line:nth-child(${i + 1})::after {
            animation-delay: ${i * 0.1}s;
        };
        `)
    };

    @keyframes blindEffectTop {
        100% {
            top: -102%;
        }
    }
    @keyframes blindEffectBottom {
        100% {
            bottom: -102%;
        }
    }
    ${SFMedia('pc-s', css`
        &{
            font-size: 14px;
        }
    `)};
    ${SFMedia('tab-l', css`
        &{
            font-size: 12px;
        }
    `)};
    ${SFMedia('mo-l', css`
        &{
            font-size: 10px;
        }
        .sec1-text{
            font-size : ${SFEm(20, 10)};
        }
        .sec1-more{
            font-size : ${SFEm(16, 10)};
        }
    `)};
    ${SFMedia('mo-m', css`
        &{
            font-size: ${10 / mediaWidth['mo-m'] * 100}vw;
        }
    `)}
`;


// main section2 component
export const Section2 = styled.section`
    &{margin-top: -96px}
    .swiper{
        margin-right: -32px;
    }
    .btn-wrap{
        position: absolute;
        top:50%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        z-index: 10;
        display: flex;
        justify-content: space-between;
        padding: 0 24px;

        .btn{
            ${SFFlexCenter};
            width:${SFEm(56, 24)} ;
            height:${SFEm(56, 24)} ;
            border-radius: 50%;
            background-color:rgba(0, 0, 0, 0.14);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            overflow: hidden;
            font-size: 24px;
            color: #fff;
            border: 0;
            opacity: 0.65;
            transition: all 0.8s;
        }
        .btn:hover{
            opacity: 1;
        }

    }
    .stat-item  {
        flex: 1 1;
        display: block;
        font-size: 16px;
        p{margin-top:  ${SFEm(4, 16)};;}
        > * {
            display: block;
            width: 100%;
        }
    }
    .ant-statistic{font-size: 1em;}
    .stat-item  .ant-statistic-content{
        font-size:  ${SFEm(48, 16)};
        font-weight: 700;
        line-height: ${60 / 48};
        color: var(--color-point);
    }
    .stat-title{
        font-size:  ${SFEm(18, 16)};
        line-height: ${28 / 18};
        font-weight: 600;
    }
    .stat-description{
        font-size: 1em;
        line-height: ${24 / 16};
        font-weight: 400;
        color: var(--color-tertiary);
    }
    .sec2-mo-img{
        text-align: center;
        margin: 0 auto;
        width: 100%;
        & > div {
            overflow:hidden;
            border-radius: 12px;
        }
        div + div{margin-top:32px}
        img{
            width: 100%;

        }
    }
    /* 반응형 */
    ${SFMedia('pc-s', css`
        .stat-item{font-size: 14px}
    `)}
    ${SFMedia('tab-l', css`
        .sata-wrap{
            flex-wrap: wrap;
        }
        .stat-item{
            width: 50%;
            flex:  1 1 calc(50% - 32px);
        }
    `)}
    ${SFMedia('mo-l', css`
        .stat-item{
            width: 100%;
            flex:  1 1 100%;
        }
    `)}
    ${SFMedia('mo-m', css`
        .stat-item{
            font-size: ${16 / mediaWidth['mo-m'] * 100}vw;
        }
    `)}
`;

export const StatInner = (props) => {
    const { number, title, description, suffix, duration } = props;
    return (
        <div className='stat-item'>
            <Statistic
                value={number}
                className='stat-num'
                formatter={(value) => <CountUp end={value} duration={duration ?? 2} enableScrollSpy scrollSpyOnce={true} />}
                suffix={suffix ?? ''}

            />
            <p className='stat-title'>{title}</p>
            <p className='stat-description'>{description}</p>
        </div>
    )
}



// main section3
export const AccordionUl = styled.ul`
    --left-img-size :  calc(816 / 1920 * 100vw);
    &{
        position: relative;
        transition: 0.8s ease-in-out;
        width: 100%;
        min-height: var( --left-img-size ) ;
        max-height: ${SFEm(816)};
        font-size: 16px;
    }
    li{
        padding-left:var( --left-img-size) ;
        width: 100%;
        transition: 0.3s ease-in-out;
        @media all  and (min-width:1921px){
            padding-left: ${SFEm(816)};
        }
    }
    .left-imgBox{
        position: absolute;
        top:0;
        left: 0;
        width:var( --left-img-size );
        max-width: ${SFEm(816)};
        aspect-ratio: 1 / 1;
        background-color: #ccc;
        border-radius: ${SFEm(24, 16)};
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        opacity: 0;
        transition: 0.3s ease-in-out;
        display: block;
    }
    li + li .right-list{padding-top: ${SFEm(20, 16)};}
    .right-list{
        margin-left: ${SFEm(64, 16)};
        border-bottom: 1px solid var(--color-boder-secondary);
        padding-bottom: ${SFEm(20, 16)};

        button {
            width: 100%;
            height: ${SFEm(36, 16)};
            display: block;
            
        }
       .ant-flex {
            width: 100%;
            height: 100%;
        }
        .list-number{
            color: var(--text-brand-secondary);
            font-size: ${SFEm(24, 16)};
            font-weight: 700;
            line-height: 1;
        }
        .list-title{
            font-size: ${SFEm(20, 16)};
            font-weight: 600;
            line-height: 1;
            text-align: left;
        }
        .icon{
            ${SFFlexCenter};
            margin-left: auto;
            font-size: ${SFEm(20, 16)};
            color: var(--color-tertiary);
            position: relative;
            transform: rotate(-45deg);
            transition: all 0.3s linear;
        }
        .accodion-contents{
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;

            font-size: 1em;    
            line-height: ${24 / 16};
            color: var(--color-tertiary);
        }
        .accodion-contents p{padding-top: ${SFEm(20, 16)}}
    }


    /* action */
    li.act{
        .left-imgBox{
            opacity: 1;
        }

        .icon{
            transform: rotate(0deg);
        }
    }


    ${SFMedia('pc-m', css`
        --left-img-size :  calc(576 / 1440 * 100vw);
        li{
            padding-left:var( --left-img-size);
        }
        .left-imgBox{
            width: var( --left-img-size);
        }

    `)}
    ${SFMedia('pc-s', css`
        &{font-size: 14px}
    `)}
    ${SFMedia('mo-l', css`
        &{font-size: 12px}
    `)}

    ${SFMedia('mo-m', css`
        &{font-size: ${16 / mediaWidth['mo-m'] * 100}vw;}
        &{
            padding-top: calc(100vw - 16px + ${SFEm(48, 16)});
        }
        li{
            padding-left : 0;
            position: unset;
        }
        .left-imgBox{
            width: 100%;
        }
        .right-list{
            margin-left: 0;
        }
    `)}
`;


// main section4
export const Section4 = styled.section`
    --card-height: ${SFEm(690, 16)};
    .sec4-card-banner{
        width: calc(100% + 64px);
        margin: 0 -32px;
        position: relative;
    }
    .card-inner{
        width: 100%;
        transform-style: "preserve-3d";
        perspective: 1000px; 
        font-size: 16px;
    }
    .card-item{
        position: sticky;
        top:calc((100svh - var( --card-height)) / 2);
        left: 0;
        width: 100%;
        height: var( --card-height);
        transform-style: preserve-3d;
        perspective: 1200px;
        overflow: hidden;
        border-radius: ${SFEm(24, 16)};
        background-color: #fff;

        .img{
            position: absolute;
            width: 100%;
            height: var( --card-height);
            display: block;
            z-index: -1;
            pointer-events: none;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .card-item + .card-item {margin-top : ${SFEm(40, 16)};}
    .card-item-box{
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        
        border-radius: var(--border-radius-4xl);
        border-radius:${SFEm(24, 16)};;
        overflow: hidden;
        height: 100%;
        width: 100%;
        padding:${SFEm(67, 16)};;
        
        position: absolute;
        top:0;left:0;
        will-change: transform;
        transform-style: preserve-3d;
        perspective: 1500px;
        z-index: 2;
    }

    .card-contents{
        &{
            width: 100%;
            height: 100%;
            color: #fff;
            align-content: flex-end;
        }
        .title{
            display: block;
            width: 100%;
            font-size: ${SFEm(48, 16)};;
            line-height: ${60 / 48};
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .label{
            display: inline-block;
            padding:  ${SFEm(2, 12)} ${SFEm(8, 12)} ;
            border-radius: ${SFEm(16, 12)} ;
            border: 1px solid var(--color-point-200);
            overflow: hidden;
            background-color: var(--color-point-50);
            
            color: var(--color-primary-5);
            font-weight: 500;
            font-size: ${SFEm(12, 16)} ;
        }
    }
    ${SFMedia('pc-m', css` 
        .sec4-card-banner{
            width: calc(100% + 32px);
            margin: 0 -16px;
        }
    `)}
    ${SFMedia('pc-s', css` 
        .card-inner{
            font-size: 14px;
        }
    `)}
    ${SFMedia('tab-l', css` 
        .card-inner{
            font-size: 12px;
        }
    `)}
    ${SFMedia('mo-l', css` 
        --card-height: ${SFEm(450, 10)};
        .sec4-card-banner{
            width: 100%;
            margin: 0 auto;
        }
        .card-inner{
            font-size: 10px;
        }
        .card-item{
            position: unset;
        }
        .card-item-box{
            padding: ${SFEm(16, 10)};
        }
        .card-contents {
            .label{
                font-size:  ${SFEm(12, 10)};
            }
            .title{
                font-size:  ${SFEm(24, 10)};
                br{display: none}
            }
        }
    `)}
    ${SFMedia('mo-m', css`
        .card-inner{
            font-size:${10 / mediaWidth['mo-m'] * 100}vw;
        }
    `)}
`;
export const ProjectCardItem = (props) => {
    const { label, title, img } = props;
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end center'],
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const contentTranslateY = useTransform(scrollYProgress, [0, 0.4], [200, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);


    return (
        <motion.div className='card-item' ref={ref}>
            <motion.div className='card-item-box'>
                <motion.div
                    className='card-contents'
                    style={{ translateY: contentTranslateY }}
                    transition={{ duration: 1, ease: 'linear' }}
                >
                    <Flex gap={12} wrap align="end">
                        <span className='label'>{label}</span>
                        <h4 className='title'>{title}</h4>
                    </Flex>
                </motion.div>
            </motion.div>
            <motion.span className="img"
                style={{
                    scale
                }}
            >
                <img src={`/img/sample/${img}`} alt="" />
            </motion.span>
        </motion.div>
    );
};


// main section5 
export const Section5 = styled.section`
    .sec5-slide-inner{
        width: 100%;
    }
    .sec5-slide{
        padding-right : 0;
        font-size: 16px;
    }
    .btn-wrap{
        margin-top: ${SFEm(32, 16)};
    }
    .btn{
        ${SFFlexCenter};
        border-radius: 50%;
        background-color: #FAFAFA;
        width: ${SFEm(54, 24)};
        height: ${SFEm(54, 24)};
        font-size: ${SFEm(24, 16)};
        color: var(--text-quaternary);
        overflow: hidden;
        border: 0;
        opacity: 0.7;
    }
    .btn.swiper-button-disabled {
        pointer-events: none;
        svg{
            opacity: 0.3;
        }
    }
    .btn:not(.swiper-button-disabled):hover{
        opacity: 1;
    }
    ${SFMedia('pc-s', css` 
        div:has(.sec5-slide){
            width: 100%;
        }
        .sec5-slide{
            font-size: 14px;
        }
    `)}
    ${SFMedia('mo-l', css`
        .sec5-slide{
            padding-right: 16px;
            font-size: 12px;
        }
    `)}
    ${SFMedia('mo-m', css`
        .sec5-slide{
            font-size: 16px;
        }
        .sec5-item + .sec5-item{
            margin-top: 24px;
        }

    `)}
    ${SFMedia('mo-s', css`
        .sec5-slide{
            font-size:${14 / mediaWidth['mo-s'] * 100}vw;
        }
    `)}
`;

export const MoreLink = styled(Link)`
    --more-side-padding:  ${SFEm(12, 16)};
    &{
        margin-top: 1em;
        min-width:  ${SFEm(130, 16)};;
        min-height: ${SFEm(48, 16)};
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: ${SFEm(8, 16)};
        padding:${SFEm(14, 16)} var(--more-side-padding);
        border-radius: ${SFEm(48, 16)};
        background-color: #F5F5F5;
        overflow: hidden;
        position: relative;
        font-size: 1em;
        font-weight: 600;
        line-height: 1;
    }
    .text{
        position: relative;
        z-index: 2;
        transition: 0.5s 0.1s ease-in-out;
    }
    .icon{
        ${SFFlexCenter};
        font-size:  ${SFEm(12, 16)};
        color: #fff;
        position: relative;
        width: ${SFEm(24, 12)};
        height: ${SFEm(24, 12)};

        &::after {
            content: '';
            display: block;
            position: absolute;
            top:50%; left:0;
            transform: translateY(-50%);
            width: inherit;
            height: inherit;
            border-radius: 50%;
            background-color: #0A0D12;
            z-index: 1;
            transition: transform 0.5s ease-in-out;
        }
        svg {
            width: 1em;
            aspect-ratio: 1 / 1;
            transform : rotate(-45deg);
            display :block ;
            z-index: 2;
            transition: transform 0.2s ease-in-out;
        }

    }
    &:active {
        scale: 0.95;
    }
    &:hover,&:active {
        .text{
            color: #fff;
        }
        .icon::after{
            transform: translateY(-50%) scale(13);
        }
        .icon  svg {
            transform : rotate(0deg);
        }
    }
`;

//section6 
export const Section6 = styled.section`
&&{
    min-height: 1654px;
    position: relative;
    display: flex;
    align-items: flex-end;
    align-content: flex-end;
    overflow: hidden;
}
.sec6-bg{
    position: absolute;
    top:0%; left: 0%;
    width: 100%;
    height: 100%;
    z-index: -1;
    background:url('/img/sample/main-sec6-bg.png') top center no-repeat ;
    background-size: cover;
}
.motion-wrap{
    position: relative;
    z-index: 2;
    margin: 0 auto;
}
`;



export const VisualFeatureWrap = styled.div`
    &{
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 16px;
    }

    .visual-card{
        position: relative;
        width: 100%;
    }
    .visual-card-inner{
        height: 100%;
        border-radius: 16px;
        overflow: hidden;
    }
    .visual-card-link{
        position: absolute;
        bottom: 0; left: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 16px;
        display: flex;
        align-items: flex-end;
        align-content: flex-end;
        flex-wrap: wrap;
        gap: 4px;
        padding: 16px;
        z-index: 2;
    }
    .visual-card-label {
        display: block;
        width: 100%;
        font-size: 18px;
        color: #fff;
        line-height: ${28 / 18};
        font-weight: 700;
    }
    .visual-card-text {
        font-size: 16px;
        color: #fff;
        line-height: ${24 / 16};
    }
    .visual-card-img {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.4s;
        img{
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }
    .visual-card-link:hover{
        & + .visual-card-img{
            transform: scale(1.2);
        }
    }
    ${SFMedia('tab-l', css`
        &{
            display: block;
            margin: 0 auto;
        }
        & > .ant-flex + .ant-flex {
            margin-top: 16px;
        }
        .ant-flex > div{
            width: 100%;
        }
    `)};
    
    ${SFMedia('mo-m', css`
        .small-inner{
            flex-wrap:  wrap;
        }
        .visual-card-img{
            height: 180px;
        }
    `)};
`;

export const VisualFeatureCards = (props) => {
    const { label, text, img, to } = props;

    return (
        <div className={`visual-card`}>
            <div className="visual-card-inner">
                <Link to={to} className="visual-card-link">
                    {label ? <span className="visual-card-label">{label}</span> : null}
                    {text ? <p className="visual-card-text">{text}</p> : null}

                </Link>
                <span className="visual-card-img">
                    <img src={`/img/sample/${img}`} alt="" />
                </span>
            </div>
        </div>
    )
}

// section7
export const RollingBannerStyle = styled.div`
&{
    padding: 96px 0;
    text-align: center;
}
.text{
    font-size: 16px;
    color: var(--color-tertiary);
    line-height: ${24 / 16};
    margin-bottom: 32px;
}
.rolling-banner-wrap {
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 40%, black 60%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 40%, black 60%, transparent);
}

.rolling-banner-inner {
  display: flex;
  will-change: transform;
  width: max-content;
  gap: 32px;
}

.banner-item {
  ${SFFlexCenter};
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
  width: auto;
  transition: all 0.3s linear;
  img{
        display:block;
        height: 48px;
    }
}
${SFMedia('mo-l', css`
    &{
        padding: 64px 0;
    }
    .banner-item {
        flex-wrap: wrap;
        height: 36px;
    }
    .mo-rolling{
        .rolling-banner-wrap:first-child{
            padding-left: 60px;
        }
        .rolling-banner-wrap:last-child{
        }
    }
`)};

${SFMedia('mo-s', css`
    &{
        padding: ${64 / mediaWidth['mo-m'] * 100}vw 0;
    }
    .text{font-size:  ${16 / mediaWidth['mo-m'] * 100}vw}
    .banner-item {
        height:  ${36 / mediaWidth['mo-m'] * 100}vw;
    }
    .mo-rolling{
        .rolling-banner-wrap:first-child{
            padding-left: ${60 / mediaWidth['mo-m'] * 100}vw;
        }
    }
`)}


`;

export const RollingBanner = ({ images = [], repeat = 3 }) => {
    const content = Array.from({ length: repeat }).flatMap((_, i) =>
        images.map((imgSrc, j) => (
            <span key={`img-${i}-${j}`} className="banner-item">
                <img src={`/img/sample/logo/${imgSrc}`} alt={`logo-${j}`} />
            </span>
        ))
    );

    return (
        <div className="rolling-banner-wrap" >
            <motion.div
                className="rolling-banner-inner"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                }}
            >
                {content}
                {content}
            </motion.div>
        </div >
    );
};

// section8
export const Section8 = styled.section`
    .sec7-left > div{
        display: block;
        width: 360px;
    }
    ${SFMedia('pc-s', css`
        .inner.ant-flex{
            flex-wrap: wrap;
            gap: 48px !important;
        }
    `)};

    ${SFMedia('mo-m', css`
        .sec7-left > div{width: auto}
        .ant-row{
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        .ant-col:nth-child(odd){
            padding-left: 0 !important;
            padding-right: 6px !important;
        }
        .ant-col:nth-child(even) {
            padding-right: 0 !important;
            padding-left: 6px !important;
        }
    `)};

    /* ${SFMedia('mo-s', css`
        && .ant-col{
            flex: 0 0 100%;
            max-width: 100%;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
   `)}; */
`;

export const TeamListCard = (props) => {
    const { img, name, company, badge, index } = props;

    return (
        <Col xxl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 12 }}>
            <MotionFadeUp delay={0.1 * index}>
                <div className="team-list-inner">
                    <span className='team-list-img' style={{ backgroundImage: `url(${img})` }}></span>
                    <Flex gap={16}>
                        <span className='team-list-name'>{name}</span>
                        <span className='team-list-company'>{company}</span>
                    </Flex>
                    {/* <span className='team-list-badge'>{badge}</span> */}
                    <SUBadge>{badge}</SUBadge>
                </div>
            </MotionFadeUp>
        </Col>
    )
}

export const TeamList = styled(Row)`
    &&{
        width: 100%;
    }
    .team-list-inner{
        font-size: 16px;
        padding: ${SFEm(12, 16)};
        border-radius:  ${SFEm(24, 16)};;
        background-color: #FAFAFA;
    }
    .team-list-img{
        display: block;
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 1em;
        background-color: #ccc;
        margin-bottom:  ${SFEm(16, 16)};;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }

    .team-list-name{
        font-size:  ${SFEm(18, 16)};;
        font-weight: 600;
        line-height: ${28 / 18};
    }
    .team-list-company{
        font-size:  ${SFEm(14, 16)};;
        font-weight: 400;
        line-height: ${20 / 14};
        color: #535862;
    }
    .team-list-badge{
      
    }
    ${SFMedia('mo-m', css`
        .team-list-inner{
            font-size:${16 / mediaWidth['mo-m'] * 100}vw;
        }
    `)}
`;


// section9
export const Section9 = styled.section`
    font-size: 16px;
    .contact-form .ant-form-item,
    .ant-row,.ant-col,
    .ant-form-item .ant-form-item-label >.contact-info-label,
    .ant-form {font-size:  ${SFEm(16, 16)};;}

    .contact-form-wrap{
        width: 100%;
        background-color: #E96827;
        padding: ${SFEm(40, 16)};
        border-radius:  ${SFEm(24, 16)};
        overflow: hidden;
        color: #fff;
        margin-left: 0 !important;
        font-size: 1em;
    }
    
  
    .ant-form{
        width: 100%;
        padding:  ${SFEm(40, 16)}  ${SFEm(32, 16)};
        background-color: #fafafa;
        border-radius: 1em;
    }
    .contact-info{
        position: relative;
        padding-left: 0 !important;
    }
    .contact-info-inner{
        position: relative;
        padding-left:  ${SFEm(40, 16)};
    }
    .contact-info-icon {
        position: absolute;
        top:0;left :0;
        font-size:  ${SFEm(24, 16)};
    }
    .contact-info-label{
        font-size:  ${SFEm(20, 16)};
        line-height: ${30 / 20};
        font-weight: 600;
    }
    .contact-info-title{
        font-size: 1em;
        font-weight: 400;
        color: var(--color-point-50);
        line-height: ${24 / 16};
        margin-top:  ${SFEm(8, 16)};
        margin-bottom:  ${SFEm(20, 16)};
    }
    .contact-info-text{
        font-size: 1em;
        line-height: ${24 / 16};
        color:#69320D;
    }
    .contact-form{padding-right : 0 !important}
   
    .sns-wrap{
        font-size:  ${SFEm(24, 16)};
        color: #BB3A0B;
        position: absolute;
        left: 0;
        bottom:0;
    }
    textarea{
        resize:  none;
        height:  ${SFEm(128, 16)};
        
    }
    .ant-checkbox .ant-checkbox-inner{width:  ${SFEm(20, 14)}; height:  ${SFEm(20, 14)}}
    .ant-checkbox-wrapper.ant-checkbox-wrapper-in-form-item input[type="checkbox"]{width:  ${SFEm(19, 14)}; height:  ${SFEm(19, 14)};}
    .ant-checkbox-checked .ant-checkbox-inner{
        background-color: #E96827;
        border-color: #E96827;
    }
    .ant-btn-lg{
        font-size: ${SFEm(16, 14)};
        padding:  ${SFEm(10, 16)} ${SFEm(16, 16)};
        line-height: ${24 / 16};
        height: ${SFEm(44, 14)};;
        width: 100%;
        font-weight: 400;
        svg{
            color: #A4A7AE;
        }
        &[type=submit]{
            font-weight: 600;
            background-color: #E96827;
        }
    }
    ${SFMedia('pc-s', css`
        .contact-form-wrap{
            font-size: 12px;
        }
    `)};
    ${SFMedia('tab-l', css`
        .sns-wrap{
            position: unset;
            font-size: ${SFEm(24, 12)};
            margin-top: ${SFEm(64, 24)};
        }
        .contact-form{
            padding-left: 0 !important;
            margin-top: ${SFEm(64, 12)};
        }
    `)};
    @media screen and (min-width: 992px) and (max-width: 1024px){
        .contact-form{
            margin-top:0;
        }
    }
    ${SFMedia('mo-l', css`
        .contact-form-wrap{
            font-size: 16px;
            margin: 0 -16px !important;
            width: calc(100% + 32px);
            border-radius: 0;
            padding: ${SFEm(40, 16)} 1em;
            text-align: left;
        }
        .ant-form{
            text-align:left;
            padding: ${SFEm(32, 16)}   ${SFEm(16, 16)} ;
        }
        .form-last-checked{
            .ant-checkbox-wrapper{
                align-items: self-start;
            }
            .ant-checkbox{
                align-self: unset;
            }
        }

    `)};
    
    ${SFMedia('mo-m', css`
        .contact-form-wrap{
            font-size:${16 / mediaWidth['mo-m'] * 100}vw;
            
        }
        .contact-info{
            padding-right: 0 !important;
        }
        .contact-info .ant-row{
            row-gap: ${SFEm(32, 16)} !important;
        }
        .sns-wrap{
            font-size: ${SFEm(24, 16)};
        }
       
    `)};
`;

export const ContactInfo = (props) => {
    const { icon, label, title, text } = props;
    return (
        <Col span={24} sm={{ span: 12 }}>
            <div className="contact-info-inner">
                <span className='contact-info-icon'>
                    {icon}
                </span>
                <span className="contact-info-label">{label}</span>
                <p className="contact-info-title">{title}</p>
                <p className="contact-info-text">{text}</p>
            </div>
        </Col>
    )
};


export const SectionLine = styled(Divider)`
    color: #E9EAEB;
    max-width: 1280px;
    min-width: 0;
    width: 100%;
    padding: 0 32px;
    margin: 0 auto 96px;
`;



