// sub페이지 위의 배너 영역
import { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { useLocation } from "react-router-dom";
import { getLabelByPath } from '../menu';

export const MyPageBanner = (props) => {
    const { menu } = props;
    const location = useLocation();
    const [menuLabel, setMenuLabel] = useState()

    useEffect(() => {
        labelSetting();
    }, [location.pathname])
    
    const labelSetting = () => {
        const label = getLabelByPath(menu, location.pathname) ?? ""
        setMenuLabel("My : " + label)
    }

    return (
        <>
            <Row justify='center' style={{
                width: 1300,
                height: 100,
                margin: '0 auto',
                backgroundColor: '#d1cbf5'
                // border: '1px solid #84a9ff',
            }}>
                <Col style={{
                    width: '100%',
                    borderRadius: 0,
                    // border: '1px solid #2a92f',
                }} justify='center' align="middle">
                    <Typography.Title level={3}>{menuLabel}</Typography.Title>
                    {/* <Typography.Title level={5}>{menu?.subTitle}</Typography.Title> */}
                </Col>
            </Row>

        </>
    )
}