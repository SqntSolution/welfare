// 메뉴가 Page일때, 해당 Page를 편집
// /main/{1차메뉴}/{2차메뉴}/edit
// => 2차 메뉴에 대해서 page 편집

import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Popconfirm, Divider, Form } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { PostMainMenu } from 'pages/user/post/PostMainMenu'
import { SearchRow } from 'components/page/SearchRow'
import { BottomRow } from 'components/page/BottomRow'
// import { BreadcrumbRow } from 'components/page/BreadcrumbRow'
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { ErrorMsg } from 'components/common/CustomComps'
import { PostItemSmall2 } from 'components/page/PostItemSmall2'
import { PostInputForm } from './PostInputForm'
// import { PostRepresentativeImage } from './PostRepresentativeImage'
// import { PostFileUpload } from './PostFileUpload'
import { DynamicArea } from './DynamicArea'
import { useMsg } from 'hooks/helperHook';
import { useUserInfo } from 'hooks/useUserInfo'
import { MainMenu } from 'components/page/MainMenu'

export const PageEditPage = () => {
    const { menu1, menu2 } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const [postId, setPostId] = useState()
    // postId가 비었다면 새로등록(/post/new) 인거다.
    // const [menu1, setMenu1] = useState()
    // const [menu2, setMenu2] = useState()
    const [postInfo, setPostInfo] = useState() // Post 기본정보
    const [postDetails, setPostDetails] = useState([]) // Post 상세정보
    // const [files, setFiles] = useState([]) // 첨부파일
    // const [comments, setComments] = useState([]) // 댓글들
    const [metas, setMetas] = useState([]) // nation, 주제, tag
    const [dyanmicDetails, setDyanmicDetails] = useState([]) // Post 저장할 details
    const navigate = useNavigate()
    const [insertedFiles, setInsertedFiles] = useState([])
    const [deletedFiles, setDeletedFiles] = useState([])
    const [imagePath, setImagePath] = useState()
    const { error, info } = useMsg()
    const userInfo = useUserInfo()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (userInfo?.id != null) {
            if (['ROLE_OPERATOR', 'ROLE_MASTER'].includes(userInfo?.role)) {
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
        if (checked) {
            getPostInfo()
        }
    }, [checked])

    // Post 기본정보 조회 
    const getPostInfo = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/page/info/${menu1}/${menu2}`)
            .then((resp) => {
                const data = resp?.data
                if (data?.id == null) {
                    // 아직 만들지 않은 상태
                    return
                }
                setPostId(data?.id)
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

                // if (data?.menu1Id != null) {
                //     setMenu1({ id: data?.menu1Id, name: data?.menuName1, path: data?.menuEngName1 })
                // }
                // if (data?.menu2Id != null) {
                //     setMenu2({ id: data?.menu2Id, name: data?.menuName2, path: data?.menuEngName2 })
                // }
                // getFiles()
                getPostDetails(data?.id)
                // getComments()
                getMetas(data?.id)
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
    const getPostDetails = (postId) => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/detail/${postId}`)
            .then((resp) => {
                const data = resp?.data
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


    // 메타(nation,주제,tag)들 조회
    const getMetas = (postId) => {
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
        // console.log('=== Received values of form: ', values);
        console.log("=== form : ", form.getFieldsValue())
        const formData = form.getFieldsValue()
        formData.info.id = postId
        formData.nations = formData.meta?.nations
        formData.topics = formData.meta?.topics
        formData.tags = formData.meta?.tags
        formData.info.menuEngName1 = menu1
        formData.info.menuEngName2 = menu2
        formData.info.menu1Id = postInfo?.menu1Id
        formData.info.menu2Id = postInfo?.menu2Id
        // insertedFiles?.forEach(e => {
        //     e.fileClass = 'post'
        //     e.fileNm = e.filename
        //     e.filePath = e.path
        // })
        if (postId == null) {
            // 신규등록일때는 
            formData.info.postType = 'page'
        }
        // formData.insertedFiles = insertedFiles
        // formData.deletedFileIds = deletedFiles
        formData.info.representativeImagePath = imagePath

        formData.detail = dyanmicDetails

        // formData.
        form.validateFields()
            .then((values) => {
                AXIOS.post(`/api/v1/user/page`, formData)
                    .then((resp) => {
                        // setBtnDisabled(true)
                        // refresh()
                        info("저장하였습니다.")
                        // 등록한 후에 해당 post 조회화면으로 이동
                        if (postId != null) {
                            setTimeout(() => {
                                navigate(`/main/${menu1}/${menu2}`)
                            }, 1000)

                        }
                    })
                    .catch((err) => {
                        console.log('=== insertData 에러 : ', err?.response);
                        error(err)
                        // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                        // message.error(err?.response.data.errMsg, 4);
                        // message.error(errorMsg(err), 4);
                    })
                    .finally(() => setLoading(false));
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                error("필수입력 항목을 입력해주세요.")
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
                            border: '0px solid #84a9ff',
                        }} gutter={[0, 0]} >
                            <SearchRow />
                            {/* <PostMainMenu menu1={menu1} /> */}
                            <MainMenu />
                            <PostInputForm form={form} postInfo={postInfo} isPost={false} />
                        </Row>
                        {/* form : {JSON.stringify(form.getFieldsValue())} <br/> */}

                        <Row justify='center' style={{
                            width: 1240,
                            margin: '0 auto',
                            padding: '0',
                            border: '0px solid #84a9ff',
                        }} gutter={[0, 0]} >
                            <DynamicArea postDetails={postDetails} setDyanmicDetails={setDyanmicDetails} />
                            <Col span={24} align="right">
                                {/* === PostEditPage-dyanmicDetails : <br />
                    {
                        dyanmicDetails.map(rec => (
                            <>{JSON.stringify(rec ?? {})} <br /><br /></>
                        ))
                    } */}
                                <Popconfirm
                                    title="저장"
                                    description="저장하시겠습니까?"
                                    onConfirm={saveData}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" style={{ fontSize: 14, marginTop: 16 }} > 저장 </Button>
                                </Popconfirm>
                            </Col>
                        </Row>

                        <BottomRow />
                    </>
                )
            }


        </>
    )
}

