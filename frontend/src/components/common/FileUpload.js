// ==== 파일업로드 
import { InboxOutlined, FilePdfOutlined, DeleteOutlined, DeleteFilled, PaperClipOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { Upload, Empty, message, Button } from 'antd';
import { useState, useEffect } from 'react';

export const FileUpload = ({ initialFileList, readOnly, onFileRemoved, onFileInserted, maxCount, setValidFileList, etcDescription, height = '140px',
    isUploading }) => {
    const [fileList, setFileList] = useState([]);
    const [insertedFiles, setInsertedFiles] = useState([])
    const [deletedFiles, setDeletedFiles] = useState([])
    const [initialProcessed, setInitialProcessed] = useState(false)
    // const [defaultFileList, setDefaultFileList] = useState([])

    useEffect(() => {
        onFileInserted?.(insertedFiles?.map(e => { return { filename: e.filename, path: e.path, fileExtension: e.fileExtension, fileSize: e.fileSize, } }))
    }, [insertedFiles])

    useEffect(() => {
        onFileRemoved?.(deletedFiles)
    }, [deletedFiles])

    useEffect(() => {
        setValidFileList?.(fileList?.filter(e => e.status == 'done'))
    }, [fileList])

    const addRemovedFile = (fid, uid) => {
        // console.log("=== addRemovedFile : ", fid, uid );
        if (fid != null) {
            setDeletedFiles([...deletedFiles, fid]);
        } else if (uid != null) {
            setInsertedFiles(insertedFiles.filter(e => e.uid !== uid));
        }
    }

    const addInsertedFile = (f) => {
        // console.log("=== addInsertedFile : ", f);
        if (f.id == null) {
            setInsertedFiles([...insertedFiles, f]);
        }
    }



    /*
    ==== antd 포맷
        {
            uid: '0',
            name: 'image1.png',
            status: 'done',
            url: '/api/v1/download/2023-05/27d552f5-61c5-40dd-881a-2bac6248da5f?name=cat.jpg',
        },

    ==== 업로드 한후에 서버로 부터 받는 callback 데이타
        {
            "path": "temp/fb20a7c3-ed1f-4c02-b946-c9727515de76",
            "filename": "고15 (1).jpeg",
            "fileSize": 147454,
            "fileExtension": "jpeg"
        }    

    ==== 서버에서 넘어오는 DTO 
        {
            "id": 1,
            "postId": 1,
            "fileClass": 'post',
            "fileNm": "홍홍홍.pdf",
            "filePath": "202306/a2185d47-e380-4577-ac39-1044025ee1fe",
            "fileExtension": "pdf",
            "fileSize": 66308
        }    
    */

    // useEffect(() => {
    //     console.log("=== useEffect initialFileList-2 : ", initialFileList)
    //     let list = [];
    //     initialFileList?.forEach(e => {
    //         let obj = { ...e };
    //         obj.uid = obj.id;
    //         obj.name = obj.fileNm;
    //         obj.status = 'done'
    //         obj.url = `/api/v1/download/${obj.id}`;
    //         list.push(obj);
    //     })
    //     setDefaultFileList(list)
    // }, [initialFileList])

    // useEffect(() => {
    //     console.log("=== readOnly useEffect")
    // }, [readOnly])

    useEffect(() => {
        // console.log("=== useEffect initialFileList : ", initialProcessed, initialFileList);
        if (initialProcessed || (initialFileList ?? []).length == 0) {
            return
        }
        setInitialProcessed(true)
        // 서버에서 넘어온 파일 리스트를, 화면 포맷에 맞게 변환
        let list = [];
        initialFileList?.forEach(e => {
            let obj = { ...e };
            obj.uid = obj.id;
            obj.name = obj.fileNm;
            obj.status = 'done'
            obj.url = `/api/v1/download/${obj.id}`;
            list.push(obj);
        })
        setFileList(list);
        // console.log("=== setFileList")
    }, [initialFileList])


    // 파일 업로드시에 호출됨
    const onChange = (info) => {
        // console.log("=== onChange : ", info);
        const fileList = processFileUploading(info.file, info.fileList)
        setFileList(fileList);
        if (info?.file?.status === 'done') {
            const theInfo = { ...info?.file }
            // console.log("=== onChange theInfo : ", theInfo);
            addInsertedFile(theInfo);
        }
        const uploadingCnt = info?.fileList?.map(e => e.status)?.filter(e => e == "uploading")?.length ?? 0
        isUploading?.(uploadingCnt > 0)
        // console.log("=== upload onChange : ", uploadingCnt>0)
    }

    // 파일 삭제시에 호출됨
    const onRemove = (f) => {
        // console.log("=== onRemove : ", f);
        addRemovedFile(f.id, f.uid);
    }

    let disabled = readOnly === true;

    return (
        <>
            {/* === FileUpload - fileList <br />
            {
                fileList.map(
                    (e, idx) => (<>{JSON.stringify(e)} <br /></>)
                )
            } <br />
            === FileUpload - initialFileList <br />
            {
                initialFileList.map(
                    (e, idx) => (<>{JSON.stringify(e)} <br /></>)
                )
            } <br /> */}

            {
                disabled ? (
                    <Upload
                        action={null}
                        fileList={fileList}
                        disabled={true}
                    >
                        {
                            fileList.length === 0
                                ? <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span>
                                            첨부된 파일이 없습니다.
                                        </span>
                                    }
                                />
                                : null
                        }
                    </Upload>
                ) : (
                    <>
                        <Upload.Dragger height={height} maxCount={maxCount}
                            // iconRender={(p) => {
                            //     // 파일 리스트 아이콘 - 기본; 이미지 아이콘
                            //     console.log("=== iconRender : ", p)
                            //     return <FilePdfOutlined style={{ fontSize: 20, height: 30 }}/>

                            // }}
                            action={`/api/v1/fileupload`}
                            fileList={fileList}
                            onChange={onChange}
                            onRemove={onRemove}
                            multiple={true}
                            listType="text"
                            showUploadList={{
                                removeIcon: <DeleteOutlined style={{ fontSize: 20, color: 'red', height: 20 }} />
                            }}
                        // style={{background: 'transparent ',padding:'16px 0 ',minHeight: 138,border:0}}
                        >
                            {
                                etcDescription != null ? (
                                    etcDescription
                                ) : (
                                    <>
                                        <p className="ant-upload-drag-icon">
                                            <PaperClipOutlined style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 48 }} />
                                        </p>
                                        <p style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.85)' }} > 파일을 마우스로 끌어오거나 여기를 클릭하여 첨부하세요.</p>

                                    </>
                                )
                            }

                        </Upload.Dragger>
                    </>
                )
            }

        </>
    )
}

const processFileUploading = (file, fileList) => {
    /*
        ==== antd 포맷
        uid: '-1',
        name: 'image1.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    */
    // status가 done
    if (file?.status === 'done') {
        // done이면 antd 포맷에 맞게 업데이트
        for (let f of fileList) {
            if (f.uid === file.uid) {
                // console.log("=== f:", f);
                // uid는 path값으로
                f.uid = f?.response?.path;
                f.path = f?.response?.path;
                f.url = '/api/v1/download/' + f?.response?.path + '?name=' + encodeURIComponent(f.name);
                if (f.fileExtension == null && f?.response?.fileExtension != null) {
                    f.fileExtension = f?.response?.fileExtension;
                }
                f.filename = f.name;
                f.fileSize = f.size;
                f.response = null;
                break;
            }
        }
        return fileList;
    } else {
        return fileList;
    }
};
