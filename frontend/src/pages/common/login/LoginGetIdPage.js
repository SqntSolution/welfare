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

import { Descriptions, Flex, Space } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import LoginWrap from './components/LoginWrap';
import { isEmptyCheck } from 'utils/helpers';
import { LuKey, LuArrowLeft } from "react-icons/lu";
import { BtnBackVanigate, LoginIcon } from './StyledLogin';
import { ElorienIcon } from './StyledLogin';
import styled from 'styled-components';
import { SFEm } from 'styles/StyledFuntion';
import { ErrorPage } from '../errorPages';

export const LoginGetIdPage = () => {
    const [checking, setChecking] = useState(false);
    const location = useLocation();
    const { info, error } = useMsg();
    const [data, setData] = useState([]);

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
                const resp = res.data
                setData(resp)
            })
            .catch((err) => {
                error(err, 3);
            });
    }

    const socialIcons = {
        naver: "/img/icon/btnG_아이콘사각.png",
        google: "/img/icon/web_light_rd_na@4x.png",
        kakao: "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
    };

    return (
        <LoginWrap
            checking={checking}
            title={'회원님의 아이디'}
            description={'회원님의 아이디 정보 입니다.'}
            icon={<ElorienIcon />}
        >
            {checking ?
                <LoginGetId>
                    <Descriptions colon={false}  >
                        {data.map((item, index) => (
                            <Descriptions.Item label={`회원ID ${index + 1}`} span={3} key={index}>
                                <Space>
                                    <div>
                                        {item.loginId}
                                    </div>
                                    {socialIcons[item.socialType] && (
                                        <img
                                            src={socialIcons[item.socialType]}
                                            alt={item.socialType}
                                            style={{ maxWidth: '43px', maxHeight: '43px' }}
                                        />
                                    )}
                                </Space>
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                    <Flex justify='center' align='center' gap={8} style={{ marginTop: '1vw' }} >
                        <Link to={'/main'} variant="solid" color="primary" className='btn'>로그인</Link>
                        <Link to={'/login/pw'} className='btn'>비밀번호 찾기</Link>
                    </Flex>
                </LoginGetId>
                : <ErrorPage />
            }
        </LoginWrap>
    );
}

export default LoginGetIdPage;

const LoginGetId = styled.div`
    max-width: ${SFEm(360)};
    width: 95%;
    margin: 0 auto;


    .ant-descriptions-item-label{
        min-width: ${SFEm(60, 14)};
    }

    .ant-descriptions .ant-descriptions-item-container{
        align-items: center;
        height: ${SFEm(40, 14)};
        border-radius: ${SFEm(8)};
        border: 1px solid #E9EAEB;
        overflow: hidden;
        padding:0 ${SFEm(16)};
        box-sizing: border-box;
    }

`;