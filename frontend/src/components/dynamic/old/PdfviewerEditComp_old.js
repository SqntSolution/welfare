// pdf 새로 업로드 및 수정하기 위한 component
import { Space, Table, Tag, Button, message, Select, Row, Col, Flex, Switch, InputNumber } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs, Outline, Thumbnail } from 'react-pdf';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { FileUpload } from 'components/common/FileUpload'
import { PdfviewerComp } from './PdfviewerComp'
import { FilePdfOutlined } from '@ant-design/icons';

export const PdfviewerEditComp = (props) => {
    const key2 = props?.key2
    const detailId = props?.id
    const path = props?.path
    const [totalPageNo, setTotalPageNo] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const [viewAll, setSetViewAll] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [afterInit, setAfterInit] = useState(false);
    const [width, setWidth] = useState(878 + 16)
    const [validFile, setValidFile] = useState();
    const [pdfProps, setPdfProps] = useState();
    const [uploadedPath, setUploadedPath] = useState();

    useEffect(() => {

    }, [props])

    useEffect(() => {
        if (validFile != null) {
            // {"uid":"temp/20cf7e6b-b5c8-4263-8463-e68a79ee3485","lastModified":1711773364336,"lastModifiedDate":"2024-03-30T04:36:04.336Z","name":"홍현표-ITQ자격취득내역서(한글).pdf","size":56007,"type":"application/pdf","percent":100,"originFileObj":{"uid":"rc-upload-1711893508504-5"},"status":"done","response":null,"xhr":{},"path":"temp/20cf7e6b-b5c8-4263-8463-e68a79ee3485","url":"/api/v1/download/temp/20cf7e6b-b5c8-4263-8463-e68a79ee3485?name=%ED%99%8D%ED%98%84%ED%91%9C-ITQ%EC%9E%90%EA%B2%A9%EC%B7%A8%EB%93%9D%EB%82%B4%EC%97%AD%EC%84%9C(%ED%95%9C%EA%B8%80).pdf","fileExtension":"pdf","filename":"홍현표-ITQ자격취득내역서(한글).pdf","fileSize":56007}
            // temp/58e15b84-87db-409d-8a89-7a5d4ba30a79
            const path = validFile.path
            setUploadedPath(path)
            // console.log("=== path : ", path)
        }
    }, [validFile])

    const callUpdateData = () => {
        console.log("=== callUpdateData")
        const result = { key2: key2 }
        result.path = uploadedPath;
        props?.updateData?.(result)
        // setTestDynamic(result)
    }

    useEffect(() => {
        // console.log("=== props : ", props)
        setAfterInit(true)
    }, [])

    useEffect(() => {
        console.log("== path modified")
        if (uploadedPath != null && afterInit) {
            callUpdateData()
            // setValidFile(null)
        }
    }, [uploadedPath])

    return (
        <>
            {/* === validFile : {validFile?.path} <br/> path:{path} <br /> */}
            {/* <br key="110" /> */}

            <Row style={{ width: '100%', padding: 5, border: '1px solid #d1defc', }}>
                <Col span={24}>
                    <FileUploadArea setValidFile={setValidFile} initialFile={null} />
                </Col>
                <Col span={24}>
                    <PdfviewerComp  {...props} detailId={detailId} path={path} />
                </Col>
            </Row>
        </>
    )
}


const FileUploadArea = ({ initialFile: initialFile, setValidFile: setValidFile }) => {
    const [path, setPath] = useState()
    // const [validFileList, setValidFileList] = useState([])


    // initialFile = 
    //     {
    //         "id": 1,
    //         "postId": 1,
    //         "fileClass": 'post',
    //         "fileNm": "브라우저인증서사용방법.pdf",
    //         "fileExtension": "pdf",
    //         "fileSize": 66308,
    //     } 


    return (
        <>
            <div>
                <FileUpload readOnly={false} initialFileList={initialFile == null ? [] : [initialFile]} setValidFileList={list => setValidFile(list?.[0])} maxCount={1}
                    etcDescription={
                        <>
                            <FilePdfOutlined style={{fontSize:48}}/>
                            <p style={{ fontSize: 16,marginBottom:0 }}>pdf 파일을 마우스로 끌어오거나 여기를 클릭하여 첨부하세요.</p>
                        </>
                    }
                    height='auto'
                />
            </div>
        </>
    )
}