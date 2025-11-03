/**
 * @file FindId.js
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
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import LoginWrap from './components/LoginWrap';
import { LuKey, LuArrowLeft } from "react-icons/lu";
import { BtnBackVanigate, LoginIcon } from './StyledLogin';

export const LoginFindIdPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { info, error } = useMsg();

    /**
     * 아이디 찾기
     * @param {*} 
     * @returns 
     */
    const onFinish = async () => {
        setLoading(true)
        const param = form.getFieldsValue()
        const loc = window.location.origin
        param.url = loc

        return await AXIOS.post(`/api/v1/common/login/find-id`, param)
            .then((res) => {
                setTimeout(() => setLoading(false), 500)
                setTimeout(() => navigate(`/verify/mail`, { state: { token: 'id' } }), 1000)
            })
            .catch((err) => {
                error(err, 3);
                setTimeout(() => setLoading(false), 500)
            })
    }

    return (
        <LoginWrap
            checking={true}
            title={'아이디 찾기'}
            description={'등록하신 이름, 이메일로 아이디를 찾을 수 있습니다.'} icon={<LoginIcon><LuKey /></LoginIcon>}
        >
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
            >
                {/* 메일주소입력, 전화번호입력 - 메일발송 / 토큰인증시 id 제공 */}
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: '이름을 입력해주세요' }]}
                >
                    <Input size="large" placeholder="이름" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: '이메일을 입력해주세요' }]}
                >
                    <Input size="large" placeholder="이메일" />
                </Form.Item>
                <Button type="primary" size="large" htmlType="submit" loading={loading} className='btn-login'>
                    아이디 찾기
                </Button>
                <BtnBackVanigate onClick={() => navigate(-1)}>
                    <LuArrowLeft />  취소
                </BtnBackVanigate>
            </Form>
        </LoginWrap>
    );
}

export default LoginFindIdPage
