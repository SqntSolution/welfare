import { ConfigProvider } from 'antd';
import { deviceInfoState } from 'atoms/atom';
import { PopupModalOpener } from 'components/common/PopupModalOpener';
import Footer from 'components/user/Footer';
import { Header } from 'components/user/Header';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled, { css } from 'styled-components';
import { getBreakpoints, mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { updateMetaTags } from 'utils/seo';

const MainLayout = () => {
    const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
    const location = useLocation();

    useEffect(() => {
        document.title = 'Elorien';
        const breakpoint = getBreakpoints();

        const mqlList = breakpoint?.map(bp => ({
            mql: window.matchMedia(bp.query),
            info: bp.info,
        }));

        // deviceInfo 계산 함수
        const handler = () => {
            for (const { mql, info } of mqlList) {
                if (mql.matches) {
                    if (deviceInfo !== info) {
                        setDeviceInfo(info);
                        break;
                    }
                }
            }
        };

        handler();
        mqlList.forEach(({ mql }) => mql.addEventListener('change', handler));
        return () => {
            mqlList.forEach(({ mql }) => mql.removeEventListener('change', handler));
        };

    }, []);

    useEffect(() => {
        if (!location.pathname.startsWith('/post')) {
            updateMetaTags({});
        }
    }, [location.pathname])

    return (

        <ConfigProvider
            theme={{
                token: {
                    "colorTextBase": "#181D27",
                    "wireframe": false,
                    "colorPrimary": "#BB3A0B",
                    "colorLinkHover": '#EA9B66',
                    "colorLinkActive": "#BB3A0B",
                    "fontFamily": ['Pretendard', 'system-ui'],
                    breakpoints: {
                        borderRadius: 8,
                        fontSize: 16,
                        screenXS: mediaWidth['mo-s'],
                        screenSM: mediaWidth['mo-m'],
                        screenMD: mediaWidth['mo-l'],
                        screenLG: mediaWidth['tab-l'],
                        screenXL: mediaWidth['pc-s'],
                        screenXXL: mediaWidth['pc-m'],
                    }
                },
                components: {
                    Layout: {
                    },
                    Input: {
                        borderRadius: 8,
                        colorBorder: "#D5D7DA",
                        fontWeightStrong: 400
                    },
                    Form: {
                        labelColor: '#414651',
                    },
                    Typography: {
                        fontSizeHeading1: 60,
                        fontSizeHeading2: 48,
                        fontSizeHeading3: 36,
                        fontSizeHeading4: 30,
                        fontSizeHeading5: 24,
                        lineHeightHeading1: 1.2,
                        lineHeightHeading2: 1.6666666667,
                        lineHeightHeading3: 1.2222222222,
                        lineHeightHeading4: 1.2666666667,
                        lineHeightHeading5: 1.3333333333,
                    },
                    Table: {
                        headerBg: '#FAFAFA',
                        headerColor: '#717680'
                    }
                },
            }}
        >
            <Header />
            <MainStyled style={{}}>
                <PopupModalOpener key={`pop-${location.key}`} />
                <Outlet key={location.key} />
            </MainStyled>
            <Footer />
        </ConfigProvider >

    );
};

export default MainLayout;


const MainStyled = styled.main`
padding-top: ${SFEm(90)};
${SFMedia('mo-l', css`
    padding-top: ${SFEm(82)}
`)};
`