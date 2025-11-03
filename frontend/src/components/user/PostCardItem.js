/**
 * @file PostCardItem.js
 * @description 포스트 카드 아이템 컴포넌트
 * @author 김단아
 * @since 2025-06-23 13:07
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-23 13:07    김단아       최초 생성
 **/

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { SUBadge, SUImg, SUPointText, SUText14, SUText18 } from 'styles/StyledUser';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { useUserInfo } from 'hooks/useUserInfo';

const PostCardItem = ({
    id, representativeImagePath, menuName1, menuName2, menuEngName1, menuEngName2,
    viewCnt, likes, likesCnt, scrapes, title, description, createdAt }) => {
    const [scrap, setScrap] = useState(scrapes);
    const navigate = useNavigate();
    const { error, info } = useMsg()
    const useInfo = useUserInfo();
    let imgPath = null;

    if (representativeImagePath != null && representativeImagePath != '') {
        imgPath = `/api/v1/view/image/${representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")}`
    } else {
        // imgPath = `/api/v1/view/image/${REPRESENTATIVE_IMAGE?.split("/")?.filter(e => e != "")?.join("/")}`
        imgPath = ``
    }

    let menuName = null
    let categoryLink = null
    if (menuEngName2 != null || menuName2 != null) {
        // 1차메뉴를 선택한 상황에서는 
        menuName = menuName2
        categoryLink = `/main/${menuEngName1}/${menuEngName2}`
    } else {
        menuName = menuName1 ?? ''
        categoryLink = `/main/${menuEngName1}`
    }
    let date = ''
    if (createdAt != null && createdAt.length) {
        date = createdAt?.substring(0, 10)
    }

    const postId = id;

    const requestScrap = () => {
        if (postId == null) {
            console.log("postId가 null")
            return
        }
        AXIOS.post(`/api/v1/common/scrap/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== scrap : ", data)
                setScrap(data?.result === true)
                info((data?.result === true) ? "'스크랩'했습니다." : "'스크랩'을 해제했습니다.")
            })
            .catch((err) => {
                console.log('=== requestScrap 에러 : ', err?.response);
                error(err)
            })
    };
    return (
        <CardWrap>
            <Link to={`/post/${id}`}>
                <div className='img-box'>
                    <SUImg imgPath={imgPath} />
                </div>
            </Link>
            <div className='text-inner'>
                <div className='text-top'>
                    <SUPointText className='label'>{menuName2}</SUPointText>
                    <SUText14 $color={'#717680'} $weight={400}
                        className='category'
                    ></SUText14>
                    {useInfo?.role !== 'ROLE_VISITOR' && <button className={scrap ? 'btn-like scrap' : 'btn-like'} onClick={(e) => { requestScrap(); e.stopPropagation() }}>
                        {!scrap ? <GoBookmark /> : <GoBookmarkFill />}
                    </button>}
                </div>
                <div className='text-bottom'>
                    <SUText18 $weight={600} className='title' title={title}><Link to={`/post/${id}`}>{title}</Link></SUText18>
                    <SUBadge className='badge'>New</SUBadge>
                </div>
            </div>
            {/* <Link to={`/post/${id}`} className='link' /> */}
        </CardWrap >
    )
}
export default PostCardItem;

const CardWrap = styled.div`
font-size: 16px;
/* &:hover{
    .title {text-decoration: underline;}
} */
.img-box > span{
    height: ${SFEm(256)};
    border-radius: 0;
    margin-bottom: 1em;
}
.text-inner > div{
    display: flex;
    position: relative;
    gap: ${SFEm(16)};
    align-items: center;
}
.text-top{
    padding: ${SFEm(8)} ${SFEm(34)} ${SFEm(8)} 0;
}
.text-inner  .btn-like{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: ${SFEm(4, 20)}; right: 0;
    font-size: ${SFEm(20)};
    width: ${SFEm(36, 20)};
    aspect-ratio: 1/ 1;
    z-index: 10;
    &:hover,&.scrap {
        color: var(--color-red-6)
    }
    &.scrap:hover{
        opacity: 0.75;
    }
}

.text-bottom .title{
    line-height: 1;
    max-width: calc(100% - ${SFEm(60, 18)});
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.text-bottom .badge{
    margin-top: 0;
    margin-bottom: 0;
}
.link{
    position: absolute;
    top:0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
}

${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`