import React, { useState, useEffect } from 'react';
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Switch, App, Spin, Checkbox, ColorPicker, Space, DatePicker, Typography, Flex, Popconfirm, Select } from 'antd';
import { AXIOS } from 'utils/axios';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { useMsg } from 'hooks/helperHook';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PopupModal } from './PopupModal';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};
const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};

const { Option } = Select;
//관리자 게시판 등록 및 업데이트 

const PopupRegistration = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState();

    const [loading, setLoading] = useState(false); //로딩
    const [commoncode, setCommoncode] = useState(); // 
    const [menuIdList, setMenuIdList] = useState(); // 
    // const [commoncode3, setCommoncode3] = useState(); // 

    const [textData, setTextData] = useState([]);
    // const [readonly, setReadonly] = useState(false);

    const [imagePath, setImagePath] = useState();
    const [open, setOpen] = useState(false);

    const [displayDate, setDisplayDate] = useState();

    const { menu1, menu2, id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { readonly, state } = location?.state || {};
    const { error, info } = useMsg();

    const disabledDate = (current) => {
        const today = dayjs().startOf('day');
        return current.startOf('day').isBefore(today) && !current.startOf('day').isSame(today);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getGroupCode('OPEN_TYPE', setCommoncode);
            await getMenuId(); // 화면선택
            // await getGroupCode('BANNER_TYPE', setCommoncode3);
            if (id && id !== 'new') { // 신규가 아닐 경우 
                await getData('get',
                    {
                        params:
                        {
                        }
                    },
                    null);
            }
        }
        fetchData();
    }, []);


    // 팝업 데이터 단건 조회
    const getData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/popup/${id}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                form.setFieldsValue(resp?.data);
                form.setFieldsValue({ enabled: (resp?.data?.enabled === true ? 'y' : resp?.data?.enabled === false ? 'n' : '') });
                setTextData(resp?.data?.contents ?? '');
                setDisplayDate([resp?.data?.displayStartDate ? dayjs(resp?.data?.displayStartDate) : '', resp?.data?.displayEndDate ? dayjs(resp?.data?.displayEndDate) : '']);
                if (successCallback) successCallback();
                setLoading(false);
                if (type === 'delete') {
                    info('게시물이 삭제 되었습니다.');
                }
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const insertData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/popup`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                if (successCallback) successCallback();
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
    }


    //공통코드 호출 
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


    //공통코드 메뉴ID 호출 
    const getMenuId = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/menu/main`)
            .then((resp) => {
                setMenuIdList([{ label: 'Home', value: '0' }, ...resp?.data?.map(elem => {
                    return { label: elem?.menuNm, value: `${elem?.id}` }
                })])
                // setMenuIdList(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    // 날짜 변경시 함수
    const dayChange = (date, dateString) => {
        setDisplayDate(date);
        form.setFieldsValue({
            ...form,
            displayStartDate: dateString[0],
            displayEndDate: dateString[1]
        });

    };

    // 흐린 안내문구 
    const onPhrases = (text) => {
        return (
            <p style={{ filter: 'blur(0px)', color: '#999999' }}>
                {text}
            </p>
        );
    }

    //셀랙트 박스 값 선택
    const selectChange = (value, name) => {

    }

    // Form의 필드 값들을 수집할 때 사용될 콜백 함수
    const onFinish = async (values) => {
        const formData = form.getFieldsValue();

        formData.enabled = formData.enabled === 'y' ? true : formData.enabled === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.id = id ? id : null;
        formData.contents = textData ?? ''; //팝업내용

        if (await validationCheck(formData)) insertData('post', formData, () => navigate(`/admin/popup`));
    }

    // 밸리데이션 체크
    const validationCheck = async (formData) => {


        if (textData?.length === 0) {
            info('팝업내용을 작성하세요');
            return false;
        }

        if (formData?.title?.trim() === '') {
            info('제목을 작성하세요');
            return false;
        }

        if (formData?.enabled === '') {
            info('공개여부를 선택 작성하세요');
            return false;
        }

        return true;
    }

    const breadcrumb = [
        { title: 'Home', },
        { title: `팝업`, },
    ];


    return (
        <Spin spinning={loading}>
            <CustomAdminTitle title={"팝업"} items={breadcrumb} />
            <InnerAdminDiv>
                <Flex justify="space-between" style={{ marginBottom: 24 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>Popup</Typography.Title>
                    <Button style={{ width: 114 }} onClick={() => setOpen(true)} type="primary" size='large'>미리보기</Button>
                </Flex>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelCol={{
                        span: 1,
                    }}
                    // wrapperCol={{
                    //     span: 14,
                    // }}
                    layout="horizontal"
                    initialValues={{
                        enabled: 'y',
                        linkType: '0',
                    }}
                    style={{
                        width: "100%"
                    }}
                >
                    <StyledFormItem label="제목" name="title"
                        rules={[
                            {
                                required: !readonly,
                                message: `제목을 입력해 주세요!`,
                            },
                            {
                                whitespace: !readonly,
                                message: `제목을 입력해 주세요!`,
                            },
                        ]}
                    >
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
                    </StyledFormItem>
                    <StyledFormItem label="상태" name="enabled"
                        rules={[
                            {
                                required: !readonly,
                                message: '상태를 선택해 주세요!',
                            },
                        ]}
                    >
                        <Radio.Group>
                            {commoncode?.map((item) => (
                                <Radio key={item.code} value={item.code}>{item.label}</Radio>
                            ))}
                        </Radio.Group>
                    </StyledFormItem>
                    <StyledFormItem label="화면 선택" name="displayMenuIds"
                        rules={[
                            {
                                required: !readonly,
                                message: '화면을 선택해 주세요!',
                            },
                        ]}

                    >
                        <Select style={{ width: 150 }} onChange={selectChange} options={menuIdList}>
                            {/* <Option value='0' >Home</Option>
                            {menuIdList?.map((option, index) => (
                                <Option key={option.id} value={option.id} label>
                                    {option.menuNm}
                                </Option>
                            ))} */}
                        </Select>
                    </StyledFormItem>
                    {/* <Form.Item label="버튼 창 열림" name="linkType"
                    rules={[
                        {
                            required: !readonly,
                            message: '버튼 창 열림을 선택해 주세요!',
                        },
                    ]}
                >
                    <Radio.Group>
                        {commoncode3?.map((item) => (
                            <Radio key={item.code} value={item.code}>{item.label}</Radio>
                        ))}
                    </Radio.Group>
                </Form.Item> */}
                    <StyledFormItem label="유효일" name="day" >
                        <Space direction="horizontal" size={12}>
                            <RangePicker disabledDate={disabledDate} onChange={dayChange} allowEmpty={[true, true]} value={displayDate} />
                            {/* {onPhrases('테스트')} */}
                        </Space>
                    </StyledFormItem>
                    <StyledFormItem label='팝업 내용' name="contents" disabled={readonly}>
                        <TheCkeditor
                            data={textData}
                            setData={setTextData}
                            readonly={readonly}
                        >
                            {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                        </TheCkeditor>
                        <p style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)', margin: 0 }}>※ 사용자 화면에 표시 되는 팝업 size는 400 x 450 입니다.</p>
                    </StyledFormItem>
                    <Form.Item name="displayStartDate" hidden />
                    <Form.Item name="displayEndDate" hidden />
                    {/* <Form.Item name="displayMenuIds" hidden /> */}
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ marginTop: 32 }}>
                        <Space direction="horizontal">
                            <NavLink to={`/admin/popup`}>
                                <Button size='large' style={{ width: 114 }}>
                                    목록으로
                                </Button>
                            </NavLink>
                            <NavLink to={`/admin/popup`}>
                                <Button size='large' style={{ width: 114 }}>
                                    취소
                                </Button>
                            </NavLink>
                            <Button type="primary" htmlType="submit" size='large' style={{ width: 114 }}>
                                등록
                            </Button>
                            {state === 'new' ?
                                <></>
                                :
                                state === 'update' ?
                                    <Popconfirm
                                        title='해당 게시물을 삭제 하시겠습니까?'
                                        description=''
                                        okText='삭제'
                                        cancelText='취소'
                                        onConfirm={() => getData('delete', { params: {} }, () => navigate(`/admin/popup`))}
                                    >
                                        <Button type="primary" danger size='large' style={{ width: 114 }}>
                                            삭제하기
                                        </Button>
                                    </Popconfirm>
                                    :
                                    <></>
                            }
                        </Space>
                    </Form.Item>
                </Form>
                <PopupModal open={open} setOpen={setOpen} textData={textData} id='2' type='preview' />
            </InnerAdminDiv>
        </Spin>
    );

}

export default PopupRegistration;