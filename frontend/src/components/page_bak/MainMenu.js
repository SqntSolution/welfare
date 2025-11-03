// 1차 메뉴
import { useEffect, useState } from 'react';
import { App, Segmented, Tag, Button, message, Popover, Flex, Row, Col, Input, Card, Menu, List, theme } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { saveMenus } from 'utils/menuHolder';
import { useShowLoginModal } from 'hooks/helperHook'
import { ErrorMsg } from 'components/common/CustomComps'
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { useMsg, useSetMenus, useGetMenus } from 'hooks/helperHook';
import styled from 'styled-components';

export const MainMenu = ({ onMainMenuFetched, menu1Path }) => {
    const { menu1, menu2 } = useParams();
    const [loading, setLoading] = useState(false);
    // 메인페이지에서 메뉴를 클릭했을때, 메뉴가 다시 펼쳐지는 것을 해결하기 위해서.
    const [afterMenuInit, setAfterMenuInit] = useState(menu1 == null || menu2 != null);
    const [menus, setMenus] = useState([])
    const [rawMenus, setRawMenus] = useState([])
    const [current, setCurrent] = useState()
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const { error, info } = useMsg()
    const setTheMenus = useSetMenus();

    useEffect(() => {
        // console.log("=== after22 : ", afterMenuInit, menuOpen)
        if (afterMenuInit === false && menuOpen === true) {
            setMenuOpen(false)
            setTimeout(() => {
                setMenuOpen(false)
            }, 10)
        }
    }, [menuOpen])

    // sub main 페이지에서 사용
    useEffect(() => {
        const theMenu1 = menu1Path != null ? menu1Path : menu1
        if (theMenu1 != null) {
            const m = menus.find(e => e.path == theMenu1)
            // console.log("=== m : ", m)
            if (m != null) {
                setCurrent(`${m.key}`)
                // console.log("=== current : ", m.key)
            }
        }
    }, [menu1, menus, menu1Path])

    useEffect(() => {
        getMenu()
        // console.log("=== after useEffect")
        // return ()=>{
        //     // console.log("=== un useEffect")
        //     // setMenuOpen(false)
        // }
    }, [])

    // console.log("=== after : ", afterMenuInit, menuOpen)

    const getMenu = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/menu/main`)
            .then((resp) => {
                const data = resp?.data
                setRawMenus(data ?? [])
                onMainMenuFetched?.(data ?? [])
                // console.log("=== 1차 menus : ", data)
                // storeMenu(data)
                const m = data?.map(e => {
                    return {
                        label: e.menuNm, key: e.id, path: e.menuEngNm, onMouseLeave: (e => { setAfterMenuInit(true) }),
                        onMouseEnter: (e => { setMenuOpen(true) })
                    }
                })
                setMenus(m ?? [])
                // 여기서 불러온 main menu를 쓰는 곳이 있을것을 생각해서 callback
                // window에도 보관
                saveMenus(data ?? [])
                setTheMenus(data ?? [])
            })
            .catch((err) => {
                console.log('=== getMenu 에러 : ', err?.response);
                // message.error(errorMsg(err), 3);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    const onClick = e => {
        // console.log("=== menuclick : ", e.key, menus)
        const path = menus.find(elem => e.key == elem.key)?.path ?? ''
        // console.log("=== path : ", path)

        navigate(`/main/${path}`)
        setMenuOpen(false)
    }

    const cursorStyle = { cursor: 'pointer', backgroundColor: 'white', textAlign: 'center' }

    const gotoMenu = (item, e) => {
        if (e?.contentType == 'link') {
            const link = e?.link
            const isNewWindow = e?.linkType == 'blank'
            const isFullUrl = (link?.startsWith("https://") || link?.startsWith("http://"))
            if (isNewWindow) {
                // 새창은 무조건 window.open()
                window.open(link)
            } else {
                if (isFullUrl) {
                    window.location.href = link
                } else {
                    navigate(link)
                }
            }
        } else {
            navigate(`/main/${item?.menuEngNm}/${e?.menuEngNm}`)
        }
        setMenuOpen(false)
    }

    const MenuContent = () => {
        return (
            // 서브 메뉴 App.css ,27번째 줄 .customSubMenu 클래스
            <>
                <List
                    grid={{
                        gutter: 1,
                        column: (rawMenus ?? []).length,
                    }}
                    dataSource={rawMenus ?? []}
                    renderItem={(item) => {
                        let display = ''
                        if ((item?.menuChildren ?? []).length == 0) {
                            display = 'none'
                        }

                        return (
                            <List.Item style={{ display }}>
                                {/* <Card title={ <div style={cursorStyle} onClick={() => gotoMenu(`/main/${item.menuEngNm}`)}> {item.menuNm}</div> }> */}
                                <Card>
                                    {
                                        item?.menuChildren?.map(e => {
                                            return (
                                                <><div style={cursorStyle} onClick={() => gotoMenu(item, e)}>{e?.menuNm} </div></>
                                            )
                                        })
                                    }

                                </Card>
                            </List.Item>
                        )

                    }}
                />
            </>
        )
    }

    return (
        <>
            <Row style={{
                width: '100%',
                borderRadius: 0,
            }} justify='center' align='middle'>
                <Col span={24} style={{ borderTop: '1px solid #F0F0F0' }} >
                    <Popover placement="bottomLeft" content={<MenuContent />} arrow={false}
                        open={menuOpen && afterMenuInit}
                        onOpenChange={open => setMenuOpen(open)}
                        overlayClassName="customSubMenu"
                    >
                        <StyledMenu
                            onClick={onClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                            horizontalitemhovercolor="red"
                            items={menus}
                            overflowedIndicator={false}
                        />
                    </Popover>
                </Col>
            </Row>

        </>
    )
}




const StyledMenu = styled(Menu)`
        width: 1240px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto; 
        border-bottom: 0; 

        .ant-menu-overflow-item {
            position: relative !important;
            width: 100%;
            max-width: 206px; 
            height: 100% !important; 
            flex: 1 1 auto;
            padding:5px 0 0 0;
            text-align : center;
            justify-content : center;
            display:block !important; 
            opacity: 1 !important; 

        }
        .ant-menu-overflow-item:has(.ant-menu-submenu-arrow) {
            position: absolute !important;
            display:none !important; 
        }
        .ant-menu-item:hover .ant-menu-title-content{color: #EB2D2B;font-weight: 700; }
        .ant-menu-item::after{
            display: block; 
            width: 100%;
            height: 2px; 
            bottom: 1px !important;
            inset-inline:0 !important;
        }

    @media screen and (max-width:1800px){
        &{width: auto;}
        .ant-menu-overflow-item {max-width:12%; }
    }
    @media screen and (max-width:1400px){
        &{width: auto;}
        .ant-menu-overflow-item {max-width:130px; font-size: 14px;}
        &.ant-menu .ant-menu-title-content{font-size: 12px}
    }
`;



