import React, { useState, useEffect } from 'react';
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, Switch, App, Spin, Space, Modal, Typography, Popconfirm, Flex } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { FileUpload } from 'components/common/FileUpload';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';
import { CustomAdminTitle } from 'components/common/CustomComps';


//관리자 게시판 등록 및 업데이트 
const FaqRegistration = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { error, info } = useMsg();
    const { menu1, menu2, id, upid } = useParams();

    const [form] = Form.useForm();

    const [readonly, setReadonly] = useState(); // 텍스트 편집도구 스위치버튼
    const [loading, setLoading] = useState(false); //로딩
    const [commoncode, setCommoncode] = useState(); //  공통코드1
    const [commoncode2, setCommoncode2] = useState(); //  공통코드2 
    const [textData, setTextData] = useState(); //문의내용   SQNT 꼭 필요하다    

    //파일첨부 관련
    const [initialFileList, setInitialFileList] = useState([]);
    const [insertedFiles, setInsertedFiles] = useState([]); // 파일 등록하기
    const [deletedFiles, setDeletedFiles] = useState([]); // 파일 삭제하기


    const onFileRemoved = (files) => {
        setDeletedFiles(files)
    }

    const onFileInserted = (files) => {
        setInsertedFiles(files);
    }

    useEffect(() => {
        setReadonly(location?.state?.readonly ?? false);
        const fetchData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode);
            await getGroupCode('FAQ_TYPE', setCommoncode2);

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


    // 게시판 데이터 조회
    const getData = async (type, params, successCallback) => {
        if (setLoading) setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/bbs/${id}`, params)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                form.setFieldsValue({ opened: (resp?.data?.opened === true ? 'y' : resp?.data?.opened === false ? 'n' : '') });
                setTextData(resp?.data?.contents ?? '');
                setInitialFileList(resp?.data?.attachedFileList ?? []);
                setTimeout(() => {
                    if (successCallback) {
                        successCallback();
                    }
                }, 1000)
                setLoading(false);
                if (type == 'delete') info('게시물이 삭제되었습니다.');
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // 게시판 데이터 입력
    const pushData = async (type, code1, params, successCallback) => {
        if (setLoading) setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/bbs/${code1}`, params)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                setTimeout(() => {
                    if (successCallback) {
                        successCallback();
                    }
                }, 1000)
                setLoading(false);
                if (id && id !== 'new') {
                    info('게시물이 수정되었습니다.');
                } else {
                    info('게시물이 추가되었습니다.');
                }
            })
            .catch((err) => {
                error(err);
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

        formData.authLevel = formData.authLevel ?? 0; //내용
        formData.contents = textData ?? ''; //내용
        // formData.responseContents = textData2 ?? ''; //내용
        formData.opened = formData.opened === 'y' ? true : formData.opened === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.attachedFileList = insertedFiles ?? []; //업로드할파일
        formData.deleteFileList = deletedFiles ?? []; // 삭제할 파일
        // const param = { ...values }

        if (await validationCheck(formData)) pushData('post', 'faq', formData, () => navigate(-1));

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
                {
                    (id && id !== 'new')
                        ?
                        <StyledFormItem label='작성자' name='createUserNm'>
                            <Input disabled={true} />
                        </StyledFormItem>
                        :
                        <></>
                }
                {/* {
                    readonly ?
                        <>
                            <StyledFormItem label='등록일시' name='createdAt'>
                                <Input disabled={readonly} />
                            </StyledFormItem>
                            <StyledFormItem label='작성자' name='createUserNm'>
                                <Input disabled={readonly} />
                            </StyledFormItem>
                            <StyledFormItem label='조회수' name='viewCnt'>
                                <InputNumber disabled={readonly} />
                            </StyledFormItem>
                        </>
                        :
                        <>
                        </>

                } */}
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
                <StyledFormItem label='구분' name='metaDivision'
                    rules={[
                        {
                            required: !readonly,
                            message: `구분을 선택해 주세요!`,
                        },
                    ]}>
                    <Radio.Group disabled={readonly} >
                        {commoncode2?.map((item) => (
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
                    >
                        <br />
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
                {

                    (
                        <Form.Item >
                            <Flex justify={'center'} gap={8} style={{ marginTop: 32 }} >
                                {/* <NavLink to={`/admin/${menu1}/${menu2}`}> */}
                                <Button
                                    disabled={readonly}
                                    style={{ width: 114 }}
                                    size='large'
                                    onClick={() => navigate(-1, { state: id })}
                                >
                                    목록으로
                                </Button>
                                {/* </NavLink> */}
                                <Button size='large' style={{ width: 114 }} onClick={() => navigate(-1)} disabled={readonly} >
                                    취소
                                </Button>
                                <Button type="primary" size='large' style={{ width: 114 }} htmlType="submit" disabled={readonly}>
                                    등록
                                </Button>
                                {(id && id !== 'new') ?
                                    <>
                                        <Popconfirm
                                            title='해당 게시물을 삭제 하시겠습니까?'
                                            description=''
                                            okText='삭제'
                                            cancelText='취소'
                                            size='large'
                                            style={{ width: 114 }}
                                            onConfirm={() => getData('delete', { params: {} }, () => navigate(-1))}
                                        >
                                            <Button type="primary" danger style={{ width: 114 }} size='large'>
                                                삭제
                                            </Button>
                                        </Popconfirm>
                                    </>
                                    :
                                    <>
                                    </>
                                }
                            </Flex>
                        </Form.Item >
                    )

                }
            </>
        );
    }

    const breadcrumb =
        [
            {
                title: 'Home',
            },
            {
                title: `고객센터`,
            },
            {
                title: `질문모음`,
            },
        ]
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
                        metaDivision: 'search',
                        markating: false
                    }}
                    style={{
                        width: '100%',
                        opacity: 1,
                    }}>
                    <Typography.Title level={5} style={{ marginBottom: 24, marginTop: 0 }}>질문모음</Typography.Title>
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

export default FaqRegistration;