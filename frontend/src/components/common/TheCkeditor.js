// ckeditor component

import React, { useEffect, useState, createElement } from 'react';
import { AXIOS } from 'utils/axios';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';


export const TheCkeditor = ({ data, setData, readonly, minHeight = '0px',borderColor = "#f0f0f0" }) => {
    const [editor, setEditor] = useState(null);
    const imgUrl = '/api/v1/image';

    const customUploadAdapter = (loader) => {
        return {
            upload() {
                return new Promise((resolve, reject) => {
                    const data = new FormData();
                    loader.file.then((file) => {
                        data.append('name', file.name);
                        data.append('file', file);

                        AXIOS.post('/api/v1/image', data)
                            .then((res) => {
                                resolve({
                                    default: `${imgUrl}/${res.data.path}`,
                                });
                            })
                            .catch((err) => reject(err));
                    });
                });
            },
        };
    };


    // [주의] const로 바꾸면 이상하게 동작하더라.
    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        };
    }

    useEffect(() => {
        if (editor != null) {
            if (readonly === true) {
                editor.ui.view.toolbar.element.style.display = 'none';
                
                // readonly 모드에서 이미지 컨트롤러 비활성화
                const imagePlugin = editor.plugins.get('Image');
                if (imagePlugin) {
                    // 이미지 리사이즈 기능 비활성화
                    const resizePlugin = editor.plugins.get('ImageResizeEditing');
                    if (resizePlugin) {
                        resizePlugin.isEnabled = false;
                    }
                    
                    // 이미지 툴바 비활성화
                    const imageToolbar = editor.plugins.get('ImageToolbar');
                    if (imageToolbar) {
                        imageToolbar.isEnabled = false;
                    }
                }
                
                // readonly 모드에서 이미지 컨트롤러를 CSS로 숨김
                const editorElement = editor.ui.view.element;
                if (editorElement) {
                    // 이미지 리사이즈 핸들 숨김
                    const resizeHandles = editorElement.querySelectorAll('.ck-image-resize-handle');
                    resizeHandles.forEach(handle => {
                        handle.style.display = 'none';
                    });
                    
                    // 이미지 툴바 숨김
                    const imageToolbars = editorElement.querySelectorAll('.ck-image-toolbar');
                    imageToolbars.forEach(toolbar => {
                        toolbar.style.display = 'none';
                    });
                }
                
                // readonly 모드에서 링크 클릭 허용 (disabled 상태에서도)
                if (readonly) {
                    // 에디터가 disabled 상태에서도 링크 클릭을 허용하기 위한 설정
                    const editorElement = editor.ui.view.element;
                    if (editorElement) {
                        // 링크 클릭 이벤트를 DOM 레벨에서 처리
                        editorElement.addEventListener('click', (event) => {
                            const target = event.target;
                            if (target.tagName === 'A' && target.href) {
                                event.preventDefault();
                                window.open(target.href, '_blank');
                            }
                        });
                    }
                }
                
            } else {
                editor.ui.view.toolbar.element.style.display = 'block';
                
                // 편집 모드에서 이미지 컨트롤러 활성화
                const imagePlugin = editor.plugins.get('Image');
                if (imagePlugin) {
                    const resizePlugin = editor.plugins.get('ImageResizeEditing');
                    if (resizePlugin) {
                        resizePlugin.isEnabled = true;
                    }
                    
                    const imageToolbar = editor.plugins.get('ImageToolbar');
                    if (imageToolbar) {
                        imageToolbar.isEnabled = true;
                    }
                }
                
                // 편집 모드에서 이미지 컨트롤러 CSS 복원
                const editorElement = editor.ui.view.element;
                if (editorElement) {
                    // 이미지 리사이즈 핸들 복원
                    const resizeHandles = editorElement.querySelectorAll('.ck-image-resize-handle');
                    resizeHandles.forEach(handle => {
                        handle.style.display = '';
                    });
                    
                    // 이미지 툴바 복원
                    const imageToolbars = editorElement.querySelectorAll('.ck-image-toolbar');
                    imageToolbars.forEach(toolbar => {
                        toolbar.style.display = '';
                    });
                }
                
                // 편집 모드에서는 링크 클릭 이벤트 리스너 제거 (기본 동작 사용)
                const editorElementForRemove = editor.ui.view.element;
                if (editorElementForRemove) {
                    // 기존에 추가된 클릭 이벤트 리스너 제거
                    editorElementForRemove.removeEventListener('click', editorElementForRemove._linkClickHandler);
                }
            }
        }
    }, [readonly, editor])

    return (
        <>
            {/* <Switch checkedChildren="readonly" unCheckedChildren="editable"  value={readonly} onChange={v=>setReadonly(v)} /> */}
            <CKEditor
                editor={Editor}
                data={data}
                config={{
                    extraPlugins: [uploadPlugin],
                    link: { 
                        addTargetToExternalLinks: true,
                    },
                    htmlSupport: {
                        allow: [{
                            name: /.*/,
                            attributes: true,
                            classes: true,
                            styles: true
                        }],
                        disallow: [ /* HTML features to disallow */]
                    },
                    toolbar: {
                        shouldNotGroupWhenFull: true,
                    },
                    // readonly 모드에서 이미지 컨트롤러 비활성화
                    image: {
                        resizeOptions: readonly ? [] : [
                            {
                                name: 'resizeImage:original',
                                value: null,
                                label: 'Original'
                            },
                            {
                                name: 'resizeImage:50',
                                value: '50',
                                label: '50%'
                            },
                            {
                                name: 'resizeImage:75',
                                value: '75',
                                label: '75%'
                            }
                        ],
                        resizeUnit: '%',
                        // readonly 모드에서 이미지 툴바 비활성화
                        toolbar: readonly ? [] : [
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                            '|',
                            'toggleImageCaption',
                            'imageTextAlternative',
                            '|',
                            'linkImage'
                        ]
                    }
                }}
                disabled={readonly}
                onBlur={(event, editor) => {
                    const data = editor.getData();
                    setData?.(data);
                }}
                onReady={(editor) => {
                    setEditor(editor);
                    if (readonly === true) {
                        const toolbarElem = editor.ui.view.toolbar.element;

                        toolbarElem.style.display = 'none';
                    }
                    // console.log("=== onReady : ", editor.id)
                    editor.editing.view.change((writer) => {
                        // min-height 설정
                        writer.setStyle('min-height', `${minHeight}`, editor.editing.view.document.getRoot());
                        writer.setStyle('border-color', `${borderColor}`, editor.editing.view.document.getRoot());
                        // max-height 설정
                        // writer.setStyle(
                        //     //use max-height(for scroll) or min-height(static)
                        //     "max-height",
                        //     "700px",
                        //     editor.editing.view.document.getRoot()
                        // );
                        // console.log("=== writer.setStyle")
                    });
                }}
               
            />
            {/* {data} */}
        </>

    )
}
