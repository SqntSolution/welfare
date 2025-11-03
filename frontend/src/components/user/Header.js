import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Flex, Popover } from 'antd';
import { deviceInfoState } from 'atoms/atom';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';
import { LoginTimer } from './LoginTimer';
import Menu from './Menu';
import { useUserInfo } from 'hooks/useUserInfo';
import { SComLinkBtn } from 'styles/StyledCommon';
import { LoginPage } from "pages/common/login/LoginPage";
import { useLogout, useRefreshToken } from "hooks/loginHelperHook";
import AutoCompleteInput from './AutoCompleteInput';
import LangButton from './LangButton';
import { FiUser } from "react-icons/fi";
import { LuUserCog } from "react-icons/lu";
import { BsClockHistory } from "react-icons/bs";
import { useExpireContext } from 'provider/ExpireTimeProvider';
import { useMenuContext } from 'provider/MenuProvider';
import { useHasNewPostAuth } from 'hooks/helperHook';

export const Header = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    const loginInfo = useUserInfo();
    const deviceInfo = useRecoilValue(deviceInfoState);
    const [open, setOpen] = useState(false);
    // 로그아웃 훅
    const logout = useLogout({
        setOpen: setOpen,
    });
    // 토근 연장 훅
    const refreshTk = useRefreshToken({
        setOpen: setOpen,
    });
    const { isTiemerActive } = useExpireContext();
    const { recommendedKeyword } = useMenuContext();
    const hasAuth = useHasNewPostAuth();


    /**
     * 로그아웃
     * @returns 
     */
    const onClickLogout = async () => {
        logout();
    }

    /**
     * 토큰 연장
     * @returns 
     */
    const refreshToken = async () => {
        refreshTk();
    }

    // 스크롤 이벤트
    // let scrollY;
    const scrollYRef = useRef(0);
    const [scrollDirection, setScrollDirection] = useState('');
    const scrollUp = 'up', scrollDown = 'down';

    const [isMobileState, setIsMobileState] = useState(window.innerWidth < 1281);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1280;
            setIsMobileState(prev => {
                if (isMobile !== prev) {
                    return isMobile;
                }
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const headerHandler = (e) => {
        if (window.scrollY > scrollYRef.current) {
            setScrollDirection(scrollDown)
        } else {
            setScrollDirection(scrollUp)
        }
        if (window.scrollY < 100) {
            setScrollDirection('');
        }
        setOpen(false);
        scrollYRef.current = window.scrollY;
    }

    useEffect(() => {
        window.addEventListener('scroll', headerHandler);
        return () => (
            window.removeEventListener('scroll', headerHandler)
        )
    }, [])

    const handleOpenChange = newOpen => {
        setOpen(newOpen);
    };

    /**
     * @name addEventListener
     * @description 관리자 화면에서 SWITCH_USER 를 진행 할경우 새로 고침 할 수 있도록 받아주는 listener
     * @author 정상철
     * @since 2025-06-09 10:21
     * 
     * @param {*} v 
     * @returns 
     */

    window.addEventListener("storage", (event) => {
        if (event.key === "SWITCH_USER") {
            window.location.reload();
        }
    });

    /* 로그인, 로그아웃, 로그인연장, 관리자, 프로필 */
    const PopoverContents = () => {
        return (
            <div>
                {(loginInfo.id === 'visitor' || loginInfo.role === 'ROLE_VISITOR') ? (
                    <HeaderLoginInner>
                        <LoginPage setOpen={setOpen} isPopover={true} />
                    </HeaderLoginInner>
                ) : (
                    <HeaderUtilities wrap gap={8}>
                        <div className='loginInfo-box'>
                            <Badge >
                                <Avatar icon={<UserOutlined />} src={loginInfo?.avatarImgPath ? `/api/v1/view/image/${loginInfo?.avatarImgPath}` : null} />
                            </Badge>
                            <Flex gap={4} wrap align='center' justify={'space-between'}>
                                <span className='loginInfo-name'>{loginInfo.name}</span>
                                <Flex gap={4}>
                                    {isTiemerActive &&
                                        <>
                                            <LoginTimer />
                                            <Button size='small' color='primary' onClick={refreshToken} >로그인 연장</Button>
                                        </>
                                    }
                                    <Button size='small' color='primary' onClick={() => navigate(`/my/profile`)} >Mypage</Button>
                                    {hasAuth() && <Button size='small' style={{ color: 'var(--color-white)', backgroundColor: 'var(--color-red-6)' }} onClick={() => navigate(`/post/new`)} >+ Post</Button>}
                                </Flex>
                            </Flex>
                        </div>
                        <Flex gap={4} className='btn-box'>
                            <Button size='small' variant="solid" style={{ color: 'var(--color-white)', backgroundColor: 'var(--color-text-base)' }} onClick={onClickLogout} >Logout</Button>
                            {['ROLE_MASTER', 'ROLE_OPERATOR'].includes(loginInfo.role) &&
                                <SComLinkBtn SComLinkBtn
                                    height="small"
                                    to="/admin"
                                    color="purple"
                                    variant={'solid'}
                                    target="_blank"
                                >
                                    Admin
                                </SComLinkBtn>}
                        </Flex>

                    </HeaderUtilities>
                )
                }
            </div >
        )
    }




    return (
        <HeaderWrap className={`${scrollDirection} header`}>
            {/* 로고 누르면 메인으로 갑니다. */}
            <Flex className='header-inner' justify={'space-between'} align='center' >
                <h1 className='logo'><Link to="/"><img src='/img/logo.png' alt='elorien logo' /></Link></h1>
                {!isMobileState ? (
                    <>
                        <Menu scrollDirection={scrollDirection} isMobile={isMobileState} />
                        <Flex gap={16} className='header-right' align='center'>
                            {/* 검색 박스 */}
                            <HeaderSearchInner className='search-inner'>
                                <AutoCompleteInput recommendedKeywords={recommendedKeyword} />
                            </HeaderSearchInner>
                            {/* 다국어 */}
                            <LangButton />
                            {/* 로그인, 로그아웃, 로그인연장, 관리자, 프로필 */}
                            <Popover
                                content={<PopoverContents />}
                                open={open}
                                onOpenChange={handleOpenChange}
                                trigger="click"
                            >
                                <button className='hearder-etc-btn'>
                                    {(loginInfo.name == null || loginInfo.id === 'visitor') ? <FiUser /> : <LuUserCog />}
                                </button>
                            </Popover>
                        </Flex>
                    </>
                ) : null}
            </Flex>
            {/* // 모바일 */}
            {isMobileState ? (
                <>
                    <MoHeaderUtilities wrap className='mo-utilities-inner'>
                        <AutoCompleteInput recommendedKeywords={recommendedKeyword} />
                        <Flex gap={4} wrap align='center' justify={'space-between'} className='utilit-bottom'>

                            {(loginInfo.name == null || loginInfo.id === 'visitor') ? (
                                // 로그인 전
                                <>
                                    <SComLinkBtn to="/login" color='primary' variant="solid" height="small" className='btn'>로그인</SComLinkBtn>
                                </>
                            ) : (
                                //로그인 후
                                <>
                                    {isTiemerActive &&
                                        <Flex gap={8} align='center' style={{ marginRight: 'auto' }} className='loginTimer-inner'>
                                            <span className='timer-icon'><BsClockHistory /></span>
                                            <LoginTimer />
                                            <Button size='small' color='primary' onClick={refreshToken} >로그인 연장</Button>
                                        </Flex>
                                    }

                                    <Flex gap={8} align='center'>
                                        {hasAuth() && <Button size='small' style={{ color: 'var(--color-white)', backgroundColor: 'var(--color-red-6)' }} onClick={() => navigate(`/post/new`)} >+ Post</Button>}
                                        <Button size='small' onClick={() => navigate(`/my/profile`)} >Mypage</Button>
                                        <Button size='small' style={{ color: 'var(--color-white)', backgroundColor: 'var(--color-text-base)' }} variant="solid" onClick={onClickLogout} >Logout</Button>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                    </MoHeaderUtilities>
                    <LangButton />
                    <Menu scrollDirection={scrollDirection} isMobile={isMobileState} />
                </>
            ) : null
            }
        </HeaderWrap>
    );
}

const fontSize = {
    pc: 16
}
const HeaderWrap = styled(Flex)`
    --header-height : 80px;
    &{
        font-size: ${fontSize.pc}px;
        width: 100%;
        min-height: var(--header-height);
        position: fixed; top:0; left: 0;
        background-color: rgba(255,255,255,0.3);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 100;
        transition: all 0s ease-in-out;
        border-bottom: 1px solid rgb(119 119 119 / 12%);
    }
    .logo{
        display: block;
        min-width: 94px;
        width: 94px;
        transition: all 0.3s ease-in-out;
    }
    .header-inner{
        max-width: 1760px;
        width: 100%;
        padding: 0 32px;
        margin: 0 auto;
    }
    .header-inner > *:not(.menu,.menu-btn){
        position: relative;
        z-index: 5;
    }
    &.up {
        transition-duration : 1s;
    }
    &.down {
        top: -100%;
        transition-duration : 1s;
    }
    &:has(.act.menu){
        background-color: #fff;
        transition-duration : 0s !important;
        .header-right{
            .ant-input-outlined{
                border-color:#ddd;
            }
        }
    }

    .hearder-etc-btn{
        ${SFFlexCenter};
        font-size : 20px;
        &:hover{
            color: var(--color-primary);
        }
    }
    .mo-utilities-inner{display: none}
      /* 반응형 */    
      ${SFMedia('pc-m', css`
        .header-right{
            gap: 8px !important;
        }


    `)}
    ${SFMedia('tab-l', css` 
        --header-height : 72px;
        &{
            align-items: flex-start;
            padding: 16px;
            flex-wrap: wrap;
            padding:20px 0 0 0 ;
            height: var(--header-height);
            overflow: hidden;
        }
        .header-inner{
            padding: 0 16px;
        }
        .header-right{
            display: none;
        }
        /* act */
        &:has(.act.menu){
            height: auto;
            .mo-utilities-inner{display: flex}
        }
    `)}
   

 
`;
// 헤더 로그인  외 등등등
const HeaderUtilities = styled(Flex)`
    max-width: 260px;
    
    & > * {
        width: 100%;
    }
  
   
    .loginInfo-box{
        display: flex;
        align-items: center;
        gap: 8px
    }
    .loginInfo-name{
        display: flex;
    }
    .ant-divider-vertical{
        border-color : #ddd
    }
    .btn-box{
        & > * {
            width: 100%;
            flex:  1 1;
        }
    }

    
`;
// 검색박스
const HeaderSearchInner = styled.div`
    .ant-select-single{height: 40px}
    .ant-input-outlined{
        background-color: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.3);
    }

    ${SFMedia('pc-m', css`
        .ant-select-single .ant-select-selector{
            width: 180px;
        }
        .ant-input-affix-wrapper >input.ant-input{font-size :14px}
        .input-icon{
            font-size: 16px;
        }
        .ant-select-single{height: 36px}
        && .ant-input-affix-wrapper:not(:last-child){
            height: 36px;
        }

    `)}
  
`;
// 모바일 유틸 스타일
const MoHeaderUtilities = styled(Flex)`
    &{
        width: 100%;
        padding: 0 16px 8px;
        margin-top: 8px;
        gap: 16px;
    }
    .ant-select-auto-complete{
        width: 100%;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        font-size: 12px;
    }
    .utilit-bottom{
        width: 100%;
        justify-content: end;
    }
    & + .lang-btn-inner{
        position: absolute;
        top:28px;
        right: 60px;
    }
    
    .loginTimer-inner{
        font-size: 13px;
        .timer-icon{
            font-size: 18px;
            display: inline-flex;
            align-items: center;
        }
        .loginTimer-seconds{
            width: 32px;
            line-height: 1;
        }
    }
    ${SFMedia('mo-m', css`
        .ant-select-auto-complete,
        .ant-input-search-large .ant-input-affix-wrapper{
            height: ${40 / mediaWidth['mo-m'] * 100}vw;
            min-height: 30px;
        }
       .ant-input-affix-wrapper-lg {
        font-size: minmax( 13px ,${16 / mediaWidth['mo-m'] * 100}vw);
       }
    `)}
`;

const HeaderLoginInner = styled.div`
    .ant-card{
        border: 0;
        min-height: 0;
    }
    .ant-card-body{
        padding: 0;
    }
    .login-main-page{
        padding-right: 0;
    }
    .login{
        width: ${SFEm(250)};
        min-height: 0;
    }
    .ant-card{min-height: 0}
    .title {
        font-size: ${SFEm(24)};
        display: none;
    }
    .ant-form-item{
        margin-bottom: 8px;
    }
    .ant-form-item .ant-form-item-control-input{
        min-height: 0;
    }
    .ant-form-item .ant-form-item-control-input-content{
        height: ${SFEm(36)};
    }
    .ant-checkbox-wrapper{
        margin: 4px 0;
        width: 100%;
        justify-content: flex-end;
    }
    .ant-input,
    .ant-input-affix-wrapper >input.ant-input{
        font-size: ${SFEm(14)};
    }
    
    button[type=submit].btn-login{
        font-size: ${SFEm(14)};
        margin-top: 0;
        height: ${SFEm(34, 14)};
    }
    .login-authOptions{
        a{ font-size: ${SFEm(12)};}
    }
    .snsCon-inner{
        &{
            padding: 0 50px;
            margin-top: 8px;
        }
        button {
            width: 33.3333%;
        }
    }

    .login-main-page::after{
        display: none;
    }
    .login-main-page {
        &{
            font-size: ${SFEm(12)};
        }
        .login-header{
            display: none;
        }
        .ant-form,.login-sns-inner{
            width: 100%;
        }
        .login-auth-options{
            gap: 2px !important;
        }
        .login-sns-inner{
            font-size: ${SFEm(12)};
        }
    }
    .ant-checkbox-label,.ant-form-item .ant-form-item-label >label{
        font-size: ${SFEm(14)};
    }
    .login-main-page .login-auth-options{
        font-size: ${SFEm(12)};
        gap: ${SFEm(8, 12)} !important;
    }
    
`;