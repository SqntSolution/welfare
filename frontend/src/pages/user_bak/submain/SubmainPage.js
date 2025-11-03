// sub main 페이지 (1차, 2차 메뉴가 다 있는)
import { useEffect, useState } from 'react';
import { Space, Segmented, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { SearchRow } from 'components/page/SearchRow'
import { MainMenu } from 'components/page/MainMenu'
import { BottomRow } from 'components/page/BottomRow'
import { PostItemSmall2 } from 'components/page/PostItemSmall2'
import { SubpageBanner } from 'components/page/SubpageBanner'
import { Link, Route, Switch, useNavigate, useParams, useLocation, Routes } from "react-router-dom";
import { Submenu } from './Submenu'
// import { getMenuContenttypeByPath, getMenuIdFromPath } from 'utils/menuHolder';
// import { CsCenterRouter } from "pages/user/cs/CsCenterRouter";
import { SearchResultPosts } from './SearchResultPosts'
import { SubmainCustomArea } from './SubmainCustomArea'
import { ScrapTop5Area } from './ScrapTop5Area'
import { RecommendArea } from './RecommendArea'
import { SmartFinderPage } from 'pages/user/smartfinder/SmartFinderPage'
import { useMsg } from 'hooks/helperHook';
import { useHasEditAuth, useGetMenus } from 'hooks/helperHook'
import { PagePage } from 'pages/user/post/PagePage'
import { MainScreen } from "pages/user/cs/MainScreen";
import { Notice } from "pages/user/cs/notice/Notice";
import { NoticeDetail } from 'pages/user/cs/notice/NoticeDetail';
import { Faq } from 'pages/user/cs/faq/Faq';
import { Qna } from 'pages/user/cs/qna/Qna';
import { FaqDetail } from 'pages/user/cs/faq/FaqDetail';
import { QnaDetail } from "pages/user/cs/qna/QnaDetail";
import { QnaInquiry } from "pages/user/cs/qna/QnaInquiry";
import { InnerDiv } from 'styles/StyledCommon';
import { Alarm } from 'pages/user/my/Alarm'
import { History } from 'pages/user/my/History'
import { Profile } from 'pages/user/my/Profile'
import { Scrap } from 'pages/user/my/Scrap'
import { MyPost } from 'pages/user/my/MyPostPage'
import { PopupModalOpener } from 'components/page/PopupModalOpener'

export const SubmainPage = () => {
    const [loading, setLoading] = useState(false);
    const { menu1, menu2 } = useParams();
    const [contentType1, setContentType1] = useState("-");
    const [contentType2, setContentType2] = useState("-");
    // const [mainMenus, setMainMenus] = useState(null);
    const mainMenus = useGetMenus()
    const hasEditAuth = useHasEditAuth()

    // cs-center, smartfinder, my는 화면 구성이 다름.
    useEffect(() => {
        if (mainMenus == null) {
            return
        }
        // 1차 메뉴의 대한 contentType
        const contentType1 = (mainMenus ?? [])?.find(e => e?.menuEngNm == menu1)?.contentType
        setContentType1(contentType1)
        // 2차 메뉴에 대한 contentType
        const contentType2 = (mainMenus ?? [])?.filter(e => e?.menuEngNm == menu1)?.flatMap(e => e?.menuChildren)?.find(e => e?.menuEngNm == menu2)?.contentType
        setContentType2(contentType2)
    }, [mainMenus, menu1, menu2])


    const PostContents = (
        <>
            <SubpageBanner />
            <PopupModalOpener />

            {
                (() => {
                    if (contentType1 == "-") {
                        return <Submenu />

                    } else if (contentType1 == "cscenter") {
                        if (contentType2 == 'notice') {
                            return <>
                                <Submenu />
                                <Routes>
                                    <Route path="/" element={<Notice setCurrentPageNm={() => { }} />} />
                                    <Route path="/new" element={<NoticeDetail />} setCurrentPageNm={() => { }} />
                                    <Route path="/:id" element={<NoticeDetail />} setCurrentPageNm={() => { }} />
                                </Routes>
                            </>
                        } else if (contentType2 == 'faq') {
                            return <>
                                <Submenu />
                                <Routes>
                                    <Route path="/" element={<Faq setCurrentPageNm={() => { }} />} />
                                    <Route path="/new" element={<FaqDetail />} setCurrentPageNm={() => { }} />
                                    <Route path="/:id" element={<FaqDetail />} setCurrentPageNm={() => { }} />
                                </Routes></>

                        } else if (contentType2 == 'qna') {
                            return <>
                                <Submenu />
                                <Routes>
                                    <Route path="/" element={<Qna setCurrentPageNm={() => { }} />} />
                                    <Route path="/qnainquiry" element={<QnaInquiry />} setCurrentPageNm={() => { }} />
                                    <Route path="/qnainquiry/:upid" element={<QnaInquiry />} setCurrentPageNm={() => { }} />
                                    <Route path="/new" element={<QnaDetail />} setCurrentPageNm={() => { }} />
                                    <Route path="/:id" element={<QnaDetail />} setCurrentPageNm={() => { }} />
                                </Routes></>
                        } else if (contentType2 == null) {
                            return <>
                                <Submenu />
                                <Routes>
                                    <Route path="/" element={<MainScreen setCurrentPageNm={() => { }} />} />
                                    <Route path="/new" element={<MainScreen />} setCurrentPageNm={() => { }} />
                                    <Route path="/:id" element={<MainScreen />} setCurrentPageNm={() => { }} />
                                </Routes></>

                        }

                    } else if (contentType1 == "my") {
                        if (contentType2 == "profile") {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<Profile />} /> </Routes>
                            </>
                        } else if (contentType2 == "scrap") {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<Scrap />} /> </Routes>
                            </>
                        } else if (contentType2 == "alarm") {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<Alarm />} /> </Routes>
                            </>
                        } else if (contentType2 == "history") {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<History />} /> </Routes>
                            </>
                        } else if (contentType2 == "mypost") {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<MyPost />} /> </Routes>
                            </>
                        } else {
                            return <>
                                <Submenu />
                                <Routes> <Route path="/" element={<Profile />} /> </Routes>
                            </>
                        }

                    } else if (contentType1 == "smartfinder") {
                        return <SmartFinderPage />

                    } else {
                        return (< >
                            <SearchResultPosts />
                            <InnerDiv>
                                <SubmainCustomArea />
                                <Row>
                                    <Col span={12}>
                                        {/* scrap */}
                                        <ScrapTop5Area />
                                    </Col>
                                    <Col span={12}>
                                        {/* recommend */}
                                        <RecommendArea />
                                    </Col>
                                </Row>
                            </InnerDiv>
                        </>
                        )
                    }
                })()
            }
        </>
    )


    const PageContents = (
        <>
            <PagePage />
        </>
    )

    return (
        <Row justify='center' style={{
            margin: '0 auto',
            border: '0',
            width: '100%',
        }}>
            <div style={{ width: '100%' }}>
                <InnerDiv>
                    <SearchRow />
                </InnerDiv>
                {/* <MainMenu onMainMenuFetched={menus => setMainMenus(menus)} /> */}
                <MainMenu />
                {
                    (contentType2 == "-") ? (
                        null
                    ) : (
                        (contentType2 == "page") ? (
                            PageContents
                        ) : (
                            PostContents
                        )
                    )
                }
            </div>
            <BottomRow />
        </Row>
    )

}

