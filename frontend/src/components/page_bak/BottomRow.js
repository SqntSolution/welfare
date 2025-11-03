// 젤 아랫쪽의 footer
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, Divider, Flex, Row, Col, Card, FloatButton, Menu, List, } from 'antd';
// import { getMenuIdFromPath, getMenuFromMenuId } from 'utils/menuHolder';
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { useGetMenus } from 'hooks/helperHook'
import { useUserInfo } from 'hooks/useUserInfo'
import styled from 'styled-components';


export const BottomRow = () => {
    const { menu1, menu2 } = useParams();
    const userInfo = useUserInfo()
    const theMenus = useGetMenus()
    const navigate = useNavigate();
    const [menus, setMenus] = useState([])
    const [current, setCurrent] = useState()


    useEffect(() => {
        if(theMenus!=null){
            const m = theMenus?.map(e => { return { label: e.menuNm, key: e.id, path: e.menuEngNm } })
            setMenus(m ?? [])
            if (menu1 != null) {
                const m = menus.find(e => e.path == menu1)
                if (m != null) {
                    setCurrent(`${m.key}`)
                }
            }
        }
    }, [menu1, theMenus])

    const onClickMenu = e => {
        const path = menus.find(elem => e.key == elem.key)?.path ?? ''
        navigate(`/main/${path}`)
    }


    return (
        <>
            <Row style={{
                width: '100%',
                margin: 0,
                background: '#E9EBEF',
                padding: '72px 00',
                marginTop:72
                // border: '1px soli,d #84a9ff',
            }} justify='center' align='middle' gutter={[40, 0]} >
                <Row
                    style={{
                        width: 1240,
                        color: '#fff',
                        justifyContent :'space-between',
                    }}
                >
                    {/* <Col span={24} style={{backgroundColor: '#af9e9ed3', padding:5}} align='center' >
                        <Space size='large'>
                            Market Analysis <Divider type="vertical" />
                            Market Analysis <Divider type="vertical" />
                            Market Analysis
                        </Space>
                    </Col> */}
                    <h2 className='ft_logo'> <img src='/img/ft_logo.png' /></h2>
                    <div style={{width:'80%',display:'flex',flexWrap:'wrap'}}>
                        <StyledMenu
                            align="right"
                            onClick={onClickMenu}
                            selectedKeys={[current]}
                            mode="horizontal"
                            horizontalitemhovercolor="red"
                            items={menus}
                        />
                        <p style={{width: '100%',textAlign:'right',color:"#8C8C8C"}}>©2024 COSMAX INC. ALL RIGHTS RESERVED.</p>
                    </div>
                </Row>

            </Row>
            {/* <FloatButton.BackTop visibilityHeight={10} /> */}
        </>
    )
}

const StyledMenu = styled(Menu)`
    height: 30px; 
    line-height: 30px;
    background : transparent;
    color:#8C8C8C;
    font-size: 14px;
    width: 100%;
    margin-left: auto;
    justify-content: end;
    gap: 16px;
    margin-bottom: 24px;
    border:0;


    &&& .ant-menu-overflow-item:hover{color:#EB2D2B}
    .ant-menu-title-content { color: #000; }
    ant-menu-overflow-item:first-child{ margin-right: -8px;}
    .ant-menu-overflow-item:not(:first-child){ display: flex;align-items: center;}
    .ant-menu-overflow-item:not(:first-child)::before{
        content: "";
        display:block;
        width:1px;
        height:40%;
        background:rgba(0, 0, 0, 0.06);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -8px;
    }
    .ant-menu-title-content:hover{color:#EB2D2B}
`;