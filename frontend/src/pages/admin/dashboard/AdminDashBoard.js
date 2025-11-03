import { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';

import {
    DashBoardChartVisitorCount, DashBoardTableNotice, DashBoardTableQnA, DashBoardTableNewPost
} from './AdminDashBoardContents';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv } from 'styles/StyledCommon';

const AdminDashBoard = (props) => {
    const [extraCode, setExtraCode] = useState();
    const [fameExtraCode, setFameExtraCode] = useState();

    const { error, info } = useMsg();

    useEffect(() => {
        getPeriodTypeCd();
    }, []);

    const getPeriodTypeCd = async () => {
        await AXIOS.get(`/api/v1/common/code`, { params: { groupCode: 'PERIOD_TYPE' } })
            .then((resp) => {
                setExtraCode(resp?.data?.sort((a, b) => a.seq - b.seq)?.map(d => ({ label: d.label, value: d.code })));
                setFameExtraCode(resp?.data?.sort((a, b) => a.seq - b.seq)?.map(d => ({ label: d.label, value: d.code }))?.filter(item => item.value !== 'DAILY'))
            })
            .catch((err) => {
                error(err);
            })
    };


    const breadcrumbItems = [
        { title: 'Home' },
        { title: '대시보드' },
    ];

    return (
        <>
            <CustomAdminTitle title={'대시보드'} items={breadcrumbItems} />
            <InnerAdminDiv>
                <Row gutter={[12, 56]}>
                    <Col span={24}>
                        <DashBoardChartVisitorCount
                            queryType={
                                {
                                    title: '순방문자 수 vs 방문자 수',
                                    barData: [
                                        { dataKey: 'totalVisitor', color: '#8DAFFF', label: '방문자 수' },
                                        { dataKey: 'visitor', color: '#9254DE', label: '순방문자 수' },

                                    ]
                                }
                            }
                            extraCode={extraCode}
                        />
                    </Col>

                    <Col span={12}>
                        <DashBoardTableNotice />
                    </Col>
                    <Col span={12}>
                        <DashBoardTableQnA />
                    </Col>

                    <Col span={24}>
                        <DashBoardTableNewPost />
                    </Col>
                </Row >
            </InnerAdminDiv>
        </>
    );
};

export default AdminDashBoard;