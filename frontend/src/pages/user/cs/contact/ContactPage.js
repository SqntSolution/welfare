/**
 * @file ContactPage.js
 * @description 고객센터 - 담당자 안내
 * @author 이병은
 * @since 2025-06-12 14:07
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * --------------   ---------------------------------------------
 * 2025-06-12 14:07    이병은       최초 생성
 **/

import { Avatar, Flex, Spin } from 'antd'
import { useMsg } from 'hooks/helperHook'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SUBoardHeader, SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows, SUPointText, SUTabel, SUText16 } from 'styles/StyledUser'
import qs from 'qs'
import { AXIOS } from 'utils/axios'
import styled, { css } from 'styled-components'
import { UserOutlined } from '@ant-design/icons'
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion'
import LoadingSpinner from 'components/common/LoadingSpinner'


const tempdata = [
    {
        id: 1,
        division: '창호시스템도어',
        description: '건설사 창호 문의',
        name: '임태진',
        grade: '매니저',
        mail: 'dlaxowls@xowls.com',
        phone: '010-1234-5678',
        profileImg: '',
    },
    {
        id: 2,
        division: '창호시스템도어',
        description: '일반주택 창호 문의',
        name: '손민',
        grade: '매니저',
        mail: 'thsals@thsals.com',
        phone: '010-1234-5678',
        profileImg: '',
    },
    {
        id: 3,
        division: 'SQNT라움',
        description: '',
        name: '양명준',
        grade: '매니저',
        mail: 'didaudwns@didaudwns.com',
        phone: '010-1234-5678',
        profileImg: '',
    },
    {
        id: 4,
        division: '태양광 창호',
        description: '',
        name: '양병인',
        grade: '매니저',
        mail: 'didquddls@didquddls.com',
        phone: '010-1234-5678',
        profileImg: '',
    },
    {
        id: 5,
        division: '기타',
        description: '해외지사 및 법인',
        name: '한지원',
        grade: '매니저',
        mail: 'gkswldnjs@gkswldnjs.com',
        phone: '010-1234-5678',
        profileImg: '',
    },

]

const ContactPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { error, info } = useMsg();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();

    const menu1 = 'cs-center';
    const menu2 = 'contact';

    // useEffect(() => {
    //     getData()
    // }, [location.search]);


    // // 게시판 데이터 조회
    // const getData = async () => {
    //     setLoading(true);
    //     const params = {
    //         pageNumber: Number(ofqs?.page ?? 1) - 1,
    //         pageSize: ofqs?.size ?? 10,
    //         metaDivision: ofqs?.metaDivision,
    //         keyword: ofqs?.keyword
    //     }
    //     await AXIOS.get(`/api/v1/user/cs/bbs/${menu2}`, { params })
    //         .then((resp) => {
    //             setData(resp?.data);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             error(err);
    //             setLoading(false);
    //         });
    // };

    const columns = [
        {
            title: '분류',
            dataIndex: 'division',
            key: 'division',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <>
                        <div className='division-title'><b>{text}</b></div>
                        <div className='division-description'>{record.description ?? ''}</div>
                    </>
                )
            }),
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: ((text, record) => {
                return (
                    <Flex className='name-box' gap={8} align='center'>
                        <Avatar icon={<UserOutlined />} className='profile' size={40} />
                        <div className='name-info'>
                            <div className='name'>{text}</div>
                            <div className='grade'>{record.grade}</div>
                        </div>
                    </Flex>
                )
            }),
        },
        {
            title: '이메일',
            dataIndex: 'mail',
            key: 'mail',
            ellipsis: true,
        },
        {
            title: '전화번호',
            dataIndex: 'phone',
            key: 'phone',
            ellipsis: true,
        },
    ];


    // 폐이징처리  
    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ page: page, size: pageSize })}`);
    };

    return (
        <ContactSection>
            <SUInner1280>
                <LoadingSpinner loading={loading}>
                    <SUBoardHeaderWrap >
                        <SUBoardHeader
                            title={'고객님을 위한 편의공간입니다.'}
                            description={'SQNT에 문의사항이나 불편한 점이 있으시면 언제든지 고객센터를 이용해 주세요.'}
                        />
                        <div className='contact-header-right'>
                            <SUText16>SQNT 서비스센터</SUText16>
                            <SUPointText>02-2086-1300 (주중 09:00 - 18:00)</SUPointText>
                        </div>
                    </SUBoardHeaderWrap>

                    <SUTabel
                        columns={columns}
                        rowKey={(record) => record?.id}
                        dataSource={tempdata ?? []}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        size="small"
                    />
                    <SUPaginationWithArrows
                        onChange={handlePageChange}
                        current={Number(data?.number ?? 0) + 1}
                        // pageSize={data?.pageSize ?? 10}
                        pageSize={tempdata?.size ?? 10}
                        // total={data?.totalElements}
                        total={tempdata?.size}
                        position={'bottomCenter'}
                        showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                        showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                    />
                </LoadingSpinner>
            </SUInner1280>
        </ContactSection>
    )
}
export default ContactPage;

const ContactSection = styled.section`
    font-size: 16px;
    .section-header{
        min-height: ${SFEm(64)};
        margin-bottom: ${SFEm(16)};
        .ant-col:first-child  > div{
            margin-bottom: 0;
        }
        & > .ant-col[align=right]{
            & > div{
                width: fit-content;
                text-align: left;
            }
            p{
                font-weight: 500;
                color: #181D27;
            }
            span{
                font-size: ${SFEm(14)};
                font-weight: 300 ;
                display: block;
                margin-top: ${SFEm(8, 14)};
            }
        }
    }
    .contact-header-right{
        text-align: right;
    }
${SFMedia('mo-l', css`
    font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;