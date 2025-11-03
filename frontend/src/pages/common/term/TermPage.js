/**
 * @file TermPage.js
 * @description 약관
 * @author 김정규
 * @since 2025-05-29 11:00
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-29 11:00    김정규       최초 생성
 **/
import { Button, Checkbox, Divider, Flex, Space, Spin, Typography } from 'antd';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUInner1280, SUPointText, SUSectionHeader, SUSectionText, SUText48 } from 'styles/StyledUser';
import { AXIOS } from 'utils/axios';

const { Title, Paragraph } = Typography;

const TermPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { info, error } = useMsg()
    const [data, setData] = useState([])
    const [term, setTerm] = useState([]);

    useEffect(() => {
        getTerm()
    }, [])

    const getTerm = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/term/terms`)
            .then((res) => {
                const resp = res?.data
                setData(resp || [])
                setLoading(false)
            })
            .catch((err) => {
                error(err, 10)
                setLoading(false)
            })
    }

    const onCheckboxChange = (itemId, checked) => {
        setTerm(prev => {
            const exists = prev.some(item => item.id === itemId);
            if (exists) {
                // id가 이미 있으면 덮어쓰기
                return prev.map(item =>
                    item.id === itemId ? { id: itemId, ck: checked } : item
                );
            } else {
                // 없으면 새로 추가
                return [...prev, { id: itemId, ck: checked }];
            }
        });
    };

    // 모든 필수 항목이 체크되었는지 확인
    const isAllTermsAccepted = () => {
        return data.length > 0 && data.every(item =>
            term.some(termItem => termItem.id === item.id && termItem.ck === true)
        );
    };

    const onFinish = (v) => {
        if (isAllTermsAccepted()) {
            setTimeout(() => navigate(`/login/re`, { state: { token: term } }), 1000)
        } else {
            info('약관에 동의해주세요.')
        }
    }

    return (
        <TermsSection>
            <SUInner1280>
                <SUSectionHeader className='section-header'>
                    <SUText48>이용약관 동의</SUText48>
                    <SUSectionText>
                        SQNT는 고객님의 개인정보를 소중하게 생각합니다. <br />
                        저희 웹사이트를 통해 수집되는 모든 정보는 관련 법률을 준수하여 안전하게 보호됩니다.
                    </SUSectionText>
                </SUSectionHeader>
                {/* <Title level={2}>약관 안내</Title> */}
                <LoadingSpinner loading={loading}>
                    <div className='term-inner'>
                        <div>
                            {data.map((item, index) => (
                                <div key={index}>
                                    <div className='terms-box'>
                                        <Title level={4}>{item.title}</Title>
                                        <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                    </div>
                                    <Checkbox
                                        onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
                                        checked={term.some(termItem => termItem.id === item.id && termItem.ck === true)}
                                    >
                                        <span style={{ color: '#ff4d4f' }}>*</span> 이용약관 동의 (필수)
                                    </Checkbox>
                                </div>
                            ))}
                        </div>

                        <Flex justify='center' align='center' className='btn-wrap'>
                            <Space>
                                <Button onClick={() => navigate(-1)}>취소</Button>
                                <Button
                                    type="primary"
                                    onClick={onFinish}
                                    loading={loading}
                                    disabled={!isAllTermsAccepted()}
                                >
                                    다음
                                </Button>
                            </Space>
                        </Flex>
                    </div>
                </LoadingSpinner>
            </SUInner1280>
        </ TermsSection>
    );
};

export default TermPage;

const TermsSection = styled.section`
    &{padding-bottom:${SFEm(90)}}
    .section-header{
        text-align: center;
    }
    .terms-box{
        width: 100%;
        max-height: ${SFEm(480)};
        overflow-y: auto;
        border: 1px solid #E9EAEB;
        padding: ${SFEm(24)} ${SFEm(16)};
        border-radius: ${SFEm(15)};
        margin-bottom: ${SFEm(24)};
    }
    .term-inner{
        max-width: ${SFEm(1000)};
        width: 95%;
        margin: 0 auto ${SFEm(24)};
    }
    .terms-box{
        margin-top: ${SFEm(8)};
    }

${SFMedia('mo-l', css`
    &,[class |= ant]{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
`)};

`;