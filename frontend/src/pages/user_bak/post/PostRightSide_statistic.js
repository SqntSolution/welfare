// 오른편에, post의 대표이미지와 통계(조회수, 좋아요수, 스크랩수, share수) 보여주기
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled, ShareAltOutlined, LikeOutlined, EyeOutlined, LikeFilled } from '@ant-design/icons';
import { errorMsg, coverImgStyle } from 'utils/helpers';
import { useCopy } from 'hooks/helperHook';
import { useMsg } from 'hooks/helperHook';
import { BookMarkFill, BookMarkLine } from 'components/common/IconComponets';
import styled from 'styled-components';
import {REPRESENTATIVE_IMAGE} from 'utils/constants'

export const PostRightSide_statistic = ({ postInfo, refreshPostInfo }) => {
    const postId = postInfo?.id
    // scrapes : true , likes : false , viewCnt : 1 , shareCnt : 0
    // console.log("=== postInfo : ", postInfo)
    const {error, info} = useMsg()
    let imgPath = null
    if(postInfo?.representativeImagePath??"" != ""){
        imgPath = "/api/v1/view/image/" + postInfo?.representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")
    }else{
        imgPath = "/api/v1/view/image/" + REPRESENTATIVE_IMAGE?.split("/")?.filter(e => e != "")?.join("/")
    }

    const requestLike = () => {
        AXIOS.post(`/api/v1/common/like/${postId}`)
            .then((resp) => {
                const data = resp?.data
                console.log("=== like : ", data)
                refreshPostInfo()
            })
            .catch((err) => {
                console.log('=== requestLike 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
    };

    const requestScrap = () => {
        AXIOS.post(`/api/v1/common/scrap/${postId}`)
            .then((resp) => {
                const data = resp?.data
                console.log("=== scrap : ", data)
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
                const data = resp?.data
                console.log("=== scrap : ", data)
                refreshPostInfo()
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
            <Row style={{
                width: '100%',
                backgroundColor: 'white',
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }} justify='center' align='middle' gutter={[2, 10]}
            >   
                <Col span={24}>
                    <div style={{ width: '100%',aspectRatio:"4/3",overflow: 'hidden', }}>
                        <img style={coverImgStyle} src={imgPath} />
                    </div>
                </Col>
                <Col span={24}>
                    {/* 아이콘 박스 영역 */}
                    <StyledIconBoxFlex justify={'space-between'} align={'center'} gap="small">
                        {/* 페이지 view */}
                        <Flex align={'center'} gap="small" style={{paddingTop:4}}>
                            <EyeOutlined className='noHover'/>
                            <span className='text'>{postInfo?.viewCnt ?? 0} </span>
                        </Flex>
                        <Divider type="vertical" />
                        {/* 좋아요 */}
                        <Flex align={'center'} gap="small">
                            <StyledIconButton onClick={(e) => { requestLike(); e.stopPropagation() }}>
                                {postInfo?.likes ?  (<LikeFilled style={{color:"#eb2d2b"}}/>) : (<LikeOutlined style={{color:"rgba(0, 0, 0, 0.45)"}}/>)}
                            </StyledIconButton>
                            <span className='text'>{postInfo?.likesCnt ?? 0} </span>
                        </Flex>
                        <Divider type="vertical" />
                        {/* 북마크 */}
                        <Flex align={'center'} gap="small">
                            <StyledIconButton onClick={(e) => { requestScrap(); e.stopPropagation() }} style={{paddingTop:4}}>
                                { postInfo?.scrapes ? (<BookMarkFill style={{color:"#eb2d2b"}} /> ): (<BookMarkLine  style={{color:"rgba(0, 0, 0, 0.45)"}} />) }
                            </StyledIconButton>
                            <span className='text'>{postInfo?.scrapCnt ?? 0}</span>
                        </Flex>
                        <Divider type="vertical" />
                        {/* 공유 */}
                        <Flex align={'center'} gap="small">
                            <StyledIconButton onClick={(e) => { onShareClick(); e.stopPropagation() }}>
                                <ShareAltOutlined /> 
                            </StyledIconButton>
                            <span className='text'>{postInfo?.shareCnt ?? 0} </span>
                        </Flex>
                    </StyledIconBoxFlex>
                </Col>
            </Row>

        </>
    )
}
const StyledIconBoxFlex = styled(Flex)`
    font-size: 14px;
    color:rgba(0, 0, 0, 0.45);
    &&& svg{width: 14px;height: 14px; }
    &&& .noHover  svg:hover{ color:rgba(0, 0, 0, 0.45)}
    &&& svg:hover{ color:#eb2d2b}
    .text{font-size: 14px; line-height: 22px;}
    &&& .ant-btn-default{padding:0;margin:0;}
    &&& .BookMarkFill path{fill: #eb2d2b}
`;
const StyledIconButton = styled(Button)`
    border:0;
`;