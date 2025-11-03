// POST 상세페이지에서, 메뉴 breadcrumb을 보여주는 row
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, Divider, Flex, Row, Col, Input, Breadcrumb, Typography, } from 'antd';
// import { getMenuIdFromPath, getMenuPathnameFromMenuId, getMenuNmFromMenuId } from 'utils/menuHolder';
import { Link, Route, Switch, useNavigate, useParams } from "react-router-dom";

export const BreadcrumbRow = ({ menu1, menu2 }) => {  // {id, name, path} , { menu1Id, menu2Id }
    const navigate = useNavigate();
    // console.log("=== menu ", menu1, menu2, )
    const [list, setList] = useState([])

    useEffect(() => {
        // const tmp = [{title:<span onClick={() => navigate("/")}></span>}]
        // tmp.push( <span style={{cursor:'pointer'}} onClick={()=>gotoMenu1(menu1?.path)}>{menu1?.name ?? ''}</span> )
        // tmp.push( <span style={{cursor:'pointer'}}  onClick={()=>gotoMenu2(menu1?.path, menu2?.path)}>{menu2?.name ?? ''}</span> )
        // setList([
        //     { title: <>Home</>, href: '/' },
        //     { title: menu1?.name ?? '', href: `/main/${menu1?.path}` },
        //     { title: menu2?.name ?? '', href: `/main/${menu1?.path}/${menu2?.path}` },
        // ])
        setList([
            {title:<span style={{cursor:'pointer'}} onClick={() => navigate("/")}>Home</span>},
            { title: <span style={{cursor:'pointer'}} onClick={()=>gotoMenu1(menu1?.path)}>{menu1?.name ?? ''}</span> },
            { title: <span style={{cursor:'pointer'}}  onClick={()=>gotoMenu2(menu1?.path, menu2?.path)}>{menu2?.name ?? ''}</span> },
        ])

    }, [menu1, menu2])

    const gotoHome = () => {
        navigate("/")
    }
    const gotoMenu1 = (path1) => {
        if (path1 != null) {
            navigate(`/main/${path1}`)
        }
    }
    const gotoMenu2 = (path1, path2) => {
        console.log("== gotoMenu2 : ", path1, path2)
        if (path1 != null && path2 != null) {
            navigate(`/main/${path1}/${path2}`)
        }
    }

    return (
        <>
            <Row style={{
                width: '100%',
                padding: '8px 0px',
                height: 38,
            }} justify='center' align='middle' gutter={[5, 5]} >
                {/* <Col style={{ backgroundColor: '#ffffff' }} span='24' align='left'>
                    <span style={{cursor:'pointer'}}  onClick={() => navigate("/")}>Home</span>
                    {menu1Id != null ? (
                        <> &gt; <span style={{cursor:'pointer'}} onClick={()=>gotoMenu1(menu1?.path)}>{menu1?.name ?? ''}</span> </>
                    ): (
                        null
                        )
                    }
                    {menu1Id!=null && menu2Id != null ? (
                        <> &gt; <span style={{cursor:'pointer'}}  onClick={()=>gotoMenu2(menu1?.path, menu2?.path)}>{menu2?.name ?? ''}</span> </>
                    ): (
                        null
                        )
                    }
                </Col> */}
                <Col style={{ backgroundColor: '#ffffff' }} span='24' align='left'>
                    <Breadcrumb items={list} style={{color :'rgba(0, 0, 0, 0.45)',fontSize:14}} />
                </Col>

            </Row>

        </>
    )
}