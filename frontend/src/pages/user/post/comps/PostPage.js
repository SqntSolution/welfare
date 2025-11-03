// POST게시물 한건
import { useEffect, useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import { AXIOS } from 'utils/axios';
import { useNavigate } from "react-router-dom";
import { RelatedTopicPosts } from './RelatedTopicPosts';
import { useMsg } from 'hooks/helperHook';
import { DynamicAreaForView } from './DynamicAreaForView';
import styled, { css } from 'styled-components';
import { SFEm, SFMedia } from 'styles/StyledFuntion';

export const PostPage = ({ postInfo, postDetails, canFileDownload, metas, relatedPosts, postId, getPostInfo, metaDesc, postMetaRow }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { error, info } = useMsg()
    const [files, setFiles] = useState([]) // 첨부파일
    const [comments, setComments] = useState([]) // 댓글

    useEffect(() => {
        if (canFileDownload) {
            getFiles();
        }
    }, [])

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

    // 댓글들 조회
    const getComments = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/comment/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== comments 조회 : ", data)
                setComments(data)
            })
            .catch((err) => {
                setComments([])
                console.log('=== getComments 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
            })
            .finally(() => setLoading(false));
    };


    // rightSideBar 탭 변경 이벤트
    const rightSideTabChange = (activeKey) => {
        if (activeKey === 'file' && canFileDownload) {
            getFiles(postDetails?.filter(e => e.detailsType === 'pdf').map(file => ({ ...file, fileExtension: 'pdf', pdfViewerYn: true })));
        }

        if (activeKey === 'comments') {
            getComments();
        }
    }


    return (
        <PostPageSection>
            {postMetaRow}
            {/* dynamic area */}
            <DynamicAreaForView postDetails={postDetails} />
            {/* Related Post */}
            <RelatedTopicPosts posts={relatedPosts} />
        </PostPageSection>
    )
};

const PostPageSection = styled.section`


`