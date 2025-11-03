import { Button, Col, DatePicker, Flex, Row, Space, Typography, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StatisticsTable, StatisticsTotalChart } from './AdminStatisticsContents';
import { CustomAdminTitle } from 'components/common/CustomComps';
import { useMsg } from 'hooks/helperHook';
import { InnerAdminDiv } from 'styles/StyledCommon';
import { DownloadStatModal } from './DownloadStatModal';
import { PvStatModal } from './PvStatModal';
import { SubscribeStatModal } from './SubscribeStatModal';
import { VisitorStatModal } from './VisitorStatModal';
import { AXIOS } from 'utils/axios';

const { RangePicker } = DatePicker;

const AdminStatistics = (props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [modalData, setModalData] = useState({});
    const [dateRange, setDateRange] = useState([]);
    const [statData, setStatData] = useState({ chart: [], table: [], dateRange: [] });

    const { error, info } = useMsg();

    useEffect(() => {
        setStatData({ chart: [], table: [], dateRange: [] });
        setDateRange(rangePresets[0].value);
        getStat(rangePresets[0].value);
    }, [props.type]);

    const title = {
        login: '방문자',
        post_view: '조회',
        file_download: '다운로드',
        subscribe: '구독',
    };

    const rangePresets = [
        { label: '[최근 1개월]', value: [dayjs().add(-1, 'month'), dayjs()] },
        { label: '[최근 2개월]', value: [dayjs().add(-2, 'month'), dayjs()] },
        { label: '[최근 3개월]', value: [dayjs().add(-3, 'month'), dayjs()] },
    ];

    const breadcrumbItems = [
        { title: 'Home' },
        { title: '통계' },
        { title: title[props.type] },
    ];

    const onCountClick = (record) => {
        setModalData(record);
        setOpen(true);
    }

    const validateInput = async () => {
        if (dateRange?.length !== 2)
            return '시작일/종료일을 지정해주세요.';

        const rangeFlag = dateRange[1]?.diff(dateRange[0], 'month', true) <= 3;

        if (!rangeFlag) {
            setDateRange([dateRange[1].add(-3, 'month'), dateRange[1]]);
            return '최대 조회 기간은 3개월입니다.';
        }

        return '';
    }

    const getStat = async (range) => {
        let validateMessage = '';

        if (range === undefined)
            validateMessage = await validateInput();

        if (validateMessage !== '')
            error(validateMessage);
        else {
            // info(`${title[props.type]} 데이터 조회 ( 기간 : ${dateRange[0].format('YYYYMMDD')} ~ ${dateRange[1].format('YYYYMMDD')} )`);
            setLoading(true);

            const params = {
                actionType: props.type,
                startDate: range ? range[0].format('YYYYMMDD') : dateRange[0]?.format('YYYYMMDD'),
                endDate: range ? range[1].format('YYYYMMDD') : dateRange[1]?.format('YYYYMMDD')
            };

            await AXIOS.get(`/api/v1/admin/statistic`, { params: params })
                .then((resp) => {
                    // console.log(resp.data)
                    setStatData({
                        dateRange: range ? range : dateRange,
                        chart: resp?.data.toSorted((a, b) => a.targetDate.localeCompare(b.targetDate)),
                        table: resp?.data.toSorted((a, b) => b.targetDate.localeCompare(a.targetDate)),
                    });
                    setCurrent(1);
                    setLoading(false);
                })
                .catch((e) => {
                    error(e);
                    setLoading(false);
                });
        }
    }

    return (
        <>
            {props.type === 'login' && <VisitorStatModal isModalOpen={open} setIsModalOpen={setOpen} modalData={modalData} />}
            {props.type === 'post_view' && <PvStatModal isModalOpen={open} setIsModalOpen={setOpen} modalData={modalData} />}
            {props.type === 'file_download' && <DownloadStatModal isModalOpen={open} setIsModalOpen={setOpen} modalData={modalData} />}
            {props.type === 'subscribe' && <SubscribeStatModal isModalOpen={open} setIsModalOpen={setOpen} modalData={modalData} />}

            <CustomAdminTitle title={'통계'} items={breadcrumbItems} />

            <Spin spinning={loading}>
                <InnerAdminDiv >
                    <Flex justify='space-between'>
                        <Space align='start'>
                            <Typography.Title level={5} style={{ margin: 0 }}>{title[props.type]} (Chart)</Typography.Title>
                        </Space>
                        <Space align='start'>
                            {rangePresets.map((item, idx) => (
                                <Button
                                    style={{ color: '#1890FF', fontSize: 14, padding: "0 4px" }}
                                    key={idx}
                                    type={'text'}
                                    onClick={() => setDateRange(item.value)} >
                                    {item.label}
                                </Button>
                            ))}
                            <RangePicker
                                value={dateRange}
                                onChange={(e, f) => setDateRange(e)}
                                disabledDate={d => d.isAfter(dayjs(), 'day')}
                                style={{ width: 240 }} />
                            <Button type='primary' style={{ width: 104, background: 'rgba(146, 84, 222, 1)' }} onClick={() => getStat()}>조회</Button>
                        </Space>
                    </Flex>

                    <Row gutter={12}>
                        <Col span={24}>
                            <StatisticsTotalChart
                                queryType={
                                    {
                                        barData: [
                                            props.type === 'login' ? { dataKey: 'totalVisitsCnt', color: '#8DAFFF', label: `총 ${title[props.type]} 수` } : null,
                                            { dataKey: 'value', color: '#9254DE', label: props.type === 'login' ? `순 ${title[props.type]} 수` : `${title[props.type]} 수` },
                                        ].filter(Boolean)
                                    }
                                }
                                data={statData}
                            />
                        </Col>
                    </Row>

                    <Row gutter={32} style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <StatisticsTable
                                type={props.type}
                                data={statData?.table}
                                dateRange={statData?.dateRange}
                                title={title[props.type]}
                                current={current}
                                setCurrent={setCurrent}
                                onCountClick={onCountClick} />
                        </Col>
                    </Row>
                </InnerAdminDiv>
            </Spin>
        </>
    );
};

export default AdminStatistics;