import styled, { css } from "styled-components";
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from "styles/StyledFuntion";

export const LoginInner = styled.div`
    &{
        font-size: 16px;
    }
    
    .login-header{
        text-align: center;
        margin-bottom: ${SFEm(32)};
        padding-top: ${SFEm(48)};
    }
    .icon {
        margin:0 auto  ${SFEm(24)};
        text-align: center;
    }
    .description{
        font-size: ${SFEm(16)};
        color: #535862;
        line-height: ${24 / 16};
        margin-top: ${SFEm(12)};
        font-weight: 400;
    }
    .ant-form{
        font-size: ${SFEm(16)};
        width: ${SFEm(360)};
        margin: 0 auto;
    }
    .ant-form-item{
        margin-bottom: ${SFEm(20)};
    }
    .btn-login{
        width: 100%;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &,[class |= ant],.ant-form-item label{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
    .ant-btn{
        height: ${SFEm(40)};
    }
`)};
`;

export const ElorienIcon = () => {
    return (
        <div className="icon">
            <img src="../img/icon/elorien-icon.png" alt="" />
        </div>
    )
}

export const LoginIcon = ({ children }) => {
    return (
        <IconStyle>
            {children}
        </IconStyle>
    )
}

const IconStyle = styled.div`
    width: ${SFEm(56, 24)};
    aspect-ratio: 1 / 1;
    border: 1px solid #D5D7DA;
    box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
    border-radius: ${SFEm(12, 24)};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${SFEm(24)};
    margin: 0 auto;
    ${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
`)};
`;

export const BtnBackVanigate = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${SFEm(16)} auto 0;
    min-height: ${SFEm(44)};
    color: #535862;
    font-size: ${SFEm(16)};
    font-weight: 600;
    gap: ${SFEm(8)};

    svg{
        color: #A4A7AE;
    }
`;


export const CompletionSection = styled.section`
    &{
        padding: ${SFEm(96)} 0;
    }
`;