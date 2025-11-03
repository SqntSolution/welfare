/**
 * @file MyPage.js
 * @description 마이페이지
 * @author 김정규
 * @since 2025-05-08 15:29
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-08 15:29    김정규       최초 생성
 * 2025-05-29 14:48    이병은       마이페이지 로그아웃 수정
 **/

import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Flex, Form, Input, Popconfirm, Space, Spin, Upload } from 'antd';
import { passwordVerifiedState } from 'atoms/atom';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { useMsg } from 'hooks/helperHook';
import { useLogout } from 'hooks/loginHelperHook';
import { useUserInfo } from 'hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { LuImageUp, LuSettings } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUInner1280 } from 'styles/StyledUser';
import { AXIOS } from 'utils/axios';
import { isEmptyCheck } from 'utils/helpers';
import { useLoginCheck } from 'provider/LoginCheckProvider';

export const MyPage = (props) => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const { error, info } = useMsg();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const varifiedPw = useRecoilValue(passwordVerifiedState);
    const [form] = Form.useForm();
    const [edit, setEdit] = useState(false);
    const logout = useLogout();
    const loginUser = useUserInfo();
    const { isInitialCheckComplete, isLoading: loginCheckLoading } = useLoginCheck();

    // 초기 로그인 체크가 완료된 후에만 실행
    useEffect(() => {
        if (isInitialCheckComplete && loginUser.role !== 'ROLE_VISITOR') {
            setChecking(true);
        }
    }, [isInitialCheckComplete, loginUser.role]);

    useEffect(() => {
        if (checking) {
            getData();
        }
    }, [checking]);

    // 로그인하지 않은 사용자라면 로그인 페이지로 이동
    if (loginUser.role === 'ROLE_VISITOR' || !loginUser.id) {
        navigate('/login', { replace: true });
        return null;
    }

    const getData = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get('/api/v1/user/my')
            .then(async (resp) => {
                setUserInfo(resp.data);
                form.setFieldsValue(resp.data);
                const avatarPath = resp.data.avatarImgPath;
                await getImgSrc(avatarPath);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
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

    //이미지 업로드 이벤트
    const beforeUpload = async (file) => {
        setLoading(true);
        try {
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

        } catch (error) {
            setLoading(false);
        }
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
                setLoading(false);
            });
    };

    const profileImgUpdate = async (fileInfo) => {
        setLoading(true);
        return await AXIOS.post(`/api/v1/user/my/avatar`, fileInfo)
            .then((res) => {
                info('프로필 이미지 업로드 완료');
                setTimeout(() => {
                    navigate(0);
                }, 1000)
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
    };

    const imgDeleteClick = () => {
        setLoading(true);
        AXIOS.delete(`/api/v1/user/my/avatar`)
            .then((res) => {
                if (res.data === 'OK') {
                    info('프로필 이미지 삭제');
                    navigate(0);
                }
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => {
                setLoading(false);
            });
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

    /**
     * 비밀번호 변경
     */
    const newPw = async () => {
        const param = userInfo
        param.userId = param.id
        return await AXIOS.post(`/api/v1/common/login/new-pw`, param)
            .then((resp) => {
                const link = resp?.data
                navigate(`${link}`);
            })
            .catch((err) => {
                navigate('/main');
            })
    }

    /**
     * 회원 탈퇴
     * @returns 
     */
    const draw = async () => {
        const param = userInfo
        param.userId = param.id
        return await AXIOS.post(`/api/v1/common/login/with-draw`, param)
            .then((resp) => {
                const link = resp?.data
                navigate(`${link}`);
            })
            .catch((err) => {
                navigate('/main');
            })
    }

    /**
     * 로그아웃
     * @returns 
     */
    const onClickLogout = async () => {
        logout();
    }

    const onClick = () => {
        if (edit) {
            setEdit(false);
            getData();
        } else {
            setEdit(true);
        }
    }

    /**
     * 저장
     */
    const onFinish = async () => {
        const param = form.getFieldsValue()
        const loc = window.location.origin
        param.url = loc
        await AXIOS.post(`/api/v1/common/login/user`, param)
            .then((resp) => {
                info('수정했습니다.')
            })
            .catch((err) => {
                navigate('/main');
            })
        setEdit(false);
        getData();
    }

    const socialIcons = {
        naver: "/img/icon/btnG_아이콘사각.png",
        google: "/img/icon/web_light_rd_na@4x.png",
        kakao: "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
    };

    const formatPhoneNumber = (value) => {
        if (!value) return '';
        return value.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    };

    return (
        <LoadingSpinner loading={loading || loginCheckLoading}>
            <MyPageSection>
                <SUInner1280>
                    <div className='profile-bg-box'>

                    </div>

                    <div className='profilImgArea' onClick={goHome}>
                        {imgSrc?.length > 0 ? (
                            <Avatar icon={<UserOutlined />} size={104} src={imgSrc} />
                        ) : (
                            <Avatar size={104} shape='circle' icon={<UserOutlined />} />
                        )}
                    </div>
                    <Space style={{ marginLeft: `${SFEm(24)}` }}>
                        <Upload
                            accept='image/*'
                            name='avatar'
                            showUploadList={false}
                            beforeUpload={beforeUpload}>
                            <Button size='small'>Upload</Button>
                        </Upload>
                        <Popconfirm title='프로필 이미지 삭제' description='' okText='삭제' cancelText='취소' onConfirm={imgDeleteClick}>
                            <Button danger size='small' type='primary'> Delete</Button>
                        </Popconfirm>
                    </Space>

                    {checking &&
                        <>
                            <Form
                                onFinish={onFinish}
                                form={form}
                                layout="horizontal"

                            >
                                <Descriptions bordered size='small'>
                                    <Descriptions.Item label={'닉네임'} span={2} >
                                        <Input
                                            readOnly
                                            style={{
                                                border: 'none',
                                                boxShadow: 'none',
                                            }}
                                            value={userInfo.name}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label={'아이디'} span={2} >
                                        <Input
                                            readOnly
                                            style={{
                                                border: 'none',
                                                boxShadow: 'none',
                                            }}
                                            value={userInfo.loginId}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label={'이메일'} span={2} >
                                        {edit ? (
                                            <Form.Item name="email"
                                                rules={[
                                                    { required: true, message: '이메일을 입력해주세요' },
                                                    {
                                                        pattern: /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/,
                                                        message: '이메일 주소 형식이 올바르지 않습니다',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    maxLength={100}
                                                    style={{
                                                        border: '1px solid #d9d9d9',
                                                        width: '10vw',
                                                    }}
                                                />
                                            </Form.Item>
                                        ) : (
                                            <Input
                                                readOnly
                                                style={{
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                }}
                                                value={userInfo.email}
                                            />
                                        )}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={'전화번호'} span={2}>
                                        <Input
                                            readOnly
                                            style={{
                                                border: 'none',
                                                boxShadow: 'none',
                                            }}
                                            value={formatPhoneNumber(userInfo.phone)}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label={'구분'}  >
                                        <Space>
                                            {socialIcons[userInfo.socialType] && (
                                                <img
                                                    src={socialIcons[userInfo.socialType]}
                                                    alt={userInfo.socialType}
                                                    style={{ maxWidth: '43px', maxHeight: '43px' }}
                                                />
                                            )}
                                            <Input
                                                readOnly
                                                style={{
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                }}
                                                value={userInfo.roleNm}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Form.Item hidden name="id" />
                                <Form.Item hidden name="role" />
                                <Form.Item hidden name="authGroupCd" />
                                <Form.Item hidden name="authGroupNm" />
                                <Form.Item hidden name="userAuthInfoList" />
                                <Form.Item hidden name="avatarImgPath" />
                                <Flex align='center' justify="center" >
                                    <Space>
                                        {/* <Button onClick={() => onClick()}>{edit ? '취소' : '수정'}</Button> */}
                                        {edit ? <Button htmlType="submit">저장</Button>
                                            : <>
                                                <Button onClick={() => newPw()}>비밀번호 변경</Button>
                                                <Button onClick={() => draw()}>회원 탈퇴</Button>
                                                <Button onClick={onClickLogout}>로그아웃</Button>
                                            </>
                                        }
                                    </Space>
                                </Flex>
                            </Form>
                        </>
                    }
                </SUInner1280>
            </MyPageSection>
        </LoadingSpinner >
    );
};

const MyPageSection = styled.section`
    .profile-bg-box{
        position: relative;
        height: ${SFEm(170)};
        background: url('/img/sample/profile-bg.png') center center no-repeat;
        background-size: cover;
        border-radius: ${SFEm(12)};
        overflow: hidden;
    }
    .profilImgArea{
        position: relative;
        z-index: 2;
        top: ${SFEm(-20)};
        margin-left: ${SFEm(32)};
    }
    .ant-skeleton.ant-skeleton-element .ant-skeleton-avatar,
    .ant-avatar.ant-avatar-icon {
        outline: 1px solid rgba(0, 0, 0, 0.08);
        border: 3px solid #fff;
        box-shadow: 0px 4px 6px -2px rgba(10, 13, 18, 0.03);
        box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
        background-color: #ddd;
    }
    .ant-form{
        margin-top: ${SFEm(34, 14)};
    }
    .ant-flex{
        margin-top: ${SFEm(34, 14)};
    }
${SFMedia('tab-l', css`
    &,[class |= "ant"]{font-size: 14px;}
`)};

${SFMedia('mo-l', css`
    &,[class |= "ant"]{ font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px);}
    .ant-avatar{
        width: ${SFEm(104, 40)}  !important;
        height: ${SFEm(104, 40)} !important;
        font-size: ${SFEm(40)}  !important;
    }
`)};

`;