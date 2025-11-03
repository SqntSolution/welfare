// New Posts 목록
import { useEffect, useState } from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { PostItemBig } from 'components/page/PostItemBig';
import { AXIOS } from 'utils/axios';
import styled from 'styled-components';
import { useMsg } from 'hooks/helperHook';
import { SUMoreButton } from 'styles/StyledUser';

export const PostRowTemplate = (props) => {
    const apiUrl = props?.apiUrl
    const title = props?.title
    const btnFunc = props?.btnFunc
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const stylePadding = props?.style;
    const { error, info } = useMsg()
    // const navigate = useNavigate();

    // console.log("=== btnFun", typeof btnFunc, btnFunc)
    useEffect(() => {
        getMonthlyTopViewPosts()
    }, [])

    const getMonthlyTopViewPosts = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(apiUrl)
            .then((resp) => {
                setPosts(resp?.data ?? [])
            })
            .catch((err) => {
                setPosts([])
                console.log('=== getNewPosts 에러 : ', err?.response);
                error(err)
            })
            .finally(() => setLoading(false));
    };


    const titleStle = {
        lheight: 'auto',
        fontSize: '30px',
        fontWeight: '700',
        lineHeight: '40px',
        marginTop: '0px',
        marginBottom: '20px',
        padding: '0px',
    }

    return (
        <div style={{ padding: `${stylePadding ? '0 0 72px' : '72px 0'} ` }}>
            <Row justify='center' align='middle' gutter={24} key='100'>
                <Col flex="auto" align="left"><Typography.Title level={2} style={titleStle}>{title}</Typography.Title></Col>
                <SUMoreButton onClick={() => btnFunc()} />
            </Row>

            <Row justify='left' align='middle' gutter={[24, 24]} key='200'>
                {
                    posts?.map((elem, idx) => {
                        return (
                            <Col span={6} key={idx} >
                                <PostItemBig {...elem} key={idx}></PostItemBig>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
    )
}






const StyleMOreButton = styled(Button)`
    width: 79px;
    height: 30px;
    border-radius: 2px; 
    border: 1px solid #D9D9D9;
    padding: 4px 10px; 
    color: #262626;
    font-size: 14px;
    font-width:400;
    line-height: 1;
`;