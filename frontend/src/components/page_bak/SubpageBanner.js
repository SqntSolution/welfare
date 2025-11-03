// sub페이지 위의 배너 영역
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Menu, Typography } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { useShowLoginModal } from 'hooks/helperHook'
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { useMsg, useGetMenus } from 'hooks/helperHook';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const SubpageBanner = (props) => {
    const [loading, setLoading] = useState(false);
    const [menu, setMenu] = useState([])
    const [currentMenu, setCurrentMenu] = useState()
    const [extTitle, setExtTitle] = useState("")
    const navigate = useNavigate();
    const { menu1, menu2 } = useParams();
    const { error, info } = useMsg()
    const menus = useGetMenus()
    const [subscribable, setSubscribable] = useState(false)
    const [isSubscribing, setIsSubscribing] = useState(false)
    const [imagePath, setImagePath] = useState()

    useEffect(() => {
        const m = menus?.find(e => e?.menuEngNm == (menu1 ?? props?.menu1))
        const subscribable = m?.contentType != 'smartfinder' && m?.contentType != 'cscenter' && m?.contentType != 'my'
        // console.log("== subscribable : ", subscribable, menu1, menu2, menu2!=null)
        setSubscribable(menu2 != null && subscribable)
        setMenu(m);
    }, [menus, menu1, menu2])

    useEffect(() => {
        // getMenu()
    }, [])

    useEffect(() => {
        // const menu2Title = getMenuNmByPath(menu1, menu2)
        // console.log('=== menu2Title : ', menu2, menu2Title)
        // console.log("=== menu2 : ", menu, menu1, menu2)
        if (menu2 == null) {
            setExtTitle("")
        } else {
            const menu2Nm = menu?.menuChildren?.find(e => e.menuEngNm == menu2)?.menuNm ?? ""
            setExtTitle(" : " + menu2Nm)
        }
        if ((menu?.imagePath ?? '') == '') {
            setImagePath(null)
        } else {
            setImagePath(`url(/api/v1/view/image/${menu?.imagePath})`)
        }
    }, [menu, menu2])

    return (
        <>
            <Flex justify='center' align='center' wrap="wrap" style={{
                width: "100%",
                height: 200,
                margin: '0 auto',
                backgroundImage: `${imagePath}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                alignContent: 'center',
                backgroundSize: 'cover',
                textAlign: 'center'
            }}>
                <Typography.Title
                    style={{
                        width: "100%",
                        fontSize: '38px',
                        color: "#fff",
                        lineHeight: '46px',
                        marginBottom: 8,
                    }}
                >{menu?.title} {extTitle}</Typography.Title>
                <Typography.Title
                    style={{
                        width: "100%",
                        fontSize: '16px',
                        color: "#fff",
                        lineHeight: '24px',
                        marginTop: 0,
                    }}
                >{menu?.subTitle}
                </Typography.Title>
            </Flex>

        </>
    )
}

const StyledSubscribeBtn = styled(Button)`
    background-color:#8C8C8C;
    &:hover {
        background-color: #999 !important;
    }
`