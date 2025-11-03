/**
 * @file MyPageLayout.js
 * @description 마이페이지 레이아웃
 * @author 이병은
 * @since 2025-05-27 10:27
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-27 10:27    이병은       최초 생성
 **/

import { passwordVerifiedState } from 'atoms/atom';
import { SubMenu } from 'components/user/SubMenu';
import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil';

const MyPageLayout = () => {
    return (
        <>
            <SubMenu />
            <Outlet />
        </>
    )
}
export default MyPageLayout