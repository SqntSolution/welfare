/**
 * @format
 */

import { useState, useEffect, useRef } from 'react';
import {
	PlusOutlined, CaretUpOutlined, CaretDownOutlined, CloseOutlined,
	SettingOutlined
} from '@ant-design/icons';
import {
	Divider, Button, Row, Col, Form, Input, Select, Space, theme, Table, Typography, Flex, Radio, Tooltip, Popover, Popconfirm, Tag
} from 'antd';

import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { isEmptyCheck } from 'utils/helpers';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { CustomAdminTitle } from 'components/common/CustomComps';
import { StyledNavLink } from 'styles/StyledCommon';
import { InnerAdminDiv, StyledAdminTable } from 'styles/StyledCommon';


const { Option } = Select;

const getCellColorByDepth = (codeValue) => {
	if (codeValue !== '0') {
		return { color: 'rgba(245, 245, 245, 1)' };
	} else { return ''; }
};

const getCellColorByType = (typeValue) => {
	switch (typeValue) {
		//공개
		case 'public':
			return { color: 'purple', label: '공개' };
		//비공개
		case 'private':
			return { color: 'default', label: '비공개' };
		//임시저장
		case 'temp':
			return { color: 'orange', label: '임시' };
		case 'ask':
			return { color: 'cyan', label: '문의 접수' };
		case 'response':
			return { color: 'magenta', label: '문의 답변' };
		default:
			return '';
	}
};

//Cosmax Admin - Content
const AdminContentConfig = () => {
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState();
	const [pageCurrent, setPageCurrent] = useState();
	const [pageSize, setPageSize] = useState();


	const selectedIndex = useRef();
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const [selectOptionsForMenu, setSelectOptionsForMenu] = useState([]);


	const [menuIdToMove, setMenuIdToMove] = useState();

	const [categoryList, setCategoryList] = useState();
	const [recommendedList, setRecommandedList] = useState([]);
	const [allPostList, setAllPostList] = useState([]);
	const [filteredPostList, setFilteredPostList] = useState([]);
	const [currentRecommendedListCategory, setCurrentRecommendedListCategory] = useState();

	const [selectedMenuId, setSelectedMenuId] = useState();
	const [filters, setFilters] = useState([]);
	const [sorters, setSorters] = useState([]);

	const [searchText, setSearchText] = useState();

	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [openPopOver, setOpenPopOver] = useState(false);
	const [movePopOver, setMovePopOver] = useState(false);

	const { error, info } = useMsg();

	useEffect(() => {
		reloadAll();
	}, []);

	useEffect(() => {
		setFilteredPostList(allPostList);
	}, [allPostList]);

	useEffect(() => {
	}, [recommendedList]);

	useEffect(() => {
		const { menu2Id, strategicMarketingOnly, openType } = filters;

		const list = allPostList?.filter((item) => {

			if (!isEmptyCheck(searchText)) {
				const s = searchText;

				if (!item.title?.includes(s)) {
					return false;
				}
			}

			if (!isEmptyCheck(menu2Id) && menu2Id.toString() !== item?.menu2Id.toString()) {
				return false;
			}

			//멀티 필터
			if (!isEmptyCheck(strategicMarketingOnly) && !Object.values(strategicMarketingOnly).includes(item?.strategicMarketingOnly)) {
				return false;
			}

			//멀티 필터
			if (!isEmptyCheck(openType) && !Object.values(openType).includes(item.openType)) {
				return false;
			}

			return true;
		});


		//조건 변경 시 선택된 행 해제
		setSelectedRowKeys([]);
		setFilteredPostList(list);

	}, [filters, searchText, allPostList]);

	const getSelectOptionsForMenu = async () => {
		setLoading(true);
		return await AXIOS.get(`/api/v1/admin/contents/category-selectbox`)
			.then((resp) => {
				resp.data.splice(0, 0, { value: '', label: '전체' });
				setSelectOptionsForMenu(resp.data);
				setLoading(false);
			})
			.catch((e) => {
				setSelectOptionsForMenu([]);
				error(e);
				setLoading(false);
			});
	};

	const getCategoryData = async () => {
		setLoading(true);
		return await AXIOS.get(`/api/v1/admin/contents/category`)
			.then((resp) => {
				setCategoryList(resp?.data);
				setLoading(false);
			})
			.catch((e) => {
				setCategoryList([]);
				error(e);
				setLoading(false);
			});
	};

	const getRecommendedData = async (param) => {
		setLoading(true);
		let postId = param;
		return await AXIOS.get(`/api/v1/admin/contents/recommend/post/${postId}`)
			.then((resp) => {
				setRecommandedList(resp?.data);
				setLoading(false);
			})
			.catch((e) => {
				setRecommandedList([]);
				error(e);
				setLoading(false);
			});
	};

	const getAllPostData = async () => {
		setLoading(true);
		return await AXIOS.get(`/api/v1/admin/contents/post`)
			.then((resp) => {
				setAllPostList(resp?.data);
				setLoading(false);
			})
			.catch((e) => {
				setAllPostList([]);
				error(e);
				setLoading(false);
			});
	};

	const deletePostData = async (items) => {
		const params = {
			data: items
		};

		setLoading(true);
		return await AXIOS.delete(`/api/v1/admin/contents/post`, params)
			.then(() => {
				info('삭제되었습니다.');
				setLoading(false);
				reloadAll();
			})
			.catch((e) => {
				error(e);
				setLoading(false);
				reloadAll();
			});
	};

	const updateRecommendedData = async (params) => {
		let paramObject = {
			postIdList: [],
			menuId: '',
		};
		paramObject.menuId = currentRecommendedListCategory;
		paramObject.postIdList = params.map(item => { return item.id });
		setEnableSaveButton(false);
		return await AXIOS.post(`/api/v1/admin/contents/recommend/post`, paramObject)
			.then(() => {
				info('추천목록이 저장 되었습니다.');
				setEnableSaveButton(true);
				getCategoryData();
				setLoading(false);
			})
			.catch((e) => {
				setEnableSaveButton(false);
				getCategoryData();
				error(e);
				setLoading(false);
			});
	};

	const movePostToCategory = async (params) => {
		let paramObject = {
			menuId: params.menuId,
			postIdList: params.posts ?? [],
		};

		setLoading(true);
		return await AXIOS.post(`/api/v1/admin/contents/post/move`, paramObject)
			.then(() => {

				info(`Post${selectedRowKeys.length > 1 ? '들을' : '를'} 이동하였습니다`);
				getCategoryData();
				getAllPostData();
				if (!isEmptyCheck(currentRecommendedListCategory)) {

					getRecommendedData(currentRecommendedListCategory);
				} else {

				};
				setLoading(false);

			})
			.catch((e) => {
				error(e);
				getCategoryData();
				getAllPostData();
				if (!isEmptyCheck(currentRecommendedListCategory)) {

					getRecommendedData(currentRecommendedListCategory);
				} else {

				};
				setLoading(false);

			});
	};

	const saveOpenType = async (params) => {
		let paramObject = {
			postId: params.id,
			openType: form.getFieldValue([params.id, 'openType'])
		};



		setLoading(true);
		return await AXIOS.post(`/api/v1/admin/contents/post/open-type/${paramObject.postId}`, paramObject)
			.then(() => {
				info('해당 Post 공개유형을 변경하였습니다.');
				getAllPostData();
				if (!isEmptyCheck(currentRecommendedListCategory)) {

					getRecommendedData(currentRecommendedListCategory);
				} else {

				};
				setLoading(false);

			})
			.catch((e) => {
				error(e);
				getAllPostData();
				setLoading(false);

			});
	};

	const reloadAll = () => {

		getSelectOptionsForMenu();
		getCategoryData();
		getAllPostData();
		setSearchText();
		setSelectedRowKeys();
		resetPagination();
		form.resetFields();

	};

	const resetPagination = () => {
		setPageCurrent(1);

	};


	const handleTableChange = (pagination, filters, sorter) => {

		setPageCurrent(pagination?.current ?? 1);
		setPageSize(pagination?.pageSize ?? 15);
		setFilters((prevFilter) => ({ ...prevFilter, strategicMarketingOnly: filters.strategicMarketingOnly, openType: filters.openType }));
		setSorters(sorter);
	};


	const onClickRecommendAdd = (e, record) => {
		e.stopPropagation();
		if (recommendedList.length < 5) {
			setRecommandedList([...recommendedList, record]);
		} else {
			error('5개까지만 등록 가능합니다.');
		}
	};

	const onClickRecommendRemove = (e, record) => {
		e.stopPropagation();
		let recommendedTemp = [...recommendedList];
		recommendedTemp.splice(recommendedTemp.findIndex((item) => item.id == record.id), 1);
		setRecommandedList(recommendedTemp);
	};

	useEffect(() => {

	}, [recommendedList]);

	const onClickRecommendedList = (e, value) => {

		//추천목록카테고리
		setCurrentRecommendedListCategory(value);

		//전체 목록을 추천 카테고리로 필터링
		handleChangeFilterContidion(value);

		//추천포스트 목록 세팅
		setRecommandedList([]);
		getRecommendedData(value);
		resetPagination();

		//검색어 초기화
		form.setFieldValue('searchText', null);
		handleInputSearchText();
		//저장버튼 활성
		setEnableSaveButton(true);
	};


	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const handleChangeFilterContidion = (value) => {

		setFilters({ menu2Id: value ?? '' });
		setSorters([]);

		//셀렉트 박스 값 세팅 - form.setfieldValue로 나중에 바꿀 수도, 현재는 그냥
		setSelectedMenuId(String(value).toString());
		form.setFieldValue('selectMenuId', String(value).toString());
	};



	const rowSelection = {
		selectedRowKeys,
		onChange: (keys, record) => onSelectChange(keys, record),
	};

	const onClickSwapRecommendPost = (index, direction) => {
		let recommendedTemp = [...recommendedList];
		if (direction == 'up') {

			[recommendedTemp[index], recommendedTemp[index - 1]] = [recommendedTemp[index - 1], recommendedTemp[index]];
		} else if (direction == 'down') {

			[recommendedTemp[index], recommendedTemp[index + 1]] = [recommendedTemp[index + 1], recommendedTemp[index]];
		}

		setRecommandedList(recommendedTemp);
	};

	const categoryColumns = [
		{
			title: '카테고리',
			dataIndex: 'menuNm',
			key: 'menuNm',
			width: '60%',
			onCell: (record) => {
				if (record.parentId == 0) {
					return {
						colSpan: 3,
					}
				};
				return {
					style: {
						background: getCellColorByDepth(String(record.level).toString()).color,
					},
				};
			},
			render: (text, record) => {
				return <>{record.parentId !== 0 ? <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : ''}{text}</>;
			},
		},
		{
			title: '등록',
			dataIndex: 'menuNm',
			key: 'menuNm',

			onCell: (record) => {
				if (record.parentId == 0) {
					return {
						colSpan: 0,
					};
				} else {

				}
			},
			render: (text, record) => {
				return <div >{record.postCount}</div>;;
			}
		},
		{
			title: '추천',
			dataIndex: 'recommendCount',
			key: 'recommendCount',
			width: '20%',
			onCell: (record) => {
				if (record.parentId == 0) {
					return {
						colSpan: 0,
					};
				} else {

				}
			},
			render: (text, record) => {
				return <div style={{ color: '#1890FF' }}>{record.recommendCount}</div>;
			}
		},
	];

	const recommendedColumns = [
		{
			title: <></>,
			dataIndex: '',
			key: 'updown',
			width: '4%',
			render: (text, record, index) => {
				if (recommendedList?.length > 1) {
					if (index == 0) {
						return <>
							<Row>
								<Col span={10}><CaretDownOutlined onClick={() => onClickSwapRecommendPost(index, 'down')} /></Col>
								<Col span={4}></Col>
								<Col span={10}><CaretUpOutlined /></Col>
							</Row>
						</>;
					} else if (index == recommendedList?.length - 1) {
						return <>
							<Row>
								<Col span={10}><CaretDownOutlined /></Col>
								<Col span={4}></Col>
								<Col span={10}><CaretUpOutlined onClick={() => onClickSwapRecommendPost(index, 'up')} /></Col>
							</Row>
						</>;
					} else {
						return <>
							<Row>
								<Col span={10}><CaretDownOutlined onClick={() => onClickSwapRecommendPost(index, 'down')} /></Col>
								<Col span={4}></Col>
								<Col span={10}><CaretUpOutlined onClick={() => onClickSwapRecommendPost(index, 'up')} /></Col>
							</Row>
						</>;
					}
				} else {
					return <>
						<Row>
							<Col span={10}><CaretDownOutlined /></Col>
							<Col span={4}></Col>
							<Col span={10}><CaretUpOutlined /></Col>
						</Row>
					</>;
				}
			}
		},
		{
			title: '번호',
			dataIndex: 'index',
			key: 'index',
			// width: 60,
			render: (text, record, index) => (index + 1)
		},
		{
			title: '추천일시',
			dataIndex: 'recommendAt',
			key: 'recommendAt',
			// width: 15,
			render: (text) => text ? text?.substr(0, 10) : dayjs().format('YYYY-MM-DD')
		},
		{
			title: '추천',
			dataIndex: 'recommend',
			key: 'recommend',
			// width: '2.5vw',
			render: (text, record) => (<CloseOutlined onClick={(e) => onClickRecommendRemove(e, record)} />)
		},
		{
			title: '카테고리 > 메뉴',
			dataIndex: 'menuNm',
			key: 'menuNm',
			ellipsis: true,
			// width: '11vw',
			render: (text, record) => {
				return record?.menuNm1 + ' > ' + record?.menuNm2;
			},
		},
		{
			title: '제목',
			dataIndex: 'title',
			key: 'title',
			ellipsis: true,
			width: 300,
			render: (text, record) => <StyledNavLink to={`/post/${record.id}`}>{text}</StyledNavLink>

		},
		// {
		// 	title: '',
		// 	dataIndex: '',
		// 	key: '',
		// 	width: '4.1vw',
		// 	render: (text, record) => {
		// 		return record.text ? <Tag color='red'>{'태그'}</Tag > : null;
		// 	}
		// },
		{
			title: '공개',
			dataIndex: 'openType',
			key: 'openType',
			// width: '5vw',
			render: (text, record) => {
				return <Tag color={getCellColorByType(String(record.openType).toString()).color}>
					{getCellColorByType(String(record.openType).toString()).label}
				</Tag>
			}
		},
		{
			title: 'view',
			dataIndex: 'viewCnt',
			key: 'viewCnt',
			// width: '4%',
		},
		{
			title: 'scrap',
			dataIndex: 'scrapCnt',
			key: 'scrapCnt',
			// width: '4%',
		},
		{
			title: 'share',
			dataIndex: 'shareCnt',
			key: 'shareCnt',
			// width: '4%',
		},
		{
			title: 'like',
			dataIndex: 'likesCnt',
			key: 'likesCnt',
			// width: '4%',
		},

	];

	const handlePopoverOpenChange = (newOpen) => {
		setOpenPopOver(newOpen);
	};

	const handleChangeOpenType = (e, record, operationType) => {

		e.preventDefault();
		e.stopPropagation();

		if (operationType === 'save') {
			saveOpenType(record);
		}

		if (operationType == 'cancel') {
			form.setFieldValue([record?.id, 'openType'], record?.openType);
		}
		setOpenPopOver(null);
	};


	const registeredColumns = [
		{
			title: '등록일시',
			dataIndex: 'createdAt',
			key: 'createdAt',
			// width: '5vw',
			sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
			sortOrder: sorters?.columnKey == 'createdAt' ? sorters.order : null,
			render: (text) => text.substr(0, 10)
		},
		{
			title: '추천',
			dataIndex: 'recommend',
			key: 'recommend',
			// width: '2.5vw',
			render: (text, record) => {
				if (record.menu2Id !== currentRecommendedListCategory) return;
				if (recommendedList?.length > 4) {
					if (recommendedList.findIndex((item) => item.id == record.id) !== -1) {
						return <></>;
					} else {
						return <Tooltip title={
							<>
								{`추천 포스트는 카테고리별`}<br />{`5개까지만 등록 가능합니다.`}
							</>
						}
						>
							<PlusOutlined disabled></PlusOutlined>
						</Tooltip>
					}
				} else {
					if (recommendedList.findIndex((item) => item.id == record.id) !== -1) {
						//추천존재
						return <></>;
					} else {

						return <PlusOutlined onClick={(e) => onClickRecommendAdd(e, record)} />;
					}
				}
			}
		},


		{
			title: '카테고리 > 메뉴',
			dataIndex: 'category',
			key: 'category',
			ellipsis: true,
			// width: '11vw',
			width: 200,
			render: (text, record) => {
				return record?.menuNm1 + ' > ' + record?.menuNm2;
			},
		},
		{
			title: '제목',
			dataIndex: 'title',
			key: 'title',
			ellipsis: true,
			// width: '20vw',
			width: 300,
			render: (text, record) => <StyledNavLink to={`/post/${record.id}`}>{text}</StyledNavLink>

		},

		{
			title: '공개',
			dataIndex: 'openType',
			key: 'openType',
			// width: '5vw',
			filters: [
				{
					text: '공개',
					value: 'public',
				},
				{
					text: '비공개',
					value: 'private',
				},
				{
					text: '임시',
					value: 'temp',
				},

			],


			filteredValue: filters?.openType || null,
			render: (text, record) => {
				return (
					<Popover
						placement='right'
						content={
							<>
								<ChangeOpenType item={record} form={form} />
								<Flex justify='flex-end' gap={5}>
									<Button size={'small'} onClick={(e) => { handleChangeOpenType(e, record, 'cancel') }}>취소</Button>
									<Button type='primary' size={'small'} onClick={(e) => { handleChangeOpenType(e, record, 'save') }}>저장</Button>
								</Flex>
							</>
						}
						title='공개설정변경'
						trigger='click'
						open={openPopOver && record.id == openPopOver ? true : false}
						onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenPopOver(record.id); }}
						onOpenChange={handlePopoverOpenChange}
					>
						<Tag color={getCellColorByType(String(record.openType).toString()).color}
							icon={<SettingOutlined />}
							style={{ cursor: 'pointer' }}>
							{getCellColorByType(String(record.openType).toString()).label}
						</Tag>
					</Popover >
				);
			}
		},
		{
			title: 'view',
			dataIndex: 'viewCnt',
			key: 'viewCnt',
			// width: '4.5%',
			sorter: (a, b) => a.viewCnt - b.viewCnt,
			sortOrder: sorters?.columnKey == 'viewCnt' ? sorters.order : null,
		},
		{
			title: 'scrap',
			dataIndex: 'scrapCnt',
			key: 'scrapCnt',
			// width: '4.5%',
			sorter: (a, b) => a.scrapCnt - b.scrapCnt,
			sortOrder: sorters?.columnKey == 'scrapCnt' ? sorters.order : null,
		},
		{
			title: 'share',
			dataIndex: 'shareCnt',
			key: 'shareCnt',
			// width: '4.5%',
			sorter: (a, b) => a.shareCnt - b.shareCnt,
			sortOrder: sorters?.columnKey == 'shareCnt' ? sorters.order : null,
		},
		{
			title: 'like',
			dataIndex: 'likesCnt',
			key: 'likesCnt',
			// width: '4.5%',
			sorter: (a, b) => a.likesCnt - b.likesCnt,
			sortOrder: sorters?.columnKey == 'likesCnt' ? sorters.order : null,
		},
	];

	const handleInputSearchText = (value) => {
		setSearchText(value);
	};

	//이동 팝오버 보임 설정
	const handleMoveOpenPopoverChange = (newOpen) => {

		setMenuIdToMove(null);
		setMovePopOver(newOpen);
	};

	const handleDeletePost = (items) => {
		deletePostData(items);
	};

	const breadcrumb = [
		{ title: 'Home' },
		{ title: '콘텐츠' },
		{ title: '포스트' },
	];

	return (
		<>
			<CustomAdminTitle title={'콘텐츠'} items={breadcrumb} />
			<InnerAdminDiv>

				<Flex gap={'large'}>
					<div >
						<Typography.Title level={5} style={{ margin: 0, padding: '8px 10px' }}>카테고리 & 포스트</Typography.Title>
						<StyledAdminTable
							rowKey={(row) => row?.id}
							loading={loading}
							dataSource={categoryList}
							size={'small'}
							// title={() => <Typography.Title level={5} style={{ padding: '8px 10px' }}>카테고리 & 포스트</Typography.Title>}
							columns={categoryColumns}
							pagination={
								{ position: ['none'] }
							}
							style={{ width: 280, marginTop: 24 }}
							expandable={{
								expandedRowKeys: categoryList?.map(o => o.id),
								expandIcon: () => <></>,
								showExpandColumn: false,
								defaultExpandAllRows: true,
								childrenColumnName: 'menuChildren'
							}}
							onRow={(record, index) => ({
								style: {
									background: index === selectedIndex.current ? 'rgba(255,0,0,0.12)' : '',
								},
								onClick: (e) => {
									if (record.parentId !== 0) {
										selectedIndex.current = index;
										onClickRecommendedList(e, record?.id, index);
									}
								},
							})}
						/>
					</div>
					<div>
						<Flex vertical justify={'space-between'} gap={'large'}>
							<Flex
								style={{ padding: '8px 10px' }}
							>
								<Col>
									<Typography.Title level={5} style={{ margin: 0 }}>추천 포스트</Typography.Title>
								</Col>
								<Col>(카테고리별 5개로 제한합니다.)</Col>
							</Flex>
							<StyledAdminTable
								rowKey={(row) => row?.id}
								loading={loading}
								dataSource={recommendedList}
								size={'small'}

								indentSize={0}
								columns={recommendedColumns}
								// title={() =>
								// 	<Flex style={{ padding: '8px 10px' }}>
								// 		<Col>
								// 			<Typography.Title level={5}>추천 포스트</Typography.Title>
								// 		</Col>
								// 		<Col>카테고리별 5개로 제한합니다.</Col>
								// 	</Flex>}
								pagination={
									{ position: ['none'] }
								}
							/>
							<Flex justify='flex-end' gap={8}>
								<Button size='large' onClick={() => currentRecommendedListCategory ? getRecommendedData(currentRecommendedListCategory) : null}>취소</Button>
								<Button size='large' type='primary' onClick={() => updateRecommendedData(recommendedList)} disabled={!enableSaveButton}>저장</Button>
							</Flex>

							<Divider />

							<Form form={form}>
								<Row gutter={8} style={{ padding: '8px 10px' }}>
									<Col span={12}>
										<Row>
											<Col span={16}>
												<Form.Item name={'selectMenuId'} initialValue={''} label="메뉴">
													<Select
														style={{ width: 140 }}
														options={selectOptionsForMenu}
														onSelect={(v) => handleChangeFilterContidion(v)}
													/>
												</Form.Item>
											</Col>
										</Row>
									</Col>
									<Col span={12} align="right">
										<Space size={'small'}>
											<Popover
												content={
													<>
														<Select
															placeholder='선택하세요.'
															options={selectOptionsForMenu.filter((item) => item.value !== '')}

															value={menuIdToMove ?? null}
															onSelect={(v, o) => { setMenuIdToMove(o); }}
														/>
														<Button onClick={() => { handleMoveOpenPopoverChange(false); }} >취소</Button>
														<Button
															disabled={menuIdToMove ? false : true}
															type='primary'
															onClick={() => {
																movePostToCategory({ menuId: menuIdToMove.value, posts: selectedRowKeys });
																handleMoveOpenPopoverChange(false);
															}}>확인</Button>
													</>}
												title='이동하실 메뉴를 선택 후 확인을 눌러주세요.'
												trigger={'click'}
												open={movePopOver}
												onOpenChange={handleMoveOpenPopoverChange}
											>
												<Button disabled={selectedRowKeys?.length > 0 ? false : true} danger type='primary'
												>이동</Button>
											</Popover>
											<Popconfirm
												title='포스트 삭제'
												description={<div>선택 Post를 <br />일괄 삭제 합니다.</div>}
												onConfirm={() => { handleDeletePost(selectedRowKeys); }}

												okText='예'
												okButtonProps={{ style: { width: '60px' } }}
												cancelText='아니오'
												calCelButtonProps={{ style: { width: '60px' } }}
											>
												<Button disabled={selectedRowKeys?.length > 0 ? false : true} type='primary' >삭제</Button>
											</Popconfirm>
											<Form.Item name='searchText'>
												<Input.Search placeholder='포스트 검색' onSearch={(v, e) => handleInputSearchText(v, e)} allowClear />
											</Form.Item>
										</Space>
									</Col>
								</Row>

								<StyledAdminTable
									rowKey={(row) => row?.id}
									loading={loading}
									dataSource={filteredPostList}
									size={'small'}

									indentSize={0}
									columns={registeredColumns}
									title={() => <></>}

									pagination={
										{
											position: ['bottomCenter'],
											showSizeChanger: true,
											defaultPageSize: 10,
											showLessItems: true,

											pageSizeOptions: ['10', '15', '30', '50'],
											current: pageCurrent,
											pageSize: pageSize
										}
									}
									rowSelection={rowSelection}
									onChange={handleTableChange}
								/>
							</Form>

						</Flex>
					</div>
				</Flex>
			</InnerAdminDiv>
		</ >
	);
};

const ChangeOpenType = (props) => {
	const { item, form } = props;

	useEffect(() => {
		form.setFieldValue([item.id, 'openType'], item.openType);
	}, []);

	return <div>
		<Flex justify='space-between' vertical gap={10}>
			<Row>여기서 공개설정 바꿉니다.</Row>
			<Row>
				<Form.Item name={[item?.id, 'openType']}>
					<Radio.Group size='small'>
						<Flex vertical>
							<Radio value={'public'}>공개</Radio>
							<Radio value={'private'}>비공개</Radio>
							<Radio value={'temp'}>임시</Radio>
						</Flex>
					</Radio.Group>
				</Form.Item>
			</Row>
		</Flex>
	</div>
};

export default AdminContentConfig;

