/**
 * @format
 */
import { useEffect, useState } from 'react';
import { CustomAdminTitle, CustomFormColContent, CustomFormColLabel, CustomFormRow } from 'components/common/CustomComps';
import { Breadcrumb, Button, Col, DatePicker, Flex, Form, Input, Popconfirm, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import { AXIOS } from 'utils/axios';
import { isEmptyCheck } from 'utils/helpers';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CloseSquareOutlined, MinusOutlined } from '@ant-design/icons';
import { useConfirmPopup } from 'hooks/popups';
import dayjs from 'dayjs';
import { SelectTableModal } from '../group/SelectTableModal';
import { useMsg } from 'hooks/helperHook';
import CategoryCheckboxTable from './CategoryCheckboxTable';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';
const { RangePicker } = DatePicker;

const AdminContentsManagerRegistration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = location.pathname.includes('/edit') && id;
    const [loading, setLoading] = useState(true);
    const [dateValues, setDateValues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [authGroupList, setAuthGroupList] = useState([]);
    const [form] = Form.useForm();
    const { error, info } = useMsg();
    const [modalLoading, setModalLoading] = useState(true);
    const [originData, setOriginData] = useState();

    useEffect(() => {
        // if (isEdit) {
        //     getDetail();
        // } else {
        //     setDateValues([dayjs(), dayjs().add(30, 'd')]);
        // }
        // getUser();
        // getAuthGroupTable();
        refresh();
    }, []);

    const refresh = () => {
        // setLoading(true);
        if (isEdit) {
            getDetail();
        } else {
            setDateValues([dayjs(), dayjs().add(30, 'd')]);
        }
        // await getUser();
        getAuthGroupTable();
        // setLoading(false);
    };

    const getDetail = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/admin/role/manager/${id}`)
            .then((res) => {
                const resData = {
                    userId: id,
                    userNm: res.data?.userNm ?? '',
                    startAuthAtStr: dayjs(res.data?.startAuthAt)?.format('YYYY-MM-DD') ?? '',
                    endAuthAtStr: dayjs(res.data?.endAuthAt)?.add(-1, 'd').format('YYYY-MM-DD') ?? '',
                    authMenuIdList: [...(res.data?.authMenuIdList ?? [])],
                };
                setOriginData({ ...resData, empGradeNm: res.data?.empGradeNm ?? '', orgNm: res.data?.orgNm ?? '' });
                form.setFieldsValue(resData);
                setCheckedKeys([...(res.data?.authMenuIdList ?? [])]);
                setDateValues([dayjs(resData?.startAuthAtStr), dayjs(resData?.endAuthAtStr)]);
                // setSelectedUser(`${res.data?.orgNm} ${res.data?.userNm} ${res.data?.empGradeNm}`);
                setSelectedUser(`${res.data?.userNm}`);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const getUser = async () => {
        // setLoading(true);
        setIsModalOpen(true);
        setModalLoading(true);
        return await AXIOS.get(`/api/v1/admin/common/members`)
            .then((res) => {
                setUserList(res.data ?? []);
                // setIsModalOpen(true);
            })
            .catch((err) => {
                error(err);
                // setIsModalOpen(false);
            })
            .finally(() => {
                setModalLoading(false);
            });
    };

    // Table로 구현
    const getAuthGroupTable = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/admin/common/dynamic-menus`)
            .then((res) => {
                setAuthGroupList(res.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    const onDateChange = (dates, stringDates) => {
        setDateValues(dates);
        form.setFieldValue('startAuthAtStr', stringDates[0] ?? '');
        form.setFieldValue('endAuthAtStr', stringDates[1] ?? '');
    };

    // const startDateChangeHandler = (date, stringDate) => {
    //     if (date > dateValues[1]) {
    //         setDateValues([date, date.add(1)]);
    //     } else {
    //         setDateValues([date, dateValues[1]]);
    //     }
    //     form.setFieldValue('startAuthAtStr', stringDate ?? '');
    // };

    // const endDateChangeHandler = (date, stringDate) => {
    //     setDateValues([dateValues[0], date]);
    //     form.setFieldValue('endAuthAtStr', stringDate ?? '');
    // };

    const modalColumn = [
        // { title: '법인코드', dataIndex: 'compid', key: 'compid', width: '25%', ellipsis: true },
        { title: '이름', key: 'userNm', dataIndex: 'userNm', width: "20%", ellipsis: true, },
        { title: '이메일', key: 'mailAddr', dataIndex: 'mailAddr', width: "25%", ellipsis: true, },
        { title: '전화번호', key: 'mobileNo', dataIndex: 'mobileNo', width: "20%", ellipsis: true, },
        { title: '계정 활성화 여부', key: 'active', dataIndex: 'active', width: "20%", ellipsis: true, render: (_, record) => (<>{record ? "활성화" : "비활성화"}</>) },
        {
            title: '선택',
            align: 'center',
            width: '15%',
            ellipsis: true,
            render: (_, record) => (
                <Button onClick={() => modalOkHandler(record)}>
                    선택
                </Button>
            ),
        },
    ];

    /**
     * 모달 ok 클릭 이벤트
     * @param {*} e
     */
    const modalOkHandler = (data) => {
        setIsModalOpen(false);
        setSelectedUser(`${data?.userNm ?? ''}`);
        // setSelectedUser(`${data?.orgNm} ${data?.userNm ?? ''} ${data?.empGradeNm}`);
        form.setFieldValue('userId', data?.userId ?? '');
        form.setFieldValue('userNm', data?.userNm ?? '');
    };

    //필드 초기화
    const resetFields = () => {
        if (isEdit) {
            form.setFieldsValue({
                userId: originData?.userId,
                userNm: originData?.userNm,
                startAuthAtStr: originData?.startAuthAtStr,
                endAuthAtStr: originData?.endAuthAtStr,
                authMenuIdList: originData?.authMenuIdList,
            });
            setCheckedKeys([...(originData?.authMenuIdList ?? [])]);
            setDateValues([dayjs(originData?.startAuthAtStr), dayjs(originData?.endAuthAtStr)]);
            setSelectedUser(`${originData?.orgNm} ${originData?.userNm} ${originData?.empGradeNm}`);
        } else {
            form.setFieldsValue({
                userId: '',
                userNm: '',
                startAuthAtStr: dayjs().format('YYYY-MM-DD'),
                endAuthAtStr: dayjs().add(30, 'd').format('YYYY-MM-DD'),
                authMenuIdList: [],
            });
            setDateValues([dayjs(), dayjs().add(30, 'd')]);
            setCheckedKeys([]);
            setSelectedUser('');
        }
    };

    const deleteContentsManager = async () => {
        if (id === undefined) {
            return;
        }

        return await AXIOS.delete(`/api/v1/admin/role/manager/${id}`)
            .then(() => {
                info('삭제 되었습니다.');
                navigate(`/admin/role/manager`, { replace: true });
            })
            .catch((err) => {
                error(err);
            });
    };

    const submit = async () => {
        const validateMessage = await validateInput();

        if (validateMessage !== '') {
            error(validateMessage);
        } else {
            if (isEdit) await updateContentsManager();
            else await registerContentsManager();
        }
    };

    const updateContentsManager = async () => {
        const userId = form.getFieldValue('userId');
        if (isEmptyCheck(userId)) {
            return;
        }
        const postParam = {
            ...form.getFieldsValue(),
        };

        return await AXIOS.post(`/api/v1/admin/role/manager/${userId}`, postParam)
            .then(() => {
                info('수정 완료 되었습니다.');
                navigate(`/admin/role/manager`);
            })
            .catch((err) => {
                error(err);
            });
    };

    const registerContentsManager = async () => {
        const userId = form.getFieldValue('userId');
        if (isEmptyCheck(userId)) {
            return;
        }
        const postParam = {
            ...form.getFieldsValue(),
        };

        return await AXIOS.post(`/api/v1/admin/role/manager`, postParam)
            .then(() => {
                info('등록 완료 되었습니다.');
                navigate(`/admin/role/manager`);
            })
            .catch((err) => {
                error(err);
                form.setFieldsValue({
                    userId: '',
                    userNm: '',
                });
                setSelectedUser('');
            });
    };

    const validateInput = async () => {
        const { startAuthAtStr, endAuthAtStr, userId, authMenuIdList } = form.getFieldsValue();

        if (isEmptyCheck(startAuthAtStr) || isEmptyCheck(endAuthAtStr)) {
            return '활동일을 입력해주세요';
        }
        if (isEmptyCheck(userId)) {
            return '사용자를 입력해주세요.';
        }
        if (isEmptyCheck(authMenuIdList)) {
            return '카테고리/메뉴를 선택해주세요';
        }
        return '';
    };

    const openModal = () => {
        getUser();
        // setIsModalOpen(true);
    };

    useEffect(() => {
        form.setFieldValue('authMenuIdList', [...checkedKeys]);
    }, [checkedKeys]);

    const removeUser = () => {
        setSelectedUser('');
        form.setFieldValue('userId', '');
        form.setFieldValue('userNm', '');
    };

    const disabledDate = (current) => {
        return current && current.format('YYYY-MM-DD') < dayjs().format('YYYY-MM-DD');
    };

    const rangePresets = [
        {
            label: '[30일]',
            value: [dayjs(), dayjs().add(30, 'd')],
        },
        {
            label: '[60일]',
            value: [dayjs(), dayjs().add(60, 'd')],
        },
        {
            label: '[90일]',
            value: [dayjs(), dayjs().add(90, 'd')],
        },
        {
            label: '[6개월]',
            value: [dayjs(), dayjs().add(6, 'M')],
        },
        {
            label: '[1년]',
            value: [dayjs(), dayjs().add(1, 'y')],
        },
    ];
    const breadcrumb = [
        {
            title: 'Home',
        },
        {
            title: '관리자',
        },
        {
            title: '콘텐츠 관리자',
        },
    ];

    return (
        <>
            <Spin spinning={loading}>
                <SelectTableModal
                    title='운영자 검색 및 선택'
                    data={userList}
                    columns={modalColumn}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    rowKey='userId'
                    placeholder='이름 또는 팀명으로 검색하세요.'
                    loading={modalLoading}
                    width={800}
                />

                <CustomAdminTitle title={'관리자'} items={breadcrumb} />
                <InnerAdminDiv>
                    <Form
                        form={form}
                        initialValues={{
                            userId: '',
                            userNm: '',
                            startAuthAtStr: dayjs().format('YYYY-MM-DD'),
                            endAuthAtStr: dayjs().add(30, 'd').format('YYYY-MM-DD'),
                            authMenuIdList: [],
                        }}>
                        <Typography.Title level={3}>콘텐츠 관리자</Typography.Title>
                        <StyledFormItem label='활동일' required>
                            <RangePicker onChange={onDateChange} value={dateValues} disabledDate={disabledDate} presets={rangePresets} />
                        </StyledFormItem>
                        <StyledFormItem label='매니저 지정' required>
                            <Flex gap={8} align='center'>
                                {!isEdit && (
                                    <Button onClick={() => openModal()} size={'small'}>
                                        선택
                                    </Button>
                                )}
                                {form.getFieldValue('userId') ? (
                                    <>
                                        <Tag closable={!isEdit} onClose={() => removeUser()}>{selectedUser}</Tag>
                                    </>
                                ) : (
                                    ''
                                )}
                            </Flex>
                        </StyledFormItem>

                        <CustomFormRow width='50vw' border={0}>
                            <Form.Item name='startAuthAtStr' hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name='endAuthAtStr' hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name='userId' hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name='userNm' hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item name='authMenuIdList' hidden>
                                <Input />
                            </Form.Item>

                            <CustomFormColLabel
                                label='카테고리/메뉴: '
                                justifyContent={'flex-end'}
                                span={3}
                                borderBottom={'0'}
                                borderRight={'0px'}
                                fontWeight={400}
                                textAlign={'right'}
                                required
                                background={'#fff'}
                                alignItems={'none'}
                            />

                            <CustomFormColContent span={18} background={'#fff'} padding={'0px'} borderRight={'0px'} borderBottom={'0'}>
                                <div style={{ marginTop: -16 }}>
                                    <CategoryCheckboxTable
                                        dataSource={authGroupList ?? []}
                                        checkedKeys={checkedKeys}
                                        setCheckedKeys={setCheckedKeys}
                                        checkStrictly
                                    />
                                </div>
                            </CustomFormColContent>
                        </CustomFormRow>
                    </Form>

                    <Flex justify='center' gap={8} style={{ marginTop: 24 }}>
                        <Button onClick={() => navigate(-1)} size='large' style={{ width: 114 }}>
                            목록
                        </Button>
                        <Button type='primary' onClick={() => submit()} style={{ width: 114 }} size='large'>
                            등록
                        </Button>
                        <Button size='large' style={{ width: 114 }} onClick={() => resetFields()}>
                            초기화
                        </Button>
                        {isEdit && (
                            <Popconfirm title='콘텐츠 관리자를 삭제합니다.' description='' okText='삭제' cancelText='취소' onConfirm={deleteContentsManager}>
                                <Button danger style={{ width: 114 }} size='large'>
                                    삭제
                                </Button>
                            </Popconfirm>
                        )}
                    </Flex>
                </InnerAdminDiv>
            </Spin>
        </>
    );
};
export default AdminContentsManagerRegistration;
