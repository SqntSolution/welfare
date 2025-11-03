import { useState, useEffect } from 'react';
import { Table, Button, Typography, Select, Tag, Modal, Card, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';

import dayjs from 'dayjs';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartToolTip, ResponsiveContainer } from 'recharts';

import { StyledAdminTable, StyledNavLink } from 'styles/StyledCommon';

import { iconHandle } from 'utils/helpers';
import styled from 'styled-components';

// import { getCellColorByType } from 'pages/admin/content/AdminContentConfig';

const { Text, Title } = Typography;

const DashBoardColors = {
    first: 'rgba(18, 36, 112, 1)',
    second: 'rgba(245, 247, 176, 1)'
    //     first: '#ff0000',
    //     second: '#000000'
};

const getCellColorByType = (typeValue) => {
    switch (typeValue) {
        //공개
        case 'public':
            return { color: 'purple', label: '공개' };
        //비공개
        case 'private':
            return { color: 'default', label: '비공개' };
        //임시저장
        case 'temp':
            return { color: 'orange', label: '임시' };
        case 'ask':
            return { color: 'green', label: '문의 접수' };
        case 'response':
            return { color: 'default', label: '문의 답변' };
        default:
            return '';
    }
};


//Admin DashBoard # of Visitors
export const DashBoardChartVisitorCount = (props) => {
    const [visitorCount, setVisitorCount] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState();
    const { queryType, extraCode } = props;
    const dateParam = dayjs();

    const { error, info } = useMsg();

    const getData = async (periodType) => {
        await AXIOS.get(`/api/v1/admin/dashboard/chart/visitor`, { params: { periodType: periodType } })
            .then((resp) => {
                const formattedData = resp?.data?.map((elem) => {
                    const date = dayjs(elem.date);
                    const startDate = dayjs(elem.periodStartDate);
                    const endDate = dayjs(elem.periodEndDate);
                    let formattedDate;
                    if (periodType === 'MONTHLY') {
                        formattedDate = date.format('YYYY-MM');
                    } else if (periodType === 'YEARLY') {
                        formattedDate = date.format('YYYY');
                    } else if (periodType === 'QUARTERLY') {
                        formattedDate = `${startDate.format('YYYY-MM')} ~ ${endDate.format('YYYY-MM')}`;
                    } else if (periodType === 'HALF') {
                        formattedDate = `${startDate.format('YYYY-MM')} ~ ${endDate.format('YYYY-MM')}`;
                    } else {
                        formattedDate = date.format('YYYY-MM-DD');
                    }
                    return { ...elem, date: formattedDate };
                });

                setVisitorCount(formattedData);
                // setIsLoading(false);
            })
            .catch((e) => {
                error(e);
                // setIsLoading(false);
            })
    };

    useEffect(() => {
        getData('DAILY');
    }, []);

    useEffect(() => {
        setTitle(queryType?.title);
    }, [queryType]);

    const handleSelectChange = (value, option) => { getData(value) };

    const extra = (
        <Select defaultValue="DAILY" onSelect={handleSelectChange} style={{ width: 110 }}>
            {extraCode?.map(item => (
                <Select.Option key={item.value} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    );

    return (
        <CustomCardforDashBoard title={title} extra={extra}>
            <ResponsiveContainer aspect={5}>
                <BarChart data={visitorCount}
                    margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey='date' tickLine={false} tick={{ fill: 'rgba(0, 0, 0, 0.85)' }} stroke='#ccc' />
                    <YAxis tickLine={false} tick={{ fill: 'rgba(0, 0, 0, 0.85)' }} stroke='#fff' />
                    <CartesianGrid stroke="rgba(0, 0, 0, 0.06)" vertical={false} />
                    <ChartToolTip
                        filter={true}
                        cursor={{ stroke: '#9254DE', strokeWidth: 1, fill: 'rgba(146, 84, 222, 1)', fillOpacity: 0.05 }}
                        wrapperStyle={{ width: 150, backgroundColor: '#fff' }}
                        formatter={(value, name, props) => {
                            const nameMap = queryType.barData.reduce((acc, item) => {
                                acc[item.dataKey] = item.label;
                                return acc;
                            }, {});
                            return [value + ' 명', nameMap[name]]
                        }}
                    />

                    {queryType?.barData?.map((query, idx) => (
                        <Bar key={`${query.dataKey}-${idx}`} dataKey={query.dataKey} fill={query.color} barSize={58} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </CustomCardforDashBoard>
    );
};


//Admin DashBoard # of Notice
export const DashBoardTableNotice = (props) => {
    const [noticeList, setNoticeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const { queryDate, queryHour, pageNo, pageSize } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);

    const showModal = (value) => {
        setIsModalOpen(value ?? false);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { error, info } = useMsg();

    const getData = async () => {
        await AXIOS.get(`/api/v1/admin/dashboard/list/notice`, { params: {} })
            .then((resp) => {
                const titleStr = 'Notice';
                // const noticeLimitList = Object.values(resp.data).slice(0, 5);
                setNoticeList(resp?.data);
                setTitle(titleStr);
                // setIsLoading(false);
            })
            .catch((e) => {
                error(e);
                // setIsLoading(false);
            })
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
    }, [fileList]);

    const fileDownloadModal = (item) => {
        // console.log('---======', item);
        setFileList(item?.fileList);
        showModal(true);
    };

    // Notice (columns)
    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '17%',
            align: 'left',
            render: (text, record, index) => (text.substr(0, 10))
        },
        {
            title: '파일',
            dataIndex: 'likesCnt',
            key: 'likesCnt',
            width: '6%',
            align: 'left',
            render: (text, record, index) => {
                return record.fileList.length > 0 ? <FileTextOutlined onClick={() => fileDownloadModal(record)} /> : <></>
            }
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            // width: '528px',
            align: 'left',
            ellipsis: true,
            render: (text, record, index) => <StyledNavLink to={`/cs-center/notice/${record.id}`}>{text}</StyledNavLink>
        },
        {
            title: '조회수',
            dataIndex: 'viewCnt',
            key: 'viewCnt',
            width: "9%",
            align: 'left',
        },
        {
            title: '공개',
            dataIndex: 'opened',
            key: 'opened',
            width: "9%",
            align: 'left',
            render: (text, record, index) => {
                return <Tag color={getCellColorByType(String(record.opened ? 'public' : 'private').toString()).color}>
                    {getCellColorByType(String(record.opened ? 'public' : 'private').toString()).label}
                </Tag>
            }
        },
    ];

    const fileSizeSI = (a) => {
        let b, c, d, e;
        return (b = Math, c = b.log, d = 1000, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2)
            + ' ' + (e ? 'KMGTPEZY'[--e] + 'B' : 'Bytes')
    };

    const fileTableColumns = [
        {
            title: <div style={{ textAlign: 'center' }}>No</div>,
            width: '10%',
            render: (text, record, index) => (fileList.length - index)
        },
        {
            title: <div style={{ textAlign: 'center' }}>파일명</div>,
            dataIndex: 'fileNm',
            key: 'fileNm',
            width: '60%',
            align: 'left',
            render: (text, record, index) => {
                return <Row gutter={1}>
                    <Col span={2}>
                        {iconHandle(record.fileExtension)}
                    </Col>
                    <Col span={22}>
                        <StyledNavLink onClick={() => window.open(record.downloadUrl)} >{text}</StyledNavLink>
                    </Col>
                </Row >
            }
        },
        {
            title: <div style={{ textAlign: 'center' }}>크기</div>,
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: '20%',
            align: 'right',
            render: (text, record) => fileSizeSI(record.fileSize)
        },
    ];

    return (
        <>
            <CustomCardforDashBoard title={title} toMore={'/cs-center/notice'} contentHeight={props.contentHeight}>
                <StyledAdminTable
                    rowKey={(row) => row?.id}
                    // loading={loading}
                    dataSource={noticeList ?? []}
                    size={'small'}
                    // style={{ width: 300 }}
                    indentSize={0}
                    title={() => <></>}
                    columns={columns}
                    pagination={
                        { position: ['none'] }
                    }
                />
            </CustomCardforDashBoard>

            {isModalOpen && <Modal
                title='파일 다운로드'
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                fileList={fileList}
                mask
                maskClosable
                destroyOnClose
                centered
                width={'38vw'}
            >
                <br />
                <div style={{ width: '100%' }}>
                    <Table
                        rowKey={(record) => record.fileId}
                        scroll={{ y: 400 }}
                        // style={{ width: '28vw', border: '1px solid red' }}
                        size={'small'}
                        columns={fileTableColumns}
                        dataSource={fileList}
                        pagination={false}
                    />
                </div>
            </Modal>}
        </>
    );
};

//Admin DashBoard # of QnA
export const DashBoardTableQnA = (props) => {
    const [qnaList, setQnaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const { buildingId, queryDate, queryHour, pageNo, pageSize } = props;
    const dateParam = dayjs();

    const { error, info } = useMsg();

    const getData = async () => {
        await AXIOS.get(`/api/v1/admin/dashboard/list/qna`, { params: {} })
            .then((resp) => {
                const titleStr = `Q&A`;
                setQnaList(resp?.data);
                setTitle(titleStr);
                // setIsLoading(false);
            })
            .catch((e) => {
                error(e);
                // setIsLoading(false);
            })
    };

    useEffect(() => {
        getData();
    }, []);

    // Q&A (columns)
    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'left',
            width: '16%',
            render: (text, record, index) => (<span style={{ whiteSpace: 'nowrap' }} >{text.substr(0, 10)}</span>)
        },
        {
            title: '구분',
            dataIndex: 'metaDivisionDesc',
            key: 'metaDivisionDesc',
            align: 'left',
            width: '13%',
            render: (text, record, index) => (<span style={{ whiteSpace: 'nowrap' }} >{text}</span>)
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            // width: 238,
            ellipsis: true,
            render: (text, record, index) => <StyledNavLink to={`/cs-center/qna/${record.id}`}>{text}</StyledNavLink>
        },
        {
            title: '조회수',
            dataIndex: 'viewCnt',
            key: 'viewCnt',
            align: 'left',
            width: '10%',
        },
        {
            title: '공개',
            dataIndex: 'opened',
            key: 'opened',
            align: 'left',
            width: '8%',
            render: (text, record, index) => {
                return <Tag color={getCellColorByType(String(record.opened ? 'public' : 'private').toString()).color}>
                    {getCellColorByType(String(record.opened ? 'public' : 'private').toString()).label}
                </Tag>
            }
        },
        {
            title: '상태',
            dataIndex: 'responseYn',
            key: 'responseYn',
            align: 'left',
            width: '11%',
            render: (text, record, index) => {
                return <Tag color={getCellColorByType(String(record.responseYn ? 'response' : 'ask').toString()).color}>
                    {getCellColorByType(String(record.responseYn ? 'response' : 'ask').toString()).label}
                </Tag>
            }
        },
    ];

    return (<CustomCardforDashBoard title={title} toMore={'/cs-center/qna'} contentHeight={props.contentHeight}>
        <StyledAdminTable
            rowKey={(row) => row?.id}
            // loading={loading}
            dataSource={qnaList}
            size={'small'}
            // style={{ width: 300 }}
            indentSize={0}
            columns={columns}
            title={() => <></>}
            pagination={
                { position: ['none'] }
            }
        />
    </CustomCardforDashBoard>
    );
};

//Admin DashBoard # of NewPost
export const DashBoardTableNewPost = (props) => {
    const [newPostList, setNewPostList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const { buildingId, queryDate, queryHour, pageNo, pageSize } = props;
    const dateParam = dayjs();

    const { error, info } = useMsg();

    const getData = async () => {
        await AXIOS.get(`/api/v1/admin/dashboard/list/post`, { params: {} })
            .then((resp) => {
                const titleStr = 'New Post';
                setNewPostList(resp?.data);
                setTitle(titleStr);
                // setIsLoading(false);
            })
            .catch((e) => {
                error(e);
                // setIsLoading(false);
            })
    };

    useEffect(() => {
        getData();
    }, [])

    // NewPost colums 
    const columns = [
        {
            title: '등록일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            align: 'left',
            render: (text, record, index) => (text.substr(0, 10))
        },
        // {
        //     title: '추천',
        //     dataIndex: 'recommend',
        //     key: 'recommend',
        //     width: '5%',
        // },
        {
            title: '카테고리 메뉴',
            dataIndex: 'category',
            key: 'category',
            width: '12% ',
            align: 'left',
            ellipsis: true,
            render: (text, record, index) => {
                return record?.menuName1 + ' > ' + record?.menuName2;
            },
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            align: 'left',
            ellipsis: true,
            render: (text, record, index) => <StyledNavLink to={`/post/${record.id}`}>{text}</StyledNavLink>
        },
        {
            title: '공개',
            dataIndex: 'openType',
            key: 'openType',
            width: '5%',
            align: 'left',
            render: (text, record, index) => {
                return <div style={{ textAlign: 'left' }}>
                    <Tag color={getCellColorByType(String(record.openType).toString()).color}>
                        {record.openTypeDesc.toString()}
                    </Tag>
                </div>
            }
        },
        {
            title: 'view',
            dataIndex: 'viewCnt',
            key: 'viewCnt',
            width: '4%',
            align: 'left',
        },
        {
            title: 'scrap',
            dataIndex: 'scrapCnt',
            key: 'scrapCnt',
            width: '4%',
            align: 'left',
        },
        {
            title: 'share',
            dataIndex: 'shareCnt',
            key: 'shareCnt',
            width: '4%',
            align: 'left',
        },
        {
            title: 'download',
            dataIndex: 'downloadCnt',
            key: 'downloadCnt',
            width: '7%',
            align: 'left',
        },
    ];

    return (
        <CustomCardforDashBoard title={title} toMore={''} contentHeight={props.contentHeight}>
            <StyledAdminTable
                rowKey={(row) => row?.id}
                // loading={loading}
                dataSource={newPostList}
                size={'small'}
                // style={{ width: 300 }}
                indentSize={0}
                columns={columns}
                pagination={
                    { position: ['none'] }
                }
            />
        </CustomCardforDashBoard>
    );
};

export const CustomCardforDashBoard = (props) => {
    const { opacity, extra, contentHeight } = props;
    const navigate = useNavigate();

    const handleClickMore = (to) => {
        navigate(to);
    };

    return (
        <Card
            variant={true}
            size='small'
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: "#fff",
                border: `0`,
            }}
            styles={{
                header: { opacity: opacity ?? 1, border: 0, borderRadius: '', minHeight: 34, padding: 0, marginBottom: 8 },
                body: { height: contentHeight ?? 'auto', backgroundColor: '#fff', opacity: 1, padding: 0, border: 0, borderRadius: 0, }
            }}
            title={<Row justify={'space-between'} align={'middle'}>
                <Title level={5} style={{ margin: 0, marginRight: 12, }}>{props?.title} </Title>
                {extra ? <div style={{ marginRight: 'auto' }}>{extra}</div> : <></>}
                {props.toMore ? <BtnMore onClick={() => handleClickMore(props.toMore)}>More</BtnMore>
                    : <></>}
            </Row>}
        >
            {props.children}
        </Card>);
};

const BtnMore = styled(Button)`
 &:hover{
    color :#b37feb !important;
  }
`;