/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Checkbox, Radio, Select, Button, Pagination, Row, Col, Empty, Space, Spin, Input, Flex } from 'antd';
import { AppstoreFilled, UnorderedListOutlined, SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import { PostItemBig } from 'components/page/PostItemBig';
import { PostItemSmall } from 'components/page/PostItemSmall';
import { FileCardForm } from 'components/page/FileCardForm';
import { InnerDiv } from 'styles/StyledCommon';
import { CustomSearchInput } from 'components/common/CustomComps';
import styled from 'styled-components';
import { useUserInfo } from 'hooks/useUserInfo';

export const SmartFinderResultPosts = (props) => {
    const { searchCondition, updateUrl, posts, onSearch, totalCnt, loading, disabledComp } = props;
    const [bigView, setBigView] = useState(true); // 큰이미지로 볼지 여부
    const userInfo = useUserInfo();

    const pageSizeOptions = [
        { value: '8', label: '8 개' },
        { value: '12', label: '12 개' },
        { value: '16', label: '16 개' },
        { value: '20', label: '20 개' },
        { value: '40', label: '40 개' },
    ];

    const onChange = (page) => {
        updateUrl(page, 'pageNumber');
    };

    const onChangeStrategicMarketingOnly = (e) => {
        const smOnly = e.target.checked ? 'Y' : null;
        updateUrl(smOnly, 'smOnly');
    };

    const onChangeOrder = (e) => {
        const order = e.target.value;
        updateUrl(order, 'order');
    };

    const onChangePagesize = (value) => {
        updateUrl(value, 'pageSize');
    };

    const onSearchTextChanged = (value) => {
        updateUrl(value, 'keyword');
    };

    const onChangeRecommend = (e) => {
        const recommendOnly = e.target.checked ? 'Y' : undefined;
        updateUrl(recommendOnly, 'recommendOnly');
    };

    const onChangMonthly = (e) => {
        const monthlyOnly = e.target.checked ? 'Y' : undefined;
        updateUrl(monthlyOnly, 'monthlyOnly');
    };

    return (
        <>
            <div style={{ width: '100%', backgroundColor: '#FAFAFA', marginBottom: 72, padding: '16px 0' }}>
                <InnerDiv>
                    <Row style={{ width: '100%', margin: '0 auto' }} justify='center' align='middle' gutter={[0, 0]}>
                        <Col span={24} align='right'>
                            <Space>
                                {userInfo?.strategicMarketingGroupYn && (
                                    <Checkbox
                                        checked={searchCondition?.strategicMarketingOnly?.toLocaleLowerCase() === 'y'}
                                        onChange={onChangeStrategicMarketingOnly}
                                        disabled={disabledComp}>
                                        전략마케팅 전용
                                    </Checkbox>
                                )}
                                <Radio.Group onChange={onChangeOrder} value={searchCondition?.order?.toLocaleLowerCase() ?? 'new'} disabled={disabledComp}>
                                    <Radio value='new'>최신순</Radio>
                                    <Radio value='count'>
                                        {(searchCondition?.dataType?.toLocaleLowerCase() ?? 'post') === 'post' ? '조회수 높은순' : '다운로드 높은순'}
                                    </Radio>
                                </Radio.Group>

                                {(searchCondition?.dataType?.toLocaleLowerCase() ?? 'post') === 'post' ? (
                                    <>
                                        <UnorderedListOutlined
                                            style={{ fontSize: '18px', color: !bigView ? '#EB2D2B' : '#262626', height: 32 }}
                                            onClick={() => setBigView(!bigView)}
                                        />
                                        <AppstoreOutlined
                                            style={{ fontSize: '18px', color: bigView ? '#EB2D2B' : '#262626', height: 32, marginLeft: 8 }}
                                            onClick={() => setBigView(!bigView)}
                                        />
                                    </>
                                ) : (
                                    ''
                                )}
                                <Select
                                    options={pageSizeOptions}
                                    style={{ width: 72, fontSize: 14, height: 32, borderColor: '#D9D9D9', borderRadius: 2 }}
                                    defaultValue='20'
                                    value={`${searchCondition?.pageSize ?? 20}`}
                                    onChange={onChangePagesize}
                                    size='small'></Select>
                                <CustomSearchInput>
                                    <Select
                                        mode='tags'
                                        style={{ width: 350, }}
                                        placeholder='결과 내 검색'
                                        onChange={onSearchTextChanged}
                                        tokenSeparators={[',']}
                                        options={[]}
                                        value={searchCondition?.keywords?.split(',')?.filter((elem) => elem !== '')}
                                        allowClear
                                        disabled={disabledComp}
                                        open={false}
                                    />
                                    <Button
                                        style={{ border: 'none' }}
                                        type='primary'
                                        icon={<SearchOutlined />}
                                        onClick={onSearch}
                                        disabled={disabledComp}
                                    />
                                </CustomSearchInput>
                            </Space>
                        </Col>
                        <Col span={24} align="right">
                            <Flex justify='flex-end' gap={16} style={{ marginTop: 14, alignItems: 'center' }}>
                                <Checkbox
                                    checked={searchCondition?.recommendOnly?.toLocaleLowerCase() === 'y'}
                                    onChange={onChangeRecommend}
                                    disabled={searchCondition?.monthlyOnly?.toLocaleLowerCase() === 'y'}
                                    style={{ height: 'fit-content' }}>
                                    Recommend
                                </Checkbox>
                                <Checkbox
                                    checked={searchCondition?.monthlyOnly?.toLocaleLowerCase() === 'y'}
                                    onChange={onChangMonthly}
                                    disabled={searchCondition?.recommendOnly?.toLocaleLowerCase() === 'y'}
                                    style={{ height: 'fit-content' }}>
                                    Monthly Top View
                                </Checkbox>
                            </Flex>
                        </Col>
                    </Row>
                </InnerDiv>
            </div>

            <InnerDiv>
                <Spin spinning={loading}>
                    {(posts?.length ?? 0) > 0 ? (
                        <>
                            <Row
                                style={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                }}
                                justify='left'
                                align='middle'
                                gutter={[24, 24]}>
                                {
                                    //포스트인 경우
                                    (searchCondition?.dataType?.toLocaleLowerCase() ?? 'post') === 'post'
                                        ? bigView
                                            ? posts?.map((elem, idx) => {
                                                const items = {
                                                    id: elem?.id,
                                                    representativeImagePath: elem?.representativeImagePath,
                                                    menuName1: elem?.menuNm1,
                                                    menuName2: elem?.menuNm2,
                                                    menuEngName1: elem?.menuEngName1,
                                                    menuEngName2: elem?.menuEngName1,
                                                    viewCnt: elem?.viewCnt,
                                                    likes: elem?.userLikeYn,
                                                    scrapes: elem?.userScrapYn,
                                                    title: elem?.title,
                                                    description: elem?.description,
                                                    strategicMarketingOnly: elem?.strategicMarketingOnly,
                                                    likesCnt: elem?.likesCnt,
                                                    createdAt: elem?.createdAt,
                                                };
                                                return (
                                                    <StyledPostItemBig key={idx} span={6} className='subTagPosition'>
                                                        <PostItemBig {...items}></PostItemBig>
                                                    </StyledPostItemBig>
                                                );
                                            })
                                            : posts?.map((elem, idx) => {
                                                const items = {
                                                    id: elem?.id,
                                                    representativeImagePath: elem?.representativeImagePath,
                                                    menuName1: elem?.menuNm1,
                                                    menuName2: elem?.menuNm2,
                                                    menuEngName1: elem?.menuEngName1,
                                                    menuEngName2: elem?.menuEngName1,
                                                    viewCnt: elem?.viewCnt,
                                                    likes: elem?.userLikeYn,
                                                    scrapes: elem?.userScrapYn,
                                                    title: elem?.title,
                                                    description: elem?.description,
                                                    strategicMarketingOnly: elem?.strategicMarketingOnly,
                                                    likesCnt: elem?.likesCnt,
                                                    createdAt: elem?.createdAt,
                                                };
                                                return (
                                                    <Col key={idx} span={12}>
                                                        <PostItemSmall {...items}></PostItemSmall>
                                                    </Col>
                                                );
                                            })
                                        : null
                                }
                                {
                                    //파일인 경우
                                    (searchCondition?.dataType?.toLocaleLowerCase() ?? 'post') === 'file' ? <FileCardForm data={posts} /> : null
                                }
                            </Row>

                            <Col span={24}>
                                <Pagination
                                    defaultPageSize={8}
                                    defaultCurrent={0}
                                    total={totalCnt ?? 0}
                                    showSizeChanger={false}
                                    onChange={onChange}
                                    pageSize={searchCondition?.pageSize ?? 20}
                                    current={searchCondition?.pageNumber ?? 1}
                                    style={{ margin: '72px auto 0', textAlign: 'center' }}
                                />
                            </Col>
                        </>
                    ) : (
                        <Empty description='검색 결과가 없습니다.' />
                    )}
                </Spin>
            </InnerDiv>
        </>
    );
};

const StyledPostItemBig = styled(Col)`
    &&& .tagPosition {
        bottom: auto !;
    }
    &&& .ant-ribbon-corner {
        opacity: 1;
    }
`;
