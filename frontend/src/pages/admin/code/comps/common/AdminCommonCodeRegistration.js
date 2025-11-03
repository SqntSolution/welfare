import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Form, Input, Popconfirm, Row, Space, Typography } from 'antd';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { useMsg } from 'hooks/helperHook';
import { useConfirmPopup } from 'hooks/popups';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';

const AdminCommonCodeRegistration = () => {
    const [confirm, confirmContextHolder] = useConfirmPopup();

    const { id } = useParams();
    const { error, info } = useMsg()
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        getCodeGroupDetail();
    }, []);

    const getCodeGroupDetail = async () => {
        if (id === undefined)
            return;

        return await AXIOS.get(`/api/v1/admin/code/${id}`)
            .then(async (resp) => {
                form.setFieldsValue(resp?.data);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const createCodeGroup = async () => {
        if (id !== undefined)
            return;

        const params = await makeParam();

        return await AXIOS.post(`/api/v1/admin/code`, params)
            .then(async (resp) => {
                info('저장되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const updateCodeGroup = async () => {
        if (id === undefined)
            return;

        const params = await makeParam();

        return await AXIOS.post(`/api/v1/admin/code/${id}`, params)
            .then(async (resp) => {
                info('저장되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const deleteCodeGroup = async () => {
        if (id === undefined)
            return;

        return await AXIOS.delete(`/api/v1/admin/code/${id}`)
            .then(async (resp) => {
                info('삭제되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const submit = async () => {
        const validateMessage = await validateInput();

        if (validateMessage !== '') {
            error(validateMessage);
        }
        else {
            if (id === undefined)
                createCodeGroup();
            else
                updateCodeGroup();
        }
    }

    const makeParam = async () => {
        form.setFieldValue('codeList', form.getFieldValue('codeList').map((d, i) => ({ ...d, seq: i + 1 })))

        return form.getFieldsValue();
    }

    const validateInput = async () => {
        let emptyFlag = false;
        let duplicateFlag = false;

        if (form.getFieldValue('groupCode') === '' || form.getFieldValue('groupCode') === undefined)
            return '그룹 코드 ID를 입력해주세요.';

        if (form.getFieldValue('groupName') === '' || form.getFieldValue('groupName') === undefined)
            return '그룹 코드 명을 입력해주세요.';

        if (form.getFieldValue('codeList') === undefined)
            return '코드 항목을 하나 이상 입력해주세요';

        if (form.getFieldValue('codeList').length === 0)
            return '코드 항목을 하나 이상 입력해주세요';

        form.getFieldValue('codeList').forEach((d1, i1, arr) => {
            if (d1?.code === undefined || d1?.label === undefined)
                emptyFlag = true;

            arr.forEach((d2, i2) => {
                if (i1 !== i2 && d1?.code === d2?.code)
                    duplicateFlag = true;
            })
        });

        if (emptyFlag)
            return '코드 항목 값을 모두 입력해주세요';

        if (duplicateFlag)
            return '코드 항목은 중복될 수 없습니다';

        return '';
    }
    const breadcrumb = [
        { title: 'Home' },
        { title: '코드 관리' },
        { title: '공통 코드' },
        { title: id ? "상세" : "등록" },
    ];
    return (
        <>
            {confirmContextHolder}

            <CustomAdminTitle title={"코드"} items={breadcrumb} />

            <InnerAdminDiv>
                <Flex justify="space-between" align="end">
                    <Typography.Title level={4}>공통 코드</Typography.Title>
                </Flex>

                <Form form={form} labelCol={{ span: 4 }} >
                    <StyledFormItem label="코드 ID" name='groupCode' required>
                        <Input readOnly={id} onChange={e => { }} maxLength={30} placeholder="코드 ID를 입력해주세요. (50자 이내)" pattern='^[a-zA-Z0-9]+$' />
                    </StyledFormItem >
                    <StyledFormItem label="코드 명" name='groupName' required>
                        <Input.TextArea onChange={e => { }} style={{ resize: 'none' }} rows={1} maxLength={100} placeholder="코드 명을 입력해주세요. (100자 이내)" />
                    </StyledFormItem >
                    <StyledFormItem label="코드 설명" name='description' required>
                        <Input.TextArea onChange={e => { }} style={{ resize: 'none' }} rows={3} maxLength={500} placeholder="코드 설명을 입력해주세요. (500자 이내)" />
                    </StyledFormItem >
                    <Divider />
                    <Row style={{ width: '50%', }}>
                        <Form.List name='codeList' noStyle={true}>
                            {(fields, { add, remove, move }) => (
                                <>
                                    <Col span={4} style={{ background: '#fff', display: 'flex', alignItems: 'flex-start' }}>
                                        <Flex justify="flex-end" align="center" style={{ width: '100%', paddingTop: 4 }} gap={8}>
                                            <span>* 코드 항목</span>
                                            <Button onClick={() => add()} style={{ height: '100%', width: '24px', padding: 0, marginRight: 8 }} disabled={fields?.length >= 20}>+</Button>
                                        </Flex>
                                    </Col>
                                    <Col span={20} style={{ padding: 0 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #d9d9d9' }} align="center">
                                                <Form.Item {...restField} name={[name, 'code']} noStyle={true}>
                                                    <Input maxLength={50} placeholder='코드(50자 이내)' style={{ width: 270 }} />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'label']} noStyle={true}>
                                                    <Input maxLength={100} placeholder='코드명(100자 이내)' style={{ width: 270 }} />
                                                </Form.Item>
                                                <CaretUpFilled onClick={() => move(name, name - 1)} />
                                                <CaretDownFilled onClick={() => move(name, name + 1)} />
                                                <Button type='primary' size='small' danger onClick={() => remove(name)} >삭제</Button>
                                            </Space>
                                        ))}
                                    </Col>
                                </>
                            )}
                        </Form.List>
                    </Row>
                </Form>

                <Flex style={{ marginTop: 32 }} justify='center' gap={8}>
                    <Button size='large' style={{ width: 114 }} onClick={() => navigate(-1)}>목록</Button>
                    <Button size='large' type='primary' style={{ width: 114 }} onClick={() => submit()}>등록</Button>
                    {id === undefined && <Button size='large' style={{ width: 114 }} onClick={() => form.resetFields()}>초기화</Button>}
                    {id && <Popconfirm
                        title={<div>ID :{id} 코드를 삭제합니다.</div>}
                        description=''
                        okText='확인'
                        cancelText='취소'
                        onConfirm={() => deleteCodeGroup(id)}>
                        <Button size='large' type='primary' danger style={{ width: 114 }}>삭제</Button>
                    </Popconfirm>}
                </Flex>
            </InnerAdminDiv>
        </>
    );
}

export default AdminCommonCodeRegistration;