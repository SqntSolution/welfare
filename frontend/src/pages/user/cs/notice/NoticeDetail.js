import { Button, Spin, Typography, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import styled, { css } from 'styled-components';
import { SUInner1280 } from 'styles/StyledUser';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { SComLinkBtn } from 'styles/StyledCommon';
import { SFEm, SFMedia } from 'styles/StyledFuntion';


export const NoticeDetail = () => {

    const { menu1, menu2, id } = useParams();
    const { error, info } = useMsg();

    //파일첨부 관련
    const [initialFileList, setInitialFileList] = useState([]);
    const [textData, setTextData] = useState();

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [readonly, setReadonly] = useState(true);

    useEffect(() => {
        getData();
    }, []);


    // 게시판 데이터 조회
    const getData = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/bbs/${id}`)
            .then((resp) => {
                const data = resp?.data;
                setData(data);
                setInitialFileList(data?.attachedFileList);
                setTextData(data?.contents);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                error(err);
            });
    };

    // //세부 공지사항 글 정보 매핑 함수
    const NoticeDataSet = ({ param }) => {
        return (
            <>
                {data ? (
                    <div>
                        {data[param]}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </>
        );
    };


    return (
        <NoticeDetailSection>
            <SUInner1280>
                <LoadingSpinner loading={loading} size={'small'}>
                    <div >
                        <Descriptions bordered>
                            <Descriptions.Item label={'제목'} span={3}> <NoticeDataSet param='title' /></Descriptions.Item>
                            <Descriptions.Item label={'등록일시'} span={3}> <NoticeDataSet param='createdAt' /></Descriptions.Item>
                            <Descriptions.Item label={'작성자'} span={3}><NoticeDataSet param='createUserNm' /></Descriptions.Item>
                            <Descriptions.Item label={'조회수'} span={3}><NoticeDataSet param='viewCnt' /></Descriptions.Item>
                            <Descriptions.Item label={'파일'} span={3}>
                                {initialFileList?.length !== 0 ? <FileUpload
                                    readOnly={readonly}

                                    initialFileList={initialFileList}
                                />
                                    :
                                    <>
                                        -
                                    </>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label={'내용'} span={3}>
                                <TheCkeditor
                                    data={textData}
                                    setData={setTextData}
                                    readonly={readonly}
                                    setReadonly={setReadonly}
                                    borderColor={'#fff'}
                                >
                                </TheCkeditor>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div className='btn-wrap'>
                        <SComLinkBtn to={`/cs-center/notice`} variant="solid" color="primary" >목록으로</SComLinkBtn>
                    </div>
                </LoadingSpinner>
            </SUInner1280>
        </NoticeDetailSection>
    );
}

const NoticeDetailSection = styled.section`
font-size: ${SFEm(14)};
.btn-wrap{
    margin-top: ${SFEm(45, 14)};
    text-align: center;
}

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
${SFMedia('mo-l', css`
    .ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-label,
    .ant-descriptions.ant-descriptions-bordered >.ant-descriptions-view .ant-descriptions-row >.ant-descriptions-item-content{padding: ${SFEm(8, 14)} ${SFEm(16, 14)};}
    .ant-descriptions-item-label{
    min-width: ${SFEm(100, 14)};
    width: ${SFEm(100, 14)};
}
`)};
`;