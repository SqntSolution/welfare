/**
 * @format
 */
import { Button, Col, DatePicker, Flex, Form, Input, Popconfirm, Radio, Row, Space, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isEmptyCheck } from 'utils/helpers';
import { AdminAlarmModal } from './AdminAlarmModal';
import { CloseSquareOutlined } from '@ant-design/icons';
import { SelectTableModal } from '../group/SelectTableModal';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { CustomAdminTitle, CustomFormColContent, CustomFormColLabel, CustomFormRow } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';

export const AdminAlarmRegistration = () => {
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [alarmData, setAlarmData] = useState();
    const [sendType, setSendType] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeamList, setSelectedTeamList] = useState([]);
    const [selectedMemberList, setSelectedMemberList] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [modalType, setModalType] = useState('team');
    const isEdit = location.pathname.includes('/edit');
    const [disabledComp, setDisabledComp] = useState(false);
    const { id } = useParams();
    const { error, info } = useMsg();

    useEffect(() => {
        if (isEdit) {
            getData();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        form.setFieldValue('teamIdList', [...selectedTeamList.map(elem => elem)]);
        form.setFieldValue('userIdList', [...selectedMemberList.map((elem) => elem.empId)]);
    }, [selectedTeamList, selectedMemberList]);

    const getData = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/admin/alarm/${id}`)
            .then((res) => {
                setAlarmData(res?.data);
                form.setFieldsValue({
                    sendTitle: res?.data?.sendTitle ?? '',
                    useScheduleSend: res?.data?.useScheduleSend ?? false,
                    scheduleSendAt: res?.data?.scheduleSendAt ? dayjs(res?.data?.scheduleSendAt) : null,
                    teamIdList: [...(res?.data?.targetTeamList ?? [])],
                    userIdList: [...(res?.data?.targetUserList ?? [])],
                    notyStr: res?.data?.notyStr ?? '',
                });
                setDisabledComp(res?.data?.sentAt ? true : false);
                setSendType(res?.data?.useScheduleSend);
                setSelectedTeamList([...(res?.data?.targetTeamList ?? [])]);
                setSelectedMemberList([...(res?.data?.targetUserList ?? [])]);
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 개인 또는 팀 선택에 대한 props
    const modalProp = {
        member: {
            title: '사용자 선택', //모달 타이틀
            data: memberList ?? [],
            columns: [
                // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: '25%', ellipsis: true, },
                { title: '상위팀', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: '25%', ellipsis: true },
                { title: '팀', key: 'orgNm', dataIndex: 'orgNm', width: '25%', ellipsis: true },
                {
                    title: '이름/직함',
                    key: 'empNm',
                    // align: 'center',
                    width: '25%',
                    ellipsis: true,
                    render: (_, record) => (
                        <span title={`${record.empNm} ${record.empGradeNm}`}>
                            {record.empNm} {record.empGradeNm}
                        </span>
                    ),
                },
                {
                    title: '선택',
                    align: 'center',
                    width: '15%',
                    ellipsis: true,
                    render: (_, record) => {
                        if (selectedDataValid(selectedMemberList, record.empId)) {
                            return (
                                <Button type='primary' onClick={() => deleteMemberListCilckHandler(record.empId)}>
                                    취소
                                </Button>
                            );
                        } else {
                            return <Button onClick={() => modalOkHandler(record)}>선택</Button>;
                        }
                    },
                },
            ],
            rowKey: 'empId',
            placeholder: '이름 또는 팀명으로 검색하세요.',
            width: 800,
        },
        team: {
            title: '팀 선택', //모달 타이틀
            data: teamList ?? [],
            columns: [
                // { title: '법인코드', key: 'compid', dataIndex: 'compid', width: '25%', ellipsis: true, },
                { title: '상위팀', key: 'parentOrgNm', dataIndex: 'parentOrgNm', width: '25%', ellipsis: true },
                { title: '팀', key: 'orgNm', dataIndex: 'orgNm', width: '25%', ellipsis: true },
                {
                    title: '선택',
                    align: 'center',
                    width: '15%',
                    ellipsis: true,
                    render: (_, record) => {
                        if (selectedDataValid(selectedTeamList, record?.orgKey)) {
                            return (
                                <Button type='primary' onClick={() => deleteTeamListCilckHandler(record?.orgKey)}>
                                    취소
                                </Button>
                            );
                        } else {
                            return <Button onClick={() => modalOkHandler(record)}>선택</Button>;
                        }
                    },
                },
            ],
            rowKey: 'orgKey',
            placeholder: '상위팀명 또는 팀명으로 검색하세요.',
            width: 600,
        },
    };

    // 개인 선택 모달 데이터
    const getMemberList = () => {
        setModalLoading(true);
        setIsModalOpen(true);
        AXIOS.get(`/api/v1/admin/common/members`)
            .then((res) => {
                setMemberList(res.data);
            })
            .catch((err) => {
                error(err);
            })
            .then(() => {
                setModalType('member');
            })
            .then(() => {
                setModalLoading(false);
            });
    };

    // 팀 선택 모달 데이터
    const getTeamList = () => {
        setModalLoading(true);
        setIsModalOpen(true);
        AXIOS.get(`/api/v1/admin/common/orgs`)
            .then((res) => {
                setTeamList(res.data);
            })
            .catch((err) => {
                error(err);
            })
            .then(() => {
                setModalType('team');
            })
            .then(() => {
                setModalLoading(false);
            });
    };

    // 선택 불가능한 날짜 지정
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    // 개인 선택 이벤트
    const onPersonalAddCilckHandler = (e) => {
        getMemberList();
    };

    // 팀 선택 이벤트
    const onTeamAddCilckHandler = (e) => {
        getTeamList();
    };

    // 알림대상 삭제 (팀)
    const deleteTeamListCilckHandler = (value) => {
        setSelectedTeamList(selectedTeamList?.filter((elem) => elem?.orgKey !== value));
    };

    // 알림대상 삭제 (유저)
    const deleteMemberListCilckHandler = (value) => {
        setSelectedMemberList(selectedMemberList?.filter((elem) => elem?.empId !== value));
    };

    // 발송 버튼 이벤트
    const onSendRegClickHandler = async () => {
        if (selectedMemberList?.length < 1 && selectedTeamList?.length < 1) {
            error('알림 발송 대상을 선택해 주세요.');
            return;
        }

        try {
            const values = await form.validateFields();
        } catch (errorInfo) {
            error('입력값을 확인 해주세요.');
            return;
        }

        if (isEdit) {
            await editAlarm();
        } else {
            await registrationAlarm();
        }
    };

    // API 호출 파라미터 반환
    const makeParam = () => {
        return {
            sendTitle: form.getFieldValue('sendTitle'),
            useScheduleSend: form.getFieldValue('useScheduleSend'),
            scheduleSendAt: form.getFieldValue('useScheduleSend') ? form.getFieldValue('scheduleSendAt')?.format('YYYYMMDDHHmm') : undefined,
            teamIdList: [...(form.getFieldValue('teamIdList') ?? [])],
            userIdList: [...(form.getFieldValue('userIdList') ?? [])],
            notyStr: form.getFieldValue('notyStr'),
        };
    };

    // 알림 등록
    const registrationAlarm = async () => {
        setLoading(true);
        const postData = makeParam();
        AXIOS.post(`/api/v1/admin/alarm`, postData)
            .then((res) => {
                if (postData?.useScheduleSend) {
                    info('예약되었습니다.');
                } else {
                    info('발송되었습니다.');
                }
                navigate(`/admin/alarm`, { replace: true });
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 알림 수정
    const editAlarm = async () => {
        setLoading(true);
        const postData = makeParam();
        AXIOS.post(`/api/v1/admin/alarm/${id}`, postData)
            .then((res) => {
                if (postData?.useScheduleSend) {
                    info('예약되었습니다.');
                } else {
                    info('발송되었습니다.');
                }
                navigate(`/admin/alarm`, { replace: true });
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 모달창 선택 된 대상 확인 (취소, 선택 버튼 변경)
    const selectedDataValid = (list, data) => {
        if (modalType === 'team') {
            // if (list.find((elem) => elem.orgId === data)) {
            if (list.find((elem) => elem?.orgKey === data)) {
                return true;
            }
            return false;
        } else {
            if (list.find((elem) => elem.empId === data)) {
                return true;
            }
            return false;
        }
    };

    const modalOkHandler = (data) => {
        if (modalType === 'team') {
            setSelectedTeamList((prev) => [...prev, { compid: data?.compid, orgId: data?.orgFullCode, orgNm: data?.orgNm, orgKey: data?.orgKey }]);
        } else {
            setSelectedMemberList((prev) => [...prev, data]);
        }
    };

    // 현재시간 + 1 시간 10분 단위로 셋팅
    const getResetTime = () => {
        const units = dayjs().minute() % 10;
        return dayjs()
            .add(1, 'hour')
            .add(10 - units, 'minute');
    };

    const useScheduleSendClick = (e) => {
        setSendType(e.target.value);
        if (!e.target.value) {
            // setScheduleSendAt('');
            form.setFieldValue('scheduleSendAt', '');
        } else {
            // setScheduleSendAt(getResetTime());
            form.setFieldValue('scheduleSendAt', getResetTime());
        }
    };

    // 시간 변경 유효성검사
    const validDate = (date, stringDate) => {
        if (date != null) {
            const units = date.minute() % 10;
            const remainder = date.add(10 - units, 'minute');

            //한 시간 이후로만 선택 가능
            if (date < dayjs().add(59, 'm')) {
                error('예약 발송은 1시간 이후로 선택 가능합니다.');
                // setSendDate(getResetTime());
                form.setFieldValue('scheduleSendAt', getResetTime());
                return false;
            }
            //시간 단위는 10분 단위로만 선택 가능
            else if (units > 0) {
                error('10분 단위로 선택 능합니다.');
                date.minute();
                // setSendDate(remainder);
                form.setFieldValue('scheduleSendAt', remainder);
                return false;
            } else {
                // setSendDate(date);
                form.setFieldValue('scheduleSendAt', date);
                return true;
            }
        }
        //클리어 버튼 눌렀을 경우 현재 시간 + 1시간으로 초기화
        else {
            // setSendDate(getResetTime());
            form.setFieldValue('scheduleSendAt', getResetTime());
        }
    };

    const onDeleteClickHandler = async () => {
        if (!isEdit || disabledComp) {
            return;
        }
        await alarmDelete(id);
    };

    // 알림 삭제 API
    const alarmDelete = async (sendId) => {
        setLoading(true);
        return await AXIOS.delete(`/api/v1/admin/alarm/${sendId}`)
            .then((res) => {
                info('삭제되었습니다.');
                navigate(`/admin/alarm`, { replace: true });
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    };

    // 초기화 버튼 이벤트
    const onResetClickHandler = () => {
        if (isEdit) {
            form.setFieldsValue({
                sendTitle: alarmData?.sendTitle ?? '',
                useScheduleSend: alarmData?.useScheduleSend ?? false,
                scheduleSendAt: alarmData?.scheduleSendAt ? dayjs(alarmData?.scheduleSendAt) : null,
                teamIdList: [...(alarmData?.targetTeamList ?? [])],
                userIdList: [...(alarmData?.targetUserList ?? [])],
                notyStr: alarmData?.notyStr ?? '',
            });
            setSendType(alarmData?.useScheduleSend);
            setSelectedTeamList([...(alarmData?.targetTeamList ?? [])]);
            setSelectedMemberList([...(alarmData?.targetUserList ?? [])]);
        } else {
            form.resetFields();
            setSendType(false);
            setSelectedTeamList([]);
            setSelectedMemberList([]);
        }
    };

    const breadcrumbItems = [{ title: 'Home' }, { title: '알림' }, { title: `${isEdit ? '수정' : '등록'}` }];

    return (
        <>
            <CustomAdminTitle title={'알림'} items={breadcrumbItems} />
            <Spin spinning={loading}>
                <Form
                    form={form}
                    style={{ width: '100%' }}
                    initialValues={{
                        sendTitle: '',
                        useScheduleSend: false,
                        scheduleSendAt: null,
                        teamIdList: [],
                        userIdList: [],
                        notyStr: '',
                    }}>
                    <InnerAdminDiv>
                        <StyledFormItem
                            label='제목'
                            required
                            name='sendTitle'
                            messageVariables={{ title: '제목' }}
                            rules={[
                                {
                                    required: true,
                                    message: '${title}을 입력해주세요.',
                                },
                                {
                                    max: 30,
                                    message: '${title}은 최대 30자 까지만 입력 가능합니다.',
                                },
                            ]}>
                            {disabledComp ? (
                                <Typography.Text>{form.getFieldValue('sendTitle')}</Typography.Text>
                            ) : (
                                <Input showCount maxLength={30} type='text' styles={{ width: '100%' }} placeholder='제목을 입력해주세요.' />
                            )}
                        </StyledFormItem>

                        <StyledFormItem label='발송 방법' required name='useScheduleSend'>
                            <Radio.Group onChange={useScheduleSendClick} disabled={disabledComp}>
                                <Radio value={false}>즉시발송</Radio>
                                <Radio value={true}>예약발송</Radio>
                            </Radio.Group>
                        </StyledFormItem>

                        <StyledFormItem label='발송 일자' required name='scheduleSendAt'>
                            <DatePicker
                                showTime={{
                                    minuteStep: 10,
                                }}
                                disabledDate={disabledDate}
                                format={'YYYY-MM-DD HH:mm'}
                                disabled={!sendType || disabledComp}
                                onChange={validDate}
                            // value={scheduleSendAt}
                            />
                        </StyledFormItem>

                        <StyledFormItem label='팀'>
                            <Row>
                                {!disabledComp && (
                                    <Col span={2}>
                                        <Button onClick={onTeamAddCilckHandler}>선택</Button>
                                    </Col>
                                )}
                                <Col span={disabledComp ? 24 : 22} style={{ overflowY: 'auto', maxHeight: 100 }}>
                                    <Flex wrap='wrap' gap={4}>
                                        {(selectedTeamList ?? []).length > 0
                                            ? selectedTeamList?.map((elem, index) => {
                                                return (
                                                    <Tag
                                                        key={index}
                                                        closable={!disabledComp}
                                                        onClose={(e) => {
                                                            e.preventDefault();
                                                            deleteTeamListCilckHandler(elem?.orgKey);
                                                        }}>
                                                        {elem.orgNm}
                                                    </Tag>
                                                );
                                            })
                                            : null}
                                    </Flex>
                                </Col>
                            </Row>
                        </StyledFormItem>
                        <StyledFormItem label='개인'>
                            <Row>
                                {!disabledComp && (
                                    <Col span={2}>
                                        <Button onClick={onPersonalAddCilckHandler}>선택</Button>
                                    </Col>
                                )}
                                <Col span={disabledComp ? 24 : 22} style={{ overflowY: 'auto', maxHeight: 100 }}>
                                    <Flex wrap='wrap' gap={4}>
                                        {(selectedMemberList ?? []).length > 0
                                            ? selectedMemberList?.map((elem, index) => {
                                                return (
                                                    <Tag
                                                        key={index}
                                                        closable={!disabledComp}
                                                        onClose={(e) => {
                                                            e.preventDefault();
                                                            deleteMemberListCilckHandler(elem.empId);
                                                        }}>
                                                        {elem.orgNm} {elem.empNm}
                                                    </Tag>
                                                );
                                            })
                                            : null}
                                    </Flex>
                                </Col>
                            </Row>
                        </StyledFormItem>
                        <StyledFormItem
                            label='알림 내용'
                            required
                            messageVariables={{ title: '알림 내용' }}
                            name='notyStr'
                            rules={[
                                {
                                    required: true,
                                    message: '${title}을 입력해주세요',
                                },
                                {
                                    max: 4000,
                                    message: '최대 4000자 까지만 입력이 가능합니다.',
                                },
                            ]}>
                            <Input.TextArea
                                cols={100}
                                rows={10}
                                maxLength={4000}
                                showCount
                                placeholder='알림 내용을 입력해주세요.'
                                readOnly={disabledComp}></Input.TextArea>
                        </StyledFormItem>

                        <Form.Item name='teamIdList' noStyle hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name='userIdList' noStyle hidden>
                            <Input />
                        </Form.Item>

                        {/* 이전 소스 */}
                        {/* <CustomFormRow>
                            <CustomFormColLabel label='제목' span={4} required />
                            <CustomFormColContent span={20} display='block'>
                                <Form.Item
                                    // noStyle
                                    name='sendTitle'
                                    messageVariables={{ title: '제목' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: '${title}을 입력해주세요.',
                                        },
                                        {
                                            max: 30,
                                            message: '${title}은 최대 30자 까지만 입력 가능합니다.',
                                        },
                                    ]}>
                                    {disabledComp ? (
                                        <Typography.Text>{form.getFieldValue('sendTitle')}</Typography.Text>
                                    ) : (
                                        <Input showCount maxLength={30} type='text' styles={{ width: '100%' }} placeholder='제목을 입력해주세요.' />
                                    )}
                                </Form.Item>
                            </CustomFormColContent>
                            <CustomFormColLabel label='발송 방법' span={4} required />
                            <CustomFormColContent span={20}>
                                <Form.Item name='useScheduleSend' noStyle>
                                    <Radio.Group onChange={useScheduleSendClick} disabled={disabledComp}>
                                        <Radio value={false}>즉시발송</Radio>
                                        <Radio value={true}>예약발송</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </CustomFormColContent>
                            <CustomFormColLabel label='발송 일자' span={4} required />
                            <CustomFormColContent span={20}>
                                <Form.Item name='scheduleSendAt' noStyle>
                                    <DatePicker
                                        showTime={{
                                            minuteStep: 10,
                                        }}
                                        disabledDate={disabledDate}
                                        format={'YYYY-MM-DD HH:mm'}
                                        disabled={!sendType || disabledComp}
                                        onChange={validDate}
                                        // value={scheduleSendAt}
                                    />
                                </Form.Item>
                            </CustomFormColContent>
                            <CustomFormColLabel label='팀' span={4} />
                            <CustomFormColContent span={2}>
                                {!disabledComp && <Button onClick={onTeamAddCilckHandler}>선택</Button>}
                            </CustomFormColContent>
                            <CustomFormColContent span={18}>
                                <Row style={{ overflowY: 'auto', maxHeight: 100 }}>
                                    {(selectedTeamList ?? []).length > 0
                                        ? selectedTeamList?.map((elem, index) => {
                                              return (
                                                  <Col key={index} style={{ marginRight: 5 }}>
                                                      <Tag
                                                          closable={!disabledComp}
                                                          onClose={(e) => {
                                                              e.preventDefault();
                                                              deleteTeamListCilckHandler(elem.orgId);
                                                          }}>
                                                          {elem.orgNm}
                                                      </Tag>
                                                  </Col>
                                              );
                                          })
                                        : null}
                                </Row>
                            </CustomFormColContent>
                            <Form.Item name='teamIdList' noStyle hidden>
                                <Input />
                            </Form.Item>
                            <CustomFormColLabel label='개인' span={4} />
                            <CustomFormColContent span={2}>
                                {!disabledComp && <Button onClick={onPersonalAddCilckHandler}>선택</Button>}
                            </CustomFormColContent>
                            <CustomFormColContent span={18}>
                                <Row style={{ overflowY: 'auto', maxHeight: 100 }}>
                                    {(selectedMemberList ?? []).length > 0
                                        ? selectedMemberList?.map((elem, index) => {
                                              return (
                                                  <Col key={index} style={{ marginRight: 5 }}>
                                                      <Tag
                                                          closable={!disabledComp}
                                                          onClose={(e) => {
                                                              e.preventDefault();
                                                              deleteMemberListCilckHandler(elem.empId);
                                                          }}>
                                                          {elem.orgNm} {elem.empNm}
                                                      </Tag>
                                                  </Col>
                                              );
                                          })
                                        : null}
                                </Row>
                            </CustomFormColContent>
                            <Form.Item name='userIdList' noStyle hidden>
                                <Input />
                            </Form.Item>
                            <CustomFormColLabel label='알림 내용' span={4} required />
                            <CustomFormColContent span={20} display='block'>
                                <Form.Item
                                    // noStyle
                                    messageVariables={{ title: '알림 내용' }}
                                    name='notyStr'
                                    rules={[
                                        {
                                            required: true,
                                            message: '${title}을 입력해주세요',
                                        },
                                        {
                                            max: 4000,
                                            message: '최대 4000자 까지만 입력이 가능합니다.',
                                        },
                                    ]}>
                                    <Input.TextArea
                                        cols={100}
                                        rows={10}
                                        maxLength={4000}
                                        showCount
                                        placeholder='알림 내용을 입력해주세요.'
                                        readOnly={disabledComp}></Input.TextArea>
                                </Form.Item>
                            </CustomFormColContent>
                        </CustomFormRow> */}

                        {/* 하단 버튼 */}
                        <Flex style={{ marginTop: 32 }} justify={'center'} gap={8}>
                            <Button onClick={() => navigate(-1)} size='large' style={{ width: 114 }}>
                                목록
                            </Button>
                            {!disabledComp && (
                                <>
                                    <Button size='large' style={{ width: 114 }} onClick={onResetClickHandler}>
                                        초기화
                                    </Button>
                                    <Button type='primary' size='large' style={{ width: 114 }} onClick={onSendRegClickHandler}>
                                        발송
                                    </Button>

                                    {isEdit && (
                                        <Popconfirm title='알림을 삭제합니다.' description='' okText='삭제' cancelText='취소' onConfirm={onDeleteClickHandler}>
                                            <Button danger size='large' style={{ width: 114 }} type='primary'>
                                                삭제
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </>
                            )}
                        </Flex>
                        <SelectTableModal
                            title={modalProp[modalType]?.title}
                            data={modalProp[modalType]?.data}
                            columns={modalProp[modalType]?.columns}
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            rowKey={modalProp[modalType]?.rowKey}
                            placeholder={modalProp[modalType]?.placeholder}
                            loading={modalLoading ?? false}
                            width={modalProp[modalType]?.width}
                        />
                    </InnerAdminDiv>
                </Form>
            </Spin>
        </>
    );
};

export default AdminAlarmRegistration;
