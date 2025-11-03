// my에서의 submenu
import { useEffect, useState } from 'react';
import { Menu, Row, Col, Divider, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { getKeyByPath, getLinkByKey } from '../menu';

export const MyPageMenu = (props) => {
    const { menu } = props;
    const location = useLocation();
    const [current, setCurrent] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        currentSetting();
    }, [location.pathname]);
    
    const currentSetting = () => {
        const path = location.pathname;
        setCurrent(getKeyByPath(menu, path));
    }

    const onMenuClick = (e) => {
        console.log('=== onMenuClick : ', e);
        const link = getLinkByKey(menu, e.key); //menu?.find(elem => elem.key === e.key)?.link
        navigate(link);
    };

    return (
        <>
            <Row
                style={{
                    width: '100%',
                    borderRadius: 0,
                }}
                justify='center'
                align='middle'>
                <Col span={24} align='middle'>
                    <Menu onClick={onMenuClick} selectedKeys={[current]} mode='horizontal' items={menu} theme='dark' />
                </Col>
            </Row>
            <Row
                style={{
                    width: '100%',
                    borderRadius: 0,
                }}
                justify={'start'}>
                <Typography.Title
                    level={3}
                    style={{
                        marginTop: 10,
                    }}>
                    {menu?.find((elem) => elem.key === current ?? '')?.label}
                </Typography.Title>
                <Divider style={{ marginTop: 0 }} />
            </Row>
        </>
    );
};
