import { useEffect, useRef, useState } from 'react';
import { Button, message, Checkbox, Col, Divider, Flex, Image, Input, Row, Spin, Modal, Layout, Radio, Form, Typography, Tree, Table, Descriptions } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { CustomFormColContent, CustomFormColLabel, CustomFormRow } from 'components/common/CustomComps';
import CategoryCheckboxTable from 'pages/admin/role/CategoryCheckboxTable';
import { ColTitle, InnerDiv } from 'styles/StyledCommon';

export const Alarm = (props) => {

    const { error, info } = useMsg();

    const [loading, setLoading] = useState(false);
    const [commentAlarmEnabled, setCommentAlarmEnabled] = useState(); //나의 댓글
    const [newPostAlarmEnabled, setNewPostAlarmEnabled] = useState(); //구독 신규 Post 등록
    const [noticeAlarmEnabled, setNoticeAlarmEnabled] = useState(); //공지등록
    const [qnaAnswerAlarmEnabled, setQnaAnswerAlarmEnabled] = useState(); //Q&A 답변
    const [subscribeMenuItems, setSubscribeMenuItems] = useState([]); // 구독리스트
    const [checkedKeys, setCheckedKeys] = useState([]); // 체크박스 배열

    //화면 처음 호출시에 세팅 해야 할 것들 init
    useEffect(() => {
        const fetchData = async () => {
            await getSubscribeMenuTable();
            await getAlarmList();
        }
        fetchData();
    }, []);


    //유저id로 AlarmList 가져오는 api
    const getAlarmList = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/my/alarm`)
            .then((resp) => {
                setNoticeAlarmEnabled(resp?.data?.noticeAlarmEnabled ?? []);
                setQnaAnswerAlarmEnabled(resp?.data?.qnaAnswerAlarmEnabled ?? []);
                setNewPostAlarmEnabled(resp?.data?.newPostAlarmEnabled ?? []);
                setCommentAlarmEnabled(resp?.data?.commentAlarmEnabled ?? []);
                setCheckedKeys(resp?.data?.subscribeIdList ?? [])
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    };

    // Table로 구현 권한이 있는 메뉴 조회
    const getSubscribeMenuTable = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/menu/auth`)
            .then((res) => {
                setSubscribeMenuItems(res.data.filter((item) => !item.contentType));
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })

    };

    //저장버튼 클릭시 토글버튼 정보 서버 전송
    const onSave = () => {
        const parentMenuId = [...subscribeMenuItems.map(elem => elem.id)];
        const postData = {
            noticeAlarmEnabled: noticeAlarmEnabled,
            qnaAnswerAlarmEnabled: qnaAnswerAlarmEnabled,
            commentAlarmEnabled: commentAlarmEnabled,
            newPostAlarmEnabled: newPostAlarmEnabled,
            subscribeIdList: checkedKeys.filter(elem => !parentMenuId.includes(elem)) // 임시주석
        };

        setLoading(true);
        AXIOS.post(`/api/v1/user/my/alarm`, postData)
            .then((resp) => {
                setLoading(false);
                info('저장되었습니다.');
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    }


    //라디오버튼 antd test
    const handleChange = e => {
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

            <InnerDiv>
                <Row>
                    <ColTitle span={3}
                        style={{
                            fontSize: 16,
                            fontWeight: 500,
                            background: 'transparent',
                            border: 0,
                            textAlign: 'left',
                            paddingTop: 16,
                            paddingBottom: 16
                        }}
                    >Alarm</ColTitle>
                </Row>
                <Descriptions title="" bordered style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                    labelStyle={{ fontSize: 14 }}
                >
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
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button type='primary' size='large' style={{ width: 114 }} onClick={onSave}>저장</Button>
                </div>
            </InnerDiv>
        </Spin>
    );
}
