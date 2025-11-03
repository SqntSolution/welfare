import { Button, Flex, Popconfirm, Typography } from 'antd';
import { useMsg } from 'hooks/helperHook';
import { useConfirmPopup } from 'hooks/popups';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledAdminTable, StyledTableButton } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';

const AdminCommonCodeList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [confirm, confirmContextHolder] = useConfirmPopup();
    const { error, info } = useMsg()

    const navigate = useNavigate();

    useEffect(() => {
        getCodeGroupList();
    }, []);

    const getCodeGroupList = async () => {
        setLoading(true);

        return await AXIOS.get("/api/v1/admin/code")
            .then(async (resp) => {
                setData(resp?.data)
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    };

    const deleteCodeGroup = async (id) => {
        setLoading(true);

        return await AXIOS.delete(`/api/v1/admin/code/${id}`)
            .then(async (resp) => {
                getCodeGroupList();
                info('삭제되었습니다.');
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        { title: '코드 그룹 ID', dataIndex: 'groupCode', key: 'groupCode', ellipsis: true, width: '15%', },
        {
            title: '코드명', dataIndex: 'groupName', key: 'groupName', ellipsis: true, width: '20%',
            render: (_, record) => (
                <div style={{ textAlign: 'left' }}>{record.groupName}</div>
            )
        },
        {
            title: '코드 설명', dataIndex: 'description', key: 'description', ellipsis: true, width: '25%',
            render: (_, record) => (
                <div style={{ textAlign: 'left' }}>{record.description ?? ''}</div>
            )
        },
        { title: '등록 코드', dataIndex: 'codeCount', key: 'codeCount', ellipsis: true, width: '8%', },
        {
            title: '수정', key: 'groupCode', width: '8%',
            render: (_, record) => (
                <StyledTableButton type='link' onClick={() => navigate(`/admin/code/common/edit/${record.id}`)}>수정</StyledTableButton>
            )
        },
        {
            title: '삭제', key: 'groupCode', width: '8%',
            render: (_, record) => (
                <Popconfirm
                    title={<div>{record.groupCode}를 삭제합니다.</div>}
                    description=''
                    okText='확인'
                    cancelText='취소'
                    onConfirm={() => deleteCodeGroup(record.id)}>
                    <StyledTableButton type='link' danger>삭제</StyledTableButton>
                </Popconfirm>
            )
        },
    ];

    return (
        <>
            {confirmContextHolder}
            <Flex justify="space-between" align="end" style={{ marginBottom: 24 }}>
                <Typography.Title level={4} style={{ margin: 0 }}>공통 코드</Typography.Title>
                <Button type='primary' size='large' style={{ width: 114 }} onClick={() => navigate('/admin/code/common/new')}>추가</Button>
            </Flex>
            <StyledAdminTable
                dataSource={data ?? []}
                columns={columns ?? []}
                loading={loading}
                size="small"
                rowKey='groupCode'
            />
        </>
    );
}

export default AdminCommonCodeList;