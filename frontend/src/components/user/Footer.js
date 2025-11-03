import { Flex } from 'antd';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { SUInner1440 } from 'styles/StyledUser';
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { IoLogoFacebook } from "react-icons/io5";
import { SFMedia } from 'styles/StyledFuntion';

const Footer = () => {

    return (
        <FooterWrap className='footer-wrap'>
            <FooterBottom>
                <SUInner1440>
                    <div className='ft-top-left'>
                        <Link className='logo'>
                            <img src='/img/logo.png' alt='elorien logo' />
                        </Link>
                        {/* <p className='text'>
                            공간을 바꾸고, 일상을 더 따뜻하게 — <br />
                            창호로 완성하는 삶의 가치.
                        </p> */}
                    </div>
                    <ul className='ft-bottom-menu'>
                        <li><Link to="/terms">이용약관</Link></li>
                        <li><Link to="/reportingcenter">개인정보 처리방침</Link></li>
                        <li><Link to="/emailrefusal">이메일주소무단수집거부</Link></li>
                    </ul>
                    <Flex className='ft-bottom-adrs'>
                        <p> 서울특별시 영등포 선유로70, 우리벤처타운2 901호</p>
                        <p> TEL : 02-2086-1300</p>
                        <p> Fax : 02-2086-1370</p>
                    </Flex>
                    <Flex className='ft-bottom-end'>
                        <p>© 2025 sqnt. All rights reserved.</p>
                        <ul>
                            <li><Link to={'/'}><IoLogoFacebook /></Link></li>
                            <li><Link to={'/'}><FaXTwitter /></Link></li>
                            <li><Link to={'/'}><FaYoutube /></Link></li>
                        </ul>
                    </Flex>
                </SUInner1440>
            </FooterBottom>
        </FooterWrap>
    );
}

export default Footer;


const FooterWrap = styled.div`
    .ft-bottom{
        padding: 48px 0;
        background-color: #F5F5F5;
    }
    /* .ft-top{
        padding-bottom: 48px;
    } */
    .ft-top-left{
        &{min-width: 270px; margin-bottom : 24px}
        .logo{
            display: block;
            width: 94px;
        }
        .text{
            font-size: 16px;
            font-weight: 400;
            margin-top: 32px;
            line-height: ${24 / 16};
            color: var(--color-tertiary);
        }
    }
`;



const FooterBottom = styled.div`
    &{
        background-color: #F5F5F5;
        padding: 48px 0;
        margin-top: 80px;
    }
    .ft-bottom-menu{
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        font-weight: 600;
        font-size: 14px;
        line-height: ${20 / 14};
        color: var(--color-tertiary);
        margin-bottom: 16px;

    }
    .ft-bottom-adrs{
        display: flex;
        flex-wrap: wrap;
        gap: 32px;
        font-size: 14px;
        font-weight: 400;
        line-height: ${20 / 14};
        color: #717680;
        margin-bottom: 32px;
    }
    .ft-bottom-end{
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: space-between;
        color: #717680;
        font-size: 16px;
        font-weight: 400;
    }
    .ft-bottom-end ul {
        display: flex;
        gap: 24px;
        color: #A4A7AE;
        font-size: 24px;
    }
    ${SFMedia('mo-l', css`
        .ft-bottom-adrs,
        .ft-bottom-menu{gap: 16px}
    `)};
`;