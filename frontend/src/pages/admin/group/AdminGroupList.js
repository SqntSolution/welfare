import { Breadcrumb, Button, Flex, Table, Typography } from 'antd';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { useMsg } from 'hooks/helperHook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InnerAdminDiv, StyledAdminTable } from 'styles/StyledCommon';
import { AXIOS } from 'utils/axios';

export const AdminGroupList = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { error, info } = useMsg()

    useEffect(() => {
        getMenuData();
    }, []);

    const getMenuData = async () => {
        setLoading(true);

        return await AXIOS.get("/api/v1/admin/group")
            .then(async (resp) => {
                setData(resp?.data)
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: '권한 그룹 명', dataIndex: 'groupNm', key: 'groupNm', ellipsis: true, width: 200,
            sorter: (a, b) => a.groupNm?.localeCompare(b.groupNm),
            showSorterTooltip: false
        },
        {
            title: '그룹 설명', dataIndex: 'description', key: 'description', ellipsis: true, width: '50%',
            render: (_, record) => (
                <Typography.Text ellipsis={true} style={{ textAlign: 'left' }}>{record.description}</Typography.Text>
            ),
            sorter: (a, b) => a.description?.localeCompare(b.description),
            showSorterTooltip: false
        },
        {
            title: '매칭 팀', dataIndex: 'teamMatchingCount', key: 'teamMatchingCount', ellipsis: true, width: 100,
            render: (_, record) => (
                <>{record.teamMatchingCount > 0 ? `${record.teamMatchingCount}팀` : '-'}</>
            ),
            sorter: (a, b) => a.teamMatchingCount - b.teamMatchingCount,
            showSorterTooltip: false
        },
        {
            title: '매칭 개인', dataIndex: 'userMatchingCount', key: 'userMatchingCount', ellipsis: true, width: 100,
            render: (_, record) => (
                <>{record.userMatchingCount > 0 ? `${record.userMatchingCount}명` : '-'}</>
            ),
            sorter: (a, b) => a.userMatchingCount - b.userMatchingCount,
            showSorterTooltip: false
        },
        {
            title: '정보 수정', key: 'authGroupCd', ellipsis: true, width: 100,
            render: (_, record) => (
                <Button type='link' onClick={() => navigate(`/admin/group/edit/${record.authGroupCd}`)}
                    style={{ margin: 0, padding: 0, height: 'auto' }}
                >수정</Button>
            )
        },
    ];
    const breadcrumb = [
        { title: 'Home' },
        { title: '그룹' },
        { title: '그룹 정보 관리' },
    ]
    return (
        <>
            <CustomAdminTitle title={'그룹'} items={breadcrumb} />

            <InnerAdminDiv>
                <Flex justify="space-between" align="end" style={{ marginBottom: 32 }}>
                    <Typography.Title level={5}>권한 그룹 목록</Typography.Title>
                    <Button type='primary' style={{ width: 104, background: 'rgba(146, 84, 222, 1)' }} onClick={() => navigate('/admin/group/new')}>추가</Button>
                </Flex>
                <StyledAdminTable
                    dataSource={data ?? []}
                    columns={columns ?? []}
                    loading={loading}
                    size="small"
                    // bordered
                    rowKey='authGroupCd'
                />
            </InnerAdminDiv>
        </>
    );
}

export default AdminGroupList;