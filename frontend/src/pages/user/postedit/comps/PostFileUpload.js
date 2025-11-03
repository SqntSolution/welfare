// 파일 업로드 
import { PaperClipOutlined } from '@ant-design/icons';
import { FileUpload } from 'components/common/FileUpload';
import { SUText18 } from 'styles/StyledUser';

export const PostFileUpload = ({ initialFileList, setInsertedFiles, setDeletedFiles, isUploading }) => {

    const onFileRemoved = (files) => {
        setDeletedFiles?.(files)
    }

    const onFileInserted = (files) => {
        // console.log("=== onFileInserted : ", f);
        setInsertedFiles?.(files);
    }


    return (
        <>
            <div style={{ width: '100%' }}>
                <FileUpload onFileRemoved={onFileRemoved} onFileInserted={onFileInserted} readOnly={false} initialFileList={initialFileList}
                    isUploading={isUploading}
                    etcDescription={
                        <>
                            <PaperClipOutlined style={{ color: 'rgba(0, 0, 0, 0.85)' }} />
                            <SUText18>파일을 마우스로 끌어오거나 여기를 클릭하여 첨부하세요.?</SUText18>
                        </>
                    }
                />
            </div>
        </>
    )
}