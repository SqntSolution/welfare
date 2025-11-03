import { Button, Card, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip as ChartToolTip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { CustomButtonExcel } from 'components/common/CustomComps';
import { StyledAdminTable } from 'styles/StyledCommon';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const StatisticsChart = (props) => {
    return (
        <CustomCardforStatistics>
            <ResponsiveContainer aspect={5}>
                <BarChart data={props.data}
                    margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey='targetDate' />
                    <YAxis />
                    <CartesianGrid strokeDasharray='3 3' />
                    <ChartToolTip
                        cursor={props.data.length > 0
                            ? { stroke: 'red', strokeWidth: 1, fill: 'rgba(146, 84, 222, 1)', fillOpacity: 0 }
                            : null}
                        wrapperStyle={{ width: 150, backgroundColor: '#ccc' }}
                        formatter={(value) => [value, `${props.title} 수`]}
                    />
                    <Bar dataKey={'value'} fill='rgba(146, 84, 222, 1)' barSize={88} />
                </BarChart>
            </ResponsiveContainer>
        </CustomCardforStatistics>
    );
};

//Admin 통계 차트
export const StatisticsTotalChart = (props) => {
    const [title, setTitle] = useState();
    const { queryType, extra, data } = props;

    useEffect(() => {
        setTitle(queryType?.title);
    }, [queryType]);

    return (
        <CustomCardforDashBoard title={title} extra={extra}>
            <ResponsiveContainer aspect={5}>
                <BarChart data={data?.chart}
                    margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey='targetDate' tickLine={false} tick={{ fill: 'rgba(0, 0, 0, 0.85)' }} stroke='#ccc' />
                    <YAxis tick={{ fill: 'rgba(0, 0, 0, 0.85)' }} stroke='#fff' />
                    <CartesianGrid stroke="rgba(0, 0, 0, 0.06)" vertical={false} />
                    <ChartToolTip
                        filter={true}
                        cursor={{ stroke: '#9254DE', strokeWidth: 1, fill: 'rgba(146, 84, 222, 1)', fillOpacity: 0.05 }}
                        wrapperStyle={{ width: 150, backgroundColor: '#ccc' }}
                        formatter={(value, name, props) => {
                            const nameMap = queryType.barData.reduce((acc, item) => {
                                acc[item.dataKey] = item.label;
                                return acc;
                            }, {});
                            return [value + ' 명', nameMap[name]]
                        }}
                    />

                    {queryType?.barData?.map((query, idx) => (
                        <Bar key={`${query.dataKey}-${idx}`} dataKey={query.dataKey} fill={query.color} barSize={query.barSize ?? 58} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </CustomCardforDashBoard>
    );
};

export const StatisticsTable = (props) => {
    const [title, setTitle] = useState('');
    const [data, setData] = useState([]);
    const [dateRange, setDateRange] = useState([]);

    useEffect(() => {
        setTitle(props.title);
        setData(props.data);
    }, [props])

    useEffect(() => {
        setDateRange(props.dateRange);
    }, [data])

    const columns = [
        { title: '날짜', dataIndex: 'targetDate', key: 'targetDate', width: '50%', align: 'center', },
        {
            title: props.type === 'login' ? `순 ${title} 수` : `${title} 수`,
            dataIndex: 'value',
            key: 'value',
            width: '25%',
            align: 'center',
            render: (text, record) => <>
                <Button
                    type='link'
                    onClick={() => { props.onCountClick(record) }}
                    style={{ margin: 0, padding: 0, height: 'auto' }}>
                    {text}
                </Button>
            </>
        },
        props.type === 'login' ?
            {
                title: `총 ${title} 수`,
                dataIndex: 'totalVisitsCnt',
                key: 'totalVisitsCnt',
                width: '25%',
                align: 'center',
            }
            : null,
    ].filter(Boolean);

    return (
        <CustomCardforStatistics title={`일간 ${title} 수 ${dateRange[0] ? `(${dateRange[0]?.format('YYYY-MM-DD')} ~ ${dateRange[1]?.format('YYYY-MM-DD')})` : ``}`}
            extra={<CustomButtonExcel href={`/api/v1/admin/statistic/main/excel?actionType=${props.type}&startDate=${dateRange[0]?.format('YYYYMMDD')}&endDate=${dateRange[1]?.format('YYYYMMDD')}`} />}>
            <StyledAdminTable
                rowKey={(row) => row?.targetDate}
                dataSource={data}
                size={'small'}
                columns={columns}
                pagination={{ position: ['bottomCenter'], current: props.current, onChange: (page) => props.setCurrent(page) }}
            />
        </CustomCardforStatistics>
    );
};

export const CustomCardforStatistics = (props) => {
    const { opacity, extra, contentHeight } = props;

    return (
        <Card
            variant={true}
            size='small'
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: "#fff",
                border: '0',
            }}
            extra={extra ? extra : <></>}
            styles={{
                header: { opacity: opacity ?? 1, border: 0, borderRadius: '', height: 48, },
                body: { height: contentHeight ?? 'auto', backgroundColor: '#fff', opacity: 1, padding: 0, border: 0, borderRadius: 0, },
            }}
            title={props?.title ? <Row justify={'space-between'} align={'middle'}>
                <Title level={5} style={{ margin: 0 }}>{props?.title} </Title>
            </Row> : ''}
        >
            {props.children}
        </Card>);
};

export const CustomCardforDashBoard = (props) => {
    const { opacity, extra, contentHeight } = props;
    const navigate = useNavigate();

    const handleClickMore = (to) => {
        navigate(to);
    };

    return (
        <Card
            variant='borderless'
            size='small'
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: "#fff",
                border: `0`,
            }}
            extra={extra ? extra : <></>}
            styles={{
                header: { opacity: opacity ?? 1, border: 0, borderRadius: '', height: 48, },
                body: { height: contentHeight ?? 'auto', backgroundColor: '#fff', opacity: 1, padding: 0, border: 0, borderRadius: 0, }
            }}
            title={<Row justify={'space-between'} align={'middle'}>
                <Title level={5} style={{ margin: 0 }}>{props?.title} </Title>
                {props.toMore ? <Button onClick={() => handleClickMore(props.toMore)}>More</Button>
                    : <></>}
            </Row>}
        >
            {props.children}
        </Card>);
};