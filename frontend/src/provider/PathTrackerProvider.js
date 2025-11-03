/**
 * @file PathTrackerProvider.js
 * @description url 변경 감지
 * @author 이병은
 * @since 2025-05-28 10:48
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 10:48    이병은       최초 생성
 **/

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pathStorage } from 'utils/pathStorage';

const PathTrackerProvider = ({ children }) => {
    const location = useLocation();

    const excludedPath = ['verify', 'login'];

    useEffect(() => {
        const currentPath = location.pathname;
        const { currPath } = pathStorage.getPath();
        
        const isExcluded = excludedPath.some(keyword => currPath.includes(keyword));

        if (!currPath) {
            sessionStorage.setItem('prevPath', '');
        } else if (currPath !== currentPath) {
            sessionStorage.setItem('prevPath', !isExcluded ? currPath : '/');
        }

        sessionStorage.setItem('currPath', currentPath);
    }, [location.pathname, location.key])


    return <>{children}</>;

}
export default PathTrackerProvider