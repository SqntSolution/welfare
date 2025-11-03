// POST게시물 한건
import { useEffect, useState } from 'react';
import { App, Button, Row, Col } from 'antd';
import { AXIOS } from 'utils/axios';
import { useNavigate, useParams } from "react-router-dom";
import { PostMetaRow } from './PostMetaRow';
import { RelatedTopicPosts } from './RelatedTopicPosts';
import { PostRightSide_statistic } from './PostRightSide_statistic';
import { PostRightSide_file } from './PostRightSide_file';
import { useHasEditAuth } from 'hooks/helperHook';
import { useMsg, useGetMenus } from 'hooks/helperHook';
import { SUInner1440, SUWrap } from 'styles/StyledUser';
import { DynamicAreaForView } from './DynamicAreaForView';

export const PostPage = () => {
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const { postId } = useParams();
    const [menu1, setMenu1] = useState()
    const [menu2, setMenu2] = useState()
    const [postInfo, setPostInfo] = useState() // Post 기본정보
    const [postDetails, setPostDetails] = useState([]) // Post 상세정보
    const [files, setFiles] = useState([]) // 첨부파일
    const [canFileDownload, setCanFileDownload] = useState(false) // 첨부파일

    const [metas, setMetas] = useState([]) // nation, 주제, tag
    const [relatedPosts, setRelatedPosts] = useState([]) // 동일 주제 게시물들
    const navigate = useNavigate()
    const { error, info } = useMsg()

    const hasEditAuth = useHasEditAuth()
    // const [top, setTop] = useState(0);
    const [smartFinderUrl, setSmartFinderUrl] = useState("/")
    const menus = useGetMenus()

    useEffect(() => {
        // console.log("=== menus : ", menus)
        const path = menus?.find(e => e.contentType == 'smartfinder')?.menuEngNm
        if (path != null) {
            setSmartFinderUrl(`${path}`)
        }
    }, [menus])


    useEffect(() => {
        getPostInfo()

    }, [postId])

    // Post 기본정보 조회 
    const getPostInfo = (justPostInfo) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/info/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setPostInfo(data)
                if (data?.menu1Id != null) {
                    setMenu1({ id: data?.menu1Id, name: data?.menuName1, path: data?.menuEngName1 })
                }
                if (data?.menu2Id != null) {
                    setMenu2({ id: data?.menu2Id, name: data?.menuName2, path: data?.menuEngName2 })
                }
                // 추가 정보들 조회
                if (justPostInfo !== true) {
                    getPostDetails()
                    if (data?.canFileDownload === true) {
                        setCanFileDownload(true)
                        getFiles()
                    }
                    getMetas()
                    getRelatedTopicPosts()
                }
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
    const getPostDetails = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setPostDetails(data ?? []);
            })
            .catch((err) => {
                setPostDetails([])
                console.log('=== getPostDetails 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
            })
            .finally(() => setLoading(false));
    };

    // 첨부파일 조회
    const getFiles = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/file/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setFiles(data)
            })
            .catch((err) => {
                setFiles([])
                console.log('=== getFiles 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
            })
            .finally(() => setLoading(false));
    };



    // 메타(nation,주제,tag)들 조회
    const getMetas = () => {
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

    // 동일한 주제의 Posts들 조회
    const getRelatedTopicPosts = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/related-topic/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== 1차 menus : ", data)
                setRelatedPosts(data)
            })
            .catch((err) => {
                setRelatedPosts([])
                console.log('=== getRelatedTopicPosts 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
            })
            .finally(() => setLoading(false));
    };



    return (
        <SUInner1440>
            <Row justify='center' gutter={[20, 20]}>
                <Row gutter={[20, 20]}>

                    <Col span={17}>
                        <div>
                            {/* 왼쪽편  */}
                            <PostMetaRow nations={metas?.nations} topics={metas?.topics}
                                strategicMarketingOnly={postInfo?.strategicMarketingOnly} postInfo={postInfo} />

                            <Row  >
                                <Col span={22} >
                                    {postInfo?.title}
                                </Col>
                                <Col span={2} align='right'>
                                    {<>
                                        {
                                            hasEditAuth(menu1, menu2) ? (
                                                <Button onClick={() => navigate(`/post/edit/${postId}`)} size='small'>수정</Button>
                                            ) : (
                                                null
                                            )
                                        }
                                    </>
                                    }
                                </Col>
                                <Col span={22} >{postInfo?.description} </Col>
                                <Col span={22} >
                                    {
                                        metas?.tags?.map(e => (
                                            <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/main/${smartFinderUrl}?tag=${e?.value}`)}> #{e?.value} </span>
                                        ))
                                    }
                                </Col>
                            </Row>
                        </div>

                        {/* dynamic area */}
                        <Row style={{ width: '100%' }} >
                            <Col span={24}>
                                <DynamicAreaForView postDetails={postDetails} />
                            </Col>
                        </Row>


                        {/* Related Post */}
                        <Row >
                            <Col span={24}>
                                <RelatedTopicPosts posts={relatedPosts} />
                            </Col>
                        </Row>


                    </Col>

                    <Col span={7}>
                        {/* 오른쪽  */}
                        <div>
                            <PostRightSide_statistic postInfo={postInfo} refreshPostInfo={() => getPostInfo(true)} />
                            {
                                canFileDownload ? (
                                    <PostRightSide_file files={files} />
                                ) : null

                            }
                        </div>


                    </Col>
                </Row>

            </Row>
        </SUInner1440>
    )
}

