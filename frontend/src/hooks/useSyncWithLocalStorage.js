import { loginUser, minutesState, secondsState } from 'atoms/atom';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

export const useSyncWithLocalStorage = () => {
    const [minutes, setMinutes] = useRecoilState(minutesState);
    const [seconds, setSeconds] = useRecoilState(secondsState);
    const [theLoginUser, setTheLoginUser] = useRecoilState(loginUser)

    // 페이지 로드 시 localStorage에서 상태를 불러옴
    useEffect(() => {
        const savedMinutes = localStorage.getItem('minutes');
        const savedSeconds = localStorage.getItem('seconds');

        if (savedMinutes) setMinutes(parseInt(savedMinutes));
        if (savedSeconds) setSeconds(parseInt(savedSeconds));
    }, [setMinutes, setSeconds]);

    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            setTimeout(() => setTheLoginUser({}), 1000) //userInfo 초기화
        }

        localStorage.setItem('minutes', minutes);
        localStorage.setItem('seconds', seconds);

    }, [minutes, seconds]); // `minutes`와 `seconds` 상태가 변경될 때마다 localStorage 업데이트

};

