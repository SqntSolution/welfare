import React, { lazy } from "react";
import { Routes, Route } from 'react-router-dom';
import { Empty } from 'antd';

import { useLocation, useNavigate } from 'react-router-dom';
// import PreProcessRoute from 'layouts/PreProcessRoute';

import { MainPage } from 'pages/user/main/MainPage';
// import { SubmainPage } from 'pages/user/submain/SubmainPage';
// import { MyPage } from "pages/user/my/MyPage";
// import { PostPage } from "pages/user/post/PostPage";
// import { PostEditPage } from "pages/user/postedit/PostEditPage";
// import { PostEditNewPage } from "pages/user/postedit/PostEditNewPage";
// import { SmartFinderPage } from "pages/user/smartfinder/SmartFinderPage";
// import { AdminSubmainPage } from "pages/admin/AdminSubmainPage";
// import { PageEditPage } from "pages/user/postedit/PageEditPage"
import { AdminLayout } from "layouts/admin/AdminLayout"
import { ErrorPage } from 'pages/common/errorPages'
import { LoginPage } from "pages/common/login/LoginPage";
import { LoginRegisterPage } from "pages/common/login/LoginRegisterPage";
import { LoginFindIdPage } from "pages/common/login/LoginFindIdPage";
import { LoginFindPwPage } from "pages/common/login/LoginFindPwPage";
import { LoginVerifyPage } from "pages/common/login/LoginVerifyPage";
import { LoginGetIdPage } from "pages/common/login/LoginGetIdPage";
import { LoginNewPwPage } from "pages/common/login/LoginNewPwPage";
import LoginDormantPage from "pages/common/login/LoginDormantPage"


const MainRoute = () => {
	let location = useLocation();
	// console.log('=====Tc MainRoute', location);

	return (
		<Routes>
			<Route path='' element={<MainPage />} />
			<Route path='/main' element={<MainPage />} />

			<Route path='/login' element={<LoginPage />} />
			<Route path="/login/re" element={<LoginRegisterPage />} />
			<Route path="/login/id" element={<LoginFindIdPage />} />
			<Route path="/login/pw" element={<LoginFindPwPage />} />
			<Route path="/login/dormant" element={<LoginDormantPage />} />
			<Route path="/verify/:token" element={<LoginVerifyPage />} />
			<Route path="/verify/id" element={<LoginGetIdPage />} />
			<Route path="/verify/pw" element={<LoginNewPwPage />} />

			{/* <Route path='/main/:menu1' element={<SubmainPage />} />
			<Route path='/main/:menu1/:menu2' element={<SubmainPage />} />
			<Route path='/main/:menu1/:menu2/edit' element={<PageEditPage />} />
			<Route path='/main/:menu1/:menu2/*' element={<SubmainPage />} /> */}
			{/* <Route path='/main/my/*' element={<MyPage />} /> */}

			{/* <Route path='/post/edit/:postId' element={<PostEditPage />} />
			<Route path='/post/new' element={<PostEditNewPage />} />
			<Route path='/post/:postId' element={<PostPage />} /> */}

			{/* <Route path='/main/smartfinder' element={<SmartFinderPage />} /> */}

			{/* 어드민 페이지  */}
			<Route path='/admin/*' element={<AdminLayout />} />

			<Route path='*' element={<ErrorPage msg='페이지가 존재하지 않습니다.' />} />
		</Routes>
	);
};

// const DummyContents = () => {
// 	return (
// 		<>
// 			dummy contents
// 		</>
// 	)
// }

// export const NotFound = () => {
// 	return (
// 		<>
// 			<Empty
// 				image={Empty.PRESENTED_IMAGE_DEFAULT}
// 				description={
// 					<p>존재하지 않는 페이지!!!</p>
// 				}
// 			/>
// 		</>
// 	);
// };

export { MainRoute };
