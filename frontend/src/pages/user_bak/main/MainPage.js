// 젤 처음 보이는 root의 메인 페이지
import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import { SearchRow } from 'components/page/SearchRow';
import { MainMenu } from 'components/page/MainMenu';
import { MainBanner } from 'components/page/MainBanner';
import { PostRowTemplate } from './PostRowTemplate';
import { NoticeList } from './NoticeList';
import { FaqList } from './FaqList';
import { BottomRow } from 'components/page/BottomRow';
import { useGetMenus } from 'hooks/helperHook';
import { InnerDiv } from 'styles/StyledCommon';
import { PopupModalOpener } from 'components/page/PopupModalOpener';

export const MainPage = () => {
    const [smartFinderUrl, setSmartFinderUrl] = useState("/")
    const menus = useGetMenus()
    const navigate = useNavigate();

    useEffect(() => {
        const path = menus?.find(e => e.contentType == 'smartfinder')?.menuEngNm
        if (path != null) {
            setSmartFinderUrl(`${path}`)
        }
    }, [menus])


    return (
        <>
            <PopupModalOpener />
            <Row justify='center'>
                <InnerDiv>
                    <SearchRow />
                </InnerDiv>
                <MainMenu />
                <MainBanner />
                <InnerDiv>
                    <PostRowTemplate apiUrl='/api/v1/user/main/posts/new' title='New' btnFunc={() => navigate(`/main/${smartFinderUrl}`)} />
                </InnerDiv>

                <div>
                    <InnerDiv>
                        <PostRowTemplate apiUrl='/api/v1/user/main/posts/recommend' title='Recommend' btnFunc={() => navigate(`/main/${smartFinderUrl}?recommendOnly=Y`)} />
                    </InnerDiv>
                </div>

                <InnerDiv>
                    <PostRowTemplate apiUrl='/api/v1/user/main/posts/monthly-top' title='Monthly Top View' btnFunc={() => navigate(`/main/${smartFinderUrl}?monthlyOnly=Y`)} />

                    <Row justify='space-between' gutter={[16, 16]}>
                        {/* notice */}
                        <Col span={12} >
                            <NoticeList />
                        </Col>

                        {/* FAQ */}
                        <Col span={12} >
                            <FaqList />
                        </Col>
                    </Row>
                </InnerDiv>
                <BottomRow visibilityHeight={200} />
            </Row>
        </>
    )
}