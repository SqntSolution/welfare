// 젤 처음 보이는 root의 메인 페이지
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { useGetMenus, useMsg } from 'hooks/helperHook';
import { SUInner1440, SUPointText, SUSectionText, SUText36 } from 'styles/StyledUser';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AXIOS } from 'utils/axios';
import * as S from './StyledMainPage';
import AccordionList from './comp/AccordionList';
import { Button, Checkbox, Col, Flex, Form, Input, Modal, Row } from 'antd';
import { FaArrowLeft, FaArrowRight, FaXTwitter, FaYoutube } from "react-icons/fa6";
import CardItem from 'components/user/CardItem';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { LuCheck, LuMessageCircle } from "react-icons/lu";
import { IoLogoFacebook } from "react-icons/io5";
import { motion, useScroll, useTransform } from "framer-motion";
import { MotionFadeLeft, MotionFadeRight, MotionFadeUp } from 'styles/Animations';
import { useRecoilValue } from 'recoil';
import { deviceInfoState } from 'atoms/atom';
import { isUnderMedia } from 'styles/StyledFuntion';
import PrivacyPolicy from '../legal/PrivacyPolicy';


export const MainPage = () => {
    const [smartFinderUrl, setSmartFinderUrl] = useState("/")
    const menus = useGetMenus()
    const { error, info } = useMsg();
    const [postItem, setPostItem] = useState([]);
    const [bannerItem, setBannerItem] = useState([]);
    const [openAccordion, setOpenAccordion] = useState(0);
    const deviceInfo = useRecoilValue(deviceInfoState);
    const [form] = Form.useForm();
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSwiperReady, setIsSwiperReady] = useState(false);



    useEffect(() => {
        setIsSwiperReady(true);
    }, []);
    useEffect(() => {
        const path = menus?.find(e => e.contentType === 'smartfinder')?.menuEngNm
        if (path != null) {
            setSmartFinderUrl(`${path}`)
        }
    }, [menus])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false);
                form.resetFields();
            }, 2000)
        }
    }, [isSuccess])
    const getBanners = () => {
        // 반드시 return
        AXIOS.get(`/api/v1/user/main/banners`)
            .then((res) => {
                setBannerItem(res?.data ?? [])
                // console.log(res?.data);
            })
            .catch((err) => {
                console.log('=== getBanners 에러 : ', err?.response);
                error(err)
            })
    };

    const getNewPost = () => {
        AXIOS.get(`/api/v1/user/main/posts/new/product`)
            .then((res) => {
                setPostItem(res?.data ?? []);
            })
            .catch((err) => {
                console.log('=== getNewPost 에러 : ', err?.response);
                error(err)
            })
    }

    const submitOnClick = () => {
        setLoading(true);
        form.validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((err) => {
                setLoading(false);
            })
    }

    const onFinish = (values) => {
        const user = values.user;
        AXIOS.post('/api/v1/common/email/inquiry', user)
            .then((res) => {
                setIsSuccess(true);
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                setLoading(false);
            });
    };

    const openPrivacyPolicy = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const sec2PrevRef = useRef();
    const sec2NextRef = useRef();

    const sec5PrevRef = useRef();
    const sec5NextRef = useRef();


    const sec6Ref = useRef();
    const { scrollYProgress } = useScroll({ target: sec6Ref });
    const scaleX = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const topValue = useTransform(scrollYProgress, [0, 1], ['0', "-10%"]);

    const sec4Ref = useRef();


    const rotateX = useTransform(scrollYProgress, [0, 0.95, 1], [0, 0, 19]);
    useEffect(() => {
        getBanners(); //배너
        getNewPost(); //section 2
    }, []);

    const onPrivacyPolicyBtnClick = (type) => {
        if (type === 'ok') {
            form.setFieldsValue({ user: { ...form.getFieldValue('user'), check: true } });
        } else {
            form.setFieldsValue({ user: { ...form.getFieldValue('user'), check: false } });
        }
        setIsOpen(false);
    }

    const isMobile = isUnderMedia(deviceInfo.deviceSize, 'mo-m');
    const sectionGap = !isMobile ? 64 : 48;
    return (
        <S.MainWrap className='main'>
            <S.Section1>
                <SUInner1440>
                    <h2 className='sec1-title'>
                        <MotionFadeUp delay={0.5}>오랜시간 꿈꾸던 공간을 완성하고 </MotionFadeUp>
                        <MotionFadeUp delay={0.6}> 다음 세대까지 함께할 수 있는 브랜드</MotionFadeUp>
                    </h2>
                    <MotionFadeUp delay={0.8}><p className='sec1-text'>엘로리언 장인 정신으로 아름답고 기능적인 공간을 만드는 최적의 경험을 제공합니다.</p></MotionFadeUp>
                    <MotionFadeUp delay={0.9}>
                        <S.MoreLink to={`/company`} className='sec1-more'>
                            <span className='text'>Work with us</span>
                            <span className='icon'><FaArrowRight /></span>
                        </S.MoreLink>
                    </MotionFadeUp>
                </SUInner1440>
                <div className='blinds'>
                    <div className='blinds-top blinds-inner'>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                    </div>
                    <div className='blinds-bottom blinds-inner'>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                        <span className='blinds-line'></span>
                    </div>
                </div>
            </S.Section1>
            <S.Section2>
                <SUInner1440>
                    <Flex wrap gap={sectionGap}>
                        <S.SectionHeader>
                            <MotionFadeUp><SUPointText> Feature </SUPointText></MotionFadeUp>
                            <MotionFadeUp delay={0.1}><SUText36>Finally, A 'big Forest' Is Formed</SUText36></MotionFadeUp>
                            <MotionFadeUp delay={0.2}><SUSectionText>엘로리언는 우리의 기술, 제품, 서비스를 통해 개인과 사회의 풍요로운 삶의 기반을 마련합니다.</SUSectionText></MotionFadeUp>
                        </S.SectionHeader>
                        {!isMobile && isSwiperReady ? (
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                slidesPerView={3.8}
                                spaceBetween={32}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                navigation={{
                                    prevEl: sec2PrevRef.current,
                                    nextEl: sec2NextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation.prevEl = sec2PrevRef.current;
                                    swiper.params.navigation.nextEl = sec2NextRef.current;
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 'auto',
                                        spaceBetween: 20,
                                    },
                                    540: {
                                        slidesPerView: 2.5,
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 32,
                                    },
                                    1440: {
                                        slidesPerView: 3.7,
                                        spaceBetween: 32,
                                    },
                                }}
                            >
                                <SwiperSlide >
                                    <MotionFadeUp delay={0.1}>
                                        <img src='../img/sample/main-sec2-slide1.png' alt='' />
                                    </MotionFadeUp>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <MotionFadeUp delay={0.2}>
                                        <img src='../img/sample/main-sec2-slide2.png' alt='' />
                                    </MotionFadeUp>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <MotionFadeUp delay={0.3}>
                                        <img src='../img/sample/main-sec2-slide3.png' alt='' />
                                    </MotionFadeUp>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <MotionFadeUp delay={0.4}>
                                        <img src='../img/sample/main-sec2-slide4.png' alt='' />
                                    </MotionFadeUp>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <img src='../img/sample/main-sec2-slide1.png' alt='' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src='../img/sample/main-sec2-slide2.png' alt='' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src='../img/sample/main-sec2-slide3.png' alt='' />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src='../img/sample/main-sec2-slide4.png' alt='' />
                                </SwiperSlide>
                                <Flex align='center' justify='space-betwwen' className='btn-wrap'>
                                    <button ref={sec2PrevRef} className='btn btn-prev'><FaArrowLeft /> </button>
                                    <button ref={sec2NextRef} className='btn btn-next'><FaArrowRight /> </button>
                                </Flex>
                            </Swiper>
                        ) : (
                            <div className='sec2-mo-img'>
                                <MotionFadeUp delay={0.1}>
                                    <img src='../img/sample/main-sec2-slide1.png' alt='' />
                                </MotionFadeUp>
                                <MotionFadeUp delay={0.1}>
                                    <img src='../img/sample/main-sec2-slide2.png' alt='' />
                                </MotionFadeUp>
                                <MotionFadeUp delay={0.1}>
                                    <img src='../img/sample/main-sec2-slide3.png' alt='' />
                                </MotionFadeUp>
                                <MotionFadeUp delay={0.1}>
                                    <img src='../img/sample/main-sec2-slide4.png' alt='' />
                                </MotionFadeUp>
                            </div>
                        )

                        }

                        <Flex justify={'space-between'} gap={32} className='sata-wrap'>
                            <S.StatInner
                                number={54}
                                title={'Years experience'}
                                description={'수년간 전문 장인 정신으로 삶의질을 개선하기까지'}
                            />
                            <S.StatInner
                                number={8000}
                                title={'Years experience'}
                                description={'수천건 이상의 성공적인 프로젝트가 품질과 세심함으로 제공되었습니다.'}
                            />
                            <S.StatInner
                                number={256}
                                title={'Skilled Tradespeople'}
                                description={'256명의 임직원으로 구성된 팀이 최고 품질의 결과물을 보장합니다.'}
                            />
                            <S.StatInner
                                number={100}
                                title={'Client satisfaction'}
                                description={'모든 고객이 저희의 업무와 서비스에 만족합니다.'}
                                suffix="%"
                            />
                        </Flex>
                    </Flex>

                </SUInner1440>
            </S.Section2>
            <section>
                <SUInner1440>
                    <Flex wrap gap={sectionGap} justify='center' style={{ width: "100%" }}>
                        <S.SectionHeader $align="center">
                            <MotionFadeUp><SUPointText>Services </SUPointText></MotionFadeUp>
                            <MotionFadeUp delay={0.1}><SUText36>사업 분야</SUText36></MotionFadeUp>
                            <MotionFadeUp delay={0.2}><SUSectionText>프로젝트의 요구사항에 맞는 서비스를 찾아보세요</SUSectionText></MotionFadeUp>
                        </S.SectionHeader>
                        <MotionFadeUp delay={0.3} style={{ width: "100%" }}>
                            {(() => {
                                const accordionData = [
                                    {
                                        img: 'main-sec3-img1.png',
                                        title: "경계를 투명하게, 일상을 특별하게.",
                                        content:
                                            <>
                                                빛을 머금은 공간, 기술과 디자인이 만나는 창의 미학.<br />
                                                프리미엄 시스템으로 당신 품격을 완성합니다.
                                            </>
                                    },
                                    {
                                        img: 'main-sec3-img2.png',
                                        title: "정교함이 만드는 산업의 리듬.",
                                        content:
                                            <>
                                                정밀한 기술력과 안정적인 품질로 산업 현장의 기반을 만듭니다.  <br />
                                                스마트하고 견고한 솔루션을 제공합니다.
                                            </>
                                    },
                                    {
                                        img: 'main-sec3-img3.png',
                                        title: "세상을 더 맑게 움직인다.",
                                        content:
                                            <>
                                                고효율, 친환경 에너지 기술로 지속 가능한 미래를 실현합니다. <br />
                                                에너지의 새로운 표준을 제시합니다.
                                            </>
                                    },
                                    {
                                        img: 'main-sec3-img4.png',
                                        title: "자연을 닮은 기술, 삶을 위한 배려.",
                                        content:
                                            <>
                                                도시와 자연 사이의 균형을 생각한 친환경 솔루션. <br />
                                                삶에 스며드는 지속 가능한 공간을 만들어갑니다.
                                            </>
                                    },
                                ];
                                return (
                                    <S.AccordionUl>
                                        {accordionData.map((item, index) => (
                                            <AccordionList
                                                key={index}
                                                number={index < 9 ? `0${index + 1}` : index + 1}
                                                title={item.title}
                                                img={item?.img}
                                                isOpen={openAccordion === index}
                                                onClick={() => setOpenAccordion(index)}
                                            >
                                                {item.content}
                                            </AccordionList>
                                        ))}
                                    </S.AccordionUl>
                                );
                            })()}
                        </MotionFadeUp>
                    </Flex>
                </SUInner1440>
            </section>
            <S.Section4>
                <SUInner1440>
                    <Flex wrap gap={sectionGap}>
                        <S.SectionHeader $align="center">
                            <MotionFadeUp><SUPointText>Our work</SUPointText></MotionFadeUp>
                            <MotionFadeUp delay={0.1}>
                                <SUText36>
                                    끊임없는 혁신과 도전으로 <br />
                                    인류의 미래를 개척합니다
                                </SUText36>
                            </MotionFadeUp>
                            <MotionFadeUp delay={0.2}>
                                <SUSectionText>
                                    엘로리언은 인류를 위해 새로운 가치를 만들어가는<br />
                                    'Future Builder'로 거듭나고 있습니다.
                                </SUSectionText>
                            </MotionFadeUp>
                        </S.SectionHeader>

                        <div className='sec4-card-banner' >
                            <motion.div className='card-inner'
                                ref={sec4Ref}
                            >
                                {/* 272  */}
                                <S.ProjectCardItem
                                    label={'Elorien Energe'}
                                    img={'main-sec4-slide1.png'}
                                    title={<>
                                        산업단지를 움직이는 친환경 스팀과 전력, <br />
                                        그 중심에 선 에너지 리더
                                    </>}
                                    rotateX={rotateX}
                                />
                                <S.ProjectCardItem
                                    label={'Elorien Energe'}
                                    img={'main-sec4-slide2.png'}
                                    title={<>
                                        산업단지를 움직이는 친환경 스팀과 전력,<br />
                                        그 중심에 선 에너지 리더
                                    </>}
                                    rotateX={rotateX}
                                />
                                <S.ProjectCardItem
                                    label={'Elorien Energe'}
                                    img={'main-sec4-slide3.png'}
                                    title={<>
                                        산업단지를 움직이는 친환경 스팀과 전력, <br />
                                        그 중심에 선 에너지 리더
                                    </>}
                                    rotateX={rotateX}
                                />
                            </motion.div>
                        </div>
                    </Flex>
                </SUInner1440>
            </S.Section4>
            {postItem?.length &&
                <S.Section5>
                    <Flex wrap gap={sectionGap} justify='center'>
                        <SUInner1440>
                            <S.SectionHeader $align="center">
                                <MotionFadeUp><SUPointText>Product</SUPointText></MotionFadeUp>
                                <MotionFadeUp delay={0.1}><SUText36>상품 스토리</SUText36></MotionFadeUp>
                                <MotionFadeUp delay={0.2}><SUSectionText>차별화된 엘로리언의 경쟁력 있는 상품을 소개합니다.</SUSectionText></MotionFadeUp>
                            </S.SectionHeader>
                        </SUInner1440>
                        <MotionFadeUp delay={0.3} className="sec5-slide-inner">
                            <SUInner1440 className='sec5-slide'>
                                <>
                                    {!isMobile ? (
                                        <>
                                            <Swiper
                                                modules={[Navigation]}
                                                slidesPerView={3.45}
                                                spaceBetween={32}
                                                navigation={{
                                                    prevEl: sec5PrevRef.current,
                                                    nextEl: sec5NextRef.current,
                                                }}
                                                onBeforeInit={(swiper) => {
                                                    swiper.params.navigation.prevEl = sec5PrevRef.current;
                                                    swiper.params.navigation.nextEl = sec5NextRef.current;
                                                }}
                                                breakpoints={{
                                                    0: {
                                                        slidesPerView: 1.5,
                                                        spaceBetween: 16,
                                                    },
                                                    640: {
                                                        slidesPerView: 2.8,
                                                        spaceBetween: 24,
                                                    },
                                                    768: {
                                                        slidesPerView: 3,
                                                        spaceBetween: 24,
                                                    },
                                                    1024: {
                                                        slidesPerView: 3.45,
                                                        spaceBetween: 32,
                                                    },
                                                }}
                                            >
                                                {
                                                    postItem?.map(post =>
                                                        <SwiperSlide key={post.id}>
                                                            <CardItem
                                                                to={`/post/${post.id}`}
                                                                img={`/api/v1/view/image/${post.representativeImagePath}`}
                                                                label={post.menuName2 ?? post.menuName1}
                                                                title={post.title}
                                                                text={post.date}
                                                            />
                                                        </SwiperSlide>
                                                    )
                                                }
                                            </Swiper>

                                            <Flex align='center' gap={24} className='btn-wrap'>
                                                <button ref={sec5PrevRef} className='btn btn-prev'><FaArrowLeft /> </button>
                                                <button ref={sec5NextRef} className='btn btn-next'><FaArrowRight /> </button>
                                            </Flex>
                                        </>
                                    ) :
                                        postItem?.slice(0, 4)?.map((post) => (
                                            <div key={post.id} className='sec5-item'>
                                                <CardItem
                                                    to={`/post/${post.id}`}
                                                    img={`/api/v1/view/image/${post.representativeImagePath}`}
                                                    label={post.menuName2 ?? post.menuName1}
                                                    title={post.title}
                                                    date={post.date}
                                                />
                                            </div>
                                        ))
                                    }
                                </>
                            </SUInner1440>
                        </MotionFadeUp>
                    </Flex>
                </S.Section5>
            }
            <S.Section6 ref={sec6Ref}>
                <motion.div style={{ top: topValue }} className='motion-wrap'>
                    <SUInner1440>
                        <Flex gap={sectionGap} wrap>
                            <S.SectionHeader $align="center">
                                <SUPointText> Business Ethics</SUPointText>
                                <SUText36>윤리경영</SUText36>
                                <SUSectionText>최신 공지 사항 및 스토리로 최신 소식을 받아보세요.</SUSectionText>
                            </S.SectionHeader>

                            <S.VisualFeatureWrap>
                                <Flex gap={16} wrap>
                                    <Flex gap={16} wrap>
                                        <MotionFadeLeft viewport={{ once: false, amount: 0.2 }}>
                                            <S.VisualFeatureCards

                                                to={'/'}
                                                label={'나무와 자연, 사람'}
                                                text={'기업의 이윤보다 환경을 먼저 생각하는 기업'}
                                                img={'main-sec6-card1.png'}
                                            />
                                        </MotionFadeLeft>
                                        <MotionFadeLeft delay={0.2} viewport={{ once: false, amount: 0.2 }}>
                                            <S.VisualFeatureCards
                                                to={'/'}
                                                label={'나무와 자연, 사람'}
                                                text={'기업의 이윤보다 환경을 먼저 생각하는 기업'}
                                                img={'main-sec6-card3.png'}
                                            />
                                        </MotionFadeLeft>
                                    </Flex>
                                </Flex>
                                <Flex gap={16} wrap>
                                    <MotionFadeRight delay={0.3} viewport={{ once: false, amount: 0.2 }}>
                                        <S.VisualFeatureCards
                                            to={'/'}
                                            label={'나무와 자연, 사람'}
                                            text={'기업의 이윤보다 환경을 먼저 생각하는 기업'}
                                            img={'main-sec6-card2.png'}
                                        />
                                    </MotionFadeRight>

                                    <Flex gap={16} className='small-inner'>
                                        <MotionFadeRight delay={0.1} viewport={{ once: false, amount: 0.2 }}>
                                            <S.VisualFeatureCards
                                                to={'/'}
                                                img={'main-sec6-card4.png'}
                                            />
                                        </MotionFadeRight>
                                        <MotionFadeRight delay={0.4} viewport={{ once: false, amount: 0.2 }}>
                                            <S.VisualFeatureCards
                                                to={'/'}
                                                img={'main-sec6-card5.png'}
                                            />
                                        </MotionFadeRight>
                                    </Flex>
                                </Flex>
                            </S.VisualFeatureWrap>
                        </Flex>
                    </SUInner1440>
                </motion.div>
                <motion.span className='sec6-bg' style={{ scale: scaleX }} />
            </S.Section6>

            <S.RollingBannerStyle>
                <SUInner1440>
                    {/* <S.ParallaxText baseVelocity={-5}>Framer Motion</S.ParallaxText> */}
                    <MotionFadeUp><p className='text'>Trusted by 4,000+ companies</p></MotionFadeUp>
                    <MotionFadeUp delay={0.1}>
                        <S.RollingBanner
                            images={[
                                'logo1.png',
                                'logo2.png',
                                'logo3.png',
                                'logo4.png',
                                'logo5.png',
                                'logo6.png',
                            ]}
                        />

                        {isMobile ?
                            (
                                <div className='mo-rolling'>
                                    <S.RollingBanner
                                        images={[
                                            'logo1.png',
                                            'logo2.png',
                                            'logo3.png',
                                            'logo4.png',
                                            'logo5.png',
                                            'logo6.png',
                                        ]}
                                    />
                                    <S.RollingBanner
                                        images={[
                                            'logo1.png',
                                            'logo2.png',
                                            'logo4.png',
                                            'logo3.png',
                                            'logo6.png',
                                            'logo5.png',
                                        ]}
                                    />
                                </div>
                            ) : null
                        }
                    </MotionFadeUp>
                </SUInner1440>
            </S.RollingBannerStyle>
            <S.Section8>
                <SUInner1440>
                    <Flex gap={128} justify={'space-between'} className='inner' >
                        <div className='sec7-left'>
                            <S.SectionHeader>
                                <MotionFadeUp><SUPointText> Our team</SUPointText></MotionFadeUp>
                                <MotionFadeUp delay={0.1}><SUText36> 함께하는 사람들</SUText36></MotionFadeUp>
                                <MotionFadeUp delay={0.2}><SUSectionText>이곳을 만들어가는 사람들, 우리 팀을 소개합니다.</SUSectionText></MotionFadeUp>
                            </S.SectionHeader>
                        </div>

                        <S.TeamList gutter={[24, 24]} justify={'space-between'}>
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-1.png'}
                                name={'정재인'}
                                company={'Jung'}
                                badge={'CEO'}
                                index={1}
                            />
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-2.png'}
                                name={'박병은'}
                                company={'Park'}
                                badge={'Manager'}
                                index={2}
                            />
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-3.png'}
                                name={'임지문'}
                                company={'Lim'}
                                badge={'Designer'}
                                index={3}
                            />
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-4.png'}
                                name={'김상철'}
                                company={'Kim'}
                                badge={'Developer'}
                                index={4}
                            />
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-5.png'}
                                name={'정단아'}
                                company={'Park'}
                                badge={'Frontend'}
                                index={5}
                            />
                            <S.TeamListCard
                                img={'/img/sample/main-sec8-6.png'}
                                name={'박정규'}
                                company={'Swag Studio'}
                                badge={'Marketer'}
                                index={6}
                            />
                        </S.TeamList>
                    </Flex>
                </SUInner1440>
            </S.Section8>

            <S.Section9>
                <S.SectionLine className='divider' />
                <SUInner1440>
                    <Flex wrap gap={sectionGap}>
                        <S.SectionHeader>
                            <MotionFadeUp><SUPointText>Contact</SUPointText></MotionFadeUp>
                            <MotionFadeUp delay={0.1}><SUText36> 성공적인 비지니스를 위한 첫걸음, 지금 바로 문의하세요.</SUText36></MotionFadeUp>
                            <MotionFadeUp delay={0.2}><SUSectionText>문의 사항이 있거나 비전에 대해 더 자세히 알아보시려면 아래 제공된 세부 정보를 사용하여 전문가 팀에 문의하시기 바랍니다.</SUSectionText></MotionFadeUp>
                        </S.SectionHeader>
                        <MotionFadeUp delay={0.3}>
                            <Row className='contact-form-wrap' gutter={64} justify="space-between" >
                                <Col span={24} lg={{ span: 12 }} className='contact-info'>
                                    <Row gutter={[32, 64]} >
                                        <S.ContactInfo
                                            icon={<HiOutlineLocationMarker />}
                                            label="Office"
                                            title="Come say hello at our office HQ."
                                            text="서울특별시 마포구 동교로 161(서교동) 엘로리언"
                                        />
                                        <S.ContactInfo
                                            icon={<HiOutlineMail />}
                                            label="Office"
                                            title="Come say hello at our office HQ."
                                            text="서울특별시 마포구 동교로 161(서교동) 엘로리언"
                                        />
                                        <S.ContactInfo
                                            icon={<HiOutlinePhone />}
                                            label="Office"
                                            title="Come say hello at our office HQ."
                                            text="서울특별시 마포구 동교로 161(서교동) 엘로리언"
                                        />
                                        <S.ContactInfo
                                            icon={<LuMessageCircle />}
                                            label="Office"
                                            title="Come say hello at our office HQ."
                                            text="서울특별시 마포구 동교로 161(서교동) 엘로리언"
                                        />
                                    </Row>
                                    <Flex className='sns-wrap' gap={32}>
                                        <Link to="" ><FaXTwitter /></Link>
                                        <Link to="" ><FaYoutube /></Link>
                                        <Link to="" ><IoLogoFacebook /></Link>
                                    </Flex>
                                </Col>
                                <Col span={24} lg={{ span: 12 }} align={'right'} className='contact-form'>
                                    <Form
                                        form={form}
                                        name="inquiry"
                                        layout="vertical"
                                    >
                                        <Form.Item
                                            label="Name"
                                            name={['user', 'name']}
                                            rules={[
                                                { required: true, message: '이름을 입력해주세요.' },
                                                { pattern: /^[^0-9]+$/, message: '이름에는 숫자를 입력할 수 없습니다.' }
                                            ]}
                                        >
                                            <Input
                                                disabled={isSuccess || loading}
                                                placeholder="이름"
                                                size="large"
                                                onChange={e => {
                                                    const value = e.target.value.replace(/[0-9]/g, '');
                                                    form.setFieldsValue({ user: { ...form.getFieldValue('user'), name: value } });
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name={['user', 'email']}
                                            rules={[
                                                { required: true, message: '이메일을 입력해주세요.' },
                                                { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }
                                            ]}
                                        >
                                            <Input
                                                type="email"
                                                disabled={isSuccess || loading}
                                                placeholder="이메일"
                                                size="large"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Phone number"
                                            name={['user', 'mobileNo']}
                                            rules={[
                                                { required: true, message: '전화번호를 입력해주세요.' },
                                                { pattern: /^010-\d{4}-\d{4}$/, message: '010-0000-0000 형식으로 입력해주세요.' }
                                            ]}
                                        >
                                            <Input
                                                type="tel"
                                                disabled={isSuccess || loading}
                                                placeholder="010-0000-0000"
                                                size="large"
                                                maxLength={13}
                                                onChange={e => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value.length > 3 && value.length <= 7)
                                                        value = value.replace(/(\d{3})(\d+)/, '$1-$2');
                                                    else if (value.length > 7)
                                                        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
                                                    form.setFieldsValue({ user: { ...form.getFieldValue('user'), mobileNo: value } });
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Message"
                                            name={['user', 'message']}
                                            rules={[{ required: true, message: '문의 내용을 입력해주세요.' }]}
                                        >
                                            <Input.TextArea disabled={isSuccess || loading} maxLength={1000} />
                                        </Form.Item>
                                        <Form.Item
                                            name={['user', 'check']}
                                            valuePropName="checked"
                                            className="form-last-checked"
                                            rules={[
                                                {
                                                    validator: (_, value) =>
                                                        value
                                                            ? Promise.resolve()
                                                            : Promise.reject(new Error('개인정보 보호정책에 동의해 주세요.')),
                                                },
                                            ]}
                                        >
                                            <Checkbox>
                                                <span style={{ textDecorationLine: 'underline' }} onClick={openPrivacyPolicy}>개인정보 처리방침</span>에 동의합니다.
                                            </Checkbox>
                                        </Form.Item>
                                        {isSuccess ? <Button size='large' disabled><LuCheck />  양식을 제출해 주셔서 감사합니다.</Button> :
                                            <Button type="primary" onClick={() => submitOnClick()} size='large' loading={loading} >문의하기</Button>}
                                    </Form>
                                </Col>
                            </Row>
                        </MotionFadeUp>
                    </Flex>
                    <Modal
                        destroyOnClose
                        styles={{ body: { maxHeight: '50vh', overflowY: 'auto' }, header: { marginBottom: 8 } }}
                        open={isOpen}
                        closable={false}
                        onCancel={() => onPrivacyPolicyBtnClick('cancel')}
                        onOk={() => onPrivacyPolicyBtnClick('ok')}>
                        <PrivacyPolicy />
                    </Modal>
                </SUInner1440>

            </S.Section9>
        </S.MainWrap >
    )
}
