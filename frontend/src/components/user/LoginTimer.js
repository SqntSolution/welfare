import { useRecoilValue } from 'recoil';
import { secondsState } from 'atoms/atom';
import styled from 'styled-components';
import { useExpireContext } from 'provider/ExpireTimeProvider';

export const LoginTimer = () => {
    const seconds = useRecoilValue(secondsState);
    const { isTiemerActive } = useExpireContext();

    const secondsToMMSS = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <>
            {
                isTiemerActive &&
                <SecondsBox className='loginTimer-seconds'>
                    {seconds ? <span>{`${secondsToMMSS(seconds)}`}</span> : `00:00`}
                </SecondsBox>
            }
        </>
    );
};

export default LoginTimer;


const SecondsBox = styled.div`
    width: 38px;
    text-align: center;
    display: inline-flex;
`;