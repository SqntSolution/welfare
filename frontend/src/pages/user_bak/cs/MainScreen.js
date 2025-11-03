import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Descriptions, Flex, Row, Col, Typography, Button } from 'antd';
import {

    PushpinFilled
} from '@ant-design/icons';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { InnerDiv } from 'styles/StyledCommon';
import styled from 'styled-components';
// import { SUMoreButton } from 'styles/StyledUser';
// import { getMenuIdFromPath } from 'utils/menuHolder'

export const MainScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [postDetails, setPostDetails] = useState([]) // Post 상세정보

    const [noticeList, setNoticeList] = useState([]);
    const [faqList, setFaqList] = useState([]);
    const [qnaList, setQnaList] = useState([]);

    const navigate = useNavigate();
    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg()
    // const menuIdFromPath = getMenuIdFromPath(menu1, menu2);

    useEffect(() => {
        getData();
        getPostInfo();
    }, [])//화면 로드시 실행

    const getData = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/user/cs`)
            .then((resp) => {
                // notice
                const bbsNoticeTmp = resp?.data?.bbsNoticeList ?? []
                const bbsNoticeTmpList = bbsNoticeTmp?.map(e => {
                    return {
                        key: e.id, label: e.createdAt?.substring(0, 10),
                        children: (
                            <div key={e.id} style={{ minWidth: 0 }}>
                                <Typography.Text ellipsis={true} className='title-text'>
                                    <NavLink to={`/main/cs-center/notice/${e.id}`}>
                                        {e.noticeType ? <PushpinFilled style={{ color: '#EA1D22', fontSize: 11 }} /> : null}
                                        <Typography.Text ellipsis={true} style={{ minWidth: 0, fontSize: 14 }}>{e.title}</Typography.Text>
                                    </NavLink>
                                </Typography.Text>
                            </div>),
                        span: 3,
                    }
                })
                // Faq
                const bbsFaqTmp = resp?.data?.bbsFaqList ?? []
                const bbsFaqTmpList = bbsFaqTmp?.map(e => {
                    return {
                        key: e.id, label: e.metaDivisionNm,
                        children: (
                            <div key={e.id} style={{ minWidth: 0 }}>
                                <Typography.Text ellipsis={true} className='title-text'>
                                    <NavLink to={`/main/cs-center/faq/${e.id}`}>
                                        <Typography.Text ellipsis={true} style={{ minWidth: 0, fontSize: 14 }}>{e.title}</Typography.Text>
                                    </NavLink>
                                </Typography.Text>
                            </div>
                        ),
                        span: 3
                    }
                })
                //qna
                const bbsQnaTmp = resp?.data?.bbsQnaList ?? []
                const bbsQnaTmpList = bbsQnaTmp?.map(e => {
                    return {
                        key: e.id, label: e.createdAt?.substring(0, 10),
                        children: [
                            (
                                <Flex key={e.id} justify={'space-between'} style={{ width: '100%', }}>
                                    <NavLink to={`/main/cs-center/qna/${e.id}`} style={{ width: '80%' }}>
                                        <Typography.Text ellipsis={true} className='title-text' style={{ minWidth: 0, fontSize: 14 }} >{e.title}</Typography.Text>
                                    </NavLink>
                                    <Typography.Text ellipsis={true} style={{ minWidth: 60, fontSize: 14, textAlign: 'center', color: `${e.responseYn ? "rgba(0, 0, 0, 0.45)" : "#52C41A"}` }}>{e.responseYn ? '답변 완료' : '문의 접수'}</Typography.Text>
                                </Flex>
                            )],
                        span: 3
                    }
                })
                setNoticeList(bbsNoticeTmpList);
                setFaqList(bbsFaqTmpList);
                setQnaList(bbsQnaTmpList);
                //aboutConActImg
                //userManualImg
            })
            .catch((err) => {
                console.log('=== err : ', err);
            })
            .finally(() => setLoading(false));
    };

    // Post 기본정보 조회 
    const getPostInfo = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/page/info/cs-center/about`)
            .then((resp) => {
                const data = resp?.data
                if (data?.id == null) {
                    return
                }
                getPostDetails(data?.id)
            })
            .catch((err) => {
                error(err)
            })
            .finally(() => setLoading(false));
    };


    // Post 상세(pdf, editor등) 조회 
    const getPostDetails = (postId) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setPostDetails(data)
            })
            .catch((err) => {
                setPostDetails([])
                error(err)
            })
            .finally(() => setLoading(false));
    };


    return (
        <InnerDiv>
            <Row style={{ width: '100%', marginBottom: 72 }} gutter={[24, 24]}>
                <Row gutter={[24, 24]} style={{ width: '100%' }}>
                    {/* notice */}
                    <Col span={12} >
                        <>
                            <StyledDescriptions title="Notice" extra={
                                <NavLink to={`/main/cs-center/notice`}>
                                    {/* <Button
                                        style={{
                                            width: '79px',
                                            height: '30px',
                                            borderRadius: '2px',
                                            border: '1px solid #D9D9D9',
                                            padding: '4px 10px',
                                            color: '#262626',
                                            fontSize: '14px',
                                            fontWidth: '400',
                                            lineHeight: '1',
                                        }}
                                    >More<PlusOutlined style={{ fontSize: '12px', marginLeft: 4 }} /></Button> */}
                                    <Button />
                                </NavLink>
                            }
                                // bordered
                                items={noticeList} size='small'
                                styles={{ label: labelStyle }}
                            />
                        </>
                    </Col>

                    {/* FAQ */}
                    <Col span={12} >
                        <>
                            <StyledDescriptions title="FAQ" extra={
                                <NavLink to={`/main/cs-center/faq`}>
                                    <Button />
                                </NavLink>
                            }
                                // bordered
                                items={faqList} size='small'
                                styles={{ label: labelStyle }}
                            />
                        </>
                    </Col>
                </Row>
            </Row>
            <Row style={{ width: '100%' }} gutter={[24, 24]}>
                <Row gutter={[24, 24]} style={{ width: '100%' }}>
                    {/* Q&A */}
                    <Col span={12} >
                        <Row style={{
                            width: '100%',
                            backgroundColor: 'white',
                        }} justify='center' align='middle'
                        >
                            <Col span={24} >
                                <>
                                    <StyledDescriptions title="Q&A" extra={
                                        <NavLink to={`/main/cs-center/qna`}>
                                            <Button />
                                        </NavLink>
                                    }
                                        // bordered
                                        items={qnaList} size='small'
                                        styles={{ label: labelStyle }}
                                    />
                                </>
                            </Col>
                        </Row>
                    </Col>

                    {/* About CON-ACT */}
                    <Col span={12} >
                        <Row gutter={[16, 16]} style={{ padding: '0 8px' }}>
                            <Col span={12} >
                                <>
                                    <StyledDescriptions title="About INSIGHT" style={{ height: 64 }} />
                                    <StyledNavLink to={`/main/cs-center/about`} >
                                        {/* <DynamicAreaForView postDetails={postDetails} /> */}
                                        <img src='/api/v1/image/static/cscenter-about.png' alt='이미지' />
                                        <p style={{ color: 'rgba(0, 0, 0, 0.85)', padding: 16, margin: 0 }}>INSIGHT란?</p>
                                    </StyledNavLink>
                                </>
                            </Col>
                            <Col span={12} >
                                <>
                                    <StyledDescriptions title="User Manual" style={{ height: 64 }} />
                                    <StyledNavLink to={`/main/cs-center/manual`}>
                                        {/* <DynamicAreaForView postDetails={postDetails} /> */}
                                        <img src='/api/v1/image/static/cscenter-manual.png' alt='이미지' />
                                        <p style={{ color: 'rgba(0, 0, 0, 0.85)', padding: 16, margin: 0 }}>사용자 매뉴얼</p>
                                    </StyledNavLink>
                                </>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Row>
        </InnerDiv>
    );
}

const labelStyle = {
    minWidth: 106,
    fontSize: 14,
    color: '#8C8C8C',
    fontWeight: 400,
    textAlign: 'center',
    padding: 16,
    justifyContent: 'center',
}

const StyledDescriptions = styled(Descriptions)`
    &.ant-descriptions .ant-descriptions-header{
        height: 64px;
        padding: 16px 8px;
        margin-bottom:0;
        font-size:14px;
        color:#262626;

    }
    &.ant-descriptions .ant-descriptions-item-container{
        height: 55px;
        align-items : center;
        border-bottom:1px solid #F0F0F0;
    }
    &.ant-descriptions .ant-descriptions-item-label::after{display:none;}
    .ant-btn-default {
        width:79px;
        height:30px;
        font-size: 14px;
        color:rgba(0, 0, 0, 0.85);
        padding:0;
    }

    &.ant-descriptions .ant-descriptions-item-container .ant-descriptions-item-content {
        min-width: 0;
    }
`;

const StyledNavLink = styled(NavLink)`
    &{
        display:block;
        border: 1px solid #F0F0F0;
    }
    & img{width: 100%; height:260px; object-fit:cover;}
`;