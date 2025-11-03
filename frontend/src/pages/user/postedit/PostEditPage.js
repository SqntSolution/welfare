// POST 게시물 수정 또는 신규
import { useEffect, useState } from 'react';
import { App, Button, Row, Col, Popconfirm, Space, Form } from 'antd';
import { AXIOS } from 'utils/axios';
import { BottomRow } from 'components/page_bak/BottomRow';
// import { BreadcrumbRow } from 'components/page/BreadcrumbRow'
import { useNavigate, useParams } from "react-router-dom";
import { PostInputForm } from './comps/PostInputForm';
import { PostRepresentativeImage } from './comps/PostRepresentativeImage';
import { PostFileUpload } from './comps/PostFileUpload';
import { DynamicArea } from './comps/DynamicArea';
import { useGetMenus, useMsg } from 'hooks/helperHook';
import { useUserInfo } from 'hooks/useUserInfo';
import { pdfImgPath } from 'atoms/atom';
import { useRecoilState } from "recoil";
import { InnerDiv } from 'styles/StyledCommon';
import { SUInner1280, SUText30, SUText36 } from 'styles/StyledUser';
import LoadingSpinner from 'components/common/LoadingSpinner';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { LuPen, LuPencilLine } from 'react-icons/lu';

export const PostEditPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { postId } = useParams();
    // postId가 비었다면 새로등록(/post/new) 인거다.;
    const [menu1, setMenu1] = useState();
    const [menu2, setMenu2] = useState();
    const [postInfo, setPostInfo] = useState(); // Post 기본정보
    const [postDetails, setPostDetails] = useState([]); // Post 상세정보
    const [files, setFiles] = useState([]); // 첨부파일
    const [comments, setComments] = useState([]) // 댓글들;
    const [metas, setMetas] = useState([]); // nation, 주제, tag
    const [dyanmicDetails, setDyanmicDetails] = useState([]); // Post 저장할 details
    const navigate = useNavigate();
    const [insertedFiles, setInsertedFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [imagePath, setImagePath] = useState();
    const { error, info } = useMsg();
    const userInfo = useUserInfo();
    const [checked, setChecked] = useState(false);
    const [fileIsUploading, setFileIsUploading] = useState(false);
    const [thePdfImgPath, setThePdfImgPath] = useRecoilState(pdfImgPath);
    const [postCategory, setPostCategory] = useState('');
    const [menus, setMenus] = useState([]);


    useEffect(() => {
        if (userInfo?.id != null) {
            if (['ROLE_OPERATOR', 'ROLE_MASTER', 'ROLE_CONTENTS_MANAGER'].includes(userInfo?.role)) {
                getMenus();
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
                form.setFieldValue(['info', 'enabled'], data?.enabled)
                form.setFieldValue(['info', 'postType'], data?.postType)
                form.setFieldValue(['info', 'postCategory'], data?.postCategory)
                form.setFieldsValue({
                    info: {
                        metaInfoItems: {
                            ...data?.metaInfoItems
                        }
                    }
                })

                setPostCategory(data?.postCategory);

                getFiles();
                getPostDetails();
                getComments();
                getMetas();

            })
            .catch((err) => {
                setPostInfo({})
                console.log('=== getPostInfo 에러 : ', err?.response);
                error(err)
            })
            .finally(() => setLoading(false));
    };

    const getMenus = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/all-menus`)
            .then((resp) => {
                const data = resp?.data
                setMenus(data);
            })
            .catch((err) => {
                console.log('=== getMenus 에러 : ', err?.response);
                setMenus([]);
            })
            .finally(() => setLoading(false));
    }

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
        setLoading(true);
        const formData = form.getFieldsValue();
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
        formData.info.authLevel = 0;
        // 에디터, pdf뷰어
        formData.detail = dyanmicDetails.map(e => ({ ...e, filePath: e.filePath ?? e.path }));
        formData.info.postCategory = postCategory;
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
        <PostEditSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} />
                {
                    !checked ? (
                        null
                    ) : (
                        <>
                            <div style={{ padding: ' 0 0 1em' }}>
                                <SUText30>포스트 작성 <LuPencilLine style={{ fontSize: '0.8em' }} /></SUText30>
                            </div>
                            <PostInputForm form={form} metas={metas} postInfo={postInfo} menus={menus} postCategory={postCategory} setPostCategory={setPostCategory} />
                            <Row style={{ marginBottom: '1em' }}>
                                <Col span={24} align='left' style={{ fontSize: '1em', marginBottom: '1em' }}>썸네일 이미지</Col>
                                <Col span={24}>
                                    <PostRepresentativeImage initialImagePath={postInfo?.representativeImagePath} setImagePath={setImagePath} />
                                </Col>
                                {postCategory === 'editor' &&
                                    <>
                                        <Col span={24} align='left' style={{ fontSize: '1em', marginBottom: '1em' }}>
                                            파일 첨부
                                        </Col>
                                        <Col span={24}>
                                            <PostFileUpload initialFileList={files} setInsertedFiles={setInsertedFiles} setDeletedFiles={setDeletedFiles}
                                                isUploading={isUploading} />
                                        </Col>
                                    </>
                                }
                            </Row>


                            <Row style={{ marginBottom: '1em' }}>
                                <Col span={24} align='left' style={{ fontSize: '1em', marginBottom: '1em' }} >
                                    내 용
                                </Col>
                                <Col span={24}>
                                    <DynamicArea postDetails={postDetails} setDyanmicDetails={setDyanmicDetails} postCategory={postCategory} />
                                </Col>
                                <Col span={24} align="right">
                                    <Space style={{ marginTop: '4em' }}>
                                        <ButtonStyled size='large' onClick={() => { navigate(-1); info('취소하였습니다.', 2) }}

                                        >취소</ButtonStyled>
                                        <Popconfirm
                                            title="저장"
                                            description="저장하시겠습니까?"
                                            onConfirm={saveData}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <ButtonStyled type="primary" size='large' disabled={fileIsUploading || loading}> {fileIsUploading ? "파일 업로드중" : "등록하기"}</ButtonStyled>
                                        </Popconfirm>
                                    </Space>
                                </Col>
                            </Row>
                        </>
                    )
                }
            </SUInner1280>
        </PostEditSection>
    )
}

const ButtonStyled = styled(Button)`
    font-size: ${SFEm(16, 14)};
    padding:0 ${SFEm(15)};
    height: ${SFEm(40)};
`;

const PostEditSection = styled.section`
    font-size: 16px;
    padding: ${SFEm(48)} 0;
${SFMedia('mo-l', css`
    font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    padding-top: ${SFEm(40)};
`)};
`;