/**
 * @file PostCategoryFormItem.js
 * @description 포스트 작성 카테고리 별 form item
 * @author 이병은
 * @since 2025-06-19 14:17
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-06-19 14:17    이병은       최초 생성
 **/

import { Flex, Form, Input } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import React from 'react'

export const PhotoFormItem = () => {
    return (
        <>
            <Form.Item
                name={['info', 'manufacturer']}
                label='제조사'
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['info', 'countryOfOrigin']}
                label='원산지'
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['info', 'modelName']}
                label='모델'
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['info', 'style']}
                label='스타일'
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['info', 'size']}
                label='크기'
            >
                <Input />
            </Form.Item>
            <Form.Item
                label='제품 타입'
            >
                <Flex>
                    <Form.Item
                        name={['info', 'productType']}
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={['info', 'productSubtype']}
                        noStyle
                    >
                        <Input />
                    </Form.Item>
                </Flex>
            </Form.Item>
        </>
    )
}
