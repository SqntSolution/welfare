/**
 * @format
 */
import { Breadcrumb, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { AXIOS } from 'utils/axios';
import { AdminMemberMenu } from './AdminMemberMenu';
import AdminMemberAlarm from './detail/AdminMemberAlarm';
import AdminMemberHistory from './detail/AdminMemberHistory';
import AdminMemberPost from './detail/AdminMemberPost';
import AdminMemberProfile from './detail/AdminMemberProfile';
import AdminMemberScrap from './detail/AdminMemberScrap';
import { useMsg } from 'hooks/helperHook';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv } from 'styles/StyledCommon';

export const AdminMemberDetail = () => {
    const [loading, setLoading] = useState(true);
    const [currentComponent, setCurrentComponent] = useState();
    const [memberInfo, setMemberInfo] = useState();
    const { userId, path } = useParams();
    const [menu, setMenu] = useState([]);
    const { error, info } = useMsg();

    const getMenu = () => {
        AXIOS.get(`/api/v1/common/menu/sub/${'my'}`)
            .then((res) => {
                const menuItem = res.data.map((obj) => ({
                    key: obj.menuEngNm,
                    label: obj.menuNm,
                }));
                setMenu(menuItem);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const getMemberInfo = () => {
        AXIOS.get(`/api/v1/admin/member/${userId}/info`)
            .then((res) => {
                setMemberInfo({
                    ...res?.data
                    ,
                    displayRoleNm: `(${res?.data?.adminRoleNm ?? ''})`
                });
            })
            .catch((err) => {
                error(err);
            });
    };

    useEffect(() => {
        getMenu();
        getMemberInfo();
    }, []);

    // useEffect(() => {
    //     setCurrentComponent(menu.find(e => e.key === path)?.component);
    // }, [path])
    const breadcrumbItems = [
        { title: 'Home' },
        { title: '회원' },
        { title: '회원 상세' },
    ]
    return (
        <>
            <CustomAdminTitle title={`회원 상세 : ${memberInfo?.empNm ?? ''} ${memberInfo?.displayRoleNm ?? ''}`} items={breadcrumbItems} />
            {menu?.length > 0 ? <AdminMemberMenu menu={menu} /> : ''}
            <InnerAdminDiv style={{ marginTop: 24 }}>
                {/* {currentComponent ?? ''} */}
                {path === 'profile' ? <AdminMemberProfile title={'Profile'} /> : null}
                {path === 'scrap' ? <AdminMemberScrap title={'Scrap'} /> : null}
                {path === 'alarm' ? <AdminMemberAlarm title={'Alarm'} /> : null}
                {path === 'history' ? <AdminMemberHistory title={'History'} /> : null}
                {path === 'mypost' ? <AdminMemberPost title={'My Post'} /> : null}
            </InnerAdminDiv>
        </>
    );
};

export default AdminMemberDetail;
