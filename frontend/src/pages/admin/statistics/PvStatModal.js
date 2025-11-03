import { Button, Flex, Modal, Space, Typography } from 'antd';
import { CustomButtonExcel } from 'components/common/CustomComps';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScrollHeightFixedTable } from './ScrollHeightFixedTable';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';

export const PvStatModal = (props) => {
    const { isModalOpen, setIsModalOpen, modalData } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const { error, info } = useMsg();

    useEffect(() => {
        if(isModalOpen)
            getData();
    }, [isModalOpen])

    const columns = [
        // {
        //     title: '구분', dataIndex: 'postType', ellipsis: true, width: '50%',
        //     sorter: (a, b) => a.postType?.localeCompare(b.postType),
        //     showSorterTooltip: false
        // },
        {
            title: '카테고리', ellipsis: true, width: '20%',
            sorter: (a, b) => `${a.menu1Nm} > ${a.menu2Nm}`?.localeCompare(`${b.menu1Nm} > ${b.menu2Nm}`),
            showSorterTooltip: false,
            render: (_, record) => (`${record.menu1Nm} > ${record.menu2Nm}`)
        },
        {
            title: '제목', dataIndex: 'postTitle', ellipsis: true, width: '70%',
            sorter: (a, b) => a.postTitle?.localeCompare(b.postTitle),
            showSorterTooltip: false
        },
        {
            title: '조회수', dataIndex: 'viewCnt', ellipsis: true, width: '10%',
            sorter: (a, b) => a.viewCnt - b.viewCnt,
            showSorterTooltip: false
        },
    ];

    const getData = async () => {
        if(props.modalData?.targetDate === undefined)
            error('오류가 발생했습니다.');
        else{
            setLoading(true);

            const params = {
                targetDate: props.modalData?.targetDate.replaceAll('-', ''),
            };

            await AXIOS.get(`/api/v1/admin/statistic/view`, { params: params })
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
            footer={<Flex justify='center'><Button type='primary' style={{width:104}} onClick={() => setIsModalOpen(false)}>닫기</Button></Flex>}>
            
            <div className='modal-body'>
                <ScrollHeightFixedTable 
                    title={() => <>
                        <Flex justify='space-between'>
                            <Space>
                                <Typography.Title level={5} style={{ margin: 0 }}>
                                    일간 조회 수 ({modalData.targetDate} / <span style={{ color: 'blue' }}>{modalData.value}</span> 건)
                                </Typography.Title>
                            </Space>
                            <CustomButtonExcel href={`/api/v1/admin/statistic/view/excel?targetDate=${modalData?.targetDate.replaceAll('-', '')}`}/>
                        </Flex>
                    </>}
                    size='small'
                    dataSource={data}
                    columns={columns}
                    rowKey={row => row?.id}
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