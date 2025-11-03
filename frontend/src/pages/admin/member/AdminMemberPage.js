/**
 * @format
 */
import { Breadcrumb } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { isEmptyCheck } from 'utils/helpers';
import AdminMemberList from './AdminMemberList';
import AdminMemberDetail from './AdminMemberDetail';
import { CustomAdminTitle } from 'components/common/CustomComps';

export const AdminMemberPage = () => {
    const location = useLocation();
    const { userId, path } = useParams();
    const breadcrumbItems = [
        { title: 'Home'},
        { title: '회원'},
    ]
    return (
        <>
            {isEmptyCheck(userId) && isEmptyCheck(path) ? (
                <>
                    <CustomAdminTitle title={'회원'} items={breadcrumbItems}/>
                    <AdminMemberList />
                </>
            ) : null}
            {!isEmptyCheck(userId) && !isEmptyCheck(path) ? <AdminMemberDetail /> : null}
        </>
    );
};

export default AdminMemberPage;
