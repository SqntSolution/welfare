/**
 * @format
 **/

import React, { useState, useEffect } from 'react';
import {
	HighlightOutlined, BankOutlined, SettingFilled, CoffeeOutlined, ApartmentOutlined, FundProjectionScreenOutlined, ControlOutlined, NotificationOutlined, QuestionCircleOutlined, QuestionOutlined,
	SnippetsOutlined, BarChartOutlined, UserSwitchOutlined, UserOutlined, TeamOutlined, SolutionOutlined, NodeIndexOutlined, ClusterOutlined, CustomerServiceOutlined, FileDoneOutlined, TagsOutlined,
	IssuesCloseOutlined, SearchOutlined, ExclamationCircleOutlined, UnorderedListOutlined, MenuUnfoldOutlined, UsergroupAddOutlined, DeliveredProcedureOutlined, EyeOutlined, FundViewOutlined,
	LineChartOutlined, GatewayOutlined, SwitcherOutlined, AppstoreOutlined, PieChartOutlined, BellOutlined, CodeOutlined, LoginOutlined, ReconciliationOutlined, DownloadOutlined, PlayCircleOutlined,
	UnlockOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { currentMenu } from 'atoms/atom';
import { useRecoilState } from 'recoil';
import { NavLink } from 'react-router-dom';
import { useUserInfo } from 'hooks/useUserInfo';
import styled from 'styled-components';

function getItem(label, key, icon, children, type) {
	return {
		label,
		key,
		icon,
		children,
		type,
	};
}

export const SiderMenu = () => {
	const [currentMenuId, setCurrentMenuId] = useRecoilState(currentMenu);
	const userInfo = useUserInfo()

	const menuItems = () => {
		const list = [
			getItem(<NavLink to='/admin/dashboard'>대시보드</NavLink>, 'admin-dashboard', <LineChartOutlined />),
			getItem(<NavLink to='/admin/member'>회원</NavLink>, '/admin/member', <UserOutlined />),
			getItem('그룹', 'group', <TeamOutlined />,
				[
					getItem(<NavLink to='/admin/group'>그룹 정보 관리</NavLink>, '/admin/group', <SolutionOutlined />),
					// getItem(<NavLink to='/admin/group/match'>그룹 매칭 관리</NavLink>, '/admin/group/match', <NodeIndexOutlined />),
					getItem(<NavLink to='/admin/group/match/team'>그룹 매칭 관리</NavLink>, '/admin/group/match/team', <NodeIndexOutlined />),
					getItem(<NavLink to='/admin/group/team'>전략마케팅 팀 관리</NavLink>, '/admin/group/team', <ClusterOutlined />),
				]
			),
			getItem(<NavLink to='/admin/category'>카테고리</NavLink>, 'admin-category', <ApartmentOutlined />),
			getItem('콘텐츠', 'admin_contents_search', <SnippetsOutlined />,
				[
					getItem(<NavLink to='/admin/content'>포스트</NavLink>, 'admin-content', <FileDoneOutlined />),
					getItem(<NavLink to='/admin/content/keyword'>검색어</NavLink>, 'admin-content-keyword', <TagsOutlined />),
				]
			),
			getItem('고객센터', 'customer-cscenter', <CustomerServiceOutlined />,
				[
					getItem(<NavLink to='/admin/notice'>Notice</NavLink>, '/admin/notice', <NotificationOutlined />),
					getItem(<NavLink to='/admin/faq'>FAQ</NavLink>, '/admin/faq', <QuestionCircleOutlined />),
					getItem(<NavLink to='/admin/qna'>Q&A</NavLink>, '/admin/qna', <QuestionOutlined />),
				]
			),
			getItem(<NavLink to='/admin/banner'>배너</NavLink>, '/admin/banner', <GatewayOutlined />),
			getItem(<NavLink to='/admin/popup'>팝업</NavLink>, '/admin/popup', <SwitcherOutlined />),
			getItem('통계', 'admin-statistics', <PieChartOutlined />,
				[
					getItem(<NavLink to='/admin/statistics/visitors'>방문자</NavLink>, 'admin-statistics-visitors', <BarChartOutlined />),
					getItem(<NavLink to='/admin/statistics/pv'>조회</NavLink>, 'admin-statistics-pv', <FundViewOutlined />),
					getItem(<NavLink to='/admin/statistics/downloads'>다운로드</NavLink>, 'admin-statistics-downloads', <DownloadOutlined />),
					getItem(<NavLink to='/admin/statistics/subscribers'>구독</NavLink>, 'admin-statistics-subscribers', <UsergroupAddOutlined />),
				]
			),
			getItem(<NavLink to='/admin/alarm'>알림</NavLink>, '/admin/alarm', <BellOutlined />),
			getItem(<NavLink to='/admin/code'>코드</NavLink>, '/admin/code', <CodeOutlined />),

			getItem('테스트 페이지', 'test-page', <PlayCircleOutlined />,
				[
					getItem(<NavLink to='/admin/login'>Login</NavLink>, '/admin/login', <UnlockOutlined />),
				]
			),
		];

		// ROLE_MASTER 관리자
		if (userInfo?.role === 'ROLE_MASTER') {
			list.push(
				getItem(<NavLink to='/admin/user-switch'>사용자 전환</NavLink>, '/admin/user-switch', <UserSwitchOutlined />),
			)
			list.push(
				getItem('관리자', 'manager', <SettingFilled />,
					[
						getItem(<NavLink to='/admin/role/operator'>운영자</NavLink>, '/admin/setting/manager', <FundProjectionScreenOutlined />),
						getItem(<NavLink to='/admin/role/manager'>콘텐츠 관리자</NavLink>, '/admin/setting/contents-manager', <ReconciliationOutlined />),
					],
				),
			)
		}

		// ROLE_OPERATOR 관리자
		if (userInfo?.role === 'ROLE_OPERATOR') {
			list.push(
				getItem('관리자', 'manager', <SettingFilled />,
					[
						getItem(<NavLink to='/admin/role/manager'>콘텐츠 관리자</NavLink>, '/admin/setting/contents-manager', <ReconciliationOutlined />),
					],
				),
			)
		}

		list.push(getItem(<NavLink to='/' className={'adminOut'}>관리자모드 나가기</NavLink>, '/main', <LoginOutlined />))

		return list
	}

	const onClick = (e) => {
		setCurrentMenuId(e.key);
	};

	return (
		<StyledMenu
			defaultSelectedKeys={[]}
			defaultOpenKeys={['/admin/dashboard']}
			selectedKeys={[currentMenuId]}
			items={menuItems()}
			mode='inline'
			onClick={(e) => onClick(e)}
			style={{ background: "transparent", padding: '0 8px', border: 0 }}
			inlineIndent={16}
		/>
	);
};


const StyledMenu = styled(Menu)`
	&.ant-menu-light> .ant-menu-item.ant-menu-item-selected[role="menuitem"],
	&.ant-menu-light .ant-menu-submenu-selected >.ant-menu-submenu-title, 
	&.ant-menu-light>.ant-menu .ant-menu-submenu-selected >.ant-menu-submenu-title{
		background:#B37FEB;
		color:#fff;
		width: 100%;
		border-radius: 8px
	}
	&.ant-menu-light> .ant-menu-item:has(.adminOut):hover{
		background: #fff;
		box-shadow: 3px 3px 5px 2px rgba(0, 0, 0, 0.1);
		color: #9254DE;
		transition: all 0.3s;
	}
	&.ant-menu-light .ant-menu-item-selected, 
	&.ant-menu-light>.ant-menu .ant-menu-item-selected {background-color: transparent;border-radius:0;}
	&.ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline, 
	&.ant-menu-light>.ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline{
		margin-top:8px
	}
	&.ant-menu .ant-menu-item .ant-menu-item-icon, 
	&.ant-menu .ant-menu-submenu-title .ant-menu-item-icon{font-size:16px;}


	&.ant-menu-inline.ant-menu-root .ant-menu-item, 
	&.ant-menu-inline.ant-menu-root .ant-menu-submenu-title{padding-left: 8px;}
`;