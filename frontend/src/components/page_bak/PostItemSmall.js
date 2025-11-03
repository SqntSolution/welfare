// POST 한개 - 이미지가 작게 보이고, 3줄짜리, 카테고리/스크랩/좋아요 아이콘이 보이는 
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, } from 'antd';
import {
    StarOutlined, StarFilled, HeartOutlined, HeartFilled
} from '@ant-design/icons';
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import {coverImgStyle} from 'utils/helpers'
import { CustomBoardInfoIcon, CustomCardMeta, CustomTag } from 'components/common/CustomComps';
import styled from 'styled-components';
import {REPRESENTATIVE_IMAGE} from 'utils/constants'


export const PostItemSmall = ({ 
    id, representativeImagePath, menuName1, menuName2, menuEngName1, menuEngName2,
    viewCnt, likes,likesCnt, scrapes, title, description, strategicMarketingOnly, createdAt }) => {

    const { menu2 } = useParams()
    const navigate = useNavigate();
    // const imgPath = "/api/v1/view/image/" + representativeImagePath?.split("/")?.filter(e=>e!="")?.join("/")
    let imgPath = null
    if(representativeImagePath!=null && representativeImagePath!=''){
        imgPath = `url(/api/v1/view/image/${representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")})`
    }else{
        imgPath = `url(/api/v1/view/image/${REPRESENTATIVE_IMAGE?.split("/")?.filter(e => e != "")?.join("/")})`
    }

    // menu2로 1차카테고리를 보여줄지 2차카테고리를 보여줄지 판단.
    // => [수정됨] 무조건 2차 카테고리(메뉴)만 보여줌.
    let menuName = null
    let categoryLink = null
    if (menuEngName2!=null || menuName2!=null) {
        // 1차메뉴를 선택한 상황에서는 
        menuName = menuName2
        categoryLink = `/main/${menuEngName1}/${menuEngName2}`
    } else {
        menuName = menuName1 ?? ''
        categoryLink = `/main/${menuEngName1}`
    }
    // const link = `/post/${id}`

    let date = ''
    if(createdAt!=null && createdAt.length){
        date = createdAt?.substring(0,10)
    }

    return (
        <>
            <Row style={{ width: '100%',cursor:'pointer',padding:0 }} gutter={[24, 24]} onClick={()=>navigate(`/post/${id}`)}>
                <Col span={10} style={{
                        maxWidth: 247,
                        aspectRatio: '4/3',
                        backgroundImage: `${imgPath}`,
                        backgroundSize:'cover',  
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center center',
                        border: '1px solid #F0F0F0'
                    }}>
                    {/* <div style={{ width: '100%', height: '100px', overflow: 'hidden', }}>
                        <img style={coverImgStyle} src={imgPath} />
                    </div> */}
                    <div className='tagPosition' style={{position: 'absolute', bottom: 'auto', left: '0',top:'-12px',zIndex:2 }}>
                        <CustomTag opacity={1} menuName={menuName} strategicMarketingOnly={strategicMarketingOnly}/>
                    </div>
                </Col>

                <Col span={14} style={{padding:0}}>
                    <StyledCardMeta>
                        <CustomCardMeta title={title} description={description} date={date}/>
                        <div style={iconWrapStyle}>
                            <CustomBoardInfoIcon  viewCnt={viewCnt} scrapes={scrapes} likes={likes} likesCnt={likesCnt} postId={id} />
                        </div>
                    </StyledCardMeta>
                </Col>

                {/* <Col flex="auto">  => flex를 쓰면 밑으로 늘어나는 문제가.
                    <Row style={{ width: '100%', }}>
                        <Col span={24}>
                            <Tag color="blue">{menuName}</Tag>
                            {
                                likes ? (
                                    <HeartFilled style={{ fontSize: '20px', color: 'red' }} />
                                ) : (
                                    <HeartOutlined style={{ fontSize: '20px', color: 'red' }} />
                                )
                            }
                            {
                                scrapes ? (
                                    <StarFilled style={{ fontSize: '20px', color: 'yellow' }} />
                                ) : (
                                    <StarOutlined style={{ fontSize: '20px', color: 'yellow' }} />
                                )
                            }
                            View : {viewCnt ?? 0}
                        </Col>
                        <Col span={24}> <Typography.Title level={4}>{title}</Typography.Title></Col>
                        <Col span={24}>{description}</Col>
                    </Row>
                </Col> */}

            </Row>
        </>
    )
}

const iconWrapStyle ={
    width: '100%',
    height:'38px',
    padding:'8px 24px',
    boxSizing: 'border-box',
    borderTop: '1px solid #F0F0F0',
}

const StyledCardMeta = styled(Row)`
    &{border: 1px solid #F0F0F0; padding:0;margin:0;border-left:0;}
    && .ant-card-meta{box-sizing: border-box;}
`;