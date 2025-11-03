// POST 게시물 수정 또는 신규
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Popconfirm, Space, Form } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { PostMainMenu } from 'pages/user_bak/post/PostMainMenu'
import { SearchRow } from 'components/page_bak/SearchRow'
import { BottomRow } from 'components/page_bak/BottomRow'
// import { BreadcrumbRow } from 'components/page/BreadcrumbRow'
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { ErrorMsg } from 'components/common/CustomComps'
import { PostItemSmall2 } from 'components/page_bak/PostItemSmall2'
import { PostInputForm } from './PostInputForm'
import { PostRepresentativeImage } from './PostRepresentativeImage'
import { PostFileUpload } from './PostFileUpload'
import { DynamicArea } from './DynamicArea'
import { useMsg } from 'hooks/helperHook';
import { useUserInfo } from 'hooks/useUserInfo'
import { MainMenu } from 'components/page_bak/MainMenu'
import { pdfImgPath } from 'atoms/atom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { PostMetaRow } from '../post/PostMetaRow';
import { InnerDiv } from 'styles/StyledCommon';
import { isEmptyCheck } from 'utils/helpers';

export const PostEditPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const { postId } = useParams();
    // postId가 비었다면 새로등록(/post/new) 인거다.
    const [menu1, setMenu1] = useState()
    const [menu2, setMenu2] = useState()
    const [postInfo, setPostInfo] = useState() // Post 기본정보
    const [postDetails, setPostDetails] = useState([]) // Post 상세정보
    const [files, setFiles] = useState([]) // 첨부파일
    const [comments, setComments] = useState([]) // 댓글들
    const [metas, setMetas] = useState([]) // nation, 주제, tag
    const [dyanmicDetails, setDyanmicDetails] = useState([]) // Post 저장할 details
    const navigate = useNavigate()
    const [insertedFiles, setInsertedFiles] = useState([])
    const [deletedFiles, setDeletedFiles] = useState([])
    const [imagePath, setImagePath] = useState()
    const { error, info } = useMsg()
    const userInfo = useUserInfo()
    const [checked, setChecked] = useState(false)
    const [fileIsUploading, setFileIsUploading] = useState(false)
    const [thePdfImgPath, setThePdfImgPath] = useRecoilState(pdfImgPath)


    useEffect(() => {
        if (userInfo?.id != null) {
            if (['ROLE_OPERATOR', 'ROLE_MASTER', 'ROLE_CONTENTS_MANAGER'].includes(userInfo?.role)) {
                setChecked(true)
            } else {
                error("편집 권한이 없습니다.")
                setTimeout(() => {
                    navigate("/")
                }, 3000)
            }
        }
    }, [userInfo])

    useEffect(() => {
        if (postId != null && checked) {
            getPostInfo()
        }
    }, [postId, checked])

    useEffect(() => {
        processPdfThumbnail()
    }, [thePdfImgPath])

    // 첨부파일이 업로드중일때 받는 callback
    const isUploading = (uploading) => {
        setFileIsUploading(uploading)
    }

    /**
     * pdf에서 thumbnail 이미지를 만들어서 업로드하면,
     * 만일 대표이미지가 비어 있다면, 그 이미지를 대표이미지로 만들어줘야 한다.
     */
    const processPdfThumbnail = () => {
        const formData = form.getFieldsValue()
        if (formData?.info?.representativeImagePath == null && imagePath == null) {
            setPostInfo({ ...postInfo, representativeImagePath: thePdfImgPath })
            setImagePath(thePdfImgPath)
        }
    }

    useEffect(() => {
        setThePdfImgPath(null)
        return () => {
            setThePdfImgPath(null)
        }
    }, [])

    // Post 기본정보 조회
    const getPostInfo = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/info/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setPostInfo(data)
                // form에 set
                form.setFieldValue(['info', 'title'], data?.title)
                form.setFieldValue(['info', 'description'], data?.description)
                form.setFieldValue(['info', 'menu1Id'], data?.menu1Id)
                form.setFieldValue(['info', 'menu2Id'], data?.menu2Id)
                form.setFieldValue(['info', 'openType'], data?.openType)
                form.setFieldValue(['info', 'strategicMarketingOnly'], data?.strategicMarketingOnly)
                form.setFieldValue(['info', 'enabled'], data?.enabled)
                form.setFieldValue(['info', 'postType'], data?.postType)

                if (data?.menu1Id != null) {
                    setMenu1({ id: data?.menu1Id, name: data?.menuName1, path: data?.menuEngName1 })
                }
                if (data?.menu2Id != null) {
                    setMenu2({ id: data?.menu2Id, name: data?.menuName2, path: data?.menuEngName2 })
                }
                getFiles()
                getPostDetails()
                getComments()
                getMetas()
                // getRelatedTopicPosts()
            })
            .catch((err) => {
                setPostInfo({})
                console.log('=== getPostInfo 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // Post 상세(pdf, editor등) 조회 
    const getPostDetails = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("data : ",data)
                setPostDetails(data)
            })
            .catch((err) => {
                setPostDetails([])
                console.log('=== getPostDetails 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // 첨부파일 조회
    const getFiles = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/file/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setFiles(data)
            })
            .catch((err) => {
                setFiles([])
                console.log('=== getFiles 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // 댓글들 조회
    const getComments = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/comment/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setComments(data)
            })
            .catch((err) => {
                setComments([])
                console.log('=== getComments 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // 메타(nation,주제,tag)들 조회
    const getMetas = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/meta/${postId}`)
            .then((resp) => {
                const data = resp?.data
                setMetas(data)
                form.setFieldValue(['meta', 'nations'], data?.nations?.map(e => e.value))
                form.setFieldValue(['meta', 'topics'], data?.topics?.map(e => e.value))
                form.setFieldValue(['meta', 'tags'], data?.tags?.map(e => e.value))
            })
            .catch((err) => {
                setMetas(null)
                console.log('=== getComments 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // 저장 (insert or update)
    const saveData = () => {
        // console.log("=== form : ", form.getFieldsValue())
        const formData = form.getFieldsValue()
        formData.info.id = postId
        // meta
        formData.nations = formData.meta?.nations
        formData.topics = formData.meta?.topics
        formData.tags = formData.meta?.tags
        // file
        insertedFiles?.forEach(e => {
            // console.log(" ===> e : ",e)
            e.fileClass = 'post'
            e.fileNm = e.filename
            e.filePath = e.path
        })
        formData.insertedFiles = insertedFiles
        formData.deletedFileIds = deletedFiles
        // post type
        if (postId == null) {
            // 신규등록일때는 
            formData.info.postType = 'post'
        }
        // 대표 이미지
        formData.info.representativeImagePath = imagePath
        // 에디터, pdf뷰어
        formData.detail = dyanmicDetails.map(e => ({ ...e, filePath: e.filePath ?? e.path }));
        // console.log("formData.detail",formData.detail)

        form.validateFields()
            .then((values) => {
                AXIOS.post(`/api/v1/user/post`, formData)
                    .then((resp) => {
                        // setBtnDisabled(true)
                        // refresh()
                        info("저장하였습니다.")
                        // notification.info({ message: '저장하였습니다.', placement: 'topRight', duration: 4 });
                        // 등록한 후에 해당 post 조회화면으로 이동
                        if (postId != null) {
                            setTimeout(() => {
                                navigate(`/post/${postId}`, { replace: true })
                            }, 1000)
                        } else {
                            setTimeout(() => {
                                navigate(`/`, { replace: true })
                            }, 1000)
                        }
                    })
                    .catch((err) => {
                        console.log('=== insertData 에러 : ', err?.response);
                        setLoading(false);
                        error(err)
                        // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                        // message.error(err?.response.data.errMsg, 4);
                        // message.error(errorMsg(err), 4);
                    })
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                error('필수입력 항목을 입력해주세요.');
                setLoading(false);
                // notification.error({ message: <ErrorMsg msg='필수입력 항목을 입력해주세요.' />, placement: 'topRight', duration: 4 });
            });
    };

    return (
        <>
            {
                !checked ? (
                    null
                ) : (
                    <>
                        <Row justify='center' style={{
                            width: 1240,
                            margin: '0 auto',
                            padding: '0',
                        }} gutter={[0, 0]} >
                            <SearchRow />

                        </Row>
                        <MainMenu menu1Path={menu1?.path} />
                        <InnerDiv>
                            <PostInputForm form={form} postInfo={postInfo} />
                        </InnerDiv>

                        <Row style={{
                            width: 1240,
                            margin: '0 auto',
                            padding: '0',
                            border: '0px solid #84a9ff',
                        }} gutter={[10, 10]} >
                            <Col span={2} align='left' style={{ fontSize: 14, color: 'rgba(38, 38, 38, 0.88)', paddingLeft: 20 }}> 대표 이미지</Col>
                            <Col span={24}>
                                <PostRepresentativeImage initialImagePath={postInfo?.representativeImagePath} setImagePath={setImagePath} />
                            </Col>

                            <Col span={2} align='left' style={{ fontSize: 14, color: 'rgba(38, 38, 38, 0.88)', paddingLeft: 20 }}>
                                파일 첨부
                            </Col>
                            <Col span={24}>
                                <PostFileUpload initialFileList={files} setInsertedFiles={setInsertedFiles} setDeletedFiles={setDeletedFiles}
                                    isUploading={isUploading} />
                            </Col>
                        </Row>


                        <Row style={{
                            width: 1240,
                            margin: '24px auto 0',
                            padding: '0',
                            border: '0px solid #84a9ff',
                        }} gutter={[0, 0]} >
                            <Col span={2} align='left' style={{ fontSize: 14, height: 30, paddingLeft: 20 }} >
                                내 용
                            </Col>
                            <DynamicArea postDetails={postDetails} setDyanmicDetails={setDyanmicDetails} />
                            <Col span={24} align="right">
                                <Space style={{ marginTop: 36 }}>
                                    <Button size='large' onClick={() => { navigate(-1); info('취소하였습니다.', 2) }} >취소</Button>
                                    <Popconfirm
                                        title="저장"
                                        description="저장하시겠습니까?"
                                        onConfirm={saveData}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" size='large' disabled={fileIsUploading} > {fileIsUploading ? "파일 업로드중" : "등록하기"}</Button>
                                    </Popconfirm>

                                </Space>
                            </Col>
                        </Row>

                        <BottomRow />
                    </>
                )
            }


        </>
    )
}

