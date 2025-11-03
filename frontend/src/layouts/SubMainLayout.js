/**
 * @file SubmainLayout.js
 * @description 서브메인 레이아웃
 * @author 이병은
 * @since 2025-05-15 15:09
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-15 15:09    이병은       최초 생성
 * 2025-06-30 11:32    이병은       서브배너 컴포넌트 변경
 **/

import { Navigate, Outlet, useParams } from 'react-router-dom';
import { } from 'utils/menuHolder';
import SubInteractiveLayout from './SubInteractiveLayout';
import { useGetMenus } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { SUInner1280, SUInner1440 } from 'styles/StyledUser';
import { SubpageBanner } from 'components/user/SubpageBanner';

const SubMainLayout = () => {
    const menus = useGetMenus();
    const { menu1, menu2, detail } = useParams();
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        const parent = menus.find(m => m.menuEngNm === menu1);
        const firstChild = parent?.menuChildren?.[0]?.menuEngNm;
        const staticYn = menus?.find(m => m.menuEngNm === menu1)?.staticYn;
        const staticYn2 = parent?.menuChildren?.[0]?.staticYn;


        // 현재 경로가 menu1만 포함하고 있다면, 첫 자식으로 이동
        // if ((staticYn || staticYn2) && !menu2 && firstChild) {
        //     setRedirectPath(`/${menu1}/${firstChild}`);
        // }
        if (staticYn && !menu2 && firstChild) {
            setRedirectPath(`/${menu1}/${firstChild}`);
        }
    }, [menu1, menu2, menus]);

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }



    const contents = () => {
        const staticYn = menus?.find(m => m.menuEngNm === menu1)?.menuChildren?.find(cm => cm.menuEngNm === menu2)?.staticYn;

        return !staticYn ? (
            <>
                <SubpageBanner />
                <SUInner1280>
                    <Outlet />
                </SUInner1280>
            </ >
        ) : detail ? (<SUInner1440><Outlet /></SUInner1440>) : <SubInteractiveLayout />
    }

    return (
        <>
            {
                contents()
            }
        </>
    )
}
export default SubMainLayout