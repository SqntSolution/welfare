// 메인페이지 젤 밑의 faq 목록
import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg, useGetMenus } from 'hooks/helperHook';
import { Link, useNavigate } from "react-router-dom";
import { SUMainTable } from 'styles/StyledUser';

export const FaqList = (props) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([])
    const [faqUrl, setFaqUrl] = useState("/")
    const menus = useGetMenus()
    const navigate = useNavigate();
    const { error, info } = useMsg()

    useEffect(() => {
    }, [])


    useEffect(() => {
        // console.log("=== menus : ", menus)
        const parentMenu = menus?.find(e => e.contentType == 'cscenter')
        const childMenu = parentMenu?.menuChildren?.find(e => e.contentType == 'faq')
        const path = `/main/${parentMenu?.menuEngNm}/${childMenu?.menuEngNm}`
        if (path != null) {
            setFaqUrl(`${path}`)
            getFaqList(path)
        }
    }, [menus])

    const getFaqList = (faqUrl) => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/user/main/faq`)
            .then((resp) => {
                const data = resp?.data ?? []
                const list = data.map(e => { return { key: e.id, label: e.metaDivision, children: <Link to={`${faqUrl}/${e.id}`} > <Typography.Text ellipsis={true} style={{ fontSize: 14, maxWidth: 496 }}> {e.title}</Typography.Text></Link>, span: 3 } })
                setItems(list)
            })
            .catch((err) => {
                console.log('=== getNotice 에러 : ', err?.response);
                error(err)
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <SUMainTable
                title={"FAQ"}
                items={items}
                onClick={() => { navigate(`${faqUrl}`) }}
            />
        </>
    )
}