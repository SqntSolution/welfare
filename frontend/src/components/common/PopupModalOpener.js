import { useState, useEffect } from 'react';
import { PopupModal } from 'pages/admin/popup/PopupModal';
import { useLocation, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';

/**
 * cookie에 key:popupIds_{popupId} , value:{popupId} 로 저장됨.
 */
const getCookiePopupIds = () => {
    const result = []
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.startsWith("popupIds_")) {
            result.push(cookieValue)
        }
    }
    return result;
}

export const PopupModalOpener = (props) => {
    // const user = useUserInfo()
    const [popupDatas, setPopupDatas] = useState([])
    const { menu1 } = useParams();
    const { error, info } = useMsg()
    const location = useLocation();

    useEffect(() => {
        const exclude = ['post', 'login', 'verify'];
        if (!exclude.some(keyword => location.pathname?.includes(keyword))) {
            getPopupDatas();
        }
    }, [menu1]);

    const getPopupDatas = () => {
        const currMenu1 = location.pathname.split('/').filter(Boolean)[0] || '';
        const excludePopupIds = getCookiePopupIds().join(",")
        // console.log("=== excludePopupIds : ", excludePopupIds)
        const param = { "excludePopupIds": excludePopupIds }
        AXIOS.get(`/api/v1/common/popup/${currMenu1 || '_home_'}`, { params: param })
            .then((resp) => {
                const data = resp?.data ?? []
                data?.forEach(e => {
                    e.open = true
                })
                setPopupDatas(data)
            })
            .catch((err) => {
                setPopupDatas([])
                console.log('=== getPopupDatas 에러 : ', err?.response);
                error(err)
            })
    }

    const closePopup = (popupId) => {
        // console.log("=== closePopup : ", popupId)
        popupDatas?.filter(e => e.id === popupId)?.forEach(e => e.open = false)
        setPopupDatas([...popupDatas])
    }

    const isOpen = (popupId) => {
        const result = popupDatas?.find(e => e.id == popupId)?.open === true
        // console.log("=== isOpen : ", popupId, result)
        return result
    }


    return (
        <>
            {
                popupDatas?.map((item, idx) => {
                    return (<PopupModal open={isOpen(item?.id)} id={item?.id} setOpen={() => closePopup(item.id)} title={item.title} textData={item?.contents} key={item?.id} index={idx} />)
                })
            }
        </>
    )
}