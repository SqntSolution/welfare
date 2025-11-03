// POST게시물 한건
import { Descriptions } from 'antd';
import { DetailHeader } from 'styles/StyledUser';
import { DynamicAreaForView } from './DynamicAreaForView';


export const PhotoPostPage = ({ postInfo, relatedPosts, postDetails, metaDesc, postMetaRow }) => {
    return (
        <>
            {postMetaRow}
            <DetailHeader>
                <Descriptions items={metaDesc ?? []} colon={false} column={1} bordered styles={{ root: { width: '100%' }, label: { padding: '8px 24px', width: 160 }, content: { padding: '4px 12px', } }} />
            </DetailHeader>
            <DynamicAreaForView postDetails={postDetails} />
        </ >
    )
}