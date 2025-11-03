import { Route } from "react-router-dom";
import AdminLayout from "layouts/admin/AdminLayout";
import AdminDashBoard from 'pages/admin/dashboard/AdminDashBoard';
import AdminContentConfig from 'pages/admin/content/AdminContentConfig';
import AdminContentKeyWord from 'pages/admin/content/AdminContentKeyWord';
import AdminCategoryConfig from 'pages/admin/category/AdminCategoryConfig';
import AdminEditCategory from 'pages/admin/category/AdminEditCategory';
import AdminNotice from 'pages/admin/cs/AdminNotice';
import NoticeRegistration from 'pages/admin/cs/NoticeRegistration';
import AdminFaq from 'pages/admin/cs/AdminFaq';
import FaqRegistration from 'pages/admin/cs/FaqRegistration';
import AdminQna from 'pages/admin/cs/AdminQna';
import QnaRegistration from 'pages/admin/cs/QnaRegistration';
import AdminRelease from 'pages/admin/cs/AdminRelease';
import ReleaseRegistration from "pages/admin/cs/ReleaseRegistration";
import AdminBannerList from 'pages/admin/banner/AdminBannerList';
import BannerRegistration from 'pages/admin/banner/BannerRegistration';
import AdminPopupList from 'pages/admin/popup/AdminPopupList';
import PopupRegistration from 'pages/admin/popup/PopupRegistration';
import AdminStatistics from 'pages/admin/statistics/AdminStatistics';
import AdminAlarmList from 'pages/admin/alarm/AdminAlarmList';
import AdminAlarmRegistration from 'pages/admin/alarm/AdminAlarmRegistration';
import AdminGroupList from 'pages/admin/group/AdminGroupList';
import AdminGroupRegistration from 'pages/admin/group/AdminGroupRegistration';
import AdminGroupMatch from 'pages/admin/group/AdminGroupMatch';
import AdminGroupmatch2 from 'pages/admin/group/AdminGroupMatch2';

import AdminMemberPage from 'pages/admin/member/AdminMemberPage';
import AdminOperatorList from 'pages/admin/role/AdminOperatorList';
import AdminContentsManagerList from 'pages/admin/role/AdminContentsManagerList';
import AdminContentsManagerRegistration from 'pages/admin/role/AdminContentsManagerRegistration';
import { UserSwitchingPage } from 'pages/admin/UserSwitchingPage';
import { AdminGuard } from "provider/AdminGuard";
import AdminCodes from "pages/admin/code/AdminCodes";
import AdminCommonCodeRegistration from "pages/admin/code/comps/common/AdminCommonCodeRegistration";
import AdminRefCodeRegistration from "pages/admin/code/comps/ref/AdminRefCodeRegistration";

export const AdminRoutes = (
    <>
        <Route
            path="/admin"
            element={
                <AdminGuard>
                    <AdminLayout />
                </AdminGuard>
            }
        >
            <Route index element={<AdminDashBoard />} />
            <Route path='dashboard' element={<AdminDashBoard />} />

            {/* 컨텐츠 */}
            <Route path='content' element={<AdminContentConfig />} />
            {/* 컨텐츠 - 추천 키워드 */}
            <Route path='content/keyword' element={<AdminContentKeyWord />} />
            {/* 컨텐츠 - 카테고리 */}
            <Route path='category' element={<AdminCategoryConfig />} />
            <Route path='category/new' element={<AdminEditCategory />} />
            <Route path='category/edit/:id' element={<AdminEditCategory />} />

            {/* 고객센터 - NOTICE */}
            <Route path='notice' element={<AdminNotice />} />
            <Route path='notice/new' element={<NoticeRegistration />} />
            <Route path='notice/:id' element={<NoticeRegistration />} />
            <Route path='notice/edit/:id' element={<NoticeRegistration />} />

            {/* 고객센터 - FAQ */}
            <Route path='faq' element={<AdminFaq />} />
            <Route path='faq/new' element={<FaqRegistration />} />
            <Route path='faq/:id' element={<FaqRegistration />} />
            <Route path='faq/edit/:id' element={<FaqRegistration />} />

            {/* 고객센터 - QNA */}
            <Route path='qna' element={<AdminQna />} />
            <Route path='qna/new' element={<QnaRegistration />} />
            <Route path='qna/:id' element={<QnaRegistration />} />
            <Route path='qna/edit/:id' element={<QnaRegistration />} />

            {/* 고객센터 - 보도자료 */}
            <Route path='release' element={<AdminRelease />} />
            <Route path='release/new' element={<ReleaseRegistration />} />
            <Route path='release/:id' element={<ReleaseRegistration />} />
            <Route path='release/edit/:id' element={<ReleaseRegistration />} />

            {/* 배너 */}
            <Route path='banner' element={<AdminBannerList />} />
            <Route path='banner/new' element={<BannerRegistration />} />
            <Route path='banner/:id' element={<BannerRegistration />} />
            <Route path='banner/edit/:id' element={<BannerRegistration />} />

            {/* 팝업 */}
            <Route path='popup' element={<AdminPopupList />} />
            <Route path='popup/new' element={<PopupRegistration />} />
            <Route path='popup/:id' element={<PopupRegistration />} />
            <Route path='popup/edit/:id' element={<PopupRegistration />} />

            {/* 통계 */}
            <Route path='statistics/visitors' element={<AdminStatistics type={'login'} />} />
            <Route path='statistics/pv' element={<AdminStatistics type={'post_view'} />} />
            <Route path='statistics/downloads' element={<AdminStatistics type={'file_download'} />} />
            {/* <Route path='statistics/subscribers' element={<AdminStatistics type={'subscribe'} />} /> */}

            {/* 알림 */}
            {/* <Route path='alarm' element={<AdminAlarmList />} />
            <Route path='alarm/new' element={<AdminAlarmRegistration />} />
            <Route path='alarm/:id' element={<AdminAlarmRegistration />} />
            <Route path='alarm/edit/:id' element={<AdminAlarmRegistration />} /> */}

            {/* 그룹 */}
            <Route path='group' element={<AdminGroupList />} />
            <Route path='group/new' element={<AdminGroupRegistration />} />
            <Route path='group/edit/:id' element={<AdminGroupRegistration />} />
            <Route path='group/match' element={<AdminGroupMatch />} />
            <Route path='group/match/:path' element={<AdminGroupmatch2 />} />

            {/* 코드 */}
            <Route path='code/:path' element={<AdminCodes />} />
            {/* 공통코드 */}
            <Route path='code/common/new' element={<AdminCommonCodeRegistration />} />
            <Route path='code/common/:id' element={<AdminCommonCodeRegistration />} />
            <Route path='code/common/edit/:id' element={<AdminCommonCodeRegistration />} />
            {/* 참조코드 */}
            <Route path='code/ref/new' element={<AdminRefCodeRegistration />} />
            <Route path='code/ref/:id' element={<AdminRefCodeRegistration />} />
            <Route path='code/ref/edit/:id' element={<AdminRefCodeRegistration />} />

            <Route path='member' element={<AdminMemberPage />} />
            <Route path='member/:userId/:path' element={<AdminMemberPage />} />

            <Route path='role/operator' element={<AdminOperatorList />} />
            <Route path='role/manager' element={<AdminContentsManagerList />} />
            <Route path='role/manager/new' element={<AdminContentsManagerRegistration />} />
            <Route path='role/manager/edit/:id' element={<AdminContentsManagerRegistration />} />

            <Route path='user-switch' element={<UserSwitchingPage />} />
        </Route>
    </>
)
