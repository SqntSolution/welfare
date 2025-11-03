// Post한개에 대한 편집 form
import { App, Button, Checkbox, Select, Form, Input, Space, Radio, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { AXIOS } from 'utils/axios';
import { errorMsg } from 'utils/helpers';
import { useMsg } from 'hooks/helperHook';
import { Link, Route, useNavigate, useParams, useLocation, } from "react-router-dom";
import { useUserInfo } from 'hooks/useUserInfo'
import { BreadcrumbRow } from 'components/page_bak/BreadcrumbRow';
import styled from 'styled-components';

export const PostInputForm = ({ form, postInfo, isPost = true }) => {
    // const [form] = Form.useForm();
    const [allMenus, setAllMenus] = useState([])
    const [loading, setLoading] = useState(false)
    // const [menu1Id, setMenu1Id] = useState()
    const { postId } = useParams();
    const [menu1Option, setMenu1Option] = useState([])
    const [menu2Option, setMenu2Option] = useState([])
    const [nationOptions, setNationOptions] = useState([])
    const [topicOptions, setTopicOptions] = useState([])
    const [openOptions, setOpenOptions] = useState([])
    const { error, info } = useMsg()
    const userInfo = useUserInfo()

    useEffect(() => {
        if (isPost) {
            getAllMenus()
        }
        getCodes()
        if (postId != null) {
            // 편집
            form.setFieldValue(["info", "id"], postId)
        } else {
            // 신규등록일때는, 공개의 default값은 '임시'
            form.setFieldValue(["info", "openType"], 'temp')
        }
    }, [])

    // 카테고리1이 바뀌면, 그에 따라 카테고리2 option을 바꿔줘야.
    const onChangeMenu1 = (value) => {
        const option = allMenus?.filter(e => e.parentId == value).map(e => { return { value: e?.id, label: e?.menuNm } })
        // console.log("=== form : ", value, option)
        setMenu2Option(option)
        form.setFieldValue(['info', 'menu2Id'], null)
        form.validateFields(['info', 'menu2Id']) // => 이게 왜 안먹지?
        // form.validateFields() // => 이게 왜 안먹지?
    }

    useEffect(() => {
        // console.log("=== postInfo useEffect")
        if (isPost) {
            setMenu2OptionsInInit()
        }
    }, [postInfo])

    // 젤 처음 데이타를 조회했을때는 menu1의 onChange 이벤트가 동작하지 않으므로, 강제로 menu2 option을 만들어줘야 함.
    const setMenu2OptionsInInit = () => {
        if (menu2Option?.length == 0 && allMenus?.length > 0) {
            const menu1Value = form?.getFieldValue(["info", "menu1Id"])
            const option = allMenus?.filter(e => e.parentId == menu1Value).map(e => { return { value: e?.id, label: e?.menuNm } })
            setMenu2Option(option)
        }
    }


    // 메뉴 selectbox를 만들기 위해서 조회
    const getAllMenus = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/all-menus`)
            .then((resp) => {
                /*
                    {
                        "id": 9,
                        "path": "notice",
                        "menuNm": "Notice",
                        "parentId": 8,
                        "parentPath": "cs-center",
                        "parentNm": "CS Center"
                    },
                */
                const fetchedMenus = resp?.data
                setAllMenus(fetchedMenus)
                const menu1s = fetchedMenus?.filter(e => e.parentId == 0 && (e.contentType == 'post' || (e.contentType ?? '') == ''))?.map(e => { return { value: e.id, label: e.menuNm } })
                setMenu1Option(menu1s)

            })
            .catch((err) => {
                setAllMenus([])
                console.log('=== getAllMenus 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };


    // code 조회
    const getCodes = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/common/code-render-multi/META_NATION,META_TOPIC,POST_OPEN_TYPE`)
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
                setTopicOptions(data?.META_TOPIC)
                setOpenOptions(data?.POST_OPEN_TYPE)
            })
            .catch((err) => {
                console.log('=== getAllMenus 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };


    return (
        <>
            {
                // 신규 등록일때는 Breadcrumb을 보여줄 필요 없음.
                (postId == null) ? (
                    null
                ) : (
                    <BreadcrumbRow menu1={{ id: postInfo?.menu1Id, name: postInfo?.menuName1, path: postInfo?.menuEngName1 }}
                        menu2={{ id: postInfo?.menu2Id, name: postInfo?.menuName2, path: postInfo?.menuEngName2 }} />
                )
            }

            <Form labelCol={{ span: 2, }}
                wrapperCol={{ span: 24, }}
                layout="horizontal"
                style={{ width: '100%', marginTop: 24 }}
                colon={false}
                form={form}
            >
                {/* form : {JSON.stringify(form.getFieldsValue())} <br /> */}
                <Form.Item
                    name={['info', 'postType']}
                    hidden={true}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="제 목"
                    name={['info', 'title']}
                    rules={[{ required: true, message: '필수 입력', },]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="설 명"
                    name={["info", "description"]}
                    rules={[{ required: true, message: '필수 입력', },]}
                >
                    <Input.TextArea autoSize />
                </Form.Item>

                {
                    isPost ? (
                        <Form.Item
                            label="카테고리"
                            rules={[{ required: true, message: '필수 입력', },]}
                        >
                            <Space>
                                {/* 수정할때는 카테고리는 수정을 못함. */}
                                <Form.Item
                                    name={["info", "menu1Id"]}
                                    rules={[{ required: true, message: '필수 입력', },]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        style={{ width: 400, }}
                                        onChange={onChangeMenu1}
                                        options={menu1Option}
                                        disabled={postId != null}
                                        placeholder="1차 카테고리"
                                        popupClassName="custom-dropdown"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={["info", "menu2Id"]}
                                    rules={[{ required: true, message: '필수 입력', },]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        style={{ width: 400 }}
                                        options={menu2Option}
                                        disabled={postId != null}
                                        placeholder="2차 카테고리"
                                        popupClassName="custom-dropdown"
                                    />
                                </Form.Item>
                            </Space>
                        </Form.Item>
                    ) : (
                        null
                    )
                }


                {
                    isPost ? (
                        <>
                            <Form.Item
                                label="태그"
                                name={["meta", "tags"]}
                            >
                                <Select
                                    mode="tags"
                                    style={{ width: '100%', }}
                                    placeholder="태그 입력 (최대 30개)"
                                    tokenSeparators={[',', ' ']}
                                    options={[]}
                                    allowClear
                                    maxCount={30}
                                    open={false}
                                />
                            </Form.Item>

                            <Form.Item
                                label="국가"
                                name={["meta", "nations"]}
                            >
                                <Checkbox.Group options={nationOptions} />
                            </Form.Item>

                            <Form.Item
                                label="주제"
                                name={["meta", "topics"]}
                            >
                                <Checkbox.Group options={topicOptions} />
                            </Form.Item>
                        </>

                    ) : (
                        null
                    )
                }



                {/* 컨텐츠 관리자는 상태를 바꿀수 없음.  */}
                <Form.Item
                    label="공개"
                    name={["info", "openType"]}
                    rules={[{ required: true, message: '필수 입력', },]}
                >
                    <Radio.Group options={openOptions} disabled={userInfo?.role == 'ROLE_CONTENTS_MANAGER'} />
                </Form.Item>

                {
                    isPost ? (
                        <Form.Item
                            label="전략마케팅"
                            name={["info", "strategicMarketingOnly"]}
                            valuePropName="checked"
                        >
                            <Checkbox>전략마케팅 전용 콘텐츠 입니다.</Checkbox>
                        </Form.Item>

                    ) : (
                        null
                    )
                }

            </Form>
        </>
    )
}
