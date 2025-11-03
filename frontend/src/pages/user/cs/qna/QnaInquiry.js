/**
 * @file QnaInquiry.js
 * @description qna 등록, 수정, 삭제
 * @author 이병은
 * @since 2025-06-17 17:51
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-17 17:51    이병은       최초 생성
 **/
import { Button, Flex, Input, Spin, Radio, Form, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { SUInner1280 } from 'styles/StyledUser';
import LoadingSpinner from 'components/common/LoadingSpinner';

// QNA 등록 및 QNA 문의접수 중 수정을 진행하는 화면

export const QnaInquiry = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { error, info } = useMsg();
    const [form] = Form.useForm();

    const [openTypeOptions, setOpenTypeOptions] = useState(); //공개여부 라디오 버튼
    const [qnaTypeOptions, setQnaTypeOptions] = useState(); //구분 라디오 버튼

    const [textData, setTextData] = useState(); //문의 내용
    const [loading, setLoading] = useState(false);
    const [readonly, setReadonly] = useState(false);

    const [initialFileList, setInitialFileList] = useState([]);
    const [insertedFiles, setInsertedFiles] = useState([]); //파일 등록하기
    const [deletedFiles, setDeletedFiles] = useState([]); //파일 삭제하기

    useEffect(() => {
        getGroupCode();
        if (id) {
            getData();
        }
    }, []);

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code-render-multi/OPEN_TYPE,QNA_TYPE`)
            .then((resp) => {
                const codes = resp?.data;
                setOpenTypeOptions(codes.OPEN_TYPE);
                setQnaTypeOptions(codes.QNA_TYPE);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // qna 상세 데이터 조회
    const getData = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/qna/${id}`)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                form.setFieldsValue({ opened: (resp?.data?.opened === true ? 'y' : resp?.data?.opened === false ? 'n' : '') });
                setInitialFileList(resp?.data?.attachedFileList ?? []);
                setTextData(resp?.data?.contents ?? '');
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // qna 삭제
    const deleteData = async () => {
        setLoading(true);
        await AXIOS.post(`/api/v1/user/cs/qna/${id}`)
            .then((resp) => {
                info('게시글이 삭제되었습니다.');
                setTimeout(() => {
                    navigate('/cs-center/qna');
                }, 1000)
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    // qna 등록 및 수정
    const updateData = async (formData) => {
        setLoading(true);
        const params = formData;
        await AXIOS.post(`/api/v1/user/cs/qna${id ? `/${id}` : ''}`, params)
            .then((resp) => {
                if (id) {
                    info('게시글이 수정되었습니다.');
                } else {
                    info('게시글이 추가되었습니다.');
                }
                setTimeout(() => {
                    navigate('/cs-center/qna');
                }, 1000)
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    }


    const onFileRemoved = (files) => {
        setDeletedFiles(files)
    }

    const onFileInserted = (files) => {
        setInsertedFiles(files);
    }

    // Form의 필드 값 전송
    const onFinish = async (values) => {
        const formData = form.getFieldsValue();

        formData.contents = textData ?? ''; //문의내용
        formData.opened = formData.opened === 'y' ? true : formData.opened === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.attachedFileList = insertedFiles ?? []; //업로드할파일
        formData.deleteFileList = deletedFiles ?? []; // 삭제할 파일
        formData.menuId = 12; // 메뉴 id 일단 하드 코딩
        formData.metaEtc = 'String';

        if (await validationCheck(formData)) {
            updateData(formData);
        };

    }

    // 밸리데이션 체크
    const validationCheck = async (formData) => {

        if (formData?.contents.trim() === '') {
            info('문의내용을 작성하세요');
            return false;
        }

        if (formData?.title.trim() === '') {
            info('제목을 작성하세요');
            return false;
        }

        if (formData?.opened === '') {
            info('공개 여부를 선택하세요');
            return false;
        }

        if (formData?.metaDivision === '') {
            info('구분을 선택 하세요');
            return false;
        }

        return true;
    }


    const metaDivisionClick = (e) => {
        if (e.target.value === 'upload') {
            form.setFieldsValue({ opened: 'n' });
            setReadonly(true);
        } else {
            setReadonly(false);
        }
    }


    return (
        <LoadingSpinner loading={loading}>
            <SUInner1280>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelCol={{
                        span: 2,
                    }}
                    wrapperCol={{
                        span: 22,
                    }}
                    layout="horizontal"
                    // disabled={readonly}
                    initialValues={{
                        opened: 'y',
                        metaDivision: 'data',
                        markating: false,
                        responseYn: false
                    }}
                    style={{ width: '100%', opacity: 1 }}>
                    <Form.Item label='제목' name='title'
                        // labelStyle={{ fontSize: 14 }}
                        rules={[
                            {
                                required: true,
                                message: `제목을 입력해 주세요!`,
                            },
                            {
                                whitespace: true,
                                message: `제목을 입력해 주세요!`,
                            },
                        ]}>
                        <Input disabled={false} placeholder="제목 입력 (최대 30자)" style={{ fontSize: 14, height: 32 }} />
                    </Form.Item>
                    <Form.Item label='공개 여부' name='opened'
                        rules={[
                            {
                                required: true,
                                message: `공개 여부를 선택해 주세요!`,
                            },
                        ]}>
                        <Radio.Group disabled={readonly} options={openTypeOptions} />
                    </Form.Item>
                    <Form.Item label='구분' name='metaDivision'
                        rules={[
                            {
                                required: true,
                                message: `구분을 선택해 주세요!`,
                            },
                        ]}>
                        <Radio.Group disabled={false} onChange={metaDivisionClick} options={qnaTypeOptions} />
                    </Form.Item>
                    <Form.Item label='문의내용' name='contents' disabled={false}>
                        <TheCkeditor
                            data={textData}
                            setData={setTextData}
                        >
                        </TheCkeditor>
                    </Form.Item>
                    <Form.Item label='파일' name='attachedFileList'>
                        <FileUpload
                            onFileRemoved={onFileRemoved}
                            onFileInserted={onFileInserted}
                            initialFileList={initialFileList}
                        />
                    </Form.Item>
                    <Form.Item name="metaDivision" hidden noStyle />
                    <Form.Item name="metaEtc" hidden noStyle />
                    <Form.Item name="id" hidden noStyle />
                    <Form.Item name="deleteFileList" hidden noStyle />
                    <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                        <Flex justify={'flex-end'} gap="small">
                            <NavLink to={`/cs-center/qna`}>
                                <Button size='large' style={{ width: 114 }}>
                                    목록으로
                                </Button>
                            </NavLink>
                            <Button htmlType="submit" type="primary" size='large' style={{ width: 114 }} disabled={loading}>
                                등록하기
                            </Button>
                            {id ?
                                <Popconfirm title='해당 게시물을 삭제 하시겠습니까?' description='' okText='삭제' cancelText='취소' onConfirm={deleteData}>
                                    <Button size='large' style={{ width: 114 }} disabled={loading}>
                                        삭제하기
                                    </Button>
                                </Popconfirm>
                                :
                                <>
                                </>
                            }
                        </Flex>
                    </Form.Item>
                </Form>
            </SUInner1280>
        </LoadingSpinner>
    );

}