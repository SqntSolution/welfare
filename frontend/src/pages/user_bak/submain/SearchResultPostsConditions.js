import { useEffect, useState } from 'react';
import { Divider, Space, Table, Tag, Button, Row, Col, Slider, Checkbox, Popover, Radio, DatePicker } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import dayjs from 'dayjs';
import { useNavigation, useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import qs from 'qs';
import { CustomFilterLabel } from 'components/common/CustomComps';
import styled from 'styled-components';
import { useMsg } from 'hooks/helperHook';

const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;

/**
 * 국가별
 */
export const ConditionsNation = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [checkedList, setCheckedList] = useState([]); // 관리 
    const [nationOptions, setNationOptions] = useState([])
    const { error, info } = useMsg()

    const restoreFromQueryStr = () => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("== 20 : ", objFromQueryStr)
        try {
            const list = objFromQueryStr['nationConditions']?.split(",")?.filter(elem => elem != '') ?? []
            // console.log("== 21 : ", list)
            setCheckedList(list)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        restoreFromQueryStr();
    }, [location.search]);

    useEffect(() => {
        getCodes()
    }, [])

    // code 조회
    const getCodes = () => {
        AXIOS.get(`/api/v1/common/code-render-multi/META_NATION`)
            .then((resp) => {
                /*
                "META_NATION": [
                        {
                            "value": "GLOBAL",
                            "label": "글로벌"
                        },
                    ]
                */
                const data = resp?.data
                setNationOptions(data?.META_NATION)
            })
            .catch((err) => {
                console.log('=== getAllMenus 에러 : ', err?.response);
                error(err)
            })
    };

    // const checkBoxOptions = [
    //     { label: '글로벌', value: 'GLOBAL', key: 'GLOBAL' },
    //     { label: '한국', value: 'KOR', key: 'KOR' },
    //     { label: '중국', value: 'CHN', key: 'CHN' },
    //     { label: '일본', value: 'JPN', key: 'JPN' },
    //     { label: '미국', value: 'USA', key: 'USA' },
    //     { label: '태국', value: 'THA', key: 'THA' },
    //     { label: '인도네시아', value: 'IDN', key: 'IDN' },
    //     { label: '베트남', value: 'VNM', key: 'VNM' },
    //     { label: '말레이시아', value: 'MYS', key: 'MYS' },
    //     { label: '인도', value: 'IND', key: 'IND' },
    //     { label: '브라질', value: 'BRA', key: 'BRA' },
    //     { label: '프랑스', value: 'FRA', key: 'FRA' },
    //     { label: '영국', value: 'GBR', key: 'GBR' },
    //     { label: 'ETC', value: 'ETC', key: 'ETC' },
    // ];

    const checkedAll = nationOptions?.length <= checkedList?.length;
    const indeterminate = checkedList?.length > 0 && checkedList?.length < nationOptions?.length;

    const updateUrl = (list) => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        objFromQueryStr['nationConditions'] = (list?.join(',') ?? '')
        objFromQueryStr['pageNumber'] = 0
        navigate(`${location.pathname}?${qs.stringify(objFromQueryStr)}`);
    }

    const onChange = (list) => {
        // console.log("===onChange : ", list)
        updateUrl(list)
    };

    const onCheckAllChange = (e) => {
        updateUrl(e.target.checked ? nationOptions.map(({ value }) => value) : [])
    };

    return (
        <>
            {/* <Form form={form}> */}
            <StyledConditionsNation style={{ width: 200, padding: '4px 12px' }}>
                <Row>
                    <CustomFilterLabel name={'국가별'} />
                </Row>
                {/* ==== [수정해야 함]아래의 전체 Checkbox는 CheckboxGroup 바깥쪽에 있어야 함.  */}
                <Col span={12}>
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkedAll}>전체</Checkbox>
                </Col>
                <CheckboxGroup
                    onChange={onChange}
                    value={checkedList}
                >

                    <Row>
                        {nationOptions.map((elem, idx) => {
                            // console.log(option, i);
                            return (<Col span={12}>
                                <Checkbox key={elem.value} value={elem.value}>{elem.label}</Checkbox>
                            </Col>)
                        })}
                    </Row>
                </CheckboxGroup>
                {/* </Form.Item> */}
            </StyledConditionsNation >
            {/* </Form> */}
        </>
    );
}


/**
 * 주제별
 */
export const ConditionsTopic = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [form] = Form.useForm();
    const [checkedList, setCheckedList] = useState([]);
    const { error, info } = useMsg()
    const [topicOptions, setTopicOptions] = useState([])

    const restoreFromQueryStr = () => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("== 20 : ", objFromQueryStr)
        try {
            const list = objFromQueryStr['topicConditions']?.split(",")?.filter(elem => elem != '') ?? []
            // console.log("== 21 : ", list)
            setCheckedList(list)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        restoreFromQueryStr();
    }, [location.search]);

    useEffect(() => {
        getCodes()
    }, [])

    // code 조회
    const getCodes = () => {
        AXIOS.get(`/api/v1/common/code-render-multi/META_TOPIC`)
            .then((resp) => {
                /*
                "META_NATION": [
                        {
                            "value": "GLOBAL",
                            "label": "글로벌"
                        },
                    ]
                */
                const data = resp?.data
                setTopicOptions(data?.META_TOPIC)
            })
            .catch((err) => {
                console.log('=== getAllMenus 에러 : ', err?.response);
                error(err)
            })
    };

    // const checkBoxOptions = [
    //     { label: '소비자', value: 'consumer', key: 'consumer' },
    //     { label: '유형', value: 'type', key: 'type' },
    //     { label: '기능', value: 'function', key: 'function' },
    //     { label: '성분', value: 'ingredient', key: 'ingredient' },
    //     { label: '유통', value: 'circulation', key: 'circulation' },
    //     { label: 'ETC', value: 'ETC', key: 'ETC' },
    // ];

    const checkedAll = topicOptions?.length === checkedList?.length;
    const indeterminate = checkedList?.length > 0 && checkedList?.length < topicOptions?.length;

    const updateUrl = (list) => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("== 10 : ", objFromQueryStr)
        objFromQueryStr['topicConditions'] = (list?.join(',') ?? '')
        objFromQueryStr['pageNumber'] = 0
        // console.log("== 11 : ", objFromQueryStr)
        navigate(`${location.pathname}?${qs.stringify(objFromQueryStr)}`);
    }

    const onChange = (list) => {
        // console.log('=== onChange :', list);
        updateUrl(list)
    };

    // useEffect(() => {
    //     console.log("==== selectNation")
    //     // 모두 체크한 경우에는 빈 것으로 넘기자
    //     selectTopic?.(checkedAll ? [] : checkedList)
    // }, [checkedList])

    const onCheckAllChange = (e) => {
        updateUrl(e.target.checked ? topicOptions.map(({ value }) => value) : []);
    };

    return (
        <>
            <div style={{ width: `100px`, padding: '16px 24px 16px, 24px' }}>
                <Row>
                    <CustomFilterLabel name={'주제별'} />
                </Row>
                <Row>
                    <Col span={24}>
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkedAll}>전체</Checkbox>
                    </Col>
                </Row>

                <CheckboxGroup
                    onChange={onChange}
                    value={checkedList}
                >
                    <Row>
                        {topicOptions.map((elem, idx) => {
                            // console.log(option, i);
                            return (<Col span={24}>
                                <Checkbox key={elem.value} value={elem.value}>{elem.label}</Checkbox>
                            </Col>)
                        })}
                    </Row>
                </CheckboxGroup>
            </div >
        </>
    );
}



/**
 * 등록일
 */
export const ConditionsRegisterDate = (props) => {
    // let defaultRegisterDateStart = props?.defaultRegisterDateStart
    // let defaultRegisterDateEnd = props?.defaultRegisterDateEnd
    // const selectRegisterDate = props?.selectRegisterDate  // callback 함수
    const location = useLocation();
    const navigate = useNavigate();
    const [rangeValue, setRangeValue] = useState([null, null]);

    const restoreFromQueryStr = () => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("== 20 : ", objFromQueryStr)
        try {
            const startDateCondition = objFromQueryStr['startDateCondition']
            const endDateCondition = objFromQueryStr['endDateCondition']
            let start = null
            if (startDateCondition != null && startDateCondition != '') {
                start = dayjs(startDateCondition, 'YYYY.MM.DD')
            }
            let end = null
            if (endDateCondition != null && endDateCondition != '') {
                end = dayjs(endDateCondition, 'YYYY.MM.DD')
            }
            setRangeValue([start, end])
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        restoreFromQueryStr();
    }, [location.search]);

    // // defaultRegisterDate가 문제를 일으킬지 확인
    // try {
    //     if(defaultRegisterDateStart!=null){
    //         dayjs(defaultRegisterDateStart).format('YYYY.MM.DD')
    //     }
    //     if(defaultRegisterDateEnd!=null){
    //         dayjs(defaultRegisterDateEnd).format('YYYY.MM.DD')
    //     }
    // } catch (error) {
    //     console.log(error)
    //     defaultRegisterDateStart = null
    //     defaultRegisterDateEnd = null
    // }

    const updateUrl = (start, end) => {
        // console.log("=== caldendar ", start, end)
        // start = start?.format("YYYY.MM.DD")
        // end = end?.format("YYYY.MM.DD")
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        if (start != null && start != '') {
            objFromQueryStr['startDateCondition'] = start
        } else {
            objFromQueryStr['startDateCondition'] = null
        }
        if (end != null && end != '') {
            objFromQueryStr['endDateCondition'] = end
        } else {
            objFromQueryStr['endDateCondition'] = null
        }
        objFromQueryStr['pageNumber'] = 0
        navigate(`${location.pathname}?${qs.stringify(objFromQueryStr)}`);
    }

    // useEffect(() => {
    //     console.log("==== rangeValue, ", rangeValue)
    //     if (rangeValue?.[0] == null || rangeValue?.[1] == null) {
    //         selectRegisterDate?.(null, null)
    //     } else {
    //         selectRegisterDate?.(dayjs(rangeValue[0]).format('YYYY.MM.DD'), dayjs(rangeValue[1]).format('YYYY.MM.DD'))
    //     }
    // }, [rangeValue])

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            // console.log('From: ', dates[0], ', to: ', dates[1]);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            setRangeValue(dates[0], dates[1])
            updateUrl(dateStrings[0], dateStrings[1])
        } else {
            // console.log('Clear');
            setRangeValue([null, null])
            updateUrl(null, null)
        }
    };

    const rangePresets = [
        {
            label: '[전체]',
            value: [null, null],
        },
        {
            label: '[오늘]',
            value: [dayjs(), dayjs()],
        },
        {
            label: '[7일]',
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: '[30일]',
            value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
            label: '[90일]',
            value: [dayjs().add(-90, 'd'), dayjs()],
        },
        {
            label: '[180일]',
            value: [dayjs().add(-180, 'd'), dayjs()],
        },
    ];

    const setAll = () => {
        updateUrl(null, null)
    }

    return (
        <>
            <div style={{width:'350px', padding: '16px 24px 16px, 24px' }}>
                <Row>
                    <CustomFilterLabel name={'등록일'} />
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <StyledRangePicker
                            placeholder={['From.', 'To.']}
                            placement='bottomLeft'
                            format='YYYY.MM.DD'
                            separator=' ~ '
                            showToday={false}
                            value={rangeValue}
                            onChange={onRangeChange}
                            // presets={rangePresets}
                            allowClear={true}
                        />
                    </Col>
                    <Col span={24}>
                        <Space>
                            {/* <Button onClick={setAll} size='small' type="primary" >전체</Button> */}
                            <div>
                                {rangePresets.map((item, idx) => (
                                    <Button style={{ color: '#1890FF', fontSize: 14, padding: "0 4px" }} key={idx} type={'link'} onClick={() => updateUrl(item.value[0]?.format("YYYY.MM.DD"), item.value[1]?.format("YYYY.MM.DD"))}>{item.label}</Button>
                                ))}
                            </div>

                        </Space>
                    </Col>
                </Row>
            </div >
        </>
    );
}


/**
 * 자료타입
 */
export const ConditionsDataType = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    // let defaultDataType = props?.defaultDataType ?? 'post'
    // let defaultFileType = props?.defaultFileType
    // const selectDataType = props?.selectDataType // callback 함수

    // // defaultDataType이 문제를 일으킬지 확인
    // try {
    //     if(defaultFileType!=null && !Array.isArray(defaultFileType)){
    //         defaultFileType = []
    //     }
    // } catch (error) {
    //     console.log("== error :", error)
    //     defaultFileType = []
    // }
    // const [form] = Form.useForm();

    const restoreFromQueryStr = () => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        // console.log("== 20 : ", objFromQueryStr)
        try {
            const dataType = objFromQueryStr['dataTypeCondition'] ?? 'post'
            setDataType(dataType)
            const fileType = objFromQueryStr['fileTypeCondition']?.split(",")?.filter(elem => elem != '') ?? []
            setFileType(fileType)
            // console.log("== 21 : ", list)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        restoreFromQueryStr();
    }, [location.search]);

    const [dataType, setDataType] = useState();
    const [fileType, setFileType] = useState([]);

    const checkBoxOptions = [
        {
            label: 'PPT',
            value: 'ppt',
        },
        {
            label: 'PDF',
            value: 'pdf',
        },
        {
            label: 'EXCEL',
            value: 'excel',
        },
        {
            label: 'IMAGE',
            value: 'image',
        },
        {
            label: 'VIDEO',
            value: 'movie',
        },
        {
            label: 'ETC',
            value: 'etc',
        },
    ];

    const updateUrl_dataType = (data) => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        objFromQueryStr['dataTypeCondition'] = data
        objFromQueryStr['pageNumber'] = 0
        navigate(`${location.pathname}?${qs.stringify(objFromQueryStr)}`);
    }
    const updateUrl_fileType = (list) => {
        const objFromQueryStr = qs.parse(location.search, { ignoreQueryPrefix: true });
        objFromQueryStr['fileTypeCondition'] = (list?.join(',') ?? '')
        objFromQueryStr['pageNumber'] = 0
        navigate(`${location.pathname}?${qs.stringify(objFromQueryStr)}`);
    }

    const onChangeDataType = (e) => {
        // setDataType(e.target.value)
        updateUrl_dataType(e.target.value)
    };

    const onChangeFileType = (list) => {
        updateUrl_fileType(list)
    };

    const onCheckAllChange = (e) => {
        updateUrl_fileType((e.target.checked ? checkBoxOptions.map(({ value }) => value) : []));
    };

    const checkedAll = checkBoxOptions?.length === fileType?.length;
    const indeterminate = fileType?.length > 0 && fileType?.length < checkBoxOptions?.length;

    return (
        <>
            <div style={{ width: `120px`, padding: '16px 24px 16px, 24px' }}>
                <Row>
                    <CustomFilterLabel name={'자료타입'} />
                    {/* <Col span={24}>
                        dataType : {JSON.stringify(dataType)} <br />
                        fileType : {JSON.stringify(fileType)} <br />
                    </Col> */}
                </Row>
                <Radio.Group value={dataType} onChange={onChangeDataType} >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Space direction="vertical">
                                <Radio value='post'>Post</Radio>
                                <Radio value='file'>File</Radio>
                            </Space>
                        </Col>
                    </Row>
                </Radio.Group>
                <Row gutter={[0, 0]}>
                    <Col span={18} offset={4}>
                        {/* <Space direction="vertical"> */}
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkedAll} disabled={dataType == 'post'}>
                            전체</Checkbox>
                    </Col>
                    <Checkbox.Group defaultValue={[]} onChange={onChangeFileType} disabled={dataType == 'post'} value={fileType} >
                        {
                            checkBoxOptions.map(elem => (
                                <Col span={18} offset={4}>
                                    <Checkbox value={elem.value}>{elem.label}</Checkbox>
                                </Col>
                            ))
                        }

                    </Checkbox.Group>

                    {/* </Space> */}
                </Row>
            </div >
        </>
    );
}


const StyledConditionsNation = styled.div`
    &&& .ant-checkbox+span{padding-inline-end: 0}
    .ant-checkbox+span{rgba(0, 0, 0, 0.85)}
`;

const StyledRangePicker = styled(RangePicker)`
    &.ant-picker-range{width: 100%;}
`;