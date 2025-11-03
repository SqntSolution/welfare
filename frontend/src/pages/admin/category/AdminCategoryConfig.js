/**
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CaretUpOutlined, CaretDownOutlined, PlusSquareOutlined, DownloadOutlined, InfoOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Select, Drawer, Space, theme, DatePicker, Table, Typography, ConfigProvider, Divider, Flex, Radio, Spin, Popover, Tag, Dropdown, Breadcrumb } from 'antd';

import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';

import dayjs from 'dayjs';
import _ from 'lodash';

import { CustomAdminTitle, CustomButtonExcel, SubTitleDivider, TableTotalCount } from 'components/common/CustomComps';
import { InnerAdminDiv, StyledTableButton } from 'styles/StyledCommon';
import { isCompositeComponent } from 'react-dom/test-utils';
import styled from 'styled-components';

const { Option } = Select;


const getCellColorByDepth = (codeValue) => {
    //임시저장(green)
    if (codeValue == 'm1') {
        return { color: '' };
    } else if (codeValue == 'm2') {
        return { color: '' };
    } else if (codeValue == 'm1-empty') {
        return { color: 'rgba(0, 0, 0, 0.081)' };
    } else if (codeValue == 'm2-empty') {
        return { color: 'rgba(0, 0, 0, 0.081)' };
    } else {
        return { color: '' };
    }
};

const getCellColorByType = (typeValue) => {
    switch (typeValue) {
        //공개
        case 'public':
            return { color: 'rgba(27, 114, 245, 0.685)', label: '공개' };
        //비공개
        case 'private':
            return { color: 'rgba(41, 41, 39, 0.6)', label: '비공개' };
        //임시저장
        case 'temp':
            return { color: 'rgba(248, 134, 27, 0.8)', label: '임시저장' };
        default:
            return '';
    }
};

const getCellColorByEnabled = (typeValue) => {
    switch (typeValue) {
        //사용
        case true:
            return { color: 'rgba(27, 114, 245, 0.685)', label: '사용' };
        //사용안함
        case false:
            return { color: 'rgba(41, 41, 39, 0.6)', label: '사용안함' };
        default:
            return '';
    }
};

const getContentTypeLabel = (value) => {
    switch (value) {
        //Sub Main
        case null:
            return { color: 'rgba(247, 7, 235, 0.685)', label: 'Sub Main' };
        //link
        case 'link':
            return { color: 'blue', label: 'Link' };
        //Board(post)
        case 'post':
            return { color: 'purple', label: 'Board' };
        //Page
        case 'page':
            return { color: 'green', label: 'Page' };
        case 'smartfinder':
            return { color: 'gold', label: 'Smartfinder' };
        case 'cscenter':
            return { color: 'rgba(112, 27, 248, 0.8)', label: 'Cscenter' };
        case 'notice':
            return { color: 'magenta', label: 'Notice' };
        case 'faq':
            return { color: 'volcano', label: 'Faq' };
        case 'qna':
            return { color: 'cyan', label: 'QnA' };
        case 'my':
            return { color: 'rgba(204, 27, 248, 0.8)', label: 'My' };
        case 'profile':
            return { color: 'rgba(129, 119, 110, 0.8)', label: 'Profile' };
        case 'scrap':
            return { color: 'rgba(95, 52, 12, 0.8)', label: 'Scrap' };
        case 'alarm':
            return { color: 'red', label: 'Alarm' };
        case 'history':
            return { color: 'lime', label: 'History' };
        case 'mypost':
            return { color: 'geekblue', label: 'MyPost' };
        default:
            return { color: 'rgba(36, 36, 36, 0.8)', label: 'Sub Main' };;
    }

};

const TIME_INTERVAL = 1500;

const noMenuCategory = ['smartfinder', 'my'];

const fixedMenuCategoryList = ['smartfinder', 'cscenter', 'my', 'notice', 'faq', 'qna', 'profile', 'scrap', 'alarm', 'history', 'mypost'];

const AdminCategoryConfig = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryListOrigin, setCategoryListOrigin] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState();
    const [selectedRowInfo, setSelectedRowInfo] = useState();
    const [isEdit, setIsEdit] = useState(false);

    const { error, info } = useMsg();


    const getCategoryData = async () => {
        setLoading(true);
        return await AXIOS.get(`/api/v1/admin/category`)
            .then((resp) => {
                // console.log('==-categoryData-==', resp.data)
                setCategoryList(resp?.data);
                setCategoryListOrigin(resp?.data);
                setLoading(false);
                return true;
            })
            .catch((e) => {
                setCategoryList([]);
                setCategoryListOrigin([]);
                error(e);
                setLoading(false);
                return false;
            });
    };

    const saveCategory = async (param) => {
        const params = param;

        setLoading(true);
        return await AXIOS.post(`/api/v1/admin/category/menuseq`, params)
            .then((resp) => {
                // console.log('==-categoryData-==', resp.data)
                setTimeout(() => {
                    info('저장되었습니다.');
                    setLoading(false);
                }, TIME_INTERVAL);
                // return true;
            })
            .catch((e) => {
                error(e);
                setLoading(false);
                return false;
            });
    };

    useEffect(() => {
        getCategoryData();
    }, []);

    useEffect(() => {
        // console.log('===-catagoryList Changed-===', categoryList);
    }, [categoryList]);

    const handleCategoryMove = (item, index, direction) => {
        //카테고리only 배열 deepcopy
        const tempCategoryOnly = JSON.parse(JSON.stringify(categoryList.filter((obj) => obj.parentId == 0 && !!!obj.isFixed)));
        let tempCategoryList = JSON.parse(JSON.stringify(categoryList));

        //카테고리Only내에서 현재 카테고리 index -> 다음/이전 카테고리 찾기 위해서
        let currentCategoryOnlyListIndex = tempCategoryOnly.findIndex((obj) => obj.id == item.id);
        const currentCategoryMenuList = categoryList.filter((obj) => obj.parentId == item.id);

        //target카테고리 추출 from tempCategoryOnly
        let targetCategory = tempCategoryOnly[currentCategoryOnlyListIndex + Number(direction == 'down' ? 1 : -1)];
        const targetCategoryMenuList = categoryList.filter((obj) => obj.parentId == targetCategory.id);

        //현재카테고리 index from 전체카테고리메뉴
        let currentCategoryIndex = index;
        let targetCategoryIndex = tempCategoryList.findIndex((obj) => obj.id == targetCategory.id);

        //swap category first
        tempCategoryList.splice(currentCategoryIndex, 1, targetCategory);
        tempCategoryList.splice(targetCategoryIndex, 1, item);

        if (direction == 'down') {
            tempCategoryList.splice(targetCategoryIndex + 1, targetCategoryMenuList.length, ...currentCategoryMenuList);
            tempCategoryList.splice(currentCategoryIndex + 1, currentCategoryMenuList.length, ...targetCategoryMenuList);
        } else if (direction == 'up') {
            tempCategoryList.splice(currentCategoryIndex + 1, currentCategoryMenuList.length, ...targetCategoryMenuList);
            tempCategoryList.splice(targetCategoryIndex + 1, targetCategoryMenuList.length, ...currentCategoryMenuList);
        }
        setCategoryList(tempCategoryList);
        // console.log('-==========handleCategoryMove', tempCategoryList);
    };

    const handleMenuMove = (item, index, direction) => {
        let tempCategoryList = JSON.parse(JSON.stringify(categoryList));

        if (direction == 'down') {
            //아래 카테고리 id찾기
            // findNextCategory(item.parentId, tempCategoryList);
            if (tempCategoryList[index + 1].parentId == 0) {
                tempCategoryList[index].parentId = tempCategoryList[index + 1].id;
                // error('아래 카테고리로 이동');
                [tempCategoryList[index], tempCategoryList[index + 1]] = [tempCategoryList[index + 1], tempCategoryList[index]];
            } else {
                [tempCategoryList[index], tempCategoryList[index + 1]] = [tempCategoryList[index + 1], tempCategoryList[index]];
                // info('카테고리내 스왑');
            }
        } else if (direction == 'up') {
            //윗 카테고리 id찾기
            // findPrevCategory(item.parentId);
            if (tempCategoryList[index - 1].parentId == 0) {
                tempCategoryList[index].parentId = tempCategoryList[index - 2].parentId == 0 ? tempCategoryList[index - 2].id : tempCategoryList[index - 2].parentId;
                [tempCategoryList[index], tempCategoryList[index - 1]] = [tempCategoryList[index - 1], tempCategoryList[index]];
                // error('윗 카테고리로 이동');
            } else {
                [tempCategoryList[index], tempCategoryList[index - 1]] = [tempCategoryList[index - 1], tempCategoryList[index]];
                // info('카테고리내 스왑');
            }
        }
        setCategoryList(tempCategoryList);
        // console.log('-==========handleMenuMove', tempCategoryList);
    };

    const handleMoveMenuToCategory = (item, index, direction) => {

    };

    const findNextCategory = (item) => {
        const currentCategoryId = categoryList.find((obj) => obj.id = item.id);
        const categoryOnlyList = categoryList.filter((obj) => obj.parentId == 0);
        // console.log('==-findNextCategory-==', currentCategoryId, categoryOnlyList);
        // info('==-findNextCategory-==' + JSON.stringify(currentCategoryId) + JSON.stringify(categoryOnlyList));
    };

    const findPrevCategory = (item) => {
        const currentCategoryId = categoryList.find((obj) => obj.id = item.id);
        const categoryOnlyList = categoryList.filter((obj) => obj.parentId == 0);
        // console.log('==-findPrevCategory-==', currentCategoryId, categoryOnlyList);
        // info('==-findPrevCategory-==' + JSON.stringify(currentCategoryId) + JSON.stringify(categoryOnlyList));
    };

    const isLastCategory = (id) => {
        const tempCategoryOnly = JSON.parse(JSON.stringify(categoryList.filter((obj) => obj.parentId == 0 && !!!obj.isFixed)));
        if (tempCategoryOnly.findIndex((obj) => obj.id == id) == tempCategoryOnly.length - 1) {
            return true;
        } else {
            return false;
        };
    };

    const handleAddCategory = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('======handleAddCategory', item);
        navigate('./new', { state: { operationType: item?.type }, });
    };

    const handleAddMenu = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('======handleAddMenu', item);
        navigate('./new', { state: { operationType: item?.type, value: { CategoryNode: item?.item } } });
    };

    const handleEditCategory = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('======handleEditCategory', item);
        navigate(`./edit/${item.item.id}`, { state: { operationType: item?.type, value: { CategoryNode: item?.item, ChildExist: categoryList.some((obj) => obj.parentId == item?.item.id) } } });
    };

    const handleEditMenu = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('======handleEditMenu', item);
        navigate(`./edit/${item.item.id}`, { state: { operationType: item?.type, value: { CategoryNode: categoryList.find((obj) => obj.id == item?.item.parentId), MenuId: item?.item.id } } });
    };

    const handleExcelDownload = () => {
        // console.log('handleExcelDownload');
        window.open(`/api/v1/admin/category/download/excel`);
    };

    const handleSaveCategory = () => {
        saveCategory(categoryList);
        setTimeout(() => {
            getCategoryData();
        }, TIME_INTERVAL);
    };

    const categoryColumns = [
        {
            title: <></>,
            dataIndex: 'updown',
            key: 'updown',
            width: '4%',
            render: (text, record, index) => {
                if (categoryList?.length > 1) {

                    //첫째 카테고리 down only
                    if (index == 0 && record.parentId == 0) {
                        return <>
                            <Row>
                                <Col span={10}><CaretDownOutlined onClick={() => handleCategoryMove(record, index, 'down')} /></Col>
                                <Col span={4}></Col>
                                <Col span={10}><CaretUpOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                            </Row>
                        </>;
                    } else if (index == 1 && record.parentId !== 0 && categoryList?.length > 2) {
                        //첫째 카테고리 첫째 메뉴 down only
                        return <>
                            <Row>
                                <Col span={10}><CaretDownOutlined onClick={() => handleMenuMove(record, index, 'down')} /></Col>
                                <Col span={4}></Col>
                                <Col span={10}><CaretUpOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                            </Row>
                        </>;
                    } else if (fixedMenuCategoryList.includes(record.contentType) || ['About INSIGHT', 'User Manual'].includes(record.menuNm)) {
                        //고정메뉴 제외
                        return <></>;
                    } else if (isLastCategory(record.id) && record.parentId == 0) {
                        //마지막 카테고리 up only
                        return <>
                            <Row>
                                <Col span={10}><CaretDownOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                                <Col span={4}></Col>
                                <Col span={10}><CaretUpOutlined onClick={() => handleCategoryMove(record, index, 'up')} /></Col>
                            </Row>
                        </>;
                    } else if (index == categoryList?.length - 1 && record.parentId !== 0) {
                        //마지막 메뉴 up only
                        return <>
                            <Row>
                                <Col span={10}><CaretDownOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                                <Col span={4}></Col>
                                <Col span={10}><CaretUpOutlined onClick={() => handleMenuMove(record, index, 'up')} /></Col>
                            </Row>
                        </>;
                    } else {
                        if (record.parentId == 0) {
                            //Category up and down
                            return <>
                                <Row>
                                    <Col span={10}><CaretDownOutlined onClick={() => handleCategoryMove(record, index, 'down')} /></Col>
                                    <Col span={4}></Col>
                                    <Col span={10}><CaretUpOutlined onClick={() => handleCategoryMove(record, index, 'up')} /></Col>
                                </Row>
                            </>;
                        } else if (record.parentId !== 0) {
                            //Menu up and down
                            return <>
                                <Row>
                                    <Col span={10}><CaretDownOutlined onClick={() => handleMenuMove(record, index, 'down')} /></Col>
                                    <Col span={4}></Col>
                                    <Col span={10}><CaretUpOutlined onClick={() => handleMenuMove(record, index, 'up')} /></Col>
                                </Row>
                            </>;
                        }
                    }
                } else {
                    return <>
                        <Row>
                            <Col span={10}><CaretDownOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                            <Col span={4}></Col>
                            <Col span={10}><CaretUpOutlined style={{ color: 'rgba(0, 0, 0, 0.2)' }} /></Col>
                        </Row>
                    </>;
                }
            }
        },
        {
            title: '카테고리',
            dataIndex: 'menuNm',
            key: 'menuNm',
            width: '20%',
            ellipsis: true,
            // colSpan:2,
            onCell: (record, rowIndex) => {
                if (record.parentId == 0) {
                    return {
                        // colSpan: 1,
                        style: {
                            background: getCellColorByDepth('m1').color,
                        },
                    }
                } else if (record.parentId !== 0) {
                    return {
                        // colSpan: 1,
                        style: {
                            background: getCellColorByDepth('m1-empty').color,
                        },
                    }
                };
            },
            render: (text, record, index) => {
                // console.log('-------category Column', record);
                return <>{record.parentId == 0 ? <Flex justify='space-between'>
                    <div>{text}</div>
                    {(!noMenuCategory.includes(record.contentType) && record.contentType !== 'link') && <PlusSquareOutlined onClick={(e) => handleAddMenu(e, { type: 'addMenu', item: record })} />}
                </Flex>
                    : <></>}
                </>;
            },
        },
        {
            title: '메뉴',
            dataIndex: 'menuNm',
            key: 'menuNm',
            width: '20%',
            ellipsis: true,
            onCell: (record, rowIndex) => {
                if (record.parentId == 0) {
                    return {
                        style: {
                            background: getCellColorByDepth('m1').color,
                        },
                    }
                } else if (record.parentId !== 0) {
                    return {
                        style: {
                            background: getCellColorByDepth('m2').color,
                        },
                    }
                };
            },
            render: (text, record, index) => {
                return <>{record.parentId !== 0 ? <div align='left'>{record.menuNm}</div> : ''}</>;
            },
        },
        {
            title: '메뉴설명',
            dataIndex: 'description',
            key: 'description',
            // width: '15%',
        },
        {
            title: '사용컴포넌트',
            dataIndex: 'contentType',
            key: 'contentType',
            width: '7%',
            render: (text, record, index) => {
                return (
                    <>{getContentTypeLabel(text).label}</>
                )
            }
        },
        {
            title: '상태',
            dataIndex: 'enabled',
            key: 'enabled',
            width: '7%',
            hidden: false,
            render: (text, record, index) => {
                return (
                    <>{getCellColorByEnabled(text).label}</>
                )
            }
        },
        {
            title: '수정',
            dataIndex: 'edit',
            key: 'edit',
            width: '7%',
            render: (text, record, index) => {

                return (
                    fixedMenuCategoryList.includes(record.contentType) ? <></> :
                        <>
                            <StyledTableButton type='link' size={'small'} style={{ padding: 0 }}
                                onClick={(e) => {
                                    record.parentId == 0 ? handleEditCategory(e, { type: 'editCategory', item: record }) : handleEditMenu(e, { type: 'editMenu', item: record })
                                }}>
                                수정
                            </StyledTableButton>
                        </>
                );
            }
        },
    ];

    const breadcrumb = [
        { title: 'Home' },
        { title: '카테고리' },
    ];

    return (<>
        <CustomAdminTitle title={'카테고리'} items={breadcrumb} />

        <Spin spinning={loading} >
            <InnerAdminDiv>
                <Row justify={'space-between'} style={{ marginBottom: 24 }}>
                    <Col span={4}>
                        {/* <Typography.Title level={4} style={{ margin: 0 }}>어드민 - 카테고리</Typography.Title> */}
                    </Col>
                    <Col span={20}>
                        <Flex justify={'flex-end'} gap={8}>
                            {/* <Button onClick={handleExcelDownload} type='primary' icon={<DownloadOutlined />}>엑셀다운로드</Button> */}
                            <CustomButtonExcel onClick={() => handleExcelDownload()} label={'엑셀 다운로드'} />
                            <Button onClick={(e) => handleAddCategory(e, { type: 'addCategory' })} type='primary'>카테고리 추가</Button>
                        </Flex>
                    </Col>
                </Row >
                <StyledTable
                    rowKey={(row) => row?.id}
                    // loading={loading}
                    dataSource={categoryList}
                    indentSize={0}
                    columns={categoryColumns}
                    size={'small'}
                    // bordered={true}
                    // title={() => <TableTotalCount />}
                    // rowHoverable={false}
                    // expandable={{
                    //     expandedRowKeys: categoryList?.map((item) => item.id),
                    //     expandIcon: () => <></>,
                    //     childrenColumnName: 'menuChildren'
                    // }}
                    onRow={(record, index) => ({
                        style: {
                            // cursor: 'pointer',
                            background: record?.id == selectedRowInfo?.id ? '#FFF7F7' : '',
                        },
                        onClick: () => {
                            setSelectedIndex(index);
                            setSelectedRowInfo(record);
                        },
                    })}
                    pagination={false}
                />

                <Flex justify={'center'} gap={8} style={{ marginTop: 32 }}>
                    <Button onClick={(e) => handleSaveCategory()} type='primary'>저장</Button>
                </Flex>
            </InnerAdminDiv>
        </Spin>
    </>);
};

export default AdminCategoryConfig;

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
}
&.ant-card-small >.ant-card-body{padding:0}

&.ant-table-wrapper .ant-table-tbody >tr >th, 
&.ant-table-wrapper .ant-table-tbody >tr >td{
  padding: 8px;
  font-size: 14px;
  color:rgba(0, 0, 0, 0.85);
  height: 40px;

}
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
&.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px;}

&.ant-table-wrapper .ant-table-pagination-right{    justify-content: center;}
`;