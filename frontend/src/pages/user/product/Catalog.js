/**
 * @file Catalog.js
 * @description 제품 소개에 카타로그 서브 페이지
 * @author 김단아
 * @since 2025-06-04 13:24
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04 13:24    김단아       최초 생성
 **/

import { Divider, Flex } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { SFEm, SFFlexCenter } from 'styles/StyledFuntion'
import { SUInner1280, SUPaginationWithArrows, SUTabsBtnStyle } from 'styles/StyledUser'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom'

const Catalog = () => {
    const catalogArr = [
        {
            key: 'door-list',
            name: 'door',
            children: [
                {
                    key: 'door-1',
                    title: '(인천)경원재 앰버서더 한옥 호텔',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img1.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
                {
                    key: 'door-2',
                    title: '(서울) 미토262 복합빌딩',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img2.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
                {
                    key: 'door-3',
                    title: '(인천)경원재 앰버서더 한옥 호텔',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img3.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
                {
                    key: 'door-4',
                    title: '(서울) 미토262 복합빌딩',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img4.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
                {
                    key: 'door-5',
                    title: '(서울) 미토262 복합빌딩',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img2.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
            ]
        },
        {
            key: 'raum-list',
            name: 'raum',
            children: [
                {
                    key: 'raum-1',
                    title: '(인천)경원재 앰버서더 한옥 호텔',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img3.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
                {
                    key: 'raum-2',
                    title: '(서울) 미토262 복합빌딩',
                    date: '2025.04.09',
                    catalog: 'door',
                    img: 'catalog-img4.png',
                    link: 'http://www.eagonstore.com/report/ecatalog/eagonWindows_STEEL_BRASS_ALU/index.html#page=1',
                },
            ]
        },
    ]

    const CatalogCard = ({ list }) => {
        return (
            <>
                <div className='card-wrap'>
                    {list.map((item, i) => (
                        <React.Fragment key={i}>
                            {
                                item.children.map((el, num) => (
                                    <Link to={el.link} target='_blnk' key={el.key}>
                                        <div className='card-inner'>
                                            <span className='img'>
                                                <img src={`/img/sample/product/${el.img}`} alt='' />
                                            </span>
                                            <div className='text-box'>
                                                <p className='title'>{el.title}</p>
                                                <p className='date'>{el.date}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                        </React.Fragment>
                    )
                    )}
                </div>
            </>
        )
    }

    const items = [
        {
            key: 'all',
            label: '전체',
            children: <CatalogCard list={catalogArr} />,
        },
        {
            key: 'door',
            label: '도어',
            children: <CatalogCard list={catalogArr.filter(cat => cat.name === 'door')} />,
        },
        {
            key: 'raum',
            label: '라움',
            children: <CatalogCard list={catalogArr.filter(cat => cat.name === 'raum')} />,
        },
        {
            key: 'window',
            label: '창호',
            children: '',
        },
        {
            key: 'maru',
            label: '마루',
            children: '',
        },
        {
            key: 'others',
            label: '기타',
            children: '',
        },
        {
            key: 'e-catalog',
            label: 'E-카타로그',
            children: '',
        },
    ];
    return (
        <CatalogSection>
            <SUInner1280>
                <SUTabsBtnStyle
                    items={items}
                />
                <Divider />
                <SUPaginationWithArrows
                    total={85}
                    pageSize={10}
                    showSizeChanger={false}
                    align={'center'}
                    itemRender={(page, type, originalElement) => {
                        if (type === 'prev') {
                            return <Flex align='center' className='btn-arrow prev'><FaArrowLeft /> 이전</Flex>;
                        }
                        if (type === 'next') {
                            return <Flex align='center' className='btn-arrow next'>다음 <FaArrowRight /></Flex>;
                        }
                        return originalElement;
                    }}
                />
            </SUInner1280>
        </CatalogSection>
    )
}
export default Catalog;


const CatalogSection = styled.section`
    font-size: 16px;
    padding-bottom: var(--gap);
    .ant-tabs-nav{
        padding: ${SFEm(48, 16)} 0 ;
    }
    a:hover{
        color: var(--color-primary);
    }
    .card-wrap{
        display: grid;
        gap: ${SFEm(48, 16)} ${SFEm(32, 16)};
        grid-template-columns: repeat(4, 1fr);
    }
    .card-inner{
        .img{
            height:  ${SFEm(276 + 16, 16)};
            ${SFFlexCenter};
            padding: 0 ${SFEm(35, 16)} ${SFEm(16, 16)};
        }
        .text-box{
            .title {
                font-weight: 600;
                font-size:  ${SFEm(18, 16)};
                line-height: ${28 / 18};
            }
            .date {
                font-weight: 400;
                font-size: ${SFEm(14, 16)};
                line-height: ${20 / 14};
                margin-top: ${SFEm(16, 14)};
            }
        }
    }
`;