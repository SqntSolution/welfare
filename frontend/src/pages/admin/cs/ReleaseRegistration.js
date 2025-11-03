import React, { useState, useEffect } from 'react';
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Radio, Switch, App, Spin, Space, Typography, Modal, Popconfirm, Flex } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { FileUpload } from 'components/common/FileUpload';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';

//관리자 게시판 등록 및 업데이트 
const ReleaseRegistration = () => {

    const location = useLocation();
    const [readonly, setReadonly] = useState(); // 텍스트 편집도구 스위치버튼

    const [form] = Form.useForm();
    const [data, setData] = useState();

    const [loading, setLoading] = useState(false); //로딩

    const [commoncode, setCommoncode] = useState(); //  공통코드1

    const [textData, setTextData] = useState(); //문의내용   SQNT 꼭 필요하다   

    //파일첨부 관련
    const [initialFileList, setInitialFileList] = useState([]);
    const [insertedFiles, setInsertedFiles] = useState([]); // 파일 등록하기
    const [deletedFiles, setDeletedFiles] = useState([]); // 파일 삭제하기

    const { menu1, menu2, id, upid } = useParams();
    const navigate = useNavigate();

    const { error, info } = useMsg();

    const onFileRemoved = (files) => {
        setDeletedFiles(files)
    }

    const onFileInserted = (files) => {
        setInsertedFiles(files);
    }

    useEffect(() => {
        setReadonly(location?.state?.readonly ?? false);
        const fetchData = async () => {
            await getGroupCode('OPEN_TYPE');
            if (id && id !== 'new') { // 신규가 아닐 경우 
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

    // 게시판 데이터 조회
    const getData = async (type, params, successCallback) => {
        if (setLoading) setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/bbs/${id}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                form.setFieldsValue(resp?.data);
                setTextData(resp?.data?.contents ?? ''); // 텍스트 편집도구 데이터 수동전환
                form.setFieldsValue({ opened: (resp?.data?.opened === true ? 'y' : resp?.data?.opened === false ? 'n' : '') }); //공개여부 값변환
                form.setFieldsValue({ noticeType: (typeof resp?.data?.noticeType === 'number' ? resp?.data?.noticeType.toString() : '') }); //숫자 형태변환
                setInitialFileList(resp?.data?.attachedFileList ?? []); // 파일 첨부 데이터 수동전환
                if (successCallback) successCallback();
                setLoading(false);
                if (type === 'delete') info('삭제가 완료되었습니다.');
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };


    // 게시판 데이터 입력
    const pushData = async (type, code1, params, successCallback) => {
        if (setLoading) setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/bbs/${code1}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                form.setFieldsValue(resp?.data);
                setTimeout(() => {
                    if (successCallback) {
                        successCallback();
                    }
                }, 1000)
                setLoading(false);
                if (id && id !== 'new') {
                    info('게시글이 수정되었습니다.');
                } else {
                    info('게시글이 추가되었습니다.');
                }
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };


    // Form의 필드 값 전송
    const onFinish = async (values) => {
        // form?.setFieldsValue({ 
        //     contents: textData ,
        //     attachedFileList : insertedFiles,
        //     ...values
        //  });
        const formData = form.getFieldsValue();

        formData.authLevel = formData.authLevel ?? 0; //권한
        formData.contents = textData ?? ''; //내용
        formData.opened = formData.opened === 'y' ? true : formData.opened === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.attachedFileList = insertedFiles ?? []; //업로드할파일
        formData.deleteFileList = deletedFiles ?? []; // 삭제할 파일

        if (await validationCheck(formData)) pushData('post', 'release', formData, () => navigate(-1));
    }

    // 밸리데이션 체크
    const validationCheck = async (formData) => {

        if (formData?.contents?.trim() === '' || typeof formData?.contents === 'undefined') {
            info('본문 내용을 입력하세요.');
            return false;
        }

        if (formData?.title?.trim() === '' || typeof formData?.title === 'undefined') {
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

    const mindleForm = () => {
        return (
            <>
                <StyledFormItem label='제목' name='title'
                    rules={[
                        {
                            required: !readonly,
                            message: `제목을 입력해 주세요!`,
                        },
                        {
                            whitespace: !readonly,
                            message: `제목을 입력해 주세요!`,
                        },
                    ]}>
                    <Input disabled={readonly} placeholder="제목을 입력해주세요" />
                </StyledFormItem>
                <StyledFormItem label='공지유형' name='noticeType'
                    rules={[
                        {
                            required: !readonly,
                            message: `공지유형을 선택해 주세요!`,
                        },
                    ]}>
                    <Radio.Group disabled={readonly} >
                        <Radio value='0' >일반</Radio>
                        <Radio value='1' >중요</Radio>
                    </Radio.Group>
                </StyledFormItem>
                {
                    (id && id !== 'new')
                        ?
                        <StyledFormItem label='작성자' name='createUserNm'>
                            <Input disabled={true} style={{ width: '100%' }} />
                        </StyledFormItem>
                        :
                        <></>
                }
                <StyledFormItem label='공개 여부' name='opened'
                    rules={[
                        {
                            required: !readonly,
                            message: `공개 여부를 선택해 주세요!`,
                        },
                    ]}>
                    <Radio.Group disabled={readonly} >
                        {commoncode?.map((item) => (
                            <Radio key={item.code} value={item.code} >{item.label}</Radio>
                        ))}
                    </Radio.Group>
                </StyledFormItem>
                <StyledFormItem label='내용' name='contents' disabled={readonly}>
                    <TheCkeditor
                        data={textData}
                        setData={setTextData}
                        readonly={readonly}
                        setReadonly={setReadonly}
                        style={{ width: '100%' }}
                    >
                        {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                    </TheCkeditor>
                </StyledFormItem>
                <StyledFormItem label='파일' name='attachedFileList'>
                    <FileUpload
                        readOnly={readonly}
                        onFileRemoved={onFileRemoved}
                        onFileInserted={onFileInserted}
                        initialFileList={initialFileList}
                    />
                </StyledFormItem>
                <Form.Item name="metaDivision" hidden />
                <Form.Item name="metaEtc" hidden />
                <Form.Item name="id" hidden />
                <Form.Item name="deleteFileList" hidden />
            </>
        );
    }


    const ButtonForm = () => {
        return (
            <>
                <Form.Item >
                    <Flex justify={'center'} gap={8} style={{ marginTop: 32 }}>
                        {/* <NavLink to={`/admin/${menu1}/${menu2}`}> */}
                        <Button
                            // type="primary"
                            disabled={readonly}
                            style={{ width: 114 }}
                            size='large'
                            onClick={() => navigate(-1, { state: id })}
                        >
                            목록으로
                        </Button>
                        {(id && id !== 'new') ?
                            <>
                                <Popconfirm
                                    title='해당 게시물을 삭제 하시겠습니까?'
                                    description=''
                                    okText='삭제'
                                    cancelText='취소'
                                    size='large'
                                    onConfirm={() => getData('delete', '', () => navigate(-1))}
                                >
                                    <Button
                                        type="primary"
                                        disabled={readonly}
                                        style={{ width: 114 }}
                                        danger
                                        size='large'
                                    >
                                        삭제
                                    </Button>
                                </Popconfirm>
                            </>
                            :
                            <>
                            </>
                        }
                        <Button type="primary" size='large' htmlType="submit" disabled={readonly} style={{ width: 114 }}>
                            등록
                        </Button>
                    </Flex>
                </Form.Item >
            </>
        );
    }


    const breadcrumb = [
        {
            title: 'Home',
        },
        {
            title: `고객센터`,
        },
        {
            title: `보도자료`,
        },
    ];


    return (

        <Spin spinning={loading}>
            <CustomAdminTitle title={"고객센터"} items={breadcrumb} />
            <InnerAdminDiv>
                <Form
                    onFinish={onFinish}
                    form={form}
                    // labelCol={{
                    //     span: 4,
                    // }}
                    // wrapperCol={{
                    //     span: 14,
                    // }}
                    layout="horizontal"
                    disabled={readonly}
                    initialValues={{
                        opened: 'y',
                        metaDivision: '1',
                        markating: false,
                        noticeType: '0',
                    }}
                    style={{
                        // minWidth: 1400,
                        width: '100%',
                        opacity: 1,
                    }}>
                    <Typography.Title level={5} style={{ marginBottom: 24, marginTop: 0 }}>보도자료</Typography.Title>
                    {
                        mindleForm()
                    }
                    {
                        ButtonForm()
                    }
                    <Form.Item name="authLevel" hidden />
                    <Form.Item name="metaDivision" hidden />
                    <Form.Item name="metaEtc" hidden />
                    <Form.Item name="id" hidden />
                    <Form.Item name="deleteFileList" hidden />
                </Form>
            </InnerAdminDiv>
        </Spin>
    );
}

export default ReleaseRegistration;