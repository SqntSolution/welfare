import React, { useState, useEffect } from 'react';
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { errorMsg } from 'utils/helpers';
import { CustomAdminTitle, ErrorMsg } from 'components/common/CustomComps'
import { Button, Checkbox, Form, Input, Radio, Switch, App, Spin, Space, Typography, Modal, InputNumber, Popconfirm, Flex } from 'antd';
// import { RegistrationCommon, CodeEditorForm, InputForm, RadioForm, CheckboxForm, FileForm, ButtonSwitch } from './RegistrationCommon';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { FileUpload } from 'components/common/FileUpload';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';

//관리자 게시판 등록 및 업데이트 
const QnaRegistration = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { menu1, menu2, id } = useParams();
    const { error, info } = useMsg();

    const [form] = Form.useForm();

    const [readonly, setReadonly] = useState(); // 텍스트 편집도구 스위치버튼
    const [loading, setLoading] = useState(false); //로딩
    const [responseType, setResponseType] = useState(false);

    const [commoncode, setCommoncode] = useState(); //  공통코드1
    const [commoncode2, setCommoncode2] = useState(); //  공통코드2 

    const [textData, setTextData] = useState(); //문의내용      
    const [textData2, setTextData2] = useState(); //답변내용      

    //파일첨부 관련
    const [initialFileList, setInitialFileList] = useState([]);

    useEffect(() => {
        setReadonly(location?.state?.readonly ?? true);
        const fetchData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode);
            await getGroupCode('QNA_TYPE', setCommoncode2);

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

    // 게시판 데이터 상세 조회
    const getData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/qna/${id}`, params)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                setTextData(resp?.data?.contents ?? ''); // 문의내용 수동전환
                setTextData2(resp?.data?.responseContents ?? ''); // 답변내용 수동전환
                setResponseType(resp?.data?.responseYn); // 답변상태 따로관리
                setInitialFileList(resp?.data?.attachedFileList ?? []); // 파일 첨부 리스트 수동전환
                form.setFieldsValue({ opened: (resp?.data?.opened === true ? 'y' : resp?.data?.opened === false ? 'n' : '') }); // open 여부 string 전환
                setTimeout(() => {
                    if (successCallback) {
                        successCallback();
                    }
                }, 1000)
                setLoading(false);
                if (type === 'post') info('게시물 답변이 등록되었습니다.');
                if (type === 'delete') info('게시물이 삭제 되었습니다.');
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    // QNA 답변수정
    const updateData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/cs/qna/${id}/update`, params)
            .then((resp) => {
                form.setFieldsValue(resp?.data);
                setTimeout(() => {
                    if (successCallback) {
                        successCallback();
                    }
                }, 1000)
                info('게시물 답변이 수정되었습니다.');
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


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

    // Form의 필드 값 전송
    const onFinish = async (values) => {

        const formData = form.getFieldsValue();

        // // formData.contents = textData ?? ''; //내용
        formData.responseContents = textData2 ?? ''; //답변내용

        // formData.opened = formData.opened === 'y' ? true : formData.opened === 'n' ? false : ''; // 공개여부 참 거짓변환 

        if (await validationCheck(formData)) { // 업력 벨리데이션 호출
            if (formData.responseYn === false) { // 상태가 문의접수 일경우 처음 데이터 입력
                getData('post', { responseContents: textData2 ?? '' }, () => navigate(`/admin/qna`));
            } else if (formData.responseYn === true) { // 상태가 답변완료 일 경우 입력한 데이터 수정
                updateData('post', { responseContents: textData2 ?? '' }, () => navigate(`/admin/qna`));
            } else { //데이터 이상 일경우
                info('QNA 입력 이상');
            }
        }

    }

    // 밸리데이션 체크
    const validationCheck = async (formData) => {
        if (formData?.responseContents.trim() === '') {
            info('답변내용을 작성하세요');
            return false;
        }
        return true;
    }

    const mindleForm = () => {
        return (
            <>
                <StyledFormItem label='제목' name='title'>
                    <Input disabled={readonly} placeholder="제목을 입력해주세요" />
                </StyledFormItem>
                <StyledFormItem label='등록일시' name='createdAt'>
                    <Input disabled={readonly} />
                </StyledFormItem>
                <StyledFormItem label='작성자' name='createUserNm'>
                    <Input disabled={readonly} />
                </StyledFormItem>
                <StyledFormItem label='조회수' name='viewCnt'>
                    <InputNumber disabled={readonly} />
                </StyledFormItem>
                <StyledFormItem label='공개 여부' name='opened'>
                    <Radio.Group disabled={readonly} >
                        {commoncode?.map((item) => (
                            <Radio key={item.code} value={item.code} >{item.label}</Radio>
                        ))}
                    </Radio.Group>
                </StyledFormItem>
                <StyledFormItem label='구분' name='metaDivision'>
                    <Radio.Group disabled={readonly} >
                        {commoncode2?.map((item) => (
                            <Radio key={item.code} value={item.code} >{item.label}</Radio>
                        ))}
                    </Radio.Group>
                </StyledFormItem>
                <StyledFormItem label='상태' name='responseYn'>
                    <Input disabled={readonly} />
                </StyledFormItem>
                <StyledFormItem label='파일' name='attachedFileList'>
                    <FileUpload
                        readOnly={readonly}
                        initialFileList={initialFileList}
                    />
                </StyledFormItem>
                <StyledFormItem label='문의 내용' name='contents' disabled={readonly}>
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
                {
                    responseType ?
                        <>
                            <StyledFormItem label='답변 일시' name='responseAt'>
                                <Input disabled={readonly} />
                            </StyledFormItem>
                        </>
                        :
                        null
                }
                <StyledFormItem label='답변자' name='responseUserNm'>
                    <Input disabled={readonly} />
                </StyledFormItem>
                <StyledFormItem label='답변 내용' name='responseContents' disabled={!readonly}>
                    <TheCkeditor
                        data={textData2}
                        setData={setTextData2}
                        readonly={!readonly}
                        setReadonly={setReadonly}
                    >
                        <br />
                        {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                    </TheCkeditor>
                </StyledFormItem>
                <Form.Item name="metaEtc" hidden />
                <Form.Item name="id" hidden />
                <Form.Item name="deleteFileList" hidden />
            </>
        );
    }

    const ButtonForm = () => {
        return (
            <>
                <Flex justify={'center'} gap={8} style={{ marginTop: 32 }}>
                    <Button
                        disabled={!readonly}
                        style={{ width: 114 }}
                        size='large'
                        onClick={() => navigate(-1, { state: id })}
                    >
                        목록으로
                    </Button>
                    <Button
                        disabled={!readonly}
                        style={{ width: 114 }}
                        size='large'
                        onClick={() => navigate(-1, { state: id })}
                    >
                        취소
                    </Button>
                    <Button type="primary" style={{ width: 114 }} size='large' htmlType="submit" disabled={!readonly}>
                        등록
                    </Button>
                    {/* {responseType ?
                        <> */}
                    <Popconfirm
                        title='해당 게시물을 삭제 하시겠습니까?'
                        description=''
                        okText='삭제'
                        cancelText='취소'
                        onConfirm={() => getData('delete', '', () => navigate(`/admin/qna`))}
                    >
                        <Button
                            style={{ width: 114 }}
                            size='large'
                            danger
                            type="primary" disabled={!readonly} >
                            삭제
                        </Button>
                    </Popconfirm>
                    {/* </>
                        :
                        <>
                        </>
                    } */}
                </Flex>

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
            title: `문의하기`,
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
                    // disabled={readonly}
                    initialValues={{
                        opened: 'y',
                        metaDivision: 'data',
                        markating: false
                    }}
                    style={{
                        width: '100%',
                        opacity: 1,
                    }}>
                    <Typography.Title level={5} style={{ marginBottom: 24, marginTop: 0 }}>문의하기</Typography.Title>

                    {
                        mindleForm()
                    }
                    {
                        ButtonForm()
                    }
                    <Form.Item name="metaDivision" hidden />
                    <Form.Item name="metaEtc" hidden />
                    <Form.Item name="id" hidden />
                    <Form.Item name="deleteFileList" hidden />
                </Form>
            </InnerAdminDiv>
        </Spin>
    );
}

export default QnaRegistration;