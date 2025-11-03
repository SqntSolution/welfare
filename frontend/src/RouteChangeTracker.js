import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import {REACT_APP_GOOGLE_ANALYTICS} from 'utils/constants'
import { useUserInfo } from 'hooks/useUserInfo'

/**
 * uri 변경 추적 컴포넌트
 * uri가 변경될 때마다 pageview 이벤트 전송
 */
const RouteChangeTracker = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);
    const userInfo = useUserInfo()

    // 구글 애널리틱스 운영서버만 적용
    useEffect(() => {
        // console.log('====google Analytics:', process.env.REACT_APP_GOOGLE_ANALYTICS);
        // if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
        if (!initialized && (userInfo?.v)=='prod'  ) {
            // ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
            ReactGA.initialize(REACT_APP_GOOGLE_ANALYTICS);
            setInitialized(true);
            console.log("=== google analytics initialized.")
        }
    }, [userInfo]);

    // location 변경 감지시 pageview 이벤트 전송
    useEffect(() => {
        // console.log('--===initialized', initialized, location.pathname)
        if (initialized) {
            ReactGA.set({ page: location.pathname });
            ReactGA.send('pageview');
        }
    }, [initialized, location]);
};

export default RouteChangeTracker;