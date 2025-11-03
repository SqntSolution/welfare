/**
 * @file Submenu.js
 * @description 서브페이지용 서브메뉴
 * @author 이병은
 * @since 2025-06-30 11:32
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-30 11:32    이병은       최초 생성
 * 2025-06-30 11:32    이병은       서브메뉴 구성 방식 수정
 **/
// 2차 메뉴
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useGetMenus, useMsg } from 'hooks/helperHook';
import { SUTabsBtnStyle } from 'styles/StyledUser';

export const Submenu = (props) => {
    // const {currentPageNm } = props;
    // console.log('Submenu props : ',props);
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([])
    const [origMenus, setOrigMenus] = useState([])
    const [current, setCurrent] = useState()
    const navigate = useNavigate();
    const { error, info } = useMsg()
    const { menu1, menu2 } = useParams();
    const menus = useGetMenus();

    // sub main 페이지에서
    useEffect(() => {
        if (menu1 != null) {
            const m = menuItems.find(e => e.path == menu2)
            if (m) {
                // console.log("=== current 1 : ", m.key)
                setCurrent(`${m.key}`)
                return
            }
        }
        // console.log("=== current 2 : ", )
        setCurrent('-9999')
    }, [menu1, menuItems])

    useEffect(() => {
        getSubmenus()
    }, [menus])

    const getSubmenus = () => {
        const menuItem = menus.find((menu) => menu.menuEngNm === menu1);
        const menuChildrenItem = menuItem?.menuChildren;
        setOrigMenus(menuChildrenItem);
        let m = menuChildrenItem?.map(e => { return !e.staticYn && { label: e.menuNm, key: `${e.id}`, path: e.menuEngNm, disabled: e.hasAuth !== true, } })
        m = m ?? []

        // 전체메뉴 추가 
        if (!menuItem?.staticYn) {
            const totalMenu = { label: 'All', key: '-9999', path: '', disabled: false };
            setMenuItems([totalMenu, ...m]);
        } else {
            setMenuItems(m)
        }

    };


    const onSubmenuClick = key => {
        // console.log("=== menuclick : ", e.key, e)
        // const key = e.key
        // contentType 체크(link인지)
        const origMenu = origMenus.find(elem => key == elem.id)
        if (origMenu?.contentType == 'link') {
            const link = origMenu?.link
            const isNewWindow = origMenu?.linkType == 'blank'
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
            let path = menuItems.find(elem => key == elem.key)?.path ?? ''
            // console.log("=== path : ", path)
            navigate(path ? `/${menu1}/${path}` : `/${menu1}`);
        }

    }

    return (
        <div>
            <SUTabsBtnStyle activeKey={current ?? '-9999'} items={menuItems} onChange={(key) => onSubmenuClick(key)} />
        </div>
    )
}

