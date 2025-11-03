import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';
import { ErrorPage } from 'pages/common/errorPages';
import { useUserInfo } from 'hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { useLoginCheck } from './LoginCheckProvider';
import LoadingSpinner from 'components/common/LoadingSpinner';

export const AdminGuard = ({ children }) => {
    const userInfo = useUserInfo();
    const [adminCheck, setAdminCheck] = useState("loading");
    const { isInitialCheckComplete, isLoading: loginCheckLoading } = useLoginCheck();

    // 초기 로그인 체크가 완료된 후에만 관리자 권한 확인
    useEffect(() => {
        if (!isInitialCheckComplete) {
            return; // 초기 체크가 완료되지 않았으면 대기
        }

        // 로그인하지 않은 사용자
        if (!userInfo?.id || userInfo.role === 'ROLE_VISITOR') {
            setAdminCheck("before");
            return;
        }

        // 관리자 권한 확인
        if (userInfo.role === "ROLE_MASTER" || userInfo.role === "ROLE_OPERATOR") {
            setAdminCheck("ok");
        } else {
            setAdminCheck("ng");
        }
    }, [isInitialCheckComplete, userInfo.id, userInfo.role]);

    // 로그인 체크가 진행 중이거나 완료되지 않았으면 로딩 표시
    if (loginCheckLoading || !isInitialCheckComplete || adminCheck === 'loading') {
        return <LoadingSpinner loading={true} />;
    }

    if (adminCheck !== 'ok') {
        return <ErrorPage msg="페이지가 존재하지 않습니다." />;
    }

    return children;
}