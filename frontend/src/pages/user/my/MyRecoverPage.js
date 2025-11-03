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

import { Button, Flex, Form } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import LoginWrap from '../../common/login/components/LoginWrap';

export const MyRecoverPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { info, error } = useMsg()
    const [checking, setChecking] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { menu1, menu2, id, upid, token } = useParams();

    useEffect(() => {
        if (location.state?.token) {
            setChecking(true)
        } else {
            setChecking(false)
        }
    }, [])

    /**
     * 회원복구
     * @returns 
     */
    const onFinish = async () => {
        setLoading(true)
        const param = {}
        const loc = window.location.origin
        param.url = loc
        param.jwtId = location.state?.token
        param.userId = id

        return await AXIOS.post(`/api/v1/common/login/recover`, param)
            .then((resp) => {
                info((<>복구가 정상적으로 처리되었습니다.</>), 3)
                setTimeout(() => navigate(`/main`), 1000)
            })
            .catch((err) => {
                error(err, 3)
                setTimeout(() => setLoading(false), 500)
            })
    }

    return (
        <>
            <LoginWrap title={'회원 복구'} >
                {checking ?
                    <Form
                        onFinish={onFinish}
                        form={form}
                        layout="horizontal"
                    >
                        <>복구하시겠습니까?</>
                        <Flex justify='center' align='center' gap={8}>
                            <Button type="primary" htmlType="submit" loading={loading}>복구</Button>
                            <Button onClick={() => navigate(-2)}>취소</Button>
                        </Flex>
                    </Form>
                    : <> 인증 실패 </>
                }
            </LoginWrap >
        </>
    );
}

export default MyRecoverPage
