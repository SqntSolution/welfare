import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Layout, Typography, Button, Space, Flex, Row, Col, Avatar, Tag, Image } from 'antd';
import { useState, useEffect } from 'react';
import { SiderMenu } from './SiderMenu';
import { useUserInfo } from 'hooks/useUserInfo'
import styled from 'styled-components';

const { Text } = Typography;

export const Sider = () => {
    const [collapsed, setCollapsed] = useState(true);
    const userInfo = useUserInfo()

    useEffect(() => {
        setCollapsed(false);
    }, []);

    const getRole = ()=>{
        if(userInfo?.role=="ROLE_MASTER"){
            return "마스터 관리자"
        }else if(userInfo?.role=="ROLE_OPERATOR"){
            return "운영 관리자"
        }else {
            return userInfo?.role
        }
    }

    return (
        <Layout.Sider
            style={{zIndex: 130,marginRight:24}}
            mode="inline"
            width={208}
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            <Flex justify={'space-around'}>
                {!collapsed && (
                    <>

                        <Row style={{ width: '100%', padding: 0 }}>
                            <Col span={24} align='center' style={{padding:0}}>
                                <Flex justify='center' align='center' style={{width: '100%',height:80}} gutter={[8, 8]}>
                                    <img src="/img/admin-logo.png" alt=' ' style={{height: 24}}/>
                                    <Text style={{
                                        color:'#9254DE',
                                        fontSize:18,
                                        fontWeight:800,
                                    }}>Insight Admin</Text>
                                </Flex>
                            </Col>

                            <Col span={24} align='center' style={{padding:0}}>
                                <Flex justify='center' align='center' style={{width:'100%',minHeight:84}} gap={4}>
                                    <Avatar icon={<UserOutlined />} 
                                    // src={(userInfo?.avatarImgPath == null) ? null : (`/api/v1/image/${userInfo?.avatarImgPath}`)} 
                                    src={userInfo?.avatarImgPath ? `/api/v1/image/${userInfo.avatarImgPath}` : null}
                                    size={'small'} style={{minWidth: 32,minHeight:32,marginLeft: 24}}/>
                                    <Flex justify='center' wrap='wrap' gap={4}>
                                        <StyledTag color="success" >{userInfo?.teamName}</StyledTag>
                                        <StyledTag color="processing">{getRole()}</StyledTag>
                                        <Text style={{width:'100%'}}>{userInfo?.name}</Text>
                                    </Flex>
                                </Flex>
                            </Col>
                        </Row>
                    </>
                )

                }
            </Flex>
            <SiderMenu />
            {/* <div style={{marginTop:''}}>
                <Button style={{width:"100%",textAlign:'left',paddingLeft:16}} type='text' icon={collapsed ? <MenuUnfoldOutlined  style={{fontSize:16}}/> : <MenuFoldOutlined  style={{fontSize:16}}/>} onClick={() => setCollapsed(!collapsed)} />
            </div> */}
        </Layout.Sider>
    );
};

// export const Sider;


const StyledTag = styled(Tag)`
    &{margin:0}
`;