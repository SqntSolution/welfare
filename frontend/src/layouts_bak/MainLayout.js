import { Suspense, useEffect, useState } from 'react';
import { ConfigProvider, App } from 'antd';
import { MainRoute } from './MainRoute';
import { Header } from 'components/user/Header';
import { useLocation } from 'react-router-dom';

export const MainLayout = () => {
    const location = useLocation();
    const [userPageCheck, setUserPageCheck] = useState(true);

    useEffect(() => {

        if (location.pathname.includes('/admin')) {
            setUserPageCheck(false);
        } else {
            setUserPageCheck(true);
        }
    }, [location?.pathname])

    return (

        <ConfigProvider
            theme={{
                token: {

                },
                components: {
                    Layout: {
                    },
                    Input: {

                    },
                },
            }}
        >
            <App>
                <div className={userPageCheck ? 'user' : 'admin'}>
                    {userPageCheck ? <Header /> : null}
                    <Suspense>
                        <MainRoute />
                    </Suspense>
                </div>
            </App>
        </ConfigProvider >

    );
};

