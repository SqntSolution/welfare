import { Button, Spin, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, NavLink } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { TheCkeditor } from 'components/common/TheCkeditor';
import styled from 'styled-components';


export const FaqDetail = () => {

    const { menu1, menu2, id } = useParams();
    const { error, info } = useMsg();

    const [data, setData] = useState();
    const [readonly, setReadonly] = useState(true);
    const [loading, setLoading] = useState(false);
    const [textData, setTextData] = useState();

    useEffect(() => {
        getData();
    }, []);


    // 게시판 데이터 조회
    const getData = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/bbs/${id}`)
            .then((resp) => {
                setData(resp?.data);
                setTextData(resp?.data?.contents);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };



    //세부 공지사항 글 정보 매핑 함수
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
        <Spin spinning={loading}>
            <div style={{ width: 1240, minWidth: '475px', margin: '0 auto' }}>
                <StyledBorderDetailTable bordered
                    styles={{ label: { width: 140, background: '#FAFAFA', color: 'rgba(0, 0, 0, 0.85)' } }}
                    style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                >
                    <Descriptions.Item label={'제목'} span={3}><NoticeDataSet data={data} param='title' /></Descriptions.Item>
                    <Descriptions.Item label={'등록일시'} span={3}><NoticeDataSet data={data} param='createdAt' /></Descriptions.Item>
                    <Descriptions.Item label={'작성자'} span={3}><NoticeDataSet data={data} param='createUserNm' /></Descriptions.Item>
                    <Descriptions.Item label={'조회수'} span={3}><NoticeDataSet data={data} param='viewCnt' /></Descriptions.Item>
                    <Descriptions.Item label={'구분'} span={3}><NoticeDataSet data={data} param='metaDivisionNm' /></Descriptions.Item>
                    <Descriptions.Item label={'내용'} span={3}>
                        <TheCkeditor
                            data={textData}
                            setData={setTextData}
                            // setData={(value) => {
                            //     console.log('value : ' , value);
                            //     form?.setFieldsValue({ contents: value });
                            // }}
                            readonly={readonly}
                            setReadonly={setReadonly}
                        >
                            {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                        </TheCkeditor>
                    </Descriptions.Item>
                </StyledBorderDetailTable>
            </div>

            <div style={{ textAlign: 'right', width: 1240, minWidth: '475px', margin: '16px auto 0' }}>
                <NavLink to={`/${menu1}/${menu2}`}>
                    <Button type='primary' size='large' style={{ width: 114 }} >목록으로</Button>
                </NavLink>
            </div>
        </Spin>
    );
}


const StyledBorderDetailTable = styled(Descriptions)`
.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border:0;}
`;