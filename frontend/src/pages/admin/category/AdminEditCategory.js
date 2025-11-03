import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, Space, Typography, Flex, Radio, Spin, Popconfirm, Checkbox, Divider } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { SubTitleDivider, CustomAdminTitle } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledFormItem } from 'styles/StyledCommon';
import styled from 'styled-components';
import { isEmptyCheck } from 'utils/helpers';
import { BannerImageUploadComps } from './comps/BannerImageUploadComps';
import { PlusOutlined, CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

const selectOptions = [
    // { label: '선택하세요', value: '' },
    { label: 'Sub Main', value: '' },
    { label: 'Link', value: 'link' }
];

const selectSubOptions = [
    { label: 'Board', value: 'post' },
    { label: 'Page', value: 'page' },
    { label: 'Link', value: 'link' }
];

const TIME_INTERVAL = 1500;

const AdminEditCategory = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [commonCodeData, setCommonCodeData] = useState(false);
    const [commonRefData, setCommonRefData] = useState([]);
    const [showURLComponent, setShowURLComponent] = useState(false);
    const [showCategoryEditForm, setShowCategoryEditForm] = useState(false);
    const [showMenuEditForm, setShowMenuEditForm] = useState(false);
    const [reloadPage, setReloadPage] = useState(false);
    const refreshContent = useRef();
    const [refContent, setRefContent] = useState(null);
    const [metaGroupOptions, setMetaGroupOptions] = useState();

    const { error, info } = useMsg();

    const { pathname, search, state } = location;

    useEffect(() => {
        getCommonCodeData();
        getCommonRefData();
        getMetaGroupOptions();
    }, []);

    useEffect(() => {
        // console.log('===-=-=-=-=-=-', state?.operationType.includes('Category'));
        form.resetFields();
        setShowURLComponent(false);
        // console.log('----------s', state);
        if (state?.operationType == 'addCategory') {
            state.title = '카테고리 추가';
            setShowCategoryEditForm(true);
        }
        else if (state?.operationType == 'addMenu') {
            state.title = '메뉴 추가';
            setShowMenuEditForm(true);
        }
        if (state?.operationType == 'editCategory') {
            state.title = '카테고리 수정';
            setShowCategoryEditForm(true);
        }
        else if (state?.operationType == 'editMenu') {
            state.title = '메뉴 수정';
            setShowMenuEditForm(true);
        }
        setReloadPage(false);
        // getData();
    }, [state, reloadPage]);

    const getCommonCodeData = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/common/code-render-multi/${'META_NATION,META_TOPIC,POST_OPEN_TYPE,POST_CATEGORY'}`)
            .then((resp) => {
                // console.log('=====commonCodeData', resp.data);
                setCommonCodeData(resp?.data);
                setLoading(false);
            })
            .catch((e) => {
                setCommonCodeData([]);
                error(e);
                setLoading(false);
            });
    };

    const getCommonRefData = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/common/ref-render-multi/POST_CATEGORY,META_TYPE`)
            .then((resp) => {
                // console.log('=====commonCodeData', resp.data);
                setCommonRefData(resp?.data);
                setLoading(false);
            })
            .catch((e) => {
                setCommonRefData([]);
                error(e);
                setLoading(false);
            });
    };

    const getMetaGroupOptions = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/ref-render-type/META`)
            .then((resp) => {
                setMetaGroupOptions(resp.data);
                setLoading(false);
            }).catch((err) => {
                error(err);
                setLoading(false);
            });
    }



    const breadcrumb = [
        { title: 'Home' },
        { title: '카테고리' },
        { title: state.title },
    ];

    return (<>
        <CustomAdminTitle title={'카테고리'} items={breadcrumb} />
        <InnerAdminDiv>
            <Flex justify='space-between' align='end'>
                <Typography.Title level={5} style={{ margin: 0, marginBottom: 24 }}>{state.title}</Typography.Title>
            </Flex>

            <Form
                form={form}
                // size={'small'}
                initialValues={{ enabled: true }}
                style={{ width: "100%" }}
                labelCol={{
                    span: 1,
                }}
            // onFinish={() => handleSubmit()}
            >

                {showCategoryEditForm &&
                    <CategoryEditForm
                        item={state?.value}
                        stateValue={state}
                        operationType={state?.operationType}
                        rowWidth={'84vw'}
                        commonCodeData={commonCodeData}
                        commonRefData={commonRefData}
                    />
                }
                {showMenuEditForm && <MenuEditForm
                    item={state?.value}
                    stateValue={state}
                    operationType={state?.operationType}
                    rowWidth={'84vw'}
                    commonCodeData={commonCodeData}
                    commonRefData={commonRefData}
                    metaGroupOptions={metaGroupOptions}
                />}
            </Form >
        </InnerAdminDiv>

        {/* <Collapse accordion items={items} onChange={(e) => handleCollapseAction(e)} /> */}
    </>);
};

export default AdminEditCategory;

//카테고리 등록,수정 폼
const CategoryEditForm = (props) => {
    const { item, operationType, commonCodeData, commonRefData, stateValue } = props;
    const [categoryItem, setCategoryItem] = useState(null);
    const [showURLComponent, setShowURLComponent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePath, setImagePath] = useState();

    const form = Form.useFormInstance();

    const { error, info } = useMsg();

    const location = useLocation();
    const navigate = useNavigate();


    const getCategoryItem = async () => {
        setLoading(true);

        return await AXIOS.get(`/api/v1/admin/category/${item?.CategoryNode.id}`)
            .then((resp) => {
                // console.log('-----getCategoryItem for id[', item.CategoryNode.id, ']');
                setCategoryItem(resp.data);
                form.setFieldsValue(resp.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                // console.log('=== insertData 에러 : ', err?.response);
                error(err);
            });
    };

    const insertNewCategory = async (items) => {
        const params = {
            path: items.path,
            menuNm: items.menuNm,
            parentId: 0,
            contentType: items.contentType,
            enabled: items.enabled ?? true,
            link: items.link ?? null,
            linkType: items.linkType ?? null,
            title: items.title,
            subTitle: items.subTitle ?? null,
            description: items.description,
            // postCategory: items.postCategory,
            imagePath: items.imagePath,
        };

        setLoading(true);
        // console.log('========insert Category', params, items);

        return await AXIOS.post(`/api/v1/admin/category`, params)
            .then((resp) => {
                // console.log('-----save category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL);
            })
            .catch((err) => {
                setLoading(false);
                // console.log('=== insertData 에러 : ', err?.response);
                error(err);
            });
    };

    const modifyCategory = async (items) => {
        const params = {
            id: items.id,
            path: items.path,
            menuNm: items.menuNm,
            parentId: items.parentId ?? 0,
            contentType: items.contentType,
            enabled: items.enabled ?? true,
            menuSeq: items.menuSeq,
            link: items.link ?? null,
            linkType: items.linkType ?? null,
            title: items.title,
            subTitle: items.subTitle ?? null,
            description: items.description,
            imagePath: items.imagePath,
            // postCategory: items.postCategory,
        };

        // console.log('========modifyCategory', params, items);
        setLoading(true);

        return await AXIOS.post(`/api/v1/admin/category`, params)
            .then((resp) => {
                // console.log('-----save category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL)
            })
            .catch((e) => {
                setLoading(false);
                error(e);
            });
    };

    const deleteCategory = async (id) => {
        //일단 신규 생성된 메뉴만 지울 것. 기존 것 건드리지 마라.(id < 40)
        const params = {
            id: id
        };

        // console.log('==========deleteCategory', item, params);
        setLoading(true);

        // if (id > 40) {
        return await AXIOS.delete(`/api/v1/admin/category/${params.id}`, params)
            .then((resp) => {
                // console.log('-----delete category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL)
            })
            .catch((e) => {
                setLoading(false);
                // console.log('=== modifyData 에러 : ', e?.response);
                error(e);
            });
        // } else {
        //     // console.log('-----지우면 안되는 메뉴');
        //     setTimeout(() => {
        //         navigate('/admin/category');
        //         setLoading(false);
        //     }, TIME_INTERVAL)
        //     return true;
        // }
    };

    const handleDeleteConfirm = (id) => {
        // console.log('=============handleDeleteConfirm');
        deleteCategory(id);
    };

    const handleCategoryContentSelect = (e) => {
        // console.log('=================', e);
        if (e == 'link') {
            form.setFieldValue('linkType', 'top');
            setShowURLComponent(true);
        } else {
            form.resetFields(['linkType', 'link']);
            setShowURLComponent(false);
        }
    };

    const resetEditForm = () => {
        // console.log('=================resetEditForm', categoryItem);
        setShowURLComponent(false);
        form.resetFields();
        form.setFieldValue('contentType', '');
        form.setFieldValue('parentId', 0);
        form.setFieldsValue(categoryItem);

        if (categoryItem?.contentType == 'link') {
            setShowURLComponent(true);
        } else {
            setShowURLComponent(false);
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        form.validateFields()
            .then((item) => {
                // console.log('===== handleSubmit params in CategoryEditForm', item);
                if (operationType == 'addCategory') {
                    item.parentId = '0';
                    item.imagePath = imagePath;
                    insertNewCategory(item);
                    // setLoading(false);
                } else if (operationType == 'editCategory') {
                    item.imagePath = imagePath;
                    modifyCategory(item);
                    // setLoading(false);
                }
            })
            .catch((e) => {
                // console.log(e);
                setLoading(false);
            });
    };

    useEffect(() => {
        //카테고리가 존재하면 읽어오고 아니면 신규임
        if (item?.CategoryNode.id) {
            // console.log('카테고리 존재하므로 수정', item.CategoryNode.id);
            getCategoryItem();
        } else {
            // console.log('카테고리 신규', item?.CategoryNode.id);
        }
    }, []);

    // useEffect(() => {
    //     resetEditForm();
    // }, [categoryItem]);

    return (
        <>
            {/* <Typography>
                <pre>
                    <div>form Data</div>
                    {JSON.stringify(item, null, 2)}
                </pre>
            </Typography> */}
            <Spin spinning={loading} >

                <Form.Item name='id' hidden><Input /></Form.Item>
                <Form.Item name='parentId' hidden><Input /></Form.Item>
                <Form.Item name='menuSeq' hidden><Input /></Form.Item>

                <StyledFormItem name='menuNm' label="카테고리"
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            message: '카테고리를 입력하세요.'
                        },
                        { max: 30, min: 1 },
                    ]}
                    wrapperCol={24}>
                    <Input showCount maxLength={30} allowClear size='middle' />
                </StyledFormItem>

                <StyledFormItem name='path' label="경로명"
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            message: '경로명을 입력하세요.'
                        },
                        { pattern: /^[a-zA-Z0-9-_]+$/, message: '영대소문자, 숫자, 특수기호 "-","_" 만 가능합니다.' },

                    ]}
                    wrapperCol={24}
                    hidden={categoryItem?.staticYn}
                >
                    <Input showCount allowClear size='middle' />
                </StyledFormItem>

                <StyledFormItem name='title' label={'Title'}
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            message: '타이틀을 입력하세요.'
                        },
                        { max: 100, min: 1, }
                    ]}
                    wrapperCol={24}>
                    <Input showCount maxLength={100} allowClear size='middle' />
                </StyledFormItem>

                <StyledFormItem name='subTitle' label={'Sub Title'}
                    rules={[
                        { max: 100, min: 1, }
                    ]}
                    wrapperCol={24}>
                    <Input showCount maxLength={100} allowClear size='middle' />
                </StyledFormItem>
                <StyledFormItem name='description' label={'카테고리 설명'}
                    rules={[
                        // { required: true, message: '카테고리 설명을 입력하세요.' },
                        { max: 100, },
                    ]}
                    // style={{ marginBottom: 24, marginRight: 0, marginLeft: 0, marginTop: 10 }}
                    wrapperCol={24}>
                    <Input.TextArea
                        showCount
                        maxLength={100}
                        rows={5}
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        allowClear

                        size='middle'
                        style={{ marginBottom: 20 }}
                    />
                </StyledFormItem>

                <Flex gap={8}>
                    <StyledFormItem name='contentType' label={'컴포넌트'} style={{ width: 'fit-content' }} hidden={categoryItem?.staticYn}>
                        <Select popupMatchSelectWidth={false} style={{ width: 140 }} options={selectOptions} onChange={(e) => handleCategoryContentSelect(e)} size='middle' />
                    </StyledFormItem>
                    {showURLComponent &&
                        <>
                            <Form.Item
                                name='link'
                                label={'URL'}
                                labelCol={1}

                                rules={[
                                    { required: true },
                                    // { pattern: /^[a-zA-Z0-9-_]+$/, message: '이거 안됨' }
                                ]}
                            >
                                <Input allowClear size='middle' />
                            </Form.Item>

                            <Form.Item
                                name='linkType'
                                label={'Target'}
                                labelCol={1}
                            >
                                <Radio.Group>
                                    <Space.Compact>
                                        <Radio value={'top'}>Top</Radio>
                                        <Radio value={'blank'}>Blank</Radio>
                                    </Space.Compact>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    }
                </Flex>
                {/* <StyledFormItem name='postCategory' label={'카테고리 구분'} style={{ width: 'fit-content' }}>
                    <Select popupMatchSelectWidth={false} style={{ width: 140 }} options={postCategoryOptions} size='middle' />
                </StyledFormItem> */}

                <StyledFormItem label={'배너 이미지'}>
                    <BannerImageUploadComps initialImagePath={categoryItem?.imagePath} setImagePath={setImagePath} />
                </StyledFormItem>

                <StyledFormItem name='enabled' label={'사용여부'}>
                    <Radio.Group >
                        <Radio value={true}>사용</Radio>
                        <Radio value={false}>사용안함</Radio>
                    </Radio.Group>
                </StyledFormItem>

                <Flex justify='center' gap={12} style={{ marginTop: 24 }}>
                    <Button onClick={() => navigate('/admin/category')} size='large' style={{ width: 114 }}>
                        목록
                    </Button>
                    <Button size='large' style={{ width: 114 }} onClick={() => resetEditForm()} >취소</Button>
                    {operationType.includes('edit') && !categoryItem?.staticYn && (
                        item.ChildExist ?
                            <Popconfirm
                                title='카테고리 삭제 불가'
                                description={() => {
                                    return <div style={{ fontSize: 13 }}>
                                        {categoryItem?.menuNm}
                                        <p>해당 카테고리에 등록되어 <br />있는 메뉴가 있습니다.</p>
                                        <p>메뉴를 이동하시거나 삭제 후 <br />카테고리 삭제가 가능합니다.</p>
                                    </div>
                                }}
                                // onConfirm={() => handleDeleteConfirm(categoryItem?.id)}
                                // onCancel={cancel}
                                // okText='예2'
                                okButtonProps={{ style: { width: '100%' } }}
                                showCancel={false}
                            >
                                <Button size='large' style={{ width: 114 }} danger type={'primary'}>삭제</Button>
                            </Popconfirm>
                            :
                            <Popconfirm
                                title='카테고리 삭제'
                                description={categoryItem?.menuNm + '를 삭제합니다.'}
                                onConfirm={() => handleDeleteConfirm(categoryItem?.id)}
                                // onCancel={cancel}
                                okText='예'
                                okButtonProps={{ style: { width: '60px' } }}
                                cancelText='아니오'
                                calCelButtonProps={{ style: { width: '60px' } }}>
                                <Button size='large' style={{ width: 114 }} danger type={'primary'}>삭제</Button>
                            </Popconfirm>
                    )
                    }
                    <Button size='large' style={{ width: 114 }} type={'primary'} onClick={() => handleSubmit()}>등록</Button>
                </Flex>

            </Spin >
        </>);
}

//메뉴 등록,수정 폼
const MenuEditForm = (props) => {
    const { item, operationType, commonCodeData, commonRefData, stateValue, metaGroupOptions } = props;
    const [menuItem, setMenuItem] = useState(null);
    const [showURLComponent, setShowURLComponent] = useState(false);
    const [showDetailType, setShowDetailType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [parentItem, setParentItem] = useState(null);
    const [parentItemTrans, setParentItemTrans] = useState(null);
    const [imagePath, setImagePath] = useState();
    const [groupCodeRequiredMap, setGroupCodeRequiredMap] = useState({});

    const form = Form.useFormInstance();

    const { error, info } = useMsg();

    const location = useLocation();
    const navigate = useNavigate();

    const getMenuItem = async () => {
        setLoading(true);

        return await AXIOS.get(`/api/v1/admin/category/${item?.MenuId}`)
            .then((resp) => {
                // console.log('-----getCategoryItem for id[', item.MenuId, ']');
                setMenuItem(resp.data);
                form.setFieldsValue(resp.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                // console.log('=== insertData 에러 : ', err?.response);
                error(err);
            });
    };

    const insertNewMenu = async (item) => {
        const params = {
            path: item.path,
            menuNm: item.menuNm,
            parentId: item.parentId ?? item.CategoryNode.id,
            contentType: item.contentType,
            enabled: item.enabled ?? true,
            link: item.link ?? null,
            linkType: item.linkType ?? null,
            nations: item?.nations ?? [],
            tipics: item?.topics ?? [],
            postCategory: item.postCategory ?? 'editor',
        };

        setLoading(true);
        // console.log('========insert Menu', params, item);

        return await AXIOS.post(`/api/v1/admin/category`, item)
            .then((resp) => {
                // console.log('-----save category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL);
            })
            .catch((err) => {
                setLoading(false);
                // console.log('=== insertData 에러 : ', err?.response);
                error(err);
            });
    };

    const modifyMenu = async (item) => {
        const params = {
            id: item.id,
            path: item.path,
            menuNm: item.menuNm,
            contentType: item.contentType,
            menuSeq: item.menuSeq,
            enabled: item.enabled ?? true,
            link: item.link ?? null,
            linkType: item.linkType ?? null,
            nations: item?.nations ?? [],
            tipics: item?.topics ?? [],
            title: item?.menuNm,
            description: item?.description,
            imagePath: item?.imagePath,
            postCategory: item.postCategory,
        };

        setLoading(true);
        // console.log('========modifyMenu', params, item);

        return await AXIOS.post(`/api/v1/admin/category`, item)
            .then((resp) => {
                // console.log('-----save category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL);
            })
            .catch((err) => {
                setLoading(false);
                // console.log('=== insertData 에러 : ', err?.response);
                error(err);
            });
    };

    const deleteMenuItem = async (id) => {
        //일단 신규 생성된 메뉴만 지울 것. 기존 것 건드리지 마라.(id < 40)
        const params = {
            id: id
        };

        // console.log('==========deleteCategory', item, params);
        setLoading(true);

        return await AXIOS.delete(`/api/v1/admin/category/${params.id}`, params)
            .then((resp) => {
                // console.log('-----delete category ok');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/admin/category');
                }, TIME_INTERVAL)
            })
            .catch((e) => {
                setLoading(false);
                // console.log('=== modifyData 에러 : ', e?.response);
                error(e);
            });
    };

    const handleDeleteConfirm = (id) => {
        // console.log('=============handleDeleteConfirm');
        deleteMenuItem(id);
    };

    const handleCategoryContentSelect = (e) => {
        // console.log('=================', e);
        if (e == 'link') {
            form.setFieldValue('linkType', 'top');
            setShowURLComponent(true);
            setShowDetailType(false);
        } else {
            form.resetFields(['linkType', 'link']);
            setShowURLComponent(false);
            setShowDetailType(true);
        }
    };

    const resetEditForm = () => {
        // console.log('=================resetEditForm');
        setShowURLComponent(false);
        // form.resetFields();
        // form.setFieldValue('contentType', 'post');
        if (menuItem?.contentType == 'link') {
            setShowURLComponent(true);
        } else {
            setShowURLComponent(false);
        }
        if (!isEmptyCheck(menuItem?.id)) {
            form.setFieldsValue(menuItem);
        } else {
            form.resetFields();
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        form.validateFields()
            .then((item) => {
                // console.log('===== handleSubmit params', item, operationType);
                if (operationType == 'addMenu') {
                    item.parentId = parentItem.id;
                    item.imagePath = imagePath;
                    setLoading(false);
                    insertNewMenu(item);
                } else if (operationType == 'editMenu') {
                    setLoading(false);
                    item.imagePath = imagePath;
                    modifyMenu(item);
                } else {
                    setLoading(false);
                    return
                }
            })
            .catch((e) => {
                // console.log(e);
                setLoading(false);
            });
    };

    const changeCategoryItemFormat = (parentItem) => {
        // console.log('parentItem', parentItem);
        let returnArray = [];
        let kkk = Object.keys(parentItem).map((item) => {
            return { label: item, children: parentItem[item] };
        });
        setParentItemTrans(kkk);

        // console.log('---------------', kkk, parentItem, returnArray);
    };

    useEffect(() => {
        setParentItem(stateValue.value.CategoryNode);
        //MenuId 존재하면 Menu읽어오고 아니면 신규임
        if (item?.MenuId) {
            // console.log('메뉴 존재하므로 수정', item.MenuId);
            getMenuItem();
        } else {
            // console.log('메뉴 신규', item);
        }
    }, []);


    useEffect(() => {
        if (parentItem) changeCategoryItemFormat(parentItem);
    }, [parentItem]);

    // menuItem이 설정된 후 metaFieldInfo 초기값 설정
    useEffect(() => {
        if (menuItem?.metaFieldInfo && Array.isArray(menuItem.metaFieldInfo)) {
            const initialGroupCodeRequiredMap = {};
            const updatedMetaFieldInfo = menuItem.metaFieldInfo.map((field, index) => {
                if (field.metaType) {
                    const type = field.metaType.toLowerCase();
                    initialGroupCodeRequiredMap[index] = type !== 'input';
                }
                return {
                    ...field,
                    metaKey: `item${index + 1}`
                };
            });
            setGroupCodeRequiredMap(initialGroupCodeRequiredMap);
            form.setFieldValue('metaFieldInfo', updatedMetaFieldInfo);
        }
    }, [menuItem]);

    // Form.List의 metaKey 값들을 동적으로 설정
    useEffect(() => {
        const metaFieldInfo = form.getFieldValue('metaFieldInfo');
        if (metaFieldInfo && Array.isArray(metaFieldInfo)) {
            const updatedMetaFieldInfo = metaFieldInfo.map((field, index) => ({
                ...field,
                metaKey: `item${index + 1}`,
                metaDisplayOrder: index + 1
            }));
            form.setFieldValue('metaFieldInfo', updatedMetaFieldInfo);
        }
    }, [form.getFieldValue('metaFieldInfo')?.length]);

    const handleMetaTypeChange = (fieldKey, value) => {
        const type = value?.toLowerCase();
        const isRequired = type !== 'input';

        setGroupCodeRequiredMap(prev => ({
            ...prev,
            [fieldKey]: isRequired
        }));
    }

    const isGroupCodeRequiredForField = (fieldKey) => {
        return groupCodeRequiredMap[fieldKey] || false;
    }

    return (
        <div style={{ marginTop: 24 }}>
            <Spin spinning={loading} >

                {/* <Typography>
                <pre>
                    {JSON.stringify(parentItem, null, 2)}
                    {JSON.stringify(stateValue, null, 2)}
                </pre>
            </Typography>
            <br /> */}
                {/* <div style={{ width: '39vw', border: '0px solid red', padding: 0, margin: 0 }}>
                <Descriptions
                    style={{ border: '0px solid blue', padding: 0, marging: 0 }}
                    variant={false}
                    size={'small'}
                    colon={false}
                    column={1}
                    items={parentItemTrans}
                    labelStyle={{ width: '6.8vw', background: 'red', color: 'white', padding: '10, 0, 0, 10', margin: 0 }}
                    contentStyle={{ color: 'cyan', background: 'brown', padding: '10, 0, 0, 10', margin: '0px' }} />
            </div> */}
                {/* 부모 카테고리 표시, 읽기 전용*/}

                <StyledFormItem style={{ marginBottom: 0 }} label={'카테고리 명'}  > <p className='txt-box'>{parentItem?.menuNm}</p> </StyledFormItem>
                <StyledFormItem style={{ marginBottom: 0 }} label={'경로 명'}  > <p className='txt-box'>{parentItem?.path}</p></StyledFormItem>
                <StyledFormItem style={{ marginBottom: 0 }} label={'카테고리 설명'}  > <p className='txt-box'> {parentItem?.description} </p></StyledFormItem>
                <StyledFormItem style={{ marginBottom: 0 }} label={'컴포넌트'}  > <p className='txt-box'>  {parentItem?.contentType == 'link' ? 'Link' : 'Sub Main'}</p></StyledFormItem>
                <StyledFormItem style={{ marginBottom: 0 }} label={'사용여부'}  > <p className='txt-box'> {parentItem?.enabled ? '사용' : '사용 안함'} </p></StyledFormItem>


                <Form.Item name='id' hidden><Input /></Form.Item>
                <Form.Item name='parentId' hidden><Input /></Form.Item>
                <Form.Item name='menuSeq' hidden><Input /></Form.Item>

                <SubTitleDivider />
                <StyledFormItem label={'메뉴명'} style={{ marginTop: 32 }}
                    name='menuNm'
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            message: '메뉴명을 입력하세요.'
                        },
                        { max: 30, min: 1 },
                    ]}
                    wrapperCol={24}><Input showCount maxLength={30} allowClear size='middle'

                    />
                </StyledFormItem>

                <StyledFormItem name='title' label={'Title'}
                    rules={[
                        {
                            whitespace: true,
                        },
                        { max: 100, min: 1, }
                    ]}
                    wrapperCol={24}>
                    <Input showCount maxLength={100} allowClear size='middle' />
                </StyledFormItem>

                <StyledFormItem name='description' label={'설명'}
                    rules={[
                        { max: 100, },
                    ]}
                    wrapperCol={24}>
                    <Input.TextArea
                        showCount
                        maxLength={100}
                        rows={5}
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        allowClear

                        size='middle'
                        style={{ marginBottom: 20 }}
                    />
                </StyledFormItem>

                <StyledFormItem label={'경로명'}
                    name='path'
                    rules={[
                        {
                            whitespace: true,
                            required: true,
                            message: '경로명을 입력하세요.'
                        },
                        { pattern: /^[a-zA-Z0-9-_]+$/, message: '영대소문자, 숫자, 특수기호 "-","_" 만 가능합니다.' },
                    ]}
                    wrapperCol={24}
                    hidden={menuItem?.staticYn}
                >
                    <Input showCount allowClear size='middle' />
                </StyledFormItem>

                <Flex gap={8} align='center'>
                    <StyledFormItem label={'컴포넌트'} name='contentType' style={{ width: 'fit-content' }} hidden={menuItem?.staticYn}>
                        <Select style={{ width: 140 }} size='middle' options={selectSubOptions} onChange={(e) => handleCategoryContentSelect(e)} />
                    </StyledFormItem>
                    {/* 컴포넌트를 link로 선택 했을 때 */}
                    {showURLComponent &&
                        <>
                            <Form.Item label={'URL'} labelCol={1}
                                name='link'
                                rules={[
                                    { required: true },
                                    // { pattern: /^[a-zA-Z0-9-_]+$/, message: '이거 안됨' }
                                ]}
                            >
                                <Input allowClear style={{ width: 300 }} size='middle' />
                            </Form.Item>
                            <Form.Item
                                label={'Target'}
                                labelCol={1}
                                name='linkType'
                            >
                                <Radio.Group >
                                    <Space.Compact>
                                        <Radio value={'top'}>Top</Radio>
                                        <Radio value={'blank'}>Blank</Radio>
                                    </Space.Compact>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    }
                </Flex>
                {showDetailType && !menuItem?.staticYn &&
                    <StyledFormItem name='postCategory' label={'포스트 상세 타입'} style={{ width: 'fit-content' }}>
                        <Select popupMatchSelectWidth={false} style={{ width: 140 }} options={commonRefData?.POST_CATEGORY} size='middle' />
                    </StyledFormItem>
                }
                <StyledFormItem label="메타 필드 정보" hidden={menuItem?.staticYn}>
                    <Form.List name="metaFieldInfo">
                        {(fields, { add, remove, move }) => {
                            // add 함수 오버라이드하여 metaKey 자동 설정
                            const handleAdd = () => {
                                const newIndex = fields.length;
                                add({
                                    metaKey: `item${newIndex + 1}`
                                });
                            };

                            // move 함수 오버라이드하여 metaKey 재정렬
                            const handleMove = (from, to) => {
                                move(from, to);
                                setTimeout(() => {
                                    const metaFieldInfo = form.getFieldValue('metaFieldInfo');
                                    if (metaFieldInfo && Array.isArray(metaFieldInfo)) {
                                        const updated = metaFieldInfo.map((field, idx) => ({
                                            ...field,
                                            metaKey: `item${idx + 1}`,
                                        }));
                                        form.setFieldValue('metaFieldInfo', updated);
                                    }
                                }, 0);
                            };

                            return (
                                <>
                                    {fields.map(({ key, name, ...restField }, idx) => (
                                        <Space
                                            key={key}
                                            align="baseline"
                                            style={{ display: 'flex' }}
                                        >
                                            {/* metaType */}
                                            <StyledFormItem
                                                {...restField}
                                                name={[name, 'metaType']}
                                                rules={[{ required: true, message: '입력방식을 선택해주세요.' }]}
                                            >
                                                <Select
                                                    options={commonRefData?.META_TYPE}
                                                    placeholder="입력방식"
                                                    style={{ width: 140 }}
                                                    onChange={(e) => handleMetaTypeChange(key, e)}
                                                />
                                            </StyledFormItem>
                                            {/* groupCode */}
                                            <StyledFormItem
                                                {...restField}
                                                name={[name, 'groupCode']}
                                                rules={isGroupCodeRequiredForField(key) ? [{ required: true, message: '선택 옵션은 필수 입니다.' }] : []}
                                            >
                                                <Select
                                                    disabled={!isGroupCodeRequiredForField(key)}
                                                    options={metaGroupOptions}
                                                    placeholder="선택 옵션"
                                                    style={{ width: 180 }}
                                                />
                                            </StyledFormItem>
                                            {/* metaNm */}
                                            <StyledFormItem
                                                {...restField}
                                                name={[name, 'metaNm']}
                                                rules={[{ required: true, message: '표시 항목명을 입력하세요.' }]}
                                            >
                                                <Input placeholder="표시 항목명" style={{ width: 200 }} />
                                            </StyledFormItem>
                                            {/* metaKey (자동생성, readonly) */}
                                            <StyledFormItem
                                                {...restField}
                                                name={[name, 'metaKey']}
                                            >
                                                <Input readOnly disabled style={{ width: 80 }} />
                                            </StyledFormItem>
                                            <StyledFormItem name={[name, 'metaDisplayOrder']} hidden>
                                                <Input type='hidden' readOnly />
                                            </StyledFormItem>
                                            {/* move up/down */}
                                            <Button icon={<CaretUpFilled />} onClick={() => handleMove(name, name - 1)} disabled={idx === 0} />
                                            <Button icon={<CaretDownFilled />} onClick={() => handleMove(name, name + 1)} disabled={idx === fields.length - 1} />
                                            {/* 삭제 */}
                                            <Button type="primary" size="small" danger onClick={() => remove(name)}>삭제</Button>
                                        </Space>
                                    ))}
                                    <Button
                                        onClick={handleAdd}
                                        icon={<PlusOutlined />}
                                        disabled={fields.length >= 10}
                                        type="dashed"
                                        style={{ marginBottom: 8, marginTop: 4, width: '100%' }}
                                    >
                                        추가
                                    </Button>
                                </>
                            );
                        }}
                    </Form.List>
                    <Divider />
                </StyledFormItem>

                <StyledFormItem label={'배너 이미지'}>
                    <BannerImageUploadComps initialImagePath={menuItem?.imagePath} setImagePath={setImagePath} />
                </StyledFormItem>

                <StyledFormItem label={'사용여부'}
                    // noStyle={true}
                    name='enabled' >
                    <Radio.Group >
                        <Radio value={true}>사용</Radio>
                        <Radio value={false}>사용안함</Radio>
                    </Radio.Group>
                </StyledFormItem>

                <Flex justify='center' gap={12} style={{ marginTop: 24 }}>
                    <Button onClick={() => navigate('/admin/category')} size='large' style={{ width: 114 }}>
                        목록
                    </Button>
                    <Button type={'default'} onClick={() => resetEditForm()} size='large' style={{ width: 114 }}>취소</Button>
                    {operationType.includes('edit') && !menuItem?.staticYn &&
                        <Popconfirm
                            title='메뉴 삭제'
                            description={menuItem?.menuNm + '를 삭제합니다.'}
                            onConfirm={() => handleDeleteConfirm(menuItem?.id)}
                            // onCancel={cancel}
                            okText='예'
                            okButtonProps={{ style: { width: '60px' } }}
                            cancelText='아니오'
                            calCelButtonProps={{ style: { width: '60px' } }}>
                            <Button type={'primary'} size='large' style={{ width: 114 }} danger>삭제</Button>
                        </Popconfirm>
                    }
                    <Button type={'primary'} onClick={() => handleSubmit()} size='large' style={{ width: 114 }}>등록</Button>
                </Flex>
            </Spin >
        </div>);
}


const StyledCheckboxGroup = styled(Checkbox.Group)`
    .ant-checkbox-wrapper{flex: 0 0 13%;}
`;

