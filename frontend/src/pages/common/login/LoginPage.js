import { Button, Checkbox, Divider, Flex, Form, Input, Spin } from 'antd';
import { refreshUserInfo, deviceInfoState } from 'atoms/atom';
import { useUserInfo } from 'hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AXIOS } from 'utils/axios';
import { generateUUID, getPublicKey } from 'utils/helpers';
import LoginWrap from './components/LoginWrap';
import { useMsg } from 'hooks/helperHook';
import { pathStorage } from 'utils/pathStorage';
import styled, { css } from 'styled-components';
import * as S from './StyledLogin';
import { SFEm, SFMedia } from 'styles/StyledFuntion';
import { useLoginCheck } from 'provider/LoginCheckProvider';
import { LuCircleCheck } from 'react-icons/lu';

export const LoginPage = (props) => {
    const { setOpen, isPopover = false } = props
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); //로딩
    const navigate = useNavigate();
    const { info, error } = useMsg();
    const setTheRefreshUserInfo = useSetRecoilState(refreshUserInfo);
    const userInfo = useUserInfo()
    const deviceInfo = useRecoilValue(deviceInfoState);
    const { isInitialCheckComplete } = useLoginCheck();

    useEffect(() => {
        // popover 모드가 아닐 때만 자동 리다이렉트 실행
        if (!isPopover && userInfo.id && userInfo.id !== 'visitor' && userInfo.role !== 'ROLE_VISITOR' && isInitialCheckComplete) {
            // 이미 로그인된 사용자인 경우, 적절한 페이지로 리다이렉트
            const { prevPath, currPath } = pathStorage.getPath();
            const redirectPath = deviceInfo.device !== 'pc' ? prevPath : currPath;
            const excludedPath = ['verify', 'login'];
            const isExcluded = excludedPath.some(keyword => redirectPath.includes(keyword));
            const path = isExcluded ? '/main' : redirectPath;

            // 약간의 지연 후 리다이렉트 (사용자가 상태를 인지할 수 있도록)
            setTimeout(() => {
                navigate(path, { replace: true });
            }, 2000);
        }
    }, [userInfo.id, userInfo.role, navigate, deviceInfo.device, isInitialCheckComplete, isPopover])

    /**
     * 로그인
     * @param {*} values 
     * @returns 
     */
    const onFinish = async (values) => {
        setLoading(true)
        const sessionid = generateUUID().replace(/-/g, '')
        const encryptedRawData = await getPublicKey(sessionid, values.userId, values.passwd) // 공개키로 암호화

        return await AXIOS.post(`/api/v1/common/login/login`, { si: sessionid, rd: encryptedRawData, rememberMe: values.rememberMe })
            .then(async (res) => {
                // 팝업이 있다면 팝업부터 닫기
                if (setOpen) {
                    setOpen(false);
                }
                setTheRefreshUserInfo(old => old + 1);

                // popover 모드가 아닐 때만 페이지 이동
                if (!isPopover) {
                    const { prevPath, currPath } = pathStorage.getPath();
                    const redirectPath = deviceInfo.device !== 'pc' ? prevPath : currPath;
                    const excludedPath = ['verify', 'login'];
                    const isExcluded = excludedPath.some(keyword => redirectPath.includes(keyword));
                    const path = isExcluded ? '/main' : redirectPath
                    navigate(path, { replace: true });
                }

                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    }

    /**
    * kakao 로그인
    * @param {*} values 
    * @returns 
    */
    const kakaoLogin = async () => {
        await AXIOS.get(`/api/v1/common/kakao/url`)
            .then((res) => {
                const data = res?.data;
                window.location.href = data?.url;  // 백엔드에서 받은 URL로 이동
            }).catch((err) => {
                error(err, 10);
            })
    };

    /**
     * naver 로그인
     */
    const naverLogin = async () => {
        await AXIOS.get(`/api/v1/common/naver/url`)
            .then((res) => {
                const data = res?.data;
                window.location.href = data?.url;  // 백엔드에서 받은 URL로 이동
            }).catch((err) => {
                error(err, 10);
            })
    };

    /**
     * google 로그인
     */
    const googleLogin = async () => {
        await AXIOS.get(`/api/v1/common/google/url`)
            .then((res) => {
                const data = res?.data;
                window.location.href = data?.url;  // 백엔드에서 받은 URL로 이동
            }).catch((err) => {
                error(err, 10);
            })
    };


    return (
        <Spin spinning={loading || !isInitialCheckComplete}>
            <LoginMainPgae className='login-main-page'>
                {userInfo.rold === 'ROLE_VISITOR' || userInfo.id === 'visitor' ?
                    <LoginWrap
                        checking={true}
                        title={'로그인'} description={'등록하신 이름, 이메일로 아이디를 찾을 수 있습니다.'} icon={<S.ElorienIcon />}>

                        <div className='login-inner'>
                            <Form
                                onFinish={onFinish}
                                form={form}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="userId"
                                    label="ID"
                                    rules={[{ required: true, message: '아이디를 입력해주세요' }]}
                                >
                                    <Input size="large" placeholder="아이디" />
                                </Form.Item>
                                <Form.Item
                                    name="passwd"
                                    label="Password"
                                    rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
                                >
                                    <Input.Password size="large" placeholder="비밀번호" autoComplete="" />
                                </Form.Item>

                                <Form.Item name="rememberMe" valuePropName="checked" >
                                    <Checkbox>자동 로그인</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button htmlType="submit" type="primary" size="large" block className='btn-login' >로그인</Button>
                                </Form.Item>
                            </Form>

                            <Flex justify='center' align='center' gap={24} className='login-auth-options'>
                                <NavLink to="/login/pw">비밀번호 찾기</NavLink>
                                <NavLink to="/login/id">아이디 찾기</NavLink>
                                <NavLink to="/login/te">회원가입</NavLink>
                            </Flex>

                            <div justify='center' className='login-sns-inner'>
                                <Flex justify='center' align='center' gap={8} >
                                    <Divider />
                                    <span>OR</span>
                                    <Divider />
                                </Flex>
                                <button onClick={kakaoLogin}>
                                    <img
                                        src="/img/icon/login-kakaotalk.png"
                                        alt="kakao-login"
                                    />
                                </button>
                                <button onClick={naverLogin}>
                                    <img
                                        src="/img/icon/login-naver.png"
                                        alt="naver-login"
                                    />
                                </button>
                                <button onClick={googleLogin}>
                                    <img
                                        src="/img/icon/login-google.png"
                                        alt="google-login"
                                    />
                                </button>
                            </div>
                        </div>
                    </LoginWrap>
                    :
                    <LoginWrapCustom  >
                        <LoginWrap
                            checking={true}
                            title={`${userInfo.name || '사용자'}님, 환영합니다!`}
                            description={'잠시 후 자동으로 이동합니다...'}
                            icon={<S.LoginIcon style={{ color: '#52c41a', fontSize: '48px' }}> <LuCircleCheck /> </S.LoginIcon>}
                        >
                            <div className='login-inner' style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => {
                                        const { prevPath, currPath } = pathStorage.getPath();
                                        const redirectPath = deviceInfo.device !== 'pc' ? prevPath : currPath;
                                        const excludedPath = ['verify', 'login'];
                                        const isExcluded = excludedPath.some(keyword => redirectPath.includes(keyword));
                                        const path = isExcluded ? '/main' : redirectPath;
                                        navigate(path, { replace: true });
                                    }}
                                >
                                    메인으로 이동
                                </Button>
                            </div>
                        </LoginWrap>
                    </LoginWrapCustom>
                }
            </LoginMainPgae>
        </Spin >
    )
};

const LoginMainPgae = styled.div`
    &{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        padding-right: 50%;
    }
    & > *{flex: 1 1;}
    &::after{
        content: '';
        display: block;
        width: 50%;
        height: 100%;
        min-height:calc( 100% + 80px);
        background: url(/img/sample/login-bg.png) top center no-repeat;
        background-size: cover;
        position: absolute;
        top:0;
        right: 0;
    }
    .login-inner{
        margin: 0 auto;
    }
    .login-sns-inner{
        width: ${SFEm(360)};
        margin: 0 auto;
        overflow: hidden;
        .ant-flex{
            width: 100%;
        }
        button + button{
            margin-top: ${SFEm(10)};
        }
    }
${SFMedia('tab-s', css`
    &{padding-right:0}
    .icon{
        width: ${SFEm(80)};
    }
    &::after{
        display: none;
    }
    .login-sns-inner button{
        height: ${SFEm(40)};
        width: 100%;
        
    }
`)};
`;

const LoginWrapCustom = styled.div.attrs({ className: 'login-wrap-custom' })`
    min-height: calc(100vh - 440px);
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
`;
