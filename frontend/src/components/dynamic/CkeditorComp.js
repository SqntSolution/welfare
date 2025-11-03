import { Input, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// import { dynamic_updateData } from 'atoms/atom';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { TheCkeditor } from 'components/common/TheCkeditor'
import styled from 'styled-components';

export const CkeditorComp = (props) => {
    const key2 = props?.key2
    const readonly = props?.readonly
    // const [data, setData] = useState(props?.data?.text);
    const [contents, setContents] = useState(props?.contents);
    // const [readonly, setReadonly] = useState(true);
    const [afterInit, setAfterInit] = useState(false);

    const callUpdateData = () => {
        const result = { key2: key2 }
        result.contents = contents;
        props?.updateData?.(result)
        // setTestDynamic(result)
    }

    useEffect(()=>{
        setContents(props?.contents)
    }, [props?.contents])

    useEffect(() => {
        // console.log("=== CkeditorComp props : ", props)
        setAfterInit(true)
    }, [])

    useEffect(() => {
        if (afterInit) {
            callUpdateData()
        }
    }, [contents])

    return (
        <>
         {/* <>ck editor component 영역 - {key2} - {JSON.stringify(props ?? {})} <br /> */}
            <TheCkeditor data={contents} setData={setContents} readonly={readonly} borderColor={props?.borderColor}/>
        </>
    )
}
