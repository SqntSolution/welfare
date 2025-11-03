// admin 메뉴에 대한 Layout

import { Outlet } from 'react-router-dom';
import { Layout, App as Content, ConfigProvider } from 'antd';
import { Sider } from './Sider';
import { SALayoutWrap } from 'styles/StyledAdmin';
import { useEffect } from 'react';

const AdminLayout = () => {
    useEffect(() => {
        document.title = 'Elorien ADM';
    }, []);
    return (
        <SALayoutWrap>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#9254DE',
                        colorTextBase: 'rgba(0, 0, 0, 0.85)',
                        fontSize: 14,
                        defaultBg: '#fff',
                        defaultBorderColor: '#d9d9d9'
                    },
                    components: {
                        Table: {
                            headerColor: 'rgba(0, 0, 0, 0.85)',
                            cellFontSizeSM: 14,
                            // rowHoverBg: 'none',
                        },
                        Form: {
                            itemMarginBottom: 2
                        },
                        Layout: {
                            siderBg: '#F9F6FB',
                            headerBg: '#F9F6FB',
                            bodyBg: '#F9F6FB',
                            footerBg: '#F9F6FB',
                        },
                        Menu: {
                            itemPaddingInline: 16
                        },
                        Button: {
                            defaultBg: '#fff',
                            defaultBorderColor: '#d9d9d9'
                        },
                        Select: {
                            defaultBg: '#fff',
                            defaultBorderColor: '#d9d9d9'
                        },
                        Input: {
                            defaultBorderColor: '#d9d9d9'
                        },
                    },
                }}
            >
                <Layout>
                    <Sider />
                    <Layout>
                        {/* <Header /> */}
                        <Content>
                            {/* Outlet을 통해 하위 라우트가 여기에 렌더됨 */}
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </SALayoutWrap>
    )
}

export default AdminLayout;