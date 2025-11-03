import React, { useState, useEffect } from "react";
import { Modal, Select, Input, Radio, Space, List, Divider, Flex, Row, Button, Layout, Typography, Pagination, App, Form, Col, message, Card, Tag, Spin, Badge } from "antd";
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, useNavigate, NavLink } from "react-router-dom";
import { StarFilled, StarOutlined, HeartFilled, HeartOutlined, DownloadOutlined, LinkOutlined, LikeOutlined, EyeOutlined, BookFilled, BookOutlined, LikeFilled } from "@ant-design/icons";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { FileCardForm } from "components/page/FileCardForm";
import styled from "styled-components";
import { CustomBoardInfoIcon, CustomCardMeta, CustomTag } from "components/common/CustomComps";
import { BookMarkFill, BookMarkLine } from "components/common/IconComponets";
import { REPRESENTATIVE_IMAGE } from 'utils/constants'

const { Content } = Layout;
const { Title } = Typography;

export const SearchCond = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { error, info } = useMsg();
    const { data, getData, form, setData, page, setPage, pageSize, initData, loading } = props;
    const navigate = useNavigate();

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        getData(form.getFieldValue('postType'), pageNumber);
    };


    /**
   * 카드 클릭 이벤트
   * @param {*} item 
   */

    const handleCardClick = (item) => {
        navigate(`/post/${item.id}`);
        // initData();
    };

    /**
     * 스크랩 이벤트
     * @param {*} record 
     */
    const onScrapClicked = (e, item) => {
        e.stopPropagation();
        const postId = item.id;

        AXIOS.post(`/api/v1/common/scrap/${postId}`)
            .then(res => {
                if (res.status === 200) {
                    messageApi.open({
                        type: 'success',
                        content: `스크랩이 ${item.userScrapYn ? '취소' : ''} 되었습니다.`,
                        duration: 2,
                    })
                    const filterData = updateState(item.id, 'userScrapYn', item.userScrapYn);
                    setData(filterData)
                }
            }).catch(err => {
                error(err);
            })
    }

    /**
     * 좋아요 이벤트
     * @param {*} item 
     */
    const onLikeClicked = (e, item) => {
        e.stopPropagation();
        const postId = item.id;

        AXIOS.post(`/api/v1/common/like/${postId}`)
            .then(res => {
                if (res.status === 200) {
                    messageApi.open({
                        type: 'success',
                        content: `좋아요 가 ${item.userLikeYn ? '취소' : ''} 되었습니다.`,
                        duration: 2,
                    })
                    const filterData = updateState(item.id, 'userLikeYn', item.userLikeYn);
                    setData(filterData);
                }
            }).catch(err => {
                error(err);
            })
    }

    /**
     *  좋아요 혹은 스크랩 후 상태값 변경
    */
    const updateState = (postId, states, boolean) => {
        let cnt = 0;
        const updateData = data.map(item => {
            if (item?.id === postId) {
                boolean ? cnt = -1 : cnt = 1
                if (states === 'userLikeYn') return { ...item, ['likesCnt']: item?.likesCnt + cnt, [states]: !boolean };
                return { ...item, [states]: !boolean }; // id가 2인 요소의 name을 변경
            }
            return item; // 나머지 요소는 그대로 유지
        });
        return updateData;
    }


    const imageForm = (representativeImagePath) => {
        let imgPath = null
        // if(false){
        if (representativeImagePath != null && representativeImagePath != '') {
            imgPath = `url(/api/v1/view/image/${representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")})`
        } else {
            imgPath = `url(/api/v1/view/image/${REPRESENTATIVE_IMAGE?.split("/")?.filter(e => e != "")?.join("/")})`
        }
        return imgPath;
    }

    return (
        // <Spin spinning={loading} style={{width:'100%'}}>
            <div style={{width:'100%'}}>
            {contextHolder}
            <Form
                initialValues={{
                    postType: 'post' // 기본값으로 'post' 설정
                }}
                form={form}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                style={{
                    width: "100%",
                }}
            >
                {(form.getFieldValue('postType') === 'post' && (form.getFieldValue('keyword')?.trim() !== '' || typeof form.getFieldValue('keyword') !== 'undefined')) ?
                    <>
                        {data ?
                            <p style={{ fontSize: 14 }}>
                                <b >{form.getFieldValue('keyword') ?? '전체'}</b>의 <b>{form.getFieldValue('postType')}</b>검색 결과는 총 <b>{form.getFieldValue('totalElements')}</b> 건 입니다.
                            </p>
                            :
                            <></>
                        }
                        <StyledList
                            style={{ width: 'calc(100% + 20px)', maxHeight: '400px', overflowY: 'auto', paddingRight: 10, }} // 스크롤이 필요한 경우
                            dataSource={data}
                            renderItem={(item, Index) => (
                                <List.Item key={Index}>
                                    {/* <NavLink to='/post/1'> */}
                                    <StyledCard hoverable style={{ width: "100%", paddingLeft: 11 }} onClick={() => handleCardClick(item)}>
                                        <Row style={{ flexWrap: 'nowrap' }}>
                                            <Col span={14} align='left'
                                                style={{
                                                    maxWidth: 247,
                                                    minWidth: 247,
                                                    aspectRatio: '4/3',
                                                    backgroundImage: `${imageForm(item.representativeImagePath)}`,
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center center',
                                                    border: '1px solid #F0F0F0'
                                                }}>
                                                {/* 이미지 */}
                                                {/* {imgLoad(item.representativeImagePath)} */}

                                                {/* 태그 */}
                                                <div className='tagPosition' style={{ position: 'absolute', bottom: 'auto', left: 0, top: '-12px', zIndex: 2 }}>
                                                    <CustomTag menuName={item.menuNm2} strategicMarketingOnly = {item.strategicMarketingOnly} opacity={1} />
                                                    {/* <Badge.Ribbon color={item.strategicMarketingOnly ? 'red' : 'black'} text={item.menuNm2}></Badge.Ribbon> */}
                                                </div>
                                            </Col>
                                            <Col span={10} style={{ padding: 0, flex: '1 1 71%', maxWidth: '100%', width: '100%' }}>
                                                <StyledCardMeta>
                                                    <CustomCardMeta title={item.title} description={item.description} />
                                                    <div style={iconWrapStyle}>
                                                        {/* <CustomBoardInfoIcon  viewCnt={item.viewCnt} scrapes={item.userScrapYn} likes={item.userLikeYn} likesCnt={'223423'} /> */}

                                                        <div className='boardInfo-icon' style={{ overflow: 'hidden', color: '#8C8C8C', fontSize: '16px' }}>
                                                            {/* like */}
                                                            <button
                                                                style={{
                                                                    background: 'transparent',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    marginRight: '24px',
                                                                    float: 'left',
                                                                    color: '#8C8C8C'
                                                                }}
                                                                onClick={(e) => onLikeClicked(e, item)}
                                                            >
                                                                {item.userLikeYn ?
                                                                    <StyleIconWrap><LikeFilled style={{ fontSize: '16px' }} /> <span style={{ paddingLeft: '8px' }}>{item.likesCnt}</span></StyleIconWrap>
                                                                    :
                                                                    <StyleIconWrap><LikeOutlined style={{ fontSize: '16px' }} /> <span style={{ paddingLeft: '8px' }}>{item.likesCnt}</span></StyleIconWrap>
                                                                }
                                                            </button>
                                                            {/* view */}
                                                            <div style={{ display: 'inline-flex', alignItems: 'center', float: 'left' }}>
                                                                <EyeOutlined style={{ fontSize: '16px' }} /> <span style={{ paddingLeft: '8px' }}>{item.viewCnt}</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => onScrapClicked(e, item)}
                                                                style={{ display: 'inline-flex', alignItems: 'center', float: 'right', paddingLeft: '10px', background: 'transparent', marginTop: 1,cursor:'pointer' }}
                                                            >
                                                                {
                                                                    item.userScrapYn ? (
                                                                        <BookMarkFill style={{ fontSize: '16px' }} />
                                                                    ) : (
                                                                        <BookMarkLine style={{ fontSize: '16px' }} />
                                                                    )
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                </StyledCardMeta>
                                            </Col>
                                        </Row>
                                        {/* <div>
                                            <div>
                                                <div >
                                                    <Tag color="blue"> {`${item.menuNm1}  ${item.menuNm2}`}</Tag>
                                                </div>
                                                <div >
                                                    <>
                                                        {item.userLikeYn ?
                                                            <HeartFilled style={{ color: '#ff3399', fontSize : '30px'}} onClick={(e) => onLikeClicked(e, item)} />
                                                            :
                                                            <HeartOutlined style={{ color: '#ff3399', fontSize : '30px'}} onClick={(e) => onLikeClicked(e, item)} />
                                                        }
                                                    </>
                                                    <>
                                                        {item.userScrapYn ?
                                                            <StarFilled style={{ color: '#ffc000', fontSize : '30px' }} onClick={(e) => onScrapClicked(e, item)} />
                                                            :
                                                            <StarOutlined style={{ color: '#ffc000', fontSize : '30px' }} onClick={(e) => onScrapClicked(e, item)} />
                                                        }
                                                    </>
                                                    &nbsp; <b>view :</b> {`${item.viewCnt}`}
                                                </div>
                                                <div>
                                                    <Row gutter={16}>
                                                        <Col span={24} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                            <div>
                                                                <h3>{item.title}</h3>
                                                            </div>
                                                            <div>
                                                                <p>{item.description}</p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div> */}
                                    </StyledCard>
                                    {/* </NavLink> */}
                                </List.Item>
                            )}
                        />
                    </>
                    :
                    (form.getFieldValue('postType') === 'file' && (form.getFieldValue('keyword')?.trim() !== '' || typeof form.getFieldValue('keyword') !== 'undefined')) ?
                        <>
                            {data ?
                                <p style={{ fontSize: 14 }}>
                                    <b >{form.getFieldValue('keyword') ?? '전체'}</b>의 <b>{form.getFieldValue('postType')}</b>검색 결과는 총 <b>{form.getFieldValue('totalElements')}</b> 건 입니다.
                                </p>
                                :
                                <></>
                            }
                            <FileCardForm data={data} />
                        </>
                        : null
                }
                {
                    (data && data.length !== 0) ?
                        <div style={{ textAlign: 'center' }}>
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={form.getFieldValue('totalElements')}
                                onChange={handlePageChange}
                                // position= 'bottomCenter' 
                                showSizeChanger={false}
                                showQuickJumper={false}
                                style={{ marginTop: 32 }}
                            />
                        </div>
                        : null
                }
                <Layout >
                    <Content>

                    </Content>
                </Layout>
            </Form>
        {/* </Spin> */}
        </div>
    );
}


const iconWrapStyle = {
    width: '100%',
    height: '38px',
    padding: '8px 24px',
    boxSizing: 'border-box',
    borderTop: '1px solid #F0F0F0',
}

const StyledList = styled(List)`
    &{margin-bottom:16px}
    &.ant-list-split .ant-list-item,
    &.ant-list *:not(.ant-ribbon *){border:0;}

`;


const StyledCardMeta = styled(Row)`
    &{border: 1px solid #F0F0F0; padding:0;margin:0;border-left:0;}
    && .ant-card-meta{box-sizing: border-box;}
    `;

const StyledCard = styled(Card)`
    &.ant-card .ant-card-body {padding:0;}
    &&& .ant-card-body{border-top:1px solid rgb(240, 240, 240);border-bottom:1px solid rgb(240, 240, 240);border-right:1px solid rgb(240, 240, 240);}
`;


const StyleIconWrap = styled.div`
    cursor: pointer;
    height:100%;
    margin-top:3px;
    display: flex;
    align-items:center;
    color: #8C8C8C;
    &:hover{
        color:rgb(234, 29, 34);
    }
`;
