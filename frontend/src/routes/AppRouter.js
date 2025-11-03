import { ErrorPage } from 'pages/common/errorPages';
import { Route, Routes } from 'react-router-dom';
import { UserRoutes } from './UserRoutes';
import { AdminRoutes } from './AdminRoutes';
import { LoginCheckProvider } from 'provider/LoginCheckProvider';
import { ExpireTimeProvider } from 'provider/ExpireTimeProvider';
import { Suspense } from 'react';
import { MenuProvider } from 'provider/MenuProvider';
import PdfPopupComp from 'components/common/pdf/PdfPopupComp';
import PathTrackerProvider from 'provider/PathTrackerProvider';

export default function AppRouter() {
    return (
        <PathTrackerProvider >
            <LoginCheckProvider>
                <ExpireTimeProvider isActive={false}>
                    <MenuProvider>
                        <Suspense>
                            <Routes>
                                {/* 공통 라우트 */}
                                <Route path='/pdfviewer/:uuid' element={<PdfPopupComp />} />

                                {/* 관리자 레이아웃 라우트 - /admin으로 시작하는 모든 라우트 */}
                                {AdminRoutes}

                                {/* 사용자 레이아웃 라우트 - 나머지 모든 라우트 */}
                                {UserRoutes}

                                {/* 404 - 가장 마지막에 정의 */}
                                <Route path="*" element={<ErrorPage msg='페이지가 존재하지 않습니다.' />} />
                            </Routes>
                        </Suspense>
                    </MenuProvider>
                </ExpireTimeProvider>
            </LoginCheckProvider>
        </PathTrackerProvider>
    );
}
