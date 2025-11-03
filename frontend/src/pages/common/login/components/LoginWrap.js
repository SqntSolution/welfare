import * as S from '../StyledLogin';
import { SUSectionText, SUText30 } from 'styles/StyledUser';

const LoginWrap = ({ children, checking, title, description, icon }) => {

    return (
        <S.LoginInner className='login'>
            <div className='login-header'>
                {checking && <>
                    {icon !== null && <div className='icon'>{icon}</div>}
                    {title !== null && <SUText30 className='title' >{title}</SUText30>}
                    {description !== null && <SUSectionText className='description'>{description}</SUSectionText>}
                </>}
            </div>
            {children}
        </S.LoginInner>
    );
}

export default LoginWrap;
