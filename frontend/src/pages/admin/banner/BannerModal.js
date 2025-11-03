import React, { useEffect, useState } from 'react';
import { TheCkeditor } from 'components/common/TheCkeditor'
import { Modal, Button, Form, Row, Col, Switch, App, Spin, Checkbox, ColorPicker, Space, DatePicker, Flex, Typography, Carousel } from 'antd';
import { AXIOS } from 'utils/axios';
import styled from 'styled-components';

export const BannerModal = (props) => {
    const { stateModal, setModal, form, imagePath, backGroundColor } = props

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (stateModal) {
            const formData = form?.getFieldsValue();
            imagePath ? formData.imagePath = imagePath : formData.imagePath = null
            !formData.colorCheck ? formData.backGroundColor = '#FFFFFF' : formData.backGroundColor = backGroundColor;
            setBanners([formData]);
        }
    }, [stateModal]);

    const handleOk = () => {
        setModal(false); // 모달 창 클로우즈
        setBanners([]);
    };

    const handleCancel = () => {
        setModal(false);
        setBanners([]);
    };


    return (
        <Spin spinning={loading}>
            <StyledModal
                // title="INSIGHT PREVIEW"
                width={'100%'}
                open={stateModal}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{
                    style: { display: 'none' }
                }}
                cancelButtonProps={{
                    style: { display: 'none' }
                }}
            >
                <Row justify='center' style={{
                    width: '100%',
                    // height: 100,
                    margin: '0 auto',
                    padding:0
                    // border: '1px solid #84a9ff',
                }}>
                    <Col style={{
                        width: '100%',
                        borderRadius: 0,
                        
                        // border: '1px solid #2a92f',
                    }} justify='center' align="middle">
                        <Carousel autoplay effect="fade" speed={500} style={{ width: '100%' }}>
                            {
                                banners?.map((elem, index) => (
                                    // <div key={elem.id} style={{backgroundImage:`${elem.imagePath}`, backgroundColor:`${elem.backgroundColor}`}}>
                                    <div key={index}>
                                        <div style={{ height: '320px',width:"100%", backgroundImage: `url(/api/v1/image/${elem.imagePath})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundColor: `${elem.backGroundColor}` }}>
                                            <div className='mainBanner_inner'
                                                style={{
                                                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', alignContent: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                <p style={{
                                                    width: '100%' ,
                                                    fontSize: '38px' ,
                                                    fontWeight: 700 ,
                                                    color: 'rgb(255, 255, 255)' ,
                                                    lineHeight: '46px' ,
                                                    marginBottom: '16px' ,
                                                }}
                                                >
                                                    {elem.title}
                                                </p>
                                                <p
                                                    style={{
                                                        width: '100%',
                                                        color: '#fff',
                                                        fontSize: '16px',
                                                        fontWeight: '400',
                                                        lineHeight: '24px',
                                                        marginBottom: '24px'
                                                    }}
                                                >
                                                    {elem.subTitle}
                                                </p>
                                                {
                                                    (elem.link != null && elem.link != '') ? (
                                                        <Button type="primary"  onClick={() => window.open(`${elem.link}`)}
                                                            style={{background:'rgba(235, 45, 43, 1)',borderRadius:2,fontSize: 16,}}
                                                            size='large'
                                                        > View </Button>
                                                    ) : (
                                                        null
                                                    )
                                                }
                                                {/* <br />title:{elem.title} , <br />subTitle:{elem.subTitle} , backgroundColor:{elem.backgroundColor}
                                            <br />imagePath:{elem.imagePath}, backgroundColor:{elem.backgroundColor}  <br />link:{elem.link} */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </Carousel>
                    </Col>
                </Row>
            </StyledModal>
        </Spin>
    );
}


const StyledModal = styled(Modal)`

    &{height: 100%; display:flex;  align-items: center; justify-content: center;padding:0;background-color: transparent;}
    &.ant-modal .ant-modal-content{background-color: transparent;box-shadow:none}
    &.ant-modal{max-width:100%;}
    &.ant-modal .ant-modal-content{padding:0; box-sizing: border-box; width: 100%;}
    &.ant-modal .ant-modal-close {
        left:50%;   
         transform: translateX(-50%); 
         color: #fff;
         top:calc((-36px - 26px));
    }
    &.ant-modal .ant-modal-close-x {
        width: 36px; height: 36px;
        border: 2px solid #fff;
        font-size: 18px;
        border-radius: 50%;
        font-weight: bold;
    }
    
`;