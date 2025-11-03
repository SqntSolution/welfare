import { Button, Checkbox, Col, Divider, Flex, Image, Input, Row, Spin, Modal, Layout, Radio, Form, App, Typography, InputNumber, Space, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { InnerDiv } from 'styles/StyledCommon';

// QNA 등록 및 QNA 문의접수 중 수정을 진행하는 화면

export const QnaInquiry = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg();
    const [form] = Form.useForm();
    const id = location?.state?.id ?? null;

    const [commoncode, setCommoncode] = useState(); //공개여부 라디오 버튼
    const [commoncode2, setCommoncode2] = useState(); //구분 라디오 버튼

    const [textData, setTextData] = useState(); //문의 내용
    const [loading, setLoading] = useState(false);
    const [readonly, setReadonly] = useState(false);

    const [initialFileList, setInitialFileList] = useState([]);
    const [insertedFiles, setInsertedFiles] = useState([]); //파일 등록하기
    const [deletedFiles, setDeletedFiles] = useState([]); //파일 삭제하기

    useEffect(() => {
        const fetchData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode);
            await getGroupCode('QNA_TYPE', setCommoncode2);
            //수정의 경우
            if (id) {
                await getData('get',
                    {
                        params:
                        {

                        }
                    },
                    '');
            }
        }
        fetchData();
    }, []);

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type, setCommoncode) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // 게시판 상세 데이터 조회[get], 수정[post], 삭제[delete]
    const getData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/user/cs/qna${id == null ? '' : '/' + id}`, params)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                form.setFieldsValue({ opened: (resp?.data?.opened === true ? 'y' : resp?.data?.opened === false ? 'n' : '') });
                setInitialFileList(resp?.data?.attachedFileList ?? []);
                setTextData(resp?.data?.contents ?? '');
                if (successCallback) {
                    setTimeout(() => {
                        successCallback();
                    }, 1000)
                }
                setLoading(false);
                if (type === 'delete') info('게시글이 삭제되었습니다.');
                if (id && type === 'post') {
                    info('게시글이 수정되었습니다.');
                } else if (type === 'post') {
                    info('게시글이 추가되었습니다.');
                }
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const onFileRemoved = (files) => {
        setDeletedFiles(files)
    }

    const onFileInserted = (files) => {
        setInsertedFiles(files);
    }

    const title = () => {
        return (
            <>
                <Typography.Title level={4}>Q&A</Typography.Title>
            </>
        );
    }

    // Form의 필드 값 전송
    const onFinish = async (values) => {
        const formData = form.getFieldsValue();

        formData.contents = textData ?? ''; //문의내용
        formData.opened = formData.opened === 'y' ? true : formData.opened === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.attachedFileList = insertedFiles ?? []; //업로드할파일
        formData.deleteFileList = deletedFiles ?? []; // 삭제할 파일
        formData.menuId = id ?? 12; // 메뉴 id 일단 하드 코딩
        formData.metaEtc = 'String';

        if (await validationCheck(formData)) getData('post', formData, () => navigate(-1));

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
        <Spin spinning={loading}>
            <InnerDiv>
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

                    <div >
                        {title()}
                    </div>
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
                        <Radio.Group disabled={readonly} >
                            {commoncode?.map((item) => (
                                <Radio key={item.code} value={item.code} >{item.label}</Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='구분' name='metaDivision'
                        rules={[
                            {
                                required: true,
                                message: `구분을 선택해 주세요!`,
                            },
                        ]}>
                        <Radio.Group disabled={false} onChange={metaDivisionClick}>
                            {commoncode2?.map((item) => (
                                <Radio key={item.code} value={item.code} >{item.label}</Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='문의내용' name='contents' disabled={false}>
                        <TheCkeditor
                            data={textData}
                            setData={setTextData}
                        // readonly={readonly}
                        // setReadonly={setReadonly}
                        >
                            {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                        </TheCkeditor>
                    </Form.Item>
                    <Form.Item label='파일' name='attachedFileList'>
                        <FileUpload
                            // readOnly={readonly}
                            onFileRemoved={onFileRemoved}
                            onFileInserted={onFileInserted}
                            initialFileList={initialFileList}
                        />
                    </Form.Item>
                    <Form.Item name="metaDivision" hidden />
                    <Form.Item name="metaEtc" hidden />
                    <Form.Item name="id" hidden />
                    <Form.Item name="deleteFileList" hidden />
                    <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                        <Flex justify={'flex-end'} gap="small">
                            <NavLink to={`/main/${menu1}/${menu2}`}>
                                <Button size='large' style={{ width: 114 }}>
                                    목록으로
                                </Button>
                            </NavLink>
                            <Button htmlType="submit" type="primary" size='large' style={{ width: 114 }} >
                                등록하기
                            </Button>
                            {id ?
                                <Popconfirm title='해당 게시물을 삭제 하시겠습니까?' description='' okText='삭제' cancelText='취소' onConfirm={() => getData('delete', '', () => navigate(`/main/${menu1}/${menu2}`))}>
                                    <Button size='large' style={{ width: 114 }}>
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
            </InnerDiv>
        </Spin>
    );

}