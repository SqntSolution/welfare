/**
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CaretDownOutlined, CaretUpOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Select, Space, Typography, Flex, Spin } from 'antd';

import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { isEmptyCheck } from 'utils/helpers';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { CustomAdminTitle, CustomFormRow } from 'components/common/CustomComps';
import { StyledTable as CommonStyledTable, InnerAdminDiv, StyledAdminTable, StyledFormItem, StyledTable } from 'styles/StyledCommon';

const { Option } = Select;

const TIME_INTERVAL = 1500;

const AdminContentKeyWord = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [keyWordList, setKeyWordList] = useState([]);

    const { error, info } = useMsg();

    const getKeyWordList = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/admin/contents/recommend/keyword`)
            .then((resp) => {
                // console.log('==-resp.data-==', keyWordList, resp.data);
                setKeyWordList(resp.data);
                setLoading(false);
            })
            .catch((e) => {
                setKeyWordList([]);
                error(e);
                setLoading(false);
            });
    };

    const saveKeyword = async (values) => {
        const params = values;
        // setLoading(true);
        return await AXIOS.post(`/api/v1/admin/contents/recommend/keyword`, params)
            .then((resp) => {
                setTimeout(() => {
                    info('추천 검색어를 등록하였습니다.');
                    setLoading(false);
                }, TIME_INTERVAL)
            })
            .catch((e) => {
                setTimeout(() => {
                    error(e);
                    setLoading(false);
                }, TIME_INTERVAL)
            });
    };
    useEffect(() => {
        getKeyWordList();
    }, []);

    useEffect(() => {
        form.setFieldValue('keywords', keyWordList);
    }, [keyWordList]);

    const onFinish = (values) => {
        setLoading(true);
        // console.log('Received values of form:', values);
        saveKeyword(values);
    };

    const Breadcrumb = [
        { title: 'Home' },
        { title: '콘텐츠' },
        { title: '검색어' },
    ]
    return (
        <>
            <CustomAdminTitle title={'콘텐츠'} items={Breadcrumb} />
            <InnerAdminDiv>
                <Typography.Title level={5} style={{ margin: 0, marginBottom: 24, }}>추천 검색어</Typography.Title>
                <Spin spinning={loading} >
                    <Form
                        name='dynamic_form_nest_item'
                        form={form}
                        onFinish={onFinish}
                        style={{
                            width: '100%',
                        }}
                        autoComplete='off'
                    >

                        <Form.List name='keywords' >
                            {(fields, { add, remove, move }, { errors }) => (
                                <>
                                    {fields?.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                paddingBottom: 8,
                                                marginBottom: 8,
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
                                            }}
                                            align='baseline'
                                        >
                                            <Button type='text' style={{ margin: '0px', padding: 0, height: 'auto' }} onClick={() => move(name, name - 1)} disabled={name === 0}>
                                                <CaretUpOutlined style={{ color: '#272727' }} />
                                            </Button>
                                            <Button
                                                type='text'
                                                style={{ margin: '0px', padding: 0, }}
                                                onClick={() => move(name, name + 1)}
                                                disabled={name === fields.length - 1}
                                            >
                                                <CaretDownOutlined style={{ color: '#272727', height: 'auto' }} />
                                            </Button>
                                            <div style={{ width: '30px', textAlign: 'center' }}>{name + 1}</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'keyword']}
                                                // noStyle
                                                rules={[
                                                    { required: true, whitespace: true, message: '추천 검색어를 입력해주세요.' }
                                                ]}
                                            >
                                                <Input placeholder='추천 검색어' style={{ minWidth: '200px' }} allowClear />
                                            </Form.Item>
                                            <Button onClick={() => remove(name)} danger>삭제</Button>
                                        </Space>
                                    ))}

                                    <Flex gap={8} justify='center' style={{ marginTop: 24 }}>
                                        {fields?.length < 10 &&
                                            <Form.Item >
                                                <Button onClick={() => add()} size='lage' style={{ width: 114 }} danger>추가</Button>
                                            </Form.Item>
                                        }
                                        <Form.Item >
                                            <Button htmlType='submit' type='primary' size='lage' style={{ width: 114 }}>등록</Button>
                                        </Form.Item>
                                    </Flex>
                                </>
                            )}
                        </Form.List >
                    </Form >
                </Spin>
            </InnerAdminDiv>
        </>
    );
};

export default AdminContentKeyWord;