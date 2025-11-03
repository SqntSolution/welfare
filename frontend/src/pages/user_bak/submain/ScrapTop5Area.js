// sub main 페이지 (1차, 2차 메뉴가 다 있는)
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { PostItemSmall2 } from 'components/page/PostItemSmall2'
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { useMsg } from 'hooks/helperHook';
import { CustomTitle } from 'components/common/CustomComps';



// scrap top 5 목록
export const ScrapTop5Area = () => {
    const { menu1, menu2 } = useParams();
    // const menu1Id = getMenuIdFromPath(menu1)
    // let menu2Id = 0
    // if (menu2 != null) {
    //     menu2Id = getMenuIdFromPath(menu1, menu2)
    // }
    // console.log("=== scrap ", menu1, menu2,)
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([])
    const { error, info } = useMsg()

    useEffect(() => {
        getScraps()
    }, [location.pathname])

    const getScraps = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/user/sub/posts/scrap/${menu1}${menu2 == null ? '' : '/' + menu2}`)
            .then((resp) => {
                setPosts(resp?.data ?? [])
            })
            .catch((err) => {
                console.log('=== getScraps 에러 : ', err?.response);
                // message.error(errorMsg(err), 3);
                error(err)
            })
            .finally(() => setLoading(false));
    }

    return (
        <>
            {
                (posts?.length ?? 0) == 0 ? (
                    null
                ) : (
                    <Row style={{
                        width: '100%',
                        backgroundColor: 'white',
                        border: 0
                    }} gutter={[24, 24]}
                    >
                        <CustomTitle title='Scrap Top5' />

                        {
                            posts?.map((elem, idx) => {
                                return (
                                    <Col span={24} key={idx}>
                                        <PostItemSmall2 {...elem} ></PostItemSmall2>
                                    </Col>
                                )
                            })
                        }
                    </Row>

                )
            }
        </>
    )
}

