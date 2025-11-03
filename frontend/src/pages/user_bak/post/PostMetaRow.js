// post 상세에서, 메타정보를 보여주는 Row
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, Divider, Row, Col, Input, Card, Typography, Avatar, Descriptions, Flex, } from 'antd';
import styled from 'styled-components';
import { Link, Route, Switch, BrowserRouter as Router, useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { useMsg, useSetMenus, useGetMenus } from 'hooks/helperHook';

export const PostMetaRow = ({ nations, topics, strategicMarketingOnly, postInfo, isPost = true }) => {
    const [smartFinderUrl, setSmartFinderUrl] = useState("/")
    const menus = useGetMenus()
    const navigate = useNavigate();
    useEffect(() => {
        // console.log("=== menus : ", menus)
        const path = menus?.find(e => e.contentType == 'smartfinder')?.menuEngNm
        if (path != null) {
            setSmartFinderUrl(`${path}`)
        }
    }, [menus])

    return (

        <Row style={{
            width: '100%',

            border: '0px',
            background: '#FAFAFA',

        }} justify='center' gutter={[2, 0]} >
            <Col span={12}>
                {
                    isPost ? (

                        (nations)?.map(e => (
                            <StyledTag onClick={() => navigate(`/main/${smartFinderUrl}?nations=${e?.value}`)}>{e?.label}</StyledTag>
                        ))
                    ) : (
                        null
                    )
                }
                {
                    isPost ? (
                        (topics)?.map(e => (
                            <StyledTag onClick={() => navigate(`/main/${smartFinderUrl}?topics=${e?.value}`)}>{e?.label}</StyledTag>
                        ))

                    ) : (
                        null
                    )
                }
                {
                    isPost ? (
                        strategicMarketingOnly === true ? (
                            <StyledTag2 onClick={() => navigate(`/main/${smartFinderUrl}?strategicMarketingOnly=Y`)} style={{ color: "#eb2d2b", borderColor: "#eb2d2b" }}>전략마케팅</StyledTag2>
                        ) : null

                    ) : (
                        null
                    )
                }
            </Col>
            <Col span={12}>
                <StyledFlex style={{width:'100%',alignItems:'center'}} justify='flex-end' wrap='wrap' >
                    <StyledDescriptions size='small' style={{ fontSize: 14 }}>
                        <DescriptionsItem>
                            <Avatar icon={<UserOutlined />} 
                            // src={(postInfo?.avatarImgPath == null) ? null : (`/api/v1/image/${postInfo?.avatarImgPath}`)} 
                            src={postInfo?.avatarImgPath ? `/api/v1/image/${postInfo.avatarImgPath}` : null}
                            />
                            <span style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.85)',lineHeight:"35px"}}>{postInfo?.createdUserNm ?? ''}</span>
                        </DescriptionsItem>
                    </StyledDescriptions>

                    <StyledDescriptions size='small' style={{ fontSize: 14 }}>
                        <DescriptionsItem label="Create" style={{ fontSize: 14 }}>{postInfo?.createdAt?.substring(0, 10)}</DescriptionsItem>
                        <DescriptionsItem label="Update" style={{ fontSize: 14 }}>
                            {postInfo?.modifiedAt != null ?
                                (<> {postInfo?.modifiedAt?.substring(0, 10)}</>) : (null)
                            }
                        </DescriptionsItem>
                    </StyledDescriptions>
                </StyledFlex>
            </Col>
        </Row>
    )
}

const StyledTag = styled(Tag)`
    background : #fff;
    color: #000;
    cursor:pointer;
    `;

const StyledTag2 = styled(Tag)`
    background : #fff;
    color: magenta;
    cursor:pointer;
`;

const StyledDescriptions = styled(Descriptions)`
    &.ant-descriptions .ant-descriptions-item-content,
    &.ant-descriptions .ant-descriptions-item-container .ant-descriptions-item-label{font-size: 14px;}
    &.ant-descriptions .ant-descriptions-item-container .ant-descriptions-item-label{color:rgba(0, 0, 0, 0.85) }
    &.ant-descriptions .ant-descriptions-item-content{color:#8C8C8C}
    &.ant-descriptions-small .ant-descriptions-row >th, 
    &.ant-descriptions-small .ant-descriptions-row >td{padding-bottom:0;}
    &.ant-descriptions .ant-descriptions-item-container .ant-descriptions-item-content{display: table-cell;}
    &.ant-descriptions .ant-descriptions-row:last-child { display: flex;flex-direction: row;align-items: center;justify-content: flex-end;gap: 8px;}
`;

const StyledFlex = styled(Flex)`
&{align-items: center;gap: 8px;}
& .ant-descriptions .ant-descriptions-view table{width: fit-content;}
`