// [주의] 이것은 안씀. 나중에 지울것 - post 상세 페이지에서 보여주는 1차 메뉴
import { useEffect, useState } from 'react';
import { App, Segmented, Popover, Button, List, DatePicker, Flex, Row, Col, Input, Card, Menu, } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { saveMenus } from 'utils/menuHolder';
import { useShowLoginModal } from 'hooks/helperHook'
import { ErrorMsg } from 'components/common/CustomComps'
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { useMsg } from 'hooks/helperHook';

// [주의] 이것은 안씀. 나중에 지울것 - post 상세 페이지에서 보여주는 1차 메뉴
export const PostMainMenu = ({ menu1 }) => {  // {id, name, path}  menu1Id
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState([])
    const [rawMenus, setRawMenus] = useState([])
    const [current, setCurrent] = useState()
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const { error, info } = useMsg()

    useEffect(() => {
        // console.log("=== menu1 : ", menu1?.id, menus)
        const id = menu1?.id
        if (id != null) {
            const m = menus.find(e => e.key == id)
            if (m != null) {
                setCurrent(`${m.key}`)
                // console.log("=== current : ", m.key)
            }
        }
    }, [menu1?.id, menus])

    useEffect(() => {
        getMenu()
    }, [])

    const getMenu = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/menu/main`)
            .then((resp) => {
                const data = resp?.data
                setRawMenus(data ?? [])
                // console.log("=== 1차 menus : ", data)
                // storeMenu(data)
                const m = data?.map(e => { return { label: e.menuNm, key: e.id, path: e.menuEngNm } })
                setMenus(m ?? [])
                // window에도 보관
                saveMenus(data ?? [])
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

    const cursorStyle = { cursor: 'pointer', backgroundColor: 'white' }

    const gotoMenu = (url) => {
        navigate(url)
        setMenuOpen(false)
    }


    const MenuContent = () => {
        return (
            <>
                <List
                    grid={{
                        gutter: 1,
                        column: (rawMenus ?? []).length,
                        // column: 8,
                    }}
                    dataSource={rawMenus ?? []}
                    size='small'
                    renderItem={(item) => {
                        let display = ''
                        if ((item?.menuChildren ?? []).length == 0) {
                            display = 'none'
                        }

                        return (
                            <List.Item >
                                <Card title={<div style={cursorStyle} onClick={() => gotoMenu(`/main/${item.menuEngNm}`)}> {item.menuNm}</div>}
                                    size='small' style={{ minWidth: 150 }} bodyStyle={{ display: display }}>
                                    {
                                        item?.menuChildren?.map(e => {
                                            return (
                                                <><div style={cursorStyle} onClick={() => gotoMenu(`/main/${item?.menuEngNm}/${e?.menuEngNm}`)}>{e?.menuNm} </div></>
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
                <Col span={24} align='middle' >
                    <Popover placement="bottomLeft" content={<MenuContent />} arrow={false}
                        open={menuOpen}
                        onOpenChange={open => setMenuOpen(open)}
                    >
                        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menus} theme="dark" />
                    </Popover>
                </Col>
            </Row>

        </>
    )
}