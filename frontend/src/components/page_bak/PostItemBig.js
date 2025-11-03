// POST 한개 - 이미지가 크게 보이고, 카테고리/스크랩/좋아요 아이콘이 보이는 
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, } from 'antd';
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { CustomBoardInfoIcon, CustomCardMeta, CustomTag } from 'components/common/CustomComps';
import styled from 'styled-components';
import { REPRESENTATIVE_IMAGE } from 'utils/constants'


/*
{ id, representativeImagePath,
    menu1Id, menu2Id, menuName1, menuName2, menuEngName1, menuEngName2,
    viewCnt, likes, scrapes, title, description, strategicMarketingOnly, createdAt }
*/
export const PostItemBig = ({
    id, representativeImagePath, menuName1, menuName2, menuEngName1, menuEngName2,
    viewCnt, likes, likesCnt, scrapes, title, description, strategicMarketingOnly, createdAt }) => {

    // const { menu1, menu2 } = useParams()
    const navigate = useNavigate();
    let imgPath = null
    if (representativeImagePath != null && representativeImagePath != '') {
        imgPath = `url(/api/v1/view/image/${representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")})`
    } else {
        imgPath = `url(/api/v1/view/image/${REPRESENTATIVE_IMAGE?.split("/")?.filter(e => e != "")?.join("/")})`
    }
    // console.log("=== representativeImagePath : ", representativeImagePath, typeof representativeImagePath,  representativeImagePath==null, imgPath )

    // menu2로 1차카테고리를 보여줄지 2차카테고리를 보여줄지 판단.
    // => [수정됨] 무조건 2차 카테고리(메뉴)만 보여줌.
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

    return (
        <>
            <StyledCard
                hoverable
                onClick={() => navigate(`/post/${id}`)}
                cover={<div style={{ border: '1px solid #f0f0f0', borderBottom: 0, width: 'calc(100% - 2px)', height: '219px', backgroundImage: `${imgPath}`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', position: 'relative' }} >
                    {/*  cover={<div style={{ width: '100%', height: '150px', overflow: 'hidden', }}>
                    <img style={imgStyle} src={imgPath} /> */}
                    <div className='tagPosition' style={{ position: 'absolute', bottom: 'auto', left: '0', top: '-12px', zIndex: 2 }}>
                        {/* <Tag color="blue" onClick={(e)=>{navigate(categoryLink);e.stopPropagation()}}>{menuName}</Tag> */}
                        {/* <StyledTag  >{menuName}</StyledTag> */}
                        <CustomTag opacity={1} menuName={menuName} strategicMarketingOnly={strategicMarketingOnly} />
                    </div>

                </div>}
            >
                <CustomCardMeta title={title} description={description} date={date} />
                <div style={iconWrapStyle}>
                    <CustomBoardInfoIcon viewCnt={viewCnt} scrapes={scrapes} likes={likes} likesCnt={likesCnt} postId={id} />
                </div>
            </StyledCard>
        </>
    )
}

const imgStyle = {
    objectFit: "cover", margin: 'auto', width: '100%', height: '100%',
}
const iconWrapStyle = {
    height: '48px',
    padding: '14px 24px',
    boxSizing: 'border-box',
    borderTop: '1px solid #F0F0F0',
    lineHeight: '16px'
}
const StyledCard = styled(Card)`
    width: 100%;
    border-radius: 2px;
    .ant-card-body{padding :0;}
`;