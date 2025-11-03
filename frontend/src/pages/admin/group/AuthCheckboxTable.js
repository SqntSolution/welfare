import { Checkbox, ConfigProvider, Table } from "antd";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { StyledAdminTable, StyledTable } from "styles/StyledCommon";

const VerticalAlignTable = styled(Table)`
    width: 50%;

    .ant-table-thead > tr > th {
        text-align: center;
    }

    .ant-table-cell {
        vertical-align: top;
    }
    .ant-table-tbody > tr:first-child > td {
        &:first-child { 
            background: #fafafa;
            font-weight: bold;
        }
    }
`;

export const AuthCheckBoxTable = (props) => {
    const [tableData, setTableData] = useState([]);

    const selectedData = [];
    const menuTableData = [];

    useEffect(() => {
        makeTableData(props.dataSource);
        setTableData(menuTableData);
    }, [props.dataSource])

    useEffect(() => {
        makeSelectedList(props.menuInfoList);
        props.setCheckedList(selectedData);
    }, [props.menuInfoList])

    const column = [
        {
            title: '* 그룹 접근 카테고리', key: 'id',
            render: (record) =>
                <Checkbox
                    checked={props.checkedList.includes('0')}
                    indeterminate={!props.checkedList.includes('0') && props.checkedList?.filter(d => d?.includes('0')).length > 0}
                    onChange={() => checkHandler('0')}>
                    전체 선택
                </Checkbox>,
            onCell: (record) => ({
                rowSpan: record.id === tableData[0].id ? tableData.length : 0,
            })
        },
        {
            title: '카테고리', key: 'category', ellipsis: true,
            render: (record) =>
                <Checkbox
                    checked={props.checkedList.includes(record.checkKeyParent)}
                    indeterminate={!props.checkedList.includes(record.checkKeyParent) && props.checkedList?.filter(d => d?.includes(record.checkKeyParent)).length > 0}
                    onChange={() => checkHandler(record.checkKeyParent)}>
                    {record.category}
                </Checkbox>,
            onCell: (record) => ({
                rowSpan: record.span,
            }),
        },
        {
            title: '메뉴', key: 'menuNm', ellipsis: true,
            render: (record) => {
                if (record.checkKeyChild) {
                    return (
                        <Checkbox
                            checked={props.checkedList.includes(record.checkKeyChild)}
                            onChange={() => checkHandler(record.checkKeyChild)}>
                            {record.menuNm}
                        </Checkbox>
                    )
                }
            }
        },
        {
            title: '다운로드', key: 'id', ellipsis: true,
            render: (record) => {
                if (record.checkKeyChildDownload) {
                    return (
                        <Checkbox
                            checked={props.checkedList.includes(record.checkKeyChildDownload)}
                            onChange={() => checkHandler(record.checkKeyChildDownload)}>
                            파일 다운로드
                        </Checkbox>
                    )
                }
            }
        }
    ];

    const makeTableData = async (arr) => {
        arr?.forEach((d, i) => {
            if (d.childrenMenu === undefined || d.childrenMenu?.length === 0) {
                menuTableData.push({
                    category: d.menuNm,
                    id: d.id,
                    checkKeyParent: `0-${String(d.id).padStart(2, "0")}`,
                })
            }

            d.childrenMenu?.forEach((data, index, arr) => {
                menuTableData.push({
                    category: d.menuNm,
                    menuNm: data.menuNm,
                    id: data.id,
                    span: (index === 0 ? arr.length : 0),
                    checkKeyParent: `0-${String(d.id).padStart(2, "0")}`,
                    checkKeyChild: `0-${String(d.id).padStart(2, "0")}-${String(data.id).padStart(2, "0")}-Auth`,
                    checkKeyChildDownload: `0-${String(d.id).padStart(2, "0")}-${String(data.id).padStart(2, "0")}-File`,
                });
            })
        });

        return true;
    };

    const makeSelectedList = async (arr) => {
        arr?.forEach((d, i) => {
            if (d.accessAuthYn) {
                selectedData.push(`0-${String(d.id).padStart(2, "0")}`);

                d.childrenMenu?.forEach((data, index, arr) => {
                    if (data.accessAuthYn)
                        selectedData.push(`0-${String(d.id).padStart(2, "0")}-${String(data.id).padStart(2, "0")}-Auth`);

                    if (props.fileDownloadYn && data.fileDownloadYn)
                        selectedData.push(`0-${String(d.id).padStart(2, "0")}-${String(data.id).padStart(2, "0")}-File`);
                })
            }
        });

        return true;
    };


    const checkHandler = (checkedId) => {
        if (props.checkedList.includes(checkedId)) {
            if (checkedId.endsWith('Auth'))
                props.setCheckedList(props.checkedList.filter(d => !d.startsWith(checkedId.substring(0, 7))).filter(d => !checkedId.startsWith(d)));
            else
                props.setCheckedList(props.checkedList.filter(d => !d.startsWith(checkedId)).filter(d => !checkedId.startsWith(d)));
        }
        else {
            props.setCheckedList([
                checkedId,
                ...props.checkedList,
                ...tableData.filter((d) => d.checkKeyParent?.startsWith(checkedId)).map(d => d.checkKeyParent).filter((d, i, arr) => arr.indexOf(d) === i),
                ...tableData.filter((d) => d.checkKeyChild?.startsWith(checkedId)).map(d => d.checkKeyChild),
                ...tableData.filter((d) => props.fileDownloadYn && d.checkKeyChildDownload?.startsWith(checkedId)).map(d => d.checkKeyChildDownload),
                checkedId.endsWith('File') && props.fileDownloadYn ? `${checkedId.substring(0, 7)}-Auth` : ''
            ].filter((d, i, arr) => arr.indexOf(d) === i));
        }
    }
    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        rowHoverBg: 'none',
                    }
                },
                token: {
                    colorPrimary: 'black'
                }
            }}>
            <StyledAdminTable
                columns={props.fileDownloadYn ? column : column.slice(0, 3)}
                dataSource={tableData ?? []}
                pagination={false}
                size='small'
                rowKey={props.rowKey}
            // bordered
            />
        </ConfigProvider>
    )
}

export default AuthCheckBoxTable;


