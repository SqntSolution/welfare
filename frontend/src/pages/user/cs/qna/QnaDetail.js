import { Button, Flex, Spin, Descriptions, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import styled, { css } from 'styled-components';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { SUInner1280, SUText18, SUText20, SUText24 } from 'styles/StyledUser';
import { SFEm, SFMedia } from 'styles/StyledFuntion';
import { useUserInfo } from 'hooks/useUserInfo';

export const QnaDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { error, info } = useMsg();

    const [data, setData] = useState();
    const [textData, setTextData] = useState(); //문의 내용
    const [textData2, setTextData2] = useState(); //답변 내용
    const [loading, setLoading] = useState(false);
    const [isEditAuth, setIsEditAuth] = useState(false);
    const userInfo = useUserInfo();

    const menu1 = 'cs-center';
    const menu2 = 'qna';

    //파일 관련
    const [initialFileList, setInitialFileList] = useState([]);

    useEffect(() => {
        getData();
    }, []);


    // 게시판 상세 데이터 조회[get], 수정[post], 삭제[delete]
    const getData = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/qna/${id}`)
            .then((resp) => {
                const data = resp?.data;
                setData(data);
                setInitialFileList(data?.attachedFileList ?? []);
                setTextData(data?.contents ?? '');
                setTextData2(data?.responseContents ?? '');
                setLoading(false);
                setIsEditAuth(data.createdUserId === userInfo.id && userInfo.role !== 'ROLE_VISITOR');
            })
            .catch((err) => {
                error(err)
                setLoading(false);
            });
    };

    const deleteData = async () => {
        setLoading(true);
        if (!isEditAuth) {
            error('삭제 권한이 없습니다.');
            setLoading(false);
            return;
        }

        await AXIOS.post(`/api/v1/user/cs/qna/${id}`)
            .then(() => {
                info('게시글이 삭제 되었습니다.');
                setTimeout(() => {
                    navigate('/cs-center/qna');
                }, 1000)
                setLoading(false);
            }).catch((err => {
                error(err);
                setLoading(false);
            }))
    }


    //세부 공지사항 글 정보 매핑 함수
    const NoticeDataSet = ({ param }) => {
        return (
            <>
                {data ? (
                    <div>
                        {data[param]}
                    </div>
                ) : (
                    <div>
                        Loading...
                    </div>
                )}
            </>
        );
    };


    return (
        <QnaSection>
            <LoadingSpinner loading={loading}>
                <SUInner1280>
                    <Descriptions bordered >
                        <Descriptions.Item label={'제목'} span={3}> <NoticeDataSet param='title' /></Descriptions.Item>
                        <Descriptions.Item label={'등록일시'} span={3}> <NoticeDataSet param='createdAt' /></Descriptions.Item>
                        <Descriptions.Item label={'작성자'} span={3}> <NoticeDataSet param='createUserNm' /></Descriptions.Item>
                        <Descriptions.Item label={'조회수'} span={3}> <NoticeDataSet param='viewCnt' /></Descriptions.Item>
                        <Descriptions.Item label={'공개여부'} span={3}> {data?.opened ? '공개' : '비공개'}</Descriptions.Item>
                        <Descriptions.Item label={'구분'} span={3}> <NoticeDataSet param='metaDivisionNm' /></Descriptions.Item>
                        <Descriptions.Item label={'상태'} span={3}>
                            {data?.responseYn ? '답변 완료' : '문의 접수'}
                            <NoticeDataSet param='responseYn' />
                        </Descriptions.Item>
                        <Descriptions.Item label={'파일'} span={3}>
                            {initialFileList?.length !== 0 ? <FileUpload
                                readOnly={true}

                                initialFileList={initialFileList}
                            />
                                :
                                <>
                                    -
                                </>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label={'문의 내용'} span={3}>
                            <TheCkeditor
                                data={textData}
                                readonly={true}
                            >
                            </TheCkeditor>
                        </Descriptions.Item>

                    </Descriptions>
                    {data?.responseYn ?
                        <>
                            <SUText20 $weight={'bold'} style={{ marginTop: SFEm(50, 20), marginBottom: SFEm(14, 20) }} > 답변</SUText20>
                            <Descriptions bordered
                            // title={'답변'}
                            >
                                <>
                                    <Descriptions.Item label={'답변 일시'} span={3}><NoticeDataSet param='responseAt' /></Descriptions.Item>
                                    <Descriptions.Item label={'답변자'} span={3}><NoticeDataSet param='responseUserNm' /></Descriptions.Item>
                                    <Descriptions.Item label={'답변 내용'} span={3}>
                                        <TheCkeditor
                                            data={textData2}
                                            readonly={true}
                                            style={{ padding: 0 }}
                                        >
                                        </TheCkeditor>
                                    </Descriptions.Item>
                                </>
                            </Descriptions>
                        </>
                        : null
                    }
                    <Flex style={{ margin: '1em auto 0' }} justify={'center'} gap="small">
                        <NavLink to={`/${menu1}/${menu2}`}>
                            <Button type='primary' >
                                목록으로
                            </Button>
                        </NavLink>
                        {userInfo.role !== 'ROLE_VISITOR' && isEditAuth &&
                            (data?.responseYn ?
                                <Popconfirm
                                    title='해당 게시물을 삭제 하시겠습니까?'
                                    description=''
                                    okText='삭제'
                                    cancelText='취소'
                                    onConfirm={() => deleteData()}
                                >
                                    <Button>
                                        삭제하기
                                    </Button>
                                </Popconfirm>
                                : isEditAuth &&
                                <>
                                    <Button onClick={() => navigate(`/cs-center/qna/edit/${id}`)}>
                                        수정하기
                                    </Button>
                                </>)
                        }
                    </Flex>
                </SUInner1280>
            </LoadingSpinner>
        </QnaSection >
    );
}


const QnaSection = styled.section`
font-size: ${SFEm(14)};

.ant-descriptions-item-label{
    min-width: ${SFEm(140, 14)};
    width: ${SFEm(140, 14)};
}
[class |= ant] , [class |= ant]   * {
    font-size: inherit
};
.ant-upload-wrapper .ant-upload-list .ant-upload-list-item{
    margin-top: 0;
     & + .ant-upload-list-item{
        margin-top: 0.5em;
     }
}
.ck-blurred{    border: 0 !important;}
${SFMedia('mo-l', css`
    .ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-label,
    .ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-content{padding: ${SFEm(8, 14)} ${SFEm(16, 14)};}
    .ant-descriptions-item-label{
    min-width: ${SFEm(100, 14)};
    width: ${SFEm(100, 14)};
}
`)};

`;