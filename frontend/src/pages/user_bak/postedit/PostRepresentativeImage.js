// 대표이미지 추가
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { ImageUpload } from 'components/common/ImageUpload'


export const PostRepresentativeImage = ({ initialImagePath, setImagePath }) => {
    const [validImageList, setValidImageList] = useState([])
    const [initialImageList, setInitialImageList] = useState([])

    useEffect(() => {
        if (validImageList?.length > 0) {
            setImagePath?.(validImageList[0]?.path)
        } else {
            setImagePath?.(null)
        }
    }, [validImageList])

    useEffect(() => {
        if (initialImagePath != null && initialImagePath != '') {
            const idx = initialImagePath.lastIndexOf('/')
            let name = "image"
            if (idx > -1) {
                name = initialImagePath
            }
            // console.log("=== 10000 ")
            setValidImageList([{ uid: Date.now(), path: initialImagePath, status: 'done', name: name, url: `/api/v1/view/image/${initialImagePath}` }])
            setInitialImageList([{ uid: Date.now(), path: initialImagePath, status: 'done', name: name, url: `/api/v1/view/image/${initialImagePath}` }])
        } else {
            setValidImageList([])
            setInitialImageList([])
        }
    }, [initialImagePath])

    const getInitialFileList = () => {
        // console.log("=== getInitialFileList")
        const idx = initialImagePath?.lastIndexOf('/')
        let name = "image"
        if (idx > -1) {
            name = initialImagePath
        }
        return [{ uid: Date.now(), path: initialImagePath, status: 'done', name: name, url: `/api/v1/view/image/${initialImagePath}` }]
    }

    /*
    ==== antd 포맷
    uid: '-1',
    name: 'image1.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    */

    return (
        <>
            <ImageUpload maxCount={1} readOnly={false} setValidImageList={setValidImageList}
                initialFileList={initialImageList} />
        </>
    )
}