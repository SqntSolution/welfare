/**
 * @file CsCenterLayout.js
 * @description Cs Center 레이아웃
 * @author 이병은
 * @since 2025-05-28 11:47
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 11:47    이병은       최초 생성
 **/

import { SubMenu } from 'components/user/SubMenu';

import { Outlet } from 'react-router-dom';

const CsCenterLayout = () => {
    return (
        <>
            <SubMenu />
            <Outlet />
        </>
    );
};
export default CsCenterLayout;