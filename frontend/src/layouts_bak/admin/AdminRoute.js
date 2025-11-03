/**
 * @format
 */

import React, { lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Empty } from 'antd';

// import PreProcessRoute from 'layouts/PreProcessRoute';

import AdminMemberPage from 'pages/admin/member/AdminMemberPage';

import NoticeRegistration from 'pages/admin/cs/NoticeRegistration';

import AdminDashBoard from 'pages/admin/dashboard/AdminDashBoard';

import AdminCategoryConfig from 'pages/admin/category/AdminCategoryConfig';
import AdminEditCategory from 'pages/admin/category/AdminEditCategory';

import AdminContentConfig from 'pages/admin/content/AdminContentConfig';
import AdminContentKeyWord from 'pages/admin/content/AdminContentKeyWord';

import FaqRegistration from 'pages/admin/cs/FaqRegistration';
import QnaRegistration from 'pages/admin/cs/QnaRegistration';

import AdminBannerList from 'pages/admin/banner/AdminBannerList';
import BannerRegistration from 'pages/admin/banner/BannerRegistration';

import AdminStatistics from 'pages/admin/statistics/AdminStatistics';

import AdminAlarmList from 'pages/admin/alarm/AdminAlarmList';
import AdminPopupList from 'pages/admin/popup/AdminPopupList';
import AdminAlarmRegistration from 'pages/admin/alarm/AdminAlarmRegistration';

import AdminGroupList from 'pages/admin/group/AdminGroupList';
import AdminGroupRegistration from 'pages/admin/group/AdminGroupRegistration';
import AdminGroupMatch from 'pages/admin/group/AdminGroupMatch';

import StrategicMarketingTeamList from 'pages/admin/group/StrategicMarketingTeamList';

import AdminCodeList from 'pages/admin/code/comps/common/AdminCommonCodeList';
import AdminCodeRegistration from 'pages/admin/code/comps/common/AdminCommonCodeRegistration';

import PopupRegistration from 'pages/admin/popup/PopupRegistration';

import AdminOperatorList from 'pages/admin/role/AdminOperatorList';
import AdminContentsManagerRegistration from 'pages/admin/role/AdminContentsManagerRegistration';
import AdminContentsManagerList from 'pages/admin/role/AdminContentsManagerList';
import AdminNotice from 'pages/admin/cs/AdminNotice';
import AdminFaq from 'pages/admin/cs/AdminFaq';
import AdminQna from 'pages/admin/cs/AdminQna';

import { UserSwitchingPage } from 'pages/admin/UserSwitchingPage'
import AdminGroupmatch2 from 'pages/admin/group/AdminGroupMatch2';
import { ErrorPage } from 'pages/common/errorPages'
import { LoginPage } from 'pages/common/login/LoginPage';

/*로그인테스트*/
// import LoginForm from 'pages/admin/test/login/LoginForm';
// import Login from 'pages/admin/test/login/Login';


export const AdminRoute = () => {
	let location = useLocation();
	// console.log('=====Tc MainRoute', location);

	return (
		<Routes>

			<Route path='/' element={<AdminDashBoard />} />
			<Route path='/dashboard' element={<AdminDashBoard />} />

			<Route path='/content' element={<AdminContentConfig />} />
			<Route path='/content/keyword' element={<AdminContentKeyWord />} />

			<Route path='/category' element={<AdminCategoryConfig />} />
			<Route path='/category/new' element={<AdminEditCategory />} />
			<Route path='/category/edit/:id' element={<AdminEditCategory />} />

			<Route path='/notice' element={<AdminNotice />} />
			<Route path='/notice/new' element={<NoticeRegistration />} />
			<Route path='/notice/:id' element={<NoticeRegistration />} />
			<Route path='/notice/edit/:id' element={<NoticeRegistration />} />

			<Route path='/faq' element={<AdminFaq />} />
			<Route path='/faq/new' element={<FaqRegistration />} />
			<Route path='/faq/:id' element={<FaqRegistration />} />
			<Route path='/faq/edit/:id' element={<FaqRegistration />} />

			<Route path='/qna' element={<AdminQna />} />
			<Route path='/qna/new' element={<QnaRegistration />} />
			<Route path='/qna/:id' element={<QnaRegistration />} />
			<Route path='/qna/edit/:id' element={<QnaRegistration />} />

			<Route path='/banner' element={<AdminBannerList />} />
			<Route path='/banner/new' element={<BannerRegistration />} />
			<Route path='/banner/:id' element={<BannerRegistration />} />
			<Route path='/banner/edit/:id' element={<BannerRegistration />} />

			<Route path='/popup' element={<AdminPopupList />} />
			<Route path='/popup/new' element={<PopupRegistration />} />
			<Route path='/popup/:id' element={<PopupRegistration />} />
			<Route path='/popup/edit/:id' element={<PopupRegistration />} />

			<Route path='/statistics/visitors' element={<AdminStatistics type={'login'} />} />
			<Route path='/statistics/pv' element={<AdminStatistics type={'post_view'} />} />
			<Route path='/statistics/downloads' element={<AdminStatistics type={'file_download'} />} />
			<Route path='/statistics/subscribers' element={<AdminStatistics type={'subscribe'} />} />

			<Route path='/alarm' element={<AdminAlarmList />} />
			<Route path='/alarm/new' element={<AdminAlarmRegistration />} />
			<Route path='/alarm/:id' element={<AdminAlarmRegistration />} />
			<Route path='/alarm/edit/:id' element={<AdminAlarmRegistration />} />

			<Route path='/group' element={<AdminGroupList />} />
			<Route path='/group/new' element={<AdminGroupRegistration />} />
			<Route path='/group/edit/:id' element={<AdminGroupRegistration />} />
			{/* <Route path='/group/match' element={<AdminGroupMatch />} /> */}
			<Route path='/group/match/:path' element={<AdminGroupmatch2 />} />
			{/* <Route path='/group/team' element={<StrategicMarketingTeamList />} /> */}

			<Route path='/code' element={<AdminCodeList />} />
			<Route path='/code/new' element={<AdminCodeRegistration />} />
			<Route path='/code/:id' element={<AdminCodeRegistration />} />
			<Route path='/code/edit/:id' element={<AdminCodeRegistration />} />

			<Route path='/member' element={<AdminMemberPage />} />
			<Route path='/member/:userId/:path' element={<AdminMemberPage />} />

			<Route path='/role/operator' element={<AdminOperatorList />} />
			<Route path='/role/manager' element={<AdminContentsManagerList />} />
			<Route path='/role/manager/new' element={<AdminContentsManagerRegistration />} />
			<Route path='/role/manager/edit/:id' element={<AdminContentsManagerRegistration />} />


			<Route path='/user-switch' element={<UserSwitchingPage />} />

			{/* <Route path='/login' element={<LoginForm />} />
			<Route path="/login/:check" element={<Login />} />
			<Route path="/login/:check/:token" element={<Login />} /> */}
			{/* <Route path="/login/" element={<LoginPage />} /> */}

			<Route path='*' element={<ErrorPage msg='페이지가 존재하지 않습니다.' />} />
		</Routes>
	);
};


// export const NotFound = () => {
// 	return (
// 		<>
// 			<Empty
// 				image={Empty.PRESENTED_IMAGE_DEFAULT}
// 				description={
// 					<p>페이지가 존재하지 않습니다!</p>
// 				}
// 			/>
// 		</>
// 	);
// };