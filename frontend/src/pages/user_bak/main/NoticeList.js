// 메인페이지 젤 밑의 notice 목록
import { useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { PushpinFilled } from '@ant-design/icons';
import { AXIOS } from 'utils/axios';
import { useMsg, useGetMenus } from 'hooks/helperHook';
import { Link, useNavigate } from "react-router-dom";
import { SUMainTable } from 'styles/StyledUser';

export const NoticeList = (props) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([])
    const [noticeUrl, setNoticeUrl] = useState("/")
    const menus = useGetMenus()
    const navigate = useNavigate();
    const { error, info } = useMsg()

    useEffect(() => {
        // console.log("=== menus : ", menus)
        const parentMenu = menus?.find(e => e.contentType == 'cscenter')
        const childMenu = parentMenu?.menuChildren?.find(e => e.contentType == 'notice')
        const path = `/main/${parentMenu?.menuEngNm}/${childMenu?.menuEngNm}`
        if (path != null) {
            setNoticeUrl(`${path}`)
            getNotice(path)
        }
    }, [menus])


    const getNotice = (noticeUrl) => {
        setLoading(true);
        // 반드시 return
        AXIOS.get(`/api/v1/user/main/notice`)
            .then((resp) => {
                const data = resp?.data ?? []
                const list = data.map(e => { return { key: e.id, label: e.date, children: <Link to={`${noticeUrl}/${e.id}`}><Flex gap={4} style={{ maxWidth: "calc(100% - 11px)" }}> {e.noticeType ? <PushpinFilled style={{ color: '#EA1D22', fontSize: 11 }} /> : null}<Typography.Text ellipsis={true} style={{ fontSize: 14, maxWidth: 496 }}> {e.title}</Typography.Text></Flex> </Link>, span: 3 } })
                setItems(list)
            })
            .catch((err) => {
                error(err)
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <SUMainTable
                title={"Notice"}
                items={items}
                onClick={() => navigate(`${noticeUrl}`)}
            />
        </>
    )
}