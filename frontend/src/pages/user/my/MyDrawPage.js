/**
 * @file MyDrawPage.js
 * @description 벨리데이션 마이페이지 
 * @author 김정규
 * @since 2025-05-21 15:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-21 15:29    김정규       최초 생성
 **/

import { Button, Flex, Form, Input } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import LoginWrap from '../../common/login/components/LoginWrap';

const MyDrawPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { info, error } = useMsg()
    const [checking, setChecking] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
        } else {
            setChecking(false)
        }
    }, [])

    /**
     * 회원탈퇴
     * @returns 
     */
    const onFinish = async () => {
        setLoading(true)
        const param = {}
        param.reason = form.getFieldValue('reason')
        const loc = window.location.origin
        param.url = loc
        return await AXIOS.post(`/api/v1/common/login/draw/${location.state?.token}`, param)
            .then((resp) => {
                info((<>회원 탈퇴가 정상적으로 처리되었습니다.</>), 3)
                setTimeout(() => navigate(`/main`), 1000)
            })
            .catch((err) => {
                error(err, 3)
                setTimeout(() => setLoading(false), 500)
            })
    }

    return (
        <>
            <LoginWrap title={'회원 탈퇴'} >
                {checking ?
                    <Form
                        onFinish={onFinish}
                        form={form}
                        layout="horizontal"
                    >
                        <Form.Item
                            name="reason"
                        >
                            <Input size="large" placeholder="탈퇴 사유" maxLength={2000} />
                        </Form.Item>
                        <Flex justify='center' align='center' gap={8}>
                            <Button type="primary" htmlType="submit" loading={loading}>탈퇴</Button>
                            <Button onClick={() => navigate(-2)}>취소</Button>
                        </Flex>
                    </Form>
                    : <> 인증 실패 </>
                }
            </LoginWrap >
        </>
    );
}

export default MyDrawPage
