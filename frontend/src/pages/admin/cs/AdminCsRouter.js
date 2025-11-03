// CS-Center의 router 설정
import { Link, Route, Switch, useNavigate, useParams, Routes, } from "react-router-dom";
import AdminNotice from "pages/admin/cs/AdminNotice";
import { NoticeRegistration } from 'pages/admin/cs/NoticeRegistration';
import AdminFaq from "pages/admin/cs/AdminFaq";
import { FaqRegistration } from "pages/admin/cs/FaqRegistration";
import AdminQna from "pages/admin/cs/AdminQna";
import { QnaRegistration } from "pages/admin/cs/QnaRegistration";
import AdminRelease from "pages/admin/cs/AdminRelease";
import { ReleaseRegistration } from "pages/admin/cs/ReleaseRegistration";


export const AdminCsRouter = () => {
    const { menu1, menu2 } = useParams();

    // contentType으로 notice, faq, qna 등등으로 routing
    // const menuContentType = getMenuContenttypeByPath(menu1, menu2)

    console.log('메뉴1 메뉴2 menuContentType  : ', menu1, menu2);

    return (
        <>
            {
                menu2 == null ? (
                    <Routes>
                        {/* <Route path="/" element={<CsMain setCurrentPageNm={() => { }} />} />
                        <Route path="/new" element={<CsMain />} setCurrentPageNm={() => { }} />
                        <Route path="/:id" element={<CsMain />} setCurrentPageNm={() => { }} /> */}
                    </Routes>
                ) : (
                    <></>
                )
            }
            {
                menu2 == 'notice' ? (
                    <Routes>
                        <Route path="/" element={<AdminNotice setCurrentPageNm={() => { }} />} />
                        <Route path="/Inq" element={<NoticeRegistration setCurrentPageNm={() => { }} />} />
                        <Route path="/new" element={<NoticeRegistration />} setCurrentPageNm={() => { }} />
                        <Route path="/:id" element={<NoticeRegistration />} setCurrentPageNm={() => { }} />
                    </Routes>
                ) : (
                    <></>
                )
            }
            {
                menu2 == 'faq' ? (
                    <Routes>
                        <Route path="/" element={<AdminFaq setCurrentPageNm={() => { }} />} />
                        <Route path="/new" element={<FaqRegistration />} setCurrentPageNm={() => { }} />
                        <Route path="/:id" element={<FaqRegistration />} setCurrentPageNm={() => { }} />
                    </Routes>
                ) : (
                    <></>
                )
            }
            {
                menu2 == 'qna' ? (
                    <Routes>
                        <Route path="/" element={<AdminQna setCurrentPageNm={() => { }} />} />
                        <Route path="/new" element={<QnaRegistration />} setCurrentPageNm={() => { }} />
                        <Route path="/:id" element={<QnaRegistration />} setCurrentPageNm={() => { }} />
                    </Routes>
                ) : (
                    <></>
                )
            }
            {
                menu2 == 'release' ? (
                    <Routes>
                        <Route path="/" element={<AdminRelease setCurrentPageNm={() => { }} />} />
                        <Route path="/new" element={<ReleaseRegistration />} setCurrentPageNm={() => { }} />
                        <Route path="/:id" element={<ReleaseRegistration />} setCurrentPageNm={() => { }} />
                    </Routes>
                ) : (
                    <></>
                )
            }
        </>

    )
}
