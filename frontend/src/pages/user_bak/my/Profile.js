/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Button, Flex, Row, Upload, Skeleton, Popconfirm, Avatar, Col, Descriptions, Spin } from 'antd';
import { ColTitle, InnerDiv } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';
import { isEmptyCheck } from 'utils/helpers';
import { UserAuthList } from './ProfileUserAuthList';
import styled from 'styled-components';
import { useMsg } from 'hooks/helperHook';
import { useNavigate } from 'react-router-dom';

export const Profile = (props) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const { error, info } = useMsg();
    const navigate = useNavigate();

    const getData = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get('/api/v1/user/my')
            .then(async (resp) => {
                setUserInfo(resp.data);
                const avatarPath = resp.data.avatarImgPath;
                await getImgSrc(avatarPath);
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    };

    const getImgSrc = async (avatarPath) => {
        if (!isEmptyCheck(avatarPath)) {
            setImgSrc(
                '/api/v1/view/image/' +
                avatarPath
                    .split('/')
                    ?.filter((e) => e !== '')
                    ?.join('/')
            );
        } else {
            setImgSrc(null);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    //이미지 업로드 이벤트
    const beforeUpload = async (file) => {
        const isImage = file.type.startsWith('image/');
        const maxSize = 2 * 1024 * 1024;

        if (!isImage) {
            error('이미지 파일만 업로드 가능합니다.');
            return false;
        }
        if (file?.size > maxSize) {
            error('이미지 파일은 2MB 까지만 업로드 가능합니다.');
            return false;
        }

        await imgUpload(file);

        return false;
    };

    const imgUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        await AXIOS.post('/api/v1/image', formData)
            .then(async (res) => {
                await profileImgUpdate(res.data);
            })
            .catch((error) => {
                error(error);
            })
            .finally(() => {
                getData();
            });
    };

    const profileImgUpdate = async (fileInfo) => {
        return await AXIOS.post(`/api/v1/user/my/avatar`, fileInfo)
            .then((res) => {
                info('프로필 이미지 업로드 완료');
            })
            .catch((err) => {
                error(err);
            });
    };

    const imgDeleteClick = () => {
        AXIOS.delete(`/api/v1/user/my/avatar`)
            .then((res) => {
                if (res.data === 'OK') {
                    info('프로필 이미지 삭제');
                }
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => getData());
    };

    const goHome = (e) => {
        e.stopPropagation();
        if (e.shiftKey) {
            AXIOS.post(`/api/v1/dummy/clear-session`)
                .then((resp) => {
                    navigate('/main');
                })
                .catch((err) => {
                    navigate('/main');
                })
        }
    }

    return (
        <Spin spinning={loading}>
            <InnerDiv>
                <Row justify="center" gap='middle' style={{ width: "100%" }} gutter={16}>
                    <Col span={24}>
                        <ColTitle
                            style={{
                                fontSize: 16,
                                fontWeight: 500,
                                background: 'transparent',
                                border: 0,
                                textAlign: 'left',
                                paddingTop: 16,
                                paddingBottom: 16
                            }}
                        >
                            Profile
                        </ColTitle>
                    </Col>
                    <Col span={2}>
                        <div className='profilImgArea' style={{ textAlign: 'center' }} onClick={goHome}>
                            {imgSrc?.length > 0 ? (
                                <Avatar size={80} src={imgSrc} />
                            ) : (
                                <Skeleton.Avatar active={false} size={80} shape='circle' />
                            )}
                        </div>
                        <Flex align='center' justify="center" gap={8} vertical style={{ marginTop: 16 }} >
                            <Upload
                                name='avatar'
                                showUploadList={false}
                                beforeUpload={beforeUpload}>
                                <Button size='small'>Upload</Button>
                            </Upload>
                            <Popconfirm title='프로필 이미지 삭제' description='' okText='삭제' cancelText='취소' onConfirm={imgDeleteClick}>
                                <Button danger size='small' type='primary'> Delete</Button>
                            </Popconfirm>
                        </Flex>
                    </Col>

                    <Col span={22} >
                        <StyledDescriptionsTop
                            bordered
                            labelStyle={{ width: 200, background: '#FAFAFA', color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                            style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                        >
                            <Descriptions.Item label={'이름'} span={3}>{userInfo?.name}</Descriptions.Item>
                            <Descriptions.Item label={'이메일'} span={3}>{userInfo?.email}</Descriptions.Item>
                            <Descriptions.Item label={'소속팀'} span={3}>{userInfo.teamName}</Descriptions.Item>
                            <Descriptions.Item label={'구분'} span={3}>{userInfo?.roleNm}</Descriptions.Item>
                            {/* <Descriptions.Item label={'그룹'} span={3}>{userInfo?.authGroupNm}</Descriptions.Item> */}
                            {/* <Descriptions.Item label={'설명'} span={3}>{userInfo?.groupDesc}</Descriptions.Item> */}
                        </StyledDescriptionsTop>

                        <StyledDescriptionsBottom
                            bordered
                            labelStyle={{ width: 200, background: '#FAFAFA', color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                            style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14, marginTop: 10 }}
                        >
                            <Descriptions.Item label={'권한'} span={3}><UserAuthList userAuth={userInfo.userAuthInfoList ?? []} /></Descriptions.Item>
                        </StyledDescriptionsBottom>

                    </Col>
                </Row>
            </InnerDiv>
        </Spin>
    );
};


const StyledDescriptionsTop = styled(Descriptions)`
&.ant-descriptions .ant-descriptions-row >th, 
&.ant-descriptions .ant-descriptions-row >td{font-size: 14px}
&.ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-content{padding: 16px;}
`;
const StyledDescriptionsBottom = styled(Descriptions)`
&.ant-descriptions .ant-descriptions-row >th, 
&.ant-descriptions .ant-descriptions-row >td{font-size: 14px}

&.ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-content{padding:0;}
& .ant-table-wrapper .ant-table.ant-table-small{font-size: 14px}
`;