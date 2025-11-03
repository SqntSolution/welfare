// 2차 메뉴
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Menu, Select, } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { useShowLoginModal } from 'hooks/helperHook'
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";
import { hasTotalMenu } from 'utils/menuHolder';
import { useMsg } from 'hooks/helperHook';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CustomSearchInput } from 'components/common/CustomComps';

export const Submenu = (props) => {
    // const {currentPageNm } = props;
    // console.log('Submenu props : ',props);
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState([])
    const [origMenus, setOrigMenus] = useState([])
    const [current, setCurrent] = useState()
    const navigate = useNavigate();
    const {error, info} = useMsg()

    // sub main 페이지에서
    const { menu1, menu2 } = useParams();
    useEffect(()=>{
        if(menu1!=null){
            const m = menus.find(e=>e.path==menu2)
            if(m!=null){
                // console.log("=== current 1 : ", m.key)
                setCurrent(`${m.key}`) 
                return
            }
        }
        // console.log("=== current 2 : ", )
        setCurrent('-9999')
    }, [menu1, menus])

    useEffect(()=>{
        getSubmenus()
    }, [,menu1,menu2])
    
    const getSubmenus = () => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/common/menu/sub/${menu1}`)
            .then((resp) => {
                // console.log("=== 2차 menus : ", resp?.data)
                const data = resp?.data
                setOrigMenus(data)
                let m = data?.map(e=>{return {label:e.menuNm, key:e.id, path:e.menuEngNm, disabled:e.hasAuth!==true, }})
                m = m ?? []
                // console.log("=== hasTotalMenu(menu1) : ", hasTotalMenu(menu1))
                // 전체메뉴 추가 
                if(hasTotalMenu(menu1)){
                    const totalMenu = {label:'전체', key:'-9999', path:'', disabled:false }
                    setMenus([totalMenu, ...m])
                }else{
                    setMenus( m )
                }
            })
            .catch((err) => {
                console.log('=== getSubmenus 에러 : ', err?.response);
                // message.error(errorMsg(err), 3);
                error(err)
            })
            .finally(() => setLoading(false));
    };

    
    const onSubmenuClick = e=>{
        // console.log("=== menuclick : ", e.key, e)
        const key = e.key
        // contentType 체크(link인지)
        const origMenu = origMenus.find(elem=>key==elem.id)
        if(origMenu?.contentType=='link'){
            const link = origMenu?.link
            const isNewWindow = origMenu?.linkType=='blank'
            const isFullUrl = ( link?.startsWith("https://") || link?.startsWith("http://") )
            if(isNewWindow){
                // 새창은 무조건 window.open()
                window.open(link)
            }else{
                if(isFullUrl){
                    window.location.href = link
                }else{
                    navigate(link)
                }
            }
        }else{
            let path = menus.find(elem=>key==elem.key)?.path ?? ''
            // console.log("=== path : ", path)
            navigate(`/main/${menu1}/${path}`)
        }

    }

    return (
        <>
                <Row style={{
                    width: '1240px',
                    margin:'0 auto',
                    borderRadius: 0,
                    minHeight:64
                }}  align='middle'>
                    <Col span={15} align='left' >
                    <StyledLanguageMenu onClick={onSubmenuClick} selectedKeys={[current]}
                          mode="horizontal" items={menus}  />
                    {/* {JSON.stringify(menus)} <br/>
                    {current} */}
                    </Col>
                </Row>

        </>
    )
}




const StyledLanguageMenu = styled(Menu)`
    &{border:0;}
    &&{height: 32px; line-height: 32px;}
    &.ant-menu-horizontal >.ant-menu-item-selected{border:1px solid #EB2D2B; border-radius:2px;}
    &.ant-menu-horizontal >.ant-menu-item-selected::after,
    &.ant-menu-horizontal >.ant-menu-item::after{display:none;}
    &.ant-menu-horizontal >.ant-menu-item .ant-menu-title-content:hover {color:#EB2D2B}
    .ant-menu-overflow-item{border: 1px solid #D9D9D9; font-size: 14px; color:#262626;}
`;