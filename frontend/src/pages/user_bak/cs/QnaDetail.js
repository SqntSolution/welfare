import { Button, Checkbox, Col, Divider, Flex, Image, Input, Row, Spin, Modal, Layout, Radio, Form, App, Typography, InputNumber, Space, Descriptions, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, Route, Switch, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, useNavigate, NavLink } from "react-router-dom";
import { FileUpload } from 'components/common/FileUpload';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import styled from 'styled-components';

export const QnaDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { menu1, menu2, id } = useParams();
    const { error, info } = useMsg();

    const [data, setData] = useState();
    const [textData, setTextData] = useState(); //문의 내용
    const [textData2, setTextData2] = useState(); //답변 내용
    const [loading, setLoading] = useState(false);
    const [readonly, setReadonly] = useState(false);

    //파일 관련
    const [initialFileList, setInitialFileList] = useState([]);

    useEffect(() => {
        setReadonly(location?.state?.readonly ?? true);
        const fetchData = async () => {
            if (id) {
                await getData('get',
                    {
                        params:
                        {

                        }
                    },
                    '');
            }
        }
        fetchData();
    }, []);


    // 게시판 상세 데이터 조회[get], 수정[post], 삭제[delete]
    const getData = async (type, params, successCallback) => {
        setLoading(true);
        await AXIOS[type](`/api/v1/user/cs/qna/${id}`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                setInitialFileList(resp?.data?.attachedFileList ?? []);
                setTextData(resp?.data?.contents ?? '');
                setTextData2(resp?.data?.responseContents ?? '');
                if (successCallback) {
                    setTimeout(() => {
                        successCallback();
                    }, 1000)
                }
                setLoading(false);
                if (type === 'delete') info('게시글이 삭제 되었습니다.');
            })
            .catch((err) => {
                error(err)
                setLoading(false);
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
                >Q&A</Typography.Title>
            </>
        );
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
                    <div>
                        Loading...
                    </div>
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
                            readOnly={readonly}

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
                            setData={setTextData}
                            readonly={readonly}
                            setReadonly={setReadonly}
                        >
                        </TheCkeditor>
                    </Descriptions.Item>

                </StyledBorderDetailTable>
                {data?.responseYn ?
                    <StyledBorderDetailTable
                        title={'답변'} bordered
                        labelStyle={{ width: 140, background: '#FAFAFA', color: 'rgba(0, 0, 0, 0.85)' }}
                        style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 14, marginTop: 44 }}
                    >
                        <>
                            <Descriptions.Item label={'답변 일시'} span={3}><NoticeDataSet param='responseAt' /></Descriptions.Item>
                            <Descriptions.Item label={'답변자'} span={3}><NoticeDataSet param='responseUserNm' /></Descriptions.Item>
                            <Descriptions.Item label={'답변 내용'} span={3}>
                                <TheCkeditor
                                    data={textData2}
                                    setData={setTextData2}
                                    readonly={readonly}
                                    setReadonly={setReadonly}
                                    style={{ padding: 0 }}
                                >
                                </TheCkeditor>
                            </Descriptions.Item>
                        </>
                    </StyledBorderDetailTable>
                    : null
                }
            </div>
            <Flex style={{ textAlign: 'right', width: 1240, minWidth: '475px', margin: '16px auto 0' }} justify={'flex-end'} gap="small">
                <NavLink to={`/main/${menu1}/${menu2}`}>
                    <Button type='primary' size='large' style={{ width: 114 }}>
                        목록으로
                    </Button>
                </NavLink>
                {data?.responseYn ?
                    <Popconfirm
                        title='해당 게시물을 삭제 하시겠습니까?'
                        description=''
                        okText='삭제'
                        cancelText='취소'
                        onConfirm={() => getData('delete', { params: {} }, () => navigate(-1))}
                    >
                        <Button size='large' style={{ width: 114 }}>
                            삭제하기
                        </Button>
                    </Popconfirm>
                    :
                    <>
                        <Button size='large' style={{ width: 114 }} onClick={() => navigate(`/main/${menu1}/${menu2}/qnainquiry`, { state: { id: id } })}>
                            수정하기
                        </Button>
                    </>
                }
            </Flex>
        </Spin>
    );
}


const StyledBorderDetailTable = styled(Descriptions)`
.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border:0;}
& .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){padding: 0;}
`;