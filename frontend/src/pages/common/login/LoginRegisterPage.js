/**
 * @file Register.js
 * @description 로그인 기능 구현 테스트를 위한 페이지 폼
 * @author 김정규
 * @since 2025-04-15 16:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-04-15 16:29    김정규       최초 생성
 **/

import { Button, Flex, Form, Input } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { generateUUID, getPublicKey, isEmptyCheck } from 'utils/helpers';
import { validatePassword } from 'utils/validatePassword';
import LoginWrap from './components/LoginWrap';
import { ElorienIcon } from './StyledLogin';
import { LuArrowLeft } from "react-icons/lu";
import { BtnBackVanigate, LoginIcon } from './StyledLogin';
import { ErrorPage } from '../errorPages';
export const LoginRegisterPage = () => {
    const [readonly, setReadonly] = useState(true);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [Checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const { info, error } = useMsg()
    const [isLoginIdValid, setIsLoginIdValid] = useState(false);
    const loginId = Form.useWatch('loginId', form);
    const passwd = Form.useWatch('passwd', form);
    const location = useLocation();
    const [duplicate, setDuplicate] = useState(false);

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
        } else {
            setChecking(false)
        }
    }, [])

    /**
     * 중복 확인
     * @returns 
     */
    const onclickCheck = async () => {
        setDuplicate(true)
        const id = form.getFieldValue("loginId")

        if (isEmptyCheck(id)) {
            setTimeout(() => setDuplicate(false), 500)
            error('ID 입력 후 눌러주세요', 10)
            return
        }

        return await AXIOS.get(`/api/v1/common/login/check/${id}`)
            .then((res) => {
                setTimeout(() => setReadonly(false), 500)
                info('사용가능한 ID입니다.', 3)
                setTimeout(() => setDuplicate(false), 500)
            })
            .catch((err) => {
                setReadonly(true);
                error(err, 10)
                setTimeout(() => setDuplicate(false), 500)
            })
    }

    /**
     * 회원가입
     * @param {*} 
     * @returns 
     */
    const onFinish = async (values) => {
        setLoading(true)
        const param = form.getFieldsValue()
        const loc = window.location.origin
        param.url = loc
        param.term = location.state?.token
        const sessionid = generateUUID().replace(/-/g, '');
        param.key = sessionid
        const encryptedRawData = await getPublicKey(sessionid, null, values.passwd) // 공개키로 암호화
        param.passwd = encryptedRawData
        param.passwd2 = ""
        return await AXIOS.post(`/api/v1/common/login/register`, param)
            .then((res) => {
                setTimeout(() => setLoading(false), 500)
                setTimeout(() => navigate(`/verify/mail`, { state: { token: 're', email: param.email } }), 1000)
            })
            .catch((err) => {
                error(err, 10)
                setTimeout(() => setLoading(false), 500)
            })
    }

    /**
     * 중복확인버튼 활성화
     */
    useEffect(() => {
        setReadonly(true)
        if (isEmptyCheck(loginId)) {
            setIsLoginIdValid(false);
            return;
        }

        form.validateFields(['loginId'])
            .then(() => setIsLoginIdValid(true))
            .catch(() => setIsLoginIdValid(false));
    }, [loginId]);

    return (
        <LoginWrap
            checking={true}
            title={'회원가입'}
            description={'간편하게 시작하세요, 지금 바로 회원가입!'}
            icon={<ElorienIcon />}
        >
            {Checking ?
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                >
                    {/* id 메일주소, 전화번호 등등 입력 - 메일발송 / 토큰인증시 회원가입 */}
                    <Form.Item
                        label="ID"
                        name="loginId"
                        rules={[
                            { required: true, message: '아이디를 입력해주세요' },
                            {
                                pattern: /^[A-Za-z0-9]{6,}$/,
                                message: '아이디는 6자리 이상 영문자와 숫자만 입력 가능합니다',
                            },
                        ]}
                    >
                        <Input
                            label="Password"
                            placeholder="아이디"
                            maxLength={20}
                            autoComplete={"username"}
                            suffix={
                                <Button
                                    type="primary"
                                    size="small"
                                    loading={duplicate}
                                    onClick={onclickCheck}
                                    disabled={!isLoginIdValid}
                                >
                                    중복 확인
                                </Button>
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        name="passwd"
                        label="Password"
                        dependencies={['loginId', 'name']}
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요' },
                            {
                                validator: (_, value) => (
                                    validatePassword(value, {
                                        loginId: form.getFieldValue('loginId'),
                                        name: form.getFieldValue('name'),
                                    }))
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="비밀번호" maxLength={20} autoComplete={"new-password"} />
                    </Form.Item>
                    <Form.Item
                        name="passwd2"
                        label="Confirm password"
                        dependencies={['passwd']}
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요' },
                            {
                                validator: (_, value) => {
                                    if (value !== passwd) {
                                        return Promise.reject('비밀번호가 다릅니다');
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="비밀번호 확인" maxLength={20} autoComplete={"new-password"} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Nickname"
                        rules={[
                            { required: true, message: '닉네임을 입력해주세요' },
                            {
                                pattern: /^[A-Za-z가-힣0-9]+$/,
                                message: '닉네임은 한글과 영문자, 숫자만 사용할 수 있습니다',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="닉네임" maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요' },
                            {
                                pattern: /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/,
                                message: '이메일 주소 형식이 올바르지 않습니다',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="이메일" />
                    </Form.Item>
                    <Form.Item
                        label="전화번호"
                        name="phone"
                        rules={[
                            { required: true, message: '전화번호을 입력해주세요' },
                            {
                                pattern: /^(010)\d{8}$/,
                                message: '전화번호 형식이 올바르지 않습니다',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="전화번호" maxLength={11} />
                    </Form.Item>
                    <Button type="primary" size="large" className='btn-login' htmlType="submit" disabled={readonly} loading={loading}>
                        회원가입
                    </Button>
                    <BtnBackVanigate onClick={() => navigate(`/main`)}><LuArrowLeft /> 취소</BtnBackVanigate>
                </Form>
                : <ErrorPage />
            }

        </LoginWrap >
    );
}

export default LoginRegisterPage

