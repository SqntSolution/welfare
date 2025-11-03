// 동적으로 component를 만드는 
import { useEffect, useState, useRef } from 'react';
import { Space, Button, Col, Dropdown, Alert, Card } from 'antd';
import { CkeditorComp } from 'components/dynamic/CkeditorComp';
import { PdfviewerEditComp } from 'components/common/pdf/PdfviewerEditComp';
import { FilePdfOutlined, EditOutlined, PlusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
// import { dynamic_updateData, dynamic_mngComponent } from 'atoms/atom';
import styled from 'styled-components';
import { SUText16 } from 'styles/StyledUser';

/*
postDetails 데이타 샘플
    [{
        "id": 2,
        "postId": 96,
        "detailsType": "editor",
        "contents": "우리들의<br/>여름은 가고",
        "seq": 2
    },
    {
        "id": 6,
        "postId": 96,
        "detailsType": "pdf",
        "path": "/2024/kong2.pdf",
        "seq": 3
    },]
*/

const defaultComponents = {
    editor: {
        detailsType: 'editor',
        contents: null,
    },
    pdf: {
        detailsType: 'pdf',
        path: null
    }
}
export const DynamicArea = ({ postDetails, setDyanmicDetails, postCategory }) => {
    // components의 예 =>  { key: key, label: label, children: component, data: data }
    const [components, setComponents] = useState([])
    const [isEditorView, setIsEdiorView] = useState({});
    const componentRefs = useRef({});

    const toggleEditor = (key) => {

        setIsEdiorView((prev) => {
            let temp = { ...prev }
            temp[key] = !temp[key] ?? true;
            return temp;
        });
    }

    useEffect(() => {
        if (postDetails?.length > 0 && postCategory != null) {
            const list = postDetails?.map(e => {
                e.key = e.id
                e.key2 = e.id
                return e
            })
            setComponents(list)
        } else {
            setComponents([{ ...defaultComponents.editor, key: Date.now(), key2: Date.now() }])
        }
    }, [postDetails, postCategory])


    const updateData = (data) => {
        const key2 = data?.key2
        const newComponents = components.map(e => {
            if (e.key != null && e.key == key2) {
                e = { ...e, ...data }
                return e
            } else {
                return e
            }
        })
        setComponents(newComponents)
    }

    useEffect(() => {
        setDyanmicDetails(components)
    }, [components])

    const buttons = (key2, elem) => (
        <StyledArrowButtonBox>
            <Button size='small' icon={<DownOutlined />} onClick={(e) => { moveDown(key2); e.stopPropagation() }}></Button>
            <Button size='small' icon={<UpOutlined />} onClick={(e) => { moveUp(key2); e.stopPropagation() }}></Button>
            <span>{(elem?.detailsType ?? '').toUpperCase()}</span>
        </StyledArrowButtonBox>
    )

    const addComponent = (data) => {
        const detailsType = data?.detailsType
        if (detailsType == null) {
            return
        }
        const key = Date.now();
        data.key = key
        data.key2 = key
        // data.detailsType = detailsType;
        setComponents([...components, data])
    }

    const buildComponent = (detailsType, props) => {
        props.readonly = false
        let component = null;
        if (detailsType == 'editor') {
            component = <CkeditorComp {...props} />
        } else if (detailsType == 'pdf') {
            component = <PdfviewerEditComp {...props} />
        } else {
            component = <Alert message="존재하지 않는 component" type="error" showIcon />
        }
        return component
    }

    const moveUp = (key2) => {
        if (key2 == null) {
            return
        }
        const idx = components.findIndex(e => e.key2 == key2)
        if (idx <= 0) {
            return
        }
        const tmp = components.splice(idx, 1)[0]
        components.splice(idx - 1, 0, tmp)
        setComponents([...components])
        setTimeout(() => scrollToComponent(key2), 100);
    }

    const moveDown = (key2) => {
        if (key2 == null) {
            return
        }
        const idx = components.findIndex(e => e.key2 == key2)
        if (idx < 0) {
            return
        }
        if (idx == components.length - 1) {
            return
        }
        const tmp = components.splice(idx, 1)[0]
        components.splice(idx + 1, 0, tmp)
        setComponents([...components])
        setTimeout(() => scrollToComponent(key2), 100);
    }

    const remove = (key2) => {
        if (key2 == null) {
            return
        }
        const newList = components.filter(e => e.key2 != key2)
        setComponents(newList)
    }

    const scrollToComponent = (key2) => {
        const target = componentRefs.current[key2];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const addMenuOptions = [
        {
            key: '1',
            label: <span onClick={() => addComponent(defaultComponents.editor)} style={{ display: 'inline-block', width: '100%' }} >Editor 추가</span>,
            icon: <EditOutlined />,
        },
        ...(postCategory === 'editor' || postCategory === 'pdf'
            ? [
                {
                    key: '2',
                    label: (
                        <span
                            onClick={() => addComponent(defaultComponents.pdf)}
                            style={{ display: 'inline-block', width: '100%' }}
                        >
                            PDF 추가
                        </span>
                    ),
                    icon: <FilePdfOutlined />,
                },
            ]
            : []),
    ]

    return (
        <>
            {
                components?.map((elem, idx) => {
                    elem.updateData = updateData
                    return (
                        <StyledCard
                            ref={el => componentRefs.current[elem.key2] = el}
                            size="small"
                            title={buttons(elem.key2, elem)}
                            extra={<Button style={{ fontSize: '1em' }} onClick={(e) => { remove(elem.key2); e.stopPropagation() }}>삭제</Button>}
                            style={{
                                width: '100%',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                padding: 0,
                                margin: '0 0 1em'
                            }}
                            styles={{ header: { padding: '16px 24px' } }}
                            key={elem?.data?.key2 || idx}
                        >
                            {buildComponent(elem.detailsType, elem)}
                        </StyledCard >
                    )
                })
            }

            <Dropdown
                menu={{ items: addMenuOptions, className: 'DropdownMenu' }}
                trigger={['click']}
            >
                <StyledButtonAdd>
                    <PlusOutlined style={{ fontSize: '2.5em', width: '100%' }} />
                    <SUText16 style={{ marginTop: '0.5em' }}>추가</SUText16>
                </StyledButtonAdd>
            </Dropdown>
        </>
    )
}


const StyledArrowButtonBox = styled(Space)`
    .ant-btn.ant-btn-sm.ant-btn-icon-only{
        border:0;
        background : transparent;
        font-size:20px;
    }
`;

const StyledCard = styled(Card)`
&.ant-card-small >.ant-card-body{padding:0;}

.ck.ck-toolbar,.ck.ck-editor__editable_inline,
.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border-color:rgba(0, 0, 0, 0.06)}
&.ant-upload-wrapper .ant-upload-drag .ant-upload-btn{width:100%}
`;

const StyledButtonAdd = styled(Button)`
   &{
        width:100%;
        height: auto;
        padding:20px 8px;
        border:1px dashed #d9d9d9;
        background:rgba(38, 38, 38, 0.02);
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        justify-content:center;
        align-content:cente;
   }
   .anticon{display: block}
   &:hover{
    border-color: #f75c54;
   }
`