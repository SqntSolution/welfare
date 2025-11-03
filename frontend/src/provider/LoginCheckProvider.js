import { expireAtState, loginUser, refreshUserInfo } from 'atoms/atom';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AXIOS } from 'utils/axios';
import { getSecWithCurrTime } from 'utils/helpers';

// 로그인 체크가 필요한 중요한 페이지들
const CRITICAL_PATHS = [
    '/admin',
    '/my',
    '/post/edit',
    '/post/new',
];

// 로그인 체크 상태 Context
const LoginCheckContext = createContext({
    isInitialCheckComplete: false,
    isLoading: false
});

export const useLoginCheck = () => useContext(LoginCheckContext);

export const LoginCheckProvider = ({ children }) => {
    const location = useLocation();
    const [theLoginUser, setTheLoginUser] = useRecoilState(loginUser);
    const expireTime = useRecoilValue(expireAtState);
    const setExpireTime = useSetRecoilState(expireAtState);
    const theRefreshUserInfo = useRecoilValue(refreshUserInfo);
    const lastCheckTime = useRef(0);
    const isChecking = useRef(false); // 요청 중복 방지
    const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const initialLocationKey = useRef(null);

    // 앱 초기 로드 시 한 번만 실행
    useEffect(() => {
        if (!isInitialCheckComplete) {
            initialLocationKey.current = location.key;
            performInitialCheck();
        }
    }, []);

    // route 변경 시 체크 (초기 체크 완료 후에만)
    useEffect(() => {
        if (isInitialCheckComplete && location.key !== initialLocationKey.current) {
            checkLoginStatus();
        }
    }, [location.key, isInitialCheckComplete])

    // refreshUserInfo 값 변경 시 강제로 사용자 정보 갱신
    useEffect(() => {
        if (theRefreshUserInfo > 0) {
            forceRefreshUserInfo();
        }
    }, [theRefreshUserInfo]);

    /**
     * 앱 초기 로드 시 로그인 체크
     */
    const performInitialCheck = async () => {
        await getMyInfo(true);
        setIsInitialCheckComplete(true);
    };

    /**
     * 현재 경로가 로그인 체크가 필요한 중요한 페이지인지 확인
     */
    const isCriticalPath = (pathname) => {
        return CRITICAL_PATHS.some(path => pathname.startsWith(path));
    };

    /**
     * 로그인 상태 체크 - 토큰 만료 시간 기반 최적화
     */
    const checkLoginStatus = async () => {
        // 이미 체크 중이면 생략
        if (isChecking.current) {
            return;
        }

        const now = Date.now();

        // 중요한 페이지가 아니면서 ROLE_VISITOR가 아닌 경우 체크 생략
        if (!isCriticalPath(location.pathname) && theLoginUser.role !== 'ROLE_VISITOR' && expireTime) {
            const remainingSeconds = getSecWithCurrTime(expireTime);
            // 10분(600초) 이상 남았으면 API 호출 생략
            if (remainingSeconds > 600) {
                return;
            }
        }

        // 마지막 체크로부터 30초 이내면 생략 (캐시 기반)
        if (now - lastCheckTime.current < 30 * 1000) {
            return;
        }

        // ROLE_VISITOR가 아닌 경우 토큰 만료 시간 체크
        if (theLoginUser.role !== 'ROLE_VISITOR' && expireTime) {
            const remainingSeconds = getSecWithCurrTime(expireTime);
            // 5분(300초) 이상 남았으면 API 호출 생략
            if (remainingSeconds > 300) {
                return;
            }
        }

        // 아래 경우에만 API 호출:
        // 1. ROLE_VISITOR인 경우
        // 2. 토큰 만료 시간이 없는 경우
        // 3. 토큰 만료가 5분 이내인 경우
        // 4. 마지막 체크로부터 30초 이상 지난 경우
        // 5. 중요한 페이지인 경우
        await getMyInfo();
        lastCheckTime.current = now;
    };

    /**
     * 강제로 사용자 정보 갱신 (refreshUserInfo 트리거 시)
     */
    const forceRefreshUserInfo = async () => {
        await getMyInfo(true); // 강제 갱신 플래그 전달
    };

    /**
     * 만료 시간 가져오기
     */
    const getExpireTime = async () => {
        try {
            const res = await AXIOS.get(`/api/v1/common/login/issued-at-time`);
            const expiresAt = res.data; // 밀리초
            setExpireTime(expiresAt);
        } catch (err) {
            console.error(err?.response);
        }
    };

    /**
     * 내정보 조회
     * @param {boolean} forceRefresh - 강제 갱신 여부
     */
    const getMyInfo = async (forceRefresh = false) => {
        setIsLoading(true);
        if (isChecking.current && !forceRefresh) return;

        isChecking.current = true;

        return await AXIOS.post(`/api/v1/common/login/loginw`)
            .then(async (res) => {
                const userInfo = res?.data ?? {};

                // 강제 갱신이거나 사용자 정보가 변경된 경우
                if (forceRefresh || userInfo.id !== theLoginUser.id) {
                    setTheLoginUser(res?.data ?? {});

                    // 로그인 사용자 정보가 업데이트된 후 만료 시간 설정
                    // ROLE_VISITOR가 아닌 경우에만 만료 시간 가져오기
                    if (userInfo.role !== 'ROLE_VISITOR') {
                        await getExpireTime();
                    }
                }
            })
            .catch((err) => {
                console.log('=== getMyInfo 에러 : ', err?.response);
                setTheLoginUser({})
            })
            .finally(() => {
                isChecking.current = false;
                setIsLoading(false);
            });
    };

    return (
        <LoginCheckContext.Provider value={{
            isInitialCheckComplete,
            isLoading
        }}>
            {children}
        </LoginCheckContext.Provider>
    );
};
