/**
 * @file SubpageBanner.js
 * @description 동적 서브페이지용 배너
 * @author 이병은
 * @since 2025-06-30 11:33
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-30 11:33    이병은       최초 생성
 **/
// sub페이지 위의 배너 영역
import { useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { useParams } from "react-router-dom";
import { useGetMenus } from 'hooks/helperHook';
import { SUBBANNER_IMAGE } from 'utils/constants';
import { SUText16, SUText36 } from 'styles/StyledUser';
import styled from 'styled-components';
import { SFEm, SFFlexCenter } from 'styles/StyledFuntion';
import { MotionFadeUp } from 'styles/Animations';
import { isEmptyCheck } from 'utils/helpers';

export const SubpageBanner = (props) => {
    const [menu, setMenu] = useState([])
    const [extTitle, setExtTitle] = useState("")
    const { menu1, menu2 } = useParams();
    const menus = useGetMenus()
    const [imagePath, setImagePath] = useState()

    useEffect(() => {
        const m = menus?.find(e => e?.menuEngNm === (menu1 ?? props?.menu1))
        setMenu(m);
        setBannerImg(m);
    }, [menus, menu1, menu2])

    useEffect(() => {
        if (isEmptyCheck(menu2)) {
            setExtTitle("")
        } else {
            const menu2Item = menu?.menuChildren?.find(e => e.menuEngNm === menu2);
            const menu2Nm = menu2Item?.menuNm ?? ""
            setExtTitle(" : " + menu2Nm)
        }
    }, [menu, menu2])

    const setBannerImg = (menuItem) => {
        let bannerPath = '';

        if (!isEmptyCheck(menu2)) {
            // menu2가 있을 때: menu2Banner → menu1Banner → SUBBANNER_IMAGE
            bannerPath =
                menuItem?.menuChildren?.find(e => e.menuEngNm === menu2)?.imagePath
                || menuItem?.imagePath
                || SUBBANNER_IMAGE;
        } else {
            // menu2가 없을 때: menu1Banner → SUBBANNER_IMAGE
            bannerPath =
                menuItem?.imagePath
                || SUBBANNER_IMAGE;
        }

        setImagePath(`url(/api/v1/view/image/${bannerPath})`);
    }

    return (
        <>
            <SubBanner style={{
                backgroundImage: `${imagePath}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
            }}>
                <MotionFadeUp> <SUText36>{menu?.title} {extTitle}</SUText36></MotionFadeUp>
                <MotionFadeUp delay={0.5}> <SUText16>{menu?.subTitle}</SUText16></MotionFadeUp>
            </SubBanner>

        </>
    )
};

const SubBanner = styled.div`
    width: 100%;
    ${SFFlexCenter};
    height: ${SFEm(506)};
    margin-bottom: var(--gap);
    background-color: #ccc;
    color: #fff;
    background-size: cover;
    /* background-attachment: fixed; */
    flex-wrap: wrap;
    align-content: center;
    gap: ${SFEm(8)}
    p{
        color: #fff;
        width: 100%;
    }
`
