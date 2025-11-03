/**
 * @file LoginSendMailPage.js
 * @description 로그인 메일 발송 확인
 * @author 김정규
 * @since 2025-06-18 11:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-18 11:29    김정규       최초 생성
 **/
import { Form } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuMail } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorPage } from '../errorPages';
import LoginWrap from './components/LoginWrap';
import * as S from './StyledLogin';

export const LoginSendMailPage = () => {
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [description, setDescription] = useState(false);

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
            const { token, email } = location.state
            if (token === 'pw') {
                setDescription(<>비밀번호 재설정 링크가 포함된 메일이 발송되었습니다.<br />비밀번호 재설정 링크의 유효 시간은 1시간입니다.</>)
            } else if (token === 're') {
                setDescription(<><b style={{ color: ' var(--color-primary-5)' }}>{email}</b> 주소로 회원가입 확인이 포함된<br />메일이 발송되었습니다.<br />링크의 유효 시간은 1시간입니다.</>)
            } else if (token === 'id') {
                setDescription(<>입력하신 이메일로 아이디 정보가 발송되었습니다.</>)
            }
        } else {
            setChecking(false)
        }
    }, [])

    return (
        <S.CompletionSection className='login-completion'>
            <LoginWrap
                checking={checking}
                title={<>이메일을 확인하세요.</>}
                description={description}
                icon={<S.LoginIcon><LuMail /> </S.LoginIcon>}
            >
                {checking ?
                    <S.BtnBackVanigate onClick={() => navigate('/main')}>
                        <LuArrowLeft />  로그인 화면으로 돌아가기
                    </S.BtnBackVanigate>
                    : <ErrorPage />
                }
            </LoginWrap>
        </S.CompletionSection>
    );
}

export default LoginSendMailPage
