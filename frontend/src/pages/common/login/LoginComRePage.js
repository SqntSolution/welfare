/**
 * @file LoginComRePage.js
 * @description 회원가입 확인 완료
 * @author 김정규
 * @since 2025-06-18 11:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-18 11:29    김정규       최초 생성
 **/

import { Button, Form } from 'antd';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuHeart } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import LoginWrap from './components/LoginWrap';
import * as S from './StyledLogin';
import { ErrorPage } from '../errorPages';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';

export const LoginComRePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const { info, error } = useMsg()
    const location = useLocation();
    const [userId, setUserId] = useState(false);
    const [name, setName] = useState(false);

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
            getId()
        } else {
            setChecking(false)
        }
    }, [])

    /**
     * 토큰으로 조회
     * @returns 
     */
    const getId = async () => {
        return await AXIOS.get(`/api/v1/common/login/find/${location.state?.token}`)
            .then((res) => {
                const data = res?.data
                setUserId(data[0]?.userId)
                setName(data[0]?.name)
            })
            .catch((err) => {
                error(err, 3);
            });
    }

    const onFinish = () => {
        navigate('/main')
    }

    return (
        <S.CompletionSection>
            <LoginWrap
                checking={checking}
                title={<>{name}님, 환영해요!</>}
                description={<>가입이 완료되었습니다.</>}
                icon={<S.LoginIcon><LuHeart /> </S.LoginIcon>}
            >
                {checking ?
                    <Form
                        onFinish={onFinish}
                    >
                        <Button type="primary" size="large" className='btn-login' htmlType="submit" loading={loading} >
                            확인
                        </Button>
                        <S.BtnBackVanigate onClick={() => navigate('/main')}>
                            <LuArrowLeft />  로그인 화면으로 돌아가기
                        </S.BtnBackVanigate>
                    </Form>
                    : <ErrorPage />
                }
            </LoginWrap>
        </S.CompletionSection>
    );
}

export default LoginComRePage
