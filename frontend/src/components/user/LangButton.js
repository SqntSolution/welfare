/**
 * @file LangButton.js
 * @description 다국어 선택 박스
 * @author 김단아
 * @since 2025-05-28 16:16
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-28 16:16    김단아       최초 생성
 **/

import { Divider, Flex } from 'antd';
import styled, { css } from 'styled-components';
import { SFMedia } from 'styles/StyledFuntion';

const LangButton = () => {
    return (
        <></>
        // <LangBtnInner justify={'space-between'} align="center" className='lang-btn-inner'>
        //     <button>KR</button>
        //     <Divider type="vertical" />
        //     <button>EN</button>
        // </LangBtnInner>
    )
}
export default LangButton;
const LangBtnInner = styled(Flex)`
   
    color: #181D27;
    padding-top: 2px;
    align-items: center;

    button {
        font-weight: 600;
        line-height: 1;
        
    }
    .ant-divider-vertical{
        border-color : #000
    }

    ${SFMedia('pc-m', css`
        button{
            font-size: 14px;
            font-weight: 400;
        }
    `)}
    @media screen and (min-width: 1025px){
        button:hover{color: var(--color-primary);;}
    }
`;