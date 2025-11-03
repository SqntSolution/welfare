// 파일 목록을 보여주는
import React, { useState, useEffect } from "react";
import { Space, List, Divider, App, Form, Col, message, Card, Tag, Spin, Avatar, Badge } from "antd";
import {
    StarOutlined, HeartFilled, HeartOutlined, LinkOutlined, StarFilled, FileOutlined,
    DownloadOutlined,
    FileImageOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import { useCopy } from 'hooks/helperHook';
import styled from "styled-components";

// import { EtcFileColorLine, ExcelColorLine, ExecelLine, HwplLine, ImgColorLine, PdfColorLine, PptColorLine, VideoColorLine } from 'components/common/IconComponets';
// import { ExtensionList } from 'utils/constants';
import { iconHandle } from 'utils/helpers';
import { Link } from 'react-router-dom';

export const FileCardForm = ({ data }) => {
    // const { notification } = App.useApp();
    const copy = useCopy()

    // 파일의 URL을 공유하는 로직
    const handleShare = (fileId) => {
        // const currentUrl = window.location.href;
        const host = window.location.host;
        const protocol = window.location.protocol;
        const link = `${protocol}//${host}/api/v1/download/${fileId}`
        copy(link)
    };

    // 파일을 다운로드 하는 로직
    const handleDown = (fileId) => {
        // console.log('파일 다운로드 구현예정');
        window.open(`/api/v1/download/${fileId}`)
    }

    // 파일 아이콘
    // const iconHandle = (fileExtension) => {
    //     if (ExtensionList.Pdf.includes(fileExtension?.toLowerCase())) {
    //         return (<PdfColorLine />)
    //     } else if (ExtensionList.Image.includes(fileExtension?.toLowerCase())) {
    //         return (<ImgColorLine />)
    //     } else if (ExtensionList.Excel.includes(fileExtension?.toLowerCase())) {
    //         return (<ExcelColorLine />)
    //     } else if (ExtensionList.PowerPoint.includes(fileExtension?.toLowerCase())) {
    //         return (<PptColorLine />)
    //     } else if (ExtensionList.Video.includes(fileExtension?.toLowerCase())) {
    //         return (<VideoColorLine />)
    //     } else {
    //         // 기본 파일 아이콘
    //         return (<EtcFileColorLine />);
    //     }
    // }

    return (
        <>
            {/* 리스트 20개까지 */}
            <StyledList
                style={{ width: '100%' }} // file
                dataSource={data}
                renderItem={(item, Index) => (
                    <List.Item key={Index} style={{ border: '1px solid #D9D9D9', padding: '9px 8px', marginBottom: 8, borderRadius: 2 }}>
                        <List.Item.Meta
                            // avatar={
                            //     <Avatar
                            //         shape="square"
                            //         src={`/api/v1/view/image/2024/c998e48a-4156-4bda-a6cc-245af6e86f83.png`}
                            //         size={64} />
                            // }
                            title={
                                <>
                                    <a target="_blank" className="ant-upload-list-item-name" title={item.fileNm} href={`/api/v1/download/${item.fileId}`}
                                        style={{
                                            display: "block",
                                            overflow: 'hidden',
                                        }} rel="noreferrer"
                                    >
                                        <StyledIcon>{iconHandle(item.fileExtension)}</StyledIcon>
                                        <StyledFileName>{item.fileNm}</StyledFileName>
                                    </a>
                                </>
                            }

                            description={(item.title ?? '') != '' ? <Link to={`/post/${item?.postId}`} style={{ paddingLeft: 24, marginTop: 2, fontSize: 14, color: "#999" }}>{item.title} </Link> : null}
                            style={{ padding: 0 }}
                        // description={<><Tag color={item.strategicMarketingOnly ? "red" : "blue"}>{`${item.menuNm1} , ${item.menuNm2}`}</Tag> {item.title}</>} 
                        />
                        {/* <Card hoverable style={{ width: '100%', height: '80px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                
                                <img src={`${item.filePath}`} alt="favicon" style={{ width: '100px', height: '100px', marginRight: '16px' }} />
                                <div>
                                    <div style={{ position: 'absolute', top: 10, left: 130 }}>
                                        <Tag color="blue">{`${item.menuNm1}  ${item.menuNm2}`}</Tag>
                                    </div>
                                    <div>
                                        <Row gutter={16}>
                                            <Col span={24} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <div>
                                                    <h3>{item.fileNm}</h3>
                                                </div>
                                                <div>
                                                    <p>{item.description}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                    <LinkOutlined onClick={handleShare} alt="favicon" style={{ width: '50px', height: '50px', marginRight: '5px', fontSize: '50px' }} />
                                    <DownloadOutlined onClick={handleDown} alt="favicon" style={{ width: '50px', height: '50px', marginRight: '5px', fontSize: '50px' }} />
                                </div>
                            </div>
                        </Card> */}
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <StyledBadge>
                                <Badge.Ribbon color={item.strategicMarketingOnly ? 'red' : 'black'} text={item.menuNm2}></Badge.Ribbon>
                            </StyledBadge>
                            <LinkOutlined onClick={() => handleShare(item.fileId)} title="link 복사" alt="favicon" style={{ width: '30px', height: '30px', marginRight: '5px', fontSize: '30px' }} />
                            {/* <DownloadOutlined onClick={() => handleDown(item.fileId)} alt="favicon"
                                style={{ width: '30px', height: '30px', marginRight: '5px', fontSize: '30px' }}
                                title={`${item.fileNm}`}
                            /> */}
                        </div>
                    </List.Item>
                )}
            />
        </>
    );


}


const StyledIcon = styled.span`
    display:inline-flex;
    color:black;
    font-size:40px;
    margin-right: 8px;
    float:left;
`;

const StyledFileName = styled.span`
    // font-size:15px;
    word-break:break-all;
`;

const StyledBadge = styled.div`
    .ant-ribbon.ant-ribbon-placement-end{
        border-radius: 2px;
        position: static;
        font-size:14px;
    }
    .ant-ribbon.ant-ribbon-placement-end .ant-ribbon-corner{display:none;}
`;

const StyledList = styled(List)`
.ant-list-item{min-height: 66px;}
&.ant-list .ant-list-item .ant-list-item-meta .ant-list-item-meta-title{margin:0;line-height : 1;}
`;