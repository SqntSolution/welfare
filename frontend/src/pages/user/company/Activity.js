/**
 * @file Activity.js
 * @description 회사 소개 활동 서브페이지
 * @author 김단아
 * @since 2025-06-02 15:32
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-02 15:32    김단아       최초 생성
 **/

import { Divider, Flex } from 'antd'
import CardItem from 'components/user/CardItem'
import styled, { css } from 'styled-components'
import { MotionFadeUp } from 'styles/Animations'
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion'
import { SUInner1280, SUPaginationWithArrows, SUSectionText, SUText36 } from 'styles/StyledUser'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6"
import { useRecoilValue } from 'recoil'
import { deviceInfoState } from 'atoms/atom'
const Activity = () => {
    const deviceInfo = useRecoilValue(deviceInfoState);
    const carditemArr = [
        {
            img: 'activity_img1.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img2.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img3.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img4.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img5.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img6.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img7.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img8.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
        {
            img: 'activity_img9.png',
            label: '엘로리언음악회',
            title: '제 30회 엘로리언음악회(2019)-베를린 필하모닉 엘로리언앙상블',
            date: '2025.04.09',
            to: '',
        },
    ]
    return (
        <ActivitySection>
            <MotionFadeUp className="story">
                <SUText36>음악으로 전하는 감동과 희망의 이야기</SUText36>
                <SUSectionText>
                    엘로리언(Elorien)은사회와의 소통과 동반성장을 목표로 다양한 사회공헌활동을 진행하고 있습니다. <br />
                    그중 대표활동인 '엘로리언음악회'는 음악을 통한 감동과 희망의 메시지를 사회와 공유하고자 시작한 활동입니다. <br />
                    <br />
                    음악회의 첫 시작은 인천의 엘로리언산업 공장에 소박하게 준비된 무대에서 시작되었습니다. <br />
                    <br />
                    당시, 초청연주자였던 '프라하아카데미아 목관5중주단의 청아하고 아름다운 연주는 공연에 참석했던 많은 사람들에게 <br />
                    '아름다운 연주로 힐링의 시간이었고 긍정의 힘을 얻게 되었다는 평을 받았습니다. <br />
                    <br />
                    이 후, 엘로리언음악회는 초심을 잃지 않고 사회에 감동과 희망의 메시지를 꾸준히 선사하고자 노력했습니다. <br />
                    그 결과, 웬델 브루니어스재즈밴드 7회, 베를린 필하모닉 카메라타 26회, 베를린 필하모닉 엘로리언앙상블 30회 등 엘로리언이 추구하고자하는 사회적 가치에 교감한 세계적인 음악가들이 함께해주었고, 덕분에 다양한 장르의 수준 높은 공연을 전국 주요도시를 순회하며, 33년째 무료로 많은 분들께 선보일 수 있었습니다. <br />
                    <br />
                    어려운 시기에도 한 회도 거르지 않고 30년 넘게 이어져온 지속성과 상업성을 배제한 '순수함', 그리고 엘로리언의 직원들이 문화나눔을 위해, 직접 기획·운영하는 '진심'은 엘로리언음악회가 늘 마음속에 간직하고자하는 중요한 가치입니다. <br />
                    <br />
                    엘로리언 가족들은 예술로 삶을 변화시킬 수 있다는 믿음을 바탕으로, 앞으로도 꾸준히 청중들께 음악의 아름다움을 선사하고 진정성 있는 공연으로 더 큰 감동을 전해드릴 것을 약속드립니다.
                </SUSectionText>
            </MotionFadeUp>

            <MotionFadeUp className='card-list'>
                {
                    carditemArr.map((item, num) => (
                        <CardItem
                            key={num}
                            img={`/img/sample/company/${item.img}`}
                            label={item.label}
                            title={item.title}
                            text={item.date}
                            to={item.to}
                        />
                    ))
                }
            </MotionFadeUp>
            <Divider />
            <SUPaginationWithArrows
                total={carditemArr?.length}
                pageSize={deviceInfo?.device !== 'pc' ? 40 : 10}
                showSizeChanger={false}
                align={'center'}
            />
        </ActivitySection>
    )
}
export default Activity;


const ActivitySection = styled.section`
    font-size: 16px;
    padding-top: var(--gap);
    .story{
        max-width: ${(SFEm(768))};
        width: 95%;
        margin: 0 auto;
        .text-36 {
            margin-bottom: ${SFEm(20, 36)};
        }
    }

    .card-list{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${SFEm(48, 16)} ${SFEm(32, 16)};
        margin: ${SFEm(64, 16)} auto;
    }
    .card-list > div{
        min-width: 0;
    }
    .card-box:hover{
        text-decoration: underline;
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};

${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    .card-list{
        grid-template-columns: repeat(2, 1fr);
    }
`)};
${SFMedia('mo-m', css`
    .card-list{
        grid-template-columns: repeat(1, 1fr);
    }
`)};
`;

