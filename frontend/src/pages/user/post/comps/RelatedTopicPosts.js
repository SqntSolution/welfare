// POST게시물 한건
import { useState } from 'react';
import { PostItemSmall2 } from 'components/page_bak/PostItemSmall2';
import { SFEm } from 'styles/StyledFuntion';
import { SUText30 } from 'styles/StyledUser';


// Related Post
export const RelatedTopicPosts = ({ posts }) => {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {
                (posts?.length ?? 0) == 0 ? (
                    null
                ) : (
                    <div style={{ marginTop: SFEm(60) }}>
                        <SUText30 style={{ marginBottom: '0.4em' }}>Related Post</SUText30>
                        {
                            posts?.map((elem, idx) => {
                                return (
                                    <div key={idx} >
                                        <PostItemSmall2 {...elem} />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </>
    )
}
