/**
 * @file ExpireTimeProvider.js
 * @description 로그인 연장 타이머 Provider
 * @author 이병은
 * @since 2025-05-29 14:48
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-29 14:48    이병은       최초 생성
 * 2025-05-29 14:49    이병은       자동 로그인 사용자 자동 연장 기능 추가
 **/
import { expireAtState, loginUser, secondsState } from 'atoms/atom';
import { useMsg } from 'hooks/helperHook';
import { useLogout } from 'hooks/loginHelperHook';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AXIOS } from 'utils/axios';
import { errorMsg, getSecWithCurrTime, isEmptyCheck } from 'utils/helpers';


const ExpireContext = createContext({ isTiemerActive: true });
export const useExpireContext = () => useContext(ExpireContext);

export const ExpireTimeProvider = ({ children, isActive = true }) => {
    const setSeconds = useSetRecoilState(secondsState);
    const theLoginUser = useRecoilValue(loginUser);
    const [expireTime, setExpireTime] = useRecoilState(expireAtState);
    const { info, error } = useMsg();
    const logout = useLogout({
        message: '로그인 세션이 만료되었습니다.',
        isTimeOut: true,
    })
    const loginChkLoading = useRef(false);

    // 만료 시간 갱신 (주기적으로 서버에서 최신 만료 시간 가져오기)
    const refreshExpireTime = useCallback(async () => {
        if (!isActive || theLoginUser.role === 'ROLE_VISITOR') return;
        
        try {
            const res = await AXIOS.get(`/api/v1/common/login/issued-at-time`);
            const expiresAt = res.data; // 밀리초
            
            // 현재 만료 시간보다 새로운 만료 시간이 더 클 때만 업데이트
            if (!expireTime || expiresAt > expireTime) {
                setExpireTime(expiresAt);
            }
        } catch (err) {
            console.log('=== 만료 시간 갱신 에러:', err?.response);
        }
    }, [isActive, theLoginUser.role, expireTime, setExpireTime]);

    // 주기적 만료시간 갱신 (5분마다)
    useEffect(() => {
        if (!isActive || isEmptyCheck(theLoginUser.id) || theLoginUser.role === 'ROLE_VISITOR') {
            return;
        }

        // 5분마다 만료 시간 갱신
        const refreshInterval = setInterval(() => {
            refreshExpireTime();
        }, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [theLoginUser.id, theLoginUser.role, isActive, refreshExpireTime]);

    // 타이머 (앱 전체에서 1개만 동작)
    useEffect(() => {
        if (!isActive || isEmptyCheck(expireTime) || isEmptyCheck(theLoginUser.id)) {
            return;
        }
        
        const timer = setInterval(async () => {
            if (!expireTime) return;
            
            // 남은 시간 계산
            const remainingSeconds = getSecWithCurrTime(expireTime);

            if (remainingSeconds < 0 && theLoginUser.role !== 'ROLE_VISITOR') {
                // 만료 시간이 지났을 때 한 번 더 확인
                if (loginChkLoading.current) {
                    return;
                }
                
                try {
                    loginChkLoading.current = true;
                    const res = await AXIOS.post(`/api/v1/common/login/loginw`);
                    const loginW = res.data;
                    
                    if (loginW.role === 'ROLE_VISITOR') {
                        logout();
                        clearInterval(timer);
                    } else {
                        // 여전히 로그인 상태라면 만료 시간 갱신
                        await refreshExpireTime();
                    }
                } catch (err) {
                    logout();
                    error(errorMsg(err));
                    clearInterval(timer);
                } finally {
                    loginChkLoading.current = false;
                }
            } else {
                // 남은 시간 업데이트
                setSeconds(remainingSeconds);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [theLoginUser.id, expireTime, isActive, theLoginUser.role, refreshExpireTime, logout, error, setSeconds]);

    return (
        <ExpireContext.Provider value={{ isActive }}>
            {children}
        </ExpireContext.Provider>
    );
};
