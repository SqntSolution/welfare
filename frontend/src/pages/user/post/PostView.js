/**
 * @file PostView.js
 * @description 포스트 상세페이지
 * @author 이병은
 * @since 2025-07-04 13:38
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-07-04 13:38    이병은       최초 생성
 **/
// POST게시물 한건
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { AXIOS } from 'utils/axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHasEditAuth } from 'hooks/helperHook';
import { useMsg, useGetMenus } from 'hooks/helperHook';
import { SUInner1280 } from 'styles/StyledUser';
import { HomeOutlined } from '@ant-design/icons';
import { SalesPostPage } from 'pages/user/post/comps/SalesPostPage';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { PostPage } from 'pages/user/post/comps/PostPage';
import { PhotoPostPage } from 'pages/user/post/comps/PhotoPostPage';
import { PostMetaRow } from './comps/PostMetaRow';
import { isEmptyCheck } from 'utils/helpers';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { debugSEO, updatePostSEO } from 'utils/seo';

export const PostView = () => {
    const [loading, setLoading] = useState(false);
    const { postId } = useParams();
    const [menu1, setMenu1] = useState();
    const [menu2, setMenu2] = useState();
    const [postInfo, setPostInfo] = useState(); // Post 기본정보
    const [postDetails, setPostDetails] = useState([]); // Post 상세정보
    const [canFileDownload, setCanFileDownload] = useState(false); // 첨부파일
    const [columnInfo, setColumnInfo] = useState([]);
    const [metaDesc, setMetaDesc] = useState([]); // 메타 정보 설명

    const [metas, setMetas] = useState([]); // nation, 주제, tag
    const [relatedPosts, setRelatedPosts] = useState([]); // 동일 주제 게시물들
    const navigate = useNavigate();
    const { error, info } = useMsg();

    const hasEditAuth = useHasEditAuth();
    // const [top, setTop] = useState(0);
    const menus = useGetMenus();

    // metaDesc 계산 로직
    useEffect(() => {
        if (postInfo?.metaInfoItems && columnInfo.length > 0) {
            const metaInfos = columnInfo.map(item => {
                let meta = {
                    key: item.key,
                    label: item.label,
                    children: <b>{postInfo.metaInfoItems[item.key]}</b>,
                };
                if (item?.refInfo?.length) {
                    meta.children = <b>{item.refInfo.find(ref => ref.value === postInfo.metaInfoItems[item.key])?.label}</b>;
                }
                return meta;
            });
            setMetaDesc(metaInfos);
        }
    }, [postInfo, columnInfo]);

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
                    getPostDetails(data?.canFileDownload)
                    getMetas();
                    getRelatedTopicPosts();
                    getColumnInfo(data?.menuEngName1, data?.menuEngName2);
                    // getComments();
                }
                updatePostSEO(data);
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
    const getPostDetails = (canFileDownload) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data?.map(e => {
                    if (e.detailsType === 'pdf') {
                        return { ...e, canFileDownload: canFileDownload }
                    } else {
                        return e
                    }
                })
                // console.log("=== 1차 menus : ", data)
                setPostDetails(data ?? []);
                return data;
            })
            .then((data) => {
                if (canFileDownload) {
                    const pdfData = data?.filter(e => e.detailsType === 'pdf').map(file => ({ ...file, fileExtension: 'pdf', pdfViewerYn: true }));
                    setCanFileDownload(true);
                    // getFiles(pdfData);
                }
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

    const getColumnInfo = (menu1, menu2) => {
        if (isEmptyCheck(menu1) || isEmptyCheck(menu2)) {
            return;
        }

        setLoading(true);

        AXIOS.get(`/api/v1/user/post/field/${menu1}/${menu2}`)
            .then((res) => {
                // console.log('res', res.data);
                const columns = res.data?.map(col => ({ key: col.metaKey, label: col.metaNm, refInfo: col.refInfo }));
                setColumnInfo(columns);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
            .finally(() => { });
    }

    const postMetaRow = (
        <PostMetaRow postInfo={postInfo} metas={metas} hasEdit={hasEditAuth(menu1, menu2)} showMeta={postInfo?.postCategory !== 'sales'} refreshPostInfo={() => getPostInfo(true)} />
    )


    return (
        <PostViewSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} >
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to="/"><HomeOutlined /></Link>,
                            },
                            {
                                title: <Link to={`/${menu1?.path}`}>{menu1?.name}</Link>,
                            },
                            {
                                title: menu2?.name,
                            },
                        ]}
                    />


                    {postInfo?.postCategory === 'sales' &&
                        <SalesPostPage
                            postInfo={postInfo}
                            postDetails={postDetails}
                            relatedPosts={relatedPosts}
                            metaDesc={metaDesc}
                            metas={metas}
                            hasEdit={hasEditAuth(menu1, menu2)}
                            showMeta={postInfo?.postCategory !== 'sales'}
                            refreshPostInfo={() => getPostInfo(true)}
                            postMetaRow={postMetaRow}
                        />}
                    {(postInfo?.postCategory === 'editor' || postInfo?.postCategory === 'pdf') &&
                        <>
                            <PostPage
                                postInfo={postInfo}
                                postDetails={postDetails}
                                canFileDownload={canFileDownload}
                                metas={metas}
                                relatedPosts={relatedPosts}
                                postId={postId}
                                getPostInfo={getPostInfo}
                                metaDesc={metaDesc}
                                postMetaRow={postMetaRow}
                            />
                        </>
                    }
                    {postInfo?.postCategory === 'photo' &&
                        <>
                            <PhotoPostPage
                                postInfo={postInfo}
                                postDetails={postDetails}
                                relatedPosts={relatedPosts}
                                metaDesc={metaDesc}
                                postMetaRow={postMetaRow}
                            />
                        </>
                    }
                </LoadingSpinner>
            </SUInner1280 >
        </PostViewSection>
    )
}

const PostViewSection = styled.section`
    font-size: 16px;
    padding: ${SFEm(48)} 0;
${SFMedia('mo-l', css`
    font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    padding-top: ${SFEm(40)};
`)};
`;