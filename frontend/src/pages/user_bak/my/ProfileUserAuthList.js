/**
 * @format
 */
import React, { useEffect, useReducer, useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { StyledAdminTable } from 'styles/StyledCommon';
import styled from 'styled-components';

export const UserAuthList = ({ userAuth }) => {
    let preMenuNm = null;

    useEffect(() => {
        initPreMenuNm();
    }, [userAuth]);

    const initPreMenuNm = () => {
        preMenuNm = null;
    };

    const columns = [
        {
            key: 'parentMenuNm',
            title: '카테고리',
            dataIndex: 'parentMenuNm',
            width: '25%',
            onCell: (record, index) => {
                const count = userAuth.filter((elem) => elem.parentMenuNm === record.parentMenuNm).length;
                if (preMenuNm === record.parentMenuNm) {
                    return {
                        rowSpan: 0,
                    };
                } else {
                    preMenuNm = record.parentMenuNm;
                    return {
                        rowSpan: count,
                    };
                }
            },
        },
        {
            key: 'menuNm',
            title: '메뉴',
            width: '25%',
            dataIndex: 'menuNm',
        },
        {
            key: 'downloadAuth',
            title: '파일 다운로드',
            width: '25%',
            dataIndex: 'downloadAuth',
            render: (text) => (text ? <CheckOutlined /> : ''),
        },
        {
            key: 'writeAuth',
            title: '쓰기',
            width: '25%',
            dataIndex: 'writeAuth',
            render: (text) => (text ? <CheckOutlined /> : ''),
        },
    ];

    return <StyledTable dataSource={userAuth} columns={columns} size='small' pagination={false} />;
};


const StyledTable = styled(Table)`
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
    font-weight: 400
  }
  &.ant-card-small >.ant-card-body{padding:0}

  &.ant-table-wrapper .ant-table-tbody >tr >th, 
  &.ant-table-wrapper .ant-table-tbody >tr >td{
    padding: 8px;
    font-size: 14px;
    color:rgba(0, 0, 0, 0.85);
    height: 40px;

  }
//   &.ant-table-wrapper .ant-table-tbody >tr:nth-child(2n) > th,
//   &.ant-table-wrapper .ant-table-tbody >tr:nth-child(2n) >td{background:rgba(250, 250, 253, 1)}
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
  &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
  &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px 16px;}
`