// Post한개에 대한 편집 form
import { App, Button, Checkbox, Select, Form, Input, Space, Radio, Switch, Tag, Row, Col } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AXIOS } from 'utils/axios';
import { errorMsg, isCtrlKey, isEmptyCheck } from 'utils/helpers';
import { useMsg } from 'hooks/helperHook';
import { Link, Route, useNavigate, useParams, useLocation, } from "react-router-dom";
import { useUserInfo } from 'hooks/useUserInfo'
import { BreadcrumbRow } from 'components/page_bak/BreadcrumbRow';
import styled from 'styled-components';

export const PostInputForm = ({ form, postInfo, isPost = true, metas }) => {
    // const [form] = Form.useForm();
    const [allMenus, setAllMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [menu1Id, setMenu1Id] = useState()
    const { postId } = useParams();
    const [menu1Option, setMenu1Option] = useState([]);
    const [menu2Option, setMenu2Option] = useState([]);
    const [openOptions, setOpenOptions] = useState([]);
    const { error, info } = useMsg();
    const userInfo = useUserInfo();
    // 메타정보 state
    const [nationOptions, setNationOptions] = useState([]);
    const [topicOptions, setTopicOptions] = useState([]);
    // 태그 state
    const [tags, setTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const [tagInput, setTagInput] = useState("");
    const MAX_TAGS = 30; // 최대 태그 수


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

    useEffect(() => {
        if (metas?.tags?.length > 0) {
            setTags(metas?.tags?.map(e => e.value.replaceAll('#', '')));
        }
    }, [metas])

    useEffect(() => {
        form.setFieldsValue({ meta: { tags: tags } });
    }, [tags])


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
                const menu1s = fetchedMenus?.filter(e => e.parentId === 0 && ((e.contentType === 'post' || (e.contentType ?? '') === '') && !e.staticYn && e.enabled))?.map(e => { return { value: e.id, label: e.menuNm } })
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


    // 태그 추가
    const addTag = (e) => {
        if (!e.target || !e.target.value.trim()) return;
        const newTag = e.target.value.replace(/[#,./]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');

        setTagInput("");

        const updatedTags = [...tags, ...Array.from(new Set(newTag)).filter(t => !tags.includes(t))].slice(0, MAX_TAGS)?.map(e => e.substring(0, 50));

        if (tags.length >= MAX_TAGS) {
            return;
        }

        if (updatedTags.every(e => tags.includes(e))) {
            return;
        }

        setTags(updatedTags);
        form.setFieldsValue({ meta: { tags: updatedTags } });
    };

    // 태그 제거
    const removeTag = (tag) => {
        const updatedTags = tags?.filter((t) => t !== tag);
        setTags(updatedTags);
        form.setFieldsValue({ meta: { tags: updatedTags } });
    };

    // 태그 전체 제거
    const removeTagAll = () => {
        setTags([]);
        form.setFieldsValue({ meta: { tags: [] } });
    }


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
                                style={{ marginBottom: 23 }}
                                label={
                                    <div>
                                        <div>{`태그 (${tags?.length ?? 0})`}</div>
                                    </div>
                                }
                            >
                                <Input
                                    onKeyDown={(e) => {
                                        if ((e.code === 'Space' || e.code === "Enter") && !isEmptyCheck(tagInput)) {
                                            setTimeout(() => {
                                                addTag(e);
                                            }, 100);
                                        }
                                    }}
                                    placeholder={'태그 입력 후 Enter'}
                                    onChange={(e) => setTagInput(() => e.target.value.trim() ?? "")}
                                    value={tagInput}
                                />
                            </Form.Item>
                            {tags?.length > 0 &&
                                <Form.Item
                                    label={tags?.length > 0 && <Button size='small' style={{ fontSize: 11 }} onClick={removeTagAll}>전체 삭제</Button>}
                                    name={["meta", "tags"]}
                                    style={{ marginBottom: 0 }}
                                    className='tagFormItem'
                                >
                                    {tags?.length > 0 &&
                                        <>
                                            {tags?.map((tag, index) => (
                                                <Tag
                                                    key={`tag-${index}`}
                                                    closable
                                                    onClose={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        removeTag(tag);
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        if (isCtrlKey(e)) {
                                                            removeTag(tag);
                                                        }
                                                    }}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </>
                                    }
                                </Form.Item>}
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

            </Form >
        </>
    )
}
