// submain 페이지
import { useEffect, useState } from 'react';
import { message, Row } from 'antd';
import { AXIOS } from 'utils/axios';
import { errorMsg, isEmptyCheck } from 'utils/helpers';
import { useLocation, useNavigate } from "react-router-dom";
import { SmartFinderFilter } from './SmartFinderFilter';
import { SmartFinderResultPosts } from './SmartFinderResultPosts';
import qs from 'qs';
import { InnerDiv } from 'styles/StyledCommon';
import { useMsg } from 'hooks/helperHook';


export const SmartFinderPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchCondition, setSearchCondition] = useState({ pageNumber: 0, pageSize: 20 });
    const location = useLocation();
    const ofqs = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [dummy, setDummy] = useState(0);
    const [posts, setPosts] = useState([]);
    const [totalCnt, setTotalCnt] = useState(0);
    const { error, info } = useMsg();
    const [disabledComp, setDisabledComp] = useState(false);

    useEffect(() => {
        restoreFromQueryStr();
    }, [])

    useEffect(() => {
        restoreFromQueryStr();
        setDummy(prev => prev + 1);
    }, [location])

    useEffect(() => {
        if (dummy > 0) {
            onSearch();
        }
    }, [dummy])

    const restoreFromQueryStr = () => {
        //특수 필터인 경우 (recommended, monthly) 다른 파라미터는 무시
        const checkCondFilter = ['recommendOnly', 'monthlyOnly', 'pageSize', 'pageNumber'];
        const condFilter = ['recommendOnly', 'monthlyOnly']
        const condFilterLenght = condFilter.filter(key => ofqs?.hasOwnProperty(key))?.length > 0;
        const checkCond = condFilter.filter(key => ofqs?.hasOwnProperty(key)).length > 1 || Object.keys(ofqs)?.some(key => !checkCondFilter.includes(key));
        if (condFilterLenght && checkCond) navigate(`${location.pathname}`)

        //기존 필터 체크
        const keys = ['nations', 'topics', 'startDate', 'endDate', 'strategicMarketingOnly', 'order', 'keywords',
            'dataType', 'fileTypes', 'pageNumber', 'pageSize', 'tag', 'recommendOnly', 'monthlyOnly'];
        let newObj = { ...searchCondition };
        for (const k in ofqs) {
            if (keys.includes(k)) {
                newObj[k] = ofqs[k];
            }
        }
        setSearchCondition(newObj);
    };

    const onSearch = () => {
        setLoading(true);
        let apiUrl = '';
        if (ofqs?.recommendOnly?.toLocaleLowerCase() === 'y') {
            apiUrl = `/api/v1/user/smart-finder/recommend`
        } else if (ofqs?.monthlyOnly?.toLocaleLowerCase() === 'y') {
            apiUrl = `/api/v1/user/smart-finder/monthly`
        }
        // else if (ofqs?.tagOnly?.toLocaleLowerCase() === 'y') { //.hasOwnProperty('tag')) {
        //     apiUrl = `/api/v1/user/smart-finder/tag`
        // }
        else {
            apiUrl = ofqs?.dataType === 'file' ? '/api/v1/user/smart-finder/file' : '/api/v1/user/smart-finder/post';
        }
        AXIOS.get(apiUrl, { params: { ...ofqs, pageNumber: (ofqs?.pageNumber ?? 1) - 1, pageSize: ofqs?.pageSize ?? 20, tagOnly: undefined } })
            .then((res) => {
                setDisabledComp(ofqs?.recommendOnly?.toLocaleLowerCase() === 'y' || ofqs?.monthlyOnly?.toLocaleLowerCase() === 'y');
                const data = res?.data
                setPosts(data.content ?? [])
                setSearchCondition({ ...ofqs, pageNumber: ofqs?.pageNumber ?? 1, pageSize: ofqs?.pageSize ?? 20 }); //, tagOnly: ofqs?.hasOwnProperty('tag') });
                setTotalCnt(data?.totalElements ?? 0)
            })
            .catch((err) => {
                navigate(`${location.pathname}`)
                error(err);
            })
            .finally(() => setLoading(false));
    };


    const updateFunctions = {
        //국가별
        nations: (list) => {
            ofqs['nations'] = list?.join(',')
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //주제별
        topics: (list) => {
            ofqs['topics'] = list?.join(',')
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        }
        ,
        //기간
        dateConditions: (list) => {
            ofqs['startDate'] = list[0];
            ofqs['endDate'] = list[1];
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //데이터 타입
        dataTypeCondition: (list) => {
            ofqs['dataType'] = list;
            ofqs['fileTypes'] = undefined;
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //파일 타입
        fileTypeCondition: (list) => {
            ofqs['fileTypes'] = list?.join(',')
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //전마전용
        smOnly: (list) => {
            ofqs['strategicMarketingOnly'] = list ?? undefined
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //정렬
        order: (list) => {
            ofqs['order'] = list?.toLocaleLowerCase() ?? 'new'
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //페이지 사이즈
        pageSize: (list) => {
            ofqs['pageSize'] = list ?? 8
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //페이지 번호
        pageNumber: (list) => {
            ofqs['pageNumber'] = list ?? 0
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //검색어
        keyword: (list) => {
            ofqs['keywords'] = list?.join(',')
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`);
        },
        //태그
        tag: (list) => {
            ofqs['tag'] = list == '' ? undefined : list;
            ofqs['pageNumber'] = 1
            navigate(`${location.pathname}?${qs.stringify(ofqs)}`)
        },
        //추천포스트
        recommendOnly: (list) => {
            navigate(`${location.pathname}?${qs.stringify({
                recommendOnly: list,
            })}`)
        },
        //먼슬리
        monthlyOnly: (list) => {
            navigate(`${location.pathname}?${qs.stringify({
                monthlyOnly: list,
            })}`)
        },
    };

    //url 업데이트
    const updateUrl = (list, type) => {
        const updateFunction = updateFunctions[type];
        if (updateFunction) {
            updateFunction(list);
        }
    };


    return (
        <>
            <InnerDiv>
                <div style={{ width: '100%', padding: '24px 0' }}>
                    <SmartFinderFilter updateUrl={updateUrl} loading={loading} setLoading={setLoading} searchCondition={searchCondition} disabledComp={disabledComp} />
                </div>
            </InnerDiv>
            <Row style={{ width: '100%' }}>
                <SmartFinderResultPosts onSearch={onSearch} searchCondition={searchCondition} updateUrl={updateUrl} posts={posts} totalCnt={totalCnt} loading={loading} disabledComp={disabledComp} />
            </Row>
        </>
    )
}