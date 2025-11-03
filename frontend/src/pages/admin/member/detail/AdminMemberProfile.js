/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Button, Flex, Image, Row, Spin, Upload, Skeleton, Popconfirm, Typography, Col, Descriptions } from 'antd';
import { ColData, ColTitle } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';
import { errorMsg, isEmptyCheck } from 'utils/helpers';
// import { UserAuthList } from 'pages/user/my/ProfileUserAuthList';
import { useParams } from 'react-router-dom';
import { useMsg } from 'hooks/helperHook';

export const AdminMemberProfile = (props) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [userAuthList, setUserAuthList] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const { userId } = useParams();
    const { error, info } = useMsg();

    const getData = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/admin/member/${userId}`)
            .then(async (resp) => {
                setUserInfo(resp.data);
                const avatarPath = resp.data?.avatarImgPath ?? '';
                await getImgSrc(avatarPath);
                setUserAuthList(resp.data?.userAuthInfoList?.filter((elem) => elem.parentMenuId !== 0));
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false)
            })
    };

    const getImgSrc = async (avatarPath) => {
        if (!isEmptyCheck(avatarPath)) {
            setImgSrc(`/api/v1/view/image/${avatarPath.split('/')?.filter((e) => e !== '')?.join('/')}`);
        } else {
            setImgSrc(null);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    //이미지 업로드 이벤트
    const beforeUpload = async (file) => {
        const isImage = file?.type?.startsWith('image/');
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
            .then(() => {
                getData();
            })
    };

    const profileImgUpdate = async (fileInfo) => {
        return await AXIOS.post(`/api/v1/admin/member/${userId}/avatar`, fileInfo)
            .then((res) => {
                info('프로필 이미지 업로드 완료');
            })
            .catch((err) => {
                error(err);
            });
    };

    const imgDeleteClick = () => {
        AXIOS.delete(`/api/v1/admin/member/${userId}/avatar`)
            .then((res) => {
                if (res.data === 'OK') {
                    info('프로필 이미지 삭제 완료');
                }
                getData();
            })
            .catch((err) => {
                error(err);
                getData()
            })
    };

    return (
        <Spin spinning={loading}>
            {/* 티이틀 */}
            <Typography.Title level={5} style={{ margin: "0 0 32px 0", padding: 0 }}>{props?.title}</Typography.Title>

            <Row gap='middle' style={{ width: '100%' }} gutter={24}>
                {/* 프로필 - 왼쪽 (이미지) */}
                <Col span={2} style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,10)', }} className='profilImgArea'>
                        {imgSrc?.length > 0 ? (
                            <Image
                                style={{
                                    minWidth: 64,
                                    width: 64,
                                    height: 64,
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }}
                                src={imgSrc}
                            />
                        ) : (
                            <Skeleton.Image active={false} />
                        )}
                    </div>
                    <Flex align='center' gap='small' vertical style={{ marginTop: 16 }}>
                        <Upload
                            name='avatar'
                            // listType="picture"
                            showUploadList={false}
                            beforeUpload={beforeUpload}>
                            <Button type='primary' size='small' styles={{ width: 88, marginBottom: 8 }}>Uplaod</Button>
                        </Upload>
                        <Popconfirm title='프로필 이미지 삭제' description='' okText='삭제' cancelText='취소' onConfirm={imgDeleteClick}>
                            <Button size='small' danger type='normal' style={{ border: "1px solid rgba(217, 217, 217, 1)" }} styles={{ width: 88 }}>Delete</Button>
                        </Popconfirm>
                    </Flex>
                </Col>
                {/* 프로필 - 오른쪽 (테이블) */}
                <Col span={21} style={{ minWidth: '475px', padding: '10px' }}>
                    <Descriptions bordered size='small' labelStyle={{ width: 150, height: 54 }} >
                        <Descriptions.Item label="ID" span={3} >{userInfo?.loginId}</Descriptions.Item>
                        <Descriptions.Item label="이름" span={3} >{userInfo?.name}</Descriptions.Item>
                        <Descriptions.Item label="이메일" span={3} >{userInfo?.email}</Descriptions.Item>
                        <Descriptions.Item label="회원 구분" span={3} >{userInfo?.roleNm}</Descriptions.Item>
                        <Descriptions.Item label="전화번호" span={3} >{userInfo?.phone}</Descriptions.Item>
                        <Descriptions.Item label="계정 활성화 여부" span={3} >{userInfo?.active ? "활성화" : "비활성화"}</Descriptions.Item>
                        <Descriptions.Item label="소속팀" span={3} >{userInfo?.teamName}</Descriptions.Item>
                        <Descriptions.Item label="팀 그룹" span={3} >{userInfo?.authGroupNm}</Descriptions.Item>
                        {/* <Descriptions.Item label="설명"  span={3} >{userInfo?.groupDesc}</Descriptions.Item> */}
                    </Descriptions>

                    <Descriptions bordered size='small' style={{ marginTop: 10 }}>
                        <Descriptions.Item label="권한" span={3} labelStyle={{ width: 150, padding: '8px 16px' }} style={{ padding: 0 }}>
                            {/* <UserAuthList userAuth={userAuthList ?? []} /> */}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </Spin>
    );
};

export default AdminMemberProfile;
