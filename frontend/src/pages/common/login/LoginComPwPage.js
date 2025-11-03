/**
 * @file LoginComPwPage.js
 * @description 비밀번호 확인 완료
 * @author 김정규
 * @since 2025-06-18 11:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-18 11:29    김정규       최초 생성
 **/

import { Button, Form } from 'antd';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuCircleCheck } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import LoginWrap from './components/LoginWrap';
import { BtnBackVanigate, LoginIcon } from './StyledLogin';
import { ErrorPage } from '../errorPages';

export const LoginComPwPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
        } else {
            setChecking(false)
        }
    }, [])

    const onFinish = () => {
        navigate('/main')
    }

    return (
        <LoginWrap 
            checking={checking}
            title={'비밀번호변경 완료'}
            description={<>비밀번호가 성공적으로 재설정되었습니다.<br />로그인하려면 아래를 클릭하세요.</>}
            icon={<LoginIcon><LuCircleCheck /> </LoginIcon>}
        >
            {checking ?
                <Form
                    onFinish={onFinish}
                >
                    <Button type="primary" size="large" className='btn-login' htmlType="submit" loading={loading} >
                        확인
                    </Button>
                    <BtnBackVanigate onClick={() => navigate('/main')}>
                        <LuArrowLeft />  로그인 화면으로 돌아가기
                    </BtnBackVanigate>
                </Form>
                : <ErrorPage />
            }
        </LoginWrap>
    );
}

export default LoginComPwPage
