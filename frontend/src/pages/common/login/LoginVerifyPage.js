/**
 * @file LoginVerifyPage.js
 * @description 로그인 통합 처리
 * @author 김정규
 * @since 2025-04-18 15:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-04-18 15:29    김정규       최초 생성
 **/

import LoadingSpinner from 'components/common/LoadingSpinner';
import { useMsg } from 'hooks/helperHook';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { isEmptyCheck } from 'utils/helpers';
import qs from 'qs';

export const LoginVerifyPage = () => {
    const navigate = useNavigate();
    const { info, error } = useMsg();
    const location = useLocation();
    const { token, id } = qs.parse(location.search, { ignoreQueryPrefix: true });
    // const { token } = useParams();
    // const params = new URLSearchParams(location.search);
    // const id = params.get("id"); 
    // const token = params.get("token");

    useEffect(() => {
        onClickToken()
    }, [])

    /**
     * 이메일 발송한 토큰 인증
     * @returns 
     */
    const onClickToken = async () => {
        const param = {}
        if (!isEmptyCheck(id)) {
            param.jwtId = token
            param.userId = id
        }

        return await AXIOS.post(`/api/v1/common/login/verify/${token}`, param)
            .then((res) => {
                const data = res.data
                let msg = '';
                let url = '';
                switch (data) {
                    case 'id':
                        msg = '로그인 하거나 비밀번호를 찾으세요.'
                        url = '/verify/id'
                        break;
                    case 'pw':
                        msg = '새 비밀번호를 지정하세요.'
                        url = '/verify/pw'
                        break;
                    case 're':
                        msg = '회원가입이 완료되었습니다.'
                        url = '/verify/re/com'
                        break;
                    case 'de':
                        msg = '회원탈퇴 입니다.'
                        url = '/verify/draw'
                        break;
                    case 'rc':
                        msg = '회원복구 입니다.'
                        url = `/verify/draw/${id}`
                        break;
                    default:
                        msg = ''
                        url = '/main'
                        break;
                }
                setTimeout(() => navigate(`${url}`, { replace: true, state: { token: token } }), 1000)
            })
            .catch((err) => {
                error(err, 3);
                setTimeout(() => navigate(`/main`), 2000)
            });
    }

    return <LoadingSpinner loading={true} />;
}

export default LoginVerifyPage
