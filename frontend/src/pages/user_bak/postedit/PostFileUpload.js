// 파일 업로드 
import { PaperClipOutlined } from '@ant-design/icons';
import { FileUpload } from 'components/common/FileUpload'
import { useState, useEffect } from 'react';

export const PostFileUpload = ({initialFileList, setInsertedFiles, setDeletedFiles, isUploading }) => {
    // const [insertedFiles, setInsertedFiles] = useState([])
    // const [deletedFiles, setDeletedFiles] = useState([])

    const onFileRemoved = (files) => {
        setDeletedFiles?.(files)
    }

    const onFileInserted = (files) => {
        // console.log("=== onFileInserted : ", f);
        setInsertedFiles?.(files);
    }

    // const initialFileList = [
    //     {
    //         "id": 1,
    //         "postId": 1,
    //         "fileClass": 'post',
    //         "fileNm": "브라우저인증서사용방법.pdf",
    //         "fileExtension": "pdf",
    //         "fileSize": 66308,
    //     } ,
    // ]

    return (
        <>
            {/* === PostFileUpload - insertedFiles :<br/>
            {
                insertedFiles?.map(e => (
                    <>{JSON.stringify({filename:e.filename, path:e.path, fileExtension:e.fileExtension, fileSize:e.fileSize, })} <br /></>
                ))
            }
            <p key="100"/>
            === PostFileUpload - deletedFiles : <br/>
            {
                JSON.stringify(deletedFiles)
            }
            <br key="110"/>
            <p key="100"/>*/}
            {/* === PostFileUpload- initialFileList : <br/>
            {
                JSON.stringify(initialFileList)
            }
            <br key="120"/>  */}

            <div style={{ width:'100%' }}> 
              
                <FileUpload onFileRemoved={onFileRemoved} onFileInserted={onFileInserted} readOnly={false} initialFileList={initialFileList}
                    isUploading={isUploading}
                    etcDescription={
                        <>
                            <PaperClipOutlined style={{ color: 'rgba(0, 0, 0, 0.85)' ,fontSize:48}}/>
                            <p style={{ fontSize: 16,marginBottom:0 }}>파일을 마우스로 끌어오거나 여기를 클릭하여 첨부하세요.</p>
                        </>
                    }
                    // height='100px'
                />
            </div>
        </>
    )
}