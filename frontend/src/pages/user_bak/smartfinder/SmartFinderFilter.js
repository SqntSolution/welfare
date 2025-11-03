import { useEffect, useRef, useState } from "react";
import { Checkbox, Col, Row, DatePicker, Button, Radio, Select, Input } from "antd"
import dayjs from 'dayjs';
import qs from 'qs';
import { useLocation } from "react-router-dom";
import { AXIOS } from "utils/axios";
import styled from "styled-components";
import { useMsg } from "hooks/helperHook";
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

export const SmartFinderFilter = (props) => {
    const { updateUrl, setLoading, disabledComp } = props;
    const location = useLocation();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true })

    const [ntcdFilter, setNtcdFilter] = useState([]);
    const [topicFilter, setTopicFilter] = useState([]);
    const [fileFilter, setFileFilter] = useState([]);
    const [isFile, setIsFile] = useState();
    const [ntcdCheckedAll, setNtcdCheckedAll] = useState();
    const [topicCheckedAll, setTopicCheckedAll] = useState();
    const [fileCheckedAll, setFileCheckedAll] = useState();
    const [dateFilter, setDateFilter] = useState([]);
    const [dateValues, setDateValues] = useState([]);
    const [codes, setCodes] = useState([]);
    const { error, info } = useMsg();
    const [tagInput, setTagInput] = useState();

    const dateFormat = 'YYYYMMDD';

    const fileCd = [
        { value: 'ppt', label: 'PPT' },
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'EXCEL' },
        { value: 'image', label: 'IMAGE' },
        { value: 'movie', label: 'VIDEO' },
        { value: 'etc', label: 'ETC' },
    ]
    
    const rangePresets = [
        {
            label: '[전체]',
            value: [null, null],
        },
        {
            label: '[오늘]',
            value: [dayjs().add(0, 'd'), dayjs()],
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
        }
    ];

    const ntcdIndeterminate = ntcdFilter?.length > 0 && codes['META_NATION']?.length > ntcdFilter?.length;
    const topicIndeterminate = topicFilter?.length > 0 && codes['META_TOPIC']?.length > topicFilter?.length;
    const fileIndeterminate = fileFilter?.length > 0 && fileCd?.length > fileFilter?.length;

    useEffect(() => {
        setNtcdFilter([]);
        setTopicFilter([]);
        setFileFilter([]);
        setDateFilter([]);
        getCode(['META_NATION', 'META_TOPIC']);
    }, [])

    useEffect(() => {
        setNtcdCheckedAll(codes['META_NATION']?.length > 0 && codes['META_NATION']?.length <= ntcdFilter?.length)
        setTopicCheckedAll(codes['META_TOPIC']?.length > 0 && codes['META_TOPIC']?.length <= topicFilter?.length)
        setFileCheckedAll(fileCd?.length > 0 && fileCd?.length <= fileFilter?.length)
    }, [ntcdFilter, topicFilter, fileFilter, isFile, dateFilter, codes])

    useEffect(() => {
        restoreFromQueryStr();
    }, [location.search])

    const restoreFromQueryStr = () => {
        try {
            //국가별
            const nationConditions = ofqs['nations']?.split(",")?.filter(elem => elem !== '') ?? [];
            setNtcdFilter(nationConditions);
            //주제별
            const topicConditions = ofqs['topics']?.split(",")?.filter(elem => elem !== '') ?? [];
            setTopicFilter(topicConditions);
            //등록일
            const startDateCondition = ofqs['startDate'];
            const endDateCondition = ofqs['endDate'];

            if (startDateCondition && endDateCondition) {
                setDateValues([dayjs(startDateCondition), dayjs(endDateCondition)]);
                setDateFilter([dayjs(startDateCondition)?.format(dateFormat), dayjs(endDateCondition)?.format(dateFormat)]);
            } else {
                setDateValues([]);
                setDateFilter([]);
            }
            //자료타입
            setIsFile(ofqs['dataType']?.toLocaleLowerCase() === 'file');
            setFileFilter(ofqs['fileTypes']?.split(',')?.filter(elem => elem !== '') ?? []);

            //태그
            setTagInput(ofqs?.tag ?? '');

        } catch (err) {
            error(err);
        }
    }

    const getCode = async (code) => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/code-render-multi/${code}`)
            .then(res => {
                setCodes(res.data);
            })
            .catch(err => {
                error(err);
            })
            .finally(() => setLoading(false))
    }

    const disabledDate = (current) => {
        return current > dayjs().endOf('day');
    };


    //국가별 전체 선택 및 해제 핸들러
    const ntcdCheckedAllHandler = (e) => {
        const checked = e.target.checked;
        setNtcdCheckedAll(checked);
        updateUrl(checked ? codes['META_NATION']?.map(({ value }) => value) : null, 'nations');
    }

    const ntcdChangeHandler = (list) => {
        updateUrl(list, 'nations');
    }

    //주제별 전체 선택 및 해제 핸들러
    const topicCheckedAllHandler = (e) => {
        const checked = e.target.checked;
        setTopicCheckedAll(checked);
        updateUrl(checked ? codes['META_TOPIC']?.map(({ value }) => value) : null, 'topics');
    }

    const topicChangeHandler = (list) => {
        updateUrl(list, 'topics');
    }

    //날짜 변경 이벤트
    const onDateChange = (dates, dateStrings) => {
        if (dates !== null) {
            setDateValues(dates[0], dates[1]);
            updateUrl(dates.map(date => date.format(dateFormat)), 'dateConditions');
        } else {
            setDateValues([])
            updateUrl([null, null], 'dateConditions');
        }
    };

    //프리셋 선택 시 이벤트
    const onPresetClicked = (value) => {
        // const dateValue = [value[0], value[1]]
        const objTmp = [value[0]?.format(dateFormat) ?? undefined, value[1]?.format(dateFormat) ?? undefined];
        updateUrl(objTmp, 'dateConditions');
    }


    //자료타입 변경 이벤트
    const typeChangeHandler = (e) => {
        const radioType = e.target.value;
        if (radioType === 'file') {
            setIsFile(true);
        } else {
            setIsFile(false);
            setFileCheckedAll(false);
        }
        updateUrl(radioType, 'dataTypeCondition');
    }

    //자료타입 파일 전체선택
    const fileCheckedAllHandler = (e) => {
        const checked = e.target.checked;
        setFileCheckedAll(checked);
        updateUrl(checked ? fileCd.map(({ value }) => value) : null, 'fileTypeCondition');
    }

    const fileChangeHandler = (list) => {
        updateUrl(list, 'fileTypeCondition');
    }

    const onTagTextChanged = (e) => {
        updateUrl(e ?? '', 'tag');
    }

    return (
        <>
            {/* 국가별 */}
            <Row gutter={[8]} style={{width:"100%",marginBottom:16}}>
                <StyledTitle span={2}>국가별 : </StyledTitle>
                <Col span={22} gutter={[16]}>
                        <Checkbox indeterminate={ntcdIndeterminate} onChange={ntcdCheckedAllHandler} checked={ntcdCheckedAll} disabled={disabledComp}>전체</Checkbox>
                    <CheckboxGroup onChange={ntcdChangeHandler} value={ntcdFilter} disabled={disabledComp}>
                        {codes['META_NATION']?.map((elem, idx) => (
                            <Checkbox  key={idx} value={elem.value} size="small">{elem.label}</Checkbox>
                        ))}
                    </CheckboxGroup>

                </Col>
            </Row>
            {/* 주제별 */}
            <Row gutter={[8]} style={{width:"100%",marginBottom:16}} >
                <StyledTitle span={2}>주제별 : </StyledTitle>
                <Col span={22}>
                    <Checkbox indeterminate={topicIndeterminate} onChange={topicCheckedAllHandler} checked={topicCheckedAll} disabled={disabledComp}>
                        전체
                    </Checkbox>
                    <CheckboxGroup onChange={topicChangeHandler} value={topicFilter} disabled={disabledComp}>
                        {codes['META_TOPIC']?.map((elem, idx) => (
                            <Checkbox  key={idx} value={elem.value}>{elem.label}</Checkbox>
                        ))}
                    </CheckboxGroup>
                </Col>
            </Row>
            {/* 태그 */}
            <Row gutter={[8]} style={{ width: "100%",marginBottom:16}} align='cneter'>
                <StyledTitle span={2} style={{paddingTop: 2}}>태그 : </StyledTitle>
                <Col span={22}>
                    {/* <Select
                        mode='tags'
                        style={{ width: 300, textAlign: 'left' ,borderRadius:2}}
                        placeholder='태그를 추가해주세요.'
                        onChange={onTagTextChanged}
                        tokenSeparators={[' ']}
                        options={[]}
                        value={ofqs?.tag ?? []}
                        allowClear
                        disabled={disabledComp}
                        maxTagCount={1}
                        open={false}
                        suffixIcon={''}
                    ></Select> */}
                    <Input.Search
                        style={{ width: 300, textAlign: 'left' ,borderRadius:2}}
                        allowClear
                        value={tagInput ?? ''}
                        onChange={(e) => setTagInput(e.target.value.replace(/[ ,]/g, ''))}
                        disabled={disabledComp}
                        onSearch={onTagTextChanged}
                        placeholder='태그를 추가해주세요.'
                    />
                </Col>
            </Row>
            {/* 등록일 */}
            <Row gutter={[8]} style={{width:"100%",marginBottom:16}}>
                <StyledTitle span={2} tyle={{paddingTop: 2}}>등록일 : </StyledTitle>
                <Col span={6} >
                    <RangePicker  onChange={onDateChange} value={dateValues} style={{width:'100%',height:32}} size="small" disabled={disabledComp}/>
                </Col>
                <Col span={14} style={{width:'100%'}} >
                    {rangePresets.map((item, idx) => (
                        <Button  style={{ color: '#1890FF',fontSize:14,padding:"0 4px"}} key={idx} type={'link'} onClick={() => onPresetClicked(item.value)} disabled={disabledComp}>{item.label}</Button>
                    ))}
                </Col>
            </Row>
            {/* 자료타입 */}
            <Row gutter={[8]} style={{width:"100%",}}>
                <StyledTitle span={2}>자료 타입 : </StyledTitle>
                
                {/* 파일인 경우 */}
                <Col span={22}>
                    <Radio.Group defaultValue={ofqs?.dataType?.toLocaleLowerCase() === 'file' ? 'file' : 'post'} buttonStyle="solid" onChange={typeChangeHandler} disabled={disabledComp}>
                        <Radio value="post">Post</Radio>
                        <Radio value="file">File</Radio>
                    </Radio.Group>
                    <Checkbox indeterminate={fileIndeterminate} disabled={!isFile} onChange={fileCheckedAllHandler} checked={fileCheckedAll}>
                        전체
                    </Checkbox>
                    <CheckboxGroup disabled={!isFile} value={fileFilter} onChange={fileChangeHandler} >
                        {fileCd.map((elem, idx) => (
                            <Col key={idx}>
                                <Checkbox value={elem.value} disabled={disabledComp}>{elem.label}</Checkbox>
                            </Col>
                        ))}
                    </CheckboxGroup>
                </Col>
            </Row>
        </>
    )
}


const StyledTitle = styled(Col)`
    font-size: 14px;
    text-align: right;
    color: rgba(0, 0, 0, 0.85);
`;