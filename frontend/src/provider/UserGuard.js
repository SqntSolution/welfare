import { useLocation, useNavigate } from 'react-router-dom';
import { useUserInfo } from 'hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { useLoginCheck } from './LoginCheckProvider';
import LoadingSpinner from 'components/common/LoadingSpinner';

export const UserGuard = ({ children }) => {
    const location = useLocation();
    const userInfo = useUserInfo();
    const [loginCheck, setLoginCheck] = useState('loading');
    const navigate = useNavigate();
    const { isInitialCheckComplete, isLoading: loginCheckLoading } = useLoginCheck();

    // 초기 로그인 체크가 완료된 후에만 사용자 상태 확인
    useEffect(() => {
        if (!isInitialCheckComplete) {
            return; // 초기 체크가 완료되지 않았으면 대기
        }

        if (userInfo.id === undefined || userInfo.id === 'visitor' || userInfo.role === 'ROLE_VISITOR') {
            setLoginCheck('before');
        } else {
            setLoginCheck('ok');
        }
    }, [isInitialCheckComplete, userInfo.id, userInfo.role]);

    // 로그인 체크 결과에 따른 리다이렉트
    useEffect(() => {
        if (loginCheck === 'before') {
            navigate('/login', { replace: true });
        }
    }, [loginCheck, navigate, location.pathname]);

    // 로그인 체크가 진행 중이거나 완료되지 않았으면 로딩 표시
    if (loginCheckLoading || !isInitialCheckComplete || loginCheck === 'loading') {
        return <LoadingSpinner loading={true} />;
    }

    // 로그인된 사용자만 접근 허용
    if (loginCheck === 'ok') {
        return <>{children}</>;
    }

    return null;
};