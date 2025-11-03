import { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Select, Space } from 'antd';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { SUInner1280 } from "styles/StyledUser";
import { useForm } from "antd/es/form/Form";


export const QuoteInquiry = (props) => {
    const { form } = useForm();
    const [loading, setLoading] = useState(false);
    const { info, error } = useMsg();
    const [trafficSourceOptions, setTrafficSourceOptions] = useState([]);
    const [areaTypeOptions, setAreaTypeOptions] = useState([]);
    const [quoteDivsOptions, setQuoteDivsOptions] = useState([]);

    useEffect(() => {
        const commonData = async () => {
            await getGroupCode();
        }
        commonData();
    }, []);


    //공통코드 호출 
    const getGroupCode = async () => {
        setLoading(true);
        await AXIOS.get(`/api/v1/common/ref-render-multi/TRAFFIC_SOURCE,AREA_TYPE,QUOTE_DIVS`)
            .then((resp) => {
                const { TRAFFIC_SOURCE, AREA_TYPE, QUOTE_DIVS } = resp?.data;
                setTrafficSourceOptions(TRAFFIC_SOURCE);
                setAreaTypeOptions(AREA_TYPE);
                setQuoteDivsOptions(QUOTE_DIVS);
                setLoading(false);
            })
            .catch((err) => {
                error(err);
                setLoading(false);
            });
    };

    return (
        <SUInner1280>
            <div style={{ width: '480px', margin: '0 auto' }}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name={'name'}
                        label={'이름'}
                        required
                    >
                        <Input placeholder="이름을 입력해주세요" />
                    </Form.Item>
                    <Form.Item
                        name={'email'}
                        label={'이메일'}
                        required
                    >
                        <Input type="email" placeholder="이메일을 입력해주세요" />
                    </Form.Item>
                    <Form.Item
                        name={'phone'}
                        label={'연락처'}
                        required
                    >
                        <Input addonBefore={<Select placeholder="국가" options={[{ value: '+82', label: 'KR' }]} defaultValue={'+82'} />} type="tel" placeholder="전화번호를 입력해주세요" />
                    </Form.Item>
                    <Form.Item
                        name={'areaType'}
                        label={'면적 및 주거형태'}
                    >
                        <Input addonBefore={<Select placeholder="면적" popupMatchSelectWidth={false} options={areaTypeOptions ?? []} />} placeholder="주택, 아파트, 빌라" />
                    </Form.Item>
                    <Form.Item
                        name={'quoteDivs'}
                        label={'문의항목'}
                    >
                        <Select placeholder="문의항목을 선택해주세요" options={quoteDivsOptions ?? []} />
                    </Form.Item>
                    <Form.Item
                        name={'trafficSource'}
                        label={'방문경로'}
                    >
                        <Select options={trafficSourceOptions ?? []} />
                    </Form.Item>
                    <Form.Item
                        name={'inquiryContent'}
                        label={'문의내용'}
                        required
                    >
                        <Input.TextArea placeholder="문의내용을 작성해주세요" />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name={'agreePrivacy'}
                            required
                            noStyle
                            valuePropName="checked"
                        >
                            <Checkbox title="개인정보 수집 및 이용 동의">개인정보 수집 및 이용 동의</Checkbox>
                        </Form.Item>
                        <span>약관보기</span>
                    </Form.Item>
                    <Button disabled={loading}>등록하기</Button>
                    <Button type="text">취소</Button>
                </Form>
            </div>
        </SUInner1280 >
    );

}