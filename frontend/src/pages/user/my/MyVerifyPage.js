/**
 * @file MyVerifyPage.js
 * @description 벨리데이션 마이페이지 
 * @author 김정규
 * @since 2025-05-08 15:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-08 15:29    김정규       최초 생성
 **/

import { Button, Form, Input } from 'antd';
import { passwordVerifiedState } from 'atoms/atom';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { AXIOS } from 'utils/axios';
import { generateUUID, getPublicKey } from 'utils/helpers';
import { pathStorage } from 'utils/pathStorage';
import LoginWrap from '../../common/login/components/LoginWrap';
import { useUserInfo } from 'hooks/useUserInfo'

export const MyVerifyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { info, error } = useMsg()
    const userInfo = useUserInfo()
    const [form] = Form.useForm();
    const [verifiedPw, setVerifiedPw] = useRecoilState(passwordVerifiedState);
    const { prevPath } = pathStorage.getPath();
    const [loading, setLoading] = useState(true);

    /**
     * 이메일 발송한 토큰 인증
     * @returns 
     */
    const onFinish = async (values) => {
        const param = {}
        const sessionid = generateUUID().replace(/-/g, '');
        param.si = sessionid
        const encryptedRawData = await getPublicKey(sessionid, null, values.passwd) // 공개키로 암호화
        param.rd = encryptedRawData
        return await AXIOS.post(`/api/v1/common/login/authenticatePassword`, param)
            .then((res) => {
                const data = res?.data;
                setVerifiedPw(data);
            })
            .catch((err) => {
                error(err, 3)
            });
    }

    /**
     * 비밀번호 변경
     */
    const newPw = async () => {
        const param = { ...userInfo, userId: userInfo.id };
        return await AXIOS.post(`/api/v1/common/login/new-pw`, param)
            .then((resp) => {
                const link = resp?.data
                navigate(`${link}`);
            })
            .catch((err) => {
                navigate('/main');
            })
    }

    useEffect(() => {
        if (verifiedPw === true) {
            navigate(!prevPath.startsWith('/my') ? '/my/profile' : prevPath, { replace: true, });
        } else if (verifiedPw === false) {
            newPw()
        } else {
            setLoading(false);
        }
    }, [verifiedPw])

    return (
        <>
            {!loading && <LoginWrap title={'비밀번호 확인'} >
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="horizontal"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="passwd"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
                    >
                        <Input.Password size="large" placeholder="비밀번호" autoComplete="" />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary" size="large" block > 인증 </Button>
                    </Form.Item>
                </Form>
            </LoginWrap>}
        </>
    );
}

export default MyVerifyPage
