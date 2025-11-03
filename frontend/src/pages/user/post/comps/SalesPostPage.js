// POST게시물 한건
import { Descriptions } from 'antd';
import { DetailHeader, SUImg } from 'styles/StyledUser';
import { DynamicAreaForView } from './DynamicAreaForView';
import { PostMetaRow } from './PostMetaRow';
import styled from 'styled-components';


export const SalesPostPage = ({ postInfo, relatedPosts, hasEdit, postDetails, metaDesc, metas, showMeta, refreshPostInfo, postMetaRow }) => {
    return (
        <SalesPostSection>
            <DetailHeader>
                <SUImg imgPath={postInfo?.representativeImagePath ? `/api/v1/view/image/${postInfo?.representativeImagePath}` : ''} />
                {postMetaRow}
            </DetailHeader>
            <Descriptions items={metaDesc ?? []} colon={false} column={1} bordered styles={{ root: { width: '100%' }, label: { padding: '8px 24px', width: 160 }, content: { padding: '4px 12px', } }} />
            <DynamicAreaForView postDetails={postDetails} />
        </SalesPostSection>
    )
};

const SalesPostSection = styled.section`
    .meta-wrap{
        margin-top: 0;
    }
`