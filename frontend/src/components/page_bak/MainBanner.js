// 메인페이지에서 윗쪽에 있는 배너 이미지

import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Carousel } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { Link, Route, Switch, useNavigate } from "react-router-dom";
import { useMsg } from 'hooks/helperHook';
import styled from 'styled-components';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
// import "react-image-gallery/styles/css/image-gallery.css";

export const MainBanner = (props) => {
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState([])
    const { error, info } = useMsg()
    const navigate = useNavigate();

    useEffect(() => {
        getBanners()
    }, [])

    const getBanners = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/user/main/banners`)
            .then((resp) => {
                setBanners(resp?.data ?? [])
            })
            .catch((err) => {
                console.log('=== getBanners 에러 : ', err?.response);
                // message.error(errorMsg(err), 3);
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // const contentStyle = {
    //     height: '160px',
    //     color: '#fff',
    //     textAlign: 'center',
    //     background: '#779ce2',
    // };

    const openUrl = (isFullUrl, isNewWindow, url) => {
        if ((url ?? '') == '') {
            // console.log("=== 통과 : ", isFullUrl, isNewWindow, url)
            return
        }
        if (isNewWindow) {
            // 새창은 무조건 window.open()
            window.open(url)
        } else {
            if (isFullUrl) {
                window.location.href = url
            } else {
                navigate(url)
            }
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <Row justify='center' style={{
                width: "100%",
                // height: 100,
                margin: '0 auto',
                // border: '1px solid #84a9ff',
            }}>
                <Col style={{
                    width: '100%',
                    borderRadius: 0,
                    // border: '1px solid #2a92f',
                }} justify='center' align="middle">
                    <Carousel autoplay effect="fade" speed={1000} style={{ width: '100%', marginBottom: '16px', }}>
                        {
                            banners.map(elem => {
                                const isFullUrl = (elem?.link?.startsWith("https://") || elem?.link?.startsWith("http://"))
                                const hasLink = elem.link != null && elem.link != ''

                                return (
                                    // <div key={elem.id} style={{backgroundImage:`${elem.imagePath}`, backgroundColor:`${elem.backgroundColor}`}}>
                                    <div key={elem.id}>
                                        <MainBannerWrap style={{height: '320px'}} className={hasLink ? 'mainBanner-wrap act' : "mainBanner-wrap"}>
                                                <div className='imgBox' style={{ backgroundImage: `url(/api/v1/image/${elem.imagePath})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundColor: `${elem.backgroundColor}` }}></div>
                                                <div className='mainBanner_inner'
                                                    style={{
                                                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', alignContent: 'center',
                                                        width: '100%',
                                                        height: '75%',
                                                        position:'relative',top:'10%',
                                                        zIndex:3,
                                                        cursor: `${hasLink ? 'pointer' : ''}`,
                                                    }}
                                                    onClick={() =>
                                                        (hasLink) ?
                                                            openUrl(isFullUrl, elem.linkType == 'new', `${elem.link}`)
                                                            :
                                                            null
                                                    }
                                                >

                                                        <div style={{
                                                            width: '100%',
                                                            fontSize: '38px',
                                                            fontWeight: '700',
                                                            color: '#fff',
                                                            lineHeight: '46px',
                                                            marginBottom: 16,
                                                            transition:'all  0.3s'
                                                        }} >{elem.title}</div>
                                                        <div
                                                            style={{
                                                                width: '100%',
                                                                color: '#fff',
                                                                fontSize: '16px',
                                                                fontWeight: '400',
                                                                lineHeight: '24px',
                                                                marginBottom: '24px',
                                                                transition:'all  0.3s'
                                                            }}
                                                        >{elem.subTitle}</div>

                                                        { (hasLink) ? <span className='mainBanner-more'>More</span> : null}
                                                        {/* {
                                                            (elem.link != null && elem.link != '') ? (
                                                                <>
                                                                    <Button type="primary" onClick={() => openUrl(isFullUrl, elem.linkType == 'new', `${elem.link}`)}> View </Button>
                                                                </>
                                                            ) : (
                                                                null
                                                            )
                                                        } */}
                                                </div>
                                        </MainBannerWrap>
                                    </div>
                                )
                            })
                        }

                    </Carousel>
                    {/* <ImageGallery items={images} showBullets={true} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} autoPlay={false} 
                        slideInterval={5000}/> */}
                </Col>
            </Row>

        </div>
    )
}

const MainBannerWrap = styled.div`
    &::after{
        content: '';
        display:block;
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        left:0;
        background: rgba(0,0,0,0.3);
        opacity: 0;
        z-index:2;
        transition:opacity  0.8s;
    }


    .imgBox{
        width:100%;height:100%;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        z-index:1;
        transition: all 0.5s ;
    }
    .mainBanner_inner, .mainBanner_inner > div{transition:all  0.5s;}
    .mainBanner-more{
        display:block;
        max-height:0;
        font-size:16px;
        color: #fff;
        padding: 0 4px 2px;
        // margin-top:-8px;
        border-bottom: 1px solid #fff;
        transition: all 0.5s ;
        opacity: 0;
        overflow:hidden;
        font-weight:bold;
    }

    &.act:has(.mainBanner_inner:hover) .imgBox{ transform: translate(-50%,-50%) scale(1.1);}
    &.act:has(.mainBanner_inner:hover)::after{
        opacity: 1;
    } 
    &.act:has(.mainBanner_inner:hover) .mainBanner-more{
        max-height:100%;
        opacity: 1;
    }
`;