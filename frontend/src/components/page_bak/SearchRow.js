// 검색이 있는 젤 윗줄
import { useEffect, useState, useRef } from 'react';
import { Dropdown, Segmented, Tag, Button, FloatButton, Avatar, Flex, Row, Col, Input, Card, Space, Popover } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { Link, Route, Switch, useNavigate } from "react-router-dom";
import { DownOutlined, StarFilled, HeartOutlined, UserOutlined, PlusOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
// import { SearchModal } from './SearchModal';
import { useUserInfo } from 'hooks/useUserInfo'
import { useHasNewPostAuth, useMsg, useGetMenus } from 'hooks/helperHook'
import styled from 'styled-components';
import { ButtonText } from 'styles/StyledCommon';

export const SearchRow = (props) => {
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [historyPath, setHistoryPath] = useState();
    const InputRef = useRef();
    const navigate = useNavigate();
    const userInfo = useUserInfo()
    const hasNewPostAuth = useHasNewPostAuth()
    const menus = useGetMenus()

    useEffect(() => {
        const path = menus?.find(e => e.contentType == 'my')?.menuChildren?.find(e => e.contentType == 'history')?.menuEngNm
        // console.log("=== path : ", path, menus)
        if (path != null) {
            setHistoryPath(`${path}`)
        }
    }, [menus])

    const MyInfo = () => {
        return (
            <>
                v : {userInfo?.v}<br />
                name : {userInfo?.name}<br />
                id : {userInfo?.id} <br />
                role : {userInfo?.role} <br />
                strategicMarketingGroupYn : {JSON.stringify(userInfo?.strategicMarketingGroupYn)} <br />
                contentsManagerAuthMenuNames : {JSON.stringify(userInfo?.contentsManagerAuthMenuNames)} <br />
            </>
        )
    }

    const afterClose = () => {
        InputRef.current.blur();
    }

    return (
        <>
            <Row
                style={{
                    width: '100%',
                    height: '88px',
                    borderRadius: 0,
                    border: '1px solid #2a92f',
                }}
                justify='center'
                align="middle"
            >
                {/* logo */}
                <Col align='left' span={7}>
                    <h1 style={{ width: 266 }}>
                        <Link to="/main" style={logoStyle}>
                            <img src='/img/logo.png' alt='COSMAX INSIGHT' style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
                        </Link>
                    </h1>
                    {/* {  
                        (userInfo?.v == 'local' || userInfo?.v == 'dev') ? (
                            <>
                                <Link to="/test"> [test페이지] </Link>
                                <Link to="/admin"> [Admin페이지] </Link>
                            </>
                        ) : (
                            null
                        )
                    } */}
                </Col>

                <Col justify={'center'} align={'middle'} span={10}>
                    {/* <Input placeholder='찾으시는 자료를 검색하세요.' /> */}
                    <StyledInput
                        placeholder="INSIGHT 통합검색"
                        allowClear
                        readOnly
                        onClick={() => { setOpen(true); setKeyword('select') }}
                        // size="large"
                        suffix={
                            <StyledSearchButton
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={() => {
                                    setOpen(true);
                                    setKeyword('select');
                                    // console.log("돋보기 버튼이 클릭되었습니다.");
                                }}

                            />
                        }
                        ref={InputRef}
                    />
                </Col>
                <Col flex='auto' align='right' span={7} >
                    <Flex gap='middle' justify='flex-end'>
                        {/* <div>
                            <Popover placement="bottomRight" content={<MyInfo />}>
                                <Tag color="#108ee9" >{userInfo?.name} 님</Tag>
                            </Popover>
                        </div> */}
                        {
                            hasNewPostAuth() ? (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/post/new')} >Post</Button>
                            ) : (
                                null
                            )
                        }
                        <Space onClick={() => navigate('/main/my/profile')} style={{ cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} 
                            // src={(userInfo?.avatarImgPath == null) ? null : (`/api/v1/image/${userInfo?.avatarImgPath}`)} 
                            src={userInfo?.avatarImgPath ? `/api/v1/image/${userInfo.avatarImgPath}` : null}
                            size={'small'} style={{ minWidth: 32, minHeight: 32, marginLeft: 24 }} />
                            <span>{userInfo?.name} 님</span>
                        </Space>
                        {/* <ButtonText type="text" onClick={() => navigate(`/main/my/${historyPath}`)}> History</ButtonText>
                        <ButtonText type="text" onClick={() => navigate('/main/my')} >My</ButtonText> */}
                        {
                            (userInfo?.role == 'ROLE_OPERATOR' || userInfo?.role == 'ROLE_MASTER') ? (
                                <ButtonText type="text" onClick={() => navigate('/admin')} icon={<UnlockOutlined />} style={{ color: '#9254DE' }}>Admin</ButtonText>
                            ) : (
                                null
                            )
                        }
                    </Flex>
                </Col>

            </Row>
            <FloatButton.BackTop visibilityHeight={10} />
            {/* <SearchModal stateModal={open} setModal={setOpen} keyword={keyword} setKeyword={setKeyword} afterClose={afterClose} /> */}
        </>
    )
}

const StyledInput = styled(Input)`
    width:480px;
    height:40px;
    border-radius : 62px; 
    border: 1px solid #D9D9D9;
    padding : 8px 12px;
    overflow : hidden;
    margin:0 auto;
`;

const StyledSearchButton = styled(Button)`
    &&&{
        width: 20px;
        padding: 0;
        margin: 0;
        background : transparent;

        color: #262626;
        font-size: 20px;

        
        .ant-btn-icon .anticon-search{font-size: 20px; }
    }
    &&&:hover {background : transparent; color: #EB2D2B; }
    &.ant-btn.ant-btn-icon-only{box-shadow:none;}
`;
const logoStyle = { marginRight: 'auto', fontSize: 24, fontWeight: 700, textAlign: 'left', color: '#262626', display: 'block', lineHeight: 0 }
