// admin 메뉴에 대한 Layout

import { RecoilRoot } from 'recoil';
import { useEffect, useState, Suspense } from 'react';
import { Routes, Route, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Empty, App as Content, Tag, Button, ConfigProvider } from 'antd';
import { MainLayout } from 'layouts/MainLayout'
import { loginUser } from 'atoms/atom';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { Sider } from './Sider';
import { Header } from './Header';
import { AXIOS } from 'utils/axios';
import { HasNoAdminAuthPage, NoAuthPage } from 'pages/common/errorPages'
import { useUserInfo } from 'hooks/useUserInfo'
import { AdminRoute } from './AdminRoute'
import { useMsg } from 'hooks/helperHook';
import { ErrorPage } from 'pages/common/errorPages'

export const AdminLayout = () => {
    const location = useLocation();
    const userInfo = useUserInfo()
    const [adminCheck, setAdminCheck] = useState("before")

    // document.body.style.backgroundColor  = "#F9F6FB";
    useEffect(() => {
        // userInfo를 구해온후에
        if (userInfo?.id != null) {
            if (userInfo?.role == "ROLE_MASTER" || userInfo?.role == "ROLE_OPERATOR") {
                setAdminCheck("ok")
            } else {
                setAdminCheck("ng")
            }
        }
    }, [userInfo])


    return (
        <div style={{ background: '#F9F6FB', paddingBottom: 72 }}>
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
                            headerBg: '#fff',
                            headerColor: 'rgba(0, 0, 0, 0.85)',
                            cellFontSizeSM: 15,
                            cellPaddingBlockSM: 1,
                            cellPaddingInlineSM: 3,
                            rowHoverBg: 'none',
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
                {
                    adminCheck === 'ok' ? (
                        <Layout>
                            <Sider />
                            <Layout>
                                {/* <Header /> */}
                                <Content>
                                    <Suspense >
                                        <AdminRoute />
                                    </Suspense>
                                </Content>
                            </Layout>
                        </Layout>
                    ) : (
                        adminCheck === 'ng' ? (
                            <ErrorPage msg='페이지가 존재하지 않습니다.' />
                        ) : (
                            <Tag color="#108ee9" style={{ margin: 50 }}>로그인 체크 중...</Tag>
                        )
                    )
                }
            </ConfigProvider>
        </div>
    )
}
