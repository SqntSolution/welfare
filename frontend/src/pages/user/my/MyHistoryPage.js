import { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import qs from 'qs';
import { SUBoardHeaderWrap, SUInner1280, SUPaginationWithArrows, SUTabel } from 'styles/StyledUser';

const { Option } = Select;

const MyHistory = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { error, info } = useMsg();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [data, setData] = useState(); // historydata
    const [commoncode, setCommoncode] = useState(); //공통코드
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const commonData = async () => {
            await getGroupCode('HISTORY_TYPE');
        }
        commonData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getData(
                {
                    params:
                    {
                        pageNumber: Number(ofqs?.page ?? 1) - 1,
                        pageSize: ofqs?.size ?? 10,
                        typeCode: ofqs?.typeCode,
                    }
                },
                '', '');
        }
        fetchData();
    }, [location.search]);


    // 게시판 데이터 조회
    const getData = async (params, successCallback, errorCallback) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/user/my/history`, params)
            .then((resp) => {
                if (setData) setData(resp?.data);
                if (successCallback) successCallback();
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                if (errorCallback) errorCallback();
                setLoading(false);
            });
    };

    //공통코드 호출 
    ///api/v1/common/code?groupCode=MYPOST_TYPE    POST_OPEN_TYPE
    const getGroupCode = async (type) => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/history/type`, { params: { groupCode: type } })
            .then((resp) => {
                setCommoncode(resp?.data);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    //폐이징처리  
    const handleTableChange = (pagination, filters, sorter, extra) => {
        navigate(`${location.pathname}?${qs.stringify({ page: pagination?.current, size: pagination?.pageSize, typeCode: ofqs?.typeCode })}`);
    };

    //샐렉트 박스 체인지 검색기능
    const handleChange = (value, name) => {
        navigate(`${location.pathname}?${qs.stringify({ page: 1, size: ofqs?.pageSize ?? 10, typeCode: name?.name })}`);
    }

    const handlePageChange = (page, pageSize) => {
        navigate(`${location.pathname}?${qs.stringify({ ...ofqs, page: page, size: pageSize })}`);
    };

    const columns = [
        {
            title: '기록 일시',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            ellipsis: true,
        },
        {
            title: '항목',
            dataIndex: 'actionName',
            key: 'actionName',
            width: 150,
            ellipsis: true,
        },
        {
            title: '기록 내용',
            dataIndex: 'description',
            width: 400,
            key: 'description',
            render: (text, record) => {
                const prefix = record?.actionType?.includes('qna_') ? `/cs-center/qna` : `/post`;
                return record?.postTitle ? (
                    <>
                        <NavLink to={`${prefix}/${record?.postId}`}>[{record?.postTitle}]</NavLink>
                        <span>&nbsp;&nbsp; {record.description}</span>
                    </>
                ) : (
                    record.description
                );
            },
        },
    ]


    return (
        <SUInner1280>
            <Spin spinning={loading}>
                <SUBoardHeaderWrap>
                    <Select onChange={handleChange} defaultValue='전체' className='my-select' style={{ marginLeft: 'auto' }}>
                        <Option key='0' >전체</Option>
                        {commoncode?.map((option, index) => (
                            <Option key={option.value} value={option.label} name={option.value}>
                            </Option>
                        ))}
                    </Select>
                </SUBoardHeaderWrap>
                <SUTabel
                    columns={columns}
                    rowKey={(record) => record?.id}
                    dataSource={data?.content ?? []}
                    onChange={handleTableChange}
                    loading={loading}
                    pagination={false}
                    size="small"
                    scroll={{ x: 'max-content' }}
                />
                <SUPaginationWithArrows
                    onChange={handlePageChange}
                    current={Number(data?.number ?? 0) + 1}
                    pageSize={data?.pageSize ?? 10}
                    total={data?.totalElements}
                    position={'bottomCenter'}
                    showSizeChanger={false} // 페이지 크기를 변경할 수 있는 UI 표시 여부
                    showQuickJumper={false} // 빠른 페이지 이동 UI 표시 여부
                />
            </Spin>
        </SUInner1280>
    );
};


export default MyHistory;