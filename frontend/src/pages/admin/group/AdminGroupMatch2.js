/**
 * @format
 */
import { Col, Row } from 'antd';
import { CustomAdminTabButton, CustomAdminTitle } from 'components/common/CustomComps';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InnerAdminDiv } from 'styles/StyledCommon';
import AdminGroupMatchTeam from './AdminGroupMatchTeam';
import AdminGroupMatchUser from './AdminGroupMatchUser';

export const AdminGroupmatch2 = () => {
    const [current, setCurrent] = useState();
    const { path } = useParams();
    const navigate = useNavigate();

    const menu = [
        { label: '그룹 권한 관리', key: 'team' },
        { label: '개인 권한 관리', key: 'user' }
    ];

    const breadcrumb = [
        { title: 'Home' },
        { title: '그룹' },
        { title: '그룹 매칭 관리' },
    ];

    useEffect(() => {
        setCurrent(path);
    }, []);

    useEffect(() => {
        setCurrent(path);
    }, [path]);

    const onMenuClick = (e) => {
        setCurrent(e.key);
        navigate(`/admin/group/match/${e.key}`);
    }

    return (
        <>
            <CustomAdminTitle title={'그룹'} items={breadcrumb} />

            <Row style={{ width: '100%', borderRadius: 0 }} justify='center' align='middle'>
                <Col span={24} align='middle' >
                    <CustomAdminTabButton
                        onClick={onMenuClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={menu}
                    />
                </Col>
            </Row>

            <InnerAdminDiv style={{ marginTop: 24 }}>
                {path === 'team' ? <AdminGroupMatchTeam title={menu.find(e => e.key === path).label} /> : null}
                {path === 'user' ? <AdminGroupMatchUser title={menu.find(e => e.key === path).label} /> : null}
            </InnerAdminDiv>
        </>
    );
};

export default AdminGroupmatch2;