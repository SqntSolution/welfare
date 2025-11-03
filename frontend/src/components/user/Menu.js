import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { useGetMenus } from 'hooks/helperHook';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";



const Menu = React.memo(({ scrollDirection, isMobile }) => {
    const [navAct, setNavAct] = useState(false);
    const [mobileSubMenu, setMobileSubMenu] = useState(false);
    const menus = useGetMenus();
    const contentRefs = useRef([]);
    const [contentHeights, setContentHeights] = useState([]);
    const location = useLocation();
    const pcSubMenuHeight = useRef();

    // 메뉴 데이터 메모이제이션
    const processedMenu = useMemo(() => {
        return menus?.map((e, index) => {
            if (!e.staticYn) {
                return { ...e, menuChildren: [{ isMobileOnly: true, id: -9999 + index, menuNm: '전체' }, ...e.menuChildren] }
            } else {
                return e
            }
        }) || [];
    }, [menus]);

    // 메뉴 경로 계산 메모이제이션
    const getMenu1Path = useCallback((menu) => {
        return `/${menu?.menuEngNm}`;
    }, []);

    const toggleMenuAllOpen = useCallback(() => {
        setNavAct((toggle) => !toggle);
        setMobileSubMenu(false);
    }, []);

    const toggleSubMenuOpen = useCallback((index) => {
        setMobileSubMenu(prev => (prev === index ? false : index));
        // 높이 계산을 별도로 처리
        setTimeout(() => {
            const heights = contentRefs.current.map(ref => ref?.scrollHeight || 0);
            pcSubMenuHeight.current = Math.max(...heights.filter(Number.isFinite));
            setContentHeights(heights);
        }, 0);
    }, []);

    useEffect(() => {
        setNavAct(false);
    }, [scrollDirection, location])

    // 메뉴 데이터 변경 시에만 높이 재계산
    useEffect(() => {
        if (!isMobile) {
            setMobileSubMenu(false);
            setTimeout(() => {
                const heights = contentRefs.current.map(ref => ref?.scrollHeight || 0);
                pcSubMenuHeight.current = Math.max(...heights.filter(Number.isFinite));
                setContentHeights(heights);
            }, 0);
        }
    }, [processedMenu, isMobile]);

    return (
        <>
            <StyleMobileBtn className={navAct ? 'pc-none menu-btn act' : 'pc-none menu-btn'} onClick={toggleMenuAllOpen} >
                {navAct ? <IoClose /> : <MenuOutlined />}
            </StyleMobileBtn>

            <StyleMenu className={navAct ? 'act menu' : 'menu'} $maxHeight={pcSubMenuHeight.current}>
                <motion.div
                    initial={isMobile ? { height: 0, opacity: 0 } : false}
                    animate={
                        isMobile
                            ? navAct
                                ? { height: 'auto', opacity: 1 }
                                : { height: 0, opacity: 0 }
                            : false
                    }
                >
                    <nav className='menu-nav'
                        onMouseEnter={!isMobile ? () => setNavAct(true) : null}
                        onMouseLeave={!isMobile ? () => setNavAct(false) : null}
                    >
                        <ul className='menu-ul'>
                            {processedMenu.map((menu, index) => {
                                const menu1EngNm = getMenu1Path(menu);
                                // if (menu.contentType === 'my') { //my페이지 안보이게하기
                                //     return null;
                                // }
                                return (<li key={menu.id} className={mobileSubMenu === index ? 'menu-ul-li act-sub-menu-on' : 'menu-ul-li'} >
                                    {!isMobile ? (
                                        <span>
                                            <NavLink to={`${menu1EngNm}`} className={({ isActive }) => isActive ? 'currentPage' : ''}>{menu.title}</NavLink>
                                        </span>
                                    ) : menu.menuChildren ? (
                                        <button onClick={() => toggleSubMenuOpen(index)} className='menu-mo-title'
                                        // icon={<IoIosArrowDown />}
                                        >
                                            {menu.title}
                                            <span className='icon'>
                                                {mobileSubMenu === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                            </span>
                                        </button>
                                    ) : (
                                        <span className='menu-mo-title'>
                                            <NavLink to={`${menu1EngNm}`} className={({ isActive }) => isActive ? 'currentPage' : ''}>{menu.title}</NavLink>
                                        </span>
                                    )}

                                    <motion.div
                                        initial={isMobile ? { height: 0, opacity: 0 } : false}
                                        animate={
                                            isMobile
                                                ? mobileSubMenu === index
                                                    ? { height: contentHeights[index], opacity: 1 }
                                                    : { height: 0, opacity: 0 }
                                                : false
                                        }
                                        transition={{ duration: 0.3 }}
                                        className='motion-div'
                                    >
                                        <div className='menu-sub-box' ref={(el) => (contentRefs.current[index] = el)}>
                                            <ul className='menu-sub-ul'>
                                                {menu.menuChildren?.map(subMenu => {
                                                    if (!menu.staticYn && subMenu.isMobileOnly && !isMobile) return null;
                                                    return (
                                                        <li key={subMenu.id}>
                                                            <NavLink
                                                                to={`${menu1EngNm}${subMenu.menuEngNm ? `/${subMenu.menuEngNm}` : ''}`}
                                                                className={({ isActive }) => isActive ? 'currentPage' : ''}
                                                                end={subMenu.isMobileOnly}
                                                            >
                                                                {subMenu.menuNm}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </motion.div>
                                </li>)
                            }
                            )}
                        </ul>
                    </nav>
                </motion.div>
            </StyleMenu >
        </>
    );
})

export default Menu;



const StyleMenu = styled.div`
    &{
        font-size: 1px;
        text-align: center;
        z-index: 3;
        transition: all 1s;
       
        padding: 0 1em;
    }
    
    &::before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #ddd;
        position: absolute;
        top:var(--header-height) ;
        left: 0;
        opacity: 0;
        z-index: 5;
        pointer-events: none;
    }
    &::after{
        position: absolute;
        top:var(--header-height); left: 0;
        content: '';
        display: block;
        width: 100%;
        height: ${(props) => props.$maxHeight ? props.$maxHeight + 'px' : '0'};
        background-color: #fff;
        z-index: -1;
        opacity: 0;
        pointer-events: none;
        box-shadow: 0px 4px 6px -2px rgba(10, 13, 18, 0.03);
    }

    nav{
        width: fit-content;
        margin: 0 auto;
        transform-origin: 50% 50% 0px;
    }
    .menu-ul{
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 600;
        line-height: ${20 / 16};
       
    }
    .menu-ul-li{
        min-width: ${SFEm(90)};
        transition: all 0.4s ease-in-out;
        position: relative;
        & > span{
            ${SFFlexCenter};
            height: var(--header-height);
            padding: 10px 14px;
            position: relative;
        }


        &  a::after {
            content: '';
            display: block;
            width: 0;
            height: 2px;
            background-color: currentColor;
            position: absolute;
            left: 0; bottom:0;
            opacity: 0;
            transition: all 0.2s;
        }
    }

    .motion-div{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
    }

    .menu-sub-box{
        position: relative;
        transform-origin: top center;
        height: 0;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        font-weight: 500;
        font-size: ${SFEm(14)};
        color: var(--color-tertiary);
    }
    .menu-sub-ul{
        padding :  ${SFEm(24, 14)} 0;
        height: ${(props) => props.$maxHeight ? props.$maxHeight + 'px' : '0'};
    }
    .menu-sub-ul li{
        min-height:  ${SFEm(32, 14)};
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 4px;
        
    }
    .menu-sub-ul li a{position: relative; padding-bottom: ${SFEm(4, 14)};}
    .menu-sub-ul li a.currentPage::after{opacity: 0}
    .menu-sub-box li + li {
        margin-top: ${SFEm(8, 14)};
    }


/* 반응형 */    
@media screen and (min-width: 1025px), (min-width : ${1201 / 16}rem){
    
    .menu-ul-li{
        /* 마우스 호버  및 해당 페이지 스타일 */
        &  a{
            &:hover,&.currentPage{
                color: red ;
            }
            &:hover::after, &.currentPage::after {
                width: 100%;
                opacity: 1;
            }
        }
    }
    &.act {
        .menu-sub-box{
            height: unset;
            pointer-events: unset;
            opacity: 1;
            top:0;
        }
        .menu-ul-li{
            padding: 0 8px;
        }
        &::before{
            opacity: 1;
        }
        &::after{
            opacity: 1;
        }
    }
}/* only px style*/



${SFMedia('pc-s', css` 
    & .menu-ul{
        font-size: 14px;
    }
 
    &.act {
        .menu-ul-li{
            padding: 0 4px;
        }
    }
`)}

${SFMedia('tab-l', css` 
    &{
        width: 100%;
        padding-right: calc(32px * 4);
        margin-right: auto;
        border-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 20px;
        padding-bottom: 20px;
        height: calc(100svh - (57px + 88px));
        overflow: hidden ;
    }
    &.act{
        overflow-y: auto;
        .menu-ul-li {
            padding: 0;
        }
    }
    &::before,  &::after{display: none}
    nav{
        position: relative;
        z-index: 5;
        pointer-events: none;
        display: none;
        width: 100%;

    }
    .menu-ul{
        display: block;
        text-align: left;
        
    }
    .menu-ul-li{
        padding: 0;
        border-bottom: 1px solid var(--color-boder-secondary);
    }
    .menu-ul-li a.currentPage::after{display:none}
    
    .menu-ul-li>span{
        width: 100%;
        padding: 0;
        height: fit-content;
        a{
            display: block;
            width: 100%;
        }
    }
    .motion-div{
        position: unset;
        left: unset;
        transform: unset;
    }
    .menu-ul-li  .menu-mo-title{
        height: 48px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 16px;
    }
    .motion-div{
        overflow: hidden;
        max-height: min-content;
    }
    .menu-sub-box{
        font-size: 12px;
        background-color: #F5F5F5;
        padding: 0 16px;
        border-top: 1px solid var(--color-boder-secondary);
        max-height: min-content;
    }
    .menu-sub-ul{
        padding: 0;
        max-height: min-content;
    }
    .menu-sub-ul li{
        width: 100%;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: start;
        a{
            padding-bottom: 0;
        }
    }

    /* 이벤트 스타일 */
    &.act {
        nav{
            height: 100%;
            opacity: 1;
            pointer-events: unset;
            display: block;
        }
    }

    .menu-ul-li.act-sub-menu-on{
        .menu-sub-box{
            pointer-events: auto;
            opacity: 1;
            top:0;
            height: auto;
        }
    }

    .menu-ul-li{
        &  a{
            &.currentPage{
                color: red ;
            }
            &.currentPage::after {
                width: 100%;
                opacity: 1;
        }
        }
    }
`)}
`;


const StyleMobileBtn = styled.button`

/* 반응형 */    
${SFMedia('tab-l', css` 
    &{
        position: absolute;
        top: 18px;
        right: 16px;
        display: flex;
        align-items: center;
        font-size: 24px;
        z-index: 10;
        width: 40px;
        height: 40px;
        background-color: transparent !important;
    }

    &.act{
        font-size:28px;
    }
`)}
`;
