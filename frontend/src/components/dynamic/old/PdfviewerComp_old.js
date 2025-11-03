import { Space, Table, Tag, Button, message, Select, Row, Col, Flex, Switch, InputNumber } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs, Outline, Thumbnail } from 'react-pdf';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { AXIOS } from 'utils/axios';
import { pdfImgPath} from 'atoms/atom';
import styled from 'styled-components';
import { ArrowLeftOutlined, ArrowRightOutlined, BorderOutlined, FullscreenExitOutlined, FullscreenOutlined, SyncOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { AllOpenLine } from 'components/common/IconComponets';

const options = {
    cMapUrl: '/cmaps/',
};

/*
기존에 있던 것이라면 detailId 가 있을테고, 새로 올린거라면 path 이 있을 것이다.
path는 temp/ 로 시작한다.
*/
export const PdfviewerComp = (props) => {
    // const key2 = props?.key2
    const detailId = props?.detailId
    const path = props?.path
    const [totalPageNo, setTotalPageNo] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const [viewAll, setSetViewAll] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [width, setWidth] = useState(878 + 16)
    const fullScreenRef = useRef(null);
    const canvasRef = useRef(null);
    const setPdfImgPath = useSetRecoilState(pdfImgPath);
    const [screen, setScreen] = useState(true);
    const [, setRenderTrigger] = useState(false); // Dummy state to force re-render
    const scale = useRef(1.0);

    // pdf 줌 인 
    const handleZoomIn = () => {
        scale.current = Math.min(scale.current + 0.2, 2.0);
        setRenderTrigger((prev) => !prev); // Force re-render
    };

    // pdf 줌 아웃
    const handleZoomOut = () => {
        scale.current = Math.max(scale.current - 0.2, 0.5);
        setRenderTrigger((prev) => !prev); // Force re-render
    };

    const handleWheel = useCallback(
        (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                if (event.deltaY > 0) {
                    scale.current = Math.max(scale.current - 0.1, 0.5); // Zoom out
                    // handleZoomOut();
                } else {
                    scale.current = Math.min(scale.current + 0.1, 2.0); // Zoom in
                    // handleZoomIn();                    
                }
                setRenderTrigger((prev) => !prev); // Force re-render
            }
        },
        []
    );

    useEffect(() => {
        if (!screen) {
            const preventDefault = (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                }
            };
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('keydown', preventDefault, { passive: false });
            window.addEventListener('wheel', preventDefault, { passive: false });
            return () => {
                window.removeEventListener('wheel', handleWheel);
                window.removeEventListener('keydown', preventDefault);
                window.removeEventListener('wheel', preventDefault);
            };
        }
    }, [handleWheel, screen]);


    // https://babycoder05.tistory.com/entry/React-useEffect%EC%99%80-addEventListener-window-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A0%8C%EB%8D%94%EB%A7%81-%EA%B7%9C%EC%B9%99
    useEffect(() => {
        const onFullScreen = e => {
            //console.log("=== onFullScreen : ", e )
            // console.log("=== onFullScreen : ", document.fullscreenElement != null)
            if (document.fullscreenElement == null) {
                // document.exitFullscreen();
                setWidth(878 + 16)
                setScreen(true)
                scale.current = 1.0;
            }else{
                setWidth(window.innerWidth / 1.25)
                setScreen(false)
                
            }
        }
        window.addEventListener("fullscreenchange", onFullScreen);
        return () => {
            window.removeEventListener('fullscreenchange', onFullScreen);
        }
    }, [])

    const toggleFullScreen = () => {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
            setWidth(878 + 16);
            setScreen(true);
            scale.current = 1.0;
        } else {
            fullScreenRef?.current?.requestFullscreen()
            setWidth(window.innerWidth / 1.25)
            setScreen(false);
        }
    }

    const onDocumentLoadSuccess = async (pdf) => {
        // console.log("=== onDocumentLoadSuccess : ", pdf.numPages, pdf)
        const page = await pdf.getPage(1)
        // https://github.com/wojtekmaj/react-pdf/issues/669
        const width = page.view[2]
        const height = page.view[3]
        // console.log(`=== page:${page} , width:${width}, height:${height} `)
        if(detailId==null){
            // 신규로 등록했을때만 pdf thumbnail이미지 생성
            processCanvas(page)
        }

        setPdfLoaded(true)
        setTotalPageNo(pdf.numPages);
        for (let i = 1; i <= pdf.numPages; i++) {
            // preloading
            pdf.getPage(i)
        }
    }

    const processCanvas = (page) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };

        page.render(renderContext).promise.then(function () {
            uploadImage()
        });
    }

    const uploadImage = () => {
        const canvas = canvasRef.current;
        canvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append('file', blob, 'pdf-thumbnail.png');
            AXIOS
                .post("/api/v1/image", formData,)
                .then((response) => {
                    // console.log("이미지가 업로드되었습니다.", response?.data?.path);
                    setPdfImgPath(response?.data?.path)
                })
                .catch((error) => {
                    console.error("이미지 업로드 중 오류가 발생했습니다.", error);
                });
        });

    }

    // pdf 파일에 대한 url. 기존에 있던 파일이라면 detailId가 있을테고, 새로운 파일이라면 path이 있을꺼다.
    let fileUrl = null
    // detailId, path
    if (path != null && path?.startsWith("temp/")) {
        fileUrl = `/api/v1/view/pdf/${path}`
    } else if (detailId != null && detailId != "") {
        fileUrl = `/api/v1/view/pdf/post/${detailId}`
    }
    // console.log("=== Pdfviewrcomp : ", fileUrl, path, detailId, props)

    const togglePageList = ()=>{
        setSetViewAll(!viewAll);
    }
    return (
        <>
            <Row style={{ width: '100%', marginTop:16,marginBottom:48}}>
                <Col span={24}>
                    <div style={{ width: '100%',position: 'relative',overflow: screen ? 'visible' : 'auto', }} ref={fullScreenRef}>

                        {(pdfLoaded) ? (
                            <Flex justify='flex-end' gap={16} style={{marginBottom:12,paddingLeft:  screen ? 260 : 130,}}>
                                
                                <div 
                                    style={{
                                        display:'flex',
                                        gap:8,
                                        alignItems:'center',
                                        margin:'0 auto',
                                        color:`${screen ? 'rgba(38, 38, 38, 0.88)' :'#fff'}`}}
                                    >
                                    <InputNumber style={{width:70}} min={1} max={totalPageNo} defaultValue={1} onChange={setPageNumber} value={pageNumber} />  / {totalPageNo}</div>
                                {/* <Switch checkedChildren="모두 보기" unCheckedChildren="한페이지씩 보기" value={viewAll} onChange={v => setSetViewAll(v)} /> */}
                                {!screen ? (
                                    <>
                                        <Button disabled={viewAll} onClick={handleZoomOut}>
                                            <ZoomOutOutlined />
                                        </Button>
                                        <Button disabled={viewAll} onClick={handleZoomIn}>
                                            <ZoomInOutlined />
                                        </Button>
                                    </>
                                    ) : null
                                }
                                
                                <StyledButton onClick={v => togglePageList()} icon={viewAll ? <BorderOutlined /> : <AllOpenLine />}
                                    style={{display:`${screen ? 'flex' :'none'}`,alignItems:'center'}}
                                >
                                    {viewAll ? '한 화면씩 보기': "모두 보기"}
                                </StyledButton>
                                <Button disabled={viewAll} onClick={() => toggleFullScreen()} icon={screen ? <FullscreenOutlined />  : <FullscreenExitOutlined />}>
                                    { screen ? "크게 보기" : "작게 보기"}
                                </Button>
                            </Flex>
                            ) : null
                        }


                        <StyledPdfBox style={{ width: '100%',position:'relative',border: screen ?  '1px solid #d9d9d9' : ''}}>
                            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} 
                                loading={ <Tag style={{margin:20}} color="processing"> 로딩중 </Tag>} 
                                options={options} >
                                <div style={{maxHeight:  screen ?  "none" : "100vh",}}>
                                    {
                                        viewAll ? (
                                            Array.from(new Array(totalPageNo), (el, index) => (
                                                <Page
                                                    className='pdfBox'
                                                    key={`page_${index + 1}`}
                                                    pageNumber={index + 1}
                                                    width={width}
                                                    renderTextLayer={true}
                                                />
                                            ))
                                        ) : (
                                            <Page className='pdfBox' pageNumber={pageNumber} width={width - 16} renderTextLayer={true} scale={scale.current} />
                                        )
                                    }
                                </div>
                            </Document>
                            {
                                (pdfLoaded && !viewAll) ? (
                                    <div className='pdfButton-box'>
                                        <Button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)} shape="round">
                                            <ArrowLeftOutlined />
                                        </Button>
                                        <Button disabled={pageNumber >= totalPageNo} onClick={() => setPageNumber(pageNumber + 1)} shape="round">
                                            <ArrowRightOutlined />
                                        </Button>
                                    </div>
                                ) : null
                            }
                        </StyledPdfBox>
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                    </div>

                </Col>
            </Row>
        </>
    )
}

const StyledPdfBox = styled.div`
        &{
            position: relative;
        }
        .pdfButton-box{
            button{
                width:60px;height: 60px;
                position: absolute; top:50%; transform: translateY(-50%);
                z-index: 10;
                font-size:30px;
                color:rgba(0, 0, 0, 0.85);
                box-shadow: 0px 10.5px 10.5px 0px rgba(0, 0, 0, 0.14);
                border:0;
            }
           button{
            &.ant-btn-default:disabled,&.ant-btn-default.ant-btn-disabled{ background: #ededed; opacity: 0.5;}
           }
            button:first-child{left : 45px}
            button:last-child{right : 45px;}
        }
        .pdfBox{
            margin: 0 auto;
            width: fit-content;
        }
`;

const StyledButton = styled(Button)`
        &:hover path{fill: #eb2d2b}
`;