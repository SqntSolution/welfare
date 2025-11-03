import { Table } from "antd";
import { styled } from "styled-components";

// 추후 소스 위치 변경 필요
export const ScrollHeightFixedTable = (props) => {
    return <HeightFixedTable {...props} scroll={{ y: '560px', }}/>
}

const HeightFixedTable = styled(Table)`
    .ant-table-container {
        height: 600px;
    }

    .ant-table-body {
        height: 100%;
    }

    .ant-empty-normal {
        height: 479px;
        align-content: center;
    }

    &.ant-table-wrapper .ant-table{ background: #fff;}

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
        border-inline-end:0 !important;
        border-bottom: 1px solid rgba(250, 250, 250, 1);
    }

    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
    &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px;}

    &.ant-table-wrapper .ant-table-pagination-right{ justify-content: center;}
    &.ant-table-wrapper .ant-table-bordered .ant-table-cell-scrollbar{
        background:  rgba(250, 250, 250, 1);
    }
`;