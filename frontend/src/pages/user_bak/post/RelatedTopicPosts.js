// POST게시물 한건
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { CustomTitle, ErrorMsg } from 'components/common/CustomComps'
import { PostItemSmall2 } from 'components/page_bak/PostItemSmall2'


// Related Post
export const RelatedTopicPosts = ({ posts }) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {
                (posts?.length ?? 0) == 0 ? (
                    null
                ) : (
                    <Row style={{
                        width: '100%',
                        backgroundColor: 'white',
                        marginTop: 44
                    }} gutter={[24, 24]}
                    >
                        <CustomTitle title='Related Post' />
                        {
                            posts?.map((elem, idx) => {
                                return (
                                    <Col span={24} key={idx} >
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
