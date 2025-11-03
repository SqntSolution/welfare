/**
 * @file SubMenu.js
 * @description 서브메뉴
 * @author 이병은
 * @since 2025-06-04 11:16
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-04 11:16    이병은       최초 생성
 **/

import { useGetMenus, useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUInner1280, SUPointText, SUText36, SUTabsBtnStyle } from 'styles/StyledUser';

export const SubMenu = (props) => {
    const [menus, setMenus] = useState([])
    const [current, setCurrent] = useState()
    const { error, info } = useMsg()
    const location = useLocation();
    const currPath = location.pathname;
    const navigate = useNavigate();
    const menuList = useGetMenus();

    useEffect(() => {
        setCurrent(menus?.find((menu) => currPath?.includes(menu.path)));
    }, [menus, currPath])

    useEffect(() => {
        const menu1EngNm = currPath.split('/').filter(Boolean)[0];
        const menu = menuList?.find(menu => menu.menuEngNm === menu1EngNm);
        const m = menu?.menuChildren?.map(e => { return { label: e.menuNm, key: e.id, path: `/${menu1EngNm}/${e.menuEngNm}`, disabled: e.hasAuth !== true, parentMenuNm: menu.title } });
        setMenus(m ?? []);
    }, [currPath, menuList]);

    return (
        <SUInner1280>
            <MyPageSubMenu>
                <SUPointText className='label'>{current?.parentMenuNm ?? ''}</SUPointText>
                <SUText36 className='title'>{current?.label ?? ''}</SUText36>
                <SUTabsBtnStyle activeKey={current?.key} items={menus} onChange={(key) => navigate(menus.find(e => e.key === key).path)} />
            </MyPageSubMenu>
        </SUInner1280>
    )
}

const MyPageSubMenu = styled.div`
&{
    padding: ${SFEm(96)} 0 ${SFEm(64)};
}
.title{
    margin-top: ${SFEm(12, 32)};
    margin-bottom: ${SFEm(20, 32)};
}
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &{
        font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
        padding: ${SFEm(45)} 0 ${SFEm(32)};
    }
    
`)};
`;