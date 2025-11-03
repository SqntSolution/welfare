import { Empty } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const NoAuthPage = ({ msg = "권한이 없습니다.", desc }) => {
    return (
        <Empty
            image='/img/iconInfoCircle.svg'
            styles={{ image: { height: 60, } }}
            description={
                <span>
                    <div>{msg} </div>
                    <div>{desc}</div>
                </span>
            }
        >
        </Empty>
    )
}

export const HasNoAdminAuthPage = ({ msg = "관리자 권한이 없습니다.", desc }) => {
    return (
        <Empty
            image='/img/iconInfoCircle.svg'
            styles={{ image: { height: 60, } }}
            description={
                <span>
                    <div>{msg} </div>
                    <div>{desc}</div>
                </span>
            }
        >
        </Empty>
    )
}

export const LoginErrorPage = ({ msg = "로그인에 실패했습니다.", desc }) => {
    return (
        <Empty
            image='/img/error.svg'
            styles={{ image: { height: 60, } }}
            description={
                <div>
                    <div>{msg} </div>
                    <div>{desc}</div>
                </div>
            }
        >
        </Empty>
    )
}

export const ErrorPage = ({ msg = "에러가 발생했습니다.", desc }) => {
    const navigate = useNavigate()
    return (
        // <StyledEmpty
        //     image='/img/error.png'
        //     styles={{ image: { height: 325, } }}
        //     description={
        //         <div className='text-box'>
        //             <Typography.Title level={2}>{msg} </Typography.Title>
        //             {
        //                 desc != null ? (
        //                     <Typography.Title level={3}>{desc} </Typography.Title>
        //                 ) : (
        //                     null
        //                 )
        //             }
        //             <Button icon={<HomeOutlined />} type="primary" danger size={'large'} style={{ borderRadius: 0, marginTop: 24 }}
        //                 onClick={() => window.location.href = "/"}
        //             >{desc ?? ''} 홈 </Button>
        //         </div>
        //     }
        // >
        // </StyledEmpty>
        <StyledEmpty>


        </StyledEmpty>
    )
}

// const StyledEmpty = styled(Empty)`
//     &.ant-empty{
//         background: rgba(248, 248, 248, 1);
//         height: 100vh;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         flex-wrap: wrap;
//         align-content: center;
//     }
//     &.ant-empty .ant-empty-description{width:100%}
//    .ant-typography{margin:0;  font-size: 30px;}
// `;
const StyledEmpty = styled.div`
    &{
        background: url(/img/sample/error.png) center center no-repeat;
        background-size: cover;
        height: 100vh;

    }
`;


