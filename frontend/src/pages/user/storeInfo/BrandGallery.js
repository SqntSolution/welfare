/**
 * @file BrandGallery.js
 * @description 매장 안내 > 브랜드 전시장 서브 페이지
 * @author 김단아
 * @since 2025-06-05 14:34
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-05 14:34    김단아       최초 생성
 **/

import { Divider } from 'antd'
import CardItem from 'components/user/CardItem'
import React from 'react'
import styled from 'styled-components'
import { SFEm } from 'styles/StyledFuntion'
import { SUInner1280, SUPaginationWithArrows, SUPointText, SUText30 } from 'styles/StyledUser'

const BrandGallery = () => {
    const galleryArr = [
        {
            key: '1',
            storeName: '부산 수영점',
            productType: '창문',
            address: '부산 남구 수영로 30-1 (문현동) 2층',
            phone: '051-637-2071',
            hours: '09:00 ~ 18:00 (주말 및 공휴일은 예약제)',
            image: '/img/sample/store/brand-gallery-img1.png'
        },
        {
            key: '2',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img2.png'
        },
        {
            key: '3',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img3.png'
        },
        {
            key: '1',
            storeName: '부산 수영점',
            productType: '창문',
            address: '부산 남구 수영로 30-1 (문현동) 2층',
            phone: '051-637-2071',
            hours: '09:00 ~ 18:00 (주말 및 공휴일은 예약제)',
            image: '/img/sample/store/brand-gallery-img1.png'
        },
        {
            key: '2',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img2.png'
        },
        {
            key: '3',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img3.png'
        },
        {
            key: '1',
            storeName: '부산 수영점',
            productType: '창문',
            address: '부산 남구 수영로 30-1 (문현동) 2층',
            phone: '051-637-2071',
            hours: '09:00 ~ 18:00 (주말 및 공휴일은 예약제)',
            image: '/img/sample/store/brand-gallery-img1.png'
        },
        {
            key: '2',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img2.png'
        },
        {
            key: '3',
            storeName: ' 제주 연산점',
            productType: '창작시스템',
            address: ' 제주특별자치도 제주시 연삼로 793 (화북이동)',
            phone: ' 064-900-2572',
            hours: '09 00 ~ 18 : 00 (공휴일 및 토요일 정상운영, 일요일 휴무)',
            image: '/img/sample/store/brand-gallery-img3.png'
        },

    ]
    return (
        <BrandGalleryStyle>
            <SUInner1280>
                <div className='gallery-top'>
                    <div className='img'><img src='/img/sample/store/brand-gallery-img.png' alt='' /></div>
                    <SUPointText className='label'>대구 남구점</SUPointText>
                    <SUText30 className='title'>시스템하우스</SUText30>
                    <p className='txt'>부산 남구 수영로 30-1 (문현동)2층</p>
                    <p className='txt'>051-637-2071</p>
                    <p className='txt'>09 : 00 ~ 18 : 00 (주말 및 공휴일은 예약제)</p>
                </div>
                <section className='gallery-sec'>
                    <ul className='gallery-list'>
                        {galleryArr.map((gallery, num) =>
                        (
                            <li key={num}>
                                <CardItem
                                    img={gallery.image}
                                    label={gallery.storeName}
                                    title={gallery.productType}
                                    text={
                                        <>
                                            <p>{gallery.address}</p>
                                            <p>{gallery.phone}</p>
                                            <p>{gallery.hours}</p>
                                        </>
                                    }
                                />
                            </li>
                        )
                        )}
                    </ul>
                    <Divider />
                    <SUPaginationWithArrows />
                </section>
            </SUInner1280>

        </BrandGalleryStyle>
    )
}
export default BrandGallery;

const BrandGalleryStyle = styled.div`
    font-size: 16px;
    padding-top: var(--gap);
    .gallery-top{
        margin-bottom: ${SFEm(64, 16)};
        .img{
            margin-bottom: 1em;
        }
        .label{
            font-weight: 400;
            margin-bottom: ${SFEm(8, 14)};
            display: block;
        }
        .title{
            margin-bottom: ${SFEm(16, 30)};
        }
        .txt{
            color: #717680;
            font-size: ${SFEm(14, 16)};
            line-height: ${20 / 14};
        }
    }
    .gallery-list{
        &{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: ${SFEm(36, 16)};
        }
        .cardItem-txt{
            color: #717680;
        }
    }
`;