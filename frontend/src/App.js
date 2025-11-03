import './styles/css/reset.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider, Empty } from 'antd';
import locale from 'antd/es/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteChangeTracker from "./RouteChangeTracker";
import AppRouter from 'routes/AppRouter';
import './styles/css/App.scss';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

dayjs.locale('ko');

const queryClient = new QueryClient();

const App = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location?.pathname])

    //Google Analytics적용
    RouteChangeTracker();

    return (
        <QueryClientProvider client={queryClient} >
            <ConfigProvider locale={locale}
                renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="데이터가 없습니다." />}
            >
                <AntdApp>
                    <Routes>
                        <Route path='/*' element={<AppRouter />} />
                    </Routes>
                </AntdApp>
            </ConfigProvider>
        </QueryClientProvider >
    );
};

export default App;
