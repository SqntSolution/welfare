import React, { useState, useEffect } from 'react';
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, Switch, App, Spin, Checkbox, ColorPicker, Space, DatePicker, Flex, Typography, Modal, Popconfirm, InputNumber } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BannerModal } from 'pages/admin/banner/BannerModal'
// import { PostRepresentativeImage } from 'pages/user/postedit/PostRepresentativeImage'
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';
import { PostRepresentativeImage } from 'pages/user_bak/postedit/PostRepresentativeImage';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;


const BannerRegistration = () => {

    const [form] = Form.useForm();
    const [data, setData] = useState();

    const [loading, setLoading] = useState(false); //로딩
    const [commoncode, setCommoncode] = useState(); // 구분 공통코드호출
    const [commoncode2, setCommoncode2] = useState(); // 공개여부 공통코드호출
    const [commoncode3, setCommoncode3] = useState(); // 공통코드호출
    // const [readonly, setReadonly] = useState(false);

    const [currentColor, setCurrentColor] = useState('#FFFFFF'); // 현재 색을 상태로 유지합니다.
    const [colorCheck, setColorCheck] = useState(false); // 컬러 체크 상태를 상태로 유지합니다.
    const [imagePath, setImagePath] = useState();
    const [displayOrder, setDisplayOrder] = useState();
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
            // await getGroupCode('BANNER_DISPLAY', setCommoncode);
            await getGroupCode('OPEN_TYPE', setCommoncode2);
            await getGroupCode('BANNER_TYPE', setCommoncode3);
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

    useEffect(() => {
        form.setFieldValue('day', displayDate);
    }, [displayDate])


    // 배너 데이터 단건 조회
    const getData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/admin/banner/${id}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                form.setFieldsValue(resp?.data);
                form.setFieldsValue({ enabled: (resp?.data?.enabled === true ? 'y' : resp?.data?.enabled === false ? 'n' : '') });

                setDisplayDate([resp?.data?.displayStartDate ? dayjs(resp?.data?.displayStartDate) : '', resp?.data?.displayEndDate ? dayjs(resp?.data?.displayEndDate) : '']);
                // setDisplayDate([dayjs() , dayjs()]);
                setImagePath(data?.imagePath);

                if (resp?.data?.displayOrder) setDisplayOrder(resp?.data?.displayOrder);

                if (resp?.data?.backGroundColor) {
                    setCurrentColor(resp?.data?.backGroundColor); // 배너색
                    setColorCheck(true);
                    form.setFieldsValue({ colorCheck: true });
                }
                if (successCallback) {
                    setTimeout(() => {
                        successCallback();
                    }, 1000)
                }
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
        await AXIOS[type](`/api/v1/admin/banner`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                if (successCallback) {
                    setTimeout(() => {
                        successCallback();
                    }, 1000)
                }
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
        await AXIOS.get(`/api/v1/common/code-render/${type}`)
            .then((resp) => {
                setCommoncode(resp?.data);
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


    // 색상 추출
    const handleColorChange = (newColor, value) => {
        setCurrentColor(value); // 현재 색을 업데이트합니다.
    };


    // 체크박스 변경 이벤트 핸들러 함수
    const handleCheckboxChange = (e) => {
        setColorCheck(e.target.checked);
    };


    // Form의 필드 값들을 수집할 때 사용될 콜백 함수
    const onFinish = async (values) => {

        const formData = form.getFieldsValue();

        formData.imagePath = imagePath;
        formData.colorCheck === true ? formData.backGroundColor = currentColor : formData.backGroundColor = '#FFFFFF'
        formData.enabled = formData.enabled === 'y' ? true : formData.enabled === 'n' ? false : ''; // 공개여부 참 거짓변환 
        formData.id = id ? id : null
        formData.displayOrder = displayOrder;

        if (await validationCheck(formData)) insertData('post', formData, () => navigate(`/admin/banner`));
    }

    // 밸리데이션 체크
    const validationCheck = async (formData) => {

        if (
            // !formData?.colorCheck &&
            formData?.backGroundColor === "#FFFFFF"
            && (typeof imagePath === 'undefined' || imagePath?.trim() === '' || !imagePath)) {
            info('바탕이 흰색이고 이미지가 없을 경우 글자가 보이지 않습니다.');
            return false;
        }

        if (formData?.displayOrder === '' || typeof formData?.displayOrder === 'undefined') {
            info('표시순서를 지정하세요');
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
        { title: `배너`, },
    ];


    return (
        <Spin spinning={loading}>
            <CustomAdminTitle title={"배너"} items={breadcrumb} />
            <InnerAdminDiv>
                <Flex justify="space-between" style={{ marginBottom: 24 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>Banner</Typography.Title>
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
                        metaDivision: '1',
                        colorCheck: colorCheck ?? true,
                        backGroundColor: '#FFFFFF',
                        imagePath: imagePath,
                        linkType: 'new',
                        strategicMarketingOnly: false,
                    }}
                    style={{
                        minWidth: '100%',
                    }}
                >
                    <StyledFormItem label="제목" name="title">
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="제목을 입력해주세요" />
                    </StyledFormItem>
                    <StyledFormItem label="부제목" name="subTitle">
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="부제목을 입력해주세요" />
                    </StyledFormItem>
                    <StyledFormItem label="표시순서" name="displayOrder" required

                    >
                        {/* <Radio.Group>
                            {commoncode?.map((item) => (
                                <Radio key={item.code} value={Number(item.code)}>{item.label}</Radio>
                            ))}
                        </Radio.Group> */}
                        <InputNumber min={1} max={1000} style={{ width: "100%" }} value={displayOrder} onChange={(value) => setDisplayOrder(value)} placeholder="숫자가 낮을 수록 먼저 노출됩니다." />
                        <div style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}>* 처음에는 100, 200, 300... 으로 순서값을 세팅해보세요. 이후 배너가 추가 되는 경우 중간값으로 설정해보세요.</div>
                    </StyledFormItem>
                    <StyledFormItem label="상태" name="enabled"
                        rules={[
                            {
                                required: !readonly,
                                message: '상태를 선택해 주세요!',
                            },
                        ]}
                    >
                        <Radio.Group options={commoncode2} />
                    </StyledFormItem>
                    <StyledFormItem label="버튼 URL" name="link"
                    // rules={[
                    //     {
                    //         required: !readonly,
                    //         message: `버튼 URL 을 입력해 주세요!`,
                    //     },
                    //     {
                    //         whitespace: !readonly,
                    //         message: `버튼 URL 을 입력해 주세요!`,
                    //     },
                    // ]}
                    >
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="주소를 입력하지 않을 시 버튼이 나타나지 않습니다." />
                    </StyledFormItem>
                    <StyledFormItem label="버튼 창 열림" name="linkType"
                        rules={[
                            {
                                // required: !readonly,
                                message: '버튼 창 열림을 선택해 주세요!',
                            },
                        ]}
                    >
                        <Radio.Group options={commoncode3} />
                    </StyledFormItem>
                    <StyledFormItem label="유효일" name="day" required>
                        <RangePicker disabledDate={disabledDate} onChange={dayChange} allowEmpty={[true, true]} value={displayDate} style={{ width: 300 }} />
                    </StyledFormItem>
                    <StyledFormItem label="배너이미지" name="imagePath" required  >
                        <>
                            <PostRepresentativeImage initialImagePath={data?.imagePath ?? ''} setImagePath={setImagePath} />
                        </>
                    </StyledFormItem>
                    <StyledFormItem label="BG Color" name='colorCheck' valuePropName="checked" onChange={handleCheckboxChange}>
                        <Checkbox>사용</Checkbox>
                    </StyledFormItem>
                    <StyledFormItem label="BG Color Select" name="backGroundColor">
                        <Space direction="horizontal">
                            <ColorPicker
                                onChange={handleColorChange}
                                value={currentColor}
                                showText
                                disabled={!colorCheck}
                            // text={data?.backGroundColor || '#FFFFFF'}
                            />
                            <Button type="primary"
                                style={{ backgroundColor: currentColor }}
                                disabled={!colorCheck}
                            >
                                Color Picker
                            </Button>
                        </Space>
                    </StyledFormItem>
                    <Form.Item>
                        <Flex justify={'center'} gap={8} >
                            <Button style={{ width: 114 }} size='large' onClick={() => navigate(-1, { state: id })} >
                                목록으로
                            </Button>
                            <Button style={{ width: 114 }} size='large' onClick={() => navigate(-1, { state: id })}>
                                취소
                            </Button>
                            <Button style={{ width: 114 }} type="primary" size='large' htmlType="submit">
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
                                        onConfirm={() => getData('delete', { params: {} }, () => navigate(`/admin/banner`))}
                                    >
                                        <Button type="primary" danger size='large' style={{ width: 114 }}>
                                            삭제하기
                                        </Button>
                                    </Popconfirm>
                                    :
                                    <></>
                            }
                        </Flex>
                    </Form.Item>
                    <Form.Item name="displayStartDate" hidden />
                    <Form.Item name="displayEndDate" hidden />
                </Form>
                <BannerModal
                    stateModal={open}
                    setModal={setOpen}
                    form={form}
                    imagePath={imagePath ?? ''}
                    backGroundColor={currentColor ?? ''}
                />
            </InnerAdminDiv>
        </Spin>
    );

}

export default BannerRegistration;