/**
 * @file UserRoutes.js
 * @description user 화면에 대한 라우트
 * @author 이병은
 * @since 2025-05-22 14:06
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-22 14:06    이병은       최초 생성
 **/

import { Route } from 'react-router-dom';
import TermPage from 'pages/common/term/TermPage';
import LoginFindIdPage from 'pages/common/login/LoginFindIdPage';
import LoginFindPwPage from 'pages/common/login/LoginFindPwPage';
import LoginGetIdPage from 'pages/common/login/LoginGetIdPage';
import LoginNewPwPage from 'pages/common/login/LoginNewPwPage';
import LoginDormantPage from "pages/common/login/LoginDormantPage";
import { LoginPage } from 'pages/common/login/LoginPage';
import LoginRegisterPage from 'pages/common/login/LoginRegisterPage';
import LoginVerifyPage from 'pages/common/login/LoginVerifyPage';
import { MyPage } from 'pages/user/my/MyPage';
import MyDrawPage from 'pages/user/my/MyDrawPage';
import { MyRecoverPage } from 'pages/user/my/MyRecoverPage';
import { MainPage } from 'pages/user/main/MainPage';
import { PostPage } from 'pages/user/post/comps/PostPage';
import MainLayout from 'layouts/MainLayout';
import { UserGuard } from 'provider/UserGuard';
import SubMainRouter from './SubMainRouter';
import SubMainLayout from 'layouts/SubMainLayout';
import MyPageLayout from 'layouts/MyPageLayout';
import { Notice } from 'pages/user/cs/notice/Notice';
import CsCenterLayout from 'layouts/CsCenterLayout';
import { Faq } from 'pages/user/cs/faq/Faq';
import { Qna } from 'pages/user/cs/qna/Qna';
import { Navigate } from 'react-router-dom';
import MyScrapPage from 'pages/user/my/MyScrapPage';
import { NoticeDetail } from 'pages/user/cs/notice/NoticeDetail';
import MyHistory from 'pages/user/my/MyHistoryPage';
import MyNotification from 'pages/user/my/MyNotificationPage';
import MyPost from 'pages/user/my/MyPostPage';
import ContactPage from 'pages/user/cs/contact/ContactPage';
import { QnaDetail } from 'pages/user/cs/qna/QnaDetail';
import { FaqDetail } from 'pages/user/cs/faq/FaqDetail';
import { PressRelease } from 'pages/user/cs/release/PressRelease';
import { PostEditPage } from 'pages/user/postedit/PostEditPage';
import { QnaInquiry } from 'pages/user/cs/qna/QnaInquiry';
import TermsOfService from 'pages/user/legal/TermsOfService';
import ReportingCenter from 'pages/user/ethical/ReportingCenter';
import PrivacyPolicy from 'pages/user/legal/PrivacyPolicy';
import EmailRefusal from 'pages/user/legal/EmailRefusal';
import { SalesPostPage } from 'pages/user/post/comps/SalesPostPage';
import LoginComPwPage from 'pages/common/login/LoginComPwPage';
import LoginComRePage from 'pages/common/login/LoginComRePage';
import LoginSendMailPage from 'pages/common/login/LoginSendMailPage';
import { PostView } from 'pages/user/post/PostView';
import Search from 'pages/user/search/Search';
import { PressReleaseDetail } from 'pages/user/cs/release/PressReleaseDetail';

export const UserRoutes = (
    <>
        <Route element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path='main' element={<MainPage />} />

            {/* 로그인 */}
            <Route path="login">
                <Route index element={<LoginPage />} />
                <Route path="te" element={<TermPage />} />
                <Route path="re" element={<LoginRegisterPage />} />
                <Route path="id" element={<LoginFindIdPage />} />
                <Route path="pw" element={<LoginFindPwPage />} />
                <Route path="dormant" element={<LoginDormantPage />} />
            </Route>

            {/* 회원 */}
            <Route path="verify">
                <Route path="vi" element={<LoginVerifyPage />} />
                <Route path="id" element={<LoginGetIdPage />} />
                <Route path="pw" element={<LoginNewPwPage />} />
                <Route path="pw/com" element={<LoginComPwPage />} />
                <Route path="re/com" element={<LoginComRePage />} />
                <Route path="mail" element={<LoginSendMailPage />} />
                <Route path="draw" element={<MyDrawPage />} />
                <Route path="draw/:id" element={<MyRecoverPage />} />
            </Route>

            {/* 마이페이지 */}
            <Route path="my" element={
                <UserGuard >
                    <MyPageLayout />
                </UserGuard>
            }>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<MyPage />} />
                <Route path="scrap" element={<MyScrapPage />} />
                <Route path="history" element={<MyHistory />} />
                <Route path="notification" element={<MyNotification />} />
                <Route path="mypost" element={<MyPost />} />
            </Route>

            {/* cs-center */}
            <Route path='cs-center' element={<CsCenterLayout />}>
                <Route index element={<Navigate to={'notice'} />} />
                <Route path='notice' element={<Notice />} />
                <Route path='notice/:id' element={<NoticeDetail />} />
                <Route path='faq' element={<Faq />} />
                <Route path='qna' element={<Qna />} />
                <Route path='qna/new' element={<UserGuard><QnaInquiry /></UserGuard>} />
                <Route path='qna/edit/:id' element={<UserGuard><QnaInquiry /></UserGuard>} />
                <Route path='qna/:id' element={<QnaDetail />} />
                <Route path='press-release' element={<PressRelease />} />
                <Route path='press-release/:id' element={<PressReleaseDetail />} />
                <Route path='contact' element={<ContactPage />} />
            </Route>

            {/* 포스트 */}
            <Route path='post/new' element={<PostEditPage />} />
            <Route path='post/edit/:postId' element={<PostEditPage />} />
            <Route path='post/:postId' element={<PostView />} />

            {/* 이용약관 */}
            <Route path='terms' element={<TermsOfService />} />
            {/*개인정보취급 방법 */}
            <Route path='reportingcenter' element={<PrivacyPolicy />} />
            {/* 이메일 주소 무단 수집 거부 */}
            <Route path='emailrefusal' element={<EmailRefusal />} />

            <Route path='search' element={<Search />} />

            {/* 동적 페이지 - CMS */}
            <Route path=':menu1' element={<SubMainLayout />}>
                <Route index element={<SubMainRouter />} />
                <Route path=':menu2' element={<SubMainRouter />} />
                <Route path=':menu2/:detail' element={<SubMainRouter />} />
            </Route>
        </Route>
    </>
);