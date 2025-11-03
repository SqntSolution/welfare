/**
 * @file loginHelperHook.js
 * @description 로그인 과련 훅
 * @author 이병은
 * @since 2025-05-28 15:01
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 15:01    이병은       최초 생성
 * 2025-05-28 15:39    이병은       로그아웃 훅 생성
 * 2025-05-28 15:58    이병은       로그인 연장 훅 추가
 * 2025-05-29 13:44    이병은       로그아웃 훅 파라미터 추가 및 로직 추가
 **/

import { expireAtState, loginUser, passwordVerifiedState, refreshUserInfo } from 'atoms/atom';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { useMsg } from 'hooks/helperHook';
import { errorMsg } from 'utils/helpers';
import { AXIOS } from 'utils/axios';

/**
 * 로그아웃 훅
 * @param {Object} options
 * @param {Function} [options.setOpen] - 팝업 닫기용 함수 (팝업이 여러개인 경우 onSuccess 에서 처리할 것)
 * @param {boolean} [options.msgYn] - 완료 메시지 사용 여부 (기본값: false)
 * @param {string} [options.message] - 로그아웃 완료 메시지 (기본값: '로그아웃하였습니다.')
 * @param {Function} [options.onSuccess] - 로그아웃 성공 후 콜백
 * @param {string} [options.redirectTo] - 로그아웃 성공 후 리다이렉트 경로 (기본값: '/main')
 * @param {boolean} [options.isTimeOut] - 로그인 시간 만료로 인한 타임아웃 여부 (기본값: false);
 */
export const useLogout = (
    {
        setOpen,
        msgYn = false,
        message = '로그아웃하였습니다.',
        onSuccess,
        redirectTo = '/',
        isTimeOut = false,
    } = {}) => {
    const navigate = useNavigate();
    const { info, error } = useMsg();

    const resetLoginUser = useResetRecoilState(loginUser);
    const resetExpireTime = useResetRecoilState(expireAtState);
    const resetVerifiedPw = useResetRecoilState(passwordVerifiedState);
    const setTheRefreshUserInfo = useSetRecoilState(refreshUserInfo);

    const logout = () => {
        const resetState = () => {
            resetLoginUser();
            resetExpireTime();
            resetVerifiedPw();
            setTheRefreshUserInfo(old => old + 1);
        }


        // 팝업이 있다면 팝업부터 닫기
        if (typeof setOpen === 'function') {
            setOpen(false);
        }

        if (isTimeOut) {
            resetState();

            if (msgYn) {
                info(message);
            }

            // 사용자 정의 콜백
            if (typeof onSuccess === 'function') {
                onSuccess();
            }

            // 기본 이동 경로
            navigate(redirectTo);

        } else {
            AXIOS.post(`/api/v1/common/login/logout`)
                .then(() => {
                    // Recoil 상태 초기화
                    resetState();

                    if (msgYn) {
                        info(message);
                    }

                    // 사용자 정의 콜백
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }

                    // 기본 이동 경로
                    navigate(redirectTo);
                })
                .catch((err) => {
                    error(errorMsg(err));
                });
        }
    };

    return logout;
};


/**
 * 로그인 연장 훅
 * @param {Object} options
 * @param {Function} [options.setOpen] - 팝업 닫기용 함수 (팝업이 여러개인 경우 onSuccess 에서 처리할 것)
 * @param {boolean} [options.msgYn] - 완료 메시지 사용 여부 (기본값: true)
 * @param {string} [options.message] - 로그인 연장 완료 메시지 (기본값: '연장하였습니다.')
 * @param {Function} [options.onSuccess] - 로그인 연장 성공 후 콜백
 */
export const useRefreshToken = (
    {
        setOpen,
        msgYn = true,
        message = '연장하였습니다.',
        onSuccess,
    } = {}) => {
    const { info, error } = useMsg();
    const setExpireTime = useSetRecoilState(expireAtState);

    const refreshTk = () => {
        AXIOS.post(`/api/v1/common/login/refresh`)
            .then((res) => {
                const expiresAt = res.data;

                setExpireTime(expiresAt); // 만료시간

                if (msgYn) {
                    info(message);
                }

                // 팝업 닫기
                if (typeof setOpen === 'function') {
                    setOpen();
                }

                // 사용자 정의 콜백
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            })
            .catch((err) => {
                error(errorMsg(err));
            });
    }

    return refreshTk;
}