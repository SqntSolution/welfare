// 서브메인 페이비에서 중간에 있는 Administrator Custom Zone
import { TheCkeditor } from 'components/common/TheCkeditor'
import { AXIOS } from 'utils/axios';
import { useEffect, useState } from 'react';
import { errorMsg } from 'utils/helpers';
import { App, Divider, Popconfirm, Button, Row, Col, Flex } from 'antd';
import { CustomTitle, ErrorMsg } from 'components/common/CustomComps'
import { Link, Route, Switch, useNavigate, useParams, useLocation, } from "react-router-dom";
import { useMsg } from 'hooks/helperHook';
import { EditLine } from 'components/common/IconComponets';
import { useUserInfo } from 'hooks/useUserInfo'

export const SubmainCustomArea = () => {
    const [data, setData] = useState();
    const { menu1, menu2 } = useParams();
    const [readonly, setReadonly] = useState(true);
    const [loading, setLoading] = useState(false);
    const { notification } = App.useApp();
    const { error, info } = useMsg()
    const userInfo = useUserInfo()

    useEffect(() => {
        getContents()
        setReadonly(true)
    }, [menu1, menu2])

    const getContents = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/sub/custom-area/${menu1}/${menu2 ?? ''}`)
            .then((resp) => {
                const data = resp?.data
                setData(data?.result)
            })
            .catch((err) => {
                setData(null)
                console.log('=== getContents 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
            })
            .finally(() => setLoading(false));
    };

    const saveContents = () => {
        setLoading(true);
        const param = {}
        param.contents = data
        AXIOS.post(`/api/v1/user/sub/custom-area/${menu1}/${menu2 ?? ''}`, param)
            .then((resp) => {
                setReadonly(true)
                info("저장하였습니다.")
            })
            .catch((err) => {
                console.log('=== getContents 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 5 });
            })
            .finally(() => setLoading(false));
    };

    const onModifyButtonClick = () => {
        // 수정인지 저장인지 구분
        if (readonly) {
            setReadonly(false)
        } else {
            setReadonly(true)
            // console.log("=== save : ", data)
        }
    }

    return (
        <Row style={{ width: '100%', border: 0, marginBottom: 72 }} align="middle">
            {
                userInfo?.role == 'ROLE_OPERATOR' || userInfo?.role == 'ROLE_MASTER' ? (
                    <>
                        <Col span={12} align='left'>
                            <CustomTitle title='Administrator Custom Zone' />
                        </Col>
                        <Col span={12} align='end' style={{ paddingBottom: 20 }}>
                            {
                                userInfo?.role == 'ROLE_OPERATOR' || userInfo?.role == 'ROLE_MASTER' ? (
                                    readonly ? (
                                        <Button onClick={onModifyButtonClick}
                                            style={{
                                                width: 72,
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                                marginRight: 0,
                                                marginLeft: 'auto',
                                            }}
                                        >
                                            <EditLine /> 수정
                                        </Button>

                                    ) : (
                                        <Flex gap={8} justify='flex-end'>
                                            <Button onClick={()=>{setReadonly(true);getContents()}} >취소</Button>
                                            <Popconfirm
                                                title="저장"
                                                description="저장하시겠습니까?"
                                                onConfirm={saveContents}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button  type='primary'>등록</Button>
                                            </Popconfirm>
                                        </Flex>

                                    )
                                ) : (
                                    null
                                )

                            }
                        </Col>
                    </>
                ) : (
                    null
                )
            }


            {
                readonly && ((data ?? '') == '' || data == '<p>&nbsp;</p>') ? (
                    null
                ) : (
                    <Col span={24} >
                        <TheCkeditor data={data} setData={setData} readonly={readonly} minHeight='0px' />
                        <Divider />
                    </Col>
                )
            }
        </Row>
    )
}