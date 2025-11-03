import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { SComLinkBtn } from "styles/StyledCommon";
import styled, { css } from "styled-components";
import { SUBoardHeader, SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows } from "styles/StyledUser";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { mediaWidth, SFEm, SFMedia } from "styles/StyledFuntion";
import { TheCkeditor } from "components/common/TheCkeditor";
import LoadingSpinner from "components/common/LoadingSpinner";
import { Select } from "antd";

export const Faq = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { error, info } = useMsg();
    const [loading, setLoading] = useState(false); // 로딩관련
    const [data, setData] = useState(); // 게시판 데이터
    const [isOpen, setIsOpen] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [searchCondition, setSearchCondition] = useState({});

    const menu1 = 'cs-center';
    const menu2 = 'faq';


    useEffect(() => {
        getSelectOptions();
        getData();
    }, [location.search]);

    const getSelectOptions = () => {
        AXIOS.get(`/api/v1/common/code-render/FAQ_TYPE`)
            .then((resp) => {
                setSelectOptions(resp?.data);
            })
            .catch((err) => {
                error(err);
            });
    }

    // 게시판 데이터 조회
    const getData = async () => {
        setLoading(true);

        const params = {
            pageNumber: Number(ofqs?.page ?? 1) - 1,
            pageSize: ofqs?.size ?? 10,
            metaDivision: ofqs?.metaDivision,
            keyword: ofqs?.keyword
        }

        await AXIOS.get(`/api/v1/user/cs/bbs/${menu2}`, { params })
            .then((resp) => {
                setData(resp?.data);
                setSearchCondition(params)
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };


    // 폐이징처리  
    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: page, size: pageSize })}`);
    };

    const onSelectChange = (value) => {
        setSearchCondition({ ...searchCondition, metaDivision: value });
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, metaDivision: value, page: 1 })}`);
    }


    const toggleListHandler = (id) => {
        const toggleEvent = (prev) => {
            let list = [...prev];
            if (list.includes(id)) {
                list = list.filter(e => e !== id);
            } else {
                list.push(id);
            }

            return list;
        }

        setIsOpen(prev => toggleEvent(prev));
    }

    return (
        <FanSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} />
                {/* <div className="section-header">
                        <SUText36 className="title">자주 묻는 질문</SUText36>
                        <SUSectionText className="descriptin">제품과 서비스 이용 시 자주 문의하시는 내용을 모았습니다.</SUSectionText>
                    </div> */}
                <SUBoardHeaderWrap>
                    <SUBoardHeader
                        title={'자주 묻는 질문'}
                        description={'SQNT에 문의사항이나 불편한 점이 있으시면 언제든지 고객센터를 이용해 주세요.'}
                    />
                    <Select style={{ width: 80 }} popupMatchSelectWidth={false} value={searchCondition.metaDivision ?? ''} onChange={onSelectChange} align='left' options={[{ label: '전체', value: '' }, ...selectOptions] ?? []} />
                </SUBoardHeaderWrap>
                <ToggleListUl>
                    {
                        data?.content?.map((item, index) => (
                            <motion.li key={item.id} className="toggle-item">
                                <button className="btn-toggle" onClick={() => toggleListHandler(item.id)}>
                                    <div className="title">
                                        {item.metaDivisionNm ? <span>[{item.metaDivisionNm}]</span> : null}
                                        <span>{item.title}</span>
                                    </div>
                                    <div className="icon">
                                        {isOpen.includes(item.id) ? <LuCircleMinus /> : <LuCirclePlus />}
                                    </div>
                                </button>
                                <motion.div className="contents-toggle"
                                    nitial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={isOpen.includes(item.id) ? { height: 'auto', opacity: 1, marginTop: '1em' } : { height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                >
                                    <TheCkeditor
                                        borderColor='transparent'
                                        data={item.contents}
                                        readonly={true}
                                    ></TheCkeditor>
                                </motion.div>
                            </motion.li>
                        ))
                    }
                </ToggleListUl>
                {
                    !loading &&
                    <SUPaginationWithArrows
                        onChange={handlePageChange}
                        current={Number(data?.number ?? 0) + 1}
                        pageSize={data?.pageSize ?? 10}
                        total={data?.totalElements}
                        position={'bottomCenter'}
                        showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                        showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                    />
                }

                <div className="content-box">
                    <SComLinkBtn variant="solid" color={'primary'} to={'/cs-center/qna/new'}>문의하기</SComLinkBtn>
                </div>
            </SUInner1280>
        </FanSection>
    );
};

const FanSection = styled.section`
    &{
        font-size: 16px;
    }
    .section-header{
        padding: ${SFEm(96)} ${SFEm(64)};
        text-align: center;
        .descriptin{
            margin-top: ${SFEm(20, 20)};
        }
    }

    .ant-pagination{
        margin-top: ${SFEm(64)};
    }
    .content-box{
        height: ${SFEm(322)};
        background: url(/img/sample/content.png) center center no-repeat;
        background-size: cover;
        display: flex;
        align-items: self-end;
        justify-content: center;
        padding-bottom: ${SFEm(32)};
        margin-top: ${SFEm(64)};
        width: 100%;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
    .section-header{
        padding: 0 0 ${SFEm(45)};
    }
`)};

`;


const ToggleListUl = styled.ul`
    &{

        border-bottom:1px solid #E9EAEB;
    }
    .toggle-item{
        border-top:1px solid #E9EAEB;
        padding: ${SFEm(24)} 0;
        .btn-toggle {
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            font-size: ${SFEm(16)};
            color: #181D27;
            font-weight: 600;
            padding-right: ${SFEm(30)};
        }
        .title{
            text-align: left;
        }
        .btn-toggle .title span:first-child{padding-right: ${SFEm(4)}}
        
        .btn-toggle .icon{
            position: absolute;
            top: 0;
            right: 0;
            font-size: ${SFEm(24)};
            color: #A4A7AE;
        }
        .contents-toggle{
            height: 0;
            overflow: hidden;
            font-size: ${SFEm(16)};
            font-weight: 400;
            line-height: ${24 / 16};
            margin-top: ${SFEm(16)};
        }
    }

`;