/**
 * @format
 */
import { Col, Row, Typography } from 'antd';
import { CustomAdminTabButton, CustomAdminTitle } from 'components/common/CustomComps';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InnerAdminDiv } from 'styles/StyledCommon';
import AdminCommonCodeList from './comps/common/AdminCommonCodeList';
import AdminRefCodeList from './comps/ref/AdminRefCodeList';

export const AdminCodes = () => {
    const [current, setCurrent] = useState();
    const { path } = useParams();
    const navigate = useNavigate();

    const menu = [
        { label: '공통코드', key: 'common' },
        { label: '참조코드', key: 'ref' }
    ];

    const breadcrumb = [
        { title: 'Code' },
        { title: '코드 관리' },
    ];

    useEffect(() => {
        setCurrent(path);
    }, []);

    useEffect(() => {
        setCurrent(path);
    }, [path]);

    const onMenuClick = (e) => {
        setCurrent(e.key);
        navigate(`/admin/code/${e.key}`);
    }

    return (
        <>
            <CustomAdminTitle title={'코드'} items={breadcrumb} />

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
                {path === 'common' ? <AdminCommonCodeList /> : null}
                {path === 'ref' ? <AdminRefCodeList /> : null}
            </InnerAdminDiv>
        </>
    );
};

export default AdminCodes;