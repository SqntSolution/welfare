import { Button, Checkbox, Col, Divider, Flex, Image, Input, Row, Spin, Modal, Layout, Radio, App, Form, Typography, Space, InputNumber, Table, Descriptions } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import styled from 'styled-components';
import { PaperClipOutlined } from '@ant-design/icons';


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
        const fetchData = async () => {
            await getData(
                {
                    params:
                    {

                    }
                },
                '');
        }
        fetchData();
    }, []);


    // 게시판 데이터 조회
    const getData = async (params, successCallback) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/cs/bbs/${id}`, params)
            .then((resp) => {
                setData(resp?.data);
                setInitialFileList(resp?.data?.attachedFileList);
                setTextData(resp?.data?.contents);
                if (successCallback) successCallback();
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                error(err);
            });
    };

    const title = () => {
        return (
            <>
                <Typography.Title level={4}
                    style={{
                        height: 64,
                        fontSize: 24,
                        fontWeight: 500,
                        margin: 0,
                        padding: '16px 8px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >{menu2?.toUpperCase()}</Typography.Title>
            </>
        );
    }

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
        <Spin spinning={loading}>
            <div style={{ width: 1240, minWidth: '475px', margin: '0 auto' }}>
                <StyledBorderDetailTable title={title()} bordered
                    labelStyle={{ width: 140, background: '#FAFAFA', color: 'rgba(0, 0, 0, 0.85)' }}
                    style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
                >
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
                        >
                            {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                        </TheCkeditor>
                    </Descriptions.Item>
                </StyledBorderDetailTable>
            </div>

            <div style={{ textAlign: 'right', width: 1240, minWidth: '475px', margin: '16px auto 0' }}>
                <NavLink to={`/main/${menu1}/${menu2}`}>
                    <Button type='primary' size='large' style={{ width: 114 }}>목록으로</Button>
                </NavLink>
            </div>
        </Spin>
    );
}

const StyledBorderDetailTable = styled(Descriptions)`
.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border:0;}
`;