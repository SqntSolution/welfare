// Page인 메뉴에 대해서, Page 내용
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { BreadcrumbRow } from 'components/page/BreadcrumbRow'
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { PostMetaRow } from './PostMetaRow'
import { DynamicAreaForView } from './DynamicAreaForView'
import { useCopy, useMsg } from 'hooks/helperHook';
import { useHasEditAuth } from 'hooks/helperHook'
import { InnerDiv } from 'styles/StyledCommon';
import styled from 'styled-components';
import { EyeOutlined, HeartFilled, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { SubpageBanner } from 'components/page/SubpageBanner'
import { Submenu } from 'pages/user/submain/Submenu'
import { useUserInfo } from 'hooks/useUserInfo'

export const PagePage = () => {
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const [postId, setPostId] = useState()
    const { menu1, menu2 } = useParams();
    const [postInfo, setPostInfo] = useState() // Post 기본정보
    const [postDetails, setPostDetails] = useState([]) // Post 상세정보

    const [metas, setMetas] = useState([]) // nation, 주제, tag
    const [relatedPosts, setRelatedPosts] = useState([]) // 동일 주제 게시물들
    const navigate = useNavigate()
    const { error, info } = useMsg()
    const user = useUserInfo()
    const role = user?.role

    // 운영자나 마스터만 가능함.
    const hasEditAuth = (role == 'ROLE_OPERATOR' || role == 'ROLE_MASTER')


    useEffect(() => {
        if (menu2 != null) {
            getPostInfo()
        }
    }, [menu1, menu2])

    // Post 기본정보 조회 
    const getPostInfo = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/page/info/${menu1}/${menu2}`)
            .then((resp) => {
                const data = resp?.data
                if (data?.id == null) {
                    // 아직 만들지 않은 상태
                    setPostInfo({})
                    setPostDetails([])
                    return
                }
                // console.log("=== 1차 menus : ", data)
                setPostInfo(data)
                // if (data?.menu1Id != null) {
                //     setMenu1({ id: data?.menu1Id, name: data?.menuName1, path: data?.menuEngName1 })
                // }
                // if (data?.menu2Id != null) {
                //     setMenu2({ id: data?.menu2Id, name: data?.menuName2, path: data?.menuEngName2 })
                // }
                // 추가 정보들 조회
                getPostDetails(data?.id)
                getMetas(data?.id)
            })
            .catch((err) => {
                setPostInfo({})
                console.log('=== getPostInfo 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // Post 상세(pdf, editor등) 조회 
    const getPostDetails = (postId) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/page/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setPostDetails(data)
            })
            .catch((err) => {
                setPostDetails([])
                console.log('=== getPostDetails 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
            })
            .finally(() => setLoading(false));
    };


    // 메타(nation,주제,tag)들 조회
    const getMetas = (postId) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/meta/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setMetas(data)
            })
            .catch((err) => {
                setMetas(null)
                console.log('=== getComments 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
            })
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ width: '100%' }}>
            <SubpageBanner />
            <InnerDiv>
                <Submenu />
                <Row justify='center' gutter={[0, 0]} >
                    <BreadcrumbRow menu1={{ id: postInfo?.menu1Id, name: postInfo?.menuName1, path: postInfo?.menuEngName1 }}
                        menu2={{ id: postInfo?.menu2Id, name: postInfo?.menuName2, path: postInfo?.menuEngName2 }} />
                    <Col span={24} style={{ padding: '0px 4px' }}>
                        <div style={{ background: '#FAFAFA', marginBottom: 24, padding: '16px 24px', }}>
                            <PostMetaRow nations={metas?.nations} topics={metas?.topics}
                                strategicMarketingOnly={postInfo?.strategicMarketingOnly} postInfo={postInfo} isPost={false} />
                            {/* title, description, tag */}
                            <Row style={{ width: '100%', padding: '6px 0', margin: '16px 0' }} gutter={[0, 0]} >
                                <Col span={22} style={{ fontSize: 24, fontWeight: '700', lineHeight: '32px' }}>
                                    {postInfo?.title}
                                </Col>
                                <Col span={2} align='right'>
                                    {<>
                                        {
                                            hasEditAuth ? (
                                                <Button onClick={() => navigate(`/main/${menu1}/${menu2}/edit`)} style={{ background: '#fff;' }} >수정</Button>
                                            ) : (
                                                null
                                            )
                                        }
                                    </>
                                    }
                                </Col>
                                <Col span={22} style={{ marginTop: 8, fontSize: 14, color: '#8C8C8C', lineHeight: '22px', }}>
                                    {postInfo?.description}
                                </Col>
                                {/* <Col span={22} style={{marginTop:8, fontSize:14,color:'#FF7A45',lineHeight:'22px'}}>
                                {
                                    metas?.tags?.map(e => (
                                        <> #{e?.value} </>
                                    ))
                                }
                            </Col> */}
                                <Col span={24}>
                                    {/* <StyledIconBoxFlex justify={'flex-end'} align={'center'} gap="small">
                                <Flex align={'center'} gap="small">
                                    <EyeOutlined />
                                    <span className='text'>{postInfo?.viewCnt ?? 0} </span>
                                </Flex>
                                <Divider type="vertical" />
                                <Flex align={'center'} gap="small">
                                    <StyledIconButton >
                                        {postInfo?.likes ? (<HeartFilled />) : (<HeartOutlined />) }
                                    </StyledIconButton>
                                    <span className='text'>{postInfo?.likesCnt ?? 0} </span>
                                </Flex>
                                <Divider type="vertical" />
                                <Flex align={'center'} gap="small">
                                    <StyledIconButton >
                                        <ShareAltOutlined /> 
                                    </StyledIconButton>
                                    <span className='text'>{postInfo?.shareCnt ?? 0} </span>
                                </Flex>
                            </StyledIconBoxFlex> */}

                                </Col>
                            </Row>
                        </div>

                        {/* dynamic area */}
                        <StyledEditorRow >
                            <Col span={24}>
                                <DynamicAreaForView postDetails={postDetails} />
                            </Col>
                        </StyledEditorRow>

                    </Col>


                    {/* <Col span={24}>
                    <BottomRow />
                </Col> */}

                </Row>
            </InnerDiv>
        </div>
    )
}

// const StyledIconButton = styled(Button)`
//     border:0;
// `;

// const StyledIconBoxFlex = styled(Flex)`
//     font-size: 14px;
//     color:rgba(0, 0, 0, 0.45);
//     &&& svg{width: 14px;height: 14px;}
//     .text{font-size: 14px; line-height: 22px;}
//     &&& .ant-btn-default{padding:0;margin:0;}
//     .anticon{color:rgba(0, 0, 0, 0.45);}
//     &&& .ant-btn-default {background: transparent;}
// `;

const StyledEditorRow = styled(Row)`
.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border:0;}
`;