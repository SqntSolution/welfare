/**
 * @file SubMainRouter .js
 * @description 서브메인 라우터
 * @author 이병은
 * @since 2025-05-20 16:54
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-20 16:54    이병은       최초 생성
 * 2025-05-21 16:59    이병은       cs-center 라우터 추가
 * 2025-07-14 17:54    이병은       동적 정적 페이지 맵핑 최적화
 **/

import { useGetMenus } from 'hooks/helperHook';
import { ErrorPage } from 'pages/common/errorPages';
import BrandGallery from 'pages/user/storeInfo/BrandGallery';
import DealerDetailPage from 'pages/user/storeInfo/DealerDetailPage';
import DealerList from 'pages/user/storeInfo/DealerList';
import ElorienHouse from 'pages/user/storeInfo/ElorienHouse';
import Activity from 'pages/user/company/Activity';
import Ci from 'pages/user/company/Ci';
import Directions from 'pages/user/company/Directions';
import GlobalNetworks from 'pages/user/company/GlobalNetworks';
import History from 'pages/user/company/History';
import OverviewPage from 'pages/user/company/OverviewPage';
import Guide from 'pages/user/ethical/Guide';
import ReportingCenter from 'pages/user/ethical/ReportingCenter';
import Information from 'pages/user/investment/Information';
import Investment from 'pages/user/investment/Investment';
import Catalog from 'pages/user/product/Catalog';
import Sale from 'pages/user/product/Sale';
import { SearchResultPosts } from 'pages/user/submain/comp/SearchResultPosts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMenuContext } from 'provider/MenuProvider';

const SubMainRouter = () => {
    const { menu1, menu2, detail } = useParams();
    const menus = useGetMenus();
    const [staticYn, setStaticYn] = useState(false);
    const [currMenu, setCurrMenu] = useState(null);
    const { isLoading, isLoaded } = useMenuContext();
    const [loading, setLoading] = useState(true);

    // 정적 페이지 렌더링 목록 { menuEngNm : 컴포넌트 }
    const staticComponentMap = {
        // 회사소개
        'overview': <OverviewPage />,
        'ci': <Ci />,
        'globalnetworks': <GlobalNetworks />,
        'activity': <Activity />,
        'directions': <Directions />,
        'history': <History />,
        // 투자정보
        'information': <Information />,
        'investment': <Investment />,
        // 매장안내
        'elorien-house': <ElorienHouse />,
        'brand-gallery': <BrandGallery />,
        'dealer': <DealerList />,
        // 제품소개
        'catalog': <Catalog />,
        'sale': <Sale />,

        // 윤리경영
        'guide': <Guide />,
        'reporting-center': <ReportingCenter />,
    };

    // 정적페이지 상세 렌더링 목록 { menuEngNm : 컴포넌트 }
    const dynamicComponentMap = {
        'dealer-detail': <DealerDetailPage />,
    };

    useEffect(() => {
        if (isLoading || !isLoaded) return;
        const parent = menus.find(m => m.menuEngNm === menu1);
        const child = parent?.menuChildren?.find(c => c.menuEngNm === menu2);

        setStaticYn(child?.staticYn);
        setCurrMenu(child);
        setLoading(false);
    }, [isLoading, isLoaded, menu1, menu2]);

    if (isLoading || loading) {
        return null;
    }

    if (detail) {
        return dynamicComponentMap[detail] || <ErrorPage />
    }

    if (staticYn && currMenu && Object.keys(staticComponentMap).includes(currMenu.menuEngNm)) {
        return staticComponentMap[currMenu.menuEngNm]
    }

    return (
        <>
            <SearchResultPosts />
        </>
    );
};

export default SubMainRouter;