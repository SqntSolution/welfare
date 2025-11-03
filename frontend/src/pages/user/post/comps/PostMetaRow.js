// post 상세에서, 메타정보를 보여주는 Row
import { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import styled, { css } from 'styled-components';
import { Link, useNavigate } from "react-router-dom";
import DescriptionsItem from 'antd/es/descriptions/Item';
import { useCopy, useGetMenus, useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { SUBadge, SUText14, SUText20 } from 'styles/StyledUser';
import { LuShare2 } from 'react-icons/lu';
import { SComLinkBtn } from 'styles/StyledCommon';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { useUserInfo } from 'hooks/useUserInfo';

export const PostMetaRow = ({ nations, topics, postInfo, isPost = true, hasEdit = false, showMeta = true, metas, refreshPostInfo }) => {
    const [smartFinderUrl, setSmartFinderUrl] = useState("/");
    const postId = postInfo?.id;
    const { info, error } = useMsg();
    const menus = useGetMenus()
    const navigate = useNavigate();
    const [scrap, setScrap] = useState(false);
    const userInfo = useUserInfo();

    useEffect(() => {
        setScrap(postInfo?.scrapes);
    }, [postInfo])

    const requestScrap = () => {
        AXIOS.post(`/api/v1/common/scrap/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setScrap(data?.result === true)
                info((data?.result === true) ? "'스크랩'했습니다." : "'스크랩'을 해제했습니다.")
                refreshPostInfo()
            })
            .catch((err) => {
                console.log('=== requestScrap 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
    };

    const requestShare = () => {
        AXIOS.post(`/api/v1/common/share/${postId}`)
            .then((resp) => {
                // refreshPostInfo()
            })
            .catch((err) => {
                console.log('=== requestShare 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
    };

    const copy = useCopy()
    const onShareClick = () => {
        copy(`${window.location.href}`)
        requestShare()
    }




    return (
        <>
            <MetaWrap>
                <div className='crate-inner'>
                    <SUBadge><Link to={`/${postInfo?.menuEngName1}/${postInfo?.menuEngName2}`}>{postInfo?.menuName2}</Link></SUBadge>
                    <div className='crate-box'>
                        <Descriptions size='small'>
                            <DescriptionsItem label="Create">{postInfo?.createdAt?.substring(0, 10)}</DescriptionsItem>
                            {/* <DescriptionsItem label="Update">
                                    {postInfo?.modifiedAt != null ?
                                        (<> {postInfo?.modifiedAt?.substring(0, 10)}</>) : (null)
                                    }
                                </DescriptionsItem> */}
                        </Descriptions>
                        {<>
                            {
                                hasEdit ? (
                                    <SComLinkBtn to={`/post/edit/${postInfo?.id}`} height="small">수정</SComLinkBtn>
                                ) : (
                                    null
                                )
                            }
                        </>
                        }
                    </div>
                </div>
                <div className='title-inner'>

                    <div className='title-box'>
                        <SUText20 $weight={600}> {postInfo?.title}</SUText20>
                        <button onClick={(e) => { onShareClick(); }}><LuShare2 /></button>
                        {userInfo?.role !== 'ROLE_VISITOR' && <button onClick={(e) => { requestScrap(); }}> {scrap ? <GoBookmarkFill style={{ color: 'var(--color-red-6)' }} /> : <GoBookmark />}</button>}
                    </div>
                    <SUText14> {postInfo?.description}</SUText14>
                </div>
                {showMeta &&
                    <>
                        <div className='tag-inner'>

                            {
                                metas?.tags?.map((e, idx) => (
                                    <SUBadge
                                        key={`${e?.value}-${idx}`}
                                        onClick={() => navigate(`/`)}
                                        $bgColor={'#FAFAFA'}
                                        $color={'#414651'}
                                        $border={'border: 1px solid #E9EAEB'}
                                    > #{e?.value}
                                    </SUBadge>
                                ))
                            }
                        </div>

                    </>
                }
            </MetaWrap>
        </>

    )
}

const MetaWrap = styled.div.attrs({ className: 'meta-wrap' })`
    &{
        margin-top: ${SFEm(16)};
        /* margin-bottom: ${SFEm(96 / 2)}; */
        width: 100%;
    }
    .badge{
            margin-top: 0;
            margin-bottom: 0;
        }
    .title-box{
        display: flex;
        align-items: center;
        padding: ${SFEm(8)} 0 ;
        margin-bottom: ${SFEm(4)};
        .text-20{
            max-width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        button {
            margin-left:  ${SFEm(14)};
            font-size: ${SFEm(15)};
            color: #A4A7AE;
        }
    }
    .title-inner{
        margin-bottom: ${SFEm(8)};
        .text-14{
            color: #414651;
        }
        .title-box button{
            ${SFFlexCenter};
            display: inline-flex;
            align-content: center;
        }
        svg{
            font-size: ${SFEm(18, 14)};
        }
    }

    .tag-inner{
        display: flex;
        flex-wrap: wrap;
        gap: ${SFEm(8)};
        margin-bottom: ${SFEm(16)};
        
    }
    .crate-inner{
        display: flex;
        align-items: center;
        justify-content:space-between;
        gap: ${SFEm(8)};
        margin-bottom: ${SFEm(8)};
        .ant-descriptions{
            max-width: 138px;
        }
        .crate-box{
            display: flex;
            align-items: center;
            gap: ${SFEm(8)};
            justify-content: flex-end;
            ㅜㅁ
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &,[class|= ant],
    .ant-descriptions .ant-descriptions-item-content{font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
`)};
`;