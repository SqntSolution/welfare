import { Space, Table, Tag, Button, message, Select, Row, Col, Flex, Switch, InputNumber } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs, Outline, Thumbnail } from 'react-pdf';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

export const PdfviewerComp = (props) => {
    const key2 = props?.key2
    const [contents, setContents] = useState(props?.contents);
    const [totalPageNo, setTotalPageNo] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const [viewAll, setSetViewAll] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [afterInit, setAfterInit] = useState(false);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setPdfLoaded(true)
        setTotalPageNo(numPages);
    }

    const callUpdateData = () => {
        const result = { key2: key2 }
        result.text = contents;
        props?.updateData?.(result)
        // setTestDynamic(result)
    }

    useEffect(() => {
        // console.log("=== props : ", props)
        setAfterInit(true)
    }, [])

    useEffect(() => {
        if (afterInit) {
            callUpdateData()
        }
    }, [contents])

    return (
        <>
            <Row>
                <Col span={24}>
                    page : <InputNumber min={1} max={totalPageNo} defaultValue={1} onChange={setPageNumber} value={pageNumber} /> <br />
                    <Switch checkedChildren="모두 보기" unCheckedChildren="한페이지씩 보기" value={viewAll} onChange={v => setSetViewAll(v)} />
                </Col>

                <Col span={24}>
                    Page {pageNumber} of {totalPageNo} <br />

                    <Document file="/kong2.pdf" onLoadSuccess={onDocumentLoadSuccess} loading="" >
                        <Row style={{ width: '100%' }}>
                            <Col flex="120px">
                                {
                                    pdfLoaded ?
                                        Array.from(new Array(totalPageNo), (el, index) => (
                                            <Thumbnail key={`thumb_${index + 1}`} pageNumber={index + 1} width={100}
                                                onItemClick={({ pageNumber }) => setPageNumber(pageNumber)}
                                            />
                                        ))
                                        :
                                        <>로딩중</>
                                }
                            </Col>
                            <Col flex="auto" >
                                {
                                    viewAll ? (
                                        Array.from(new Array(totalPageNo), (el, index) => (
                                            <Page
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                width={1000}
                                                renderTextLayer={false}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            {/* <Thumbnail /> */}
                                            <Page pageNumber={pageNumber} width={1000} renderTextLayer={false} />
                                        </>
                                    )
                                }

                            </Col>

                        </Row>
                    </Document>
                </Col>
            </Row>
        </>
    )
}