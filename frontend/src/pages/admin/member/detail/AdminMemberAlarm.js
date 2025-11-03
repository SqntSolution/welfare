/**
 * @format
 */
import React, { useEffect, useState } from 'react';
import { Button, Divider, Radio, Form, Typography, Table, Checkbox, Spin, Descriptions } from 'antd';
import { AXIOS } from 'utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomFormColContent, CustomFormColLabel, CustomFormRow } from 'components/common/CustomComps';
import { MinusOutlined } from '@ant-design/icons';
import { useMsg } from 'hooks/helperHook';
import AuthCheckBoxTable from 'pages/admin/group/AuthCheckboxTable';
import CategoryCheckboxTable from 'pages/admin/role/CategoryCheckboxTable';

const subscribeStyle = {
    all: { width: '100px' },
    category: { width: '250px' },
    menu: { width: '400px' },
};

export const AdminMemberAlarm = (props) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const { userId } = useParams();

    const [commentAlarmEnabled, setCommentAlarmEnabled] = useState(); //나의 댓글
    const [newPostAlarmEnabled, setNewPostAlarmEnabled] = useState(); //구독 신규 Post 등록
    const [noticeAlarmEnabled, setNoticeAlarmEnabled] = useState(); //공지등록
    const [qnaAnswerAlarmEnabled, setQnaAnswerAlarmEnabled] = useState(); //Q&A 답변
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [subscribeMenuItems, setSubscribeMenuItems] = useState([]);
    const { error, info } = useMsg();

    //화면 처음 호출시에 세팅 해야 할 것들 init
    useEffect(() => {
        refresh();
        // getAlarmList(); //Alarm 정보 가져오기
    }, []);

    const refresh = () => {
        // setLoading(true);
        // getSubscribeMenuTable(); // 테이블정보 가져오기
        getAlarmList(); // alarm 정보 가져오기
        // setLoading(false);
    };

    //유저id로 AlarmList 가져오는 api
    const getAlarmList = async () => {
        setLoading(true);
        // refresh();
        // 반드시 return
        return await AXIOS.get(`/api/v1/admin/member/${userId}/alarm`)
            .then((resp) => {
                setNoticeAlarmEnabled(resp?.data?.noticeAlarmEnabled ?? []);
                setQnaAnswerAlarmEnabled(resp?.data?.qnaAnswerAlarmEnabled ?? []);
                setNewPostAlarmEnabled(resp?.data?.newPostAlarmEnabled ?? []);
                setCommentAlarmEnabled(resp?.data?.commentAlarmEnabled ?? []);
                setCheckedKeys([...(resp?.data?.subscribeIdList ?? [])]);
            })
            .then(() => {
                getSubscribeMenuTable();
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    // Table로 구현
    const getSubscribeMenuTable = async () => {
        return await AXIOS.get(`/api/v1/admin/common/menus`)
            .then((res) => {
                setSubscribeMenuItems(res.data.filter((item) => item.parentId == 0 && !item.contentType));
            })
            .catch((err) => {
                error(err);
            });
    };

    //저장버튼 클릭시 토글버튼 정보 서버 전송
    const onSave = async () => {
        setLoading(true);
        const parentMenuId = [...subscribeMenuItems.map((elem) => elem.id)];
        const postData = {
            noticeAlarmEnabled: noticeAlarmEnabled ?? false,
            qnaAnswerAlarmEnabled: qnaAnswerAlarmEnabled ?? false,
            commentAlarmEnabled: commentAlarmEnabled ?? false,
            newPostAlarmEnabled: newPostAlarmEnabled ?? false,
            subscribeIdList: checkedKeys.filter((elem) => !parentMenuId.includes(elem)) ?? [],
        };
        return await AXIOS.post(`/api/v1/admin/member/${userId}/alarm`, postData)
            .then((resp) => {
                info('저장되었습니다.');
            })
            .then(() => {
                getAlarmList();
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //라디오버튼 antd test
    const handleChange = (e) => {
        switch (e.target.name) {
            case '공지등록':
                setNoticeAlarmEnabled(e.target.value);
                break;
            case 'Q&A답변':
                setQnaAnswerAlarmEnabled(e.target.value);
                break;
            case '구독신규Post등록':
                setNewPostAlarmEnabled(e.target.value);
                break;
            case '나의댓글':
                setCommentAlarmEnabled(e.target.value);
                break;
            default:
                break;
        }
    };

    return (
        <Spin spinning={loading}>
            <Typography.Title level={5} style={{ margin: '0 0 32px 0', padding: 0 }}>
                {props?.title}
            </Typography.Title>
            <Descriptions bordered size='small' labelStyle={{ width: 300 ,height: 54 }}>
                <Descriptions.Item label='공지 등록' span={3}>
                    <Radio.Group onChange={handleChange} value={noticeAlarmEnabled} name='공지등록'>
                        <Radio value={true}>네, 알림을 받습니다.</Radio>
                        <Radio value={false}>아니오</Radio>
                    </Radio.Group>
                </Descriptions.Item>

                <Descriptions.Item label='Q&A 답변' span={3}>
                    <Radio.Group onChange={handleChange} value={qnaAnswerAlarmEnabled} name='Q&A답변'>
                        <Radio value={true}>네, 알림을 받습니다.</Radio>
                        <Radio value={false}>아니오</Radio>
                    </Radio.Group>
                </Descriptions.Item>

                <Descriptions.Item label='나의 댓글 (대댓글 등록 시 알림)' span={3}>
                    <Radio.Group onChange={handleChange} value={commentAlarmEnabled} name='나의댓글'>
                        <Radio value={true}>네, 알림을 받습니다.</Radio>
                        <Radio value={false}>아니오</Radio>
                    </Radio.Group>
                </Descriptions.Item>

                <Descriptions.Item label='카테고리/메뉴 구독 (Post 등록 시 알림)' span={3}>
                    <Radio.Group onChange={handleChange} value={newPostAlarmEnabled} name='구독신규Post등록'>
                        <Radio value={true}>네, 알림을 받습니다.</Radio>
                        <Radio value={false}>아니오</Radio>
                    </Radio.Group>
                </Descriptions.Item>
            </Descriptions>

            <CustomFormRow width='800px'>
                <CategoryCheckboxTable dataSource={subscribeMenuItems ?? []} checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} />
            </CustomFormRow>

            <div style={{ margin: '10px 0px', textAlign: 'center' }}>
                <Button onClick={onSave}>저장</Button>
            </div>
        </Spin>
    );
};

export default AdminMemberAlarm;
