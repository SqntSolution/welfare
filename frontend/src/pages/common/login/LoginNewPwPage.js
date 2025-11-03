/**
 * @file FindPw.js
 * @description 로그인 기능 구현 테스트를 위한 페이지 폼
 * @author 김정규
 * @since 2025-04-18 15:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-04-18 15:29    김정규       최초 생성
 **/

import { Button, Flex, Form, Input } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { generateUUID, getPublicKey } from 'utils/helpers';
import { validatePassword } from 'utils/validatePassword';
import LoginWrap from './components/LoginWrap';
import { LuKey, LuArrowLeft } from "react-icons/lu";
import { BtnBackVanigate, LoginIcon } from './StyledLogin';
import { ErrorPage } from '../errorPages';

export const LoginNewPwPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { info, error } = useMsg();
    const passwd = Form.useWatch('passwd', form);
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
     * 새 비밀번호 설정
     * @returns 
     */
    const onFinishPw = async (values) => {
        setLoading(true)
        const param = {}
        const loc = window.location.href
        param.url = loc
        const sessionid = generateUUID().replace(/-/g, '');
        param.key = sessionid
        const encryptedRawData = await getPublicKey(sessionid, null, values.passwd) // 공개키로 암호화
        param.passwd = encryptedRawData

        return await AXIOS.post(`/api/v1/common/login/set-pw/${location.state?.token}`, param)
            .then((res) => {
                setTimeout(() => setLoading(false), 500)
                setTimeout(() => navigate(`${location.pathname}/com`, { state: { token: location.state?.token } }), 1000)
            })
            .catch((err) => {
                error(err, 3);
                setTimeout(() => setLoading(false), 500)
            })
    }

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

    return (
        <LoginWrap
            checking={checking}
            title={'비밀번호 재설정'}
            description={'기존비밀번호와 다르게 입력해주세요.'}
            icon={<LoginIcon><LuKey /></LoginIcon>}
        >
            {checking ?
                <Form
                    onFinish={onFinishPw}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="passwd"
                        dependencies={['userId', 'name']}
                        label="Password"
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요' },
                            {
                                validator: (_, value) => (
                                    validatePassword(value, {
                                        userId: userId,
                                        name: name,
                                    }))
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="새 비밀번호" maxLength={20} autoComplete={"new-password"} />
                    </Form.Item>
                    <Form.Item
                        name="passwd2"
                        dependencies={['passwd']}
                        label="Confirm password"
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
                    <Button type="primary" size="large" className='btn-login' htmlType="submit" loading={loading} >
                        확인
                    </Button>
                    <BtnBackVanigate onClick={() => navigate(-2)}>
                        <LuArrowLeft />  취소
                    </BtnBackVanigate>
                </Form>
                : <ErrorPage />
            }
        </LoginWrap>
    );
}

export default LoginNewPwPage
