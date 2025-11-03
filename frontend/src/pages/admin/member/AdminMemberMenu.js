// 2차 메뉴
import { useEffect, useState } from 'react';
import { Row, Col, Menu, Typography, Divider } from 'antd';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CustomAdminTabButton } from 'components/common/CustomComps';
// import { menu } from './menu';


export const AdminMemberMenu = (props) => {
    const { menu } = props;
    const location = useLocation();
    const [current, setCurrent] = useState();
    const [title, setTitle] = useState();
    const navigate = useNavigate();
    const { userId, path } = useParams();

    useEffect(() => {
        setCurrent(path);
        setTitle(menu?.find(elem => elem.key === path)?.label);
    }, [path])


    const onMenuClick = (e) => {
        const component = menu?.find(elem => elem.key === e.key)?.component;
        setCurrent(menu?.find(elem => elem.key === e.key)?.key);
        setTitle(menu?.find(elem => elem.key === e.key)?.label);
        navigate(`/admin/member/${userId}/${e.key}`);
    }

    return (
        <>
            <Row style={{
                width: '100%',
                borderRadius: 0,
            }} justify='center' align='middle'>
                <Col span={24} align='middle' >
                    <CustomAdminTabButton
                        onClick={onMenuClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={menu}
                    />
                </Col>
            </Row>
            
            {/* <Typography.Title
                level={3}
                style={{
                    marginTop: 10,
                }}
            >{title ?? ''}</Typography.Title> */}
        </>
    )
}