import { Button, Flex, Modal, Space, Typography } from 'antd';
import { CustomButtonExcel } from 'components/common/CustomComps';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScrollHeightFixedTable } from './ScrollHeightFixedTable';
import { useMsg } from 'hooks/helperHook';
import { AXIOS } from 'utils/axios';

export const VisitorStatModal = (props) => {
    const { isModalOpen, setIsModalOpen, modalData } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const { error, info } = useMsg();

    useEffect(() => {
        if (isModalOpen)
            getData();
    }, [isModalOpen])

    const columns = [
        // {
        //     title: '소속 팀', dataIndex: 'orgNm', ellipsis: true, width: '25%',
        //     sorter: (a, b) => a.orgNm?.localeCompare(b.orgNm),
        //     showSorterTooltip: false
        // },
        { title: 'ID', dataIndex: 'loginId', key: 'loginId', width: '20%', ellipsis: true, },
        {
            title: '이름', dataIndex: 'userNm', key: 'userNm', width: '20%', ellipsis: true,
            sorter: (a, b) => a.userNm?.localeCompare(b.userNm),
            showSorterTooltip: false,
            render: (_, record) => (
                <Space size={2}>
                    {record.userNm}
                </Space>
            ),
        },
        {
            title: '이메일', dataIndex: 'mailAddr', key: 'mailAddr', width: '25%', ellipsis: true,
            sorter: (a, b) => a.mailAddr?.localeCompare(b.mailAddr),
            showSorterTooltip: false,
        },
        {
            title: '전화 번호', dataIndex: 'mobileNo', key: 'mobileNo', width: '25%', ellipsis: true,
            sorter: (a, b) => a.mobileNo?.localeCompare(b.mobileNo),
            showSorterTooltip: false,
        },
        {
            title: '계정 활성화 여부', dataIndex: 'active', key: 'active', width: '20%', ellipsis: true,
            render: (text, record) => { return (<>{record ? "활성화" : "비활성화"}</>); },
        },
        {
            title: '개인 권한 그룹', dataIndex: 'authGroupNm', ellipsis: true, width: '25%',
            sorter: (a, b) => a.authGroupNm?.localeCompare(b.authGroupNm),
            showSorterTooltip: false
        },
    ];

    const getData = async () => {
        if (props.modalData?.targetDate === undefined)
            error('오류가 발생했습니다.');
        else {
            setLoading(true);

            const params = {
                targetDate: props.modalData?.targetDate.replaceAll('-', ''),
            };

            await AXIOS.get(`/api/v1/admin/statistic/Login`, { params: params })
                .then((resp) => {
                    // console.log(resp.data)
                    setData(resp.data);
                    setLoading(false);
                })
                .catch((e) => {
                    error(e);
                    setLoading(false);
                });
        }
    }

    return (
        <StyledModal
            destroyOnClose
            open={isModalOpen}
            maskClosable={false}
            closable={false}
            onCancel={() => setIsModalOpen(false)}
            width={1000}
            footer={<Flex justify='center'><Button type='primary' style={{ width: 104 }} onClick={() => setIsModalOpen(false)}>닫기</Button></Flex>}>

            <div className='modal-body'>
                <ScrollHeightFixedTable
                    title={() => <>
                        <Flex justify='space-between'>
                            <Space>
                                <Typography.Title level={5} style={{ margin: 0 }}>
                                    일간 방문자 수 ({modalData.targetDate} / <span style={{ color: 'blue' }}>{modalData.value}</span> 건)
                                </Typography.Title>
                            </Space>
                            <CustomButtonExcel href={`/api/v1/admin/statistic/login/excel?targetDate=${modalData?.targetDate.replaceAll('-', '')}`} />
                        </Flex>
                    </>}
                    size='small'
                    dataSource={data}
                    columns={columns}
                    rowKey={row => row?.empId}
                    loading={loading}
                    pagination={false}
                />
            </div>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    &.ant-modal .ant-modal-content{padding:0; padding-bottom: 24px; }
    .ant-modal-header{
        padding: 16px 24px; 
        text-align: center;
        line-height: 24px; 
        font-size: 16px; 
        font-weight: 500;
        box-shadow: 0px -1px 0px 0px rgba(240, 240, 240, 1) inset;
        margin:0;
    }
    .modal-body{padding:24px 24px 0 24px;}
`