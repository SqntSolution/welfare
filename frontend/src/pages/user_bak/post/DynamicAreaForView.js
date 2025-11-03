// 조회용

import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { CkeditorComp } from 'components/dynamic/CkeditorComp';
import { PdfviewerComp } from 'components/common/pdf/PdfviewerComp';
// import { dynamic_updateData, dynamic_mngComponent } from 'atoms/atom';

export const DynamicAreaForView = ({ postDetails }) => {
    // const [loading, setLoading] = useState(false);
    const [components, setComponents] = useState([])

    useEffect(() => {
        // console.log("====== setComponents")
        setComponents([])
        setComponents(postDetails)
    }, [postDetails])
    // const components = props?.postDetails ?? []

    // components의 예 =>  { key: key, label: label, children: component, data: data }
    // const [components, setComponents] = useState([])

    const buildComponent = (detailsType, props) => {
        props.readonly = true
        let component = null;
        if (detailsType == 'editor') {
            // console.log("=== props : ", props)
            component = <CkeditorComp {...props} borderColor={'transparent'} />
        } else if (detailsType == 'pdf') {
            component = <PdfviewerComp {...props} detailId={props?.id} readOnly={props?.readOnly} />
        } else {
            component = <Alert message="존재하지 않는 component" type="error" showIcon />
        }
        return component
    }


    useEffect(() => {
    }, [])


    return (
        <>
            {components?.length &&
                components?.map((elem, idx) => {
                    return (
                        <div
                            style={{
                                width: '100%',
                            }}
                            key={elem?.data?.id || idx}
                        >
                            {buildComponent(elem.detailsType, elem)}
                        </div>
                    )
                })
            }
        </>
    )
}