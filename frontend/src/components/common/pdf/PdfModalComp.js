/**
 * @file PdfModalComp.js
 * @description pdf 미리보기 모달
 * @author 이병은
 * @since 2025-02-07 14:05
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-02-07 14:05    이병은       최초 생성
 **/

import { Button, Modal } from 'antd';
import { PdfviewerComp } from 'components/common/pdf/PdfviewerComp';
import React, { useEffect, useState } from 'react'
import { isEmptyCheck } from 'utils/helpers';
import { useTranslation } from "react-i18next";

const PdfModalComp = ({ data, isOpen, pdfViwerCloseHandler }) => {
    const [pdfData, setPdfData] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        if (!isEmptyCheck(data)) {
            setPdfData(data);
        }
    }, [data]);

    return (
        <>
            <Modal zIndex={1031} destroyOnClose maskClosable open={isOpen} afterClose={pdfViwerCloseHandler} onCancel={pdfViwerCloseHandler} width={'fit-content'} closeIcon={false} footer={[<Button key="close" onClick={pdfViwerCloseHandler}>{t("PdfModalComp.close")}</Button>]}>
                <PdfviewerComp path={pdfData?.filePath ?? ''} detailId={pdfData?.detailsId ?? ''} fileId={pdfData?.fileId ?? ''} canFileDownload={pdfData?.canFileDownload ?? false} isPreviewPopup />
            </Modal>
        </>
    )
}
export default PdfModalComp