/**
 * @format
 */
import { AdminMemberAlarm } from './detail/AdminMemberAlarm';
import { AdminMemberHistory } from './detail/AdminMemberHistory';
import { AdminMemberPost } from './detail/AdminMemberPost';
import { AdminMemberProfile } from './detail/AdminMemberProfile';
import { AdminMemberScrap } from './detail/AdminMemberScrap';

// my page의 메뉴 매핑
export const menu = [
    {
        key: 'profile',
        label: 'Profile',
        component: <AdminMemberProfile />,
    },
    {
        key: 'scrap',
        label: 'Scrap',
        component: <AdminMemberScrap />,
    },
    {
        key: 'alarm',
        label: 'Alarm',
        component: <AdminMemberAlarm />,
    },
    {
        key: 'history',
        label: 'History',
        component: <AdminMemberHistory />,
    },
    {
        key: 'myContents',
        label: 'My Contents',
        component: <AdminMemberPost />,
    },
];

// 경로(예:/admin/user/scrap)로부터 label(예:Scrap)을 리턴.
export const getLabelByPath = (path) => {
    return menu.find((e) => e.link === path)?.label;
};

// 경로(예:/admin/user/scrap)로부터 key(예:scrap)을 리턴.
export const getKeyByPath = (path) => {
    return menu.find((e) => e.link === path)?.key;
};
