import React from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Button, ConfigProvider, Flex, Typography, Spin, Row, Table, Space } from "antd";
import { InnerAdminDiv, StyledAdminTable } from "styles/StyledCommon";
import { CustomAdminTitle } from "./CustomComps";


export const TableCommon = (props) => {
    const { data, columns, loading, handleTableChange, mindleLayout, title, items, getRowStyle } = props;
    console.log(items)
    return (
        <>
            <Spin spinning={loading}>

                <CustomAdminTitle title={items[1].title} items={items} />
                <InnerAdminDiv>
                    <Flex justify="space-between" gap={8} style={{ marginBottom: 24 }}>
                        {
                            title ?
                                <Typography.Title level={5} style={{ margin: 0 }}>{title}</Typography.Title>
                                :
                                <>
                                </>
                        }
                        {mindleLayout ? <Flex gap={8}>{mindleLayout()}</Flex> : <></>}
                    </Flex>
                    <StyledAdminTable
                        columns={columns}
                        rowKey={(record) => record?.id}
                        dataSource={data?.content ?? []}
                        onChange={handleTableChange}
                        loading={loading}
                        rowStyle={getRowStyle}
                        size="small"
                        pagination={{
                            current: Number(data?.number ?? 0) + 1,
                            pageSize: data?.size ?? 10,
                            total: data?.totalElements ?? 0,
                            position: ['bottomCenter'], //페이지 버튼 위치
                            showSizeChanger: false, // 페이지 크기를 변경할 수 있는 UI 표시 여부
                            showQuickJumper: false, // 빠른 페이지 이동 UI 표시 여부
                        }}
                        scroll={{
                            y: 500,
                            // X: 500
                        }}
                    />
                </InnerAdminDiv>
            </Spin>
        </>
    )
}