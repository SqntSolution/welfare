/**
 * @file PdfModalComp.js
 * @description 설명
 * @author 이름
 * @since 2025-02-07 14:05
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-02-07 14:05    이름       최초 생성
 **/

import { Spin } from 'antd';
import { PdfviewerComp } from 'components/common/pdf/PdfviewerComp';
import React, { useEffect, useState } from 'react'
import { isEmptyCheck } from 'utils/helpers';
import { useParams } from "react-router-dom";

const PdfPopupComp = () => {
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { uuid } = useParams();


    useEffect(() => {
        if (!isEmptyCheck(pdfData)) {
            setLoading(false);
        }
        else if (loading && !isEmptyCheck(getSessionData()) && isEmptyCheck(pdfData)) {
            const decodedData = getSessionData();
            if (!isEmptyCheck(decodedData)) {
                setPdfData(decodedData);
            }
        }
    }, [pdfData])

    // postMessage 를 통해 받은 데이터 sessionStorage 에 저장
    const setSessionData = (data) => {
        if (!isEmptyCheck(uuid)) {
            if (isEmptyCheck(sessionStorage.getItem(uuid))) {
                const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
                sessionStorage.setItem(uuid, encodedData);
            }
        }
    }

    // 새로고침 시 저장된 값 가져오기
    const getSessionData = () => {
        let decodedData = null;
        const sessionData = sessionStorage.getItem(uuid);
        if (sessionData && loading && uuid) {
            decodedData = JSON.parse(decodeURIComponent(atob(sessionData)));
        }
        return decodedData;
    }

    useEffect(() => {
        const handleMessage = async (event) => {
            // 보안 체크: 다른 사이트에서 온 메시지를 무시
            if (event.origin !== window.location.origin) return;

            // 부모 창에서 온 메시지만 처리 (react-devtools 메시지 무시)
            if (event.source !== window.opener) return;

            const messageData = event.data?.data;

            if (!isEmptyCheck(messageData)) {
                setSessionData(messageData);
                setPdfData(messageData); // 전달된 데이터 저장
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);


    return (
        <Spin spinning={loading} style={{ minHeight: '100vh' }}>
            <div style={{ padding: 25 }}>
                {!loading && <PdfviewerComp path={pdfData?.filePath ?? ''} detailId={pdfData?.detailsId ?? ''} fileId={pdfData?.fileId ?? ''} canFileDownload={pdfData?.canFileDownload ?? false} isPreviewPopup isNewWindow />}
            </div>
        </Spin>
    )
}
export default PdfPopupComp