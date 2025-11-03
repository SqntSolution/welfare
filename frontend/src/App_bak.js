
import './styles/css/App.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, Empty } from 'antd';
import locale from 'antd/es/locale/ko_KR';
import { loginUser } from 'atoms/atom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { MainLayout } from 'layouts/MainLayout';
import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { AXIOS } from 'utils/axios';
import { useSyncWithLocalStorage } from './hooks/useSyncWithLocalStorage';
import RouteChangeTracker from "./RouteChangeTracker";
import { ExpireTimeProvider } from 'provider/ExpireTimeProvider';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

dayjs.locale('ko');

const queryClient = new QueryClient();

const App = () => {
    const location = useLocation();
    const setTheLoginUser = useSetRecoilState(loginUser);

    useEffect(() => {
        getMyInfo()
        window.scrollTo(0, 0);
    }, [location?.pathname])

    //Google Analytics적용
    RouteChangeTracker();

    /**
     * 내정보 조회
     * @returns 
     */
    const getMyInfo = async () => {
        // console.log('=== 1');
        return AXIOS.post(`/api/v1/common/login/loginw`)
            .then((res) => {
                setTheLoginUser(res?.data)
            })
            .catch((err) => {
                console.log('=== getMyInfo 에러 : ', err?.response);
                setTheLoginUser({})
            });
    };

    return (
        <QueryClientProvider client={queryClient} >
            <ConfigProvider locale={locale}
                renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="데이터가 없습니다." />}
            >
                <AntdApp>
                    <ExpireTimeProvider >
                        <Routes>
                            <Route path='/*' element={<MainLayout />} />
                        </Routes>
                    </ExpireTimeProvider>
                </AntdApp>
            </ConfigProvider>
        </QueryClientProvider >
    );
};

export default App;
