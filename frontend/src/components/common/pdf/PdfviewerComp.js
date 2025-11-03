/**
 * @file PdfviewerComp.js
 * @description pdf뷰어
 * @author 이병은
 * @since 2025-06-16 16:12
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-16 16:12    이병은       최초 생성
 **/
import { Tag, InputNumber, Input, Slider, Drawer } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useSetRecoilState } from 'recoil';
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { AXIOS } from 'utils/axios';
import { pdfImgPath } from 'atoms/atom';
import { ArrowLeftOutlined, ArrowRightOutlined, LoadingOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { isEmptyCheck } from 'utils/helpers';
import { usePdfPreview } from 'hooks/helperHook';
import { LuArrowDown, LuArrowUp, LuList, LuMinimize, LuRows3, LuScan, LuScreenShare, LuSearch, LuSquare } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFFlexCenter, SFMedia } from 'styles/StyledFuntion';

/*
기존에 있던 것이라면 detailId 가 있을테고, 새로 올린거라면 path 이 있을 것이다.
path는 temp/ 로 시작한다.
*/
export const PdfviewerComp = (props) => {
    const BASE_WIDTH = 878 + 16;
    const EXTRA_SIDEBAR_WIDTH = 300;
    // const key2 = props?.key2
    const detailId = props?.detailId;
    const path = props?.path;
    const isPreviewPopup = props?.isPreviewPopup;
    const isNewWindow = props?.isNewWindow;
    const fileId = props?.fileId;
    const canFileDownload = props?.canFileDownload;
    const isEdit = props?.isEdit ?? false;
    const sideBarAct = props?.sideBarAct;
    const readOnly = props?.readOnly;
    const [totalPageNo, setTotalPageNo] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [viewAll, setSetViewAll] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [width, setWidth] = useState(BASE_WIDTH)
    const fullScreenRef = useRef(null);
    const canvasRef = useRef(null);
    const setPdfImgPath = useSetRecoilState(pdfImgPath);
    const [screen, setScreen] = useState(true);
    const [scale, setScale] = useState(1.0);
    const pdfRef = useRef(null); // pdf 컨트롤을 위한 ref(휠 이벤트, 방향키 이벤트)
    const [searchText, setSearchText] = useState(""); // 검색어
    const [pdfInstance, setPdfInstance] = useState(null); // pdf 객체를 저장하기 위한 state
    const [matches, setMatches] = useState([]); // 찾은 검색어
    const searchTextIdxRef = useRef(0); // 이전 검색 idx
    const prevSearchTextRef = useRef(""); // 이전 검색어
    const isListenerAdded = useRef(null) // 전체화면 감지를 위한 ref
    const [searchLoad, setSearchLoad] = useState(false); // 검색 시 로딩
    const [isListOpen, setIsListOpen] = useState(false); // pdf뷰어 목록
    const searchInputRef = useRef(null);
    const { openNewWindow } = usePdfPreview();
    const searchAbortController = useRef(null); // 검색어 취소 요청 컨트롤러
    const debounceRef = useRef(null) // 검색어 디바운스
    const [thumbnails, setThumbnails] = useState([]);


    const options = useRef({
        cMapUrl: "/cmaps/",
    });


    // pdf 줌 인 
    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.2, 2.0));
    };

    // pdf 줌 아웃
    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.2, 0.2));
    };

    // 휠 줌 이벤트
    const handleWheel = useCallback(
        (event) => {
            if (!screen && event.ctrlKey) {
                setScale((prev) => event.deltaY > 0 ? Math.max(prev - 0.1, 0.2) : Math.min(prev + 0.1, 2.0))
            }
        },
        [screen]
    );


    // 마우스 휠 줌 할때 기본 브라우저 이벤트 방지
    const preventZoom = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, []);

    // 방향키로 pdf 페이지 이동
    const handleKeydown = useCallback((event) => {
        if (!screen) {
            if (event.key === "ArrowLeft") {
                prevPage();
            }

            if (event.key === "ArrowRight") {
                nextPage();
            }
        }
    }, [screen])


    // pdf 페이지 이동
    const nextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, totalPageNo));
    };

    const prevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };


    useEffect(() => {
        if (!screen) {
            window.addEventListener('wheel', preventZoom, { passive: false });
            window.addEventListener('keydown', preventZoom);
        }
        return () => {
            window.removeEventListener('wheel', preventZoom);
            window.removeEventListener('keydown', preventZoom);
        };
    }, [screen]);

    // 새창으로 pdf 뷰여 열었을 경우 사이즈 조절
    const handleResize = useCallback(() => {
        let maxWidth = window.innerWidth * 0.9;
        if (!isNewWindow && pdfRef.current) {
            maxWidth = pdfRef.current.clientWidth * 0.9;
        }
        const calcWidth = window.innerHeight * 1.414;
        const calcMaxWidth = Math.min(calcWidth, maxWidth);

        setWidth(calcMaxWidth);
    }, [pdfRef.current, isNewWindow])


    useEffect(() => {
        const onFullScreen = e => {
            if (isListenerAdded.current !== fullScreenRef.current) return;
            // console.log("=== onFullScreen : ", e)
            // console.log("=== onFullScreen : ", document.fullscreenElement != null)
            if (document.fullscreenElement == null) {
                // document.exitFullscreen();
                handleResize();

                setScreen(true)
                // scale.current = 1.0;
                isListenerAdded.current = null;
                setScale(1.0);
            } else {
                handleResize();

                setScreen(false)
            }
        }
        window.addEventListener("fullscreenchange", onFullScreen);
        return () => {
            window.removeEventListener('fullscreenchange', onFullScreen);
            if (pdfInstance) {
                pdfInstance.destroy();
            }
            isListenerAdded.current = null;
        }
    }, [])


    useEffect(() => {
        if (pdfRef.current) {
            window.addEventListener("resize", handleResize)
        }
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [pdfRef.current])

    useEffect(() => {
        if (document.fullscreenElement == null && pdfRef.current) {
            handleResize();
        }
    }, [pdfRef.current])


    const toggleFullScreen = () => {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
            handleResize();

            isListenerAdded.current = null;
            setScreen(true);
            setScale(1.0);
        } else {
            isListenerAdded.current = fullScreenRef?.current;
            fullScreenRef?.current?.requestFullscreen()
            handleResize();

            setScreen(false);
            pdfRef.current.focus();
        }
    }

    const onDocumentLoadSuccess = async (pdf) => {
        // console.log("=== onDocumentLoadSuccess : ", pdf.numPages, pdf)
        const page = await pdf.getPage(1)
        // https://github.com/wojtekmaj/react-pdf/issues/669
        const width = page.view[2]
        const height = page.view[3]
        // console.log(`=== page:${page} , width:${width}, height:${height} `)
        if ((detailId == null || isEdit) && !isPreviewPopup) {
            // 신규로 등록했을때만 pdf thumbnail이미지 생성
            processCanvas(page)
        }


        // 썸네일 리스트 생성
        const thumbList = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);

            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            const imgData = canvas.toDataURL("image/jpeg");

            thumbList.push(imgData);
        }
        setThumbnails(thumbList);

        handleResize();

        setPdfLoaded(true)
        setPdfInstance(pdf);
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
                    setPdfImgPath(response?.data?.path)
                })
                .catch((error) => {
                    console.error("이미지 업로드 중 오류가 발생했습니다.", error);
                });
        });

    }


    const searchInPDFWithAbort = async (text, type) => {
        const searchTextTmp = text.trim().normalize('NFC');

        // 이전 검색이 실행 중이면 중단
        if (searchAbortController.current) {
            searchAbortController.current.abort();
        }

        if (!pdfInstance || isEmptyCheck(searchTextTmp)) {
            resetSearch();
            return;
        }

        if (!type && matches?.length && searchTextTmp === prevSearchTextRef.current) {
            nextSearchTextPage(matches);
            return;
        }

        // 새로운 AbortController 생성
        searchAbortController.current = new AbortController();
        const { signal } = searchAbortController.current;

        try {
            setSearchLoad(true);
            clearHighlightTextLayer();

            const allMatches = await findTextPageWithAbort(pdfInstance, searchTextTmp, signal);

            if (signal.aborted) return;

            if (allMatches.length) {
                searchTextIdxRef.current = 0;
                prevSearchTextRef.current = searchTextTmp;
                setMatches(allMatches);
                setPageNumber(allMatches[0]);
            } else {
                setMatches([]);
            }
        } catch (error) {
            if (error.message === "AbortError") {
            } else {
                console.error("❌ 검색 중 오류:", error);
                setMatches([]);
            }
        } finally {

            if (searchAbortController.current === signal) {
                searchAbortController.current = null;
            }
        }
    };

    // pdf 내 텍스트 찾기
    const findTextPage = async (pdfInstance, searchTextTmp) => {
        const searchPromises = Array.from({ length: totalPageNo }, (_, i) =>
            pdfInstance.getPage(i + 1)
                .then(page => page.getTextContent())
                .then(({ items }) => {
                    const fullText = items.map(({ str }) => str.toLowerCase().normalize("NFC")).join("");
                    return fullText.includes(searchTextTmp.toLowerCase()) ? i + 1 : null;
                })
                .catch(() => null) // 개별 페이지 오류 방지
        );

        // 검색 결과 필터링
        return (await Promise.all(searchPromises)).filter(Boolean);
    }

    const findTextPageWithAbort = async (pdfInstance, searchTextTmp, signal) => {
        const searchPromises = Array.from({ length: totalPageNo }, (_, i) =>
            pdfInstance.getPage(i + 1)
                .then(page => page.getTextContent())
                .then(({ items }) => {
                    if (signal.aborted) {
                        throw new Error("AbortError")
                    };
                    const fullText = items.map(({ str }) => str.toLowerCase().normalize("NFC")).join("");
                    return fullText.includes(searchTextTmp.toLowerCase()) ? i + 1 : null;
                })
                .catch((error) => { throw error })
        );

        return (await Promise.all(searchPromises)).filter(Boolean);
    };


    // 검색 시 하이라이트 지우기
    const clearHighlightTextLayer = () => {
        pdfRef.current.querySelectorAll('.highlight-overlay').forEach(el => el.remove());
    };


    // 하이라이트 인덱스 계산 함수
    const getMultiSpanIndices = (spans, searchText) => {
        const normalizedSearch = searchText?.toLowerCase().normalize('NFC');
        const searchChars = [...normalizedSearch]; // 검색어를 한 글자씩 배열로 변환
        const results = [];

        for (let i = 0; i < spans.length; i++) {
            const text = spans[i].innerText.toLowerCase().normalize('NFC').trim();
            if (!text) continue; // 빈 span 건너뛰기

            for (let startPos = 0; startPos < text.length; startPos++) {
                if (text[startPos] !== searchChars[0]) continue; // 검색어의 첫 글자와 매칭되는 지점 찾기

                let startIdx = i;
                let endIdx = i;
                let searchIndex = 0;
                let found = true;

                for (let j = i; j < spans.length; j++) {
                    const spanText = spans[j].innerText.toLowerCase().normalize('NFC').trim();
                    if (!spanText) continue; // 빈 span 무시

                    for (let charIdx = (j === i ? startPos : 0); charIdx < spanText.length; charIdx++) {
                        if (spanText[charIdx] === searchChars[searchIndex]) {
                            searchIndex++;
                            if (searchIndex === searchChars.length) {
                                endIdx = j;
                                break;
                            }
                        } else {
                            found = false;
                            break;
                        }
                    }
                    if (!found || searchIndex === searchChars.length) break;
                }

                if (found && searchIndex === searchChars.length) {
                    results.push({ start: startIdx, end: endIdx });
                }
            }
        }

        return results;
    };

    // 텍스트 하이라이트 오버레이 방식 공백제외(현재 사용중)
    const highlightPerCharWithoutSpace = (searchText, currentPage) => {
        if (!searchText || !pdfRef.current) return;

        const normalizedSearch = searchText.normalize('NFC').toLocaleLowerCase();
        const searchChars = [...normalizedSearch]; // 문자 단위 배열로

        const pageEl = pdfRef.current.querySelector(`.react-pdf__Page[data-page-number="${currentPage}"]`);
        if (!pageEl) return;

        const textLayer = pageEl.querySelector('.react-pdf__Page__textContent');
        const spans = Array.from(textLayer.querySelectorAll('span[role="presentation"]'));

        if (!textLayer || textLayer.childNodes.length === 0) {
            return; // textLayer 가 존재하지 않으면 건너 뜀
        }

        // 전체 텍스트 합치기
        const fullText = spans.map(span => span.textContent ?? '').join('');
        const normalizedFullText = fullText.normalize('NFC').toLocaleLowerCase();

        // 기존 오버레이 제거
        textLayer.querySelectorAll('.highlight-overlay').forEach(el => el.remove());

        // 모든 일치 위치 찾아서 문자 단위로 처리
        let matchIndex = 0;
        while ((matchIndex = normalizedFullText.indexOf(normalizedSearch, matchIndex)) !== -1) {
            // span 경계 기준으로 문자 인덱스 추적
            let charCount = 0;
            let startSpanIdx = 0;
            const spanOffsets = spans.map(span => {
                const len = (span.textContent ?? '').length;
                const start = charCount;
                const end = charCount + len;
                charCount += len;
                return { start, end };
            });

            for (let i = 0; i < searchChars.length; i++) {
                const char = searchChars[i];
                const indexInDoc = matchIndex + i;

                if (/\s/.test(char)) continue; // 공백이면 스킵

                // 어떤 span 안에 포함돼 있는지 찾기
                const spanInfo = spanOffsets.find((s, idx) => {
                    if (indexInDoc >= s.start && indexInDoc < s.end) {
                        startSpanIdx = idx;
                        return true;
                    }
                    return false;
                });

                if (!spanInfo) continue;

                const span = spans[startSpanIdx];
                const node = span.firstChild;
                if (!node) continue;

                const offset = indexInDoc - spanInfo.start;

                try {
                    const range = document.createRange();
                    range.setStart(node, offset);
                    range.setEnd(node, offset + 1); // 한 글자만 선택

                    const rects = range.getClientRects();
                    for (const rect of rects) {
                        if (rect.width < 1 || rect.height < 1) continue; // 너무 작으면 skip

                        const overlay = document.createElement('div');
                        overlay.className = 'highlight-overlay';
                        overlay.style.position = 'absolute';
                        overlay.style.left = `${rect.left - textLayer.getBoundingClientRect().left}px`;
                        overlay.style.top = `${rect.top - textLayer.getBoundingClientRect().top}px`;
                        overlay.style.width = `${rect.width}px`;
                        overlay.style.height = `${rect.height}px`;
                        overlay.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
                        overlay.style.pointerEvents = 'none';
                        textLayer.appendChild(overlay);
                    }
                } catch (e) {
                    console.warn("하이라이트 range 오류", e);
                }
            }

            matchIndex += normalizedSearch.length;
        }
    };


    // 검색어 초기화 이벤트
    const resetSearch = () => {
        if (!isEmptyCheck(prevSearchTextRef.current) || isEmptyCheck(searchText)) {
            clearHighlightTextLayer();
        }
        searchTextIdxRef.current = 0;
        prevSearchTextRef.current = "";
        setMatches([]);
    }

    // 찾은 결과 다음페이지로 이동 이벤트
    const nextSearchTextPage = (allMatches) => {
        if (!allMatches.length) return;
        searchTextIdxRef.current = (searchTextIdxRef.current + 1) % allMatches.length;
        if (viewAll) {
            const el = pdfRef.current.querySelector(`.react-pdf__Page[data-page-number="${allMatches[searchTextIdxRef.current]}"]`);
            if (el) {
                const rect = el?.getBoundingClientRect();
                const y = window.scrollY + rect.top - 62;

                window.scrollTo({ top: y, behavior: 'smooth' });
                // el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        setPageNumber(allMatches[searchTextIdxRef.current]);
    }

    // 찾은 결과 이전 페이지로 이동 이벤트
    const prevSearchTextPage = (allMatches) => {
        if (!allMatches.length) return;
        searchTextIdxRef.current = (searchTextIdxRef.current + 1) % allMatches.length;
        if (viewAll) {
            const el = pdfRef.current.querySelector(`.react-pdf__Page[data-page-number="${allMatches[searchTextIdxRef.current]}"]`);
            if (el) {
                const rect = el?.getBoundingClientRect();
                const y = window.scrollY + rect.top - 62;

                window.scrollTo({ top: y, behavior: 'smooth' });
                // el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        setPageNumber(allMatches[searchTextIdxRef.current]);
    };


    useEffect(() => {
        if (isEmptyCheck(prevSearchTextRef.current) || matches.length < 1) return;

        let observerList = [];

        const checkAndHighlight = (pageNum) => {
            const textLayer = pdfRef.current.querySelector(`.react-pdf__Page[data-page-number="${pageNum}"] .react-pdf__Page__textContent`);
            if (textLayer && textLayer.childNodes.length > 0) {
                setTimeout(() => { highlightPerCharWithoutSpace(prevSearchTextRef.current, pageNum); }, 300);
            } else {
                setTimeout(() => checkAndHighlight(pageNum), 100);
            }
        };

        const observePage = (pageNum) => {
            const pageEl = pdfRef.current.querySelector(`.react-pdf__Page[data-page-number="${pageNum}"]`);
            if (!pageEl) return;

            const observer = new MutationObserver(() => checkAndHighlight(pageNum));
            observer.observe(pageEl, { childList: true, subtree: true });
            observerList.push(observer);

            setTimeout(() => checkAndHighlight(pageNum), 100);
        };

        if (viewAll) {
            matches.forEach(pageNum => observePage(pageNum));
        } else {
            observePage(pageNumber);
        }

        return () => {
            observerList.forEach(o => o.disconnect());
        };
    }, [pageNumber, viewAll, prevSearchTextRef.current, matches, width, pdfRef.current]);


    useEffect(() => {
        setSearchLoad(false);
        if (!matches.length) clearHighlightTextLayer();
    }, [matches]);


    // pdf 파일에 대한 url. 기존에 있던 파일이라면 detailId가 있을테고, 새로운 파일이라면 path이 있을꺼다.
    let fileUrl = null
    // detailId, path
    if (path != null && path?.startsWith("temp/")) {
        fileUrl = `/api/v1/view/pdf/${path}`
    } else if (detailId != null && detailId != "") {
        fileUrl = `/api/v1/view/pdf/post/${detailId}`
    } else if (path != null && isPreviewPopup) {
        if (!isEmptyCheck(detailId)) {
            fileUrl = `/api/v1/view/pdf/post/${detailId}`
        } else {
            fileUrl = `/api/v1/view/pdf/postview/${fileId}`
        }
    }
    // console.log("=== Pdfviewrcomp : ", fileUrl, path, detailId, props)

    const togglePageList = () => {
        if (viewAll && pdfRef) {
            const rect = pdfRef.current?.getBoundingClientRect();
            const y = window.scrollY + rect.top - 82;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setIsListOpen(false);
        setSearchText('');
        resetSearch();
        setSetViewAll((prev) => !prev);
    }

    const handleSearchInputChange = (e) => {
        setSearchLoad(prev => (prev ? prev : true));

        const text = e.target.value;

        setSearchText(text);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            searchInPDFWithAbort(text, 'typing');
        }, 300);
    };

    return (
        <>
            <PdfSection className='pdfViewer-inner'>
                <div className={screen ? 'screen' : 'fullScreen'} style={{ overflow: screen ? 'visible' : 'auto', position: 'relative' }} ref={fullScreenRef}>

                    {(pdfLoaded) ? !readOnly && (
                        <div className={viewAll ? 'pdf-control viewAll' : 'pdf-control'}>
                            {/* pdf 목록 뷰어 */}
                            {!viewAll && <button className='pdf-btn pdf-list-btn' disabled={viewAll} onClick={() => setIsListOpen((prev) => !prev)}><LuList />  </button>}

                            {/* 왼쪽 검색 인풋 박스 */}
                            <div className={`search-box`}>
                                <Input
                                    ref={searchInputRef}
                                    value={searchText}
                                    prefix={<LuSearch className='input-icon' />}
                                    onChange={handleSearchInputChange}
                                    onPressEnter={(e) => {
                                        if (searchLoad) return;
                                        searchInPDFWithAbort(e.target.value);
                                    }}
                                    suffix={searchLoad ? <LoadingOutlined /> : isEmptyCheck(searchText) ? undefined : `${matches?.length > 0 ? searchTextIdxRef.current + 1 : matches?.length} / ${matches?.length}`} />
                                {matches?.length > 0 && !isEmptyCheck(searchText) &&
                                    <>
                                        <button className='pdf-btn arrowBtn' type='text' onClick={() => prevSearchTextPage(matches)}><LuArrowUp /></button>
                                        <button className='pdf-btn arrowBtn' type='text' onClick={() => nextSearchTextPage(matches)}><LuArrowDown /> </button>
                                    </>
                                }
                            </div>

                            {/* 가운데 페이징 박스 */}
                            <div className='number-inner'>
                                {
                                    (pdfLoaded && !viewAll) ? (
                                        <button className='pdf-btn' disabled={pageNumber <= 1} onClick={() => prevPage()} shape="round">
                                            <ArrowLeftOutlined />
                                        </button>
                                    ) : null
                                }

                                <div className={`pdfControl_number afterlLine ${viewAll ? 'disabled' : ''}`}>
                                    <InputNumber controls={false} min={1} max={totalPageNo} defaultValue={1} onChange={setPageNumber} value={pageNumber} onBlur={() => setPageNumber((prev) => prev ?? 1)} />  /
                                    <span>{totalPageNo}</span>
                                </div>
                                {
                                    (pdfLoaded && !viewAll) ? (
                                        <button className='pdf-btn' disabled={pageNumber >= totalPageNo} onClick={() => nextPage()} shape="round">
                                            <ArrowRightOutlined />
                                        </button>
                                    ) : null
                                }
                                {!screen ? (
                                    <>
                                        <button className='pdf-btn zoomBtn' disabled={viewAll} onClick={handleZoomOut}>
                                            <ZoomOutOutlined />
                                        </button>
                                        <Slider
                                            min={0.2}
                                            max={2.0}
                                            step={0.1}
                                            style={{ width: 80 }}
                                            onChange={(e) => setScale(e)}
                                            value={typeof scale === 'number' ? scale : 0}
                                        />
                                        <InputNumber className='zoomControls' value={Math.round(scale * 100)} onChange={(e) => setScale(e / 100)} min={20} max={200} controls={false} />
                                        <button className='pdf-btn zoomBtn' disabled={viewAll} onClick={handleZoomIn}>
                                            <ZoomInOutlined />
                                        </button>
                                    </>
                                ) : null}
                            </div>

                            {/* 오른쪽 컨트롤 박스 */}
                            {!isNewWindow && screen && <button title='새 창으로 보기' className='pdf-btn'
                                onClick={() => openNewWindow({
                                    detailsId: detailId,
                                    filePath: path,
                                    fileId: fileId,
                                    canFileDownload: canFileDownload,
                                })} >
                                {/* <ExportOutlined /> */}
                                <LuScreenShare />
                            </button>
                            }
                            {!viewAll && <button disabled={viewAll}
                                className='pdf-btn'
                                onClick={() => toggleFullScreen()}
                                title={screen ? '전체화면' : '전체화면 종료'}
                            >
                                {screen ? <LuScan /> : <LuMinimize />}
                            </button>
                            }

                            {screen && <button
                                className='pdf-btn'
                                title={viewAll ? '한 화면씩 보기' : '모두 보기'}  // '한 화면씩 보기' : "모두 보기"
                                onClick={v => togglePageList()}
                            // style={{ display: `${screen ? 'flex' : 'none'}`, alignItems: 'center', justifyContent: 'center', }}
                            >
                                {viewAll ? <LuSquare /> : <LuRows3 />}
                            </button>

                            }

                        </div>
                    ) : null
                    }

                    <div className='full-pdf-box' tabIndex={0} onKeyDown={handleKeydown} ref={pdfRef} onWheel={handleWheel} >
                        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}
                            loading={<Tag style={{ margin: 20 }} color="processing">로딩중</Tag>} /* 로딩중 */
                            options={options.current} >
                            <Drawer
                                title='Thumbnail'
                                placement='left'
                                open={isListOpen}
                                getContainer={false}
                                maskClosable={false}
                                mask={false}
                                onClose={(e) => setIsListOpen(false)}
                                width={'fit-content'}
                            >
                                {
                                    thumbnails.map((thumb, index) => (
                                        <div
                                            key={`thumb_${index}`}
                                            className={`pdf-box-border ${pageNumber === index + 1 ? 'pdf-box-current-page-border' : ''}`}
                                            onClick={() => setPageNumber(index + 1)}
                                        >
                                            <img alt={`thumb_${index}`} src={thumb} />
                                            <p>{index + 1} page</p>
                                        </div>
                                    ))
                                }
                            </Drawer>
                            <div style={{ maxHeight: screen ? "none" : "100vh", }}>
                                {
                                    viewAll ? (
                                        Array.from(new Array(totalPageNo), (el, index) => (
                                            <Page
                                                className='pdf-page'
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                width={width - 50}
                                                renderTextLayer={true}
                                            />
                                        ))
                                    ) : (
                                        <Page className='pdf-page' pageNumber={pageNumber} width={width - 50} renderTextLayer={true} scale={scale} />
                                    )
                                }
                            </div>
                        </Document>

                    </div>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
            </PdfSection>
        </>
    )
}

const PdfSection = styled.section`
    &{
        border: 1px solid #ddd;
        position: relative;
        text-align: center;
        /* overflow: hidden; */
    }
    .pdf-btn{
        font-size: ${SFEm(18)};
        border: 1px solid #ddd;
        ${SFFlexCenter};
        display: inline-flex;
        padding: ${SFEm(8, 18)};
        border-radius: ${SFEm(4, 18)};
        width: ${SFEm(36, 18)};
        aspect-ratio: 1 / 1;
    }
    button:hover{
        color: var(--color-primary-5);
    }
    .pdf-control{
        position: sticky;
        top:0;
        left: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        padding: ${SFEm(24)};
        gap: 4px; 
        background-color: rgba(255,255,255,0.3);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        width: calc(100% - 1px);
        height: calc(100% - 2px);
        margin-left: 1px;
        margin-top: 1px;
        .search-box{
            display: flex;
            gap: 4px;
            height: ${SFEm(30, 14)};
        }
        .number-inner{
            margin: 0 auto;
            display: flex;
            gap: ${SFEm(8)};
            align-items: center;
            .pdfControl_number {
                display: flex;
                align-items: center;
                gap: ${SFEm(8, 14)};
                font-size: ${SFEm(14)};
            }

            .pdf-btn{
                border: 0;
                width: auto;
                font-size: ${SFEm(14)};
            }
        }
    }

    .react-pdf__Page__canvas,
    .react-pdf__Page__textContent{
        margin: 0 auto;
    }

    .full-pdf-box{
        position: relative;
        overflow: hidden;
    }
    .ant-drawer .ant-drawer-header{
        padding: ${SFEm(8)} ${SFEm(12)};
    }
    .ant-drawer .ant-drawer-title{
        font-size: ${SFEm(12)} ;
        text-align: left;
    }
    .ant-drawer .ant-drawer-body{
        padding:${SFEm(8)}  ;
    }
    .pdf-box-border {
        img{
            border:1px solid #ccc;
        }
        p{
            font-size: 1em;
            color: #777;
        }
    }
    .pdf-box-border + .pdf-box-border{
        margin-top: ${SFEm(8)};
    }

    /* 풀 스크린 */
    .fullScreen{
        position: relative;
        padding-top: ${SFEm(86)};
        .pdf-control{
            position: fixed;
            top: 0px;
            left: 50%;
            width: 100%;
            height: 48px;
            padding: 4px 0;
            transform: translateX(-50%);
            box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 10px 1px;
            z-index: 999;
            background-color: rgb(232, 233, 234);
            border: 1px solid rgb(204, 204, 204);
            .pdf-btn{
                border: 0;
            }
        }
        .full-pdf-box{
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            place-content: center;
            outline: none;
            overflow: visible;
            padding: ${SFEm(24)};
        }
        .react-pdf__Document {
            max-width: 100%;
            max-height: 100%;
        }
        .ant-drawer-inline{
            position: fixed;
            top: ${SFEm(88, 14)};
            height: calc(100% - ${SFEm(86, 14)});
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &,[class|= ant]{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
    .ant-input-number-outlined{
        width: ${SFEm(50, 14)};
    }
    .pdf-btn.pdf-list-btn,
    .pdf-control .search-box,
    .ant-slider{
        display: none;
    }
    .ant-input-number .ant-input-number-input{
        padding: 2px;
        text-align: center;
    }
    .pdf-control .number-inner{
        margin-left: 0;
    }
    .fullScreen  .pdf-control .number-inner{
        margin-left: auto;
    }
`)};
`;
