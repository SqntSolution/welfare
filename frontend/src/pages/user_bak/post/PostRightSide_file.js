// 오른편에, file download 
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import {
    ShareAltOutlined, StarFilled, LinkOutlined,
    DownloadOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { coverImgStyle } from 'utils/helpers'
import { FileUpload } from 'components/common/FileUpload'
import { useLocation } from 'react-router-dom';
// const imgStyle = {
//     objectFit: "cover", margin: 'auto', width: '100%', height: '100%',
// }
import { useCopy } from 'hooks/helperHook';
import Paragraph from 'antd/es/typography/Paragraph';
// import { EtcFileColorLine, ExcelColorLine, ExecelLine, HwplLine, ImgColorLine, PdfColorLine, PptColorLine, VideoColorLine } from 'components/common/IconComponets';
// import { ExtensionList } from 'utils/constants';
import {iconHandle} from 'utils/helpers';
import styled from 'styled-components';

export const PostRightSide_file = ({ files }) => {
    // console.log("=== files : ", files)
    const { notification } = App.useApp();
    const location = useLocation();
    const copy = useCopy()

    const copyLink = (id) => {
        // const currentUrl = window.location.href;
        const host = window.location.host;
        const protocol = window.location.protocol;
        const link = `${protocol}//${host}/api/v1/download/${id}`
        copy(link)
    }

    // 파일을 다운로드
    const onClickFileDownload = (fileId) => {
        window.open(`/api/v1/download/${fileId}`)
    }

    return (
        <>
            <Row style={{
                width: '100%',
                backgroundColor: 'white',
                marginBottom: 24
            }}
            >
                <Col span={24} style={{ height: 40, padding: '0 16px', color: 'rgba(0, 0, 0, 0.85)', fontSize: 16, fontWeight: 500, lineHeight: '40px' }} >
                    File
                </Col>
                {
                    files?.map(e => (
                        <Row
                            key={e.id}
                            style={{ width: '100%', border: '1px solid #D9D9D9', marginTop: 8, padding: '9px 8px', borderRadius: 2, }}
                            align='middle'
                            title={e?.fileNm}
                        >
                            <StyledIconCol span={2}>{iconHandle(e.fileExtension)}</StyledIconCol>

                            <Col span={20}>
                                <Flex align='center' onClick={() => onClickFileDownload(e?.id)} style={{ cursor: 'pointer' }}>
                                    <Paragraph ellipsis={{ rows: 3 }} style={{ margin: 0, fontSize: 14, wordBreak: 'break-all' }}  >{e?.fileNm}</Paragraph>
                                </Flex>
                            </Col>
                            <Col span={2} align='right' style={{ display: 'inline-flex', gap: '16px', fontSize: 18, color: 'rgba(0, 0, 0, 0.85)', justifyContent: 'flex-end' }} >
                                <LinkOutlined onClick={() => copyLink(`${e?.id}`)} title='링크 복사' />
                            </Col>

                        </Row>
                    ))
                }
            </Row>

        </>
    )
}

const StyledIconCol = styled(Col)`
    display:inline-flex;
    color:black;
    font-size:24px;
    margin-right: 0;
    float:left;
`;