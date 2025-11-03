// Post한개에 대한 편집 form
import { Button, Select, Form, Input, Space, Radio, Tag, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { AXIOS } from 'utils/axios';
import { isCtrlKey, isEmptyCheck } from 'utils/helpers';
import { useMsg } from 'hooks/helperHook';
import { useParams } from "react-router-dom";
import { useUserInfo } from 'hooks/useUserInfo';
import { BreadcrumbRow } from 'components/page_bak/BreadcrumbRow';
import styled, { css } from 'styled-components';
import { SFMedia } from 'styles/StyledFuntion';

export const PostInputForm = ({ form, postInfo, isPost = true, metas, menus = [], postCategory, setPostCategory }) => {
    // const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const [menu1Id, setMenu1Id] = useState()
    const { postId } = useParams();
    const [menu1Options, setMenu1Options] = useState([]);
    const [menu2Options, setMenu2Options] = useState([]);
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
    const [columnInfo, setColumnInfo] = useState([]);
    const MAX_TAGS = 30; // 최대 태그 수


    useEffect(() => {
        getCodes();
        if (postId != null) {
            // 편집
            form.setFieldValue(["info", "id"], postId);
        } else {
            // 신규등록일때는, 공개의 default값은 '임시'
            form.setFieldValue(["info", "openType"], 'temp');
        }
    }, [])

    useEffect(() => {
        if (isPost && menus?.length) {
            getMenu1List();
        }
    }, [menus])

    // 카테고리1이 바뀌면, 그에 따라 카테고리2 option을 바꿔줘야.
    const onChangeMenu1 = (value, option) => {
        let menu2List = [];
        if (option?.menuChildren?.length) {
            menu2List = option?.menuChildren?.filter((e) => !e.staticYn && e.enabled)?.map((menu) => { return { value: menu?.id, label: menu?.menuNm, postCategory: menu?.postCategory, menuEngNm: menu.menuEngNm } });
        }
        setMenu2Options(menu2List);
        form.setFieldValue(['info', 'menu2Id'], null);
        form.validateFields([['info', 'menu2Id']]);
    }

    const onChangeMenu2 = (value, option) => {
        setPostCategory(option.postCategory);
        if (!isEmptyCheck(value)) {
            const menu1 = form.getFieldValue(['info', 'menu1Id']);
            const menu1Nm = menu1Options.find(e => e.value === menu1)?.menuEngNm;
            const menu2Nm = option?.menuEngNm;

            getColumnInfo(menu1Nm, menu2Nm);
        }
        form.setFieldValue(['info', 'metaInfoItems']);
    }

    useEffect(() => {
        if (isPost && menu1Options?.length) {
            setMenu2OptionsInInit();
        }
        if (isPost && !isEmptyCheck(postInfo?.id)) {
            getColumnInfo(postInfo?.menuEngName1, postInfo?.menuEngName2);
        }
    }, [menu1Options, postInfo])

    // 젤 처음 데이타를 조회했을때는 menu1의 onChange 이벤트가 동작하지 않으므로, 강제로 menu2 option을 만들어줘야 함.
    const setMenu2OptionsInInit = () => {
        if (!menu2Options?.length && menu1Options?.length) {
            const menu1Value = form?.getFieldValue(["info", "menu1Id"]);
            const option = menu1Options?.find((e) => e.value === menu1Value)?.menuChildren?.map((menu) => { return { value: menu?.id, label: menu?.menuNm, postCategory: menu?.postCategory } })
            setMenu2Options(option)
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


    // 메뉴1 셀렉트 리스트를 생성
    const getMenu1List = () => {
        const menu1List = menus?.filter(e => (e.contentType === 'post' || (e.contentType ?? '') === '') && !e.staticYn && e.enabled)?.map((menu => ({ value: menu.id, label: menu.menuNm, menuChildren: menu.menuChildren, menuEngNm: menu.menuEngNm })));
        setMenu1Options(menu1List);
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
                console.log('=== getCodes 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    // 작성가능한 컬럼 조회
    const getColumnInfo = (menu1, menu2) => {
        if (isEmptyCheck(menu1) || isEmptyCheck(menu2)) {
            return;
        }

        setLoading(true);

        AXIOS.get(`/api/v1/user/post/field/${menu1}/${menu2}`)
            .then((res) => {
                const columns = res.data;
                setColumnInfo(columns);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            })
            .finally(() => { });
    }


    // 태그 추가
    const addTag = (e) => {
        if (!e.target || !e.target.value.trim()) return;
        const newTag = e.target.value.replace(/[#,./]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');

        setTagInput("");

        const updatedTags = [...tags, ...Array.from(new Set(newTag)).filter(t => !tags.includes(t))].slice(0, MAX_TAGS)?.map(e => e.substring(0, 50));

        if (updatedTags?.length >= MAX_TAGS) {
            info(`최대 ${MAX_TAGS}개의 태그만 입력할 수 있습니다.`);
        }

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

            <FormStyled
                labelCol={{ span: 2 }}
                layout="horizontal"
                style={{ width: '100%', marginTop: '2em' }}
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
                            required
                        >
                            <Row gutter={[8, 4]}>
                                {/* 수정할때는 카테고리는 수정을 못함. */}
                                <Col span={12}>
                                    <Form.Item
                                        name={["info", "menu1Id"]}
                                        rules={[{ required: true, message: '필수 입력', },]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select
                                            style={{ width: '100%', }}
                                            onChange={onChangeMenu1}
                                            options={menu1Options}
                                            disabled={postId != null}
                                            placeholder="1차 카테고리"
                                            popupClassName="custom-dropdown"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={["info", "menu2Id"]}
                                        rules={[{ required: true, message: '필수 입력', },]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            options={menu2Options}
                                            disabled={postId != null}
                                            placeholder="2차 카테고리"
                                            popupClassName="custom-dropdown"
                                            onChange={onChangeMenu2}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    ) : (
                        null
                    )
                }

                {
                    isPost ? (
                        <>
                            <Form.Item
                                style={{ marginBottom: '1em' }}
                                label={<div>{`태그 (${tags?.length ?? 0})`}</div>}
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
                                    disabled={tags?.length >= MAX_TAGS}
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
                                        <div className='tag-inner'>
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
                                        </div>
                                    }
                                </Form.Item>}
                        </>
                    ) : (
                        null
                    )
                }
                {columnInfo?.map((col, idx) => (
                    <Form.Item
                        key={`meta-${idx}`}
                        label={col.metaNm}
                        name={['info', 'metaInfoItems', col.metaKey]}
                    >
                        {col?.refInfo?.length ?
                            <Select options={col?.refInfo} />
                            :
                            <Input />
                        }
                    </Form.Item>
                ))}

                {/* 컨텐츠 관리자는 상태를 바꿀수 없음.  */}
                <Form.Item
                    label="공개"
                    name={["info", "openType"]}
                    rules={[{ required: true, message: '필수 입력', },]}
                >
                    <Radio.Group options={openOptions} disabled={userInfo?.role == 'ROLE_CONTENTS_MANAGER'} />
                </Form.Item>


            </FormStyled >
        </>
    )
}


const FormStyled = styled(Form)`    
    
    .ant-form-item .ant-form-item-label >label {font-size: 1em}
    .ant-col{
        padding-bottom: 0;
    }
    .tag-inner{
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        margin-bottom: 1em;
        .ant-tag{
            margin-right: 0;
        }
    }

${SFMedia('mo-l', css`
    .ant-form-item{
        margin-bottom: 1em;
    }
`)};

`