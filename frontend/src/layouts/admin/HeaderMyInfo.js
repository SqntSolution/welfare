import { Avatar, Button, Space, message, Popover, Tag, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { AXIOS } from 'utils/axios';
import { loginUser, refreshUserInfo, openLoginModal } from "atoms/atom";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
// import { AvatarText, UserNoti } from '../styles/Header.style';
import { useMsg } from 'hooks/helperHook';
import { useLocation, } from 'react-router-dom';
import { useUserInfo } from 'hooks/useUserInfo'
import { UserNoti } from 'styles/StyledCommon'

export const HeaderMyInfo = (props) => {
    // const [me, setMe] = useState({});
    const [theRefreshUserInfo, setTheRefreshUserInfo] = useRecoilState(refreshUserInfo)
    const [theLoginuser, setTheLoginUser] = useRecoilState(loginUser)
    const setOpenLoginModal = useSetRecoilState(openLoginModal)
    const [popoverVisible, setPopoverVisible] = useState(false);
    const location = useLocation();
    const { error, info } = useMsg()
    const userInfo = useUserInfo()

    const MyInfo = () => {
        return (
            <>
                v : {userInfo?.v}<br />
                name : {userInfo?.name}  <br />
                id : {userInfo?.id} <br />
                role : {userInfo?.role} <br />
                strategicMarketingGroupYn : {JSON.stringify(userInfo?.strategicMarketingGroupYn)} <br />
                contentsManagerAuthMenuNames : {JSON.stringify(userInfo?.contentsManagerAuthMenuNames)} <br />

            </>
        )
    }

    return (
        <>
            <Row align='middle'>
                <Col span={24} align="right" key="2" >
                    <Space align='right' >
                        <Popover placement="bottomRight" >
                            <Avatar icon={<UserOutlined />} 
                            // src={(userInfo?.avatarImgPath == null) ? null : (`/api/v1/image/${userInfo?.avatarImgPath}`)} 
                            src={userInfo?.avatarImgPath ? `/api/v1/image/${userInfo.avatarImgPath}` : null}
                            size='small' />
                            <Tag color="#108ee9" > {userInfo?.role} /  {userInfo?.name} 님</Tag>
                        </Popover>

                    </Space>
                </Col>
            </Row>


        </>
    )
}