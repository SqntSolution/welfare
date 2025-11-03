/**
 * @format
 */
import { Table } from 'antd';
import React from 'react';
import { Children } from 'react';
import styled from 'styled-components';
import { StyledAdminTable } from 'styles/StyledCommon';

/**
 * @NAME 카테고리 메뉴를 테이블로 찍는 컴포넌트
 *
 * dataSource: 메뉴 테이블 데이터 소스
 * checkedKeys: 선택된 row State
 * setCheckedKeys: 선택된 row State 관리 함수
 * rowKey: row키 default (id)
 * childrenColumnName: 자식 컬럼명 defalut (childrenMenu)
 * checkStrictly: 부모체크박스가 필수로 선택이 필요할 때 defalut (false)
 */
export const CategoryCheckboxTable = (props) => {
    const { dataSource, checkedKeys, setCheckedKeys, rowKey, childrenColumnName, checkStrictly } = props;
    //컬럼 데이터
    const colunmData = [
        {
            title: '카테고리 구독',
            dataIndex: 'menuNm',
            width: '50%',
            ellipsis: true,
            render: (text, record) => {
                if (record.parentId == 0) {
                    return text;
                } else {
                    return (<div className='tdBgColor'></div>)
                }
            },
        },
        {
            title: '메뉴 구독',
            dataIndex: 'menuNm',
            width: '50%',
            ellipsis: true,
            render: (text, record) => {
                if (record.parentId != 0) {
                    return text;
                } else {
                    return (<div className='tdBgColor'></div>)
                }
            },
        },
        Table.SELECTION_COLUMN,
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows, info) => {
            // console.log('전체 선택', selectedRowKeys)
            // setCheckedKeys([...selectedRowKeys]);
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            if (record?.parentId === 0) {
                const childrenMenuItems = record?.childrenMenu?.map((elem) => elem?.id) ?? [];
                if (selected) {
                    setCheckedKeys((prev) => [...prev.filter((elem) => !childrenMenuItems?.includes(elem)), record?.id, ...childrenMenuItems]);
                } else {
                    setCheckedKeys((prve) => [...prve.filter((elem) => ![record?.id, ...childrenMenuItems].includes(elem))]);
                    // setCheckedKeys([...checkedKeys.filter((elem) => ![record?.id, ...record?.childrenMenu?.map((elem) => elem?.id)].includes(elem))]);
                }
            } else {
                const selectedRowMenuId = selectedRows.map((elem) => elem?.id);
                if (checkStrictly && !checkedKeys.includes(record?.parentId)) {
                    setCheckedKeys([...selectedRowMenuId, record?.parentId]);
                } else {
                    setCheckedKeys([...selectedRowMenuId]);
                }
            }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            setCheckedKeys([...selectedRows.map((elem) => elem?.id)]);
        },
    };

    return (
        <>
            <StyledTable
                size='small'
                dataSource={dataSource ?? []}
                columns={colunmData}
                rowKey={rowKey ?? 'id'}
                expandable={{
                    expandedRowKeys: [...dataSource?.map((elem) => elem.id)],
                    childrenColumnName: childrenColumnName ?? 'childrenMenu',
                    expandIcon: () => '',
                }}
                rowSelection={{
                    ...rowSelection,
                    selectedRowKeys: checkedKeys ?? [],
                    checkStrictly: checkStrictly ?? false,
                }}
                pagination={false}
                bordered={true}
            />
        </>
    );
};

export default CategoryCheckboxTable;


const StyledTable = styled(Table)`  
    &{margin-top: 16px;}
    &.ant-table-wrapper .ant-table{
        background: #fff;
    }
    && .ant-table-thead>tr>th{
        background:  rgba(250, 250, 250, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 8px;
        font-size: 14px;
        height: 40px;
        white-space: nowrap;
    }
    &.ant-card-small >.ant-card-body{padding:0}

    &.ant-table-wrapper .ant-table-tbody >tr >th, 
    &.ant-table-wrapper .ant-table-tbody >tr >td{
        padding: 8px;
        font-size: 14px;
        color:rgba(0, 0, 0, 0.85);
        height: 40px;

    }
    &.ant-table-wrapper .ant-table-tbody >tr:nth-child(2n) > th,
    &.ant-table-wrapper .ant-table-tbody >tr:nth-child(2n) >td{background:#fff}
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px;border-color:rgba(0, 0, 0, 0.06)}


    &.ant-table-wrapper .ant-table-tbody >tr >td:has(.tdBgColor) {background: rgba(245, 245, 245, 1);}
`;