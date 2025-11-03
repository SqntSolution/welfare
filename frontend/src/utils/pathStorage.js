/**
 * @file pathStorage.js
 * @description 경로저장 유틸
 * @author 이병은
 * @since 2025-05-28 11:18
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 11:18    이병은       최초 생성
 **/

const STORAGE_KEYS = {
    curr: 'currPath',
    prev: 'prevPath',
};

export const pathStorage = {
    /**
     * 현재 경로 저장
     * @param {string} path
     */
    setCurrPath(path) {
        sessionStorage.setItem(STORAGE_KEYS.curr, path);
    },

    /**
     * 이전 경로 저장
     * @param {string} path
     */
    setPrevPath(path) {
        sessionStorage.setItem(STORAGE_KEYS.prev, path);
    },

    /**
     * 현재/이전 경로 가져오기
     * @param {boolean} log
     * @returns {{ currPath: string, prevPath: string }}
     */
    getPath() {
        const curr = sessionStorage.getItem(STORAGE_KEYS.curr) || '';
        const prev = sessionStorage.getItem(STORAGE_KEYS.prev) || '';
        if (process.env.NODE_ENV === 'development') {
            console.log('[Path] prev:', prev, '→ curr:', curr);
        }
        return { currPath: curr, prevPath: prev };
    },

    /**
     * 저장소 초기화
     */
    reset() {
        sessionStorage.removeItem(STORAGE_KEYS.curr);
        sessionStorage.removeItem(STORAGE_KEYS.prev);
    },
};